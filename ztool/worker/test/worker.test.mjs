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
      search: {
        searchResultsData: {
          numRecs: 12345,
          products: [
            {
              title: 'Product A',
              storeName: 'Store A',
              price: '10.00',
              productType: 'Mug',
              keywords: 'wedding+gift+boho',
              badges: [
                { type: 'BoughtXTimesInMonth', orderItemCount: '40' },
                { type: 'XViewsInMonth', viewCount: '1000' },
                { type: 'InXCarts', cartCount: '12' },
              ],
            },
            {
              title: 'Product B',
              storeName: 'Store A',
              price: 20,
              productType: 'Shirt',
              keywords: 'wedding+gift',
              badges: [
                { type: 'BoughtXTimesInMonth', orderItemCount: 10 },
                { type: 'XViewsInMonth', viewCount: 100 },
              ],
            },
            {
              title: 'Product C',
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

test('buildZazzleUrl double-encodes nested parameters', () => {
  const url = new URL(
    buildZazzleUrl({
      term: 'boho wedding',
      sortBy: 'orderitemcount_month',
      department: '0',
      pageSize: 120,
    })
  );

  const parameters = url.searchParams.get('parameters');
  assert.match(parameters, /qs=boho%20wedding/);
  // The outer query string must encode the inner `%` as `%25`.
  assert.match(url.toString(), /qs%3Dboho%2520wedding/);
  assert.match(
    url.searchParams.get('properties'),
    /UserDefaultPageSize=120/
  );
  assert.match(
    url.searchParams.get('properties'),
    /ProductDepartmentUrl=0/
  );
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
  const response = await worker.fetch(
    makeRequest('sortBy=sales'),
    BASE_ENV
  );

  assert.equal(response.status, 400);
  assert.equal(response.headers.get('Content-Type'), 'application/json; charset=utf-8');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  const body = await response.json();
  assert.equal(body.error, 'Search term is missing');
});

test('unknown path returns 404 JSON', async () => {
  const response = await worker.fetch(
    makeRequest('term=wedding', '/not-search'),
    BASE_ENV
  );

  assert.equal(response.status, 404);
  const body = await response.json();
  assert.match(body.error, /Not found/);
});

test('successful search enriches products and builds analysis', async (t) => {
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
    makeRequest('term=boho%20wedding&sortBy=sales&department=0&pageSize=60'),
    BASE_ENV
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Upstream-Status'), '200');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');

  const body = await response.json();

  const upstream = new URL(capturedUrl);
  assert.equal(
    upstream.searchParams.get('parameters'),
    'st=sales&pg=1&sd=desc&qs=boho%20wedding'
  );
  assert.match(
    upstream.searchParams.get('properties'),
    /UserDefaultPageSize=60/
  );

  assert.equal(body.products.length, 3);
  assert.deepEqual(body.products[0].stats, {
    sales: 40,
    views: 1000,
    carts: 12,
    conversionRate: 4,
  });
  assert.deepEqual(body.products[2].stats, {
    sales: 0,
    views: 0,
    carts: 0,
    conversionRate: 0,
  });

  assert.equal(body.topProduct.title, 'Product A');
  assert.equal(body.market.saturation, 12345);

  assert.deepEqual(body.analysis.keywords, [
    { term: 'wedding', count: 2 },
    { term: 'gift', count: 2 },
    { term: 'boho', count: 1 },
  ]);
  assert.deepEqual(body.analysis.productTypes, [
    { type: 'Mug', count: 2 },
    { type: 'Shirt', count: 1 },
  ]);
  assert.equal(body.analysis.stores.length, 2);
  assert.equal(body.analysis.stores[0].name, 'Store A');
  assert.equal(body.analysis.stores[0].productCount, 2);
  assert.equal(body.analysis.stores[0].totalSales, 50);
  assert.equal(body.analysis.stores[0].averagePrice, 15);
});

test('pageSize is clamped and invalid tokens fall back to defaults', async (t) => {
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
  assert.match(first.get('properties'), /UserDefaultPageSize=240/);
  assert.equal(first.get('parameters'), 'st=orderitemcount_month&pg=1&sd=desc&qs=wedding');
  assert.match(first.get('properties'), /ProductDepartmentUrl=0/);

  const second = new URL(urls[1]).searchParams;
  assert.match(second.get('properties'), /UserDefaultPageSize=120/);
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

test('unexpected upstream structure returns 502', async (t) => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => mockUpstream({ success: true, data: {} }, 200);
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  const response = await worker.fetch(makeRequest('term=wedding'), BASE_ENV);

  assert.equal(response.status, 502);
  const body = await response.json();
  assert.equal(body.code, 'invalid_upstream_structure');
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

test('buildPayload handles a malformed product without throwing', () => {
  const payload = buildPayload({
    numRecs: undefined,
    products: [{ title: 'No badges' }, null, { keywords: 'a+b', storeName: 'S' }],
  });

  assert.equal(payload.products.length, 3);
  assert.deepEqual(payload.products[0].stats, {
    sales: 0,
    views: 0,
    carts: 0,
    conversionRate: 0,
  });
  assert.equal(payload.market.saturation, 0);
  assert.equal(payload.topProduct.title, 'No badges');
});
