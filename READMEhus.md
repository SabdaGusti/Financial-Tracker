# MyCash

**Aplikasi pencatatan keuangan pribadi yang simpel, offline, dan data-nya tetap di perangkatmu.**
*A simple, offline-first personal finance tracker for Android and web. Your data never leaves your device.*

<!-- Tambahkan screenshot aplikasi di sini, mis. ![Home](docs/home.png) -->

## Tentang Aplikasi

MyCash membantu kamu mencatat uang masuk, uang keluar, dan perpindahan saldo antar rekening
(bank, e-wallet, dan uang tunai) di satu tempat. Tidak perlu daftar, tidak perlu login, dan tidak
ada server: semua data tersimpan lokal di perangkat.

## Tujuan

- Memudahkan siapa pun mencatat keuangan harian dengan cepat dan rapi.
- Memberi gambaran jelas: berapa total saldo, ke mana uang dipakai, dan dari mana uang masuk.
- Menjaga privasi: tidak ada akun, tidak ada cloud, tidak ada pelacakan.

## Fitur

**Rekening (Account)**
- Mendukung Bank, E-Wallet, dan Cash, lengkap dengan logo 15 bank dan 7 e-wallet populer di Indonesia.
- Bank atau e-wallet yang belum ada di daftar bisa ditambahkan manual (nama + logo sendiri).
- Atur urutan account di Home (pindah ke depan, tengah, atau belakang).
- Account yang sudah punya transaksi diarsipkan, bukan dihapus, sehingga riwayat tetap utuh.

**Pencatatan transaksi**
- Income, Expense, dan Transfer antar account, plus Penyesuaian Saldo (Adjust Balance) dengan alasan.
- Kategori, catatan, tanggal, dan foto bukti transaksi (opsional).
- Input nominal pakai keypad kalkulator (tambah, kurang, kali, bagi).
- Cari dan filter transaksi berdasarkan tipe, account, kategori, dan tanggal. Subtotal income/expense ditampilkan per hari.
- Saldo tidak bisa minus, dan transfer ke account yang sama ditolak.

**Home**
- Total saldo, ringkasan bulan berjalan (Balance, Income, Expense), daftar account, dan transaksi terbaru.
- Tombol Hide/Show untuk menyamarkan nominal saldo saat layar dilihat orang lain.

**Charts**
- Pie chart pengeluaran atau pemasukan per kategori, diurutkan dari yang terbesar.
- Pilih periode per Bulan, per Tahun, atau rentang tanggal Custom.
- Tap sebuah kategori untuk melihat riwayat transaksinya.

**Lainnya**
- Offline-first: data disimpan di IndexedDB (Dexie.js) pada perangkat.
- Tampilan responsif: bottom navigation di HP, sidebar di desktop.
- Berjalan sebagai web app dan sebagai aplikasi Android (Capacitor).

## Teknologi

React 18, Vite, Dexie.js (IndexedDB), React Router, Recharts, Lucide Icons, Capacitor (Android).

## Menjalankan

```bash
npm install
npm run dev        # buka http://localhost:5173
npm run build      # build produksi ke folder dist/
```

**Build APK Android** (butuh Android Studio):

```bash
npm run android:sync   # build web lalu salin ke project Android
npm run android:open   # buka folder android/ di Android Studio
```

Lalu di Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**.

## Catatan Data

Data tersimpan di penyimpanan browser/aplikasi pada tiap perangkat. Data di HP, komputer, dan
APK **tidak saling sinkron**, dan menghapus data browser/aplikasi akan menghapus catatanmu.
Fitur backup/ekspor belum tersedia.

## Versi

Saat ini: **v1.9**
