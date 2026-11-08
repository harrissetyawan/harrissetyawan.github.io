// Cloudflare Worker: Zazzle search proxy + market analysis.
//
// Endpoint: GET /api/search?term=...&sortBy=...&department=...&pageSize=...&page=...
// Returns:  { products, topProduct, analysis, market, suggestions, source }
//
// The nested `parameters`/`properties` values must be encoded twice (Zazzle
// answers 403 otherwise). `URLSearchParams` performs the second encoding.

const ZAZZLE_ENDPOINT = 'https://www.zazzle.com/svc/z3/search/GetSearchWithProperties';

const DEFAULT_SORT = 'orderitemcount_month';
const DEFAULT_DEPARTMENT = '0';
const DEFAULT_PAGE_SIZE = 120;
const MIN_PAGE_SIZE = 1;
// Zazzle caps the page size at 120: requesting 200/240/1000 returns 120.
const MAX_PAGE_SIZE = 120;
const DEFAULT_PAGE = 1;
const MAX_PAGE = 50;
const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_CACHE_TTL_SECONDS = 60;

const RETRYABLE_STATUSES = new Set([403, 408, 425, 429, 500, 502, 503, 504]);
const RETRY_DELAYS_MS = [600, 1500];

const UPSTREAM_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.zazzle.com/',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

const KEYWORD_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is',
  'it', 'of', 'on', 'or', 'the', 'to', 'with', 'your', 'you', 'my', 'our',
  'their', 'his', 'her', 'this', 'that',
]);

