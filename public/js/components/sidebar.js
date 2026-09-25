/**
 * ==============================================================================
 * COMPONENT: SIDEBAR
 * Role-Based Dynamic Navigation Menu with Badges & Collapsible Mobile Drawer
 * ==============================================================================
 */

const SidebarComponent = {
  getNavItems: function(role) {
    const allItems = [
      { id: "dashboard", label: "Dashboard Ringkasan", icon: "layout-dashboard", roles: ["SuperAdmin", "Bendahara", "Marbot", "AdminTPQ", "AdminSosial"] },
      { id: "pos", label: "Smart POS & Kasir", icon: "calculator", badge: "KASIR", badgeColor: "bg-emerald-500", roles: ["SuperAdmin", "Bendahara"] },
      { id: "transactions", label: "Jurnal & Buku Kas", icon: "receipt", roles: ["SuperAdmin", "Bendahara"] },
      { id: "ubudiyah", label: "Ubudiyah & Khotib", icon: "calendar-days", roles: ["SuperAdmin", "Bendahara"] },
      { id: "multimedia", label: "Multimedia & Aset", icon: "video", roles: ["SuperAdmin"] },
      { id: "facilities", label: "Fasilitas & Marbot", icon: "sparkles", roles: ["SuperAdmin", "Marbot"] },
      { id: "social", label: "CSR & Layanan Sosial", icon: "heart-handshake", roles: ["SuperAdmin", "AdminSosial"] },
      { id: "tpq", label: "TPQ & SPP Santri", icon: "graduation-cap", roles: ["SuperAdmin", "AdminTPQ", "Bendahara"] },
      { id: "portal", label: "Portal Publik Jamaah", icon: "globe", roles: ["SuperAdmin", "Bendahara", "Marbot", "AdminTPQ", "AdminSosial", "Public"] },
      { id: "settings", label: "CMS Appearance Studio", icon: "palette", roles: ["SuperAdmin"] }
    ];

    if (role === "Public") {
      return allItems.filter(i => i.id === "portal");
    }

    return allItems.filter(item => item.roles.includes(role) || role === "SuperAdmin");
  },

  render: function() {
    const currentUser = state.currentUser;
    const currentRoute = state.activeRoute;
    const navItems = this.getNavItems(currentUser.role);
    const finSummary = state.getFinancialSummary();

    return `
      <aside id="app-sidebar" class="fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800/80 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between pt-16 sm:pt-18 pb-4">
        
        <!-- Navigation Link Groups -->
        <div class="px-3 py-4 space-y-1 overflow-y-auto flex-1">
          <div class="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            MENU UTAMA (${currentUser.role})
          </div>

          ${navItems.map(item => {
            const isActive = currentRoute === item.id;
            return `
              <a href="#${item.id}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }">
                <div class="flex items-center gap-3">
                  <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}"></i>
                  <span>${item.label}</span>
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

        <!-- Bottom Sidebar Info: Quick Balance & User Card -->
        <div class="px-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          
          <!-- Mini Cash Balance Card -->
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

          <!-- User Role Status -->
          <div class="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span class="font-medium text-slate-700 dark:text-slate-300 truncate">${currentUser.username} (${currentUser.role})</span>
            </div>
            <button onclick="state.logout()" title="Logout" class="hover:text-rose-600 transition">
              <i data-lucide="log-out" class="w-4 h-4"></i>
            </button>
          </div>

        </div>

      </aside>

      <!-- Mobile Backdrop Overlay -->
      <div id="sidebar-backdrop" class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm hidden lg:hidden transition-opacity"></div>
    `;
  },

  initListeners: function() {
    const toggleBtn = document.getElementById("btn-toggle-sidebar");
    const sidebar = document.getElementById("app-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");

    if (toggleBtn && sidebar && backdrop) {
      const toggle = () => {
        const isOpen = !sidebar.classList.contains("-translate-x-full");
        if (isOpen) {
          sidebar.classList.add("-translate-x-full");
          backdrop.classList.add("hidden");
        } else {
          sidebar.classList.remove("-translate-x-full");
          backdrop.classList.remove("hidden");
        }
      };

      toggleBtn.addEventListener("click", toggle);
      backdrop.addEventListener("click", toggle);

      // Auto close on navigation in mobile
      sidebar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          if (window.innerWidth < 1024) {
            sidebar.classList.add("-translate-x-full");
            backdrop.classList.add("hidden");
          }
        });
      });
    }
  }
};
