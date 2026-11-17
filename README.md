# Pantau Portofolio

Pelacak portofolio investasi satu halaman (HTML + CSS + JavaScript, tanpa build).
Catat transaksi beli/jual/dividen, pantau nilai pasar, untung/rugi, dan alokasi aset.

- Data disimpan di `localStorage` browser (tidak dikirim ke server mana pun).
- Harga diisi manual lewat tombol **Perbarui harga**.
- Ekspor riwayat transaksi ke CSV.

## Jalankan lokal

```bash
npx serve .
```

## Deploy ke Vercel (otomatis tiap push ke GitHub)

1. Push repo ini ke GitHub.
2. Buka https://vercel.com/new, pilih **Import Git Repository**, lalu pilih repo ini.
3. Framework Preset: **Other**. Kosongkan Build Command dan Output Directory.
4. Klik **Deploy**. Setiap `git push` ke `main` memicu deploy produksi baru, dan setiap pull request mendapat preview URL.

Domain sendiri: Project → Settings → Domains.

## Lewat CLI

```bash
npm i -g vercel
vercel        # preview
vercel --prod # produksi
```
