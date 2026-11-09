# Zazzle Search Worker (Cloudflare)

Cloudflare Worker replacement for the old Vercel `/api/search.js` handler used by
`ztool/index.html`. It proxies Zazzle's product search, enriches each product with
sales, views, carts, likes, personalization counts and estimated gross revenue, then
returns a backward-compatible payload with market analysis:

```json
{
  "products": [],
  "topProduct": {},
  "analysis": {
    "keywords": [],
    "keywordTags": [],
    "stores": [],
    "productTypes": [],
    "price": { "min": 0, "median": 0, "average": 0, "max": 0, "buckets": [] },
    "badges": {},
    "filters": [],
    "categories": []
  },
  "market": { "saturation": 0 },
  "suggestions": [],
  "source": {}
}
```

Existing fields keep their shape, so older frontends keep working. New fields are
additive.

## Endpoint

```
GET /api/search?term=boho%20wedding&sortBy=orderitemcount_month&department=0&pageSize=120&page=1
```

| Param        | Default                | Notes                                                        |
| ------------ | ---------------------- | ------------------------------------------------------------ |
| `term`       | required               | Search keyword / niche.                                      |
| `sortBy`     | `orderitemcount_month` | Zazzle sort token, e.g. `orderitemcount_all`, `newest`, `relevance`. |
| `department` | `0`                    | Zazzle department id/path. `0` means all.                    |
| `pageSize`   | `120`                  | Clamped to `1..120`. Zazzle itself caps requests at 120.     |
| `page`       | `1`                    | Clamped to `1..50`. Zazzle exposes roughly the first 1,000 results. |

`GET /` is also accepted as a convenience alias.

## Response details

- `products[]` keeps every original Zazzle field and adds:
  - `stats`: `sales`, `views`, `carts`, `likes`, `personalizations`,
    `customizations`, `conversionRate`, `estimatedRevenue`
    (gross revenue estimate: `sales × price`, before discounts, shipping, tax
    and platform fees).
  - `flags`: `bestSeller` (+ `bestSellerTier`/`bestSellerScope`), `editorsPick`,
    `popular`, `easyToPersonalize`, `officiallyLicensed`, `personalized`.
  - Platform-wide `promoLabel` is intentionally not forwarded.
- `analysis.keywords` counts single words; `analysis.keywordTags` counts the full
  phrase tags Zazzle stores (tags are space separated, words inside a tag use `+`).
- `analysis.stores[]` and `analysis.productTypes[]` include estimated monthly
  gross revenue, average price, conversion rate and sales share.
- `analysis.price` contains min/median/average/max plus price buckets.
- `analysis.badges` summarises badge prevalence; `analysis.filters` exposes the
  useful Zazzle facets; `analysis.categories` is the department facet.
- `market` adds `accessibleResults` (`lastPageNum × pageSize`), `analyzedProducts`,
  `totalSales`, `averageSales`, `medianPrice`, `top10SalesShare`,
  `personalizedShare` and `bestSellerShare`.
- `suggestions` comes from Zazzle's guided search ("Related Niches" in the UI).
- `source` returns the source/canonical Zazzle URLs, department and search term.

## Reviews endpoint

```
GET /api/reviews?productId=256139245543951273&productType=zazzle_invitation3&pages=1
```

| Param         | Default  | Notes                                                        |
| ------------- | -------- | ------------------------------------------------------------ |
| `productId`   | required | Numeric Zazzle product id; used as `rootProductId`.          |
| `productType` | optional | Zazzle product type token, e.g. `zazzle_invitation3`.        |
| `pages`       | `1`      | Clamped to `1..3`. Each upstream page has at most 100 reviews. |

The endpoint proxies `https://www.zazzle.com/svc/z3/reviews/get2` with
`sortBy=MostRelevant` (the only sort value that currently works) and returns:

```json
{
  "summary": {
    "totalReviews": 174,
    "averageRating": 4.47,
    "percentRecommended": 88.5,
    "ratingBreakdown": [0, 16, 3, 7, 5, 143],
    "optionAverageRating": 4.2,
    "processAverageRating": 4.1,
    "sampleSize": 38
  },
  "product": {
    "productId": "256139245543951273",
    "ownReviewCount": 38,
    "averageRating": 4.5,
    "percentRecommended": 94.7,
    "ratingBreakdown": [0, 1, 2, 1, 2, 32],
    "latestReviewDate": "2026-10-07T14:37:13.493",
    "reviewsLast30Days": 0,
    "reviewsLast90Days": 1,
    "mediaCount": 3,
    "sampled": true
  },
  "momentum": {
    "scope": "product",
    "sampleSize": 38,
    "months": [{ "month": "2026-10", "count": 2 }],
    "averagePerMonth": 3.17,
    "recentReviews": 12,
    "previousReviews": 9,
    "trendPct": 33.33,
    "reviewsLast30Days": 0,
    "reviewsLast90Days": 1,
    "reviewsLast365Days": 21,
    "latestReviewDate": "2026-10-07T14:37:13.493",
    "freshnessScore": 19
  },
  "themes": {
    "scope": "product",
    "sampleSize": 38,
    "keywords": [{ "term": "wedding", "count": 9, "share": 23.68 }],
    "aspects": [{ "label": "Design & look", "count": 27, "share": 71.05, "averageRating": 4.7 }],
    "quotes": [{ "text": "Beautiful invitations!", "rating": 5, "productTitle": "Invite", "date": "2026-10-07T14:37:13.493" }]
  },
  "stores": [
    {
      "storeId": "250366813173101330",
      "reviewCount": 38,
      "averageRating": 4.63,
      "percentRecommended": 92.11,
      "mediaCount": 3,
      "latestReviewDate": "2026-10-07T14:37:13.493"
    }
  ],
  "ugc": { "total": 3, "photos": 3, "videos": 0 },
  "reviews": [],
  "media": [],
  "meta": { "productId": "...", "productType": "...", "pages": 1, "sampled": 38, "upstreamTotal": 174 }
}
```

