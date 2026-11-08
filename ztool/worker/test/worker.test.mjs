import test from 'node:test';
import assert from 'node:assert/strict';

import worker, { buildPayload, buildZazzleUrl } from '../src/index.js';

const BASE_ENV = {
  CACHE_TTL_SECONDS: '0',
  UPSTREAM_MAX_ATTEMPTS: '1',
};

function makeRequest(query = 'term=wedding', path = '/api/search') {
  return new Request(`https://worker.example.dev${path}?${query}`, { method: 'GET' });
}

function mockUpstream(payload, status = 200) {
  return new Response(
    typeof payload === 'string' ? payload : JSON.stringify(payload),
    { status, headers: { 'Content-Type': 'application/json' } }
  );
}

function sampleZazzleResponse() {
  return {
    success: true,
    data: {
      absoluteUrl: 'https://www.zazzle.com/boho+wedding',
      canonicalUrl: 'https://www.zazzle.com/boho+wedding',
      search: {
        searchResultsData: {
          numRecs: 12345,
          lastPageNum: 9,
          pageNum: 1,
          pageSize: 120,
          sortBy: 'orderitemcount_month',
          parameters: {
            st: 'orderitemcount_month',
            qs: 'boho wedding',
            dp: '252536702459719117',
          },
          properties: { OriginalSearchTerm: 'boho wedding' },
          guidedSearch: {
            suggested: [
              {
                groupType: 'tags',
                chips: [
                  {
                    displayName: 'Pet',
                    altText: 'Search for boho wedding Pet',
                    linkKey: 'pd/find?qs=boho%20wedding%20pet&pg=1',
                    imageUrl: 'https://img.example/pet.jpg',
                  },
                  {
                    displayName: 'Rustic',
                    altText: 'Search for boho wedding Rustic',
                    imageUrl: 'https://img.example/rustic.jpg',
                  },
                  {
                    displayName: 'Pet',
                    altText: 'Search for boho wedding Pet',
                    linkKey: 'pd/find?qs=boho%20wedding%20pet',
                  },
                ],
              },
              {
                groupType: 'product_recipient',
                chips: [
                  {
                    displayName: 'For her',
                    altText: 'Search for boho wedding For her',
                    linkKey: 'pd/find?qs=boho%20wedding%20for%20her',
                  },
                ],
              },
            ],
          },
          facets: [
            {
              facetType: '__department',
              displayName: 'Refine by Category',
              urlParam: 'dp',
              isMultiSelect: false,
              values: [
                { displayName: 'Weddings', name: '252473910063999984' },
                { displayName: 'Home & Living', name: '252283360970275166' },
              ],
            },
            {
              facetType: 'dynamic_facet_price_us_usd',
              displayName: 'Price',
              urlParam: 'f_pr',
              isMultiSelect: true,
              values: [{ displayName: 'Under $5', name: 'p1' }],
            },
            {
              facetType: 'store',
              displayName: 'Creator Store',
              urlParam: 'f_si',
              values: [{ displayName: 'Store A', name: 's1' }],
            },
          ],
          products: [
            {
              id: 'a',
              titleSeo: 'Product A',
              storeName: 'Store A',
              storeHandle: 'StoreA',
              storeId: 'sa',
              storeImageUrl: 'https://img.example/sa.jpg',
              price: '10.00',
              productType: 'Mug',
              keywords: 'wedding+gift+boho',
              promoLabel: 'Save 15% with code TEST',
              badges: [
                { type: 'BoughtXTimesInMonth', orderItemCount: '40' },
                { type: 'XViewsInMonth', viewCount: '1000' },
                { type: 'InXCarts', cartCount: '12' },
                { type: 'XLikesIn3Months', likeCount: '5' },
                { type: 'PersonalizedXTimesInMonth', personalizeCount: '8' },
                { type: 'BestSeller', tier: 'Medium', scope: 'Department' },
                { type: 'EditorsPick' },
              ],
            },
            {
              id: 'b',
              titleSeo: 'Product B',
              storeName: 'Store A',
              price: 20,
              productType: 'Shirt',
              keywords: 'wedding+gift',
              badges: [
                { type: 'BoughtXTimesInMonth', orderItemCount: 10 },
                { type: 'XViewsInMonth', viewCount: 100 },
                { type: 'PersonalizedXTimesInMonth', personalizeCount: 2 },
                { type: 'Popular', viewCount: 100 },
              ],
            },
            {
              id: 'c',
              titleSeo: 'Product C',
              storeName: 'Store B',
              price: 5,
              productType: 'Mug',
              keywords: '',
              badges: [],
            },
          ],
        },
      },
    },
  };
}

