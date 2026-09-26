/* Masjid MBJ Management System Unified Production Bundle */

/* === js/config.js === */
/**
 * ==============================================================================
 * CONFIG & WHITE-LABEL DEFAULTS
 * ==============================================================================
 */

const DEFAULT_CONFIG = {
  mosque_name: "Masjid Mu'adz bin Jabal",
  mosque_tagline: "Pusat Ubudiyah, Dakwah Sunnah & Pelayanan Umat",
  mosque_address: "Jl. Kolonel Sugiono No. 23, Duren Sawit, Jakarta Timur 13440",
  mosque_phone: "0812-3456-7890",
  mosque_email: "dkm@muadzbinjabal.org",
  logo_url: "https://yt3.googleusercontent.com/ytc/AIdro_nzf7bsONYGX6eeNc-v6GMQUko-_BZXFExEZ_bPNxMbfw=s160-c-k-c0x00ffffff-no-rj",
  theme_color: "#059669", // Emerald Green
  accent_color: "#d97706", // Amber
  currency_symbol: "Rp",
  running_text: "🕌 Selamat Datang di Sistem Informasi Masjid Mu'adz bin Jabal. Kajian Rutin Setiap Malam Ahad Ba'da Maghrib. Layanan Ambulans Gratis 24 Jam Siap Melayani Ummat.",
  running_text_enabled: "true",
  bank_bsi: "7123-4567-89 a.n Kas Masjid Muadz",
  bank_muamalat: "1020-3040-50 a.n Infaq Dakwah & ZISWAF MBJ",
  qris_image_url: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=INFAQ-MASJID-MUADZ-BIN-JABAL",
  gas_web_app_url: "https://script.google.com/macros/s/AKfycbwOw_X-7e7dC5_4-1MIK4wl6Cx9GtEKVR9yPxznQ-pEzP2kCQ3MH2jp7CLhzB0oIm9szQ/exec",
  sound_enabled: "true"
};

const THEME_PRESETS = [
  { name: "Emerald Sunnah (Default)", primary: "#059669", accent: "#d97706" },
  { name: "Islamic Teal", primary: "#0d9488", accent: "#f59e0b" },
  { name: "Royal Blue & Gold", primary: "#1d4ed8", accent: "#eab308" },
  { name: "Deep Navy & Amber", primary: "#0f172a", accent: "#f59e0b" },
  { name: "Forest Green & Copper", primary: "#166534", accent: "#ea580c" },
  { name: "Crimson Maroon", primary: "#991b1b", accent: "#f59e0b" },
  { name: "Modern Violet", primary: "#6d28d9", accent: "#ec4899" }
];

class ConfigManager {
  static get(key) {
    const customConfig = JSON.parse(localStorage.getItem("mbj_config") || "{}");
    if (customConfig[key] !== undefined) return customConfig[key];
    return DEFAULT_CONFIG[key] || "";
  }

  static getAll() {
    const customConfig = JSON.parse(localStorage.getItem("mbj_config") || "{}");
    return { ...DEFAULT_CONFIG, ...customConfig };
  }

  static set(key, value) {
    const customConfig = JSON.parse(localStorage.getItem("mbj_config") || "{}");
    customConfig[key] = value;
    localStorage.setItem("mbj_config", JSON.stringify(customConfig));
    this.applyTheme();
  }

  static setMany(newConfigs) {
    const customConfig = JSON.parse(localStorage.getItem("mbj_config") || "{}");
    const merged = { ...customConfig, ...newConfigs };
    localStorage.setItem("mbj_config", JSON.stringify(merged));
    this.applyTheme();
  }

  static applyTheme() {
    const cfg = this.getAll();
    const root = document.documentElement;

    if (cfg.theme_color) {
      root.style.setProperty("--primary-color", cfg.theme_color);
      const rgb = this.hexToRgb(cfg.theme_color);
      if (rgb) root.style.setProperty("--primary-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    if (cfg.accent_color) {
      root.style.setProperty("--accent-color", cfg.accent_color);
      const rgb = this.hexToRgb(cfg.accent_color);
      if (rgb) root.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Update document title
    document.title = `${cfg.mosque_name} - Sistem Manajemen & Layanan Umat`;
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
}

// Initial theme apply
ConfigManager.applyTheme();


/* === js/utils.js === */
/**
 * ==============================================================================
 * UTILITY HELPERS
 * Currency, Dates, Sound Generator, Thermal Printing, WhatsApp & Export
 * ==============================================================================
 */

const Utils = {
  // Format Number to Indonesian Rupiah
  formatRupiah: function(amount, withPrefix = true) {
    const num = parseFloat(amount) || 0;
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
    return withPrefix ? `Rp ${formatted}` : formatted;
  },

  // Parse Indonesian Date
  formatDateIndo: function(dateInput, includeTime = false) {
    if (!dateInput) return "-";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return dateInput;

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };

      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }

      return new Intl.DateTimeFormat('id-ID', options).format(date);
    } catch (e) {
      return dateInput;
    }
  },

  // Approximate Hijri Date Calculator
  getHijriDate: function(date = new Date()) {
    try {
      const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return hijriFormatter.format(date) + " H";
    } catch (e) {
      return "1448 H";
    }
  },

  // Generate Unique Identifiers
  generateId: function(prefix = "TRX-") {
    const now = new Date();
    const datePart = now.getFullYear().toString().substr(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + "-" +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    return `${prefix}${datePart}-${random}`;
  },

  // Web Audio API Beep Generator (No external audio file needed)
  playAudio: function(type = "success") {
    if (ConfigManager.get("sound_enabled") === "false") return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "cash") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.07); // E6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  },

