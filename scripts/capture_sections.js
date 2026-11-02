const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sections = [
  { name: 'section_about.png', url: 'http://localhost:3001/#about' },
  { name: 'section_service.png', url: 'http://localhost:3001/#service' },
  { name: 'section_project.png', url: 'http://localhost:3001/#project' },
  { name: 'section_contact.png', url: 'http://localhost:3001/#contact' }
];

const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

sections.forEach(sec => {
  const outFile = path.join(targetDir, sec.name);
  console.log(`Capturing ${sec.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1200,900 --screenshot="${outFile}" "${sec.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Sections capture complete!');
