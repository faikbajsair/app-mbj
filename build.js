const fs = require('fs');
const path = require('path');

console.log("🚀 Running Ultra-Fast Standalone Mosque MBJ Bundler...");

const jsFiles = [
  'js/config.js',
  'js/utils.js',
  'js/state.js',
  'js/api.js',
  'js/components/navbar.js',
  'js/components/sidebar.js',
  'js/components/bottomnav.js',
  'js/components/dashboard.js',
  'js/components/pos.js',
  'js/components/transactions.js',
  'js/components/ubudiyah.js',
  'js/components/multimedia.js',
  'js/components/facilities.js',
  'js/components/social.js',
  'js/components/tpq.js',
  'js/components/portal.js',
  'js/components/settings.js',
  'js/app.js'
];

// 1. Compile JS Bundle
let bundledJs = "/* Masjid MBJ Management System Unified Production Bundle */\n";
jsFiles.forEach(file => {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    bundledJs += `\n/* === ${file} === */\n` + fs.readFileSync(p, 'utf8') + "\n";
  }
});

// Write to js/bundle.js and root bundle.js
if (!fs.existsSync(path.join(__dirname, 'js'))) {
  fs.mkdirSync(path.join(__dirname, 'js'), { recursive: true });
}
fs.writeFileSync(path.join(__dirname, 'js/bundle.js'), bundledJs, 'utf8');
fs.writeFileSync(path.join(__dirname, 'bundle.js'), bundledJs, 'utf8');

// 2. Read main.css
const cssContent = fs.readFileSync(path.join(__dirname, 'css/main.css'), 'utf8');

// 3. Template Definition with Safe Placeholders (Avoiding Template Literal Expansion)
const htmlTemplate = `<!DOCTYPE html>
<html lang="id" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Masjid Mu'adz bin Jabal - Sistem Manajemen DKM & Layanan Umat</title>
  
  <meta name="description" content="Sistem Informasi & Manajemen Terpadu Masjid Mu'adz bin Jabal (MBJ). Smart POS Kasir Keuangan, Divisi Ubudiyah & Khotib, Multimedia, Fasilitas Marbot, Layanan Sosial CSR, dan TPQ.">
  <meta name="keywords" content="masjid, muadz bin jabal, dkm, manajemen masjid, pos kasir masjid, infaq qris, jadwal kajian">
  
  <!-- Mobile & PWA Optimization -->
  <meta name="theme-color" content="#059669">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Masjid MBJ">
  <meta name="mobile-web-app-capable" content="yes">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="https://yt3.googleusercontent.com/ytc/AIdro_nzf7bsONYGX6eeNc-v6GMQUko-_BZXFExEZ_bPNxMbfw=s160-c-k-c0x00ffffff-no-rj">

  <!-- Google Fonts: Plus Jakarta Sans & Amiri -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            arabic: ['"Amiri"', 'serif']
          }
        }
      }
    }
  </script>

  <!-- Lucide Icons CDN (UMD Build) -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Embedded Custom Stylesheet -->
  <style>
/* CSS_INLINE_INJECTION */
  </style>
</head>
<body class="bg-islamic-pattern min-h-screen text-slate-800 antialiased flex flex-col justify-between selection:bg-emerald-500 selection:text-white">

  <!-- Main Top Navigation Container -->
  <div id="navbar-container"></div>

  <!-- Main Layout Container: Sidebar + Viewport -->
  <div class="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
    
    <!-- Sidebar Navigation Container -->
    <div id="sidebar-container"></div>

    <!-- Main Dynamic Application View -->
    <main id="app-main-content" class="flex-1 lg:pl-64 w-full min-w-0 transition-all duration-300">
      <div id="main-content-view" class="w-full">
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="text-center space-y-3">
            <div class="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-sm font-semibold text-slate-500">Memuat Sistem Manajemen Masjid MBJ...</p>
          </div>
        </div>
      </div>
    </main>

  </div>

  <!-- Global Footer -->
  <footer id="app-footer" class="lg:pl-64 py-6 border-t border-slate-200/60 text-center text-xs text-slate-400 bg-white/40 backdrop-blur-sm transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div>
        <span class="font-bold text-slate-600">Sistem Manajemen Masjid Mu'adz bin Jabal (MBJ)</span> &copy; 2026 • Development by Al-Imam EduTech
      </div>
      <div class="flex items-center gap-3 text-slate-500">
        <a href="#portal" class="hover:text-emerald-600">Portal Publik</a>
        <span>•</span>
        <a href="#settings" class="hover:text-emerald-600">CMS Settings</a>
        <span>•</span>
        <span class="text-emerald-600 font-semibold">v1.0.0 Production</span>
      </div>
    </div>
  </footer>

  <!-- Thermal Receipt Container (Only visible during print / window.print) -->
  <div id="thermal-receipt-container"></div>

  <!-- Global Modal Viewport -->
  <div id="modal-global-container"></div>

  <!-- Mobile Bottom Navigation Bar Container -->
  <div id="bottomnav-container"></div>

  <!-- Toast Notification Container -->
  <div id="toast-container" class="fixed bottom-16 sm:bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none [&>*]:pointer-events-auto"></div>

  <!-- Standalone Application Unified Script -->
  <script>
/* JS_INLINE_INJECTION */
  </script>
</body>
</html>`;

// Safe replacement using replacer functions to avoid '$' interpretation
const finalIndexHtml = htmlTemplate
  .replace('/* CSS_INLINE_INJECTION */', () => cssContent)
  .replace('/* JS_INLINE_INJECTION */', () => bundledJs);

// Write to root index.html
fs.writeFileSync(path.join(__dirname, 'index.html'), finalIndexHtml, 'utf8');

// 4. Setup public/ directory with complete mirror for Vercel Static deployment
const publicDir = path.join(__dirname, 'public');
const publicJsDir = path.join(publicDir, 'js');
const publicCssDir = path.join(publicDir, 'css');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(publicJsDir)) fs.mkdirSync(publicJsDir, { recursive: true });
if (!fs.existsSync(publicCssDir)) fs.mkdirSync(publicCssDir, { recursive: true });

fs.writeFileSync(path.join(publicDir, 'index.html'), finalIndexHtml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'bundle.js'), bundledJs, 'utf8');
fs.writeFileSync(path.join(publicJsDir, 'bundle.js'), bundledJs, 'utf8');
fs.writeFileSync(path.join(publicCssDir, 'main.css'), cssContent, 'utf8');

// Copy all individual js files to public/js for dev/debugging
jsFiles.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
});

console.log("✨ Build Complete! All targets (index.html, bundle.js, public/) compiled & synchronized.");
