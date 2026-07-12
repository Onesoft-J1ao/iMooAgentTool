const fs = require('fs');
const path = require('path');
const PROJ = 'D:\\Users\\Administrator\\Desktop\\XTCAgent_local\\iMooDesktop';
const TMP = 'C:\\Users\\Administrator\\AppData\\Local\\Temp\\asar-fresh';

// Re-extract fresh asar
const { execSync } = require('child_process');
execSync(`node "${PROJ}\\node_modules\\@electron\\asar\\bin\\asar.mjs" extract "D:\\iMooDesktop\\resources\\app.asar" "${TMP}"`, { cwd: PROJ });
console.log('Extracted');

// Replace names across all files
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return false;
  var c = fs.readFileSync(filePath, 'utf8');
  var changed = false;
  replacements.forEach(function(r) {
    if (c.indexOf(r.from) >= 0) { c = c.split(r.from).join(r.to); changed = true; }
  });
  if (changed) { fs.writeFileSync(filePath, c, 'utf8'); }
  return changed;
}

var replacements = [
  { from: 'iMooDesktop', to: 'iMooAgentTool' },
  { from: 'Kiruvex', to: 'J1ao' },
  { from: '3038929349@qq.com', to: '1987800833@qq.com' },
  { from: '3038929349', to: '1987800833' },
];

// Update main.js
var mainJsPath = path.join(TMP, 'dist-electron', 'main', 'main.js');
replaceInFile(mainJsPath, replacements);
console.log('Updated main.js');

// Update preload.js
var preloadPath = path.join(TMP, 'dist-electron', 'preload', 'preload.js');
replaceInFile(preloadPath, replacements);
console.log('Updated preload.js');

// Update all JS files in dist/assets
var distDir = path.join(TMP, 'dist', 'assets');
if (fs.existsSync(distDir)) {
  fs.readdirSync(distDir).forEach(function(f) {
    if (f.endsWith('.js')) {
      if (replaceInFile(path.join(distDir, f), replacements)) console.log('Updated ' + f);
    }
  });
}

// Update index.html
var idxPath = path.join(TMP, 'dist', 'index.html');
replaceInFile(idxPath, replacements);
console.log('Updated index.html');

// Update app-update.yml
var updatePath = path.join(TMP, '..', 'app-update.yml');
if (fs.existsSync(updatePath)) replaceInFile(updatePath, [{ from: 'iMooAgentTool', to: 'iMooAgentTool' }]);

// Read agent addon code from external file (avoid encoding corruption)
const agentAddon = "\n\n// [iMooAgent] AI Agent Addon\n" + require('fs').readFileSync(path.join(__dirname, 'agent-addon-code.js'), 'utf8');

// Patch main.js
var mainPath = path.join(TMP, 'dist-electron', 'main', 'main.js');
var mainContent = fs.readFileSync(mainPath, 'utf8');
mainContent += '\n' + agentAddon;
fs.writeFileSync(mainPath, mainContent, 'utf8');
console.log('Patched main.js');

// Verify syntax
try {
  var addonStart = mainContent.lastIndexOf('(function()');
  var addonEnd = mainContent.lastIndexOf('})();') + 5;
  new Function(mainContent.slice(addonStart, addonEnd));
  console.log('Agent addon syntax: OK');
} catch(e) {
  console.log('Agent addon syntax ERROR:', e.message);
  process.exit(1);
}

// Patch preload.js - add agent API (needed for main window compatibility)
var preloadPath = path.join(TMP, 'dist-electron', 'preload', 'preload.js');
var preloadContent = fs.readFileSync(preloadPath, 'utf8');
preloadContent += '\ntry{var ee=require("electron"),cb=ee.contextBridge,ir=ee.ipcRenderer;cb.exposeInMainWorld("agentApi",{search:function(q){return ir.invoke("agent:search",q)},chat:function(m){return ir.invoke("agent:chat",{messages:m})},getConfig:function(){return ir.invoke("agent:get-config")},setConfig:function(p){return ir.invoke("agent:set-config",p)},testConnection:function(a,k,m){return ir.invoke("agent:test-connection",{apiUrl:a,apiKey:k,model:m})},openWindow:function(){return ir.invoke("agent:open-window")}})}catch(e){console.error("[AI]",e)}\n';
fs.writeFileSync(preloadPath, preloadContent, 'utf8');
console.log('Patched preload.js');

