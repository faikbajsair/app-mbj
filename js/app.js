/**
 * ==============================================================================
 * APPLICATION BOOTSTRAP & MAIN ORCHESTRATOR
 * Router, Modal Managers (Thermal Receipt & Quick Input) & Icon Re-hydration
 * ==============================================================================
 */

const App = {
  activeModalTrxId: null,

  init: function() {
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
      this.handleRoute();
    });

    state.on("gas:status", () => {
      this.renderNavbar();
    });

    // 4. Initial Render
    this.renderNavbar();
    this.renderSidebar();
    this.handleRoute();

    // 5. If GAS Web App URL is saved, attempt background sync
    if (ApiService.isConfigured()) {
      ApiService.syncFromGAS();
    }

    console.log("🕌 Sistem Manajemen Masjid MBJ Siap Digunakan.");
  },

  handleRoute: function() {
    let route = window.location.hash ? window.location.hash.replace("#", "") : "dashboard";
    if (!route) route = "dashboard";

    state.activeRoute = route;
    this.renderSidebar();
    this.renderView();
  },

  renderNavbar: function() {
    const navEl = document.getElementById("navbar-container");
    if (navEl) {
      navEl.innerHTML = NavbarComponent.render();
      NavbarComponent.initListeners();
      this.reinitIcons();
    }
  },

  renderSidebar: function() {
    const sideEl = document.getElementById("sidebar-container");
    if (sideEl) {
      sideEl.innerHTML = SidebarComponent.render();
      SidebarComponent.initListeners();
      this.reinitIcons();
    }
  },

  renderView: function() {
    const mainEl = document.getElementById("main-content-view");
    if (!mainEl) return;

    const route = state.activeRoute;

    switch (route) {
      case "dashboard":
        mainEl.innerHTML = DashboardComponent.render();
        setTimeout(() => DashboardComponent.initCharts(), 50);
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
        setTimeout(() => DashboardComponent.initCharts(), 50);
        break;
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.reinitIcons();
  },

  reinitIcons: function() {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
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

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
