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
            
            <!-- Left: Mobile Menu Trigger + Brand Logo & Title -->
            <div class="flex items-center gap-3">
              <button id="btn-toggle-sidebar" class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition">
                <i data-lucide="menu" class="w-6 h-6"></i>
              </button>

              <div class="flex items-center gap-3 cursor-pointer select-none" onclick="window.location.hash='#dashboard'">
                <img src="${config.logo_url}" alt="Logo Masjid" class="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-emerald-500/30 shadow-md bg-white p-0.5" onerror="this.src='https://ui-avatars.com/api/?name=MBJ&background=059669&color=fff'">
                <div class="hidden sm:block">
                  <div class="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-tight tracking-tight">${config.mosque_name}</div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">${config.mosque_tagline}</div>
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
            <div class="flex items-center gap-2 sm:gap-3">
              
              <!-- GAS Connection Status Indicator -->
              <div class="flex items-center">
                <button id="btn-sync-gas" title="Sinkronisasi Data dengan Google Sheets" class="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                  <span class="w-2 h-2 rounded-full ${ApiService.isConfigured() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}"></span>
                  <span class="hidden xl:inline text-slate-600 dark:text-slate-300 font-medium">${ApiService.isConfigured() ? 'Sheets Sync' : 'Offline / Demo'}</span>
                  <i data-lucide="refresh-cw" class="w-3.5 h-3.5 text-slate-400 ${state.isSyncing ? 'animate-spin' : ''}"></i>
                </button>
              </div>

              <!-- Public Portal Quick Link -->
              <button onclick="window.location.hash='#portal'" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Lihat Portal Publik Jamaah">
                <i data-lucide="globe" class="w-5 h-5 text-emerald-600"></i>
              </button>

              <!-- Sound Toggle -->
              <button id="btn-toggle-sound" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition" title="Toggle Suara Notifikasi & Kasir">
                <i data-lucide="${ConfigManager.get('sound_enabled') === 'false' ? 'volume-x' : 'volume-2'}" class="w-5 h-5 text-slate-500"></i>
              </button>

              <!-- Role Switcher Quick Dropdown -->
              <div class="relative">
                <select id="select-active-role" class="text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold py-1.5 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 focus:outline-none cursor-pointer">
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
