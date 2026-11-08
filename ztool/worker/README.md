# Zazzle Search Worker (Cloudflare)

Cloudflare Worker replacement for the old Vercel `/api/search.js` handler used by
`ztool/index.html`. It proxies Zazzle's product search, enriches each product with
sales/views/carts stats, and returns the same payload shape the frontend expects:

```json
{
  "products": [],
  "topProduct": {},
  "analysis": { "keywords": [], "stores": [], "productTypes": [] },
  "market": { "saturation": 0 }
}
```

## Endpoint

```
GET /api/search?term=boho%20wedding&sortBy=orderitemcount_month&department=0&pageSize=120
```

| Param        | Default                 | Notes                                              |
| ------------ | ----------------------- | -------------------------------------------------- |
| `term`       | required                | Search keyword / niche.                            |
| `sortBy`     | `orderitemcount_month`  | Zazzle sort token, e.g. `orderitemcount_all`.      |
| `department` | `0`                     | Zazzle department id/path. `0` means all.          |
| `pageSize`   | `120`                   | Clamped to `1..240`.                               |

`GET /` is also accepted as a convenience alias.

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
| `CACHE_TTL_SECONDS`    | `60`    | Edge cache TTL. Use `0` to disable.               |
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
