const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

const shots = [
  { name: 'val_values_all_cards.png', w: 1200, h: 900, url: 'http://localhost:3007/#about' },
  { name: 'val_projects_all_cards.png', w: 1200, h: 900, url: 'http://localhost:3007/#project' },
  { name: 'val_packages_all_cards.png', w: 1200, h: 900, url: 'http://localhost:3007/#service' },
  { name: 'val_blog_all_cards.png', w: 1200, h: 900, url: 'http://localhost:3007/#blog' },
  { name: 'val_footer_circular.png', w: 1200, h: 900, url: 'http://localhost:3007/#contact' }
];

shots.forEach(s => {
  const outFile = path.join(targetDir, s.name);
  console.log(`Capturing ${s.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --virtual-time-budget=2000 --window-size=${s.w},${s.h} --screenshot="${outFile}" "${s.url}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Validation captures complete!');
