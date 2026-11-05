// Porta do dev server: PORT=<n> node scripts/capture_mvv.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = process.env.OUT_DIR || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nexus-qa-'));

const shots = [
  { name: 'val_mvv_desktop_1200.png', w: 1200, h: 900, url: `http://localhost:${PORT}/#about` },
  { name: 'val_mvv_mobile_375.png', w: 375, h: 812, url: `http://localhost:${PORT}/#about` }
];

shots.forEach(s => {
  const outFile = path.join(targetDir, s.name);
  console.log(`Capturing ${s.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=2000 --window-size=${s.w},${s.h} --screenshot="${outFile}" "${s.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('MVV captures complete!');