  // Toast Notification
  showToast: function(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const icons = {
      success: `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
      error: `<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
      info: `<svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      warning: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    };

    toast.className = `flex items-center gap-3 p-4 mb-3 rounded-xl shadow-xl glass-card border border-slate-200 dark:border-slate-700 animate-fade-in transition-all duration-300 max-w-sm w-full`;
    toast.innerHTML = `
      <div class="flex-shrink-0">${icons[type] || icons.info}</div>
      <div class="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">${message}</div>
      <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    this.playAudio(type);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // WhatsApp Kwitansi Message Formatter
  generateWhatsAppKwitansiText: function(receipt) {
    const config = ConfigManager.getAll();
    const isIncome = receipt.type === "IN";
    const title = isIncome ? "KWITANSI BUKTI PENERIMAAN INFAQ / ZISWAF" : "BUKTI PENGELUARAN KAS MASJID";

    return `*${config.mosque_name.toUpperCase()}*
_${config.mosque_tagline}_
📍 ${config.mosque_address}
----------------------------------------
*${title}*
----------------------------------------
*No. Bukti:* ${receipt.trx_id || "-"}
*Tanggal:* ${receipt.date || "-"}
*Kategori:* ${receipt.category || "-"}
*Sub Kategori:* ${receipt.sub_category || "-"}
*Keterangan:* ${receipt.notes || "-"}
*Petugas / PJ:* ${receipt.pj_name || "Petugas Kasir"}
----------------------------------------
*JUMLAH:* ${this.formatRupiah(receipt.amount)}
----------------------------------------
_Jazakumullahu khairan wa barakallahu fiikum._
_Semoga Allah membalas dengan kebaikan yang berlipat ganda._

*Status:* SAH & TERCATAT SISTEM KAS MASJID
_Layanan Bantuan: ${config.mosque_phone}_`;
  },

  // Sanitize & Format Phone Number for WhatsApp (e.g. 0812... or 812... -> 62812...)
  cleanPhone: function(phone) {
    if (!phone) return "";
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  },

  // Open Direct WhatsApp Link
  openWhatsAppReceipt: function(phone, receipt) {
    const cleanPhone = this.cleanPhone(phone);
    const text = encodeURIComponent(this.generateWhatsAppKwitansiText(receipt));
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  },

  // Generate HTML for Thermal Receipt
  buildThermalReceiptHtml: function(receipt) {
    const config = ConfigManager.getAll();
    const isIncome = receipt.type === "IN";

    return `
      <div style="text-align: center; margin-bottom: 8px;">
        <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">${config.mosque_name}</div>
        <div style="font-size: 10px; margin-top: 2px;">${config.mosque_tagline}</div>
        <div style="font-size: 9px; color: #444; margin-top: 2px;">${config.mosque_address}</div>
        <div style="font-size: 9px; color: #444;">Telp: ${config.mosque_phone}</div>
      </div>

      <div class="thermal-double-divider"></div>

      <div style="text-align: center; font-weight: bold; margin: 4px 0; font-size: 11px;">
        ${isIncome ? '*** BUKTI INFAQ / PENERIMAAN KAS ***' : '*** BUKTI PENGELUARAN KAS ***'}
      </div>

      <div class="thermal-divider"></div>

      <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
        <tr>
          <td style="padding: 2px 0;">No. Ref</td>
          <td style="text-align: right; font-weight: bold;">${receipt.trx_id || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Tanggal</td>
          <td style="text-align: right;">${receipt.date || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Kategori</td>
          <td style="text-align: right;">${receipt.category || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Sub-Pos</td>
          <td style="text-align: right;">${receipt.sub_category || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Keterangan</td>
          <td style="text-align: right;">${receipt.notes || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Petugas</td>
          <td style="text-align: right;">${receipt.pj_name || 'Kasir MBJ'}</td>
        </tr>
      </table>

      <div class="thermal-divider"></div>

      <table style="width: 100%; font-size: 13px; font-weight: bold; margin: 6px 0;">
        <tr>
          <td>TOTAL</td>
          <td style="text-align: right;">${this.formatRupiah(receipt.amount)}</td>
        </tr>
      </table>

      <div class="thermal-double-divider"></div>

      <div style="text-align: center; font-size: 9.5px; margin-top: 8px;">
        <div>Jazakumullahu Khairan Katsiran</div>
        <div style="font-size: 8.5px; margin-top: 2px;">Semoga Menjadi Amal Jariyah yang Diberkahi</div>
        <div style="font-size: 8px; color: #666; margin-top: 6px;">Dicetak Otomatis pada ${new Date().toLocaleString('id-ID')}</div>
      </div>
    `;
  },

  // Export Table Data to CSV
  exportToCSV: function(filename, headers, rows) {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Indonesian Excel compatibility
    csvContent += headers.map(h => `"${(h || '').replace(/"/g, '""')}"`).join(",") + "\r\n";

    rows.forEach(row => {
      const line = row.map(cell => {
        let str = cell === null || cell === undefined ? "" : cell.toString();
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",");
      csvContent += line + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(`Laporan CSV ${filename} berhasil diunduh!`, "success");
  }
};


/* === js/state.js === */
/**
 * ==============================================================================
 * STATE MANAGEMENT & LOCAL DATA STORE
 * Reactive Store with Seed Data, Event Emitter & LocalStorage Persistence
 * ==============================================================================
 */

// Initial Mock Seed Data
const INITIAL_SEEDS = {
  transactions: [
    { trx_id: "TRX-260925-101", date: "2026-09-25", type: "IN", category: "Tromol Masjid", sub_category: "Kotak Infaq Shalat Subuh", amount: 1450000, notes: "Perolehan Tromol Subuh Berkah", pj_name: "Marbot Ahmad", proof_url: "", created_at: "2026-09-25T05:30:00Z" },
    { trx_id: "TRX-260924-102", date: "2026-09-24", type: "IN", category: "Muhsinin / Donatur", sub_category: "Infaq Operasional", amount: 5000000, notes: "Hamba Allah - Donasi Operasional Listrik & Kebersihan", pj_name: "Bendahara", proof_url: "", created_at: "2026-09-24T14:15:00Z" },
    { trx_id: "TRX-260924-103", date: "2026-09-24", type: "OUT", category: "Fee Ustadz & Khotib", sub_category: "Kajian Rutin Malam Ahad", amount: 1200000, notes: "Fee Pemateri Kajian Kitab Tauhid Ust. Abdullah Roy", pj_name: "Divisi Ubudiyah", proof_url: "", created_at: "2026-09-24T20:00:00Z" },
    { trx_id: "TRX-260923-104", date: "2026-09-23", type: "OUT", category: "Operasional & Logistik Marbot", sub_category: "Karbol & Pembersih Lt 1-2", amount: 350000, notes: "Restok Karbol Pinus 4 Galon + Sabun Cuci", pj_name: "Marbot Bambang", proof_url: "", created_at: "2026-09-23T09:00:00Z" },
    { trx_id: "TRX-260922-105", date: "2026-09-22", type: "IN", category: "CSR & Program Sosial", sub_category: "Ambulance", amount: 750000, notes: "Infaq Operasional Bahan Bakar Ambulans", pj_name: "Admin Sosial", proof_url: "", created_at: "2026-09-22T11:20:00Z" },
    { trx_id: "TRX-260921-106", date: "2026-09-21", type: "OUT", category: "Maintenance Gedung", sub_category: "Servis AC", amount: 450000, notes: "Cuci & Tambah Freon AC Ruang Utama Lt 1 (3 Unit)", pj_name: "Marbot Rizki", proof_url: "", created_at: "2026-09-21T16:45:00Z" },
    { trx_id: "TRX-260920-107", date: "2026-09-20", type: "IN", category: "Tromol Masjid", sub_category: "Kotak Infaq Shalat Jumat", amount: 8750000, notes: "Penghitungan Kotak Infaq Jumat Pekan 3", pj_name: "Bendahara", proof_url: "", created_at: "2026-09-20T13:00:00Z" }
  ],
  ubudiyah: [
    { agenda_id: "UBD-001", type: "Kajian Rutin", title: "Kitab Tauhid - Bab Hakikat Ibadah", ustadz_name: "Ust. Abdullah Roy, M.A.", date_time: "Setiap Ahad Ba'da Maghrib", fee_budget: 1200000, fee_realization: 1200000, status: "Terjadwal" },
    { agenda_id: "UBD-002", type: "Khutbah Jumat", title: "Menjaga Keikhlasan dalam Beramal Shalih", ustadz_name: "Ust. Dr. Muhammad Arifin Badri", date_time: "Jumat, 11.45 WIB", fee_budget: 1000000, fee_realization: 1000000, status: "Terjadwal" },
    { agenda_id: "UBD-003", type: "Kajian Tematik", title: "Fiqih Muamalah & Riba Kontemporer", ustadz_name: "Ust. Erwandi Tarmizi, Ph.D.", date_time: "Sabtu Pekan 2 Ba'da Ashar", fee_budget: 3000000, fee_realization: 0, status: "Disiapkan" },
    { agenda_id: "UBD-004", type: "Kajian Muslimah", title: "Fiqih Thaharah & Shalat Wanita", ustadz_name: "Usth. Ummu Ihsan Choiriyah", date_time: "Selasa Pagi, 09.00 WIB", fee_budget: 900000, fee_realization: 900000, status: "Terjadwal" }
  ],
  multimedia: [
    { asset_id: "AST-001", item_name: "Sony Alpha A7 IV (Kamera Utama)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Media Rizki", last_maintenance: "2026-09-01" },
    { asset_id: "AST-002", item_name: "Wireless Mic Shure BLX288/PG58 (2 Mic)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Audio Fajar", last_maintenance: "2026-09-10" },
    { asset_id: "AST-003", item_name: "Video Switcher Blackmagic ATEM Mini Pro", status: "Dipakai", rental_cost: 0, pic_name: "Operator Media", last_maintenance: "2026-08-20" },
    { asset_id: "AST-004", item_name: "Soundcraft Signature 16-Ch Audio Mixer", status: "Tersedia", rental_cost: 0, pic_name: "Tim Audio Fajar", last_maintenance: "2026-09-15" },
    { asset_id: "AST-005", item_name: "Lighting Godox SL-60W LED Video Light (2 Unit)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Media Rizki", last_maintenance: "2026-09-05" }
  ],
  household: [
    { ticket_id: "TCK-001", division: "Kebersihan", area: "Lantai 1", item: "Karbol Pinus & Sabun Cuci Tangan", qty: "4 Jerigen", cost: 280000, pic_marbot: "Marbot Ahmad", status: "Selesai" },
    { ticket_id: "TCK-002", division: "Fisik", area: "Lantai 2", item: "Ganti Lampu LED Philips 18W", qty: "6 Pcs", cost: 210000, pic_marbot: "Marbot Bambang", status: "Selesai" },
    { ticket_id: "TCK-003", division: "Fisik", area: "Lantai 1", item: "Servis Rutin AC Daikin 2 PK Ruang Utama", qty: "3 Unit", cost: 450000, pic_marbot: "Marbot Rizki", status: "Pending" },
    { ticket_id: "TCK-004", division: "Kebersihan", area: "Lantai 2", item: "Pembersih Karpet & Pengharum Ruangan", qty: "2 Botol", cost: 140000, pic_marbot: "Marbot Bambang", status: "Dalam Proses" }
  ],
  social: [
    { service_id: "SOC-001", service_type: "Ambulance", requester_name: "Bpk. Suhardi", phone: "0813-8899-7766", date_reserved: "2026-09-26", destination_or_detail: "Antar Pasien Rujukan ke RSUD Pasar Rebo", status: "Terkonfirmasi" },
    { service_id: "SOC-002", service_type: "Siber Air", requester_name: "Pos Siber Depan Masjid", phone: "-", date_reserved: "2026-09-24", destination_or_detail: "Ganti Filter Karbon Aktif & Sedimen 0.1 Micron (TDS: 12 ppm, 150 Galon terisi)", status: "Selesai" },
    { service_id: "SOC-003", service_type: "Jenazah", requester_name: "Keluarga Alm. Bpk. Hamdan", phone: "0812-9988-1122", date_reserved: "2026-09-22", destination_or_detail: "Pemandian Jenazah & Pengantaran TPU Pondok Kelapa", status: "Selesai" }
  ],
  tpq_students: [
    { student_id: "SAN-001", full_name: "Muhammad Fatih Al-Ayyubi", parent_phone: "081299887766", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-002", full_name: "Aisyah Nurul Jannah", parent_phone: "081311223344", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-003", full_name: "Ibrahim Al-Ghazi", parent_phone: "081544556677", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-004", full_name: "Maryam Khairunnisa", parent_phone: "081877665544", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-005", full_name: "Zaid bin Haritsah", parent_phone: "081233445566", monthly_fee: 150000, status_active: "Aktif" }
  ],
  tpq_payments: [
    { payment_id: "PAY-001", student_id: "SAN-001", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-05", receiver_staff: "Usth. Fatimah" },
    { payment_id: "PAY-002", student_id: "SAN-002", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-06", receiver_staff: "Usth. Fatimah" },
    { payment_id: "PAY-003", student_id: "SAN-003", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-10", receiver_staff: "Usth. Fatimah" }
  ]
};

class StateStore {
  constructor() {
    this.listeners = {};
    this.currentUser = JSON.parse(localStorage.getItem("mbj_auth_user") || 'null') || {
      user_id: "USR-001",
      username: "admin",
      role: "SuperAdmin",
      token: "demo-token"
    };

    this.activeRoute = window.location.hash ? window.location.hash.replace("#", "") : "dashboard";
    this.gasConnected = false;
    this.isSyncing = false;
    this.isSidebarOpen = typeof window !== "undefined" ? (window.innerWidth >= 1024) : true;

    // Load persisted state or initialize with seed data
    this.data = {
      transactions: this.loadStorage("transactions", INITIAL_SEEDS.transactions),
      ubudiyah: this.loadStorage("ubudiyah", INITIAL_SEEDS.ubudiyah),
      multimedia: this.loadStorage("multimedia", INITIAL_SEEDS.multimedia),
      household: this.loadStorage("household", INITIAL_SEEDS.household),
      social: this.loadStorage("social", INITIAL_SEEDS.social),
      tpq_students: this.loadStorage("tpq_students", INITIAL_SEEDS.tpq_students),
      tpq_payments: this.loadStorage("tpq_payments", INITIAL_SEEDS.tpq_payments)
    };
  }

  loadStorage(key, fallback) {
    const raw = localStorage.getItem(`mbj_${key}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return fallback;
  }

  saveStorage(key) {
    localStorage.setItem(`mbj_${key}`, JSON.stringify(this.data[key]));
    this.emit(`change:${key}`, this.data[key]);
    this.emit('state:updated', { key, data: this.data[key] });
  }

  // Pub/Sub Event System
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try { cb(payload); } catch (err) { console.error("Event listener error:", err); }
      });
    }
  }

  // Role & Auth Management
  setRole(role) {
    if (!this.currentUser) {
      this.currentUser = { user_id: "USR-DEV", username: role.toLowerCase(), role: role };
    } else {
      this.currentUser.role = role;
    }
    localStorage.setItem("mbj_auth_user", JSON.stringify(this.currentUser));
    this.emit("auth:change", this.currentUser);
    Utils.showToast(`Mode pengguna berganti ke role: ${role}`, "info");

    if (role === "Public" && window.location.hash !== "#portal") {
      window.location.hash = "#portal";
    } else if (role !== "Public" && (window.location.hash === "#portal" || !window.location.hash)) {
      window.location.hash = "#dashboard";
    }
  }

  login(userObj) {
    this.currentUser = userObj;
    localStorage.setItem("mbj_auth_user", JSON.stringify(userObj));
    this.emit("auth:change", this.currentUser);
  }

  logout() {
    this.currentUser = { user_id: "PUBLIC", username: "tamu", role: "Public" };
    localStorage.removeItem("mbj_auth_user");
    this.emit("auth:change", this.currentUser);
    window.location.hash = "#portal";
  }

  // Transactions CRUD
  addTransaction(trx) {
    if (!trx.trx_id) trx.trx_id = Utils.generateId("TRX-");
    if (!trx.created_at) trx.created_at = new Date().toISOString();
    this.data.transactions.unshift(trx);
    this.saveStorage("transactions");
    return trx;
  }

  deleteTransaction(trxId) {
    this.data.transactions = this.data.transactions.filter(t => t.trx_id !== trxId);
    this.saveStorage("transactions");
  }

  // Generic Item Add/Update/Delete
  addItem(entity, item, idKey, prefix) {
    if (!item[idKey]) item[idKey] = Utils.generateId(prefix);
    this.data[entity].unshift(item);
    this.saveStorage(entity);
    return item;
  }

  updateItem(entity, id, updates, idKey) {
    const idx = this.data[entity].findIndex(it => it[idKey] === id);
    if (idx !== -1) {
      this.data[entity][idx] = { ...this.data[entity][idx], ...updates };
      this.saveStorage(entity);
      return true;
    }
    return false;
  }

  deleteItem(entity, id, idKey) {
    this.data[entity] = this.data[entity].filter(it => it[idKey] !== id);
    this.saveStorage(entity);
  }

  // TPQ Payment recording (automatically creates an income transaction)
  recordTPQPayment(payment) {
    if (!payment.payment_id) payment.payment_id = Utils.generateId("PAY-");
    this.data.tpq_payments.unshift(payment);
    this.saveStorage("tpq_payments");

    const student = this.data.tpq_students.find(s => s.student_id === payment.student_id);
    const studentName = student ? student.full_name : payment.student_id;

    // Automatic Inflow Ledger Entry
    this.addTransaction({
      trx_id: Utils.generateId("TRX-TPQ-"),
      date: payment.date_paid,
      type: "IN",
      category: "Penerimaan TPQ",
      sub_category: `SPP Bulanan (${payment.period_month_year})`,
      amount: parseFloat(payment.amount_paid) || 0,
      notes: `SPP Santri: ${studentName} [${payment.student_id}]`,
      pj_name: payment.receiver_staff || "Admin TPQ",
      proof_url: ""
    });

    return payment;
  }

  // Metrics and Aggregations
  getFinancialSummary() {
    let totalIn = 0;
    let totalOut = 0;
    let thisMonthIn = 0;
    let thisMonthOut = 0;

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.data.transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      const dateStr = (t.date || "").toString();
      const isThisMonth = dateStr.startsWith(currentYearMonth);

      if (t.type === "IN") {
        totalIn += amt;
        if (isThisMonth) thisMonthIn += amt;
      } else if (t.type === "OUT") {
        totalOut += amt;
        if (isThisMonth) thisMonthOut += amt;
      }
    });

    return {
      balance: totalIn - totalOut,
      totalIn,
      totalOut,
      thisMonthIn,
      thisMonthOut,
      thisMonthNet: thisMonthIn - thisMonthOut
    };
  }

  // Reset database back to seed data
  resetToFactoryDefaults() {
    Object.keys(INITIAL_SEEDS).forEach(key => {
      this.data[key] = JSON.parse(JSON.stringify(INITIAL_SEEDS[key]));
      this.saveStorage(key);
    });
    localStorage.removeItem("mbj_config");
    ConfigManager.applyTheme();
    Utils.showToast("Data berhasil direset ke pengaturan awal.", "info");
  }
}

// Instantiate global singleton
const state = new StateStore();


/* === js/api.js === */
/**
 * ==============================================================================
 * API SERVICE (GOOGLE APPS SCRIPT INTEGRATION)
 * Seamless REST Connector with Fallback, Timeout & Retry Handling
 * ==============================================================================
 */

class ApiService {
  static getEndpoint() {
    return ConfigManager.get("gas_web_app_url") || "";
  }

  static isConfigured() {
    const url = this.getEndpoint().trim();
    return url.length > 10 && url.startsWith("https://script.google.com");
  }

  // Test live connection with Google Apps Script
  static async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, message: "URL Google Apps Script belum diisi." };
    }

    try {
      const url = `${this.getEndpoint()}?action=ping`;
      const response = await fetch(url, { method: "GET", mode: "cors" });
      const data = await response.json();
      if (data && data.status === "success") {
        state.gasConnected = true;
        state.emit("gas:status", true);
        return { success: true, data };
      }
      return { success: false, message: data.message || "Respon GAS tidak sesuai." };
    } catch (err) {
      state.gasConnected = false;
      state.emit("gas:status", false);
      return { success: false, message: "Gagal terhubung ke GAS: " + err.message };
    }
  }

  // Fetch all tables from Google Sheets and update local state
  static async syncFromGAS() {
    if (!this.isConfigured()) {
      Utils.showToast("Mode Demo / Lokal Aktif (URL Google Apps Script belum diatur)", "info");
      return;
    }

    state.isSyncing = true;
    state.emit("sync:start");

    try {
      const url = `${this.getEndpoint()}?action=getAllData`;
      const res = await fetch(url, { method: "GET", mode: "cors" });
      const resJson = await res.json();

      if (resJson.status === "success" && resJson.data) {
        const d = resJson.data;
        if (d.config) ConfigManager.setMany(d.config);
        if (d.transactions) { state.data.transactions = d.transactions; state.saveStorage("transactions"); }
        if (d.ubudiyah) { state.data.ubudiyah = d.ubudiyah; state.saveStorage("ubudiyah"); }
        if (d.multimedia) { state.data.multimedia = d.multimedia; state.saveStorage("multimedia"); }
        if (d.household) { state.data.household = d.household; state.saveStorage("household"); }
        if (d.social) { state.data.social = d.social; state.saveStorage("social"); }
        if (d.tpq_students) { state.data.tpq_students = d.tpq_students; state.saveStorage("tpq_students"); }
        if (d.tpq_payments) { state.data.tpq_payments = d.tpq_payments; state.saveStorage("tpq_payments"); }

        state.gasConnected = true;
        state.emit("gas:status", true);
        Utils.showToast("Sinkronisasi Google Sheets Berhasil!", "success");
      } else {
        throw new Error(resJson.message || "Gagal memuat data dari Sheets");
      }
    } catch (err) {
      console.warn("GAS Fetch fallback:", err);
      state.gasConnected = false;
      state.emit("gas:status", false);
      Utils.showToast("Gagal sync dengan GAS. Menggunakan data offline.", "warning");
    } finally {
      state.isSyncing = false;
      state.emit("sync:end");
    }
  }

  // Send Action to GAS (Creates/Updates/Deletes)
  static async postAction(action, data = {}) {
    if (!this.isConfigured()) {
      // Offline local mode fallback (state already updated by caller)
      return { status: "success", message: "Disimpan di database lokal (Offline mode)" };
    }

    try {
      const url = this.getEndpoint();
      const payload = { action, ...data };

      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors", // Google Apps Script redirects require handling or no-cors mode
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return { status: "success", message: "Data terkirim ke Google Sheets" };
    } catch (err) {
      console.warn("GAS Post error:", err);
      return { status: "warning", message: "Tersimpan lokal (GAS sync error: " + err.message + ")" };
    }
  }

  // Trigger Google Sheets Database Setup
  static async triggerSetupDatabase() {
    if (!this.isConfigured()) {
      return { success: false, message: "Isi URL Web App Google Apps Script terlebih dahulu." };
    }

    try {
      const url = `${this.getEndpoint()}?action=setupDatabase`;
      const res = await fetch(url, { method: "GET", mode: "cors" });
      const json = await res.json();
      return { success: json.status === "success", message: json.message || "Selesai" };
    } catch (err) {
      return { success: false, message: "Error setup: " + err.message };
    }
  }
}


/* === js/components/navbar.js === */
/**
 * ==============================================================================
 * COMPONENT: NAVBAR (TOPBAR)
 * White-Label Header, Running Text Marquee, Live Hijri Clock, Status & Role Switcher
 * ==============================================================================
 */

const NavbarComponent = {
  render: function() {
    const config = ConfigManager.getAll();
    const currentUser = state.currentUser;
    const isMarquee = config.running_text_enabled !== "false" && config.running_text;

    return `
      <header class="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <!-- Top Banner / Marquee Notice -->
        ${isMarquee ? `
          <div class="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-4 py-1.5 text-xs font-medium flex items-center shadow-inner overflow-hidden">
            <div class="flex items-center gap-1.5 flex-shrink-0 mr-3 font-semibold text-amber-300">
              <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <i data-lucide="megaphone" class="w-3.5 h-3.5"></i>
              <span>INFO MASJID:</span>
            </div>
            <div class="marquee-container flex-1 cursor-pointer" onclick="window.location.hash='#settings'" title="Klik untuk edit pengumuman di CMS Settings">
              <div class="marquee-content tracking-wide font-normal">
                ${config.running_text}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Main Navigation Bar -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-18">
            
            <!-- Left: Sidebar Toggle Trigger + Brand Logo & Title -->
            <div class="flex items-center gap-3">
              <button id="btn-toggle-sidebar" onclick="App.toggleSidebar()" class="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 focus:outline-none transition flex items-center justify-center cursor-pointer shadow-sm" title="Buka / Tutup Sidebar">
                <i data-lucide="menu" class="w-5 h-5"></i>
              </button>

              <div class="flex items-center gap-2.5 cursor-pointer select-none" onclick="window.location.hash='#dashboard'">
                <img src="${config.logo_url}" alt="Logo Masjid" class="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-md bg-white p-0.5" onerror="this.src='https://ui-avatars.com/api/?name=MBJ&background=059669&color=fff'">
                <div>
                  <div class="font-bold text-sm sm:text-lg text-slate-900 dark:text-white leading-tight tracking-tight">
                    <span class="sm:hidden">Masjid MBJ</span>
                    <span class="hidden sm:inline">${config.mosque_name}</span>
                  </div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs hidden sm:block">${config.mosque_tagline}</div>
                </div>
              </div>
            </div>

            <!-- Center: Live Hijri & Gregorian Clock -->
            <div class="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <i data-lucide="calendar" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></i>
              <span id="nav-gregorian-date">${Utils.formatDateIndo(new Date())}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span id="nav-hijri-date" class="text-emerald-700 dark:text-emerald-300 font-semibold">${Utils.getHijriDate()}</span>
              <span class="text-slate-300 dark:text-slate-600">•</span>
              <span id="nav-clock" class="font-mono text-slate-700 dark:text-slate-200 font-bold">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <!-- Right Controls: Quick Actions, Role Switcher, Sound & Profile -->
            <div class="flex items-center gap-1.5 sm:gap-3">
              
              <!-- GAS Connection Status Indicator -->
              <div class="flex items-center">
                <button id="btn-sync-gas" title="Sinkronisasi Data dengan Google Sheets" class="flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <span class="w-2 h-2 rounded-full ${ApiService.isConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}"></span>
                  <span class="hidden xl:inline text-slate-600 dark:text-slate-300 font-medium">${ApiService.isConfigured() ? 'Sheets Sync' : 'Offline / Demo'}</span>
                  <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-400 ${state.isSyncing ? 'animate-spin' : ''}"></i>
                </button>
              </div>

              <!-- Public Portal Quick Link -->
              <button onclick="window.location.hash='#portal'" class="hidden sm:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Lihat Portal Publik Jamaah">
                <i data-lucide="globe" class="w-5 h-5 text-emerald-600"></i>
              </button>

              <!-- Sound Toggle -->
              <button id="btn-toggle-sound" class="hidden sm:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Toggle Suara Notifikasi & Kasir">
                <i data-lucide="${ConfigManager.get('sound_enabled') === 'false' ? 'volume-x' : 'volume-2'}" class="w-5 h-5 text-slate-500"></i>
              </button>

              <!-- Role Switcher Quick Dropdown -->
              <div class="relative">
                <select id="select-active-role" class="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold py-1.5 px-2 sm:px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 focus:outline-none cursor-pointer max-w-[125px] sm:max-w-none truncate">
                  <option value="SuperAdmin" ${currentUser.role === 'SuperAdmin' ? 'selected' : ''}>👑 Super Admin</option>
                  <option value="Bendahara" ${currentUser.role === 'Bendahara' ? 'selected' : ''}>💰 Bendahara</option>
                  <option value="Marbot" ${currentUser.role === 'Marbot' ? 'selected' : ''}>🧹 Marbot & RT</option>
                  <option value="AdminTPQ" ${currentUser.role === 'AdminTPQ' ? 'selected' : ''}>🎓 Admin TPQ</option>
                  <option value="AdminSosial" ${currentUser.role === 'AdminSosial' ? 'selected' : ''}>🚑 Admin CSR</option>
                  <option value="Public" ${currentUser.role === 'Public' ? 'selected' : ''}>🌐 Portal Jamaah</option>
                </select>
              </div>

            </div>

          </div>
        </div>
      </header>
    `;
  },

  initListeners: function() {
    // Role change listener
    const roleSelect = document.getElementById("select-active-role");
    if (roleSelect) {
      roleSelect.addEventListener("change", (e) => {
        state.setRole(e.target.value);
      });
    }

    // Sound toggle listener
    const soundBtn = document.getElementById("btn-toggle-sound");
    if (soundBtn) {
      soundBtn.addEventListener("click", () => {
        const current = ConfigManager.get("sound_enabled");
        const next = current === "false" ? "true" : "false";
        ConfigManager.set("sound_enabled", next);
        Utils.showToast(`Efek suara kasir: ${next === 'true' ? 'Aktif' : 'Dinonaktifkan'}`, "info");
        App.renderNavbar();
      });
    }

    // Google Sheets Sync button listener
    const syncBtn = document.getElementById("btn-sync-gas");
    if (syncBtn) {
      syncBtn.addEventListener("click", async () => {
        if (!ApiService.isConfigured()) {
          Utils.showToast("Buka menu Pengaturan CMS untuk menghubungkan URL Google Apps Script.", "info");
          window.location.hash = "#settings";
          return;
        }
        await ApiService.syncFromGAS();
        App.renderView();
      });
    }

    // Live clock ticker
    setInterval(() => {
      const clockEl = document.getElementById("nav-clock");
      if (clockEl) {
        clockEl.textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }, 1000);
  }
};


/* === js/components/sidebar.js === */
/**
 * ==============================================================================
 * COMPONENT: SIDEBAR
 * Enterprise Role-Based Dynamic Navigation Menu with Categorized Sections,
 * Public Portal Quick-Jumps, Toggle Drawer & Interactive Badges
 * ==============================================================================
 */

const SidebarComponent = {
  // Navigation groupings for DKM Management
  getDkmMenuGroups: function(role) {
    const groups = [
      {
        title: "KEUANGAN & KASIR",
        items: [
          { id: "dashboard", label: "Dashboard Ringkasan", icon: "layout-dashboard", roles: ["SuperAdmin", "Bendahara", "Marbot", "AdminTPQ", "AdminSosial"] },
          { id: "pos", label: "Smart POS & Kasir", icon: "calculator", badge: "KASIR", badgeColor: "bg-emerald-500", roles: ["SuperAdmin", "Bendahara"] },
          { id: "transactions", label: "Jurnal & Buku Kas", icon: "receipt", roles: ["SuperAdmin", "Bendahara"] }
        ]
      },
      {
        title: "DIVISI & PELAYANAN",
        items: [
          { id: "ubudiyah", label: "Ubudiyah & Khotib", icon: "calendar-days", badge: `${(state.data.ubudiyah || []).length} Agenda`, badgeColor: "bg-teal-600/80", roles: ["SuperAdmin", "Bendahara"] },
          { id: "multimedia", label: "Multimedia & Aset", icon: "video", badge: `${(state.data.multimedia || []).length} Aset`, badgeColor: "bg-indigo-600/80", roles: ["SuperAdmin"] },
          { id: "facilities", label: "Fasilitas & Marbot", icon: "sparkles", badge: `${(state.data.household || []).filter(t => t.status !== 'Selesai').length} Task`, badgeColor: "bg-amber-600/80", roles: ["SuperAdmin", "Marbot"] },
          { id: "social", label: "CSR & Ambulans", icon: "heart-handshake", badge: `${(state.data.social || []).filter(s => s.status !== 'Selesai').length} Siaga`, badgeColor: "bg-rose-600/80", roles: ["SuperAdmin", "AdminSosial"] },
          { id: "tpq", label: "TPQ & SPP Santri", icon: "graduation-cap", badge: `${(state.data.tpq_students || []).length} Santri`, badgeColor: "bg-blue-600/80", roles: ["SuperAdmin", "AdminTPQ", "Bendahara"] }
        ]
      },
      {
        title: "PORTAL & CMS",
        items: [
          { id: "portal", label: "Portal Publik Jamaah", icon: "globe", badge: "LIVE", badgeColor: "bg-emerald-600", roles: ["SuperAdmin", "Bendahara", "Marbot", "AdminTPQ", "AdminSosial"] },
          { id: "settings", label: "CMS Appearance Studio", icon: "palette", roles: ["SuperAdmin"] }
        ]
      }
    ];

    // Filter items based on current active role
    return groups.map(group => {
      return {
        title: group.title,
        items: group.items.filter(item => item.roles.includes(role) || role === "SuperAdmin")
      };
    }).filter(group => group.items.length > 0);
  },

  // Navigation items for Public Portal Visitors (Jamaah)
  getPublicNavItems: function() {
    return [
      { id: "portal", label: "Beranda Portal MBJ", icon: "globe", isAnchor: false, badge: "Utama", badgeColor: "bg-emerald-500" },
      { id: "portal-kas", label: "Transparansi Kas Riil", icon: "shield-check", isAnchor: true },
      { id: "portal-agenda", label: "Jadwal Kajian & Khutbah", icon: "calendar", isAnchor: true },
      { id: "portal-csr", label: "Ambulans & Layanan CSR", icon: "heart-handshake", isAnchor: true },
      { id: "digital-infaq-section", label: "Infaq QRIS & Donasi", icon: "qr-code", isAnchor: true },
      { id: "portal-bank", label: "Rekening Bank & Donasi", icon: "landmark", isAnchor: true }
    ];
  },

  scrollToSection: function(targetId) {
    if (state.activeRoute !== "portal") {
      window.location.hash = "#portal";
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Auto close sidebar on mobile
    if (window.innerWidth < 1024) {
      App.toggleSidebar(false);
    }
  },

  render: function() {
    const currentUser = state.currentUser;
    const currentRoute = state.activeRoute;
    const isPublic = currentUser.role === "Public";
    const finSummary = state.getFinancialSummary();
    const config = ConfigManager.getAll();
    const isOpen = state.isSidebarOpen;

    return `
      <aside id="app-sidebar" class="fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col justify-between pt-16 sm:pt-18 pb-4 shadow-xl">
        
        <!-- Sidebar Header with Close Trigger -->
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${isPublic ? 'bg-teal-500' : 'bg-emerald-500'} animate-pulse"></span>
            <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
              ${isPublic ? 'Portal Jamaah' : 'Panel Pengurus DKM'}
            </span>
          </div>
          <button onclick="App.toggleSidebar(false)" class="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer" title="Tutup Menu Sidebar">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Navigation Link Groups (Scrollable) -->
        <div class="px-3 py-3 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          
          ${isPublic ? `
            <!-- PUBLIC PORTAL NAVIGATION -->
            <div>
              <div class="px-3 pb-2 flex items-center justify-between">
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  NAVIGASI CEPAT
                </span>
                <span class="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Publik
                </span>
              </div>

              <div class="space-y-1">
                ${this.getPublicNavItems().map(item => {
                  const isActive = !item.isAnchor && currentRoute === "portal";
                  return `
                    <a href="#${item.isAnchor ? 'portal' : item.id}" onclick="${item.isAnchor ? `SidebarComponent.scrollToSection('${item.id}'); return false;` : ''}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800/60 hover:text-emerald-700 dark:hover:text-emerald-400'
                    }">
                      <div class="flex items-center gap-2.5 truncate">
                        <i data-lucide="${item.icon}" class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}"></i>
                        <span class="truncate">${item.label}</span>
                      </div>
                      ${item.badge ? `
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${item.badgeColor || 'bg-slate-500'}">
                          ${item.badge}
                        </span>
                      ` : ''}
                    </a>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Switch to DKM Management Quick Card -->
            <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-lg space-y-2">
              <div class="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <i data-lucide="shield" class="w-4 h-4 text-amber-400"></i>
                <span>Akses Pengurus DKM</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Kelola buku kas, POS kasir, jadwal khotib, dan divisi masjid.
              </p>
              <button onclick="state.setRole('SuperAdmin'); window.location.hash='#dashboard';" class="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer">
                <i data-lucide="log-in" class="w-3.5 h-3.5"></i>
                <span>Masuk Dashboard DKM</span>
              </button>
            </div>
          ` : `
            <!-- DKM MANAGEMENT CATEGORIZED NAVIGATION -->
            ${this.getDkmMenuGroups(currentUser.role).map(group => `
              <div class="space-y-1">
                <div class="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  ${group.title}
                </div>
                ${group.items.map(item => {
                  const isActive = currentRoute === item.id;
                  return `
                    <a href="#${item.id}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }">
                      <div class="flex items-center gap-2.5 truncate">
                        <i data-lucide="${item.icon}" class="w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}"></i>
                        <span class="truncate">${item.label}</span>
                      </div>
                      ${item.badge ? `
                        <span class="text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${item.badgeColor || 'bg-slate-500'}">
                          ${item.badge}
                        </span>
                      ` : ''}
                    </a>
                  `;
                }).join('')}
              </div>
            `).join('')}
          `}

        </div>

        <!-- Bottom Sidebar Section -->
        <div class="px-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          
          ${!isPublic ? `
            <!-- Mini Cash Balance Summary Card (DKM Mode) -->
            <div class="p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <div class="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center justify-between">
                <span>Saldo Kas Masjid</span>
                <i data-lucide="wallet" class="w-3.5 h-3.5 text-emerald-600"></i>
              </div>
              <div class="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                ${Utils.formatRupiah(finSummary.balance)}
              </div>
              <div class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-between">
                <span>Bulan ini:</span>
                <span class="font-semibold text-emerald-600">+${Utils.formatRupiah(finSummary.thisMonthNet, false)}</span>
              </div>
            </div>

            <!-- DKM User Role Status & Switcher -->
            <div class="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
              <div class="flex items-center gap-2 truncate">
                <span class="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
                <span class="font-medium text-slate-700 dark:text-slate-300 truncate">${currentUser.username} (${currentUser.role})</span>
              </div>
              <button onclick="state.logout()" title="Keluar ke Portal Jamaah" class="p-1 hover:text-rose-600 transition cursor-pointer">
                <i data-lucide="log-out" class="w-4 h-4"></i>
              </button>
            </div>
          ` : `
            <!-- Public Mode Jamaah Contact Card -->
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-1">
              <div class="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                Layanan Umat 24 Jam
              </div>
              <div class="text-xs font-bold text-slate-800 dark:text-slate-200">
                ${config.mosque_phone || '0812-3456-7890'}
              </div>
            </div>
          `}

        </div>

      </aside>

      <!-- Mobile Backdrop Overlay -->
      <div id="sidebar-backdrop" onclick="App.toggleSidebar(false)" class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm ${isOpen && (typeof window !== 'undefined' && window.innerWidth < 1024) ? '' : 'hidden'} lg:hidden transition-opacity cursor-pointer"></div>
    `;
  },

  initListeners: function() {
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
      // Auto close on navigation in mobile
      sidebar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth < 1024) {
            App.toggleSidebar(false);
          }
        });
      });
    }
  }
};


/* === js/components/bottomnav.js === */
/**
 * ==============================================================================
 * COMPONENT: BOTTOM NAVIGATION (MOBILE APP BAR)
 * Native Android & iOS Navigation Bar with Role-Adaptive Quick Actions
 * ==============================================================================
 */

const BottomNavComponent = {
  render: function() {
    const currentUser = state.currentUser;
    const currentRoute = state.activeRoute;
    const isPublic = currentUser.role === "Public";

    // Navigation items for DKM Roles
    const dkmItems = [
      { id: "dashboard", label: "Ringkasan", icon: "layout-dashboard", isAction: false },
      { id: "pos", label: "POS Kasir", icon: "calculator", isAction: false, isHero: true },
      { id: "transactions", label: "Buku Kas", icon: "receipt", isAction: false },
      { id: "ubudiyah", label: "Ubudiyah", icon: "calendar-days", isAction: false },
      { id: "open_sidebar", label: "Menu", icon: "menu", isAction: true }
    ];

    // Navigation items for Jamaah / Public Mode
    const publicItems = [
      { id: "portal", label: "Portal", icon: "globe", isAnchor: false },
      { id: "portal-kas", label: "Kas Riil", icon: "shield-check", isAnchor: true },
      { id: "portal-agenda", label: "Kajian", icon: "calendar", isAnchor: true },
      { id: "portal-csr", label: "Ambulans", icon: "heart-handshake", isAnchor: true },
      { id: "digital-infaq-section", label: "Infaq QRIS", icon: "qr-code", isAnchor: true, isHero: true }
    ];

    const items = isPublic ? publicItems : dkmItems;

    return `
      <nav id="app-bottom-nav" class="lg:hidden mobile-bottom-bar flex items-center justify-around px-2 py-1.5 shadow-2xl">
        ${items.map(item => {
          if (item.isAction) {
            return `
              <button onclick="App.toggleSidebar()" class="touch-press flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition min-w-[56px]" title="Buka Semua Menu">
                <i data-lucide="${item.icon}" class="w-5 h-5 mb-0.5 text-slate-600 dark:text-slate-300"></i>
                <span class="text-[10px] font-semibold tracking-tight">${item.label}</span>
              </button>
            `;
          }

          if (item.isAnchor) {
            return `
              <button onclick="SidebarComponent.scrollToSection('${item.id}')" class="touch-press flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition min-w-[56px]">
                ${item.isHero ? `
                  <div class="w-10 h-10 -mt-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 ring-4 ring-white dark:ring-slate-900 border border-amber-300">
                    <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                  </div>
                  <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">${item.label}</span>
                ` : `
                  <i data-lucide="${item.icon}" class="w-5 h-5 mb-0.5 text-slate-500 dark:text-slate-400"></i>
                  <span class="text-[10px] font-semibold tracking-tight">${item.label}</span>
                `}
              </button>
            `;
          }

          const isActive = currentRoute === item.id;
          return `
            <a href="#${item.id}" class="touch-press flex flex-col items-center justify-center py-1 px-2 rounded-xl transition min-w-[56px] ${
              isActive 
                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
            }">
              ${item.isHero ? `
                <div class="w-10 h-10 -mt-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 ring-4 ring-white dark:ring-slate-900 ${
                  isActive ? 'ring-emerald-200 dark:ring-emerald-800' : ''
                }">
                  <i data-lucide="${item.icon}" class="w-5 h-5"></i>
                </div>
                <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">${item.label}</span>
              ` : `
                <i data-lucide="${item.icon}" class="w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}"></i>
                <span class="text-[10px] ${isActive ? 'font-bold' : 'font-semibold'} tracking-tight">${item.label}</span>
              `}
            </a>
          `;
        }).join('')}
      </nav>
    `;
  },

  initListeners: function() {
    // Re-trigger icon rendering
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  }
};


/* === js/components/dashboard.js === */
/**
 * ==============================================================================
 * COMPONENT: DASHBOARD (EXECUTIVE OVERVIEW)
 * Real-time Financial Ledger Metrics, Chart.js Visualizations & Division Cards
 * ==============================================================================
 */

const DashboardComponent = {
  render: function() {
    const config = ConfigManager.getAll();
    const fin = state.getFinancialSummary();
    const transactions = state.data.transactions.slice(0, 5);
    const upcomingAgendas = state.data.ubudiyah.slice(0, 3);
    const pendingTickets = state.data.household.filter(t => t.status !== "Selesai").slice(0, 3);
    const activeSantriCount = state.data.tpq_students.filter(s => s.status_active === "Aktif").length;
    const ambulanceReqs = state.data.social.filter(s => s.service_type === "Ambulance" && s.status !== "Selesai");

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Welcome Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-xs font-semibold text-emerald-200 mb-2">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>SaaS-Ready DKM Management Engine</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">${config.mosque_name}</h1>
              <p class="text-emerald-100 text-sm mt-1 max-w-xl">${config.mosque_tagline} — Transparansi Keuangan, Pelayanan Umat & Manajemen Terintegrasi.</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <a href="#pos" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5">
                <i data-lucide="calculator" class="w-4 h-4"></i>
                <span>Buka Smart POS Kasir</span>
              </a>
              <button onclick="App.openQuickTransactionModal('IN')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold text-sm border border-emerald-400/30 transition">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Input Kas Cepat</span>
              </button>
            </div>
          </div>
          
          <!-- Background Geometric Accent -->
          <div class="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl"></div>
        </div>

        <!-- Financial KPI Cards Grid (4 Cards) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Total Balance -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Saldo Kas</span>
              <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <i data-lucide="vault" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-3">
              ${Utils.formatRupiah(fin.balance)}
            </div>
            <div class="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Kas Riil Terverifikasi</span>
            </div>
          </div>

          <!-- Inflow Month -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pemasukan Bulan Ini</span>
              <div class="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-teal-600 dark:text-teal-400 mt-3">
              ${Utils.formatRupiah(fin.thisMonthIn)}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Tromol, Donatur & SPP TPQ
            </div>
          </div>

          <!-- Outflow Month -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pengeluaran Bulan Ini</span>
              <div class="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <i data-lucide="trending-down" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-3">
              ${Utils.formatRupiah(fin.thisMonthOut)}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Fee Ustadz, Karbol & Operasional
            </div>
          </div>

          <!-- Monthly Net Surplus -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Surplus Kas Bulan Ini</span>
              <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <i data-lucide="pie-chart" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-3 ${fin.thisMonthNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
              ${Utils.formatRupiah(fin.thisMonthNet)}
            </div>
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              ${fin.thisMonthNet >= 0 ? '🟢 Kas Surplus Terjaga' : '🔴 Defisit Operasional'}
            </div>
          </div>

        </div>

        <!-- Charts Section (2 Columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Bar/Line Cash Flow Chart (2 Cols) -->
          <div class="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Arus Kas Masuk vs Keluar</h3>
                <p class="text-xs text-slate-500">Perbandingan pergerakan dana kas riil</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Inflow</span>
                <span class="inline-flex items-center gap-1 text-xs font-medium text-rose-600"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Outflow</span>
              </div>
            </div>
            <div class="h-64 sm:h-72 w-full">
              <canvas id="cashflow-chart"></canvas>
            </div>
          </div>

          <!-- Category Breakdown Doughnut Chart (1 Col) -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Distribusi Kategori</h3>
              <p class="text-xs text-slate-500 mb-4">Porsi pos pemasukan & pengeluaran</p>
              <div class="h-52 w-full flex items-center justify-center">
                <canvas id="category-chart"></canvas>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <a href="#transactions" class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
                <span>Buka Rincian Buku Kas</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- 3 Divisional Operational Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Ubudiyah Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Ubudiyah & Khotib</h4>
              </div>
              <a href="#ubudiyah" class="text-xs text-emerald-600 font-semibold hover:underline">Kelola</a>
            </div>
            <div class="mt-3 space-y-2.5">
              ${upcomingAgendas.map(item => `
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200">${item.title}</div>
                    <div class="text-slate-500 text-[11px]">${item.ustadz_name}</div>
                    <div class="text-emerald-600 font-medium text-[10px] mt-0.5">${item.date_time}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === 'Terjadwal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${item.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Facilities & Marbot Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600">
                  <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Fasilitas & Marbot</h4>
              </div>
              <a href="#facilities" class="text-xs text-teal-600 font-semibold hover:underline">Kelola</a>
            </div>
            <div class="mt-3 space-y-2.5">
              ${pendingTickets.length === 0 ? `
                <div class="text-center py-6 text-xs text-slate-400">Semua fasilitas dan sanitasi dalam kondisi prima! ✨</div>
              ` : pendingTickets.map(item => `
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200">${item.item} (${item.area})</div>
                    <div class="text-slate-500 text-[11px]">PIC: ${item.pic_marbot} • Qty: ${item.qty}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === 'Pending' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${item.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CSR Social & TPQ Education Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <i data-lucide="heart-handshake" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Sosial & TPQ</h4>
              </div>
              <a href="#social" class="text-xs text-amber-600 font-semibold hover:underline">Rincian</a>
            </div>
            <div class="mt-3 space-y-3">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-600 dark:text-slate-300">Ambulans Siap Siaga</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">STANDBY 24 JAM</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">${ambulanceReqs.length} Permohonan aktif hari ini</div>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-600 dark:text-slate-300">Santri Aktif TPQ</span>
                  <span class="font-bold text-slate-900 dark:text-white">${activeSantriCount} Santri</span>
                </div>
                <div class="text-[11px] text-emerald-600 font-medium mt-1">Sistem SPP Kasir Terintegrasi WA</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Recent Transactions Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
          <div class="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Transaksi Kas Terbaru</h3>
              <p class="text-xs text-slate-500">Mutasi kas masuk dan keluar terkini</p>
            </div>
            <a href="#transactions" class="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">
              <span>Lihat Semua</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">No. Ref / Tanggal</th>
                  <th class="py-3 px-4">Jenis</th>
                  <th class="py-3 px-4">Kategori / Keterangan</th>
                  <th class="py-3 px-4">PJ / Petugas</th>
                  <th class="py-3 px-4 text-right">Jumlah</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${transactions.map(item => {
                  const isIncome = item.type === "IN";
                  return `
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-3 px-4">
                        <div class="font-mono font-bold text-slate-800 dark:text-slate-200">${item.trx_id}</div>
                        <div class="text-[11px] text-slate-400">${Utils.formatDateIndo(item.date)}</div>
                      </td>
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isIncome ? 'badge-in' : 'badge-out'}">
                          <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-3 h-3"></i>
                          <span>${isIncome ? 'PEMASUKAN' : 'PENGELUARAN'}</span>
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="font-semibold text-slate-900 dark:text-slate-100">${item.category}</div>
                        <div class="text-[11px] text-slate-500">${item.sub_category} • ${item.notes}</div>
                      </td>
                      <td class="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        ${item.pj_name || '-'}
                      </td>
                      <td class="py-3 px-4 text-right font-extrabold ${isIncome ? 'text-emerald-600' : 'text-rose-600'} text-sm">
                        ${isIncome ? '+' : '-'}${Utils.formatRupiah(item.amount)}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="App.openThermalReceiptModal('${item.trx_id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition" title="Cetak Struk Thermal">
                          <i data-lucide="printer" class="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  initCharts: function() {
    if (typeof Chart === "undefined") return;

    // 1. Cashflow Bar Chart
    const ctxCash = document.getElementById("cashflow-chart");
    if (ctxCash) {
      const trx = state.data.transactions;
      // Group by last 5 transactions or monthly
      const labels = ["Kotak Jumat", "Donatur", "Kajian", "Logistik Marbot", "Subuh Berkah", "Ambulance", "Servis AC"];
      const inData = [8750000, 5000000, 0, 0, 1450000, 750000, 0];
      const outData = [0, 0, 1200000, 350000, 0, 0, 450000];

      new Chart(ctxCash, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Pemasukan (Inflow)',
              data: inData,
              backgroundColor: '#10b981',
              borderRadius: 6
            },
            {
              label: 'Pengeluaran (Outflow)',
              data: outData,
              backgroundColor: '#f43f5e',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(val) {
                  return 'Rp ' + (val / 1000000) + ' Jt';
                }
              }
            }
          }
        }
      });
    }

    // 2. Category Doughnut Chart
    const ctxCat = document.getElementById("category-chart");
    if (ctxCat) {
      new Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: ['Tromol Masjid', 'Donatur / CSR', 'Fee Ustadz', 'Operasional Marbot', 'Fasilitas & AC'],
          datasets: [{
            data: [55, 25, 10, 5, 5],
            backgroundColor: ['#059669', '#0d9488', '#f59e0b', '#f43f5e', '#6366f1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
          },
          cutout: '65%'
        }
      });
    }
  }
};


/* === js/components/pos.js === */
/**
 * ==============================================================================
 * COMPONENT: SMART POS & FINANCIAL CASHIER
 * Mobile-First Cashier POS with Quick Buttons, Thermal Print & WhatsApp Receipt
 * ==============================================================================
 */

const PosComponent = {
  // Current POS Form State
  formState: {
    type: "IN", // "IN" or "OUT"
    category: "Tromol Masjid",
    sub_category: "Kotak Infaq Jumat",
    amount: 0,
    pj_name: "",
    payer_name: "",
    payer_phone: "",
    notes: "",
    date: new Date().toISOString().slice(0, 10)
  },

  categories: {
    IN: [
      {
        name: "Tromol Masjid",
        icon: "box",
        subs: ["Kotak Infaq Jumat", "Kotak Infaq Subuh", "Kotak Infaq Harian", "Tromol Wanita", "Tromol Parkir"]
      },
      {
        name: "Muhsinin / Donatur",
        icon: "user-check",
        subs: ["Infaq Operasional", "Infaq Dakwah", "Donatur Tetap Bulanan", "Hamba Allah", "Sedekah Beras"]
      },
      {
        name: "CSR & Program Sosial",
        icon: "heart-handshake",
        subs: ["Ambulance", "Siber (Air Minum)", "Layanan Jenazah", "Ubudiyah & Dakwah", "Santunan Yatim"]
      },
      {
        name: "Penerimaan TPQ",
        icon: "graduation-cap",
        subs: ["SPP Santri Bulanan", "Infaq Pendaftaran Santri", "Seragam & Kitab TPQ", "Donasi Pengembangan TPQ"]
      },
      {
        name: "ZISWAF & Infrastruktur",
        icon: "building-2",
        subs: ["Zakat Maal", "Zakat Fitrah", "Fidyah", "Wakaf Pembangunan", "Dana Talangan"]
      }
    ],
    OUT: [
      {
        name: "Fee Ustadz & Khotib",
        icon: "mic",
        subs: ["Khotbah Jumat", "Kajian Rutin Malam Ahad", "Kajian Tematik", "Kajian Muslimah", "Imam Tarawih / Rawatib"],
        presets: [600000, 900000, 1000000, 1200000, 3000000]
      },
      {
        name: "Operasional & Logistik Marbot",
        icon: "sparkles",
        subs: ["Karbol & Pembersih Lt 1", "Karbol & Pembersih Lt 2", "Plastik Sampah Jumbo", "Peralatan Sanitasi", "Honor Marbot"]
      },
      {
        name: "Maintenance Gedung",
        icon: "wrench",
        subs: ["Servis AC Daikin", "Penggantian Stok Lampu", "Pompa Air Wudhu", "Perbaikan Sound System", "Perawatan Genset"]
      },
      {
        name: "Konsumsi & Jamuan",
        icon: "coffee",
        subs: ["Snack & Jamuan Ustadz", "Makan Malam Kajian", "Kopi & Teh Jamaah", "Buka Puasa Sunnah", "Rapat DKM"]
      },
      {
        name: "Biaya Armada & Siber",
        icon: "truck",
        subs: ["BBM & Servis Ambulans", "Penggantian Filter Siber", "TDS Kalibrasi & Sanitasi", "Perawatan Mobil Jenazah"]
      }
    ]
  },

  render: function() {
    const isIncome = this.formState.type === "IN";
    const activeCategories = isIncome ? this.categories.IN : this.categories.OUT;
    const currentCatObj = activeCategories.find(c => c.name === this.formState.category) || activeCategories[0];
    const quickAmounts = isIncome 
      ? [20000, 50000, 100000, 200000, 500000, 1000000, 2500000, 5000000]
      : (currentCatObj.presets || [50000, 100000, 200000, 450000, 600000, 900000, 1000000, 1200000, 3000000]);

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- POS Top Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl ${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
              <i data-lucide="calculator" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Smart POS & Kasir Keuangan</h2>
              <p class="text-xs text-slate-500">Pencatatan kasir instan, struk thermal & kwitansi WhatsApp</p>
            </div>
          </div>

          <!-- Mode Switcher (IN vs OUT) -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onclick="PosComponent.setType('IN')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${isIncome ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="arrow-down-left" class="w-4 h-4"></i>
              <span>Pemasukan (IN)</span>
            </button>
            <button onclick="PosComponent.setType('OUT')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${!isIncome ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
              <span>Pengeluaran (OUT)</span>
            </button>
          </div>
        </div>

        <!-- POS Interactive Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column: Category Selection & Quick Inputs (8 Cols) -->
          <div class="lg:col-span-7 space-y-5">
            
            <!-- Category Tabs -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Pilih Kategori ${isIncome ? 'Pemasukan' : 'Pengeluaran'}
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${activeCategories.map(cat => {
                  const isSelected = this.formState.category === cat.name;
                  return `
                    <button onclick="PosComponent.setCategory('${cat.name}')" class="p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                      isSelected 
                        ? (isIncome ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900' : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-900')
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }">
                      <i data-lucide="${cat.icon}" class="w-5 h-5 ${isSelected ? (isIncome ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}"></i>
                      <span class="text-xs font-bold leading-tight">${cat.name}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Sub-Category Chips -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Sub-Pos Alokasi: <span class="text-slate-900 dark:text-white font-extrabold">${this.formState.category}</span>
              </label>
              <div class="flex flex-wrap gap-2">
                ${currentCatObj.subs.map(sub => {
                  const isSelected = this.formState.sub_category === sub;
                  return `
                    <button onclick="PosComponent.setSubCategory('${sub}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? (isIncome ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600')
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }">
                      ${sub}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Quick Amount Presets -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Nominal Cepat (Preset Kasir)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${quickAmounts.map(amt => `
                  <button onclick="PosComponent.setAmount(${amt})" class="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-emerald-50 hover:border-emerald-400 text-slate-800 dark:text-slate-200 font-bold text-xs transition active:scale-95 shadow-sm">
                    ${Utils.formatRupiah(amt)}
                  </button>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Right Column: Bill Slip, Amount Input & Action Buttons (5 Cols) -->
          <div class="lg:col-span-5 space-y-5">
            
            <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
              
              <!-- Slip Header -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span class="text-xs font-bold uppercase text-slate-500">Ringkasan Bukti Kas</span>
                <span class="text-xs font-mono font-bold text-slate-400">${new Date().toISOString().slice(0, 10)}</span>
              </div>

              <!-- Main Amount Big Input -->
              <div class="my-4">
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nominal Transaksi (Rp)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-base">Rp</span>
                  <input type="number" id="pos-input-amount" value="${this.formState.amount || ''}" placeholder="0" oninput="PosComponent.onAmountChange(this.value)" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition">
                </div>
              </div>

              <!-- Payer/Receiver Details -->
              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    ${isIncome ? 'Nama Muhsinin / Donatur (Opsional)' : 'Penerima / Nama Ustadz / Vendor'}
                  </label>
                  <input type="text" id="pos-input-payer" value="${this.formState.payer_name}" placeholder="${isIncome ? 'Hamba Allah' : 'Ust. Fulan / Toko Listrik'}" oninput="PosComponent.formState.payer_name = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                ${isIncome ? `
                  <div>
                    <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">No. WhatsApp Donatur (Untuk Kirim Kwitansi)</label>
                    <input type="tel" id="pos-input-phone" value="${this.formState.payer_phone}" placeholder="0812xxxxxxxx" oninput="PosComponent.formState.payer_phone = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                ` : ''}

                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Keterangan / Catatan Tambahan</label>
                  <input type="text" id="pos-input-notes" value="${this.formState.notes}" placeholder="Catatan transaksi..." oninput="PosComponent.formState.notes = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Penanggung Jawab / Petugas Kasir</label>
                  <input type="text" id="pos-input-pj" value="${this.formState.pj_name || state.currentUser.username}" placeholder="Nama Petugas" oninput="PosComponent.formState.pj_name = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 space-y-2">
                <button onclick="PosComponent.submitTransaction(true)" class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-lg ${
                  isIncome ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }">
                  <i data-lucide="printer" class="w-4 h-4"></i>
                  <span>Simpan & Cetak Struk Thermal</span>
                </button>

                <div class="grid grid-cols-2 gap-2">
                  <button onclick="PosComponent.submitTransaction(false)" class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5">
                    <i data-lucide="save" class="w-4 h-4"></i>
                    <span>Simpan Saja</span>
                  </button>

                  <button onclick="PosComponent.sendDirectWhatsApp()" class="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-1.5">
                    <i data-lucide="message-square" class="w-4 h-4 text-emerald-600"></i>
                    <span>Share WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    `;
  },

  setType: function(type) {
    this.formState.type = type;
    const catList = type === "IN" ? this.categories.IN : this.categories.OUT;
    this.formState.category = catList[0].name;
    this.formState.sub_category = catList[0].subs[0];
    App.renderView();
  },

  setCategory: function(catName) {
    this.formState.category = catName;
    const catList = this.formState.type === "IN" ? this.categories.IN : this.categories.OUT;
    const catObj = catList.find(c => c.name === catName);
    if (catObj && catObj.subs.length > 0) {
      this.formState.sub_category = catObj.subs[0];
    }
    App.renderView();
  },

  setSubCategory: function(subName) {
    this.formState.sub_category = subName;
    App.renderView();
  },

  setAmount: function(amount) {
    this.formState.amount = amount;
    const inputEl = document.getElementById("pos-input-amount");
    if (inputEl) inputEl.value = amount;
    Utils.playAudio("cash");
  },

  onAmountChange: function(val) {
    this.formState.amount = parseFloat(val) || 0;
  },

  submitTransaction: async function(shouldPrintThermal = false) {
    const amount = parseFloat(this.formState.amount) || 0;
    if (amount <= 0) {
      Utils.showToast("Nominal transaksi harus lebih besar dari Rp 0!", "error");
      return;
    }

    const payer = this.formState.payer_name || (this.formState.type === "IN" ? "Hamba Allah" : "Operasional");
    const notes = this.formState.notes || `${this.formState.sub_category} (${payer})`;
    const pj = this.formState.pj_name || state.currentUser.username;

    const newTrx = {
      trx_id: Utils.generateId(this.formState.type === "IN" ? "TRX-IN-" : "TRX-OUT-"),
      date: this.formState.date,
      type: this.formState.type,
      category: this.formState.category,
      sub_category: this.formState.sub_category,
      amount: amount,
      notes: notes,
      pj_name: pj,
      proof_url: "",
      created_at: new Date().toISOString()
    };

    // Save to local reactive store
    state.addTransaction(newTrx);

    // Sync to GAS in background if connected
    ApiService.postAction("createTransaction", { data: newTrx });

    Utils.playAudio("cash");
    Utils.showToast(`Transaksi ${Utils.formatRupiah(amount)} berhasil disimpan!`, "success");

    if (shouldPrintThermal) {
      App.openThermalReceiptModal(newTrx.trx_id);
    }

    // Reset Form
    this.formState.amount = 0;
    this.formState.notes = "";
    this.formState.payer_name = "";
    this.formState.payer_phone = "";
    App.renderView();
  },

  sendDirectWhatsApp: function() {
    const amount = parseFloat(this.formState.amount) || 0;
    if (amount <= 0) {
      Utils.showToast("Masukkan nominal terlebih dahulu sebelum share WhatsApp.", "warning");
      return;
    }

    const payer = this.formState.payer_name || "Hamba Allah";
    const receiptData = {
      trx_id: Utils.generateId("TRX-PREVIEW-"),
      date: this.formState.date,
      type: this.formState.type,
      category: this.formState.category,
      sub_category: this.formState.sub_category,
      amount: amount,
      notes: this.formState.notes || `Infaq / Transaksi (${payer})`,
      pj_name: this.formState.pj_name || state.currentUser.username
    };

    Utils.openWhatsAppReceipt(this.formState.payer_phone, receiptData);
  }
};


/* === js/components/transactions.js === */
/**
 * ==============================================================================
 * COMPONENT: TRANSACTIONS (BUKU KAS & JURNAL KEUANGAN)
 * Full Ledger Journal with Filtering, Instant Search, CSV Export & Modals
 * ==============================================================================
 */

const TransactionsComponent = {
  filter: {
    type: "ALL",
    category: "ALL",
    search: "",
    startDate: "",
    endDate: ""
  },

  render: function() {
    let list = [...state.data.transactions];

    // Filter by type
    if (this.filter.type !== "ALL") {
      list = list.filter(t => t.type === this.filter.type);
    }

    // Filter by search query
    if (this.filter.search) {
      const q = this.filter.search.toLowerCase();
      list = list.filter(t => 
        (t.trx_id && String(t.trx_id).toLowerCase().includes(q)) ||
        (t.category && String(t.category).toLowerCase().includes(q)) ||
        (t.sub_category && String(t.sub_category).toLowerCase().includes(q)) ||
        (t.notes && String(t.notes).toLowerCase().includes(q)) ||
        (t.pj_name && String(t.pj_name).toLowerCase().includes(q))
      );
    }

    // Filter by date range
    if (this.filter.startDate) {
      list = list.filter(t => t.date >= this.filter.startDate);
    }
    if (this.filter.endDate) {
      list = list.filter(t => t.date <= this.filter.endDate);
    }

    const totalFilteredIn = list.filter(t => t.type === "IN").reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
    const totalFilteredOut = list.filter(t => t.type === "OUT").reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
    const netFiltered = totalFilteredIn - totalFilteredOut;

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header & Action Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">Jurnal & Rekapitulasi Kas Masjid</h2>
            <p class="text-xs text-slate-500">Mutasi kas terstruktur, audit trail & transparansi pembukuan DKM</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="TransactionsComponent.exportCSV()" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition">
              <i data-lucide="download" class="w-4 h-4 text-emerald-600"></i>
              <span>Export CSV</span>
            </button>
            <button onclick="window.print()" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition">
              <i data-lucide="printer" class="w-4 h-4 text-slate-500"></i>
              <span>Cetak Laporan</span>
            </button>
            <button onclick="App.openQuickTransactionModal('IN')" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="plus" class="w-4 h-4"></i>
              <span>Catat Kas</span>
            </button>
          </div>
        </div>

        <!-- Filter Controls Panel -->
        <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <!-- Search -->
          <div>
            <label class="block font-semibold text-slate-500 mb-1">Cari Transaksi / PJ</label>
            <div class="relative">
              <input type="text" value="${this.filter.search}" oninput="TransactionsComponent.onSearch(this.value)" placeholder="No. Ref, nama, ustadz, dll..." class="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5"></i>
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block font-semibold text-slate-500 mb-1">Jenis Mutasi</label>
            <select onchange="TransactionsComponent.onTypeChange(this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="ALL" ${this.filter.type === 'ALL' ? 'selected' : ''}>Semua (Pemasukan & Pengeluaran)</option>
              <option value="IN" ${this.filter.type === 'IN' ? 'selected' : ''}>Pemasukan Saja (IN)</option>
              <option value="OUT" ${this.filter.type === 'OUT' ? 'selected' : ''}>Pengeluaran Saja (OUT)</option>
            </select>
          </div>

          <!-- Start Date -->
          <div>
            <label class="block font-semibold text-slate-500 mb-1">Dari Tanggal</label>
            <input type="date" value="${this.filter.startDate}" onchange="TransactionsComponent.onDateChange('startDate', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

          <!-- End Date -->
          <div>
            <label class="block font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
            <input type="date" value="${this.filter.endDate}" onchange="TransactionsComponent.onDateChange('endDate', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500">
          </div>

        </div>

        <!-- Filtered Totals Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs">
            <span class="text-emerald-800 dark:text-emerald-300 font-medium">Total Pemasukan Filter:</span>
            <div class="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">${Utils.formatRupiah(totalFilteredIn)}</div>
          </div>
          <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs">
            <span class="text-rose-800 dark:text-rose-300 font-medium">Total Pengeluaran Filter:</span>
            <div class="text-base font-extrabold text-rose-700 dark:text-rose-300 mt-0.5">${Utils.formatRupiah(totalFilteredOut)}</div>
          </div>
          <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span class="text-slate-600 dark:text-slate-300 font-medium">Netto Selisih Kas Filter:</span>
            <div class="text-base font-extrabold ${netFiltered >= 0 ? 'text-emerald-600' : 'text-rose-600'} mt-0.5">${Utils.formatRupiah(netFiltered)}</div>
          </div>
        </div>

        <!-- Ledger Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">No. Ref</th>
                  <th class="py-3 px-4">Tanggal</th>
                  <th class="py-3 px-4">Jenis</th>
                  <th class="py-3 px-4">Kategori & Sub-Pos</th>
                  <th class="py-3 px-4">Keterangan</th>
                  <th class="py-3 px-4">PJ / Petugas</th>
                  <th class="py-3 px-4 text-right">Jumlah (Rp)</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${list.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-center py-12 text-slate-400">Tidak ada data transaksi yang sesuai filter.</td>
                  </tr>
                ` : list.map(item => {
                  const isIncome = item.type === "IN";
                  return `
                    <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        ${item.trx_id}
                      </td>
                      <td class="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        ${Utils.formatDateIndo(item.date)}
                      </td>
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isIncome ? 'badge-in' : 'badge-out'}">
                          <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-3 h-3"></i>
                          <span>${item.type}</span>
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 dark:text-white">${item.category}</div>
                        <div class="text-[11px] text-slate-500">${item.sub_category}</div>
                      </td>
                      <td class="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title="${item.notes}">
                        ${item.notes || '-'}
                      </td>
                      <td class="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        ${item.pj_name || '-'}
                      </td>
                      <td class="py-3 px-4 text-right font-extrabold ${isIncome ? 'text-emerald-600' : 'text-rose-600'} whitespace-nowrap">
                        ${isIncome ? '+' : '-'}${Utils.formatRupiah(item.amount)}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <div class="flex items-center justify-center gap-1">
                          <button onclick="App.openThermalReceiptModal('${item.trx_id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition" title="Cetak Struk Thermal">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                          </button>
                          <button onclick="Utils.openWhatsAppReceipt('', state.data.transactions.find(t => t.trx_id === '${item.trx_id}'))" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition" title="Share ke WhatsApp">
                            <i data-lucide="message-square" class="w-4 h-4"></i>
                          </button>
                          <button onclick="TransactionsComponent.deleteTrx('${item.trx_id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 transition" title="Hapus Transaksi">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  },

  onSearch: function(val) {
    this.filter.search = val;
    App.renderView();
  },

  onTypeChange: function(val) {
    this.filter.type = val;
    App.renderView();
  },

  onDateChange: function(key, val) {
    this.filter[key] = val;
    App.renderView();
  },

  deleteTrx: function(trxId) {
    if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${trxId}?`)) {
      state.deleteTransaction(trxId);
      ApiService.postAction("deleteTransaction", { id: trxId });
      Utils.showToast(`Transaksi ${trxId} berhasil dihapus.`, "info");
      App.renderView();
    }
  },

  exportCSV: function() {
    const list = state.data.transactions;
    const headers = ["No. Ref", "Tanggal", "Jenis", "Kategori", "Sub-Kategori", "Nominal", "Keterangan", "Penanggung Jawab", "Waktu Input"];
    const rows = list.map(t => [
      t.trx_id,
      t.date,
      t.type,
      t.category,
      t.sub_category,
      t.amount,
      t.notes,
      t.pj_name,
      t.created_at
    ]);

    Utils.exportToCSV("Buku_Kas_Masjid_MBJ", headers, rows);
  }
};


/* === js/components/ubudiyah.js === */
/**
 * ==============================================================================
 * COMPONENT: UBUDIYAH (AGENDA KAJIAN & KHOTIB JUMAT)
 * Schedule Management, Khotib Assignment & Ustadz Honorarium Tracking
 * ==============================================================================
 */

const UbudiyahComponent = {
  render: function() {
    const list = state.data.ubudiyah;

    const totalFeeBudget = list.reduce((acc, a) => acc + (parseFloat(a.fee_budget) || 0), 0);
    const totalFeeRealized = list.reduce((acc, a) => acc + (parseFloat(a.fee_realization) || 0), 0);

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <i data-lucide="book-open" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Ubudiyah & Dakwah Sunnah</h2>
              <p class="text-xs text-slate-500">Jadwal kajian rutin, penugasan Khotib Jumat & kontrol amplop fee pemateri</p>
            </div>
          </div>

          <button onclick="UbudiyahComponent.openAddModal()" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition">
            <i data-lucide="calendar-plus" class="w-4 h-4"></i>
            <span>Tambah Jadwal / Khotib</span>
          </button>
        </div>

        <!-- Honorarium Tracking Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total Agenda Terdaftar</span>
            <div class="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${list.length} Kegiatan</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total Anggaran Fee Pemateri</span>
            <div class="text-xl font-extrabold text-amber-600 mt-1">${Utils.formatRupiah(totalFeeBudget)}</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Realisasi Amplop Diserahkan</span>
            <div class="text-xl font-extrabold text-emerald-600 mt-1">${Utils.formatRupiah(totalFeeRealized)}</div>
          </div>
        </div>

        <!-- Agenda Grid Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${list.map(item => `
            <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div class="flex items-start justify-between gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.type === 'Khutbah Jumat' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'
                  }">
                    ${item.type}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Terjadwal' ? 'bg-sky-100 text-sky-800' : (item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800')
                  }">
                    ${item.status}
                  </span>
                </div>

                <h3 class="font-bold text-sm text-slate-900 dark:text-white mt-3 leading-snug">${item.title}</h3>
                <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <i data-lucide="user" class="w-3.5 h-3.5"></i>
                  <span>${item.ustadz_name}</span>
                </div>

                <div class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                  <span>${item.date_time}</span>
                </div>

                <!-- Fee Tracker -->
                <div class="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                  <div class="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Anggaran Fee:</span>
                    <span class="font-bold">${Utils.formatRupiah(item.fee_budget)}</span>
                  </div>
                  <div class="flex items-center justify-between text-slate-600 dark:text-slate-300 mt-1">
                    <span>Realisasi:</span>
                    <span class="font-bold text-emerald-600">${Utils.formatRupiah(item.fee_realization)}</span>
                  </div>
                </div>
              </div>

              <!-- Action Controls -->
              <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button onclick="UbudiyahComponent.markComplete('${item.agenda_id}')" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                  ${item.status === 'Selesai' ? '✓ Telah Selesai' : 'Tandai Selesai'}
                </button>
                <div class="flex items-center gap-1">
                  <button onclick="UbudiyahComponent.deleteAgenda('${item.agenda_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

            </div>
          `).join('')}
        </div>

      </div>

      <!-- Add Agenda Modal Template Container (dynamically injected) -->
      <div id="modal-ubudiyah-container"></div>
    `;
  },

  openAddModal: function() {
    const modalHtml = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Tambah Jadwal Ubudiyah / Khotib</h3>
            <button onclick="document.getElementById('modal-ubudiyah-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="UbudiyahComponent.saveAgenda(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Jenis Kegiatan</label>
              <select id="ubd-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <option value="Kajian Rutin">Kajian Rutin Malam Ahad</option>
                <option value="Khutbah Jumat">Khutbah Shalat Jumat</option>
                <option value="Kajian Tematik">Kajian Tematik Spesial</option>
                <option value="Kajian Muslimah">Kajian Muslimah</option>
                <option value="Dauroh Ilmiah">Dauroh Ilmiah / Workshop</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Judul Kajian / Tema Khutbah</label>
              <input type="text" id="ubd-title" required placeholder="Contoh: Kitab Riyadhus Shalihin" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Nama Ustadz / Pemateri / Khotib</label>
              <input type="text" id="ubd-ustadz" required placeholder="Contoh: Ust. Abdullah Roy, M.A." class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Hari, Tanggal & Waktu</label>
              <input type="text" id="ubd-datetime" required placeholder="Contoh: Setiap Ahad Ba'da Maghrib / 26 Sep 11.45" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Anggaran Fee (Rp)</label>
                <input type="number" id="ubd-budget" value="1000000" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Status Awal</label>
                <select id="ubd-status" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option value="Terjadwal">Terjadwal</option>
                  <option value="Disiapkan">Disiapkan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-ubudiyah-container').innerHTML=''" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan Jadwal</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-ubudiyah-container").innerHTML = modalHtml;
  },

  saveAgenda: function(e) {
    e.preventDefault();
    const type = document.getElementById("ubd-type").value;
    const title = document.getElementById("ubd-title").value;
    const ustadz = document.getElementById("ubd-ustadz").value;
    const datetime = document.getElementById("ubd-datetime").value;
    const budget = parseFloat(document.getElementById("ubd-budget").value) || 0;
    const status = document.getElementById("ubd-status").value;

    const newAgenda = {
      agenda_id: Utils.generateId("UBD-"),
      type: type,
      title: title,
      ustadz_name: ustadz,
      date_time: datetime,
      fee_budget: budget,
      fee_realization: status === "Selesai" ? budget : 0,
      status: status
    };

    state.addItem("ubudiyah", newAgenda, "agenda_id", "UBD-");
    ApiService.postAction("createUbudiyah", { data: newAgenda });

    document.getElementById("modal-ubudiyah-container").innerHTML = "";
    Utils.showToast("Jadwal kajian & khotib berhasil disimpan!", "success");
    App.renderView();
  },

  markComplete: function(id) {
    const item = state.data.ubudiyah.find(a => a.agenda_id === id);
    if (!item) return;

    item.status = "Selesai";
    item.fee_realization = item.fee_budget;
    state.saveStorage("ubudiyah");
    ApiService.postAction("updateUbudiyah", { id, data: item });

    Utils.showToast(`Kegiatan ${item.title} selesai & amplop ustadz tercatat.`, "success");
    App.renderView();
  },

  deleteAgenda: function(id) {
    if (confirm("Hapus jadwal ini?")) {
      state.deleteItem("ubudiyah", id, "agenda_id");
      ApiService.postAction("deleteUbudiyah", { id });
      Utils.showToast("Jadwal berhasil dihapus.", "info");
      App.renderView();
    }
  }
};


/* === js/components/multimedia.js === */
/**
 * ==============================================================================
 * COMPONENT: MULTIMEDIA & ASSETS
 * Production Checklist (Streaming/Recording) & Equipment Inventory Control
 * ==============================================================================
 */

const MultimediaComponent = {
  checklists: [
    { task: "Desain Flyer Banner Kajian & Publish Sosmed", done: true, pic: "Desainer Grafis" },
    { task: "Pemeriksaan Baterai Kamera & Setup Tripod Lt 1", done: true, pic: "Kameramen Rizki" },
    { task: "Cek Frekuensi Wireless Mic Shure & Level Audio Mixer", done: true, pic: "Audio Fajar" },
    { task: "Setup Video Switcher ATEM Mini & Output Live YouTube", done: false, pic: "Operator Stream" },
    { task: "Rekam Audio Master WAV & Backup Kartu Memori", done: false, pic: "Operator Media" },
    { task: "Cut Video Pendek (Shorts/Reels) & Upload Highlight", done: false, pic: "Video Editor" }
  ],

  render: function() {
    const assets = state.data.multimedia;

    const availableCount = assets.filter(a => a.status === "Tersedia").length;
    const inUseCount = assets.filter(a => a.status === "Dipakai").length;
    const repairCount = assets.filter(a => a.status === "Servis").length;

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-indigo-100 text-indigo-700">
              <i data-lucide="video" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Multimedia & Aset Inventaris</h2>
              <p class="text-xs text-slate-500">SOP produksi dakwah, live streaming & tracking alat studio/audio MBJ</p>
            </div>
          </div>

          <button onclick="MultimediaComponent.openAddAssetModal()" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Tambah Aset / Alat</span>
          </button>
        </div>

        <!-- Inventory Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 font-semibold">Alat Tersedia di Studio</span>
              <div class="text-2xl font-extrabold text-emerald-600 mt-1">${availableCount} Unit</div>
            </div>
            <span class="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><i data-lucide="check-circle-2" class="w-5 h-5"></i></span>
          </div>

          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 font-semibold">Sedang Digunakan (On Air)</span>
              <div class="text-2xl font-extrabold text-indigo-600 mt-1">${inUseCount} Unit</div>
            </div>
            <span class="p-2.5 rounded-xl bg-indigo-50 text-indigo-600"><i data-lucide="radio" class="w-5 h-5"></i></span>
          </div>

          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span class="text-xs text-slate-500 font-semibold">Dalam Perawatan / Servis</span>
              <div class="text-2xl font-extrabold text-rose-600 mt-1">${repairCount} Unit</div>
            </div>
            <span class="p-2.5 rounded-xl bg-rose-50 text-rose-600"><i data-lucide="wrench" class="w-5 h-5"></i></span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Production SOP Checklist (5 Cols) -->
          <div class="lg:col-span-5 glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Checklist Produksi Kajian</h3>
                <p class="text-xs text-slate-500">SOP Standar Siaran Langsung & Konten Dakwah</p>
              </div>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">SOP MBJ</span>
            </div>

            <div class="space-y-2.5">
              ${this.checklists.map((chk, idx) => `
                <div class="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-start gap-3 text-xs">
                  <input type="checkbox" ${chk.done ? 'checked' : ''} onchange="MultimediaComponent.toggleChecklist(${idx})" class="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer">
                  <div class="flex-1">
                    <span class="font-semibold text-slate-800 dark:text-slate-200 ${chk.done ? 'line-through text-slate-400' : ''}">${chk.task}</span>
                    <div class="text-[11px] text-slate-400 mt-0.5">PIC: ${chk.pic}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Assets Inventory Table (7 Cols) -->
          <div class="lg:col-span-7 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Daftar Inventaris Alat</h3>
                <p class="text-xs text-slate-500">Monitoring status kamera, mic & perangkat broadcast</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">Nama Alat</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4">PIC</th>
                    <th class="py-3 px-4">Maintenance</th>
                    <th class="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  ${assets.map(item => `
                    <tr class="hover:bg-slate-50/50 transition">
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 dark:text-white">${item.item_name}</div>
                        <div class="text-[10px] font-mono text-slate-400">${item.asset_id}</div>
                      </td>
                      <td class="py-3 px-4">
                        <select onchange="MultimediaComponent.changeStatus('${item.asset_id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                          item.status === 'Tersedia' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : (item.status === 'Dipakai' ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-rose-50 text-rose-700 border-rose-300')
                        }">
                          <option value="Tersedia" ${item.status === 'Tersedia' ? 'selected' : ''}>Tersedia</option>
                          <option value="Dipakai" ${item.status === 'Dipakai' ? 'selected' : ''}>Dipakai</option>
                          <option value="Servis" ${item.status === 'Servis' ? 'selected' : ''}>Servis</option>
                        </select>
                      </td>
                      <td class="py-3 px-4 text-slate-600 font-medium">${item.pic_name}</td>
                      <td class="py-3 px-4 text-slate-500 text-[11px]">${item.last_maintenance || '-'}</td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="MultimediaComponent.deleteAsset('${item.asset_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      <div id="modal-multimedia-container"></div>
    `;
  },

  toggleChecklist: function(idx) {
    this.checklists[idx].done = !this.checklists[idx].done;
    Utils.showToast("Status checklist diperbarui.", "info");
    App.renderView();
  },

  changeStatus: function(assetId, newStatus) {
    state.updateItem("multimedia", assetId, { status: newStatus }, "asset_id");
    ApiService.postAction("updateMultimedia", { id: assetId, data: { status: newStatus } });
    Utils.showToast("Status alat inventaris diperbarui.", "success");
    App.renderView();
  },

  deleteAsset: function(assetId) {
    if (confirm("Hapus inventaris alat ini?")) {
      state.deleteItem("multimedia", assetId, "asset_id");
      ApiService.postAction("deleteMultimedia", { id: assetId });
      Utils.showToast("Aset inventaris dihapus.", "info");
      App.renderView();
    }
  },

  openAddAssetModal: function() {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Tambah Alat / Inventaris Baru</h3>
            <button onclick="document.getElementById('modal-multimedia-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="MultimediaComponent.saveNewAsset(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Alat / Perangkat</label>
              <input type="text" id="ast-name" required placeholder="Contoh: Lensa Sony FE 24-70mm GM" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Status Awal</label>
                <select id="ast-status" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Tersedia">Tersedia</option>
                  <option value="Dipakai">Dipakai</option>
                  <option value="Servis">Servis</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">PJ / PIC</label>
                <input type="text" id="ast-pic" value="Tim Media" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-multimedia-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md">Simpan Alat</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-multimedia-container").innerHTML = html;
  },

  saveNewAsset: function(e) {
    e.preventDefault();
    const name = document.getElementById("ast-name").value;
    const status = document.getElementById("ast-status").value;
    const pic = document.getElementById("ast-pic").value;

    const newAst = {
      asset_id: Utils.generateId("AST-"),
      item_name: name,
      status: status,
      rental_cost: 0,
      pic_name: pic,
      last_maintenance: new Date().toISOString().slice(0, 10)
    };

    state.addItem("multimedia", newAst, "asset_id", "AST-");
    ApiService.postAction("createMultimedia", { data: newAst });

    document.getElementById("modal-multimedia-container").innerHTML = "";
    Utils.showToast("Aset baru berhasil dicatat!", "success");
    App.renderView();
  }
};


/* === js/components/facilities.js === */
/**
 * ==============================================================================
 * COMPONENT: FACILITIES & MARBOT (RUMAH TANGGA)
 * 3-Marbot Shift Tasks, Consumables Stock (Karbol Lt 1-2) & Maintenance Tickets
 * ==============================================================================
 */

const FacilitiesComponent = {
  marbotShifts: [
    { name: "Marbot Ahmad", shift: "Pagi (04.00 - 12.00)", area: "Lantai 1 (Ruang Utama, Mihrab, Tempat Wudhu Pria)", status: "Hadir / Bertugas" },
    { name: "Marbot Bambang", shift: "Siang - Sore (12.00 - 18.00)", area: "Lantai 2 (Balkon Shalat Wanita, Ruang Rapat, Koridor)", status: "Hadir / Bertugas" },
    { name: "Marbot Rizki", shift: "Malam (18.00 - 22.00)", area: "Seluruh Area (Kunci Pintu, Cek Lampu, AC & Sound System)", status: "Hadir / Bertugas" }
  ],

  render: function() {
    const tickets = state.data.household;

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-teal-100 text-teal-700">
              <i data-lucide="sparkles" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Fasilitas, Sanitasi & Rumah Tangga</h2>
              <p class="text-xs text-slate-500">Jadwal tugas marbot, pengajuan kebutuhan sarana & tiket perbaikan gedung MBJ</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="FacilitiesComponent.openAddTicketModal('Kebersihan')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="sparkles" class="w-4 h-4"></i>
              <span>Pengajuan Kebutuhan</span>
            </button>
            <button onclick="FacilitiesComponent.openAddTicketModal('Fisik')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="wrench" class="w-4 h-4"></i>
              <span>Tiket Servis AC / Lampu</span>
            </button>
          </div>
        </div>

        <!-- 3 Marbot Shift Logger -->
        <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Penugasan & Shift 3 Petugas Marbot</h3>
              <p class="text-xs text-slate-500">Monitoring absensi dan zonasi area kebersihan harian</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">3 Personil Siaga</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            ${this.marbotShifts.map(m => `
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sm text-slate-900 dark:text-white">${m.name}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${m.status}</span>
                  </div>
                  <div class="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">${m.shift}</div>
                  <div class="text-xs text-slate-500 mt-2">
                    <span class="font-medium text-slate-700 dark:text-slate-300">Zonasi:</span> ${m.area}
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span class="text-slate-400">Checklist SOP Harian</span>
                  <span class="text-emerald-600 font-bold">100% Selesai</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tickets & Consumables Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Daftar Tiket Pemeliharaan & Bahan Habis Pakai</h3>
              <p class="text-xs text-slate-500">Stok karbol, sabun, servis rutin AC, pergantian lampu & biaya konsumsi</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3 px-4">No. Tiket</th>
                  <th class="py-3 px-4">Divisi & Area</th>
                  <th class="py-3 px-4">Barang / Item Perbaikan</th>
                  <th class="py-3 px-4">Jumlah</th>
                  <th class="py-3 px-4">Estimasi Biaya</th>
                  <th class="py-3 px-4">PIC Marbot</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${tickets.map(item => `
                  <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${item.ticket_id}</td>
                    <td class="py-3 px-4">
                      <span class="font-bold text-slate-800 dark:text-slate-200">${item.division}</span>
                      <div class="text-[11px] text-teal-600 font-semibold">${item.area}</div>
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">${item.item}</td>
                    <td class="py-3 px-4 text-slate-600 font-medium">${item.qty}</td>
                    <td class="py-3 px-4 font-extrabold text-slate-900 dark:text-white">${Utils.formatRupiah(item.cost)}</td>
                    <td class="py-3 px-4 text-slate-600 font-medium">${item.pic_marbot}</td>
                    <td class="py-3 px-4">
                      <select onchange="FacilitiesComponent.changeStatus('${item.ticket_id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : (item.status === 'Dalam Proses' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-rose-50 text-rose-700 border-rose-300')
                      }">
                        <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Dalam Proses" ${item.status === 'Dalam Proses' ? 'selected' : ''}>Dalam Proses</option>
                        <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <button onclick="FacilitiesComponent.deleteTicket('${item.ticket_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div id="modal-facilities-container"></div>
    `;
  },

  changeStatus: function(ticketId, newStatus) {
    state.updateItem("household", ticketId, { status: newStatus }, "ticket_id");
    ApiService.postAction("updateHousehold", { id: ticketId, data: { status: newStatus } });
    Utils.showToast("Status tiket perbaikan diperbarui.", "success");
    App.renderView();
  },

  deleteTicket: function(ticketId) {
    if (confirm("Hapus tiket ini?")) {
      state.deleteItem("household", ticketId, "ticket_id");
      ApiService.postAction("deleteHousehold", { id: ticketId });
      Utils.showToast("Tiket fasilitas berhasil dihapus.", "info");
      App.renderView();
    }
  },

  openAddTicketModal: function(defaultDiv = "Kebersihan") {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Buat Tiket Perawatan / Pengajuan Kebutuhan</h3>
            <button onclick="document.getElementById('modal-facilities-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="FacilitiesComponent.saveNewTicket(event)" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Divisi</label>
                <select id="tck-div" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Kebersihan" ${defaultDiv === 'Kebersihan' ? 'selected' : ''}>Kebersihan / Sanitasi</option>
                  <option value="Fisik" ${defaultDiv === 'Fisik' ? 'selected' : ''}>Fisik & Listrik / AC</option>
                  <option value="Konsumsi">Konsumsi Kajian</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Area Masjid</label>
                <select id="tck-area" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Lantai 1">Lantai 1 (Ruang Utama)</option>
                  <option value="Lantai 2">Lantai 2 (Balkon & TPQ)</option>
                  <option value="Tempat Wudhu">Tempat Wudhu & Toilet</option>
                  <option value="Halaman / Parkir">Halaman / Parkir & Taman</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Barang / Uraian Kebutuhan</label>
              <input type="text" id="tck-item" required placeholder="Contoh: Pengadaan Karbol / Lampu LED / Servis AC" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Jumlah / Qty</label>
                <input type="text" id="tck-qty" required placeholder="Contoh: 4 Jerigen / 3 Unit" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Estimasi Biaya (Rp)</label>
                <input type="number" id="tck-cost" value="250000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">PIC Marbot</label>
                <select id="tck-pic" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Marbot Ahmad">Marbot Ahmad</option>
                  <option value="Marbot Bambang">Marbot Bambang</option>
                  <option value="Marbot Rizki">Marbot Rizki</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Status</label>
                <select id="tck-status" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Pending">Pending</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-facilities-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md">Kirim Pengajuan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-facilities-container").innerHTML = html;
  },

  saveNewTicket: function(e) {
    e.preventDefault();
    const div = document.getElementById("tck-div").value;
    const area = document.getElementById("tck-area").value;
    const item = document.getElementById("tck-item").value;
    const qty = document.getElementById("tck-qty").value;
    const cost = parseFloat(document.getElementById("tck-cost").value) || 0;
    const pic = document.getElementById("tck-pic").value;
    const status = document.getElementById("tck-status").value;

    const newTicket = {
      ticket_id: Utils.generateId("TCK-"),
      division: div,
      area: area,
      item: item,
      qty: qty,
      cost: cost,
      pic_marbot: pic,
      status: status
    };

    state.addItem("household", newTicket, "ticket_id", "TCK-");
    ApiService.postAction("createHousehold", { data: newTicket });

    document.getElementById("modal-facilities-container").innerHTML = "";
    Utils.showToast("Tiket fasilitas berhasil dicatat!", "success");
    App.renderView();
  }
};


/* === js/components/social.js === */
/**
 * ==============================================================================
 * COMPONENT: SOCIAL SERVICES (CSR MBJ)
 * Ambulance 24H Booking, Siber Clean Water Refill Log & Emergency Jenazah Service
 * ==============================================================================
 */

const SocialComponent = {
  render: function() {
    const services = state.data.social;

    const ambulanceList = services.filter(s => s.service_type === "Ambulance");
    const siberList = services.filter(s => s.service_type === "Siber Air");
    const jenazahList = services.filter(s => s.service_type === "Jenazah");

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Top Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-amber-100 text-amber-700">
              <i data-lucide="heart-handshake" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Pelayanan Sosial & CSR MBJ</h2>
              <p class="text-xs text-slate-500">Ambulans gratis 24 jam, stasiun air minum Siber & layanan fardhu kifayah jenazah</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="SocialComponent.openBookingModal('Ambulance')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="ambulance" class="w-4 h-4"></i>
              <span>Booking Ambulans</span>
            </button>
            <button onclick="SocialComponent.openBookingModal('Siber Air')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="droplet" class="w-4 h-4"></i>
              <span>Log Siber Air</span>
            </button>
            <button onclick="SocialComponent.openBookingModal('Jenazah')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="shield-plus" class="w-4 h-4"></i>
              <span>Layanan Jenazah</span>
            </button>
          </div>
        </div>

        <!-- 3 Feature Highlight Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <!-- 1. Ambulance Status Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-rose-100 text-rose-600"><i data-lucide="ambulance" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Ambulans MBJ</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">READY 24 JAM</span>
            </div>
            <p class="text-xs text-slate-500">Layanan antar-jemput pasien gawat darurat & dhuafa secara gratis se-Jabodetabek.</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Supir On-Call:</span> <span>Pak Joko (0812-7788-9900)</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>Total Reservasi:</span> <span>${ambulanceList.length} Rute</span></div>
            </div>
          </div>

          <!-- 2. Siber Water Station Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-sky-100 text-sky-600"><i data-lucide="droplets" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Siber Air Minum</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">TDS: 12 PPM (SANGAT BAIK)</span>
            </div>
            <p class="text-xs text-slate-500">Penyediaan air minum higienis gratis dengan sistem filtrasi Reverse Osmosis (RO).</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Distribusi Rata-rata:</span> <span>180 Galon/Hari</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>Status Filter:</span> <span class="text-emerald-600">Baru Diganti</span></div>
            </div>
          </div>

          <!-- 3. Jenazah Emergency Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><i data-lucide="crosshair" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Layanan Jenazah</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">FARDHU KIFAYAH</span>
            </div>
            <p class="text-xs text-slate-500">Perlengkapan kain kafan lengkap, tim pemandian jenazah sunnah & armada pengantaran kubur.</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Stok Kain Kafan:</span> <span>8 Set Lengkap</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>PIC Fardhu Kifayah:</span> <span>Ust. Hamdan</span></div>
            </div>
          </div>

        </div>

        <!-- Combined Social Services Log Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Buku Log Layanan Sosial Umat</h3>
              <p class="text-xs text-slate-500">Daftar permohonan reservasi ambulans, maintenance siber & layanan jenazah</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3 px-4">No. Registrasi</th>
                  <th class="py-3 px-4">Layanan</th>
                  <th class="py-3 px-4">Pemohon / Kontak</th>
                  <th class="py-3 px-4">Tanggal Permohonan</th>
                  <th class="py-3 px-4">Tujuan / Detail Kebutuhan</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${services.map(item => `
                  <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${item.service_id}</td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.service_type === 'Ambulance' ? 'bg-rose-100 text-rose-800' : (item.service_type === 'Siber Air' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800')
                      }">
                        ${item.service_type}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="font-bold text-slate-900 dark:text-white">${item.requester_name}</div>
                      <div class="text-[11px] text-slate-500">${item.phone || '-'}</div>
                    </td>
                    <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${Utils.formatDateIndo(item.date_reserved)}</td>
                    <td class="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium max-w-xs">${item.destination_or_detail}</td>
                    <td class="py-3 px-4">
                      <select onchange="SocialComponent.changeStatus('${item.service_id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : (item.status === 'Terkonfirmasi' ? 'bg-sky-50 text-sky-700 border-sky-300' : 'bg-amber-50 text-amber-700 border-amber-300')
                      }">
                        <option value="Menunggu" ${item.status === 'Menunggu' ? 'selected' : ''}>Menunggu</option>
                        <option value="Terkonfirmasi" ${item.status === 'Terkonfirmasi' ? 'selected' : ''}>Terkonfirmasi</option>
                        <option value="Berjalan" ${item.status === 'Berjalan' ? 'selected' : ''}>Berjalan</option>
                        <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex items-center justify-center gap-1">
                        ${item.phone && item.phone !== '-' ? `
                          <a href="https://wa.me/${Utils.cleanPhone(item.phone)}" target="_blank" class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Hubungi Pemohon via WA">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                          </a>
                        ` : ''}
                        <button onclick="SocialComponent.deleteService('${item.service_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div id="modal-social-container"></div>
    `;
  },

  changeStatus: function(serviceId, newStatus) {
    state.updateItem("social", serviceId, { status: newStatus }, "service_id");
    ApiService.postAction("updateSocial", { id: serviceId, data: { status: newStatus } });
    Utils.showToast("Status permohonan sosial diperbarui.", "success");
    App.renderView();
  },

  deleteService: function(serviceId) {
    if (confirm("Hapus catatan layanan ini?")) {
      state.deleteItem("social", serviceId, "service_id");
      ApiService.postAction("deleteSocial", { id: serviceId });
      Utils.showToast("Catatan layanan dihapus.", "info");
      App.renderView();
    }
  },

  openBookingModal: function(defaultType = "Ambulance") {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Form Input Layanan Sosial CSR</h3>
            <button onclick="document.getElementById('modal-social-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="SocialComponent.saveService(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Jenis Layanan</label>
              <select id="soc-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                <option value="Ambulance" ${defaultType === 'Ambulance' ? 'selected' : ''}>Ambulans Medis 24 Jam</option>
                <option value="Siber Air" ${defaultType === 'Siber Air' ? 'selected' : ''}>Siber (Air Minum RO)</option>
                <option value="Jenazah" ${defaultType === 'Jenazah' ? 'selected' : ''}>Layanan Jenazah & Fardhu Kifayah</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Pemohon / Penanggung Jawab</label>
              <input type="text" id="soc-name" required placeholder="Nama lengkap..." class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">No. WhatsApp / HP</label>
                <input type="tel" id="soc-phone" placeholder="0812xxxxxxxx" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Tanggal Diperlukan</label>
                <input type="date" id="soc-date" value="${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Tujuan / Rincian Kebutuhan</label>
              <textarea id="soc-dest" required rows="3" placeholder="Contoh: Antar pasien ke RSUD Pasar Rebo / Penggantian Filter Sediment Siber" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800"></textarea>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-social-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md">Simpan Permohonan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-social-container").innerHTML = html;
  },

  saveService: function(e) {
    e.preventDefault();
    const type = document.getElementById("soc-type").value;
    const name = document.getElementById("soc-name").value;
    const phone = document.getElementById("soc-phone").value;
    const date = document.getElementById("soc-date").value;
    const dest = document.getElementById("soc-dest").value;

    const newSoc = {
      service_id: Utils.generateId("SOC-"),
      service_type: type,
      requester_name: name,
      phone: phone,
      date_reserved: date,
      destination_or_detail: dest,
      status: "Terkonfirmasi"
    };

    state.addItem("social", newSoc, "service_id", "SOC-");
    ApiService.postAction("createSocial", { data: newSoc });

    document.getElementById("modal-social-container").innerHTML = "";
    Utils.showToast("Permohonan layanan sosial berhasil disimpan!", "success");
    App.renderView();
  }
};


/* === js/components/tpq.js === */
/**
 * ==============================================================================
 * COMPONENT: TPQ (PENDIDIKAN AL-QUR'AN)
 * Santri Database, Monthly SPP Cashier & Automated WhatsApp Parent Receipts
 * ==============================================================================
 */

const TpqComponent = {
  render: function() {
    const students = state.data.tpq_students;
    const payments = state.data.tpq_payments;

    const activeCount = students.filter(s => s.status_active === "Aktif" || s.status_active === true).length;
    const totalCollected = payments.reduce((acc, p) => acc + (parseFloat(p.amount_paid) || 0), 0);

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Top Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <i data-lucide="graduation-cap" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Pendidikan TPQ Mu'adz bin Jabal</h2>
              <p class="text-xs text-slate-500">Database santri, kasir SPP bulanan terintegrasi & kwitansi WhatsApp wali santri</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="TpqComponent.openPayModal()" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="receipt" class="w-4 h-4"></i>
              <span>Bayar SPP Santri</span>
            </button>
            <button onclick="TpqComponent.openAddStudentModal()" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span>Tambah Santri Baru</span>
            </button>
          </div>
        </div>

        <!-- Metrics Overview Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total Santri Terdaftar</span>
            <div class="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${students.length} Santri (${activeCount} Aktif)</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total SPP Terkumpul (Buku Kas)</span>
            <div class="text-xl font-extrabold text-emerald-600 mt-1">${Utils.formatRupiah(totalCollected)}</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Iuran SPP Standar</span>
            <div class="text-xl font-extrabold text-teal-600 mt-1">Rp 150.000 / Bulan</div>
          </div>
        </div>

        <!-- 2 Columns Grid: Students List & Payment History -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Students Database Table (6 Cols) -->
          <div class="lg:col-span-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Database Santri TPQ</h3>
                <p class="text-xs text-slate-500">Daftar santri aktif dan kontak wali</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">NIS / Nama Santri</th>
                    <th class="py-3 px-4">Kontak Wali</th>
                    <th class="py-3 px-4">Iuran/Bulan</th>
                    <th class="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  ${students.map(s => `
                    <tr class="hover:bg-slate-50/50 transition">
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 dark:text-white">${s.full_name}</div>
                        <div class="text-[10px] font-mono text-slate-400">${s.student_id}</div>
                      </td>
                      <td class="py-3 px-4 text-slate-600 font-medium">
                        ${s.parent_phone ? `
                          <a href="https://wa.me/${Utils.cleanPhone(s.parent_phone)}" target="_blank" class="text-emerald-600 hover:underline inline-flex items-center gap-1">
                            <i data-lucide="phone" class="w-3 h-3"></i>
                            <span>${s.parent_phone}</span>
                          </a>
                        ` : `<span class="text-slate-400 italic">-</span>`}
                      </td>
                      <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        ${Utils.formatRupiah(s.monthly_fee)}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="TpqComponent.openPayModalForStudent('${s.student_id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition">
                          Bayar SPP
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right: Payment Transactions & WA Kwitansi (6 Cols) -->
          <div class="lg:col-span-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Riwayat Pembayaran SPP</h3>
                <p class="text-xs text-slate-500">Mutasi kas SPP dan kwitansi wali</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">Santri / Periode</th>
                    <th class="py-3 px-4">Tanggal Bayar</th>
                    <th class="py-3 px-4 text-right">Nominal</th>
                    <th class="py-3 px-4 text-center">Kwitansi WA</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  ${payments.map(p => {
                    const st = students.find(s => s.student_id === p.student_id);
                    const stName = st ? st.full_name : p.student_id;
                    const phone = st ? st.parent_phone : "";

                    return `
                      <tr class="hover:bg-slate-50/50 transition">
                        <td class="py-3 px-4">
                          <div class="font-bold text-slate-900 dark:text-white">${stName}</div>
                          <div class="text-[11px] text-emerald-600 font-medium">Periode: ${p.period_month_year}</div>
                        </td>
                        <td class="py-3 px-4 text-slate-600">${Utils.formatDateIndo(p.date_paid)}</td>
                        <td class="py-3 px-4 text-right font-extrabold text-emerald-600">${Utils.formatRupiah(p.amount_paid)}</td>
                        <td class="py-3 px-4 text-center">
                          <button onclick="TpqComponent.sendParentKwitansi('${p.payment_id}')" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition inline-flex items-center gap-1 text-[11px] font-semibold" title="Kirim Kwitansi ke WhatsApp Orang Tua">
                            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                            <span>Kirim WA</span>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      <div id="modal-tpq-container"></div>
    `;
  },

  openAddStudentModal: function() {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Pendaftaran Santri Baru TPQ</h3>
            <button onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="TpqComponent.saveNewStudent(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Lengkap Santri</label>
              <input type="text" id="san-name" required placeholder="Contoh: Muhammad Rayyan" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">No. WhatsApp Orang Tua / Wali</label>
              <input type="tel" id="san-phone" required placeholder="0812xxxxxxxx" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Iuran SPP Bulanan (Rp)</label>
              <input type="number" id="san-fee" value="150000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan Santri</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-tpq-container").innerHTML = html;
  },

  saveNewStudent: function(e) {
    e.preventDefault();
    const name = document.getElementById("san-name").value;
    const phone = document.getElementById("san-phone").value;
    const fee = parseFloat(document.getElementById("san-fee").value) || 150000;

    const newStudent = {
      student_id: Utils.generateId("SAN-"),
      full_name: name,
      parent_phone: phone,
      monthly_fee: fee,
      status_active: "Aktif"
    };

    state.addItem("tpq_students", newStudent, "student_id", "SAN-");
    ApiService.postAction("createTPQStudent", { data: newStudent });

    document.getElementById("modal-tpq-container").innerHTML = "";
    Utils.showToast(`Santri ${name} berhasil didaftarkan!`, "success");
    App.renderView();
  },

  openPayModal: function() {
    this.openPayModalForStudent("");
  },

  openPayModalForStudent: function(selectedStudentId) {
    const students = state.data.tpq_students;
    const currentMonth = "September 2026";

    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Kasir Pembayaran SPP TPQ</h3>
            <button onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="TpqComponent.savePayment(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Pilih Santri</label>
              <select id="pay-student" required class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                <option value="">-- Pilih Santri --</option>
                ${students.map(s => `
                  <option value="${s.student_id}" ${s.student_id === selectedStudentId ? 'selected' : ''}>
                    ${s.full_name} (${s.student_id}) - ${Utils.formatRupiah(s.monthly_fee)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Periode Bulan</label>
                <select id="pay-period" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="September 2026" selected>September 2026</option>
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="Desember 2026">Desember 2026</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Tanggal Bayar</label>
                <input type="date" id="pay-date" value="${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nominal SPP Dibayarkan (Rp)</label>
              <input type="number" id="pay-amount" value="150000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 font-extrabold text-sm text-emerald-600">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Staf Penerima</label>
              <input type="text" id="pay-staff" value="Usth. Fatimah" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan & Masuk Kas</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-tpq-container").innerHTML = html;
  },

  savePayment: function(e) {
    e.preventDefault();
    const studentId = document.getElementById("pay-student").value;
    const period = document.getElementById("pay-period").value;
    const date = document.getElementById("pay-date").value;
    const amount = parseFloat(document.getElementById("pay-amount").value) || 0;
    const staff = document.getElementById("pay-staff").value;

    if (!studentId) {
      Utils.showToast("Silakan pilih santri terlebih dahulu.", "error");
      return;
    }

    const payRecord = {
      payment_id: Utils.generateId("PAY-"),
      student_id: studentId,
      period_month_year: period,
      amount_paid: amount,
      date_paid: date,
      receiver_staff: staff
    };

    // Record payment (automatically adds to general ledger too)
    state.recordTPQPayment(payRecord);
    ApiService.postAction("recordTPQPayment", { data: payRecord });

    document.getElementById("modal-tpq-container").innerHTML = "";
    Utils.showToast("Pembayaran SPP berhasil dicatat & masuk kas!", "success");
    Utils.playAudio("cash");
    App.renderView();
  },

  sendParentKwitansi: function(paymentId) {
    const pay = state.data.tpq_payments.find(p => p.payment_id === paymentId);
    if (!pay) return;

    const student = state.data.tpq_students.find(s => s.student_id === pay.student_id);
    const config = ConfigManager.getAll();

    const text = `*KWITANSI PEMBAYARAN SPP TPQ*
*${config.mosque_name.toUpperCase()}*
_${config.mosque_tagline}_
----------------------------------------
*No. Kwitansi:* ${pay.payment_id}
*Nama Santri:* ${student ? student.full_name : pay.student_id}
*Periode SPP:* ${pay.period_month_year}
*Tanggal Bayar:* ${Utils.formatDateIndo(pay.date_paid)}
*Penerima:* ${pay.receiver_staff}
----------------------------------------
*JUMLAH LUNAS:* ${Utils.formatRupiah(pay.amount_paid)}
----------------------------------------
_Alhamdulillah, iuran SPP santri telah kami terima. Semoga ananda senantiasa istiqamah belajar Al-Qur'an dan menjadi anak yang shalih/shalihah. Aamiin._

*Status:* LUNAS & SAH TERCATAT`;

    const phone = student ? student.parent_phone : "";
    const cleanPhone = Utils.cleanPhone(phone);
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
};


/* === js/components/portal.js === */
/**
 * ==============================================================================
 * COMPONENT: PUBLIC PORTAL (PORTAL JAMAAH MBJ)
 * Live Financial Transparency, Kajian Schedules, Self-Service CSR & Digital QRIS
 * ==============================================================================
 */

const PortalComponent = {
  render: function() {
    const config = ConfigManager.getAll();
    const fin = state.getFinancialSummary();
    const upcomingAgendas = state.data.ubudiyah.slice(0, 4);

    return `
      <div class="space-y-8 animate-fade-in max-w-6xl mx-auto py-2">
        
        <!-- Public Hero Banner with Islamic Motif -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-emerald-500/20 text-center sm:text-left">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div class="space-y-3 max-w-2xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-amber-300">
                <i data-lucide="sun" class="w-4 h-4"></i>
                <span>PORTAL RESMI PELAYANAN UMAT</span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${config.mosque_name}</h1>
              <p class="text-emerald-100/90 text-sm sm:text-base leading-relaxed">${config.mosque_tagline}</p>
              <div class="text-xs text-emerald-200/80 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i> ${config.mosque_address}</span>
                <span>•</span>
                <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-amber-400"></i> ${config.mosque_phone}</span>
              </div>
            </div>

            <!-- Infaq Shortcut Button -->
            <div class="flex-shrink-0">
              <a href="#digital-infaq-section" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5">
                <i data-lucide="qr-code" class="w-5 h-5"></i>
                <span>Infaq & Donasi Digital</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 1. Transparansi Kas Keuangan Riil -->
        <div id="portal-kas" class="space-y-4 pt-2">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600"></i>
                <span>Transparansi Laporan Kas Masjid</span>
              </h2>
              <p class="text-xs text-slate-500">Amanah umat dikelola secara terbuka & diaudit secara realtime</p>
            </div>
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Terbuka untuk Umum</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Riil Kas Saat Ini</span>
              <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">${Utils.formatRupiah(fin.balance)}</div>
              <div class="text-xs text-emerald-600 font-medium mt-1">Saldo Kas Siap Pakai</div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemasukan Bulan Ini</span>
              <div class="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 mt-2">${Utils.formatRupiah(fin.thisMonthIn)}</div>
              <div class="text-xs text-slate-500 mt-1">Infaq Tromol & Muhsinin</div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Penyaluran & Operasional</span>
              <div class="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">${Utils.formatRupiah(fin.thisMonthOut)}</div>
              <div class="text-xs text-slate-500 mt-1">Fee Dakwah & Pemeliharaan Gedung</div>
            </div>
          </div>
        </div>

        <!-- 2. Jadwal Kajian Sunnah & Khutbah Jumat -->
        <div id="portal-agenda" class="space-y-4 pt-2">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="calendar" class="w-5 h-5 text-emerald-600"></i>
              <span>Agenda Kajian Ilmiah & Khutbah Jumat</span>
            </h2>
            <p class="text-xs text-slate-500">Terbuka untuk ikhwan dan akhwat, fasilitas lengkap & live streaming YouTube</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${upcomingAgendas.map(item => `
              <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500 transition">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.type === 'Khutbah Jumat' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'}">
                      ${item.type}
                    </span>
                    <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                      <span>Masjid MBJ</span>
                    </span>
                  </div>

                  <h3 class="font-extrabold text-base text-slate-900 dark:text-white mt-3">${item.title}</h3>
                  <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                    <i data-lucide="user" class="w-4 h-4"></i>
                    <span>${item.ustadz_name}</span>
                  </div>

                  <div class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
                    <span>${item.date_time}</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span class="text-slate-500">Fasilitas: Parkir Luas, AC, Konsumsi</span>
                  <a href="https://youtube.com" target="_blank" class="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                    <i data-lucide="play-circle" class="w-4 h-4"></i>
                    <span>Live YouTube</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Form Permohonan Layanan Sosial Jamaah (Self-Service) -->
        <div id="portal-csr" class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
          <div class="max-w-2xl mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
              <i data-lucide="heart" class="w-3.5 h-3.5"></i>
              <span>LAYANAN SOSIAL GRATIS</span>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">Permohonan Ambulans & Layanan Jenazah</h2>
            <p class="text-xs text-slate-500 mt-1">Bagi jamaah yang memerlukan bantuan transportasi darurat medis atau fardhu kifayah jenazah, silakan isi form berikut. Tim siaga MBJ akan langsung merespon.</p>
          </div>

          <form onsubmit="PortalComponent.submitPublicRequest(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Layanan</label>
              <select id="pub-type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
                <option value="Ambulance">🚑 Ambulans Pasien Medis (Gratis 24 Jam)</option>
                <option value="Jenazah">🕊️ Layanan Pengurusan & Mobil Jenazah</option>
                <option value="Siber Air">💧 Permohonan Galon Air Siber (Dhuafa)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Pemohon / Penanggung Jawab</label>
              <input type="text" id="pub-name" required placeholder="Nama lengkap..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
              <input type="tel" id="pub-phone" required placeholder="0812xxxxxxxx" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal & Waktu Diperlukan</label>
              <input type="datetime-local" id="pub-date" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Penjemputan / Rumah Sakit Tujuan / Keterangan Kebutuhan</label>
              <textarea id="pub-dest" required rows="3" placeholder="Contoh: Jemput di Jl. Melati No. 5 untuk rujukan ke RSUD Budi Asih..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"></textarea>
            </div>

            <div class="sm:col-span-2 flex justify-end">
              <button type="submit" class="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition">
                Kirim Permohonan ke Tim Siaga MBJ
              </button>
            </div>
          </form>
        </div>

        <!-- 4. Digital Infaq & QRIS Section -->
        <div id="digital-infaq-section" class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="text-center max-w-xl mx-auto mb-6">
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">ZISWAF & Amal Jariyah</span>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-2">Salurkan Infaq & Sedekah Anda</h2>
            <p class="text-xs text-slate-500 mt-1">Setiap rupiah yang Anda salurkan menjadi jariyah dakwah, santunan yatim dan operasional rumah Allah.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <!-- QRIS Card -->
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-md">
              <div class="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 mb-2">QRIS Infaq Standar MBJ</div>
              <img src="${config.qris_image_url}" alt="QRIS Infaq" class="w-44 h-44 mx-auto rounded-xl border p-2 object-contain">
              <div class="text-[11px] text-slate-500 mt-3">Mendukung BCA, GoPay, OVO, ShopeePay, DANA, LinkAja & Seluruh Mobile Banking</div>
            </div>

            <!-- Bank Accounts (2 Cards) -->
            <div id="portal-bank" class="md:col-span-2 space-y-4">
              
              <!-- BSI -->
              <div class="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs font-bold text-teal-800 dark:text-teal-300">BANK SYARIAH INDONESIA (BSI)</div>
                  <div class="text-lg font-black text-slate-900 dark:text-white tracking-wider mt-1">${config.bank_bsi}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Kode Bank: 451 • Pos Infaq Operasional & Tromol</div>
                </div>
                <button onclick="PortalComponent.copyText('${config.bank_bsi}')" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 text-teal-800 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 transition whitespace-nowrap shadow-sm">
                  Salin Rekening
                </button>
              </div>

              <!-- Bank Muamalat -->
              <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs font-bold text-purple-800 dark:text-purple-300">BANK MUAMALAT</div>
                  <div class="text-lg font-black text-slate-900 dark:text-white tracking-wider mt-1">${config.bank_muamalat}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Kode Bank: 147 • Pos ZISWAF & Dakwah Sunnah</div>
                </div>
                <button onclick="PortalComponent.copyText('${config.bank_muamalat}')" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 text-purple-800 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition whitespace-nowrap shadow-sm">
                  Salin Rekening
                </button>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 text-center">
                Konfirmasi donasi & bukti transfer via WhatsApp: <a href="https://wa.me/${Utils.cleanPhone(config.mosque_phone)}" target="_blank" class="font-bold text-emerald-600 hover:underline">${config.mosque_phone}</a>
              </div>

            </div>

          </div>
        </div>

      </div>
    `;
  },

  copyText: function(text) {
    navigator.clipboard.writeText(text).then(() => {
      Utils.showToast("Nomor rekening berhasil disalin ke clipboard!", "success");
    });
  },

  submitPublicRequest: function(e) {
    e.preventDefault();
    const type = document.getElementById("pub-type").value;
    const name = document.getElementById("pub-name").value;
    const phone = document.getElementById("pub-phone").value;
    const date = document.getElementById("pub-date").value;
    const dest = document.getElementById("pub-dest").value;

    const newReq = {
      service_id: Utils.generateId("PUB-"),
      service_type: type,
      requester_name: name,
      phone: phone,
      date_reserved: date.slice(0, 10),
      destination_or_detail: dest,
      status: "Menunggu"
    };

    state.addItem("social", newReq, "service_id", "PUB-");
    ApiService.postAction("createSocial", { data: newReq });

    Utils.showToast("Alhamdulillah! Permohonan Anda telah terkirim ke Tim Siaga MBJ.", "success");
    e.target.reset();
  }
};


/* === js/components/settings.js === */
/**
 * ==============================================================================
 * COMPONENT: SETTINGS (SAAS WHITE-LABEL CMS STUDIO)
 * Dynamic Theme Engine, Mosque Branding, Running Marquee, Bank & GAS Setup
 * ==============================================================================
 */

const SettingsComponent = {
  render: function() {
    const config = ConfigManager.getAll();

    return `
      <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
        
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-purple-100 text-purple-700">
              <i data-lucide="palette" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">CMS Appearance & White-Label Studio</h2>
              <p class="text-xs text-slate-500">Sesuaikan identitas nama masjid, warna tema, running text & integrasi Google Sheets</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="SettingsComponent.resetDefaults()" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
              Reset Default
            </button>
            <button onclick="SettingsComponent.saveAllSettings()" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5">
              <i data-lucide="save" class="w-4 h-4"></i>
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </div>

        <!-- 1. Theme Color Customizer -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Tema & Palet Warna Brand</h3>
              <p class="text-xs text-slate-500">Pilih palet instan atau atur warna heksadesimal kustom</p>
            </div>
            <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">Realtime Preview</span>
          </div>

          <!-- Preset Theme Buttons -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Palet Warna Siap Pakai:</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              ${THEME_PRESETS.map(p => `
                <button type="button" onclick="SettingsComponent.applyPresetTheme('${p.primary}', '${p.accent}')" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-500 transition flex items-center gap-2.5 text-xs text-left shadow-sm">
                  <span class="w-5 h-5 rounded-full flex-shrink-0" style="background: linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 50%);"></span>
                  <span class="font-bold truncate text-slate-800 dark:text-slate-200">${p.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Color Pickers -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Warna Utama (Primary Color)</label>
              <div class="flex items-center gap-2">
                <input type="color" id="cfg-theme-color" value="${config.theme_color || '#059669'}" onchange="SettingsComponent.livePreviewTheme()" class="w-10 h-10 rounded-lg cursor-pointer border p-0.5">
                <input type="text" id="cfg-theme-color-text" value="${config.theme_color || '#059669'}" oninput="SettingsComponent.syncColorText('cfg-theme-color', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Warna Aksen (Accent Gold/Amber)</label>
              <div class="flex items-center gap-2">
                <input type="color" id="cfg-accent-color" value="${config.accent_color || '#d97706'}" onchange="SettingsComponent.livePreviewTheme()" class="w-10 h-10 rounded-lg cursor-pointer border p-0.5">
                <input type="text" id="cfg-accent-color-text" value="${config.accent_color || '#d97706'}" oninput="SettingsComponent.syncColorText('cfg-accent-color', this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono">
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Mosque Identity & Branding -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div class="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Identitas Masjid & Kontak Resmi</h3>
            <p class="text-xs text-slate-500">Nama masjid, logo url, alamat dan kontak darurat</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Nama Resmi Masjid</label>
              <input type="text" id="cfg-mosque-name" value="${config.mosque_name}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-sm">
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Tagline / Motto Dakwah</label>
              <input type="text" id="cfg-mosque-tagline" value="${config.mosque_tagline}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Logo URL (Link Gambar Transparan PNG/JPG)</label>
              <input type="text" id="cfg-logo-url" value="${config.logo_url}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">No. WhatsApp / Helpline DKM</label>
              <input type="tel" id="cfg-mosque-phone" value="${config.mosque_phone}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200">
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Alamat Lengkap Masjid</label>
              <textarea id="cfg-mosque-address" rows="2" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200">${config.mosque_address}</textarea>
            </div>
          </div>
        </div>

        <!-- 3. Running Text Marquee & Announcements -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Teks Berjalan (Running Text Marquee)</h3>
              <p class="text-xs text-slate-500">Pengumuman kajian, agenda shalat Jumat & himbauan jamaah</p>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-xs font-semibold text-slate-600">Status:</label>
              <select id="cfg-marquee-enabled" class="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-200">
                <option value="true" ${config.running_text_enabled !== 'false' ? 'selected' : ''}>Aktif</option>
                <option value="false" ${config.running_text_enabled === 'false' ? 'selected' : ''}>Nonaktif</option>
              </select>
            </div>
          </div>

          <div>
            <textarea id="cfg-running-text" rows="3" placeholder="Tulis teks pengumuman di sini..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs">${config.running_text}</textarea>
          </div>
        </div>

        <!-- 4. Bank Accounts & QRIS Infaq -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div class="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white">Rekening Infaq & QRIS Masjid</h3>
            <p class="text-xs text-slate-500">Data rekening bank resmi yang tampil pada portal publik jamaah</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Rekening Bank Syariah Indonesia (BSI)</label>
              <input type="text" id="cfg-bank-bsi" value="${config.bank_bsi}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Rekening Bank Muamalat / Bank Lain</label>
              <input type="text" id="cfg-bank-muamalat" value="${config.bank_muamalat}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold">
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-600 mb-1">URL Gambar QRIS Infaq</label>
              <input type="text" id="cfg-qris-url" value="${config.qris_image_url}" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono">
            </div>
          </div>
        </div>

        <!-- 5. Google Apps Script Database Engine Connection -->
        <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Integrasi Backend Google Apps Script (GAS)</h3>
              <p class="text-xs text-slate-500">Koneksikan Web App URL hasil Deploy Google Sheets Anda</p>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${ApiService.isConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
              ${ApiService.isConfigured() ? '🟢 Terhubung ke Sheets' : '🟡 Mode Demo / Offline'}
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">URL Google Apps Script Web App (Deploy as Web App)</label>
              <input type="url" id="cfg-gas-url" value="${config.gas_web_app_url || ''}" placeholder="https://script.google.com/macros/s/AKfycbx.../exec" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs">
              <p class="text-[11px] text-slate-400 mt-1">Salin URL dari menu Google Apps Script > Deploy > New Deployment > Web app (Execute as: Me, Access: Anyone).</p>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-2">
              <button type="button" onclick="SettingsComponent.testGasConnection()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition flex items-center gap-1.5">
                <i data-lucide="activity" class="w-4 h-4"></i>
                <span>Test Koneksi GAS</span>
              </button>

              <button type="button" onclick="SettingsComponent.initGoogleSheetsDatabase()" class="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition flex items-center gap-1.5 shadow-md">
                <i data-lucide="database" class="w-4 h-4"></i>
                <span>Inisialisasi 9 Tabs Database Sheets</span>
              </button>

              <button type="button" onclick="SettingsComponent.exportDataBackup()" class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition flex items-center gap-1.5">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Backup JSON Lokal</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  applyPresetTheme: function(primary, accent) {
    document.getElementById("cfg-theme-color").value = primary;
    document.getElementById("cfg-theme-color-text").value = primary;
    document.getElementById("cfg-accent-color").value = accent;
    document.getElementById("cfg-accent-color-text").value = accent;
    this.livePreviewTheme();
  },

  syncColorText: function(targetId, val) {
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      document.getElementById(targetId).value = val;
      this.livePreviewTheme();
    }
  },

  livePreviewTheme: function() {
    const primary = document.getElementById("cfg-theme-color").value;
    const accent = document.getElementById("cfg-accent-color").value;
    document.getElementById("cfg-theme-color-text").value = primary;
    document.getElementById("cfg-accent-color-text").value = accent;

    ConfigManager.setMany({
      theme_color: primary,
      accent_color: accent
    });
  },

  saveAllSettings: function() {
    const newConfigs = {
      theme_color: document.getElementById("cfg-theme-color").value,
      accent_color: document.getElementById("cfg-accent-color").value,
      mosque_name: document.getElementById("cfg-mosque-name").value,
      mosque_tagline: document.getElementById("cfg-mosque-tagline").value,
      logo_url: document.getElementById("cfg-logo-url").value,
      mosque_phone: document.getElementById("cfg-mosque-phone").value,
      mosque_address: document.getElementById("cfg-mosque-address").value,
      running_text_enabled: document.getElementById("cfg-marquee-enabled").value,
      running_text: document.getElementById("cfg-running-text").value,
      bank_bsi: document.getElementById("cfg-bank-bsi").value,
      bank_muamalat: document.getElementById("cfg-bank-muamalat").value,
      qris_image_url: document.getElementById("cfg-qris-url").value,
      gas_web_app_url: document.getElementById("cfg-gas-url").value.trim()
    };

    ConfigManager.setMany(newConfigs);

    // Sync to GAS config if connected
    ApiService.postAction("saveConfig", { configs: newConfigs });

    Utils.showToast("Pengaturan CMS berhasil disimpan & diterapkan!", "success");
    App.renderNavbar();
    App.renderSidebar();
    App.renderView();
  },

  testGasConnection: async function() {
    const url = document.getElementById("cfg-gas-url").value.trim();
    if (!url) {
      Utils.showToast("Masukkan URL Google Apps Script terlebih dahulu.", "error");
      return;
    }
    ConfigManager.set("gas_web_app_url", url);

    Utils.showToast("Menguji koneksi ke Google Apps Script...", "info");
    const result = await ApiService.testConnection();

    if (result.success) {
      Utils.showToast("Alhamdulillah! Koneksi ke Google Apps Script berhasil.", "success");
    } else {
      Utils.showToast(`Gagal: ${result.message}`, "error");
    }
    App.renderNavbar();
  },

  initGoogleSheetsDatabase: async function() {
    if (!confirm("Jalankan inisialisasi skema 9 Sheets database dan data awal?")) return;

    Utils.showToast("Memproses inisialisasi Google Sheets...", "info");
    const res = await ApiService.triggerSetupDatabase();
    if (res.success) {
      Utils.showToast("Inisialisasi 9 Sheet database Google Sheets berhasil!", "success");
    } else {
      Utils.showToast(`Info: ${res.message}`, "info");
    }
  },

  resetDefaults: function() {
    if (confirm("Kembalikan semua pengaturan CMS dan data ke setelan awal?")) {
      state.resetToFactoryDefaults();
      App.renderNavbar();
      App.renderSidebar();
      App.renderView();
    }
  },

  exportDataBackup: function() {
    const backup = {
      config: ConfigManager.getAll(),
      data: state.data,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `backup_masjid_mbj_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    Utils.showToast("File backup JSON berhasil diunduh.", "success");
  }
};


/* === js/app.js === */
/**
 * ==============================================================================
 * APPLICATION BOOTSTRAP & MAIN ORCHESTRATOR
 * Router, Modal Managers (Thermal Receipt & Quick Input) & Icon Re-hydration
 * ==============================================================================
 */

const App = {
  activeModalTrxId: null,

  init: function() {
    try {
      // 1. Initial State & Configuration
      ConfigManager.applyTheme();

      // 2. Setup Hash Router
      window.addEventListener("hashchange", () => {
        this.handleRoute();
      });

      // 3. Setup Global State Listeners
      state.on("auth:change", () => {
        this.renderNavbar();
        this.renderSidebar();
        this.renderBottomNav();
        this.handleRoute();
      });

      state.on("gas:status", () => {
        this.renderNavbar();
      });

      // 4. Initial Render
      this.renderNavbar();
      this.renderSidebar();
      this.renderBottomNav();
      this.handleRoute();

      // 5. If GAS Web App URL is saved, attempt background sync
      if (ApiService.isConfigured()) {
        ApiService.syncFromGAS();
      }

      console.log("🕌 Sistem Manajemen Masjid MBJ Siap Digunakan.");
    } catch (e) {
      console.error("App init error:", e);
      // Fallback emergency render
      this.renderView();
    }
  },

  handleRoute: function() {
    let route = window.location.hash ? window.location.hash.replace("#", "") : "dashboard";
    if (!route) route = "dashboard";

    state.activeRoute = route;
    this.renderSidebar();
    this.renderBottomNav();
    this.renderView();
  },

  renderNavbar: function() {
    try {
      const navEl = document.getElementById("navbar-container");
      if (navEl && typeof NavbarComponent !== "undefined") {
        navEl.innerHTML = NavbarComponent.render();
        NavbarComponent.initListeners();
        this.reinitIcons();
      }
    } catch (e) {
      console.warn("Navbar render error:", e);
    }
  },

  renderSidebar: function() {
    try {
      const sideEl = document.getElementById("sidebar-container");
      if (sideEl && typeof SidebarComponent !== "undefined") {
        sideEl.innerHTML = SidebarComponent.render();
        SidebarComponent.initListeners();
        this.reinitIcons();
      }
    } catch (e) {
      console.warn("Sidebar render error:", e);
    }
  },

  renderBottomNav: function() {
    try {
      const bottomEl = document.getElementById("bottomnav-container");
      if (bottomEl && typeof BottomNavComponent !== "undefined") {
        bottomEl.innerHTML = BottomNavComponent.render();
        BottomNavComponent.initListeners();
        this.reinitIcons();
      }
    } catch (e) {
      console.warn("BottomNav render error:", e);
    }
  },

  toggleSidebar: function(forceState) {
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const mainContent = document.getElementById("app-main-content");
    const footer = document.getElementById("app-footer");

    if (!sidebar) return;

    const isCurrentlyClosed = sidebar.classList.contains("-translate-x-full");
    const willOpen = typeof forceState === "boolean" ? forceState : isCurrentlyClosed;

    state.isSidebarOpen = willOpen;

    if (willOpen) {
      sidebar.classList.remove("-translate-x-full");
      sidebar.classList.add("translate-x-0");
      if (backdrop && window.innerWidth < 1024) {
        backdrop.classList.remove("hidden");
      }
      if (mainContent) {
        mainContent.classList.remove("lg:pl-0");
        mainContent.classList.add("lg:pl-64");
      }
      if (footer) {
        footer.classList.remove("lg:pl-0");
        footer.classList.add("lg:pl-64");
      }
    } else {
      sidebar.classList.remove("translate-x-0");
      sidebar.classList.add("-translate-x-full");
      if (backdrop) {
        backdrop.classList.add("hidden");
      }
      if (mainContent) {
        mainContent.classList.remove("lg:pl-64");
        mainContent.classList.add("lg:pl-0");
      }
      if (footer) {
        footer.classList.remove("lg:pl-64");
        footer.classList.add("lg:pl-0");
      }
    }
    this.reinitIcons();
  },

  renderView: function() {
    const mainEl = document.getElementById("main-content-view");
    if (!mainEl) return;

    const route = state.activeRoute;

    try {
      switch (route) {
        case "dashboard":
          mainEl.innerHTML = DashboardComponent.render();
          setTimeout(() => { try { DashboardComponent.initCharts(); } catch(e){} }, 50);
          break;
        case "pos":
          mainEl.innerHTML = PosComponent.render();
          break;
        case "transactions":
          mainEl.innerHTML = TransactionsComponent.render();
          break;
        case "ubudiyah":
          mainEl.innerHTML = UbudiyahComponent.render();
          break;
        case "multimedia":
          mainEl.innerHTML = MultimediaComponent.render();
          break;
        case "facilities":
          mainEl.innerHTML = FacilitiesComponent.render();
          break;
        case "social":
          mainEl.innerHTML = SocialComponent.render();
          break;
        case "tpq":
          mainEl.innerHTML = TpqComponent.render();
          break;
        case "portal":
          mainEl.innerHTML = PortalComponent.render();
          break;
        case "settings":
          mainEl.innerHTML = SettingsComponent.render();
          break;
        default:
          mainEl.innerHTML = DashboardComponent.render();
          setTimeout(() => { try { DashboardComponent.initCharts(); } catch(e){} }, 50);
          break;
      }
    } catch (err) {
      console.error("View render error:", err);
      mainEl.innerHTML = `
        <div class="glass-card p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-10">
          <div class="text-rose-500 font-bold text-lg">Terjadi Kendala Memuat Tampilan</div>
          <p class="text-xs text-slate-500">${err.message}</p>
          <button onclick="window.location.hash='#dashboard'; location.reload();" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Kembali ke Dashboard</button>
        </div>
      `;
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.reinitIcons();
  },

  reinitIcons: function() {
    try {
      if (typeof lucide !== "undefined" && lucide.createIcons) {
        lucide.createIcons();
      }
    } catch (e) {
      // Lucide icon fallback
    }
  },

  // ==========================================================================
  // THERMAL RECEIPT MODAL & PRINTER
  // ==========================================================================
  openThermalReceiptModal: function(trxId) {
    const trx = state.data.transactions.find(t => t.trx_id === trxId);
    if (!trx) {
      Utils.showToast("Data transaksi tidak ditemukan.", "error");
      return;
    }

    this.activeModalTrxId = trxId;
    const receiptHtml = Utils.buildThermalReceiptHtml(trx);

    // Update print container
    const printContainer = document.getElementById("thermal-receipt-container");
    if (printContainer) {
      printContainer.innerHTML = receiptHtml;
    }

    const modalHtml = `
      <div id="modal-thermal-receipt" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Modal Header -->
          <div class="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="printer" class="w-4 h-4 text-emerald-600"></i>
              <span class="font-bold text-sm text-slate-900 dark:text-white">Preview Struk Thermal</span>
            </div>
            <button onclick="App.closeThermalModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <!-- Thermal Slip Viewport -->
          <div class="p-4 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex justify-center">
            <div class="thermal-paper p-4 w-full max-w-[280px] text-slate-900 rounded-sm">
              ${receiptHtml}
            </div>
          </div>

          <!-- Modal Action Bar -->
          <div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <button onclick="App.executeThermalPrint()" class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2">
              <i data-lucide="printer" class="w-4 h-4"></i>
              <span>Cetak ke Printer Thermal (POS)</span>
            </button>

            <div class="grid grid-cols-2 gap-2">
              <button onclick="Utils.openWhatsAppReceipt('', state.data.transactions.find(t => t.trx_id === '${trxId}'))" class="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-1.5">
                <i data-lucide="message-square" class="w-3.5 h-3.5 text-emerald-600"></i>
                <span>Share WhatsApp</span>
              </button>

              <button onclick="App.closeThermalModal()" class="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition">
                Tutup
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.getElementById("modal-global-container").innerHTML = modalHtml;
    this.reinitIcons();
  },

  closeThermalModal: function() {
    document.getElementById("modal-global-container").innerHTML = "";
  },

  executeThermalPrint: function() {
    window.print();
  },

  // ==========================================================================
  // QUICK TRANSACTION MODAL (CASH IN / CASH OUT)
  // ==========================================================================
  openQuickTransactionModal: function(defaultType = "IN") {
    const isIncome = defaultType === "IN";

    const modalHtml = `
      <div id="modal-quick-trx" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
          
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Input Kas Cepat</h3>
            <button onclick="document.getElementById('modal-global-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="App.saveQuickTrx(event)" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Jenis Kas</label>
                <select id="quick-type" onchange="App.onQuickTypeChange(this.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 font-bold">
                  <option value="IN" ${isIncome ? 'selected' : ''}>Pemasukan (IN)</option>
                  <option value="OUT" ${!isIncome ? 'selected' : ''}>Pengeluaran (OUT)</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Tanggal</label>
                <input type="date" id="quick-date" value="${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Kategori</label>
                <input type="text" id="quick-cat" required value="${isIncome ? 'Tromol Masjid' : 'Operasional & Logistik Marbot'}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Sub-Pos</label>
                <input type="text" id="quick-sub" required value="${isIncome ? 'Kotak Infaq Jumat' : 'Karbol & Pembersih Lt 1'}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nominal (Rp)</label>
              <input type="number" id="quick-amount" required placeholder="0" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 font-extrabold text-base text-emerald-600">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Keterangan / Catatan</label>
              <input type="text" id="quick-notes" placeholder="Uraian kas..." class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Penanggung Jawab</label>
              <input type="text" id="quick-pj" value="${state.currentUser.username}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-global-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan Transaksi</button>
            </div>
          </form>

        </div>
      </div>
    `;

    document.getElementById("modal-global-container").innerHTML = modalHtml;
    this.reinitIcons();
  },

  onQuickTypeChange: function(type) {
    const isIncome = type === "IN";
    document.getElementById("quick-cat").value = isIncome ? "Tromol Masjid" : "Operasional & Logistik Marbot";
    document.getElementById("quick-sub").value = isIncome ? "Kotak Infaq Jumat" : "Karbol & Pembersih Lt 1";
  },

  saveQuickTrx: function(e) {
    e.preventDefault();
    const type = document.getElementById("quick-type").value;
    const date = document.getElementById("quick-date").value;
    const cat = document.getElementById("quick-cat").value;
    const sub = document.getElementById("quick-sub").value;
    const amount = parseFloat(document.getElementById("quick-amount").value) || 0;
    const notes = document.getElementById("quick-notes").value || sub;
    const pj = document.getElementById("quick-pj").value;

    if (amount <= 0) {
      Utils.showToast("Nominal harus lebih besar dari Rp 0", "error");
      return;
    }

    const newTrx = {
      trx_id: Utils.generateId(type === "IN" ? "TRX-IN-" : "TRX-OUT-"),
      date: date,
      type: type,
      category: cat,
      sub_category: sub,
      amount: amount,
      notes: notes,
      pj_name: pj,
      proof_url: "",
      created_at: new Date().toISOString()
    };

    state.addTransaction(newTrx);
    ApiService.postAction("createTransaction", { data: newTrx });

    document.getElementById("modal-global-container").innerHTML = "";
    Utils.playAudio("cash");
    Utils.showToast("Transaksi kas berhasil disimpan!", "success");
    this.renderView();
  }
};

// Bootstrap application on DOM ready or immediately if already parsed
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}

