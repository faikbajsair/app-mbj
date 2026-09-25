/**
 * ==============================================================================
 * COMPONENT: SOCIAL SERVICES (CSR MBJ)
 * Ambulance 24H Booking, Siber Clean Water Refill Log & Emergency Jenazah Service
 * ==============================================================================
 */

const SocialComponent = {
  render: function() {
    const services = state.data.social;

    const ambulanceList = services.filter(s => s.service_type === "Ambulance");
    const siberList = services.filter(s => s.service_type === "Siber Air");
    const jenazahList = services.filter(s => s.service_type === "Jenazah");

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Top Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-amber-100 text-amber-700">
              <i data-lucide="heart-handshake" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Pelayanan Sosial & CSR MBJ</h2>
              <p class="text-xs text-slate-500">Ambulans gratis 24 jam, stasiun air minum Siber & layanan fardhu kifayah jenazah</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button onclick="SocialComponent.openBookingModal('Ambulance')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="ambulance" class="w-4 h-4"></i>
              <span>Booking Ambulans</span>
            </button>
            <button onclick="SocialComponent.openBookingModal('Siber Air')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="droplet" class="w-4 h-4"></i>
              <span>Log Siber Air</span>
            </button>
            <button onclick="SocialComponent.openBookingModal('Jenazah')" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="shield-plus" class="w-4 h-4"></i>
              <span>Layanan Jenazah</span>
            </button>
          </div>
        </div>

        <!-- 3 Feature Highlight Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <!-- 1. Ambulance Status Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-rose-100 text-rose-600"><i data-lucide="ambulance" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Ambulans MBJ</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">READY 24 JAM</span>
            </div>
            <p class="text-xs text-slate-500">Layanan antar-jemput pasien gawat darurat & dhuafa secara gratis se-Jabodetabek.</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Supir On-Call:</span> <span>Pak Joko (0812-7788-9900)</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>Total Reservasi:</span> <span>${ambulanceList.length} Rute</span></div>
            </div>
          </div>

          <!-- 2. Siber Water Station Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-sky-100 text-sky-600"><i data-lucide="droplets" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Siber Air Minum</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">TDS: 12 PPM (SANGAT BAIK)</span>
            </div>
            <p class="text-xs text-slate-500">Penyediaan air minum higienis gratis dengan sistem filtrasi Reverse Osmosis (RO).</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Distribusi Rata-rata:</span> <span>180 Galon/Hari</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>Status Filter:</span> <span class="text-emerald-600">Baru Diganti</span></div>
            </div>
          </div>

          <!-- 3. Jenazah Emergency Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="p-2 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><i data-lucide="crosshair" class="w-5 h-5"></i></span>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Layanan Jenazah</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">FARDHU KIFAYAH</span>
            </div>
            <p class="text-xs text-slate-500">Perlengkapan kain kafan lengkap, tim pemandian jenazah sunnah & armada pengantaran kubur.</p>
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
              <div class="flex justify-between font-semibold"><span>Stok Kain Kafan:</span> <span>8 Set Lengkap</span></div>
              <div class="flex justify-between font-semibold mt-1"><span>PIC Fardhu Kifayah:</span> <span>Ust. Hamdan</span></div>
            </div>
          </div>

        </div>

        <!-- Combined Social Services Log Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Buku Log Layanan Sosial Umat</h3>
              <p class="text-xs text-slate-500">Daftar permohonan reservasi ambulans, maintenance siber & layanan jenazah</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th class="py-3 px-4">No. Registrasi</th>
                  <th class="py-3 px-4">Layanan</th>
                  <th class="py-3 px-4">Pemohon / Kontak</th>
                  <th class="py-3 px-4">Tanggal Permohonan</th>
                  <th class="py-3 px-4">Tujuan / Detail Kebutuhan</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${services.map(item => `
                  <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">${item.service_id}</td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.service_type === 'Ambulance' ? 'bg-rose-100 text-rose-800' : (item.service_type === 'Siber Air' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800')
                      }">
                        ${item.service_type}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="font-bold text-slate-900 dark:text-white">${item.requester_name}</div>
                      <div class="text-[11px] text-slate-500">${item.phone || '-'}</div>
                    </td>
                    <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${Utils.formatDateIndo(item.date_reserved)}</td>
                    <td class="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium max-w-xs">${item.destination_or_detail}</td>
                    <td class="py-3 px-4">
                      <select onchange="SocialComponent.changeStatus('${item.service_id}', this.value)" class="text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                        item.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : (item.status === 'Terkonfirmasi' ? 'bg-sky-50 text-sky-700 border-sky-300' : 'bg-amber-50 text-amber-700 border-amber-300')
                      }">
                        <option value="Menunggu" ${item.status === 'Menunggu' ? 'selected' : ''}>Menunggu</option>
                        <option value="Terkonfirmasi" ${item.status === 'Terkonfirmasi' ? 'selected' : ''}>Terkonfirmasi</option>
                        <option value="Berjalan" ${item.status === 'Berjalan' ? 'selected' : ''}>Berjalan</option>
                        <option value="Selesai" ${item.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                      </select>
                    </td>
                    <td class="py-3 px-4 text-center">
                      <div class="flex items-center justify-center gap-1">
                        ${item.phone && item.phone !== '-' ? `
                          <a href="https://wa.me/${item.phone.replace(/[^0-9]/g, '')}" target="_blank" class="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50" title="Hubungi Pemohon via WA">
                            <i data-lucide="message-circle" class="w-4 h-4"></i>
                          </a>
                        ` : ''}
                        <button onclick="SocialComponent.deleteService('${item.service_id}')" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition">
                          <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div id="modal-social-container"></div>
    `;
  },

  changeStatus: function(serviceId, newStatus) {
    state.updateItem("social", serviceId, { status: newStatus }, "service_id");
    ApiService.postAction("updateSocial", { id: serviceId, data: { status: newStatus } });
    Utils.showToast("Status permohonan sosial diperbarui.", "success");
    App.renderView();
  },

  deleteService: function(serviceId) {
    if (confirm("Hapus catatan layanan ini?")) {
      state.deleteItem("social", serviceId, "service_id");
      ApiService.postAction("deleteSocial", { id: serviceId });
      Utils.showToast("Catatan layanan dihapus.", "info");
      App.renderView();
    }
  },

  openBookingModal: function(defaultType = "Ambulance") {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Form Input Layanan Sosial CSR</h3>
            <button onclick="document.getElementById('modal-social-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="SocialComponent.saveService(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Jenis Layanan</label>
              <select id="soc-type" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                <option value="Ambulance" ${defaultType === 'Ambulance' ? 'selected' : ''}>Ambulans Medis 24 Jam</option>
                <option value="Siber Air" ${defaultType === 'Siber Air' ? 'selected' : ''}>Siber (Air Minum RO)</option>
                <option value="Jenazah" ${defaultType === 'Jenazah' ? 'selected' : ''}>Layanan Jenazah & Fardhu Kifayah</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Pemohon / Penanggung Jawab</label>
              <input type="text" id="soc-name" required placeholder="Nama lengkap..." class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">No. WhatsApp / HP</label>
                <input type="tel" id="soc-phone" placeholder="0812xxxxxxxx" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Tanggal Diperlukan</label>
                <input type="date" id="soc-date" value="${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Tujuan / Rincian Kebutuhan</label>
              <textarea id="soc-dest" required rows="3" placeholder="Contoh: Antar pasien ke RSUD Pasar Rebo / Penggantian Filter Sediment Siber" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800"></textarea>
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-social-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md">Simpan Permohonan</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-social-container").innerHTML = html;
  },

  saveService: function(e) {
    e.preventDefault();
    const type = document.getElementById("soc-type").value;
    const name = document.getElementById("soc-name").value;
    const phone = document.getElementById("soc-phone").value;
    const date = document.getElementById("soc-date").value;
    const dest = document.getElementById("soc-dest").value;

    const newSoc = {
      service_id: Utils.generateId("SOC-"),
      service_type: type,
      requester_name: name,
      phone: phone,
      date_reserved: date,
      destination_or_detail: dest,
      status: "Terkonfirmasi"
    };

    state.addItem("social", newSoc, "service_id", "SOC-");
    ApiService.postAction("createSocial", { data: newSoc });

    document.getElementById("modal-social-container").innerHTML = "";
    Utils.showToast("Permohonan layanan sosial berhasil disimpan!", "success");
    App.renderView();
  }
};
