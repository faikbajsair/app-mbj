/**
 * ==============================================================================
 * UTILITY HELPERS
 * Currency, Dates, Sound Generator, Thermal Printing, WhatsApp & Export
 * ==============================================================================
 */

const Utils = {
  // Format Number to Indonesian Rupiah
  formatRupiah: function(amount, withPrefix = true) {
    const num = parseFloat(amount) || 0;
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
    return withPrefix ? `Rp ${formatted}` : formatted;
  },

  // Parse Indonesian Date
  formatDateIndo: function(dateInput, includeTime = false) {
    if (!dateInput) return "-";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return dateInput;

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };

      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }

      return new Intl.DateTimeFormat('id-ID', options).format(date);
    } catch (e) {
      return dateInput;
    }
  },

  // Approximate Hijri Date Calculator
  getHijriDate: function(date = new Date()) {
    try {
      const hijriFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return hijriFormatter.format(date) + " H";
    } catch (e) {
      return "1448 H";
    }
  },

  // Generate Unique Identifiers
  generateId: function(prefix = "TRX-") {
    const now = new Date();
    const datePart = now.getFullYear().toString().substr(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + "-" +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(100 + Math.random() * 900);
    return `${prefix}${datePart}-${random}`;
  },

  // Web Audio API Beep Generator (No external audio file needed)
  playAudio: function(type = "success") {
    if (ConfigManager.get("sound_enabled") === "false") return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "cash") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.07); // E6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "error") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  },

  // Toast Notification
  showToast: function(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const icons = {
      success: `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`,
      error: `<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`,
      info: `<svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
      warning: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
    };

    toast.className = `flex items-center gap-3 p-4 mb-3 rounded-xl shadow-xl glass-card border border-slate-200 dark:border-slate-700 animate-fade-in transition-all duration-300 max-w-sm w-full`;
    toast.innerHTML = `
      <div class="flex-shrink-0">${icons[type] || icons.info}</div>
      <div class="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">${message}</div>
      <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);
    this.playAudio(type);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // WhatsApp Kwitansi Message Formatter
  generateWhatsAppKwitansiText: function(receipt) {
    const config = ConfigManager.getAll();
    const isIncome = receipt.type === "IN";
    const title = isIncome ? "KWITANSI BUKTI PENERIMAAN INFAQ / ZISWAF" : "BUKTI PENGELUARAN KAS MASJID";

    return `*${config.mosque_name.toUpperCase()}*
_${config.mosque_tagline}_
📍 ${config.mosque_address}
----------------------------------------
*${title}*
----------------------------------------
*No. Bukti:* ${receipt.trx_id || "-"}
*Tanggal:* ${receipt.date || "-"}
*Kategori:* ${receipt.category || "-"}
*Sub Kategori:* ${receipt.sub_category || "-"}
*Keterangan:* ${receipt.notes || "-"}
*Petugas / PJ:* ${receipt.pj_name || "Petugas Kasir"}
----------------------------------------
*JUMLAH:* ${this.formatRupiah(receipt.amount)}
----------------------------------------
_Jazakumullahu khairan wa barakallahu fiikum._
_Semoga Allah membalas dengan kebaikan yang berlipat ganda._

*Status:* SAH & TERCATAT SISTEM KAS MASJID
_Layanan Bantuan: ${config.mosque_phone}_`;
  },

  // Sanitize & Format Phone Number for WhatsApp (e.g. 0812... or 812... -> 62812...)
  cleanPhone: function(phone) {
    if (!phone) return "";
    let clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  },

  // Open Direct WhatsApp Link
  openWhatsAppReceipt: function(phone, receipt) {
    const cleanPhone = this.cleanPhone(phone);
    const text = encodeURIComponent(this.generateWhatsAppKwitansiText(receipt));
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  },

  // Generate HTML for Thermal Receipt
  buildThermalReceiptHtml: function(receipt) {
    const config = ConfigManager.getAll();
    const isIncome = receipt.type === "IN";

    return `
      <div style="text-align: center; margin-bottom: 8px;">
        <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">${config.mosque_name}</div>
        <div style="font-size: 10px; margin-top: 2px;">${config.mosque_tagline}</div>
        <div style="font-size: 9px; color: #444; margin-top: 2px;">${config.mosque_address}</div>
        <div style="font-size: 9px; color: #444;">Telp: ${config.mosque_phone}</div>
      </div>

      <div class="thermal-double-divider"></div>

      <div style="text-align: center; font-weight: bold; margin: 4px 0; font-size: 11px;">
        ${isIncome ? '*** BUKTI INFAQ / PENERIMAAN KAS ***' : '*** BUKTI PENGELUARAN KAS ***'}
      </div>

      <div class="thermal-divider"></div>

      <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
        <tr>
          <td style="padding: 2px 0;">No. Ref</td>
          <td style="text-align: right; font-weight: bold;">${receipt.trx_id || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Tanggal</td>
          <td style="text-align: right;">${receipt.date || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Kategori</td>
          <td style="text-align: right;">${receipt.category || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Sub-Pos</td>
          <td style="text-align: right;">${receipt.sub_category || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Keterangan</td>
          <td style="text-align: right;">${receipt.notes || '-'}</td>
        </tr>
        <tr>
          <td style="padding: 2px 0;">Petugas</td>
          <td style="text-align: right;">${receipt.pj_name || 'Kasir MBJ'}</td>
        </tr>
      </table>

      <div class="thermal-divider"></div>

      <table style="width: 100%; font-size: 13px; font-weight: bold; margin: 6px 0;">
        <tr>
          <td>TOTAL</td>
          <td style="text-align: right;">${this.formatRupiah(receipt.amount)}</td>
        </tr>
      </table>

      <div class="thermal-double-divider"></div>

      <div style="text-align: center; font-size: 9.5px; margin-top: 8px;">
        <div>Jazakumullahu Khairan Katsiran</div>
        <div style="font-size: 8.5px; margin-top: 2px;">Semoga Menjadi Amal Jariyah yang Diberkahi</div>
        <div style="font-size: 8px; color: #666; margin-top: 6px;">Dicetak Otomatis pada ${new Date().toLocaleString('id-ID')}</div>
      </div>
    `;
  },

  // Export Table Data to CSV
  exportToCSV: function(filename, headers, rows) {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Indonesian Excel compatibility
    csvContent += headers.map(h => `"${(h || '').replace(/"/g, '""')}"`).join(",") + "\r\n";

    rows.forEach(row => {
      const line = row.map(cell => {
        let str = cell === null || cell === undefined ? "" : cell.toString();
        return `"${str.replace(/"/g, '""')}"`;
      }).join(",");
      csvContent += line + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(`Laporan CSV ${filename} berhasil diunduh!`, "success");
  }
};
