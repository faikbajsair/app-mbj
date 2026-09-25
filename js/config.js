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
  gas_web_app_url: "", // User can input their deployed Google Apps Script URL
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
