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

## Verifikasi

1. `cd ztool/worker && node --test`
2. `grep -rni "promo" ztool` → hanya `ztool/plan.md` dan fixture test.
3. UI lokal: cari `cat`.
   - Tidak ada kode promo.
   - Semua label revenue memakai "gross".
4. `wrangler deploy`, lalu cek production:
   - `promoLabel` tidak ada di `products[*]`.
   - `promoShare` tidak ada di `market`.
5. Reload live site dengan cache diabaikan; ulangi pengecekan UI.
6. Cache edge 60 detik; tambahkan query unik saat verifikasi payload.

## Acceptance

- [ ] `promoLabel` dan `promoShare` tidak ada di payload worker.
- [ ] UI tidak menampilkan kode/metrik promo.
- [ ] Semua label revenue memakai "Est. gross revenue/mo".
- [ ] `node --test` lulus.
- [ ] Worker production dan live site memakai versi baru.
- [ ] Tidak ada error console.

## Commit

```bash
git add ztool/index.html ztool/worker ztool/plan.md
git commit -m "refactor(ztool): remove platform promo data and clarify gross revenue labels" \
  -- ztool/index.html ztool/worker ztool/plan.md
```

Jangan sertakan `bejabe/multi-step.mjs`.
