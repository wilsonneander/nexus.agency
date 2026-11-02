const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const vps = [
  { name: 'mobile_375.png', w: 375, h: 812 },
  { name: 'mobile_480.png', w: 480, h: 854 },
  { name: 'tablet_768.png', w: 768, h: 1024 },
  { name: 'laptop_1024.png', w: 1024, h: 768 }
];

const targetDir = 'C:\\Users\\wilso\\Desktop\\Wilson\\clients\\nexus\\docs\\references\\qa';

vps.forEach(vp => {
  const outFile = path.join(targetDir, vp.name);
  console.log(`Capturing ${vp.name}...`);
  const cmd = `"${chromePath}" --headless=new --disable-gpu --window-size=${vp.w},${vp.h} --screenshot="${outFile}" http://localhost:3001`;
  execSync(cmd, { stdio: 'inherit' });
});

console.log('Capture complete!');
