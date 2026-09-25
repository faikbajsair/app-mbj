/**
 * ==============================================================================
 * STATE MANAGEMENT & LOCAL DATA STORE
 * Reactive Store with Seed Data, Event Emitter & LocalStorage Persistence
 * ==============================================================================
 */

// Initial Mock Seed Data
const INITIAL_SEEDS = {
  transactions: [
    { trx_id: "TRX-260925-101", date: "2026-09-25", type: "IN", category: "Tromol Masjid", sub_category: "Kotak Infaq Shalat Subuh", amount: 1450000, notes: "Perolehan Tromol Subuh Berkah", pj_name: "Marbot Ahmad", proof_url: "", created_at: "2026-09-25T05:30:00Z" },
    { trx_id: "TRX-260924-102", date: "2026-09-24", type: "IN", category: "Muhsinin / Donatur", sub_category: "Infaq Operasional", amount: 5000000, notes: "Hamba Allah - Donasi Operasional Listrik & Kebersihan", pj_name: "Bendahara", proof_url: "", created_at: "2026-09-24T14:15:00Z" },
    { trx_id: "TRX-260924-103", date: "2026-09-24", type: "OUT", category: "Fee Ustadz & Khotib", sub_category: "Kajian Rutin Malam Ahad", amount: 1200000, notes: "Fee Pemateri Kajian Kitab Tauhid Ust. Abdullah Roy", pj_name: "Divisi Ubudiyah", proof_url: "", created_at: "2026-09-24T20:00:00Z" },
    { trx_id: "TRX-260923-104", date: "2026-09-23", type: "OUT", category: "Operasional & Logistik Marbot", sub_category: "Karbol & Pembersih Lt 1-2", amount: 350000, notes: "Restok Karbol Pinus 4 Galon + Sabun Cuci", pj_name: "Marbot Bambang", proof_url: "", created_at: "2026-09-23T09:00:00Z" },
    { trx_id: "TRX-260922-105", date: "2026-09-22", type: "IN", category: "CSR & Program Sosial", sub_category: "Ambulance", amount: 750000, notes: "Infaq Operasional Bahan Bakar Ambulans", pj_name: "Admin Sosial", proof_url: "", created_at: "2026-09-22T11:20:00Z" },
    { trx_id: "TRX-260921-106", date: "2026-09-21", type: "OUT", category: "Maintenance Gedung", sub_category: "Servis AC", amount: 450000, notes: "Cuci & Tambah Freon AC Ruang Utama Lt 1 (3 Unit)", pj_name: "Marbot Rizki", proof_url: "", created_at: "2026-09-21T16:45:00Z" },
    { trx_id: "TRX-260920-107", date: "2026-09-20", type: "IN", category: "Tromol Masjid", sub_category: "Kotak Infaq Shalat Jumat", amount: 8750000, notes: "Penghitungan Kotak Infaq Jumat Pekan 3", pj_name: "Bendahara", proof_url: "", created_at: "2026-09-20T13:00:00Z" }
  ],
  ubudiyah: [
    { agenda_id: "UBD-001", type: "Kajian Rutin", title: "Kitab Tauhid - Bab Hakikat Ibadah", ustadz_name: "Ust. Abdullah Roy, M.A.", date_time: "Setiap Ahad Ba'da Maghrib", fee_budget: 1200000, fee_realization: 1200000, status: "Terjadwal" },
    { agenda_id: "UBD-002", type: "Khutbah Jumat", title: "Menjaga Keikhlasan dalam Beramal Shalih", ustadz_name: "Ust. Dr. Muhammad Arifin Badri", date_time: "Jumat, 11.45 WIB", fee_budget: 1000000, fee_realization: 1000000, status: "Terjadwal" },
    { agenda_id: "UBD-003", type: "Kajian Tematik", title: "Fiqih Muamalah & Riba Kontemporer", ustadz_name: "Ust. Erwandi Tarmizi, Ph.D.", date_time: "Sabtu Pekan 2 Ba'da Ashar", fee_budget: 3000000, fee_realization: 0, status: "Disiapkan" },
    { agenda_id: "UBD-004", type: "Kajian Muslimah", title: "Fiqih Thaharah & Shalat Wanita", ustadz_name: "Usth. Ummu Ihsan Choiriyah", date_time: "Selasa Pagi, 09.00 WIB", fee_budget: 900000, fee_realization: 900000, status: "Terjadwal" }
  ],
  multimedia: [
    { asset_id: "AST-001", item_name: "Sony Alpha A7 IV (Kamera Utama)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Media Rizki", last_maintenance: "2026-09-01" },
    { asset_id: "AST-002", item_name: "Wireless Mic Shure BLX288/PG58 (2 Mic)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Audio Fajar", last_maintenance: "2026-09-10" },
    { asset_id: "AST-003", item_name: "Video Switcher Blackmagic ATEM Mini Pro", status: "Dipakai", rental_cost: 0, pic_name: "Operator Media", last_maintenance: "2026-08-20" },
    { asset_id: "AST-004", item_name: "Soundcraft Signature 16-Ch Audio Mixer", status: "Tersedia", rental_cost: 0, pic_name: "Tim Audio Fajar", last_maintenance: "2026-09-15" },
    { asset_id: "AST-005", item_name: "Lighting Godox SL-60W LED Video Light (2 Unit)", status: "Tersedia", rental_cost: 0, pic_name: "Tim Media Rizki", last_maintenance: "2026-09-05" }
  ],
  household: [
    { ticket_id: "TCK-001", division: "Kebersihan", area: "Lantai 1", item: "Karbol Pinus & Sabun Cuci Tangan", qty: "4 Jerigen", cost: 280000, pic_marbot: "Marbot Ahmad", status: "Selesai" },
    { ticket_id: "TCK-002", division: "Fisik", area: "Lantai 2", item: "Ganti Lampu LED Philips 18W", qty: "6 Pcs", cost: 210000, pic_marbot: "Marbot Bambang", status: "Selesai" },
    { ticket_id: "TCK-003", division: "Fisik", area: "Lantai 1", item: "Servis Rutin AC Daikin 2 PK Ruang Utama", qty: "3 Unit", cost: 450000, pic_marbot: "Marbot Rizki", status: "Pending" },
    { ticket_id: "TCK-004", division: "Kebersihan", area: "Lantai 2", item: "Pembersih Karpet & Pengharum Ruangan", qty: "2 Botol", cost: 140000, pic_marbot: "Marbot Bambang", status: "Dalam Proses" }
  ],
  social: [
    { service_id: "SOC-001", service_type: "Ambulance", requester_name: "Bpk. Suhardi", phone: "0813-8899-7766", date_reserved: "2026-09-26", destination_or_detail: "Antar Pasien Rujukan ke RSUD Pasar Rebo", status: "Terkonfirmasi" },
    { service_id: "SOC-002", service_type: "Siber Air", requester_name: "Pos Siber Depan Masjid", phone: "-", date_reserved: "2026-09-24", destination_or_detail: "Ganti Filter Karbon Aktif & Sedimen 0.1 Micron (TDS: 12 ppm, 150 Galon terisi)", status: "Selesai" },
    { service_id: "SOC-003", service_type: "Jenazah", requester_name: "Keluarga Alm. Bpk. Hamdan", phone: "0812-9988-1122", date_reserved: "2026-09-22", destination_or_detail: "Pemandian Jenazah & Pengantaran TPU Pondok Kelapa", status: "Selesai" }
  ],
  tpq_students: [
    { student_id: "SAN-001", full_name: "Muhammad Fatih Al-Ayyubi", parent_phone: "081299887766", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-002", full_name: "Aisyah Nurul Jannah", parent_phone: "081311223344", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-003", full_name: "Ibrahim Al-Ghazi", parent_phone: "081544556677", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-004", full_name: "Maryam Khairunnisa", parent_phone: "081877665544", monthly_fee: 150000, status_active: "Aktif" },
    { student_id: "SAN-005", full_name: "Zaid bin Haritsah", parent_phone: "081233445566", monthly_fee: 150000, status_active: "Aktif" }
  ],
  tpq_payments: [
    { payment_id: "PAY-001", student_id: "SAN-001", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-05", receiver_staff: "Usth. Fatimah" },
    { payment_id: "PAY-002", student_id: "SAN-002", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-06", receiver_staff: "Usth. Fatimah" },
    { payment_id: "PAY-003", student_id: "SAN-003", period_month_year: "September 2026", amount_paid: 150000, date_paid: "2026-09-10", receiver_staff: "Usth. Fatimah" }
  ]
};

class StateStore {
  constructor() {
    this.listeners = {};
    this.currentUser = JSON.parse(localStorage.getItem("mbj_auth_user") || 'null') || {
      user_id: "USR-001",
      username: "admin",
      role: "SuperAdmin",
      token: "demo-token"
    };

    this.activeRoute = window.location.hash ? window.location.hash.replace("#", "") : "dashboard";
    this.gasConnected = false;
    this.isSyncing = false;

    // Load persisted state or initialize with seed data
    this.data = {
      transactions: this.loadStorage("transactions", INITIAL_SEEDS.transactions),
      ubudiyah: this.loadStorage("ubudiyah", INITIAL_SEEDS.ubudiyah),
      multimedia: this.loadStorage("multimedia", INITIAL_SEEDS.multimedia),
      household: this.loadStorage("household", INITIAL_SEEDS.household),
      social: this.loadStorage("social", INITIAL_SEEDS.social),
      tpq_students: this.loadStorage("tpq_students", INITIAL_SEEDS.tpq_students),
      tpq_payments: this.loadStorage("tpq_payments", INITIAL_SEEDS.tpq_payments)
    };
  }

  loadStorage(key, fallback) {
    const raw = localStorage.getItem(`mbj_${key}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {}
    }
    return fallback;
  }

  saveStorage(key) {
    localStorage.setItem(`mbj_${key}`, JSON.stringify(this.data[key]));
    this.emit(`change:${key}`, this.data[key]);
    this.emit('state:updated', { key, data: this.data[key] });
  }

  // Pub/Sub Event System
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try { cb(payload); } catch (err) { console.error("Event listener error:", err); }
      });
    }
  }

  // Role & Auth Management
  setRole(role) {
    if (!this.currentUser) {
      this.currentUser = { user_id: "USR-DEV", username: role.toLowerCase(), role: role };
    } else {
      this.currentUser.role = role;
    }
    localStorage.setItem("mbj_auth_user", JSON.stringify(this.currentUser));
    this.emit("auth:change", this.currentUser);
    Utils.showToast(`Mode pengguna berganti ke role: ${role}`, "info");

    if (role === "Public" && window.location.hash !== "#portal") {
      window.location.hash = "#portal";
    } else if (role !== "Public" && (window.location.hash === "#portal" || !window.location.hash)) {
      window.location.hash = "#dashboard";
    }
  }

  login(userObj) {
    this.currentUser = userObj;
    localStorage.setItem("mbj_auth_user", JSON.stringify(userObj));
    this.emit("auth:change", this.currentUser);
  }

  logout() {
    this.currentUser = { user_id: "PUBLIC", username: "tamu", role: "Public" };
    localStorage.removeItem("mbj_auth_user");
    this.emit("auth:change", this.currentUser);
    window.location.hash = "#portal";
  }

  // Transactions CRUD
  addTransaction(trx) {
    if (!trx.trx_id) trx.trx_id = Utils.generateId("TRX-");
    if (!trx.created_at) trx.created_at = new Date().toISOString();
    this.data.transactions.unshift(trx);
    this.saveStorage("transactions");
    return trx;
  }

  deleteTransaction(trxId) {
    this.data.transactions = this.data.transactions.filter(t => t.trx_id !== trxId);
    this.saveStorage("transactions");
  }

  // Generic Item Add/Update/Delete
  addItem(entity, item, idKey, prefix) {
    if (!item[idKey]) item[idKey] = Utils.generateId(prefix);
    this.data[entity].unshift(item);
    this.saveStorage(entity);
    return item;
  }

  updateItem(entity, id, updates, idKey) {
    const idx = this.data[entity].findIndex(it => it[idKey] === id);
    if (idx !== -1) {
      this.data[entity][idx] = { ...this.data[entity][idx], ...updates };
      this.saveStorage(entity);
      return true;
    }
    return false;
  }

  deleteItem(entity, id, idKey) {
    this.data[entity] = this.data[entity].filter(it => it[idKey] !== id);
    this.saveStorage(entity);
  }

  // TPQ Payment recording (automatically creates an income transaction)
  recordTPQPayment(payment) {
    if (!payment.payment_id) payment.payment_id = Utils.generateId("PAY-");
    this.data.tpq_payments.unshift(payment);
    this.saveStorage("tpq_payments");

    const student = this.data.tpq_students.find(s => s.student_id === payment.student_id);
    const studentName = student ? student.full_name : payment.student_id;

    // Automatic Inflow Ledger Entry
    this.addTransaction({
      trx_id: Utils.generateId("TRX-TPQ-"),
      date: payment.date_paid,
      type: "IN",
      category: "Penerimaan TPQ",
      sub_category: `SPP Bulanan (${payment.period_month_year})`,
      amount: parseFloat(payment.amount_paid) || 0,
      notes: `SPP Santri: ${studentName} [${payment.student_id}]`,
      pj_name: payment.receiver_staff || "Admin TPQ",
      proof_url: ""
    });

    return payment;
  }

  // Metrics and Aggregations
  getFinancialSummary() {
    let totalIn = 0;
    let totalOut = 0;
    let thisMonthIn = 0;
    let thisMonthOut = 0;

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    this.data.transactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      const dateStr = (t.date || "").toString();
      const isThisMonth = dateStr.startsWith(currentYearMonth);

      if (t.type === "IN") {
        totalIn += amt;
        if (isThisMonth) thisMonthIn += amt;
      } else if (t.type === "OUT") {
        totalOut += amt;
        if (isThisMonth) thisMonthOut += amt;
      }
    });

    return {
      balance: totalIn - totalOut,
      totalIn,
      totalOut,
      thisMonthIn,
      thisMonthOut,
      thisMonthNet: thisMonthIn - thisMonthOut
    };
  }

  // Reset database back to seed data
  resetToFactoryDefaults() {
    Object.keys(INITIAL_SEEDS).forEach(key => {
      this.data[key] = JSON.parse(JSON.stringify(INITIAL_SEEDS[key]));
      this.saveStorage(key);
    });
    localStorage.removeItem("mbj_config");
    ConfigManager.applyTheme();
    Utils.showToast("Data berhasil direset ke pengaturan awal.", "info");
  }
}

// Instantiate global singleton
const state = new StateStore();
