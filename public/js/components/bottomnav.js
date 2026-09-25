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
