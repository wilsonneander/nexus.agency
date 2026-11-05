// Porta do dev server: PORT=<n> node scripts/capture_screenshots.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const vps = [
  { name: 'mobile_375.png', w: 375, h: 812 },
  { name: 'mobile_480.png', w: 480, h: 854 },
  { name: 'tablet_768.png', w: 768, h: 1024 },
  { name: 'laptop_1024.png', w: 1024, h: 768 }
];

const targetDir = process.env.OUT_DIR || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nexus-qa-'));

vps.forEach(vp => {
  const outFile = path.join(targetDir, vp.name);
  console.log(`Capturing ${vp.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${vp.w},${vp.h} --screenshot="${outFile}" http://localhost:${PORT}`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Capture complete!');
