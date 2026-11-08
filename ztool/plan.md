# Plan

## 1. Hapus data promo Zazzle

**Worker** — `ztool/worker/src/index.js`
- `enrichProduct()`: buang `promoLabel` dari output.
  ```js
  const { promoLabel: _promoLabel, ...productFields } = safeProduct;
  ```
- `buildMarket()`: hapus `withPromo` dan `promoShare`.

**Frontend** — `ztool/index.html`
- `normalizeProduct()`: hapus `promoLabel`.
- `normalizeMarket()`: hapus `promoShare`.
- Kartu produk: hapus blok `<p x-show="product.promoLabel">`.
- Kartu Top-10: ganti subtitle menjadi
  `'Top 10 of ' + formatNumber(market.analyzedProducts) + ' analyzed products'`.

**Test** — `ztool/worker/test/worker.test.mjs`
- Pertahankan `promoLabel` di fixture.
- Assert `products[0].promoLabel === undefined`.
- Assert `'promoShare' in body.market === false`.
- Hapus assertion `body.market.promoShare`.

**Docs** — `ztool/worker/README.md`
- Hapus `promoShare` dari daftar field `market`.
- Catat bahwa label promo platform-wide tidak diteruskan.

## 2. Label "Est. gross revenue/mo"

Field tetap `estimatedRevenue`; hanya label UI dan dokumentasi yang berubah.

**`ztool/index.html`**
- Ringkasan Top Product: `Est. $X revenue/mo` → `Est. $X gross revenue/mo`.
- Tombol sort: `Est. Revenue` → `Est. Gross Revenue`.
- Kartu produk: `Est. revenue/mo` → `Est. gross revenue/mo`.
- Tabel tipe produk: `Est. Revenue/Mo` → `Est. Gross Revenue/Mo`.
- Tabel toko: `Est. Revenue/Mo` → `Est. Gross Revenue/Mo`.
- Deskripsi tabel: `revenue` → `gross revenue`.

**`ztool/worker/README.md`**
- Jelaskan `estimatedRevenue` = estimasi **gross** revenue (`sales × price`,
  sebelum diskon, ongkir, pajak, dan biaya platform).

## 3. Insight actionable (frontend, fase 1)

**Verdict niche** — `ztool/index.html`
- `nicheVerdict(market)` → `{ tone, headline, reasons[] }`.
- Konstanta `ZAZZLE_VERDICT_THRESHOLDS`.
- Banner di atas kartu ringkasan.
- Contoh: `Demand tinggi · kompetisi tinggi · sales terkonsentrasi`.

**Filter produk** — `ztool/index.html`
- State `productFilters: { personalizable, priceBucket, badge, minSales }`.
- Getter `filteredProducts`; pakai di `sortedProducts`.
- Kontrol di baris `Rank results by`.
- Opsi badge: `bestSeller`, `editorsPick`, `popular`, `easyToPersonalize`.
- Opsi harga dari `analysis.price.buckets`.

**Profit estimator** — `ztool/index.html`
- State `profitInputs: { baseCost, platformFeePct, adCostPerSale }`, simpan di localStorage.
- `profitPerSale(price) = price - baseCost - price * fee / 100 - adCost`.
- `marginPct(price)`.
- Panel input + hasil untuk median price dan top product.
- Estimasi bulanan = `profitPerSale(medianPrice) * market.averageSales`.

**Watchlist + bandingkan** — `ztool/index.html`
- localStorage `ztoolWatchlist`.
- Tombol `Save niche` menyimpan `{ term, department, saturation, medianPrice, top10SalesShare, personalizedShare, topProductSales, savedAt }`.
- Panel `Saved` berisi tabel perbandingan, tombol `Load`, dan `Remove`.

**Export CSV** — `ztool/index.html`
- Tombol `Export CSV` di view products.
- Kolom: title, store, price, productType, sales, views, carts, conversionRate, estimatedRevenue, personalizable, badges, linkUrl.
- Pakai `Blob` + `URL.createObjectURL`; revoke setelah download.

**Caveat data** — `ztool/index.html`
- Teks kecil di bawah ringkasan:
  `Sample: top N of X · revenue gross · promo excluded · sales from monthly badges`.
- N dari `market.analyzedProducts`, X dari `market.saturation`.

## 4. Trend history (fase 2, butuh storage)

- `ztool/worker/wrangler.jsonc`: binding D1 `DB`.
- `ztool/worker/schema.sql`: tabel `niche_snapshots`.
- `ztool/worker/src/index.js`: upsert snapshot per `term+department+day` saat search.
- Endpoint `GET /api/history?term=...&department=...&days=90`.
- UI: sparkline saturation, median price, top-10 share, total sales di panel `Saved`.
- Minimal snapshot: `saturation`, `median_price`, `top10_sales_share`, `total_sales`.

## Verifikasi

1. `cd ztool/worker && node --test`
2. `grep -rni "promo" ztool` → hanya `ztool/plan.md` dan fixture test.
3. UI lokal, cari `cat`:
   - tidak ada kode/metrik promo;
   - label revenue memakai `gross`;
   - verdict, filter, profit estimator, watchlist, CSV, dan caveat tampil;
   - CSV terunduh dengan kolom yang benar.
4. `wrangler deploy`; cek production:
   - `promoLabel` tidak ada di `products[*]`;
   - `promoShare` tidak ada di `market`.
5. Reload live site tanpa cache; ulangi pengecekan UI.
6. Fase 2: `wrangler d1 execute`, cek `/api/history`, deploy, verifikasi sparkline.
7. Cache edge 60 detik; tambahkan query unik saat verifikasi payload.

## Acceptance

- [ ] `promoLabel` dan `promoShare` tidak ada di payload worker.
- [ ] UI tidak menampilkan kode/metrik promo.
- [ ] Semua label revenue memakai `Est. gross revenue/mo`.
- [ ] Verdict niche dan caveat data tampil.
- [ ] Filter produk dan profit estimator berfungsi.
- [ ] Watchlist bisa save/load/remove dan membandingkan minimal 2 niche.
- [ ] Export CSV sesuai kolom.
- [ ] `node --test` lulus.
- [ ] Worker production dan live site memakai versi baru.
- [ ] Tidak ada error console.
- [ ] Fase 2: endpoint history mengembalikan snapshot dan sparkline tampil.

## Commit

Fase 1:

```bash
git add ztool/index.html ztool/worker ztool/plan.md
git commit -m "feat(ztool): add niche verdict, filters, profit estimator, watchlist and CSV export" \
  -- ztool/index.html ztool/worker ztool/plan.md
```

Fase 2:

```bash
git add ztool/index.html ztool/worker ztool/plan.md
git commit -m "feat(ztool): persist niche snapshots and show trend history" \
  -- ztool/index.html ztool/worker ztool/plan.md
```

Jangan sertakan `bejabe/multi-step.mjs`.