test('buildZazzleUrl double-encodes nested parameters and includes page', () => {
  const url = new URL(
    buildZazzleUrl({
      term: 'boho wedding',
      sortBy: 'orderitemcount_month',
      department: '0',
      pageSize: 120,
      page: 2,
    })
  );

  const parameters = url.searchParams.get('parameters');
  assert.match(parameters, /qs=boho%20wedding/);
  assert.match(parameters, /pg=2/);
  // The outer query string must encode the inner `%` as `%25`.
  assert.match(url.toString(), /qs%3Dboho%2520wedding/);
  assert.match(url.searchParams.get('properties'), /UserDefaultPageSize=120/);
  assert.match(url.searchParams.get('properties'), /ProductDepartmentUrl=0/);
  assert.equal(url.searchParams.get('diffParameters'), 'st,pg,sd,qs');
});

test('OPTIONS returns 204 with CORS headers', async () => {
  const response = await worker.fetch(
    new Request('https://worker.example.dev/api/search', { method: 'OPTIONS' }),
    BASE_ENV
  );

  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(response.headers.get('Access-Control-Allow-Methods'), 'GET, OPTIONS');
});

test('non-GET methods return 405', async () => {
  const response = await worker.fetch(
    new Request('https://worker.example.dev/api/search', { method: 'POST' }),
    BASE_ENV
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'GET, OPTIONS');
  const body = await response.json();
  assert.match(body.error, /Method not allowed/);
});

test('missing term returns 400 JSON', async () => {
  const response = await worker.fetch(makeRequest('sortBy=sales'), BASE_ENV);

  assert.equal(response.status, 400);
  assert.equal(response.headers.get('Content-Type'), 'application/json; charset=utf-8');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  const body = await response.json();
  assert.equal(body.error, 'Search term is missing');
});

test('unknown path returns 404 JSON', async () => {
  const response = await worker.fetch(makeRequest('term=wedding', '/not-search'), BASE_ENV);

  assert.equal(response.status, 404);
  const body = await response.json();
  assert.match(body.error, /Not found/);
});

