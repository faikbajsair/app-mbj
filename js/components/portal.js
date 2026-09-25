/**
 * ==============================================================================
 * COMPONENT: PUBLIC PORTAL (PORTAL JAMAAH MBJ)
 * Live Financial Transparency, Kajian Schedules, Self-Service CSR & Digital QRIS
 * ==============================================================================
 */

const PortalComponent = {
  render: function() {
    const config = ConfigManager.getAll();
    const fin = state.getFinancialSummary();
    const upcomingAgendas = state.data.ubudiyah.slice(0, 4);

    return `
      <div class="space-y-8 animate-fade-in max-w-6xl mx-auto py-2">
        
        <!-- Public Hero Banner with Islamic Motif -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-emerald-500/20 text-center sm:text-left">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div class="space-y-3 max-w-2xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-bold text-amber-300">
                <i data-lucide="sun" class="w-4 h-4"></i>
                <span>PORTAL RESMI PELAYANAN UMAT</span>
              </div>
              <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${config.mosque_name}</h1>
              <p class="text-emerald-100/90 text-sm sm:text-base leading-relaxed">${config.mosque_tagline}</p>
              <div class="text-xs text-emerald-200/80 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <span class="flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-amber-400"></i> ${config.mosque_address}</span>
                <span>•</span>
                <span class="flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-amber-400"></i> ${config.mosque_phone}</span>
              </div>
            </div>

            <!-- Infaq Shortcut Button -->
            <div class="flex-shrink-0">
              <a href="#digital-infaq-section" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition transform hover:-translate-y-0.5">
                <i data-lucide="qr-code" class="w-5 h-5"></i>
                <span>Infaq & Donasi Digital</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 1. Transparansi Kas Keuangan Riil -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-600"></i>
                <span>Transparansi Laporan Kas Masjid</span>
              </h2>
              <p class="text-xs text-slate-500">Amanah umat dikelola secara terbuka & diaudit secara realtime</p>
            </div>
            <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Terbuka untuk Umum</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Riil Kas Saat Ini</span>
              <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">${Utils.formatRupiah(fin.balance)}</div>
              <div class="text-xs text-emerald-600 font-medium mt-1">Saldo Kas Siap Pakai</div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemasukan Bulan Ini</span>
              <div class="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 mt-2">${Utils.formatRupiah(fin.thisMonthIn)}</div>
              <div class="text-xs text-slate-500 mt-1">Infaq Tromol & Muhsinin</div>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Penyaluran & Operasional</span>
              <div class="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-2">${Utils.formatRupiah(fin.thisMonthOut)}</div>
              <div class="text-xs text-slate-500 mt-1">Fee Dakwah & Pemeliharaan Gedung</div>
            </div>
          </div>
        </div>

        <!-- 2. Jadwal Kajian Sunnah & Khutbah Jumat -->
        <div class="space-y-4">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="calendar" class="w-5 h-5 text-emerald-600"></i>
              <span>Agenda Kajian Ilmiah & Khutbah Jumat</span>
            </h2>
            <p class="text-xs text-slate-500">Terbuka untuk ikhwan dan akhwat, fasilitas lengkap & live streaming YouTube</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${upcomingAgendas.map(item => `
              <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500 transition">
                <div>
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.type === 'Khutbah Jumat' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'}">
                      ${item.type}
                    </span>
                    <span class="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <i data-lucide="map-pin" class="w-3.5 h-3.5"></i>
                      <span>Masjid MBJ</span>
                    </span>
                  </div>

                  <h3 class="font-extrabold text-base text-slate-900 dark:text-white mt-3">${item.title}</h3>
                  <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                    <i data-lucide="user" class="w-4 h-4"></i>
                    <span>${item.ustadz_name}</span>
                  </div>

                  <div class="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                    <i data-lucide="clock" class="w-4 h-4 text-slate-400"></i>
                    <span>${item.date_time}</span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span class="text-slate-500">Fasilitas: Parkir Luas, AC, Konsumsi</span>
                  <a href="https://youtube.com" target="_blank" class="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                    <i data-lucide="youtube" class="w-4 h-4"></i>
                    <span>Live YouTube</span>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. Form Permohonan Layanan Sosial Jamaah (Self-Service) -->
        <div class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
          <div class="max-w-2xl mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold mb-2">
              <i data-lucide="heart" class="w-3.5 h-3.5"></i>
              <span>LAYANAN SOSIAL GRATIS</span>
            </div>
            <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white">Permohonan Ambulans & Layanan Jenazah</h2>
            <p class="text-xs text-slate-500 mt-1">Bagi jamaah yang memerlukan bantuan transportasi darurat medis atau fardhu kifayah jenazah, silakan isi form berikut. Tim siaga MBJ akan langsung merespon.</p>
          </div>

          <form onsubmit="PortalComponent.submitPublicRequest(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Layanan</label>
              <select id="pub-type" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-900 dark:text-white">
                <option value="Ambulance">🚑 Ambulans Pasien Medis (Gratis 24 Jam)</option>
                <option value="Jenazah">🕊️ Layanan Pengurusan & Mobil Jenazah</option>
                <option value="Siber Air">💧 Permohonan Galon Air Siber (Dhuafa)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Pemohon / Penanggung Jawab</label>
              <input type="text" id="pub-name" required placeholder="Nama lengkap..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
              <input type="tel" id="pub-phone" required placeholder="0812xxxxxxxx" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal & Waktu Diperlukan</label>
              <input type="datetime-local" id="pub-date" required class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            </div>

            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Penjemputan / Rumah Sakit Tujuan / Keterangan Kebutuhan</label>
              <textarea id="pub-dest" required rows="3" placeholder="Contoh: Jemput di Jl. Melati No. 5 untuk rujukan ke RSUD Budi Asih..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"></textarea>
            </div>

            <div class="sm:col-span-2 flex justify-end">
              <button type="submit" class="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition">
                Kirim Permohonan ke Tim Siaga MBJ
              </button>
            </div>
          </form>
        </div>

        <!-- 4. Digital Infaq & QRIS Section -->
        <div id="digital-infaq-section" class="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="text-center max-w-xl mx-auto mb-6">
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">ZISWAF & Amal Jariyah</span>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white mt-2">Salurkan Infaq & Sedekah Anda</h2>
            <p class="text-xs text-slate-500 mt-1">Setiap rupiah yang Anda salurkan menjadi jariyah dakwah, santunan yatim dan operasional rumah Allah.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <!-- QRIS Card -->
            <div class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-md">
              <div class="text-xs font-bold uppercase text-slate-700 dark:text-slate-200 mb-2">QRIS Infaq Standar MBJ</div>
              <img src="${config.qris_image_url}" alt="QRIS Infaq" class="w-44 h-44 mx-auto rounded-xl border p-2 object-contain">
              <div class="text-[11px] text-slate-500 mt-3">Mendukung BCA, GoPay, OVO, ShopeePay, DANA, LinkAja & Seluruh Mobile Banking</div>
            </div>

            <!-- Bank Accounts (2 Cards) -->
            <div class="md:col-span-2 space-y-4">
              
              <!-- BSI -->
              <div class="p-5 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs font-bold text-teal-800 dark:text-teal-300">BANK SYARIAH INDONESIA (BSI)</div>
                  <div class="text-lg font-black text-slate-900 dark:text-white tracking-wider mt-1">${config.bank_bsi}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Kode Bank: 451 • Pos Infaq Operasional & Tromol</div>
                </div>
                <button onclick="PortalComponent.copyText('${config.bank_bsi}')" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 text-teal-800 dark:text-teal-300 font-bold text-xs hover:bg-teal-100 transition whitespace-nowrap shadow-sm">
                  Salin Rekening
                </button>
              </div>

              <!-- Bank Muamalat -->
              <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="text-xs font-bold text-purple-800 dark:text-purple-300">BANK MUAMALAT</div>
                  <div class="text-lg font-black text-slate-900 dark:text-white tracking-wider mt-1">${config.bank_muamalat}</div>
                  <div class="text-xs text-slate-500 mt-0.5">Kode Bank: 147 • Pos ZISWAF & Dakwah Sunnah</div>
                </div>
                <button onclick="PortalComponent.copyText('${config.bank_muamalat}')" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-300 text-purple-800 dark:text-purple-300 font-bold text-xs hover:bg-purple-100 transition whitespace-nowrap shadow-sm">
                  Salin Rekening
                </button>
              </div>

              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 text-center">
                Konfirmasi donasi & bukti transfer via WhatsApp: <a href="https://wa.me/${config.mosque_phone.replace(/[^0-9]/g, '')}" target="_blank" class="font-bold text-emerald-600 hover:underline">${config.mosque_phone}</a>
              </div>

            </div>

          </div>
        </div>

      </div>
    `;
  },

  copyText: function(text) {
    navigator.clipboard.writeText(text).then(() => {
      Utils.showToast("Nomor rekening berhasil disalin ke clipboard!", "success");
    });
  },

  submitPublicRequest: function(e) {
    e.preventDefault();
    const type = document.getElementById("pub-type").value;
    const name = document.getElementById("pub-name").value;
    const phone = document.getElementById("pub-phone").value;
    const date = document.getElementById("pub-date").value;
    const dest = document.getElementById("pub-dest").value;

    const newReq = {
      service_id: Utils.generateId("PUB-"),
      service_type: type,
      requester_name: name,
      phone: phone,
      date_reserved: date.slice(0, 10),
      destination_or_detail: dest,
      status: "Menunggu"
    };

    state.addItem("social", newReq, "service_id", "PUB-");
    ApiService.postAction("createSocial", { data: newReq });

    Utils.showToast("Alhamdulillah! Permohonan Anda telah terkirim ke Tim Siaga MBJ.", "success");
    e.target.reset();
  }
};
