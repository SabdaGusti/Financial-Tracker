# Financial Tracker (MVP)

Aplikasi pencatatan keuangan manual (income, expense, transfer, adjustment)
dibangun sesuai `Blueprint_Financial_Tracker_MVP.docx`.

## Menjalankan aplikasi

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Build production

```bash
npm run build
npm run preview
```

## Menjadikan aplikasi Android (Capacitor)

Project ini sudah disiapkan dengan Capacitor (folder `android/` sudah ada).
Setiap kali ada perubahan kode React, jalankan build + sync sebelum membuka
project Android:

```bash
npm install
npm run android:sync   # build web assets lalu copy ke android/
npm run android:open   # membuka project di Android Studio (butuh Android Studio terinstall)
```

Langkah build APK di Android Studio:

1. Tunggu Gradle selesai sync otomatis saat project terbuka.
2. Pilih menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. APK debug akan ada di `android/app/build/outputs/apk/debug/app-debug.apk`,
   siap di-install ke HP Android (aktifkan "Install dari sumber tidak dikenal"
   jika di-install manual, bukan lewat Play Store).
4. Untuk rilis ke Play Store, gunakan **Build → Generate Signed Bundle / APK**
   dengan keystore sendiri, lalu upload file `.aab` yang dihasilkan.

Catatan: build APK/AAB membutuhkan Android SDK & Gradle yang hanya tersedia
lewat Android Studio di komputer kamu — tidak bisa dijalankan dari sandbox ini
karena butuh akses ke server Google/Gradle yang tidak tersedia di sini.

Jika `appId` (`com.financialtracker.app`) atau nama aplikasi ingin diganti,
edit `capacitor.config.ts` lalu jalankan ulang `npm run android:sync`.

## Catatan implementasi

- Database: IndexedDB via Dexie.js, sepenuhnya berjalan di browser (tidak ada
  backend/server). Data tetap tersimpan setelah refresh karena berada di
  penyimpanan browser (per-origin).
- Saldo account **tidak** disimpan sebagai `currentBalance`; selalu dihitung
  dari `initialBalance` + efek `financialRecords` sesuai formula di section 9
  blueprint.
- Semua business rules (section 10 blueprint) diterapkan di `src/services/`,
  bukan di komponen UI.
- Provider bank/e-wallet adalah master data (`src/data/bankProviders.js`,
  `src/data/ewalletProviders.js`) yang di-seed otomatis ke IndexedDB saat
  pertama kali dijalankan — user memilih dari daftar, bukan mengetik bebas.