test('successful search enriches products, analysis, market, suggestions and source', async (t) => {
  const originalFetch = globalThis.fetch;
  let capturedUrl;
  globalThis.fetch = async (input) => {
    capturedUrl = String(input);
    return mockUpstream(sampleZazzleResponse());
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(
    makeRequest('term=boho%20wedding&sortBy=orderitemcount_month&department=0&pageSize=60&page=1'),
    BASE_ENV
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Upstream-Status'), '200');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');

  const body = await response.json();

  const upstream = new URL(capturedUrl);
  assert.equal(
    upstream.searchParams.get('parameters'),
    'st=orderitemcount_month&pg=1&sd=desc&qs=boho%20wedding'
  );
  assert.match(upstream.searchParams.get('properties'), /UserDefaultPageSize=60/);

  assert.equal(body.products.length, 3);
  assert.deepEqual(body.products[0].stats, {
    sales: 40,
    views: 1000,
    carts: 12,
    likes: 5,
    personalizations: 8,
    customizations: 0,
    conversionRate: 4,
    estimatedRevenue: 400,
  });
  assert.deepEqual(body.products[0].flags, {
    bestSeller: true,
    bestSellerTier: 'Medium',
    bestSellerScope: 'Department',
    editorsPick: true,
    popular: false,
    easyToPersonalize: false,
    officiallyLicensed: false,
    personalized: true,
  });
  assert.equal(body.products[1].flags.popular, true);
  assert.equal(body.products[1].flags.bestSeller, false);
  assert.equal(body.products[2].stats.estimatedRevenue, 0);

  assert.equal(body.topProduct.titleSeo, 'Product A');
  assert.equal(body.market.saturation, 12345);
  assert.equal(body.market.accessibleResults, 1080);
  assert.equal(body.market.lastPageNum, 9);
  assert.equal(body.market.analyzedProducts, 3);
  assert.equal(body.market.totalSales, 50);
  assert.equal(body.market.averageSales, 16.67);
  assert.equal(body.market.medianPrice, 10);
  assert.equal(body.market.top10SalesShare, 100);
  assert.equal(body.market.personalizedShare, 66.67);
  assert.equal(body.market.promoShare, 33.33);
  assert.equal(body.market.bestSellerShare, 33.33);

  assert.deepEqual(body.analysis.keywords, [
    { term: 'gift', count: 2 },
    { term: 'wedding', count: 2 },
    { term: 'boho', count: 1 },
  ]);
  assert.deepEqual(body.analysis.keywordTags, [
    { term: 'wedding gift', count: 1 },
    { term: 'wedding gift boho', count: 1 },
  ]);
  assert.deepEqual(body.analysis.productTypes, [
    {
      type: 'Mug',
      count: 2,
      totalSales: 40,
      estimatedRevenue: 400,
      averagePrice: 7.5,
      salesShare: 80,
    },
    {
      type: 'Shirt',
      count: 1,
      totalSales: 10,
      estimatedRevenue: 200,
      averagePrice: 20,
      salesShare: 20,
    },
  ]);

  assert.equal(body.analysis.stores.length, 2);
  const storeA = body.analysis.stores[0];
  assert.equal(storeA.name, 'Store A');
  assert.equal(storeA.storeHandle, 'StoreA');
  assert.equal(storeA.productCount, 2);
  assert.equal(storeA.totalSales, 50);
  assert.equal(storeA.estimatedRevenue, 600);
  assert.equal(storeA.averagePrice, 15);
  assert.equal(storeA.conversionRate, 4.55);
  assert.equal(storeA.topProductTitle, 'Product A');
  assert.equal(storeA.salesShare, 100);

  assert.deepEqual(body.analysis.price, {
    min: 5,
    median: 10,
    average: 11.67,
    max: 20,
    buckets: [
      { label: 'Under $5', min: 0, max: 5, count: 0, share: 0 },
      { label: '$5 - $15', min: 5, max: 15, count: 2, share: 66.67 },
      { label: '$15 - $25', min: 15, max: 25, count: 1, share: 33.33 },
      { label: '$25 - $50', min: 25, max: 50, count: 0, share: 0 },
      { label: '$50 - $100', min: 50, max: 100, count: 0, share: 0 },
      { label: '$100+', min: 100, max: null, count: 0, share: 0 },
    ],
  });

  assert.deepEqual(body.analysis.badges, {
    bestSellers: 1,
    editorsPicks: 1,
    popular: 1,
    easyToPersonalize: 0,
    officiallyLicensed: 0,
    personalized: 2,
  });

  assert.deepEqual(body.analysis.categories, [
    { id: '252473910063999984', name: 'Weddings' },
    { id: '252283360970275166', name: 'Home & Living' },
  ]);
  assert.deepEqual(body.analysis.filters.map((filter) => filter.id), [
    '__department',
    'dynamic_facet_price_us_usd',
  ]);

  assert.equal(body.suggestions.length, 3);
  assert.deepEqual(body.suggestions[0], {
    group: 'tags',
    name: 'Pet',
    searchTerm: 'boho wedding pet',
    imageUrl: 'https://img.example/pet.jpg',
    altText: 'Search for boho wedding Pet',
  });
  assert.equal(body.suggestions[1].searchTerm, 'boho wedding Rustic');
  assert.equal(body.suggestions[2].searchTerm, 'boho wedding for her');

  assert.deepEqual(body.source, {
    absoluteUrl: 'https://www.zazzle.com/boho+wedding',
    canonicalUrl: 'https://www.zazzle.com/boho+wedding',
    department: '252536702459719117',
    originalTerm: 'boho wedding',
  });
});

test('pageSize is clamped to the Zazzle maximum of 120 and invalid tokens fall back', async (t) => {
  const originalFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return mockUpstream(sampleZazzleResponse());
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await worker.fetch(
    makeRequest('term=wedding&pageSize=9999&sortBy=bad%20token%21&department=../etc'),
    BASE_ENV
  );
  await worker.fetch(makeRequest('term=wedding&pageSize=nope'), BASE_ENV);

  const first = new URL(urls[0]).searchParams;
  assert.match(first.get('properties'), /UserDefaultPageSize=120/);
  assert.equal(
    first.get('parameters'),
    'st=orderitemcount_month&pg=1&sd=desc&qs=wedding'
  );
  assert.match(first.get('properties'), /ProductDepartmentUrl=0/);

  const second = new URL(urls[1]).searchParams;
  assert.match(second.get('properties'), /UserDefaultPageSize=120/);
});

test('page is clamped and forwarded upstream', async (t) => {
  const originalFetch = globalThis.fetch;
  const urls = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return mockUpstream(sampleZazzleResponse());
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  await worker.fetch(makeRequest('term=wedding&page=999'), BASE_ENV);
  await worker.fetch(makeRequest('term=wedding&page=0'), BASE_ENV);

  assert.match(new URL(urls[0]).searchParams.get('parameters'), /pg=50/);
  assert.match(new URL(urls[1]).searchParams.get('parameters'), /pg=1/);
});

test('upstream 403 becomes a 502 with upstream_blocked code', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => mockUpstream('<html>blocked</html>', 403);
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), BASE_ENV);

  assert.equal(response.status, 502);
  assert.equal(response.headers.get('X-Upstream-Status'), '403');
  const body = await response.json();
  assert.equal(body.code, 'upstream_blocked');
  assert.equal(body.upstreamStatus, 403);
  assert.match(body.error, /blocked/);
});

