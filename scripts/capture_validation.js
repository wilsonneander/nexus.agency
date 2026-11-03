// Porta do dev server: PORT=<n> node scripts/capture_validation.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

const shots = [
  { name: 'val_values_all_cards.png', w: 1200, h: 900, url: `http://localhost:${PORT}/#about` },
  { name: 'val_projects_all_cards.png', w: 1200, h: 900, url: `http://localhost:${PORT}/#project` },
  { name: 'val_packages_all_cards.png', w: 1200, h: 900, url: `http://localhost:${PORT}/#service` },
  { name: 'val_footer_circular.png', w: 1200, h: 900, url: `http://localhost:${PORT}/#contact` }
];

shots.forEach(s => {
  const outFile = path.join(targetDir, s.name);
  console.log(`Capturing ${s.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=2000 --window-size=${s.w},${s.h} --screenshot="${outFile}" "${s.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Validation captures complete!');
