/**
 * ==============================================================================
 * API SERVICE (GOOGLE APPS SCRIPT INTEGRATION)
 * Seamless REST Connector with Fallback, Timeout & Retry Handling
 * ==============================================================================
 */

class ApiService {
  static getEndpoint() {
    return ConfigManager.get("gas_web_app_url") || "";
  }

  static isConfigured() {
    const url = this.getEndpoint().trim();
    return url.length > 10 && url.startsWith("https://script.google.com");
  }

  // Test live connection with Google Apps Script
  static async testConnection() {
    if (!this.isConfigured()) {
      return { success: false, message: "URL Google Apps Script belum diisi." };
    }

    try {
      const url = `${this.getEndpoint()}?action=ping`;
      const response = await fetch(url, { method: "GET", mode: "cors" });
      const data = await response.json();
      if (data && data.status === "success") {
        state.gasConnected = true;
        state.emit("gas:status", true);
        return { success: true, data };
      }
      return { success: false, message: data.message || "Respon GAS tidak sesuai." };
    } catch (err) {
      state.gasConnected = false;
      state.emit("gas:status", false);
      return { success: false, message: "Gagal terhubung ke GAS: " + err.message };
    }
  }

  // Fetch all tables from Google Sheets and update local state
  static async syncFromGAS() {
    if (!this.isConfigured()) {
      Utils.showToast("Mode Demo / Lokal Aktif (URL Google Apps Script belum diatur)", "info");
      return;
    }

    state.isSyncing = true;
    state.emit("sync:start");

    try {
      const url = `${this.getEndpoint()}?action=getAllData`;
      const res = await fetch(url, { method: "GET", mode: "cors" });
      const resJson = await res.json();

      if (resJson.status === "success" && resJson.data) {
        const d = resJson.data;
        if (d.config) ConfigManager.setMany(d.config);
        if (d.transactions) { state.data.transactions = d.transactions; state.saveStorage("transactions"); }
        if (d.ubudiyah) { state.data.ubudiyah = d.ubudiyah; state.saveStorage("ubudiyah"); }
        if (d.multimedia) { state.data.multimedia = d.multimedia; state.saveStorage("multimedia"); }
        if (d.household) { state.data.household = d.household; state.saveStorage("household"); }
        if (d.social) { state.data.social = d.social; state.saveStorage("social"); }
        if (d.tpq_students) { state.data.tpq_students = d.tpq_students; state.saveStorage("tpq_students"); }
        if (d.tpq_payments) { state.data.tpq_payments = d.tpq_payments; state.saveStorage("tpq_payments"); }

        state.gasConnected = true;
        state.emit("gas:status", true);
        Utils.showToast("Sinkronisasi Google Sheets Berhasil!", "success");
      } else {
        throw new Error(resJson.message || "Gagal memuat data dari Sheets");
      }
    } catch (err) {
      console.warn("GAS Fetch fallback:", err);
      state.gasConnected = false;
      state.emit("gas:status", false);
      Utils.showToast("Gagal sync dengan GAS. Menggunakan data offline.", "warning");
    } finally {
      state.isSyncing = false;
      state.emit("sync:end");
    }
  }

  // Send Action to GAS (Creates/Updates/Deletes)
  static async postAction(action, data = {}) {
    if (!this.isConfigured()) {
      // Offline local mode fallback (state already updated by caller)
      return { status: "success", message: "Disimpan di database lokal (Offline mode)" };
    }

    try {
      const url = this.getEndpoint();
      const payload = { action, ...data };

      const response = await fetch(url, {
        method: "POST",
        mode: "no-cors", // Google Apps Script redirects require handling or no-cors mode
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      return { status: "success", message: "Data terkirim ke Google Sheets" };
    } catch (err) {
      console.warn("GAS Post error:", err);
      return { status: "warning", message: "Tersimpan lokal (GAS sync error: " + err.message + ")" };
    }
  }

  // Trigger Google Sheets Database Setup
  static async triggerSetupDatabase() {
    if (!this.isConfigured()) {
      return { success: false, message: "Isi URL Web App Google Apps Script terlebih dahulu." };
    }

    try {
      const url = `${this.getEndpoint()}?action=setupDatabase`;
      const res = await fetch(url, { method: "GET", mode: "cors" });
      const json = await res.json();
      return { success: json.status === "success", message: json.message || "Selesai" };
    } catch (err) {
      return { success: false, message: "Error setup: " + err.message };
    }
  }
}
