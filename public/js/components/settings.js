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
