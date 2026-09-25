const fs = require('fs');
const path = require('path');

console.log("🔨 Building Mosque Management System Bundle...");

const files = [
  'js/config.js',
  'js/utils.js',
  'js/state.js',
  'js/api.js',
  'js/components/navbar.js',
  'js/components/sidebar.js',
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

let bundleContent = "/**\n * Masjid MBJ Management System - Unified Production Bundle\n * Generated: " + new Date().toISOString() + "\n */\n\n";

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    bundleContent += `\n/* === START FILE: ${file} === */\n`;
    bundleContent += fs.readFileSync(filePath, 'utf8');
    bundleContent += `\n/* === END FILE: ${file} === */\n`;
  } else {
    console.warn(`⚠️ Warning: ${file} not found`);
  }
});

fs.writeFileSync(path.join(__dirname, 'js/bundle.js'), bundleContent, 'utf8');
console.log("✅ Successfully created js/bundle.js (" + (bundleContent.length / 1024).toFixed(1) + " KB)");
