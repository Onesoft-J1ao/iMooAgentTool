const fs = require('fs');
const path = require('path');
const PROJ = 'D:\\Users\\Administrator\\Desktop\\XTCAgent_local\\iMooDesktop';
const TMP = 'C:\\Users\\Administrator\\AppData\\Local\\Temp\\asar-fresh';

// 1. Copy patched main/preload from TMP to PROJ
if (fs.existsSync(path.join(TMP, 'dist-electron', 'main', 'main.js'))) {
  fs.copyFileSync(path.join(TMP, 'dist-electron', 'main', 'main.js'), path.join(PROJ, 'dist-electron', 'main', 'main.js'));
  fs.copyFileSync(path.join(TMP, 'dist-electron', 'preload', 'preload.js'), path.join(PROJ, 'dist-electron', 'preload', 'preload.js'));
  console.log('Copied patched main/preload');
}

// 2. Copy agent preload
if (fs.existsSync(path.join(TMP, 'dist-electron', 'preload', 'agent-preload.js'))) {
  fs.copyFileSync(path.join(TMP, 'dist-electron', 'preload', 'agent-preload.js'), path.join(PROJ, 'dist-electron', 'preload', 'agent-preload.js'));
  console.log('Copied agent-preload');
}

// 3. Update index.html in new renderer dist
var idxPath = path.join(PROJ, 'dist', 'index.html');
var idx = fs.readFileSync(idxPath, 'utf8');
idx = idx.replace(/<meta[^>]*Content-Security-Policy[^>]*>/, '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' file:; script-src \'self\' \'unsafe-inline\' file:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: file:; connect-src *;">');
if (idx.indexOf('sidebar-agent.js') === -1) {
  idx = idx.replace('</body>', '<script src="./assets/sidebar-agent.js"></script>\n</body>');
}
fs.writeFileSync(idxPath, idx, 'utf8');
console.log('Updated index.html');

// 4. Copy sidebar-agent.js to dist/assets
if (fs.existsSync(path.join(TMP, 'dist', 'assets', 'sidebar-agent.js'))) {
  fs.copyFileSync(path.join(TMP, 'dist', 'assets', 'sidebar-agent.js'), path.join(PROJ, 'dist', 'assets', 'sidebar-agent.js'));
  console.log('Copied sidebar-agent.js');
} else if (fs.existsSync(path.join(PROJ, 'dist', 'assets', 'sidebar-agent.js'))) {
  console.log('sidebar-agent.js already exists');
}

// 5. Copy icon to dist/assets for favicon
fs.copyFileSync(path.join(PROJ, 'resources', 'assets', 'icon.png'), path.join(PROJ, 'dist', 'assets', 'icon.png'));
console.log('Copied icon to dist/assets');

// 6. Copy agent.html from TMP to PROJ dist (if exists)
if (fs.existsSync(path.join(TMP, 'dist', 'agent.html'))) {
  fs.copyFileSync(path.join(TMP, 'dist', 'agent.html'), path.join(PROJ, 'dist', 'agent.html'));
  console.log('Copied agent.html');
}

console.log('ALL DONE - ready for electron-builder');
