# 🕌 SISTEM MANAJEMEN MASJID & DKM (SAAS-READY CMS)
### *Masjid Mu'adz bin Jabal (MBJ) — White-Label Mosque Management & POS Engine*

Aplikasi manajemen operasional masjid terpadu berbasis **Single Page Application (SPA)** yang siap dideploy di **Vercel** dan terintegrasi dengan **Google Sheets & Google Apps Script (GAS)** sebagai *Relational NoSQL Database Engine*.

---

## 🌟 FITUR UTAMA SISTEM

### 1. 💳 Smart POS & Kasir Keuangan Masjid
* **Pemasukan (Cash-In):** Tromol Masjid (Jumat, Subuh, Harian), Muhsinin/Donatur, CSR (Ambulans, Siber, Jenazah), TPQ (SPP & Pendaftaran), ZISWAF & Wakaf Pembangunan.
* **Pengeluaran (Cash-Out):** Operasional Marbot (Karbol Lt 1 & 2), Servis AC & Lampu, Fee Ustadz/Khotib (Preset: Rp600k, Rp900k, Rp1M, Rp1.2M, >Rp3M), Konsumsi Kajian, Perawatan Siber & Armada.
* **Fitur Kasir:** Quick input button, kalkulasi instan, **cetak struk thermal (58mm & 80mm POS slip)** via Bluetooth/Browser print, dan **otomasi Kwitansi WhatsApp** langsung ke nomor donatur / wali santri.
* **Export Laporan:** Download CSV rekap kas harian/bulanan & cetak buku kas.

### 2. 🕌 Divisi Ubudiyah & Multimedia
* **Ubudiyah:** Kalender agenda kajian rutin malam Ahad, penugasan Khotib Jumat, dan tracking amplop fee pemateri (*Disiapkan, Selesai, Ditransfer*).
* **Multimedia:** SOP Checklist produksi kajian (rekaman, syuting, desain flyer, video editing, live YouTube) dan kontrol aset inventaris kamera, mic Shure & audio mixer.

### 3. 🧹 Divisi Rumah Tangga & Fasilitas
* Penugasan & shift absensi 3 orang marbot (Lantai 1 vs Lantai 2).
* Pengajuan & monitoring stok bahan habis pakai (karbol pinus, sabun, plastik sampah jumbo).
* Tiket pemeliharaan fasilitas (Servis AC Daikin, stok lampu, pompa air, genset).
* Pencatatan biaya konsumsi kajian & konsumsi rapat DKM.

### 4. 🚑 Divisi Layanan Sosial (CSR MBJ)
* **Ambulans 24 Jam:** Form reservasi online/offline, status supir siaga, dan tracking rute rujukan pasien.
* **Siber (Air Minum RO Gratis):** Log maintenance filter sediment/karbon, monitoring TDS water meter (ppm), volume distribusi galon & infaq operasional.
* **Layanan Jenazah:** Form darurat fardhu kifayah, kain kafan lengkap & armada mobil jenazah.

### 5. 🎓 Divisi TPQ (Pendidikan Al-Qur'an)
* Database santri & kontak orang tua/wali.
* Kasir pembayaran SPP bulanan santri dengan pencatatan otomatis ke jurnal kas masjid.
* Notifikasi kwitansi pembayaran SPP langsung ke WhatsApp orang tua.

### 6. 🌐 Portal Publik Jamaah (Transparansi Realtime)
* Dashboard transparansi kas riil untuk jamaah (Saldo Kas, Pemasukan vs Pengeluaran).
* Informasi jadwal kajian & Khotib Jumat.
* Form self-service reservasi Ambulans & Layanan Jenazah jamaah.
* Rekening infaq resmi (BSI & Bank Muamalat) dengan tombol salin otomatis & barcode QRIS.

### 7. 🎨 SaaS White-Label CMS Appearance Studio
* Kustomisasi nama masjid, tagline, logo URL, alamat, dan nomor WhatsApp helpline tanpa mengubah kode.
* Dynamic Theme Engine: Ganti palet warna (Emerald Sunnah, Islamic Teal, Royal Blue & Gold, Maroon, dll.) atau custom HEX dengan CSS Variables.
* Running text marquee editor untuk pengumuman berjalan.
* Pengaturan koneksi Google Apps Script & tombol inisialisasi database otomatis.

---

## 🏗️ STRUKTUR PROYEK

```
App MBJ/
├── index.html                   # Entry point Single Page Application
├── server.js                    # Zero-dependency local development server
├── package.json                 # Project configuration & start scripts
├── vercel.json                  # Vercel deployment configuration
├── css/
│   └── main.css                 # Custom styles, Glassmorphism & Thermal Print rules
├── js/
│   ├── config.js                # White-Label config manager & dynamic themes
│   ├── utils.js                 # Formatters, Web Audio, Thermal slip builder, WA link
│   ├── state.js                 # Reactive State Store & offline localStorage cache
│   ├── api.js                   # Google Apps Script REST API Client
│   ├── app.js                   # App bootstrap, router & modal manager
│   └── components/
│       ├── navbar.js            # Top header, marquee, clock & role switcher
│       ├── sidebar.js           # RBAC sidebar navigation
│       ├── dashboard.js         # Financial metrics & Chart.js charts
│       ├── pos.js               # Smart POS Cashier system
│       ├── transactions.js      # Ledger journal & CSV export
│       ├── ubudiyah.js          # Kajian & Khotib agenda
│       ├── multimedia.js        # Production checklist & assets
│       ├── facilities.js        # Marbot shifts, karbol stock & tickets
│       ├── social.js            # Ambulance, Siber & Jenazah
│       ├── tpq.js               # TPQ Santri & SPP cashier
│       ├── portal.js            # Public Jamaah portal
│       └── settings.js          # White-Label CMS appearance studio
└── gas/
    ├── Code.gs                  # Backend Engine MVC for Google Apps Script
    └── appsscript.json          # GAS manifest
```