Important details:

- `summary` and its `ratingBreakdown` are **category/feed level**, not product
  level. `ratingBreakdown` is a 6-value array indexed `0..5` stars.
- `product` is computed by filtering the sampled feed to `review.productId ===
  productId`. A feed is seeded by the root product but also contains related
  products' reviews, so `ownReviewCount` is a sample, not a census.
- `momentum` turns review dates into 12 monthly buckets plus 30/90/365-day
  counts, a 6-month trend and a recency-weighted `freshnessScore` (`0..100`).
  It uses the product's own reviews when at least 3 exist, otherwise the
  related feed; `scope` says which one was used.
- `themes` extracts top unigrams, aspect tags (print quality, shipping, design,
  size, value, gifting, material, service) and up to 3 review quotes from the
  same scope choice as `momentum`.
- `stores` aggregates sampled reviews by `storeId` so the frontend can join a
  store review rating into the Top Stores table. It is sample-based, not the
  store's total review history.
- `ugc` counts the photo/video media collected in `media[]`.
- `reviews[]` is a small preview (newest first, own-product reviews prioritized).
  `media[]` collects customer photo/video thumbnails from the whole sampled feed,
  own-product media first.
- Successful responses are edge-cached for 6 hours
  (`REVIEWS_CACHE_TTL_SECONDS=21600`), independent of the search cache. Bump the
  internal cache key path when the payload shape changes.

Errors are JSON with an appropriate status:

- `400` — missing `term`
- `404` — unknown path
- `405` — non-GET method
- `502` — Zazzle blocked/failed the request, or returned invalid data

A `502` caused by bot protection includes `"code": "upstream_blocked"`.

## Why the URL looks double-encoded

Zazzle's `GetSearchWithProperties` endpoint expects `parameters` and `properties`
to be query-string values inside another query string. If the inner values are
only single-encoded (e.g. `%20`), Zazzle answers `403`. The Worker builds the
inner string first and then lets `URLSearchParams` encode it again, producing
`%2520` for spaces. Do not "simplify" this.

## Configuration

`wrangler.jsonc` defines non-secret vars:

| Var                    | Default | Meaning                                          |
| ---------------------- | ------- | ------------------------------------------------ |
| `ALLOWED_ORIGIN`       | `*`     | Value for `Access-Control-Allow-Origin`.         |
| `UPSTREAM_TIMEOUT_MS`  | `15000` | Timeout per Zazzle request attempt.               |
| `CACHE_TTL_SECONDS`    | `60`    | Search edge cache TTL. Use `0` to disable.        |
| `REVIEWS_CACHE_TTL_SECONDS` | `21600` | Reviews edge cache TTL (6 hours).            |
| `UPSTREAM_MAX_ATTEMPTS`| `3`     | Includes the first try; retries 403/429/5xx once. |

For production you can restrict CORS after the frontend URL is known:

```jsonc
"vars": {
  "ALLOWED_ORIGIN": "https://harrissetyawan.github.io"
}
```

## Local development

```bash
cd ztool/worker
npm install
npm test                 # Node's built-in test runner, no network needed
npm run dev              # http://127.0.0.1:8787
```

Try it:

```bash
curl -s "http://127.0.0.1:8787/api/search?term=wedding&pageSize=24" | head -c 300
```

## Deploy

```bash
cd ztool/worker
wrangler login           # one-time, opens the browser
npm run deploy           # or: wrangler deploy
```

Wrangler prints the deployment URL, for example:

```
https://zazzle-search-api.<your-subdomain>.workers.dev
```

Paste that base URL into the **Backend URL** field at
<https://harrissetyawan.github.io/ztool/>. The frontend appends `/api/search`
itself, but a full `.../api/search` URL also works.

Useful commands:

```bash
npm run tail             # live logs (wrangler tail)
wrangler deployments list
```

## Troubleshooting

- **`502` / `upstream_blocked`** — Zazzle is rate-limiting or bot-blocking the
  Worker. Wait a minute, retry, or reduce request volume. The 60s edge cache
  helps; keep it enabled in production.
- **`Not logged in`** — run `wrangler login` before `wrangler deploy`.
- **Frontend still hits the old backend** — the Backend URL is stored in
  `localStorage`; update it in the UI (or clear site data) and hard-reload.
- **Empty product list with status 200** — Zazzle returned a valid response with
  no matches. Try a broader term. The frontend's "Show debug details" panel
  shows the request URL and raw response preview.
