// Cloudflare Worker: Zazzle search proxy + analysis.
//
// Endpoint: GET /api/search?term=...&sortBy=...&department=...&pageSize=...
// Returns:  { products, topProduct, analysis, market }
//
// This mirrors the original /api/search.js Vercel handler, but uses the
// Workers Request/Response API and fixes the nested query encoding that
// Zazzle requires. Zazzle rejects the outer `parameters`/`properties`
// values when they are only single-encoded (HTTP 403).

const ZAZZLE_ENDPOINT = 'https://www.zazzle.com/svc/z3/search/GetSearchWithProperties';

const DEFAULT_SORT = 'orderitemcount_month';
const DEFAULT_DEPARTMENT = '0';
const DEFAULT_PAGE_SIZE = 120;
const MIN_PAGE_SIZE = 1;
const MAX_PAGE_SIZE = 240;
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_CACHE_TTL_SECONDS = 60;

// Zazzle's bot protection intermittently returns 403 for otherwise valid
// requests. A single short retry gets through often enough to matter.
const RETRYABLE_STATUSES = new Set([403, 408, 425, 429, 500, 502, 503, 504]);
const RETRY_DELAYS_MS = [600, 1500];

const UPSTREAM_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.zazzle.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

export default {
  async fetch(request, env = {}) {
    const url = new URL(request.url);
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const corsHeaders = buildCorsHeaders(allowedOrigin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'GET') {
      return jsonResponse(
        { error: 'Method not allowed. Use GET.' },
        405,
        corsHeaders,
        { Allow: 'GET, OPTIONS' }
      );
    }

    if (!isSearchPath(url.pathname)) {
      return jsonResponse({ error: 'Not found. Use GET /api/search?term=...' }, 404, corsHeaders);
    }

    const params = url.searchParams;
    const term = (params.get('term') || '').trim();

    if (!term) {
      return jsonResponse({ error: 'Search term is missing' }, 400, corsHeaders);
    }

    const sortBy = sanitizeToken(params.get('sortBy'), DEFAULT_SORT);
    const department = sanitizeToken(params.get('department'), DEFAULT_DEPARTMENT);
    const pageSize = clampPageSize(params.get('pageSize'));

    const cacheTtl = parseCacheTtl(env.CACHE_TTL_SECONDS);
    const cacheKey = buildCacheKey(url, { term, sortBy, department, pageSize });

    if (cacheTtl > 0 && typeof caches !== 'undefined' && caches.default) {
      try {
        const cached = await caches.default.match(cacheKey);
        if (cached) {
          return cached;
        }
      } catch (error) {
        // Cache failures should never break the request.
      }
    }

    const upstreamUrl = buildZazzleUrl({ term, sortBy, department, pageSize });
    const timeoutMs = toPositiveInt(env.UPSTREAM_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
    const maxAttempts = toPositiveInt(env.UPSTREAM_MAX_ATTEMPTS, RETRY_DELAYS_MS.length + 1);

    let upstream;
    try {
      upstream = await fetchWithRetry(upstreamUrl, { timeoutMs, maxAttempts });
    } catch (error) {
      return jsonResponse(
        {
          error: `Could not reach Zazzle: ${error && error.message ? error.message : 'network error'}`,
          code: 'upstream_network_error',
        },
        502,
        corsHeaders
      );
    }

    const rawText = await upstream.text();

    if (!upstream.ok) {
      const blocked = upstream.status === 403 || upstream.status === 429;
      return jsonResponse(
        {
          error: blocked
            ? `Zazzle blocked the request (HTTP ${upstream.status}). Wait a minute and try again, or use a different search term.`
            : `Zazzle API returned status: ${upstream.status}`,
          code: blocked ? 'upstream_blocked' : 'upstream_error',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      return jsonResponse(
        {
          error: 'Zazzle returned a response that is not valid JSON',
          code: 'invalid_upstream_json',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    const searchResults =
      data && data.success !== false && data.data && data.data.search
        ? data.data.search.searchResultsData
        : null;

    if (!searchResults || !Array.isArray(searchResults.products)) {
      return jsonResponse(
        {
          error: 'Invalid data structure from Zazzle API',
          code: 'invalid_upstream_structure',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    const payload = buildPayload(searchResults);
    const response = jsonResponse(payload, 200, corsHeaders, {
      'X-Upstream-Status': String(upstream.status),
    });

    if (cacheTtl > 0) {
      const cacheable = new Response(response.body, response);
      cacheable.headers.set('Cache-Control', `public, max-age=${cacheTtl}`);
      if (typeof caches !== 'undefined' && caches.default) {
        try {
          await caches.default.put(cacheKey, cacheable.clone());
        } catch (error) {
          // Cache failures should never break the request.
        }
      }
      return cacheable;
    }

    return response;
  },
};

// --- Zazzle request building ------------------------------------------------

export function buildZazzleUrl({ term, sortBy, department, pageSize }) {
  const parameters = [
    `st=${encodeURIComponent(sortBy)}`,
    'pg=1',
    'sd=desc',
    `qs=${encodeURIComponent(term)}`,
  ].join('&');

  const properties = [
    'LightProductObjects=false',
    'Maturity=G',
    'IsPublic=true',
    'ShowFullSearchPages=false',
    'LookAheadPages=16',
    'LimitTypesInSearch=true',
    'MaxStoresPerPage=6',
    'IsHumanSearch=false',
    `UserDefaultPageSize=${encodeURIComponent(pageSize)}`,
    'GetAggregations=true',
    'LegoStoreAggregation=false',
    'LegoStoreCategoryAggregation=false',
    'UseCYOSearch=false',
    'IgnoreCYOManual=false',
    'GetGuidedSearch=true',
    'IsBestSellerSearch=true',
    'EnablePriceFilter=false',
    'MinPrice=0',
    'MaxPrice=0',
    'ProductLimit=1',
    'DiversityMinScoreFactor=-1',
    'DiversityLimitWindowSize=16',
    `ProductDepartmentUrl=${encodeURIComponent(department)}`,
    'IsBestGuessSearch=false',
    'EnableNLS=false',
  ].join('&');

  const url = new URL(ZAZZLE_ENDPOINT);
  // URLSearchParams encodes these values again, turning the inner `%20`
  // into `%2520`. That double encoding is what Zazzle expects.
  url.searchParams.set('cv', '1');
  url.searchParams.set('diffParameters', 'st,pg,sd,qs');
  url.searchParams.set('diffProperties', 'ProductSearchTopIds');
  url.searchParams.set('parameters', parameters);
  url.searchParams.set('properties', properties);
  url.searchParams.set('type', 'SearchResultsData');
  url.searchParams.set('client', 'js');
  return url.toString();
}

async function fetchWithRetry(url, { timeoutMs, maxAttempts }) {
  let lastResponse;
  let lastError;
  const maxRetries = Math.max(0, maxAttempts - 1);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: UPSTREAM_HEADERS,
        signal: controller.signal,
      });

      if (!RETRYABLE_STATUSES.has(response.status) || attempt === maxRetries) {
        return response;
      }

      lastResponse = response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) {
        throw error;
      }
    } finally {
      clearTimeout(timer);
    }

    await sleep(RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)]);
  }

  if (lastResponse) {
    return lastResponse;
  }
  throw lastError || new Error('Upstream request failed');
}

// --- Product analysis (parity with the old Vercel handler) ------------------

export function buildPayload(searchResults) {
  const enrichedProducts = searchResults.products.map(enrichProduct);
  const topProduct =
    [...enrichedProducts].sort((a, b) => b.stats.sales - a.stats.sales)[0] || null;

  return {
    products: enrichedProducts,
    topProduct,
    analysis: {
      keywords: analyzeKeywords(enrichedProducts),
      stores: analyzeStores(enrichedProducts),
      productTypes: analyzeProductTypes(enrichedProducts),
    },
    market: {
      saturation: toNumber(searchResults.numRecs),
    },
  };
}

function enrichProduct(product) {
  const sales = toNumber(getBadgeValue(product, 'BoughtXTimesInMonth', 'orderItemCount'));
  const views = toNumber(getBadgeValue(product, 'XViewsInMonth', 'viewCount'));
  const carts = toNumber(getBadgeValue(product, 'InXCarts', 'cartCount'));
  const conversionRate = views > 0 ? (sales / views) * 100 : 0;

  return {
    ...product,
    stats: { sales, views, carts, conversionRate },
  };
}

function getBadgeValue(product, badgeType, valueKey) {
  if (!product || !Array.isArray(product.badges) || !product.badges.length) {
    return null;
  }
  const badge = product.badges.find((item) => item && item.type === badgeType);
  return badge ? badge[valueKey] : null;
}

function analyzeKeywords(products) {
  const counts = {};
  for (const product of products) {
    if (typeof product.keywords !== 'string' || !product.keywords) {
      continue;
    }
    for (const rawKeyword of product.keywords.split('+')) {
      const keyword = rawKeyword.trim();
      if (keyword) {
        counts[keyword] = (counts[keyword] || 0) + 1;
      }
    }
  }
  return Object.entries(counts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count);
}

function analyzeStores(products) {
  const stores = {};
  for (const product of products) {
    const storeName = product.storeName || 'Unknown Store';
    if (!stores[storeName]) {
      stores[storeName] = { name: storeName, productCount: 0, totalSales: 0, totalPrice: 0 };
    }
    stores[storeName].productCount += 1;
    stores[storeName].totalPrice += toNumber(product.price);
    stores[storeName].totalSales += product.stats.sales;
  }
  return Object.values(stores)
    .map((store) => ({
      ...store,
      averagePrice: store.productCount > 0 ? store.totalPrice / store.productCount : 0,
    }))
    .sort((a, b) => b.totalSales - a.totalSales);
}

function analyzeProductTypes(products) {
  const counts = {};
  for (const product of products) {
    if (product.productType) {
      counts[product.productType] = (counts[product.productType] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
}

// --- Helpers ----------------------------------------------------------------

function isSearchPath(pathname) {
  return /\/api\/search\/?$/.test(pathname) || pathname === '/' || pathname === '';
}

function buildCacheKey(url, { term, sortBy, department, pageSize }) {
  const key = new URL(url.origin);
  key.pathname = '/__cache/zazzle-search';
  key.searchParams.set('term', term);
  key.searchParams.set('sortBy', sortBy);
  key.searchParams.set('department', department);
  key.searchParams.set('pageSize', String(pageSize));
  return key.toString();
}

function sanitizeToken(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 120) {
    return fallback;
  }
  // Allow letters, digits, and the separators Zazzle uses (e.g. `orderitemcount_month`).
  if (!/^[A-Za-z0-9_.:-]+$/.test(trimmed)) {
    return fallback;
  }
  return trimmed;
}

function clampPageSize(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PAGE_SIZE;
  }
  return Math.min(MAX_PAGE_SIZE, Math.max(MIN_PAGE_SIZE, parsed));
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseCacheTtl(value) {
  if (value === undefined || value === null || value === '') {
    return DEFAULT_CACHE_TTL_SECONDS;
  }
  const parsed = Number.parseInt(value, 10);
  if (parsed === 0) {
    return 0;
  }
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CACHE_TTL_SECONDS;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildCorsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(body, status, corsHeaders, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders,
      ...extraHeaders,
    },
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