---

## 🚀 PANDUAN DEPLOYMENT GOOGLE APPS SCRIPT (BACKEND)

### Langkah 1: Buat Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet: `Database Sistem Manajemen Masjid MBJ`.

### Langkah 2: Buka Apps Script
1. Pada menu Google Sheets, klik **Extensions (Ekstensi)** > **Apps Script**.
2. Hapus seluruh kode default pada editor `Code.gs`.
3. Buka file `gas/Code.gs` dari repositori ini, salin seluruh kodenya, lalu tempelkan ke editor Apps Script.
4. Klik icon **Save (Simpan / Ctrl+S)**.

### Langkah 3: Inisialisasi 9 Tabs Database
1. Pada dropdown fungsi di bagian atas Apps Script, pilih fungsi `setupDatabase`.
2. Klik tombol **Run (Jalankan)**.
3. Berikan izin otorisasi akses (*Review Permissions* > Pilih akun Google Anda > *Advanced* > *Go to ... (unsafe)* > *Allow*).
4. Spreadsheet Anda akan otomatis terisi dengan 9 Tab database:
   - `Config`
   - `Users_Auth`
   - `Transactions`
   - `Ubudiyah_Agenda`
   - `Multimedia_Assets`
   - `Household_Maintenance`
   - `Social_Services`
   - `TPQ_Students`
   - `TPQ_Payments`

### Langkah 4: Deploy sebagai Web App
1. Klik tombol **Deploy** di kanan atas > Pilih **New deployment**.
2. Klik ikon gerigi (Select type) > Pilih **Web app**.
3. Isi konfigurasi:
   - **Description:** `MBJ Mosque API Engine v1`
   - **Execute as:** `Me (email-anda@gmail.com)`
   - **Who has access:** `Anyone` *(Penting agar aplikasi frontend dapat mengakses API)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang dihasilkan (format: `https://script.google.com/macros/s/AKfycb.../exec`).

---

## 🌐 PANDUAN DEPLOYMENT FRONTEND DI VERCEL

### Langkah 1: Push Repositori ke GitHub
```bash
git init
git add .
git commit -m "feat: Sistem Manajemen Masjid MBJ White-Label CMS"
git branch -M main
git remote add origin https://github.com/USERNAME/mosque-management-mbj.git
git push -u origin main
```

### Langkah 2: Hubungkan ke Vercel
1. Masuk ke [Vercel Dashboard](https://vercel.com).
2. Klik **Add New...** > **Project**.
3. Import repositori GitHub Anda.
4. Pada pengaturan Framework Preset, pilih **Other** (karena aplikasi ini adalah zero-friction Pure Modern SPA).
5. Klik **Deploy**.

### Langkah 3: Hubungkan URL Google Apps Script ke Web App
1. Buka URL website yang sudah live di Vercel.
2. Buka menu **CMS Appearance Studio** (atau tekan icon gear / `#settings`).
3. Pada bagian **Integrasi Backend Google Apps Script (GAS)**, tempelkan URL Web App GAS yang sudah Anda salin di langkah sebelumnya.
4. Klik **Test Koneksi GAS** lalu klik **Simpan Pengaturan**.
5. Selesai! Sistem Anda sekarang terhubung secara realtime dengan Google Sheets.

---

## 💻 CARA MENJALANKAN SECARA LOKAL

Untuk mencoba dan mengembangkan aplikasi di komputer lokal:

```bash
# Jalankan server lokal bawaan
npm start
# atau
node server.js
```

Buka browser Anda di `http://localhost:3000`.

---

## 🔒 HAK AKSES & ROLE PENGGUNA (RBAC)
* **👑 SuperAdmin:** Akses penuh ke seluruh modul, POS kasir, jurnal, pengaturan CMS & integrasi database.
* **💰 Bendahara:** Akses ke Dashboard, Smart POS Kasir, Jurnal Kas, Ubudiyah (Fee Khotib), dan Kasir SPP TPQ.
* **🧹 Marbot & RT:** Akses ke log kebersihan lantai 1 & 2, pengajuan stok karbol, dan tiket perbaikan fasilitas AC/lampu.
* **🎓 Admin TPQ:** Akses ke data santri, pembayaran SPP, dan pengiriman kwitansi WhatsApp ke orang tua.
* **🚑 Admin CSR / Sosial:** Akses ke manajemen Ambulans 24 Jam, Siber Air Minum, dan Layanan Jenazah.
* **🌐 Public (Jamaah):** Akses baca transparansi kas, jadwal kajian, dan form permohonan layanan publik.

---

## 📄 LISENSI
Hak Cipta &copy; 2026 DKM Masjid Mu'adz bin Jabal (MBJ). Dilindungi di bawah lisensi MIT.
