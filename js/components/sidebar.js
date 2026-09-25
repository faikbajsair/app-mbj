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
