/**
 * ==============================================================================
 * COMPONENT: FACILITIES & MARBOT (RUMAH TANGGA)
 * 3-Marbot Shift Tasks, Consumables Stock (Karbol Lt 1-2) & Maintenance Tickets
 * ==============================================================================
 */

const FacilitiesComponent = {
  marbotShifts: [
    { name: "Marbot Ahmad", shift: "Pagi (04.00 - 12.00)", area: "Lantai 1 (Ruang Utama, Mihrab, Tempat Wudhu Pria)", status: "Hadir / Bertugas" },
    { name: "Marbot Bambang", shift: "Siang - Sore (12.00 - 18.00)", area: "Lantai 2 (Balkon Shalat Wanita, Ruang Rapat, Koridor)", status: "Hadir / Bertugas" },
    { name: "Marbot Rizki", shift: "Malam (18.00 - 22.00)", area: "Seluruh Area (Kunci Pintu, Cek Lampu, AC & Sound System)", status: "Hadir / Bertugas" }
  ],

  render: function() {
    const tickets = state.data.household;

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-teal-100 text-teal-700">
              <i data-lucide="sparkles" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Fasilitas, Sanitasi & Rumah Tangga</h2>
              <p class="text-xs text-slate-500">Jadwal tugas marbot, stok karbol lantai 1-2 & tiket perbaikan gedung MBJ</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="FacilitiesComponent.openAddTicketModal('Kebersihan')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="spray-can" class="w-4 h-4"></i>
              <span>Pengajuan Stok Karbol</span>
            </button>
            <button onclick="FacilitiesComponent.openAddTicketModal('Fisik')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="wrench" class="w-4 h-4"></i>
              <span>Tiket Servis AC / Lampu</span>
            </button>
          </div>
        </div>

        <!-- 3 Marbot Shift Logger -->
        <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Penugasan & Shift 3 Petugas Marbot</h3>
              <p class="text-xs text-slate-500">Monitoring absensi dan zonasi area kebersihan harian</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">3 Personil Siaga</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            ${this.marbotShifts.map(m => `
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sm text-slate-900 dark:text-white">${m.name}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${m.status}</span>
                  </div>
                  <div class="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1">${m.shift}</div>
                  <div class="text-xs text-slate-500 mt-2">
                    <span class="font-medium text-slate-700 dark:text-slate-300">Zonasi:</span> ${m.area}
                  </div>
                </div>
                <div class="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span class="text-slate-400">Checklist SOP Harian</span>
                  <span class="text-emerald-600 font-bold">100% Selesai</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tickets & Consumables Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Daftar Tiket Pemeliharaan & Bahan Habis Pakai</h3>
              <p class="text-xs text-slate-500">Stok karbol, sabun, servis rutin AC, pergantian lampu & biaya konsumsi</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3 px-4">No. Tiket</th>
                  <th class="py-3 px-4">Divisi & Area</th>
                  <th class="py-3 px-4">Barang / Item Perbaikan</th>
                  <th class="py-3 px-4">Jumlah</th>
                  <th class="py-3 px-4">Estimasi Biaya</th>
                  <th class="py-3 px-4">PIC Marbot</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${tickets.map(item => `
                  <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${item.ticket_id}</td>
                    <td class="py-3 px-4">
                      <span class="font-bold text-slate-800 dark:text-slate-200">${item.division}</span>
                      <div class="text-[11px] text-teal-600 font-semibold">${item.area}</div>
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">${item.item}</td>
                    <td class="py-3 px-4 text-slate-600 font-medium">${item.qty}</td>
                    <td class="py-3 px-4 font-extrabold text-slate-900 dark:text-white">${Utils.formatRupiah(item.cost)}</td>
                    <td class="py-3 px-4 text-slate-600 font-medium">${item.pic_marbot}</td>
                    <td class="py-3 px-4">
                      <select onchange="FacilitiesComponent.changeStatus('${item.ticket_id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : (item.status === 'Dalam Proses' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-rose-50 text-rose-700 border-rose-300')
                      }">
                        <option value="Pending" ${item.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Dalam Proses" ${item.status === 'Dalam Proses' ? 'selected' : ''}>Dalam Proses</option>
                        <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <button onclick="FacilitiesComponent.deleteTicket('${item.ticket_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition">
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

      <div id="modal-facilities-container"></div>
    `;
  },

  changeStatus: function(ticketId, newStatus) {
    state.updateItem("household", ticketId, { status: newStatus }, "ticket_id");
    ApiService.postAction("updateHousehold", { id: ticketId, data: { status: newStatus } });
    Utils.showToast("Status tiket perbaikan diperbarui.", "success");
    App.renderView();
  },

  deleteTicket: function(ticketId) {
    if (confirm("Hapus tiket ini?")) {
      state.deleteItem("household", ticketId, "ticket_id");
      ApiService.postAction("deleteHousehold", { id: ticketId });
      Utils.showToast("Tiket fasilitas berhasil dihapus.", "info");
      App.renderView();
    }
  },

  openAddTicketModal: function(defaultDiv = "Kebersihan") {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Buat Tiket Perawatan / Pengajuan Stok</h3>
            <button onclick="document.getElementById('modal-facilities-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="FacilitiesComponent.saveNewTicket(event)" class="space-y-3 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Divisi</label>
                <select id="tck-div" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Kebersihan" ${defaultDiv === 'Kebersihan' ? 'selected' : ''}>Kebersihan / Sanitasi</option>
                  <option value="Fisik" ${defaultDiv === 'Fisik' ? 'selected' : ''}>Fisik & Listrik / AC</option>
                  <option value="Konsumsi">Konsumsi Kajian</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Area Masjid</label>
                <select id="tck-area" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Lantai 1">Lantai 1 (Ruang Utama)</option>
                  <option value="Lantai 2">Lantai 2 (Balkon & TPQ)</option>
                  <option value="Tempat Wudhu">Tempat Wudhu & Toilet</option>
                  <option value="Halaman / Parkir">Halaman / Parkir & Taman</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Barang / Uraian Pekerjaan</label>
              <input type="text" id="tck-item" required placeholder="Contoh: Karbol Pinus 4 Galon / Servis AC Daikin" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Jumlah / Qty</label>
                <input type="text" id="tck-qty" required placeholder="Contoh: 4 Jerigen / 3 Unit" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Estimasi Biaya (Rp)</label>
                <input type="number" id="tck-cost" value="250000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">PIC Marbot</label>
                <select id="tck-pic" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Marbot Ahmad">Marbot Ahmad</option>
                  <option value="Marbot Bambang">Marbot Bambang</option>
                  <option value="Marbot Rizki">Marbot Rizki</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Status</label>
                <select id="tck-status" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="Pending">Pending</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-facilities-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md">Kirim Pengajuan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-facilities-container").innerHTML = html;
  },

  saveNewTicket: function(e) {
    e.preventDefault();
    const div = document.getElementById("tck-div").value;
    const area = document.getElementById("tck-area").value;
    const item = document.getElementById("tck-item").value;
    const qty = document.getElementById("tck-qty").value;
    const cost = parseFloat(document.getElementById("tck-cost").value) || 0;
    const pic = document.getElementById("tck-pic").value;
    const status = document.getElementById("tck-status").value;

    const newTicket = {
      ticket_id: Utils.generateId("TCK-"),
      division: div,
      area: area,
      item: item,
      qty: qty,
      cost: cost,
      pic_marbot: pic,
      status: status
    };

    state.addItem("household", newTicket, "ticket_id", "TCK-");
    ApiService.postAction("createHousehold", { data: newTicket });

    document.getElementById("modal-facilities-container").innerHTML = "";
    Utils.showToast("Tiket fasilitas berhasil dicatat!", "success");
    App.renderView();
  }
};
