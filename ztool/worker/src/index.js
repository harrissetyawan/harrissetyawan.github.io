// Cloudflare Worker: Zazzle search proxy + market analysis.
//
// Endpoint: GET /api/search?term=...&sortBy=...&department=...&pageSize=...&page=...
// Returns:  { products, topProduct, analysis, market, suggestions, source }
//
// The nested `parameters`/`properties` values must be encoded twice (Zazzle
// answers 403 otherwise). `URLSearchParams` performs the second encoding.

const ZAZZLE_ENDPOINT = 'https://www.zazzle.com/svc/z3/search/GetSearchWithProperties';
const ZAZZLE_REVIEWS_ENDPOINT = 'https://www.zazzle.com/svc/z3/reviews/get2';

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
// Reviews change slowly, so cache them much longer than search results.
const DEFAULT_REVIEWS_CACHE_TTL_SECONDS = 21600;
const REVIEWS_PAGE_SIZE = 100;
const MAX_REVIEWS_PAGES = 3;
const REVIEWS_PREVIEW_LIMIT = 12;
const REVIEWS_MEDIA_LIMIT = 8;
const MAX_MEDIA_PER_REVIEW = 4;

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

    if (isReviewsPath(url.pathname)) {
      return handleReviewsRequest(url, env, corsHeaders);
    }

    if (!isSearchPath(url.pathname)) {
      return jsonResponse(
        { error: 'Not found. Use GET /api/search?term=... or GET /api/reviews?productId=...' },
        404,
        corsHeaders
      );
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

// --- Reviews endpoint -------------------------------------------------------

async function handleReviewsRequest(url, env, corsHeaders) {
  const params = url.searchParams;
  const productId = sanitizeProductId(params.get('productId'));

  if (!productId) {
    return jsonResponse(
      { error: 'productId is required and must be a numeric Zazzle product id' },
      400,
      corsHeaders
    );
  }

  const productType = sanitizeToken(params.get('productType'), '');
  const pages = clampReviewsPages(params.get('pages'));
  const cacheTtl = parseCacheTtl(
    env.REVIEWS_CACHE_TTL_SECONDS,
    DEFAULT_REVIEWS_CACHE_TTL_SECONDS
  );
  const cacheKey = buildReviewsCacheKey(url, { productId, productType, pages });

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

  const timeoutMs = toPositiveInt(env.UPSTREAM_TIMEOUT_MS, DEFAULT_TIMEOUT_MS);
  const maxAttempts = toPositiveInt(env.UPSTREAM_MAX_ATTEMPTS, RETRY_DELAYS_MS.length + 1);
  const collected = [];
  let meta = null;
  let lastStatus = 200;

  for (let pageNum = 1; pageNum <= pages; pageNum += 1) {
    const upstreamUrl = buildZazzleReviewsUrl({ productId, productType, pageNum });
    let upstream;

    try {
      upstream = await fetchWithRetry(upstreamUrl, { timeoutMs, maxAttempts });
    } catch (error) {
      return jsonResponse(
        {
          error: `Could not reach Zazzle reviews: ${
            error && error.message ? error.message : 'network error'
          }`,
          code: 'upstream_network_error',
        },
        502,
        corsHeaders
      );
    }

    lastStatus = upstream.status;
    const rawText = await upstream.text();

    if (!upstream.ok) {
      const blocked = upstream.status === 403 || upstream.status === 429;
      return jsonResponse(
        {
          error: blocked
            ? `Zazzle blocked the reviews request (HTTP ${upstream.status}). Wait a minute and try again.`
            : `Zazzle reviews API returned status: ${upstream.status}`,
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
          error: 'Zazzle returned a reviews response that is not valid JSON',
          code: 'invalid_upstream_json',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    // Zazzle wraps the payload as { success, data: { reviews, entities } }.
    const root = data && typeof data === 'object' ? data : {};
    const reviewData =
      root.data && typeof root.data === 'object' ? root.data : root;
    const reviewBlock = reviewData && typeof reviewData === 'object' ? reviewData.reviews : null;
    const reviewEntities =
      reviewData &&
      reviewData.entities &&
      reviewData.entities.reviews &&
      typeof reviewData.entities.reviews === 'object'
        ? Object.values(reviewData.entities.reviews)
        : [];

    if (!reviewBlock && !reviewEntities.length) {
      return jsonResponse(
        {
          error: 'Invalid data structure from Zazzle reviews API',
          code: 'invalid_upstream_structure',
          upstreamStatus: upstream.status,
        },
        502,
        corsHeaders,
        { 'X-Upstream-Status': String(upstream.status) }
      );
    }

    if (!meta && reviewBlock) {
      meta = reviewBlock;
    }
    collected.push(...reviewEntities);

    // Zazzle returns at most 100 entities per page. A short page means we
    // reached the end of the accessible sample.
    if (reviewEntities.length < REVIEWS_PAGE_SIZE) {
      break;
    }
  }

  const payload = buildReviewsPayload({ meta, reviews: collected, productId, productType, pages });
  const response = jsonResponse(payload, 200, corsHeaders, {
    'X-Upstream-Status': String(lastStatus),
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
}

export function buildZazzleReviewsUrl({ productId, productType, pageNum = 1 }) {
  const url = new URL(ZAZZLE_REVIEWS_ENDPOINT);
  url.searchParams.set('cv', '1');
  url.searchParams.set('pageNum', String(pageNum));
  url.searchParams.set('pageSize', String(REVIEWS_PAGE_SIZE));
  if (productType) {
    url.searchParams.set('productType', productType);
  }
  url.searchParams.set('rootProductId', productId);
  // This is the only sort value Zazzle currently honours for this endpoint.
  url.searchParams.set('sortBy', 'MostRelevant');
  url.searchParams.set('client', 'js');
  return url.toString();
}

export function buildReviewsPayload({ meta, reviews, productId, productType, pages = 1 }) {
  const safeMeta = meta && typeof meta === 'object' ? meta : {};
  const stats = safeMeta.stats && typeof safeMeta.stats === 'object' ? safeMeta.stats : {};
  const normalized = (Array.isArray(reviews) ? reviews : [])
    .map(normalizeReview)
    .filter(Boolean);
  const targetId = productId != null ? String(productId) : '';
  const ownReviews = normalized.filter((review) => review.productId === targetId);

  const summary = {
    totalReviews: toNumber(
      safeMeta.totalResults != null ? safeMeta.totalResults : safeMeta.totalReviews
    ),
    averageRating: round2(toNumber(stats.averageRating)),
    percentRecommended: round2(toNumber(stats.percentRecommended) * 100),
    ratingBreakdown: normalizeRatingBreakdown(stats.ratingBreakdown),
    optionAverageRating: round2(toNumber(stats.optionAverageRating)),
    processAverageRating: round2(toNumber(stats.processAverageRating)),
    sampleSize: normalized.length,
  };

  const product = summarizeProductReviews(ownReviews, targetId);
  const preview = pickPreviewReviews(normalized, ownReviews, REVIEWS_PREVIEW_LIMIT);

  return {
    summary,
    product,
    reviews: preview,
    media: collectReviewMedia(preview, REVIEWS_MEDIA_LIMIT),
    meta: {
      productId: targetId,
      productType: productType || null,
      pages,
      sampled: normalized.length,
      upstreamTotal: summary.totalReviews,
    },
  };
}

function summarizeProductReviews(ownReviews, productId) {
  const ratingBreakdown = [0, 0, 0, 0, 0, 0];
  let ratingTotal = 0;
  let recommended = 0;
  let mediaCount = 0;
  let latestReviewDate = null;
  let reviewsLast90Days = 0;
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;

  for (const review of ownReviews) {
    const rating = Math.max(0, Math.min(5, Math.round(toNumber(review.rating))));
    ratingBreakdown[rating] += 1;
    ratingTotal += toNumber(review.rating);
    if (review.recommend) {
      recommended += 1;
    }
    mediaCount += review.media.length;
    if (review.date) {
      if (!latestReviewDate || review.date > latestReviewDate) {
        latestReviewDate = review.date;
      }
      const timestamp = Date.parse(review.date);
      if (Number.isFinite(timestamp) && timestamp >= cutoff) {
        reviewsLast90Days += 1;
      }
    }
  }

  const count = ownReviews.length;
  return {
    productId,
    ownReviewCount: count,
    averageRating: count > 0 ? round2(ratingTotal / count) : 0,
    percentRecommended: count > 0 ? round2((recommended / count) * 100) : 0,
    ratingBreakdown,
    latestReviewDate,
    reviewsLast90Days,
    mediaCount,
    sampled: count > 0,
  };
}

function normalizeReview(rawReview) {
  if (!rawReview || typeof rawReview !== 'object') {
    return null;
  }

  const product =
    rawReview.product && typeof rawReview.product === 'object' ? rawReview.product : {};
  const reviewer =
    rawReview.reviewer && typeof rawReview.reviewer === 'object' ? rawReview.reviewer : {};
  const mediaItems = Array.isArray(rawReview.mediaItems) ? rawReview.mediaItems : [];
  const combinedReview =
    typeof rawReview.combinedReview === 'string' ? rawReview.combinedReview.trim() : '';
  const optionReview =
    typeof rawReview.optionReview === 'string' ? rawReview.optionReview.trim() : '';

  return {
    id: rawReview.id != null ? String(rawReview.id) : '',
    productId: rawReview.productId != null ? String(rawReview.productId) : '',
    rating: toNumber(rawReview.rating),
    recommend: Boolean(rawReview.recommend),
    title: truncateText(rawReview.title, 200),
    text: truncateText(combinedReview || optionReview, 600),
    date: truncateText(rawReview.dateCreated, 40),
    reviewerName: truncateText(reviewer.name, 80),
    reviewerType: truncateText(reviewer.type, 40),
    isCreatorReview: Boolean(rawReview.isReviewByCreator),
    isReviewProgram: Boolean(rawReview.isZazzleReviewProgram),
    productTitle: truncateText(product.title, 200),
    productLinkUrl: typeof product.linkUrl === 'string' ? product.linkUrl.trim() : '',
    productImageUrl: typeof product.imageUrl === 'string' ? product.imageUrl.trim() : '',
    media: mediaItems
      .slice(0, MAX_MEDIA_PER_REVIEW)
      .map(normalizeReviewMedia)
      .filter(Boolean),
  };
}

function normalizeReviewMedia(rawMedia) {
  if (!rawMedia || typeof rawMedia !== 'object') {
    return null;
  }
  const thumbnailUrl =
    typeof rawMedia.thumbnailUrl === 'string' ? rawMedia.thumbnailUrl.trim() : '';
  const fullUrl = typeof rawMedia.url === 'string' ? rawMedia.url.trim() : '';
  if (!thumbnailUrl && !fullUrl) {
    return null;
  }
  return {
    thumbnailUrl,
    url: fullUrl || thumbnailUrl,
    isVideo: Boolean(rawMedia.isVideo),
  };
}

function pickPreviewReviews(reviews, ownReviews, limit) {
  const byDateDesc = (left, right) =>
    (Date.parse(right.date) || 0) - (Date.parse(left.date) || 0);
  const ownIds = new Set(ownReviews.map((review) => review.id));
  const ownSorted = [...ownReviews].sort(byDateDesc);
  const relatedSorted = reviews
    .filter((review) => !ownIds.has(review.id))
    .sort(byDateDesc);
  return [...ownSorted, ...relatedSorted]
    .slice(0, limit)
    .map((review) => ({ ...review }));
}

function collectReviewMedia(reviews, limit) {
  const seen = new Set();
  const media = [];

  for (const review of reviews) {
    for (const item of review.media) {
      const key = item.url || item.thumbnailUrl;
      if (!key || seen.has(key)) {
        continue;
      }
      seen.add(key);
      media.push({
        ...item,
        productTitle: review.productTitle,
        reviewId: review.id,
      });
      if (media.length >= limit) {
        return media;
      }
    }
  }

  return media;
}

function normalizeRatingBreakdown(rawBreakdown) {
  const values = Array.isArray(rawBreakdown) ? rawBreakdown : [];
  return [0, 1, 2, 3, 4, 5].map((index) => Math.max(0, toNumber(values[index])));
}

function truncateText(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1)}…` : trimmed;
}

function sanitizeProductId(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  return /^\d{6,20}$/.test(trimmed) ? trimmed : '';
}

function clampReviewsPages(value) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 1;
  }
  return Math.min(MAX_REVIEWS_PAGES, parsed);
}

function buildReviewsCacheKey(url, { productId, productType, pages }) {
  const key = new URL(url.origin);
  key.pathname = '/__cache/zazzle-reviews';
  key.searchParams.set('productId', productId);
  if (productType) {
    key.searchParams.set('productType', productType);
  }
  key.searchParams.set('pages', String(pages));
  return key.toString();
}

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
  // Platform-wide promo labels are not useful for niche analysis; drop them.
  const { promoLabel: _promoLabel, ...productFields } = safeProduct;

  return {
    ...productFields,
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

function isReviewsPath(pathname) {
  return /\/api\/reviews\/?$/.test(pathname);
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

function parseCacheTtl(value, fallback = DEFAULT_CACHE_TTL_SECONDS) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (parsed === 0) {
    return 0;
  }
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
