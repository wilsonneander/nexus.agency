// Porta do dev server: PORT=<n> node scripts/capture_sections.js (padrão 3008)
const PORT = process.env.PORT || 3008;
const { execSync } = require('child_process');
const path = require('path');

const chromePath = require('./chrome-path');
const sections = [
  { name: 'section_about.png', url: `http://localhost:${PORT}/#about` },
  { name: 'section_service.png', url: `http://localhost:${PORT}/#service` },
  { name: 'section_project.png', url: `http://localhost:${PORT}/#project` },
  { name: 'section_contact.png', url: `http://localhost:${PORT}/#contact` }
];

const targetDir = process.env.OUT_DIR || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'nexus-qa-'));

sections.forEach(sec => {
  const outFile = path.join(targetDir, sec.name);
  console.log(`Capturing ${sec.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1200,900 --screenshot="${outFile}" "${sec.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Sections capture complete!');
