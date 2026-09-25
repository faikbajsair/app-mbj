/**
 * ==============================================================================
 * COMPONENT: TPQ (PENDIDIKAN AL-QUR'AN)
 * Santri Database, Monthly SPP Cashier & Automated WhatsApp Parent Receipts
 * ==============================================================================
 */

const TpqComponent = {
  render: function() {
    const students = state.data.tpq_students;
    const payments = state.data.tpq_payments;

    const activeCount = students.filter(s => s.status_active === "Aktif" || s.status_active === true).length;
    const totalCollected = payments.reduce((acc, p) => acc + (parseFloat(p.amount_paid) || 0), 0);

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Top Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl bg-emerald-100 text-emerald-700">
              <i data-lucide="graduation-cap" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Divisi Pendidikan TPQ Mu'adz bin Jabal</h2>
              <p class="text-xs text-slate-500">Database santri, kasir SPP bulanan terintegrasi & kwitansi WhatsApp wali santri</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="TpqComponent.openPayModal()" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="receipt" class="w-4 h-4"></i>
              <span>Bayar SPP Santri</span>
            </button>
            <button onclick="TpqComponent.openAddStudentModal()" class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-md transition">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span>Tambah Santri Baru</span>
            </button>
          </div>
        </div>

        <!-- Metrics Overview Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total Santri Terdaftar</span>
            <div class="text-xl font-extrabold text-slate-900 dark:text-white mt-1">${students.length} Santri (${activeCount} Aktif)</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Total SPP Terkumpul (Buku Kas)</span>
            <div class="text-xl font-extrabold text-emerald-600 mt-1">${Utils.formatRupiah(totalCollected)}</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <span class="text-xs text-slate-500 font-semibold">Iuran SPP Standar</span>
            <div class="text-xl font-extrabold text-teal-600 mt-1">Rp 150.000 / Bulan</div>
          </div>
        </div>

        <!-- 2 Columns Grid: Students List & Payment History -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Students Database Table (6 Cols) -->
          <div class="lg:col-span-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Database Santri TPQ</h3>
                <p class="text-xs text-slate-500">Daftar santri aktif dan kontak wali</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">NIS / Nama Santri</th>
                    <th class="py-3 px-4">Kontak Wali</th>
                    <th class="py-3 px-4">Iuran/Bulan</th>
                    <th class="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  ${students.map(s => `
                    <tr class="hover:bg-slate-50/50 transition">
                      <td class="py-3 px-4">
                        <div class="font-bold text-slate-900 dark:text-white">${s.full_name}</div>
                        <div class="text-[10px] font-mono text-slate-400">${s.student_id}</div>
                      </td>
                      <td class="py-3 px-4 text-slate-600 font-medium">
                        <a href="https://wa.me/${(s.parent_phone || '').replace(/[^0-9]/g, '')}" target="_blank" class="text-emerald-600 hover:underline inline-flex items-center gap-1">
                          <i data-lucide="phone" class="w-3 h-3"></i>
                          <span>${s.parent_phone}</span>
                        </a>
                      </td>
                      <td class="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        ${Utils.formatRupiah(s.monthly_fee)}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="TpqComponent.openPayModalForStudent('${s.student_id}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition">
                          Bayar SPP
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right: Payment Transactions & WA Kwitansi (6 Cols) -->
          <div class="lg:col-span-6 glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm">
            <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">Riwayat Pembayaran SPP</h3>
                <p class="text-xs text-slate-500">Mutasi kas SPP dan kwitansi wali</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th class="py-3 px-4">Santri / Periode</th>
                    <th class="py-3 px-4">Tanggal Bayar</th>
                    <th class="py-3 px-4 text-right">Nominal</th>
                    <th class="py-3 px-4 text-center">Kwitansi WA</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                  ${payments.map(p => {
                    const st = students.find(s => s.student_id === p.student_id);
                    const stName = st ? st.full_name : p.student_id;
                    const phone = st ? st.parent_phone : "";

                    return `
                      <tr class="hover:bg-slate-50/50 transition">
                        <td class="py-3 px-4">
                          <div class="font-bold text-slate-900 dark:text-white">${stName}</div>
                          <div class="text-[11px] text-emerald-600 font-medium">Periode: ${p.period_month_year}</div>
                        </td>
                        <td class="py-3 px-4 text-slate-600">${Utils.formatDateIndo(p.date_paid)}</td>
                        <td class="py-3 px-4 text-right font-extrabold text-emerald-600">${Utils.formatRupiah(p.amount_paid)}</td>
                        <td class="py-3 px-4 text-center">
                          <button onclick="TpqComponent.sendParentKwitansi('${p.payment_id}')" class="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition inline-flex items-center gap-1 text-[11px] font-semibold" title="Kirim Kwitansi ke WhatsApp Orang Tua">
                            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                            <span>Kirim WA</span>
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      <div id="modal-tpq-container"></div>
    `;
  },

  openAddStudentModal: function() {
    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Pendaftaran Santri Baru TPQ</h3>
            <button onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="TpqComponent.saveNewStudent(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nama Lengkap Santri</label>
              <input type="text" id="san-name" required placeholder="Contoh: Muhammad Rayyan" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">No. WhatsApp Orang Tua / Wali</label>
              <input type="tel" id="san-phone" required placeholder="0812xxxxxxxx" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Iuran SPP Bulanan (Rp)</label>
              <input type="number" id="san-fee" value="150000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan Santri</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-tpq-container").innerHTML = html;
  },

  saveNewStudent: function(e) {
    e.preventDefault();
    const name = document.getElementById("san-name").value;
    const phone = document.getElementById("san-phone").value;
    const fee = parseFloat(document.getElementById("san-fee").value) || 150000;

    const newStudent = {
      student_id: Utils.generateId("SAN-"),
      full_name: name,
      parent_phone: phone,
      monthly_fee: fee,
      status_active: "Aktif"
    };

    state.addItem("tpq_students", newStudent, "student_id", "SAN-");
    ApiService.postAction("createTPQStudent", { data: newStudent });

    document.getElementById("modal-tpq-container").innerHTML = "";
    Utils.showToast(`Santri ${name} berhasil didaftarkan!`, "success");
    App.renderView();
  },

  openPayModal: function() {
    this.openPayModalForStudent("");
  },

  openPayModalForStudent: function(selectedStudentId) {
    const students = state.data.tpq_students;
    const currentMonth = "September 2026";

    const html = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Kasir Pembayaran SPP TPQ</h3>
            <button onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
          </div>

          <form onsubmit="TpqComponent.savePayment(event)" class="space-y-3 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Pilih Santri</label>
              <select id="pay-student" required class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                <option value="">-- Pilih Santri --</option>
                ${students.map(s => `
                  <option value="${s.student_id}" ${s.student_id === selectedStudentId ? 'selected' : ''}>
                    ${s.full_name} (${s.student_id}) - ${Utils.formatRupiah(s.monthly_fee)}
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Periode Bulan</label>
                <select id="pay-period" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
                  <option value="September 2026" selected>September 2026</option>
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="Desember 2026">Desember 2026</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Tanggal Bayar</label>
                <input type="date" id="pay-date" value="${new Date().toISOString().slice(0, 10)}" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
              </div>
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Nominal SPP Dibayarkan (Rp)</label>
              <input type="number" id="pay-amount" value="150000" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 font-extrabold text-sm text-emerald-600">
            </div>

            <div>
              <label class="block font-semibold text-slate-600 mb-1">Staf Penerima</label>
              <input type="text" id="pay-staff" value="Usth. Fatimah" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-800">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" onclick="document.getElementById('modal-tpq-container').innerHTML=''" class="px-4 py-2 rounded-xl border text-slate-600 font-semibold">Batal</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md">Simpan & Masuk Kas</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.getElementById("modal-tpq-container").innerHTML = html;
  },

  savePayment: function(e) {
    e.preventDefault();
    const studentId = document.getElementById("pay-student").value;
    const period = document.getElementById("pay-period").value;
    const date = document.getElementById("pay-date").value;
    const amount = parseFloat(document.getElementById("pay-amount").value) || 0;
    const staff = document.getElementById("pay-staff").value;

    if (!studentId) {
      Utils.showToast("Silakan pilih santri terlebih dahulu.", "error");
      return;
    }

    const payRecord = {
      payment_id: Utils.generateId("PAY-"),
      student_id: studentId,
      period_month_year: period,
      amount_paid: amount,
      date_paid: date,
      receiver_staff: staff
    };

    // Record payment (automatically adds to general ledger too)
    state.recordTPQPayment(payRecord);
    ApiService.postAction("recordTPQPayment", { data: payRecord });

    document.getElementById("modal-tpq-container").innerHTML = "";
    Utils.showToast("Pembayaran SPP berhasil dicatat & masuk kas!", "success");
    Utils.playAudio("cash");
    App.renderView();
  },

  sendParentKwitansi: function(paymentId) {
    const pay = state.data.tpq_payments.find(p => p.payment_id === paymentId);
    if (!pay) return;

    const student = state.data.tpq_students.find(s => s.student_id === pay.student_id);
    const config = ConfigManager.getAll();

    const text = `*KWITANSI PEMBAYARAN SPP TPQ*
*${config.mosque_name.toUpperCase()}*
_${config.mosque_tagline}_
----------------------------------------
*No. Kwitansi:* ${pay.payment_id}
*Nama Santri:* ${student ? student.full_name : pay.student_id}
*Periode SPP:* ${pay.period_month_year}
*Tanggal Bayar:* ${Utils.formatDateIndo(pay.date_paid)}
*Penerima:* ${pay.receiver_staff}
----------------------------------------
*JUMLAH LUNAS:* ${Utils.formatRupiah(pay.amount_paid)}
----------------------------------------
_Alhamdulillah, iuran SPP santri telah kami terima. Semoga ananda senantiasa istiqamah belajar Al-Qur'an dan menjadi anak yang shalih/shalihah. Aamiin._

*Status:* LUNAS & SAH TERCATAT`;

    const phone = student ? student.parent_phone : "";
    let cleanPhone = (phone || "").replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
};
