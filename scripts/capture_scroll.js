// Porta do dev server: PORT=<n> node scripts/capture_scroll.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sections = ['about', 'service', 'project', 'contact'];
const targetDir = process.env.OUT_DIR || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nexus-qa-'));

sections.forEach(sec => {
  const outFile = path.join(targetDir, `scroll_${sec}.png`);
  console.log(`Capturing scroll_${sec}.png with virtual-time-budget...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1200,900 --virtual-time-budget=2000 --screenshot="${outFile}" "http://localhost:${PORT}/#${sec}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Scroll anchors capture complete!');