// Patch index.html - CSP + sidebar agent button
var idxPath = path.join(TMP, 'dist', 'index.html');
var idxContent = fs.readFileSync(idxPath, 'utf8');
idxContent = idxContent.replace(/<meta[^>]*Content-Security-Policy[^>]*>/, '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' file:; script-src \'self\' \'unsafe-inline\' file:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: file:; connect-src *;">');
// Remove any existing agent-widget script tag, add sidebar injection
idxContent = idxContent.replace(/<script src="\.\/assets\/agent-widget\.js"><\/script>\s*/g, '');
// Add favicon
if (idxContent.indexOf('icon.png') === -1) {
  idxContent = idxContent.replace('</title>', '</title>\n    <link rel="icon" type="image/png" href="./assets/icon.png">');
}
if (idxContent.indexOf('sidebar-agent.js') === -1) {
  idxContent = idxContent.replace('</body>', '<script src="./assets/sidebar-agent.js"></script>\n</body>');
}
fs.writeFileSync(idxPath, idxContent, 'utf8');
console.log('Patched index.html (CSP + sidebar + icon)');

// Copy agent window files - skip agent.html (rebuilt by electron-vite)
// fs.copyFileSync(path.join(PROJ, 'dist', 'agent.html'), path.join(TMP, 'dist', 'agent.html'));
fs.copyFileSync(path.join(PROJ, 'dist-electron', 'preload', 'agent-preload.js'), path.join(TMP, 'dist-electron', 'preload', 'agent-preload.js'));
fs.copyFileSync(path.join(PROJ, 'dist', 'assets', 'sidebar-agent.js'), path.join(TMP, 'dist', 'assets', 'sidebar-agent.js'));
// Copy icon to TMP resources/assets
if (fs.existsSync(path.join(PROJ, 'resources', 'assets', 'icon.png'))) {
  fs.copyFileSync(path.join(PROJ, 'resources', 'assets', 'icon.png'), path.join(TMP, 'resources', 'assets', 'icon.png'));
}
fs.copyFileSync(path.join(PROJ, 'resources', 'assets', 'icon.ico'), path.join(TMP, 'resources', 'assets', 'icon.ico'));
console.log('Copied agent window & sidebar files');

// Copy to build project
['dist', 'dist-electron'].forEach(function(dir) {
  var src = path.join(TMP, dir);
  var dst = path.join(PROJ, dir);
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
  (function cp(s, d) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
      var sp = path.join(s, e.name), dp = path.join(d, e.name);
      if (e.isDirectory()) cp(sp, dp);
      else fs.copyFileSync(sp, dp);
    });
  })(src, dst);
  console.log('Copied ' + dir);
});

// Copy asar node_modules that we need
var nmSrc = path.join(TMP, 'node_modules');
var nmDst = path.join(PROJ, 'node_modules');
var needed = ['electron-log', 'electron-store', 'iconv-lite', 'lucide-react', 'react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack', 'string-argv', 'semver', 'usb', 'safer-buffer', 'js-tokens', 'loose-envify', 'scheduler', 'conf', 'dot-prop', 'env-paths', 'atomically', 'type-fest'];
needed.forEach(function(pkg) {
  var sp = path.join(nmSrc, pkg);
  var dp = path.join(nmDst, pkg);
  if (fs.existsSync(sp) && !fs.existsSync(dp)) {
    (function cp(s, d) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
        var sp2 = path.join(s, e.name), dp2 = path.join(d, e.name);
        if (e.isDirectory()) cp(sp2, dp2);
        else fs.copyFileSync(sp2, dp2);
      });
    })(sp, dp);
    console.log('Added ' + pkg);
  }
});

console.log('ALL DONE - ready for electron-builder');
