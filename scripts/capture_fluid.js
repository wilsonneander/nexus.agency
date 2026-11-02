const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

const shots = [
  { name: 'fluid_desktop_1200.png', w: 1200, h: 900, url: 'http://localhost:3006/#service' },
  { name: 'fluid_contact_1200.png', w: 1200, h: 900, url: 'http://localhost:3006/#contact' },
  { name: 'fluid_projects_1200.png', w: 1200, h: 900, url: 'http://localhost:3006/#project' }
];

shots.forEach(s => {
  const outFile = path.join(targetDir, s.name);
  console.log(`Capturing ${s.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${s.w},${s.h} --screenshot="${outFile}" "${s.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Fluid button captures complete!');
