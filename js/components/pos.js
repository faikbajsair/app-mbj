/**
 * ==============================================================================
 * COMPONENT: SMART POS & FINANCIAL CASHIER
 * Mobile-First Cashier POS with Quick Buttons, Thermal Print & WhatsApp Receipt
 * ==============================================================================
 */

const PosComponent = {
  // Current POS Form State
  formState: {
    type: "IN", // "IN" or "OUT"
    category: "Tromol Masjid",
    sub_category: "Kotak Infaq Jumat",
    amount: 0,
    pj_name: "",
    payer_name: "",
    payer_phone: "",
    notes: "",
    date: new Date().toISOString().slice(0, 10)
  },

  categories: {
    IN: [
      {
        name: "Tromol Masjid",
        icon: "box",
        subs: ["Kotak Infaq Jumat", "Kotak Infaq Subuh", "Kotak Infaq Harian", "Tromol Wanita", "Tromol Parkir"]
      },
      {
        name: "Muhsinin / Donatur",
        icon: "user-check",
        subs: ["Infaq Operasional", "Infaq Dakwah", "Donatur Tetap Bulanan", "Hamba Allah", "Sedekah Beras"]
      },
      {
        name: "CSR & Program Sosial",
        icon: "heart-handshake",
        subs: ["Ambulance", "Siber (Air Minum)", "Layanan Jenazah", "Ubudiyah & Dakwah", "Santunan Yatim"]
      },
      {
        name: "Penerimaan TPQ",
        icon: "graduation-cap",
        subs: ["SPP Santri Bulanan", "Infaq Pendaftaran Santri", "Seragam & Kitab TPQ", "Donasi Pengembangan TPQ"]
      },
      {
        name: "ZISWAF & Infrastruktur",
        icon: "building-2",
        subs: ["Zakat Maal", "Zakat Fitrah", "Fidyah", "Wakaf Pembangunan", "Dana Talangan"]
      }
    ],
    OUT: [
      {
        name: "Fee Ustadz & Khotib",
        icon: "mic",
        subs: ["Khotbah Jumat", "Kajian Rutin Malam Ahad", "Kajian Tematik", "Kajian Muslimah", "Imam Tarawih / Rawatib"],
        presets: [600000, 900000, 1000000, 1200000, 3000000]
      },
      {
        name: "Operasional & Logistik Marbot",
        icon: "sparkles",
        subs: ["Karbol & Pembersih Lt 1", "Karbol & Pembersih Lt 2", "Plastik Sampah Jumbo", "Peralatan Sanitasi", "Honor Marbot"]
      },
      {
        name: "Maintenance Gedung",
        icon: "wrench",
        subs: ["Servis AC Daikin", "Penggantian Stok Lampu", "Pompa Air Wudhu", "Perbaikan Sound System", "Perawatan Genset"]
      },
      {
        name: "Konsumsi & Jamuan",
        icon: "coffee",
        subs: ["Snack & Jamuan Ustadz", "Makan Malam Kajian", "Kopi & Teh Jamaah", "Buka Puasa Sunnah", "Rapat DKM"]
      },
      {
        name: "Biaya Armada & Siber",
        icon: "truck",
        subs: ["BBM & Servis Ambulans", "Penggantian Filter Siber", "TDS Kalibrasi & Sanitasi", "Perawatan Mobil Jenazah"]
      }
    ]
  },

  render: function() {
    const isIncome = this.formState.type === "IN";
    const activeCategories = isIncome ? this.categories.IN : this.categories.OUT;
    const currentCatObj = activeCategories.find(c => c.name === this.formState.category) || activeCategories[0];
    const quickAmounts = isIncome 
      ? [20000, 50000, 100000, 200000, 500000, 1000000, 2500000, 5000000]
      : (currentCatObj.presets || [50000, 100000, 200000, 450000, 600000, 900000, 1000000, 1200000, 3000000]);

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- POS Top Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-xl ${isIncome ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
              <i data-lucide="calculator" class="w-6 h-6"></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Smart POS & Kasir Keuangan</h2>
              <p class="text-xs text-slate-500">Pencatatan kasir instan, struk thermal & kwitansi WhatsApp</p>
            </div>
          </div>

          <!-- Mode Switcher (IN vs OUT) -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onclick="PosComponent.setType('IN')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${isIncome ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="arrow-down-left" class="w-4 h-4"></i>
              <span>Pemasukan (IN)</span>
            </button>
            <button onclick="PosComponent.setType('OUT')" class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${!isIncome ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}">
              <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
              <span>Pengeluaran (OUT)</span>
            </button>
          </div>
        </div>

        <!-- POS Interactive Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left Column: Category Selection & Quick Inputs (8 Cols) -->
          <div class="lg:col-span-7 space-y-5">
            
            <!-- Category Tabs -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Pilih Kategori ${isIncome ? 'Pemasukan' : 'Pengeluaran'}
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${activeCategories.map(cat => {
                  const isSelected = this.formState.category === cat.name;
                  return `
                    <button onclick="PosComponent.setCategory('${cat.name}')" class="p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                      isSelected 
                        ? (isIncome ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900' : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-900')
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                    }">
                      <i data-lucide="${cat.icon}" class="w-5 h-5 ${isSelected ? (isIncome ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-400'}"></i>
                      <span class="text-xs font-bold leading-tight">${cat.name}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Sub-Category Chips -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Sub-Pos Alokasi: <span class="text-slate-900 dark:text-white font-extrabold">${this.formState.category}</span>
              </label>
              <div class="flex flex-wrap gap-2">
                ${currentCatObj.subs.map(sub => {
                  const isSelected = this.formState.sub_category === sub;
                  return `
                    <button onclick="PosComponent.setSubCategory('${sub}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      isSelected
                        ? (isIncome ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600')
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }">
                      ${sub}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Quick Amount Presets -->
            <div class="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Nominal Cepat (Preset Kasir)
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                ${quickAmounts.map(amt => `
                  <button onclick="PosComponent.setAmount(${amt})" class="py-2.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-emerald-50 hover:border-emerald-400 text-slate-800 dark:text-slate-200 font-bold text-xs transition active:scale-95 shadow-sm">
                    ${Utils.formatRupiah(amt)}
                  </button>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Right Column: Bill Slip, Amount Input & Action Buttons (5 Cols) -->
          <div class="lg:col-span-5 space-y-5">
            
            <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
              
              <!-- Slip Header -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span class="text-xs font-bold uppercase text-slate-500">Ringkasan Bukti Kas</span>
                <span class="text-xs font-mono font-bold text-slate-400">${new Date().toISOString().slice(0, 10)}</span>
              </div>

              <!-- Main Amount Big Input -->
              <div class="my-4">
                <label class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Nominal Transaksi (Rp)</label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-base">Rp</span>
                  <input type="number" id="pos-input-amount" value="${this.formState.amount || ''}" placeholder="0" oninput="PosComponent.onAmountChange(this.value)" class="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition">
                </div>
              </div>

              <!-- Payer/Receiver Details -->
              <div class="space-y-3 text-xs">
                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    ${isIncome ? 'Nama Muhsinin / Donatur (Opsional)' : 'Penerima / Nama Ustadz / Vendor'}
                  </label>
                  <input type="text" id="pos-input-payer" value="${this.formState.payer_name}" placeholder="${isIncome ? 'Hamba Allah' : 'Ust. Fulan / Toko Listrik'}" oninput="PosComponent.formState.payer_name = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                ${isIncome ? `
                  <div>
                    <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">No. WhatsApp Donatur (Untuk Kirim Kwitansi)</label>
                    <input type="tel" id="pos-input-phone" value="${this.formState.payer_phone}" placeholder="0812xxxxxxxx" oninput="PosComponent.formState.payer_phone = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  </div>
                ` : ''}

                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Keterangan / Catatan Tambahan</label>
                  <input type="text" id="pos-input-notes" value="${this.formState.notes}" placeholder="Catatan transaksi..." oninput="PosComponent.formState.notes = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>

                <div>
                  <label class="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Penanggung Jawab / Petugas Kasir</label>
                  <input type="text" id="pos-input-pj" value="${this.formState.pj_name || state.currentUser.username}" placeholder="Nama Petugas" oninput="PosComponent.formState.pj_name = this.value" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="mt-6 space-y-2">
                <button onclick="PosComponent.submitTransaction(true)" class="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white transition flex items-center justify-center gap-2 shadow-lg ${
                  isIncome ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                }">
                  <i data-lucide="printer" class="w-4 h-4"></i>
                  <span>Simpan & Cetak Struk Thermal</span>
                </button>

                <div class="grid grid-cols-2 gap-2">
                  <button onclick="PosComponent.submitTransaction(false)" class="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5">
                    <i data-lucide="save" class="w-4 h-4"></i>
                    <span>Simpan Saja</span>
                  </button>

                  <button onclick="PosComponent.sendDirectWhatsApp()" class="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition flex items-center justify-center gap-1.5">
                    <i data-lucide="message-square" class="w-4 h-4 text-emerald-600"></i>
                    <span>Share WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    `;
  },

  setType: function(type) {
    this.formState.type = type;
    const catList = type === "IN" ? this.categories.IN : this.categories.OUT;
    this.formState.category = catList[0].name;
    this.formState.sub_category = catList[0].subs[0];
    App.renderView();
  },

  setCategory: function(catName) {
    this.formState.category = catName;
    const catList = this.formState.type === "IN" ? this.categories.IN : this.categories.OUT;
    const catObj = catList.find(c => c.name === catName);
    if (catObj && catObj.subs.length > 0) {
      this.formState.sub_category = catObj.subs[0];
    }
    App.renderView();
  },

  setSubCategory: function(subName) {
    this.formState.sub_category = subName;
    App.renderView();
  },

  setAmount: function(amount) {
    this.formState.amount = amount;
    const inputEl = document.getElementById("pos-input-amount");
    if (inputEl) inputEl.value = amount;
    Utils.playAudio("cash");
  },

  onAmountChange: function(val) {
    this.formState.amount = parseFloat(val) || 0;
  },

  submitTransaction: async function(shouldPrintThermal = false) {
    const amount = parseFloat(this.formState.amount) || 0;
    if (amount <= 0) {
      Utils.showToast("Nominal transaksi harus lebih besar dari Rp 0!", "error");
      return;
    }

    const payer = this.formState.payer_name || (this.formState.type === "IN" ? "Hamba Allah" : "Operasional");
    const notes = this.formState.notes || `${this.formState.sub_category} (${payer})`;
    const pj = this.formState.pj_name || state.currentUser.username;

    const newTrx = {
      trx_id: Utils.generateId(this.formState.type === "IN" ? "TRX-IN-" : "TRX-OUT-"),
      date: this.formState.date,
      type: this.formState.type,
      category: this.formState.category,
      sub_category: this.formState.sub_category,
      amount: amount,
      notes: notes,
      pj_name: pj,
      proof_url: "",
      created_at: new Date().toISOString()
    };

    // Save to local reactive store
    state.addTransaction(newTrx);

    // Sync to GAS in background if connected
    ApiService.postAction("createTransaction", { data: newTrx });

    Utils.playAudio("cash");
    Utils.showToast(`Transaksi ${Utils.formatRupiah(amount)} berhasil disimpan!`, "success");

    if (shouldPrintThermal) {
      App.openThermalReceiptModal(newTrx.trx_id);
    }

    // Reset Form
    this.formState.amount = 0;
    this.formState.notes = "";
    this.formState.payer_name = "";
    this.formState.payer_phone = "";
    App.renderView();
  },

  sendDirectWhatsApp: function() {
    const amount = parseFloat(this.formState.amount) || 0;
    if (amount <= 0) {
      Utils.showToast("Masukkan nominal terlebih dahulu sebelum share WhatsApp.", "warning");
      return;
    }

    const payer = this.formState.payer_name || "Hamba Allah";
    const receiptData = {
      trx_id: Utils.generateId("TRX-PREVIEW-"),
      date: this.formState.date,
      type: this.formState.type,
      category: this.formState.category,
      sub_category: this.formState.sub_category,
      amount: amount,
      notes: this.formState.notes || `Infaq / Transaksi (${payer})`,
      pj_name: this.formState.pj_name || state.currentUser.username
    };

    Utils.openWhatsAppReceipt(this.formState.payer_phone, receiptData);
  }
};
