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
