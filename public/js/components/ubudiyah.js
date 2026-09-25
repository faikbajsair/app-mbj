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
