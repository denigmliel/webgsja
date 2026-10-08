# GSJA Ciputat Timur – Web Gereja

Next.js 14 (App Router) + Prisma + SQLite. Login admin memakai JWT di cookie httpOnly.

## Menjalankan

```bash
npm install
cp .env.example .env      # lalu isi AUTH_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD
npm run setup             # membuat database + akun admin
npm run dev               # buka http://localhost:3000
```

## Halaman

| Alamat | Akses | Isi |
|---|---|---|
| `/` | Publik | Ulang tahun bulan ini, jumlah jemaat, total persembahan bulan ini |
| `/jemaat` | Publik | Daftar jemaat (nama, jenis kelamin, tanggal-bulan lahir) |
| `/keuangan` | Publik | Total & rincian 4 jenis persembahan per bulan (tanpa nama pemberi) |
| `/ulang-tahun` | Publik | Ulang tahun per bulan (Januari–Desember) |
| `/login` | Publik | Masuk admin |
| `/admin` | Admin | Ringkasan |
| `/admin/jemaat` | Admin | Tambah / ubah / hapus jemaat (termasuk telepon & alamat) |
| `/admin/keuangan` | Admin | Input persembahan umum, pembangunan, janji iman, kasih |

## Produksi

- Ganti `provider` di `prisma/schema.prisma` menjadi `postgresql` dan isi `DATABASE_URL`
  (SQLite tidak cocok untuk hosting serverless seperti Vercel karena file-nya tidak permanen).
- Isi `AUTH_SECRET` dengan teks acak panjang dan gunakan password admin yang kuat.
- Pasang di belakang HTTPS.
