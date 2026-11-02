const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sections = ['about', 'service', 'project', 'contact'];
const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

sections.forEach(sec => {
  const outFile = path.join(targetDir, `scroll_${sec}.png`);
  console.log(`Capturing scroll_${sec}.png with virtual-time-budget...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=1200,900 --virtual-time-budget=2000 --screenshot="${outFile}" "http://localhost:3001/#${sec}"`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Scroll anchors capture complete!');
