# Pantau Portofolio

Pelacak portofolio investasi dengan halaman login. Catat transaksi beli/jual/dividen, pantau nilai pasar,
untung/rugi, dan alokasi aset. Harga diisi manual lewat tombol **Perbarui harga**.

## Cara kerja login

- `public/login.html` adalah satu-satunya halaman yang disajikan secara publik.
- Dashboard ada di `private/app.html` dan **tidak pernah disajikan sebagai file statis**. Fungsi `api/app.js`
  hanya mengirimkannya jika cookie sesi valid. Tanpa sesi, pengunjung dialihkan ke `/login`.
- `api/login.js` memeriksa nama pengguna dan kata sandi (hash scrypt, perbandingan waktu-konstan),
  lalu menetapkan cookie `HttpOnly; Secure; SameSite=Lax` yang ditandatangani HMAC dan berlaku 7 hari.
- `api/logout.js` menghapus cookie. Tombol **Keluar** ada di dashboard.
- Data portofolio tetap disimpan di `localStorage` browser (belum di server).

## Pengaturan (sekali saja)

1. Buat hash kata sandi dan rahasia sesi (kata sandi minimal 10 karakter):

   ```bash
   npm run hash -- "kata sandi Anda"
   ```

2. Di Vercel: **Project → Settings → Environment Variables**, tambahkan tiga variabel
   (untuk Production, Preview, dan Development):

   | Nama | Nilai |
   |---|---|
   | `AUTH_USERNAME` | nama pengguna pilihan Anda |
   | `AUTH_PASSWORD_HASH` | baris `AUTH_PASSWORD_HASH=...` dari langkah 1 (tanpa awalan `AUTH_PASSWORD_HASH=`) |
   | `SESSION_SECRET` | baris `SESSION_SECRET=...` dari langkah 1 |

3. **Redeploy** (Deployments → titik tiga → Redeploy) agar variabel terbaca.

Mengganti `SESSION_SECRET` akan mengeluarkan semua sesi yang aktif.

## Deploy

Push ke `main`; Vercel otomatis menerbitkan versi baru. Framework Preset: **Other**, tanpa Build Command.

## Lokal

```bash
npm i -g vercel
cp .env.example .env.local   # isi nilainya
vercel dev
```

## Batasan

- Satu akun (satu pasang nama pengguna dan kata sandi).
- Tidak ada pembatasan percobaan login selain jeda 0,7 detik pada setiap kegagalan. Gunakan kata sandi yang panjang.
- Karena data ada di `localStorage`, data tidak berpindah antar perangkat.
