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
        (t.trx_id && t.trx_id.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.sub_category && t.sub_category.toLowerCase().includes(q)) ||
        (t.notes && t.notes.toLowerCase().includes(q)) ||
        (t.pj_name && t.pj_name.toLowerCase().includes(q))
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
