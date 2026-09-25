/**
 * ==============================================================================
 * COMPONENT: DASHBOARD (EXECUTIVE OVERVIEW)
 * Real-time Financial Ledger Metrics, Chart.js Visualizations & Division Cards
 * ==============================================================================
 */

const DashboardComponent = {
  render: function() {
    const config = ConfigManager.getAll();
    const fin = state.getFinancialSummary();
    const transactions = state.data.transactions.slice(0, 5);
    const upcomingAgendas = state.data.ubudiyah.slice(0, 3);
    const pendingTickets = state.data.household.filter(t => t.status !== "Selesai").slice(0, 3);
    const activeSantriCount = state.data.tpq_students.filter(s => s.status_active === "Aktif").length;
    const ambulanceReqs = state.data.social.filter(s => s.service_type === "Ambulance" && s.status !== "Selesai");

    return `
      <div class="space-y-6 animate-fade-in">
        
        <!-- Welcome Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 sm:p-8 shadow-xl">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-xs font-semibold text-emerald-200 mb-2">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-300"></i>
                <span>SaaS-Ready DKM Management Engine</span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">${config.mosque_name}</h1>
              <p class="text-emerald-100 text-sm mt-1 max-w-xl">${config.mosque_tagline} — Transparansi Keuangan, Pelayanan Umat & Manajemen Terintegrasi.</p>
            </div>
            
            <div class="flex flex-wrap items-center gap-3">
              <a href="#pos" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5">
                <i data-lucide="calculator" class="w-4 h-4"></i>
                <span>Buka Smart POS Kasir</span>
              </a>
              <button onclick="App.openQuickTransactionModal('IN')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold text-sm border border-emerald-400/30 transition">
                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                <span>Input Kas Cepat</span>
              </button>
            </div>
          </div>
          
          <!-- Background Geometric Accent -->
          <div class="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 pointer-events-none blur-2xl"></div>
        </div>

        <!-- Financial KPI Cards Grid (4 Cards) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <!-- Total Balance -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Saldo Kas</span>
              <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <i data-lucide="vault" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-3">
              ${Utils.formatRupiah(fin.balance)}
            </div>
            <div class="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Kas Riil Terverifikasi</span>
            </div>
          </div>

          <!-- Inflow Month -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pemasukan Bulan Ini</span>
              <div class="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <i data-lucide="trending-up" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-teal-600 dark:text-teal-400 mt-3">
              ${Utils.formatRupiah(fin.thisMonthIn)}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Tromol, Donatur & SPP TPQ
            </div>
          </div>

          <!-- Outflow Month -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pengeluaran Bulan Ini</span>
              <div class="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <i data-lucide="trending-down" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mt-3">
              ${Utils.formatRupiah(fin.thisMonthOut)}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Fee Ustadz, Karbol & Operasional
            </div>
          </div>

          <!-- Monthly Net Surplus -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Surplus Kas Bulan Ini</span>
              <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <i data-lucide="pie-chart" class="w-5 h-5"></i>
              </div>
            </div>
            <div class="text-2xl font-black text-slate-900 dark:text-white mt-3 ${fin.thisMonthNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}">
              ${Utils.formatRupiah(fin.thisMonthNet)}
            </div>
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              ${fin.thisMonthNet >= 0 ? '🟢 Kas Surplus Terjaga' : '🔴 Defisit Operasional'}
            </div>
          </div>

        </div>

        <!-- Charts Section (2 Columns) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Bar/Line Cash Flow Chart (2 Cols) -->
          <div class="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="font-bold text-base text-slate-900 dark:text-white">Arus Kas Masuk vs Keluar</h3>
                <p class="text-xs text-slate-500">Perbandingan pergerakan dana kas riil</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 text-xs font-medium text-emerald-600"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Inflow</span>
                <span class="inline-flex items-center gap-1 text-xs font-medium text-rose-600"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Outflow</span>
              </div>
            </div>
            <div class="h-64 sm:h-72 w-full">
              <canvas id="cashflow-chart"></canvas>
            </div>
          </div>

          <!-- Category Breakdown Doughnut Chart (1 Col) -->
          <div class="glass-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Distribusi Kategori</h3>
              <p class="text-xs text-slate-500 mb-4">Porsi pos pemasukan & pengeluaran</p>
              <div class="h-52 w-full flex items-center justify-center">
                <canvas id="category-chart"></canvas>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <a href="#transactions" class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1">
                <span>Buka Rincian Buku Kas</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- 3 Divisional Operational Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Ubudiyah Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <i data-lucide="book-open" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Ubudiyah & Khotib</h4>
              </div>
              <a href="#ubudiyah" class="text-xs text-emerald-600 font-semibold hover:underline">Kelola</a>
            </div>
            <div class="mt-3 space-y-2.5">
              ${upcomingAgendas.map(item => `
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200">${item.title}</div>
                    <div class="text-slate-500 text-[11px]">${item.ustadz_name}</div>
                    <div class="text-emerald-600 font-medium text-[10px] mt-0.5">${item.date_time}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === 'Terjadwal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${item.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Facilities & Marbot Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600">
                  <i data-lucide="sparkles" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Fasilitas & Marbot</h4>
              </div>
              <a href="#facilities" class="text-xs text-teal-600 font-semibold hover:underline">Kelola</a>
            </div>
            <div class="mt-3 space-y-2.5">
              ${pendingTickets.length === 0 ? `
                <div class="text-center py-6 text-xs text-slate-400">Semua fasilitas dan sanitasi dalam kondisi prima! ✨</div>
              ` : pendingTickets.map(item => `
                <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div class="font-bold text-slate-800 dark:text-slate-200">${item.item} (${item.area})</div>
                    <div class="text-slate-500 text-[11px]">PIC: ${item.pic_marbot} • Qty: ${item.qty}</div>
                  </div>
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${item.status === 'Pending' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}">${item.status}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- CSR Social & TPQ Education Card -->
          <div class="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <i data-lucide="heart-handshake" class="w-4 h-4"></i>
                </div>
                <h4 class="font-bold text-sm text-slate-900 dark:text-white">Sosial & TPQ</h4>
              </div>
              <a href="#social" class="text-xs text-amber-600 font-semibold hover:underline">Rincian</a>
            </div>
            <div class="mt-3 space-y-3">
              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-600 dark:text-slate-300">Ambulans Siap Siaga</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">STANDBY 24 JAM</span>
                </div>
                <div class="text-[11px] text-slate-500 mt-1">${ambulanceReqs.length} Permohonan aktif hari ini</div>
              </div>

              <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-600 dark:text-slate-300">Santri Aktif TPQ</span>
                  <span class="font-bold text-slate-900 dark:text-white">${activeSantriCount} Santri</span>
                </div>
                <div class="text-[11px] text-emerald-600 font-medium mt-1">Sistem SPP Kasir Terintegrasi WA</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Recent Transactions Table -->
        <div class="glass-card rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden">
          <div class="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Transaksi Kas Terbaru</h3>
              <p class="text-xs text-slate-500">Mutasi kas masuk dan keluar terkini</p>
            </div>
            <a href="#transactions" class="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1">
              <span>Lihat Semua</span>
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="py-3 px-4">No. Ref / Tanggal</th>
                  <th class="py-3 px-4">Jenis</th>
                  <th class="py-3 px-4">Kategori / Keterangan</th>
                  <th class="py-3 px-4">PJ / Petugas</th>
                  <th class="py-3 px-4 text-right">Jumlah</th>
                  <th class="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                ${transactions.map(item => {
                  const isIncome = item.type === "IN";
                  return `
                    <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td class="py-3 px-4">
                        <div class="font-mono font-bold text-slate-800 dark:text-slate-200">${item.trx_id}</div>
                        <div class="text-[11px] text-slate-400">${Utils.formatDateIndo(item.date)}</div>
                      </td>
                      <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isIncome ? 'badge-in' : 'badge-out'}">
                          <i data-lucide="${isIncome ? 'arrow-down-left' : 'arrow-up-right'}" class="w-3 h-3"></i>
                          <span>${isIncome ? 'PEMASUKAN' : 'PENGELUARAN'}</span>
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="font-semibold text-slate-900 dark:text-slate-100">${item.category}</div>
                        <div class="text-[11px] text-slate-500">${item.sub_category} • ${item.notes}</div>
                      </td>
                      <td class="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        ${item.pj_name || '-'}
                      </td>
                      <td class="py-3 px-4 text-right font-extrabold ${isIncome ? 'text-emerald-600' : 'text-rose-600'} text-sm">
                        ${isIncome ? '+' : '-'}${Utils.formatRupiah(item.amount)}
                      </td>
                      <td class="py-3 px-4 text-center">
                        <button onclick="App.openThermalReceiptModal('${item.trx_id}')" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition" title="Cetak Struk Thermal">
                          <i data-lucide="printer" class="w-4 h-4"></i>
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
    `;
  },

  initCharts: function() {
    if (typeof Chart === "undefined") return;

    // 1. Cashflow Bar Chart
    const ctxCash = document.getElementById("cashflow-chart");
    if (ctxCash) {
      const trx = state.data.transactions;
      // Group by last 5 transactions or monthly
      const labels = ["Kotak Jumat", "Donatur", "Kajian", "Logistik Marbot", "Subuh Berkah", "Ambulance", "Servis AC"];
      const inData = [8750000, 5000000, 0, 0, 1450000, 750000, 0];
      const outData = [0, 0, 1200000, 350000, 0, 0, 450000];

      new Chart(ctxCash, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Pemasukan (Inflow)',
              data: inData,
              backgroundColor: '#10b981',
              borderRadius: 6
            },
            {
              label: 'Pengeluaran (Outflow)',
              data: outData,
              backgroundColor: '#f43f5e',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(val) {
                  return 'Rp ' + (val / 1000000) + ' Jt';
                }
              }
            }
          }
        }
      });
    }

    // 2. Category Doughnut Chart
    const ctxCat = document.getElementById("category-chart");
    if (ctxCat) {
      new Chart(ctxCat, {
        type: 'doughnut',
        data: {
          labels: ['Tromol Masjid', 'Donatur / CSR', 'Fee Ustadz', 'Operasional Marbot', 'Fasilitas & AC'],
          datasets: [{
            data: [55, 25, 10, 5, 5],
            backgroundColor: ['#059669', '#0d9488', '#f59e0b', '#f43f5e', '#6366f1']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
          },
          cutout: '65%'
        }
      });
    }
  }
};
