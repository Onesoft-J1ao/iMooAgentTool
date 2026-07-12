// Quick build script - no cmd.exe dependency
const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const PROJ = __dirname;
const TMP = path.join(PROJ, 'tmp-asar-extract');

console.log('Extracting asar...');
if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
asar.extractAll('D:\\iMooDesktop\\resources\\app.asar', TMP);

// Replace names
function replaceInFile(fp, reps) {
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8'), changed = false;
  reps.forEach(r => { if (c.indexOf(r.from) >= 0) { c = c.split(r.from).join(r.to); changed = true; } });
  if (changed) fs.writeFileSync(fp, c, 'utf8');
  return changed;
}
var reps = [
  { from: 'iMooDesktop', to: 'iMooAgentTool' },
  { from: 'Kiruvex', to: 'J1ao' },
  { from: '3038929349@qq.com', to: '1987800833@qq.com' },
];

['dist-electron/main/main.js','dist-electron/preload/preload.js'].forEach(f => replaceInFile(path.join(TMP, f), reps));

var distDir = path.join(TMP, 'dist', 'assets');
if (fs.existsSync(distDir)) {
  fs.readdirSync(distDir).forEach(f => { if (f.endsWith('.js')) replaceInFile(path.join(distDir, f), reps); });
}
replaceInFile(path.join(TMP, 'dist', 'index.html'), reps);

// Append agent addon to main.js
var agentAddon = fs.readFileSync(path.join(PROJ, 'agent-addon-code.js'), 'utf8');
var mainPath = path.join(TMP, 'dist-electron', 'main', 'main.js');
fs.writeFileSync(mainPath, fs.readFileSync(mainPath, 'utf8') + '\n\n// [iMooAgent]\n' + agentAddon, 'utf8');
console.log('Patched main.js');

// Append to preload.js
var preloadPath = path.join(TMP, 'dist-electron', 'preload', 'preload.js');
var preloadPatch = '\ntry{var ee=require("electron"),cb=ee.contextBridge,ir=ee.ipcRenderer;cb.exposeInMainWorld("agentApi",{search:function(q){return ir.invoke("agent:search",q)},chat:function(m){return ir.invoke("agent:chat",{messages:m})},getConfig:function(){return ir.invoke("agent:get-config")},setConfig:function(p){return ir.invoke("agent:set-config",p)},testConnection:function(a,k,m){return ir.invoke("agent:test-connection",{apiUrl:a,apiKey:k,model:m})},openWindow:function(){return ir.invoke("agent:open-window")},minimize:function(){return ir.invoke("agent:minimize")},checkUpdate:function(){return ir.invoke("agent:check-update")},downloadUpdate:function(u){return ir.invoke("agent:download-update",{url:u})},installUpdate:function(p){return ir.invoke("agent:install-update",{path:p})}})}catch(e){console.error("[AI]",e)}\n';
fs.writeFileSync(preloadPath, fs.readFileSync(preloadPath, 'utf8') + preloadPatch, 'utf8');
console.log('Patched preload.js');

// Patch index.html
var idxPath = path.join(TMP, 'dist', 'index.html');
var idx = fs.readFileSync(idxPath, 'utf8');
idx = idx.replace(/<meta[^>]*Content-Security-Policy[^>]*>/, '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' file:; script-src \'self\' \'unsafe-inline\' file:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: file:; connect-src *;">');
if (idx.indexOf('sidebar-agent.js') === -1) {
  idx = idx.replace('</body>', '<script src="./assets/sidebar-agent.js"></script>\n</body>');
}
if (idx.indexOf('icon.png') === -1) {
  idx = idx.replace('</title>', '</title>\n    <link rel="icon" type="image/png" href="./assets/icon.png">');
}
fs.writeFileSync(idxPath, idx, 'utf8');
console.log('Patched index.html');

// Copy sidebar-agent and agent-preload
fs.copyFileSync(path.join(PROJ, 'dist', 'assets', 'sidebar-agent.js'), path.join(TMP, 'dist', 'assets', 'sidebar-agent.js'));
fs.copyFileSync(path.join(PROJ, 'dist-electron', 'preload', 'agent-preload.js'), path.join(TMP, 'dist-electron', 'preload', 'agent-preload.js'));

// Copy icon
fs.copyFileSync(path.join(PROJ, 'resources', 'assets', 'icon.png'), path.join(TMP, 'dist', 'assets', 'icon.png'));
fs.copyFileSync(path.join(PROJ, 'resources', 'assets', 'icon.png'), path.join(TMP, 'resources', 'assets', 'icon.png'));

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

console.log('DONE - ready for electron-builder');