const SKIPPED_FACETS = new Set([
  'store',
  'maker',
  'dynamic_facet_cyo_color',
  'dynamic_facet_design_color_group',
  'topic',
]);

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
    const page = clampPage(params.get('page'));

    const cacheTtl = parseCacheTtl(env.CACHE_TTL_SECONDS);
    const cacheKey = buildCacheKey(url, { term, sortBy, department, pageSize, page });

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

    const upstreamUrl = buildZazzleUrl({ term, sortBy, department, pageSize, page });
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
      const upstreamMessage = extractUpstreamError(data);
      return jsonResponse(
        {
          error: upstreamMessage
            ? `Zazzle API error: ${upstreamMessage}`
            : 'Invalid data structure from Zazzle API',
          code: 'invalid_upstream_structure',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    const payload = buildPayload(searchResults, data, { page, pageSize, sortBy });
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

export function buildZazzleUrl({ term, sortBy, department, pageSize, page = DEFAULT_PAGE }) {
  const parameters = [
    `st=${encodeURIComponent(sortBy)}`,
    `pg=${encodeURIComponent(page)}`,
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

// --- Payload assembly -------------------------------------------------------

export function buildPayload(searchResults, data = null, options = {}) {
  const products = Array.isArray(searchResults.products)
    ? searchResults.products.map(enrichProduct)
    : [];

  const topProduct =
    [...products].sort((a, b) => b.stats.sales - a.stats.sales)[0] || null;

  const keywordCounts = analyzeKeywords(products);
  const filters = extractFilters(searchResults);
  const departmentFacet = filters.find((filter) => filter.id === '__department');

  return {
    products,
    topProduct,
    analysis: {
      keywords: keywordCounts.words,
      keywordTags: keywordCounts.tags,
      stores: analyzeStores(products),
      productTypes: analyzeProductTypes(products),
      price: analyzePrices(products),
      badges: analyzeBadges(products),
      filters,
      categories: departmentFacet ? departmentFacet.values : [],
    },
    market: buildMarket(searchResults, products, options),
    suggestions: extractSuggestions(searchResults),
    source: buildSource(searchResults, data),
  };
}

// --- Product enrichment -----------------------------------------------------

function enrichProduct(product) {
  const safeProduct = product && typeof product === 'object' ? product : {};
  const price = toNumber(safeProduct.price);
  const sales = sumBadgeValues(safeProduct, 'BoughtXTimesInMonth', 'orderItemCount');
  const views = sumBadgeValues(safeProduct, 'XViewsInMonth', 'viewCount');
  const carts = sumBadgeValues(safeProduct, 'InXCarts', 'cartCount');
  const likes = sumBadgeValues(safeProduct, 'XLikesIn3Months', 'likeCount');
  const personalizations = sumBadgeValues(
    safeProduct,
    'PersonalizedXTimesInMonth',
    'personalizeCount'
  );
  const customizations = sumBadgeValues(
    safeProduct,
    'CustomizedXTimesInMonth',
    'customizeCount'
  );
  const conversionRate = views > 0 ? (sales / views) * 100 : 0;
  const bestSeller = findBadge(safeProduct, 'BestSeller');
  const has = (type) => Boolean(findBadge(safeProduct, type));

  return {
    ...safeProduct,
    stats: {
      sales,
      views,
      carts,
      likes,
      personalizations,
      customizations,
      conversionRate: round2(conversionRate),
      estimatedRevenue: round2(sales * price),
    },
    flags: {
      bestSeller: has('BestSeller'),
      bestSellerTier: bestSeller && bestSeller.tier ? bestSeller.tier : null,
      bestSellerScope: bestSeller && bestSeller.scope ? bestSeller.scope : null,
      editorsPick: has('EditorsPick'),
      popular: has('Popular'),
      easyToPersonalize: has('EasyToPersonalize'),
      officiallyLicensed: has('OfficiallyLicensed'),
      personalized: personalizations > 0 || has('PersonalizedXTimesInMonth'),
    },
  };
}

function getBadges(product) {
  return Array.isArray(product.badges) ? product.badges.filter(Boolean) : [];
}

function findBadge(product, type) {
  return getBadges(product).find((badge) => badge.type === type) || null;
}

function sumBadgeValues(product, type, key) {
  return getBadges(product)
    .filter((badge) => badge.type === type)
    .reduce((total, badge) => total + toNumber(badge[key]), 0);
}

// --- Analysis ---------------------------------------------------------------

function analyzeKeywords(products) {
  const tagCounts = {};
  const wordCounts = {};

  for (const product of products) {
    const tags = parseKeywordTags(product.keywords);
    for (const tag of tags) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      for (const word of tag.split(' ')) {
        if (word.length > 1 && !KEYWORD_STOP_WORDS.has(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      }
    }
  }

  return {
    tags: sortCounts(tagCounts),
    words: sortCounts(wordCounts),
  };
}

function parseKeywordTags(keywords) {
  if (typeof keywords !== 'string' || !keywords.trim()) {
    return [];
  }
  // Zazzle separates tags with spaces; words inside one tag use `+`.
  return keywords
    .trim()
    .split(/\s+/)
    .map((tag) => tag.replace(/\+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase())
    .filter(Boolean);
}

function analyzeProductTypes(products) {
  const map = {};
  const totalSales = products.reduce((sum, product) => sum + product.stats.sales, 0);

  for (const product of products) {
    const type = product.productType || 'unknown';
    if (!map[type]) {
      map[type] = {
        type,
        count: 0,
        totalSales: 0,
        estimatedRevenue: 0,
        totalPrice: 0,
      };
    }
    const entry = map[type];
    entry.count += 1;
    entry.totalSales += product.stats.sales;
    entry.estimatedRevenue += product.stats.estimatedRevenue;
    entry.totalPrice += toNumber(product.price);
  }

  return Object.values(map)
    .map((entry) => ({
      type: entry.type,
      count: entry.count,
      totalSales: entry.totalSales,
      estimatedRevenue: round2(entry.estimatedRevenue),
      averagePrice: round2(entry.count > 0 ? entry.totalPrice / entry.count : 0),
      salesShare: percent(entry.totalSales, totalSales),
    }))
    .sort((a, b) => b.count - a.count || b.totalSales - a.totalSales);
}

function analyzeStores(products) {
  const map = {};
  const totalSales = products.reduce((sum, product) => sum + product.stats.sales, 0);

  for (const product of products) {
    const name = product.storeName || 'Unknown Store';
    if (!map[name]) {
      map[name] = {
        name,
        storeId: product.storeId || null,
        storeHandle: product.storeHandle || null,
        storeImageUrl: product.storeImageUrl || null,
        productCount: 0,
        totalSales: 0,
        totalViews: 0,
        totalPrice: 0,
        estimatedRevenue: 0,
        topProductTitle: '',
        topProductSales: 0,
      };
    }
    const entry = map[name];
    entry.productCount += 1;
    entry.totalSales += product.stats.sales;
    entry.totalViews += product.stats.views;
    entry.totalPrice += toNumber(product.price);
    entry.estimatedRevenue += product.stats.estimatedRevenue;
    if (product.stats.sales > entry.topProductSales) {
      entry.topProductSales = product.stats.sales;
      entry.topProductTitle = product.titleSeo || '';
    }
  }

  return Object.values(map)
    .map((entry) => ({
      name: entry.name,
      storeId: entry.storeId,
      storeHandle: entry.storeHandle,
      storeImageUrl: entry.storeImageUrl,
      productCount: entry.productCount,
      totalSales: entry.totalSales,
      totalViews: entry.totalViews,
      estimatedRevenue: round2(entry.estimatedRevenue),
      averagePrice: round2(entry.productCount > 0 ? entry.totalPrice / entry.productCount : 0),
      conversionRate: entry.totalViews > 0
        ? round2((entry.totalSales / entry.totalViews) * 100)
        : 0,
      topProductTitle: entry.topProductTitle,
      topProductSales: entry.topProductSales,
      salesShare: percent(entry.totalSales, totalSales),
    }))
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue || b.totalSales - a.totalSales);
}

function analyzePrices(products) {
  const prices = products
    .map((product) => toNumber(product.price))
    .filter((price) => price > 0)
    .sort((a, b) => a - b);

  if (!prices.length) {
    return { min: 0, median: 0, average: 0, max: 0, buckets: [] };
  }

  const total = prices.reduce((sum, price) => sum + price, 0);
  const bucketDefs = [
    { label: 'Under $5', min: 0, max: 5 },
    { label: '$5 - $15', min: 5, max: 15 },
    { label: '$15 - $25', min: 15, max: 25 },
    { label: '$25 - $50', min: 25, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100+', min: 100, max: Infinity },
  ];

  return {
    min: round2(prices[0]),
    median: round2(median(prices)),
    average: round2(total / prices.length),
    max: round2(prices[prices.length - 1]),
    buckets: bucketDefs.map((bucket) => {
      const count = prices.filter(
        (price) => price >= bucket.min && (bucket.max === Infinity || price < bucket.max)
      ).length;
      return {
        label: bucket.label,
        min: bucket.min,
        max: Number.isFinite(bucket.max) ? bucket.max : null,
        count,
        share: percent(count, prices.length),
      };
    }),
  };
}

function analyzeBadges(products) {
  const count = (flag) => products.filter((product) => product.flags[flag]).length;
  return {
    bestSellers: count('bestSeller'),
    editorsPicks: count('editorsPick'),
    popular: count('popular'),
    easyToPersonalize: count('easyToPersonalize'),
    officiallyLicensed: count('officiallyLicensed'),
    personalized: count('personalized'),
  };
}

// --- Market metrics ---------------------------------------------------------

function buildMarket(searchResults, products, options = {}) {
  const numRecs = toNumber(searchResults.numRecs);
  const lastPageNum = toNumber(searchResults.lastPageNum);
  // Prefer what Zazzle actually used (it caps page size at 120).
  const pageSize = toNumber(searchResults.pageSize) || toNumber(options.pageSize);
  const page = toNumber(searchResults.pageNum) || toNumber(options.page) || DEFAULT_PAGE;
  const totalAnalyzed = products.length;

  const accessibleResults = lastPageNum > 0 && pageSize > 0
    ? (numRecs > 0 ? Math.min(numRecs, lastPageNum * pageSize) : lastPageNum * pageSize)
    : numRecs;

  const sales = products.map((product) => product.stats.sales).sort((a, b) => b - a);
  const totalSales = sales.reduce((sum, value) => sum + value, 0);
  const top10Sales = sales.slice(0, 10).reduce((sum, value) => sum + value, 0);
  const prices = analyzePrices(products);
  const personalized = products.filter((product) => product.flags.personalized).length;
  const withPromo = products.filter(
    (product) => typeof product.promoLabel === 'string' && product.promoLabel.trim()
  ).length;
  const bestSellers = products.filter((product) => product.flags.bestSeller).length;

  return {
    saturation: numRecs,
    accessibleResults: Math.round(accessibleResults),
    lastPageNum,
    page,
    pageSize,
    sortBy: searchResults.sortBy || options.sortBy || null,
    analyzedProducts: totalAnalyzed,
    totalSales,
    averageSales: totalAnalyzed > 0 ? round2(totalSales / totalAnalyzed) : 0,
    medianPrice: prices.median,
    top10SalesShare: percent(top10Sales, totalSales),
    personalizedShare: percent(personalized, totalAnalyzed),
    promoShare: percent(withPromo, totalAnalyzed),
    bestSellerShare: percent(bestSellers, totalAnalyzed),
  };
}

// --- Suggestions & filters --------------------------------------------------

function extractSuggestions(searchResults) {
  const groups = searchResults && searchResults.guidedSearch
    ? searchResults.guidedSearch.suggested
    : null;
  if (!Array.isArray(groups)) {
    return [];
  }

  const suggestions = [];
  const seen = new Set();

  for (const group of groups) {
    const groupType = group && group.groupType ? group.groupType : 'suggested';
    for (const chip of (group && group.chips) || []) {
      const name = String(chip.displayName || '').trim();
      const searchTerm = (
        termFromLinkKey(chip.linkKey) ||
        termFromAltText(chip.altText) ||
        name
      ).trim();
      const key = searchTerm.toLowerCase();
      if (!name || !searchTerm || seen.has(key)) {
        continue;
      }
      seen.add(key);
      suggestions.push({
        group: groupType,
        name,
        searchTerm,
        imageUrl: typeof chip.imageUrl === 'string' ? chip.imageUrl : '',
        altText: typeof chip.altText === 'string' ? chip.altText : '',
      });
    }
  }

  return suggestions;
}

function termFromLinkKey(linkKey) {
  if (typeof linkKey !== 'string') {
    return '';
  }
  const queryIndex = linkKey.indexOf('?');
  if (queryIndex === -1) {
    return '';
  }
  try {
    return new URLSearchParams(linkKey.slice(queryIndex + 1)).get('qs') || '';
  } catch (error) {
    return '';
  }
}

function termFromAltText(altText) {
  if (typeof altText !== 'string') {
    return '';
  }
  return altText.replace(/^search for\s+/i, '').trim();
}

function extractFilters(searchResults) {
  const facets = Array.isArray(searchResults.facets) ? searchResults.facets : [];
  return facets
    .filter((facet) => facet && facet.facetType)
    .filter((facet) => !SKIPPED_FACETS.has(facet.facetType))
    .map((facet) => ({
      id: facet.facetType,
      name: facet.displayName || facet.facetType,
      urlParam: facet.urlParam || null,
      multiSelect: Boolean(facet.isMultiSelect),
      values: (facet.values || [])
        .slice(0, 60)
        .map((value) => ({
          id: value && value.name != null ? String(value.name) : '',
          name: value && value.displayName ? String(value.displayName) : '',
        }))
        .filter((value) => value.id && value.name),
    }))
    .filter((facet) => facet.values.length)
    .slice(0, 12);
}

function buildSource(searchResults, data) {
  // Zazzle wraps its payload as `{ success, data: { absoluteUrl, ... } }`.
  // Accept both the envelope and an already-unwrapped object.
  const envelope = data && typeof data === 'object' ? data : {};
  const root = envelope.data && typeof envelope.data === 'object' ? envelope.data : envelope;
  return {
    absoluteUrl: root.absoluteUrl || searchResults.absoluteUrl || null,
    canonicalUrl: root.canonicalUrl || null,
    department: searchResults.parameters && searchResults.parameters.dp != null
      ? String(searchResults.parameters.dp)
      : null,
    originalTerm: searchResults.properties
      ? searchResults.properties.OriginalSearchTerm || null
      : null,
  };
}

// --- Helpers ----------------------------------------------------------------

function isSearchPath(pathname) {
  return /\/api\/search\/?$/.test(pathname) || pathname === '/' || pathname === '';
}

function buildCacheKey(url, { term, sortBy, department, pageSize, page }) {
  const key = new URL(url.origin);
  key.pathname = '/__cache/zazzle-search';
  key.searchParams.set('term', term);
  key.searchParams.set('sortBy', sortBy);
  key.searchParams.set('department', department);
  key.searchParams.set('pageSize', String(pageSize));
  key.searchParams.set('page', String(page));
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
  // Allow letters, digits, and the separators Zazzle uses
  // (e.g. `orderitemcount_month`, department ids).
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

function clampPage(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PAGE;
  }
  return Math.min(MAX_PAGE, Math.max(1, parsed));
}

function extractUpstreamError(data) {
  if (!data || typeof data !== 'object') {
    return '';
  }
  const candidate = data.message || data.error || (
    Array.isArray(data.errors) ? data.errors.join('; ') : ''
  );
  return typeof candidate === 'string' ? candidate.trim().slice(0, 200) : '';
}

function sortCounts(counts) {
  return Object.entries(counts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

function median(sortedValues) {
  const middle = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
    : sortedValues[middle];
}

function percent(part, total) {
  return total > 0 ? round2((part / total) * 100) : 0;
}

function round2(value) {
  return Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;
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