test('retries a retryable upstream status before giving up', async (t) => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    return calls === 1
      ? mockUpstream('<html>blocked</html>', 403)
      : mockUpstream(sampleZazzleResponse());
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), {
    CACHE_TTL_SECONDS: '0',
    UPSTREAM_MAX_ATTEMPTS: '2',
  });

  assert.equal(response.status, 200);
  assert.equal(calls, 2);
});

test('invalid upstream JSON returns 502', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => mockUpstream('not json', 200);
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), BASE_ENV);

  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 'invalid_upstream_json');
});

test('unexpected upstream structure returns 502 with the upstream message', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => mockUpstream({ success: false, message: 'boom' }, 200);
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), BASE_ENV);

  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 'invalid_upstream_structure');
  assert.equal(body.error, 'Zazzle API error: boom');
});

test('network failure returns 502', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new TypeError('connection reset');
  };
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), BASE_ENV);

  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 'upstream_network_error');
  assert.match(body.error, /connection reset/);
});

test('buildPayload handles malformed products without throwing', () => {
  const payload = buildPayload({
    numRecs: undefined,
    products: [{ titleSeo: 'No badges' }, null, { keywords: 'a+b', storeName: 'S' }],
  });

  assert.equal(payload.products.length, 3);
  assert.deepEqual(payload.products[0].stats, {
    sales: 0,
    views: 0,
    carts: 0,
    likes: 0,
    personalizations: 0,
    customizations: 0,
    conversionRate: 0,
    estimatedRevenue: 0,
  });
  assert.deepEqual(payload.products[0].flags, {
    bestSeller: false,
    bestSellerTier: null,
    bestSellerScope: null,
    editorsPick: false,
    popular: false,
    easyToPersonalize: false,
    officiallyLicensed: false,
    personalized: false,
  });
  assert.equal(payload.market.saturation, 0);
  assert.equal(payload.market.accessibleResults, 0);
  assert.deepEqual(payload.analysis.price.buckets, []);
  assert.equal(payload.topProduct.titleSeo, 'No badges');
  assert.deepEqual(payload.analysis.keywords, []);
  assert.deepEqual(payload.analysis.keywordTags, [{ term: 'a b', count: 1 }]);
  assert.deepEqual(payload.suggestions, []);
});
