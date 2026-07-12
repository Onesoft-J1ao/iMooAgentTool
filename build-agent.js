const fs = require('fs');
const path = require('path');
const ASAR = require(path.join(__dirname, 'node_modules', '@electron', 'asar', 'lib', 'asar.js'));
const TMP = path.join(__dirname, 'tmp-asar-extract');
const SRC_ASAR = 'D:\\iMooDesktop\\resources\\app.asar';
const BUILD = __dirname;

console.log('Extracting original asar...');
if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
ASAR.extractAll(SRC_ASAR, TMP);

const agentAddon = `
(function() {
  var FS=require('fs'),PATH=require('path'),EL=require('electron');
  var SP=PATH.join(EL.app.getPath('userData'),'imooagent-config.json');
  function LC(){try{if(FS.existsSync(SP))return JSON.parse(FS.readFileSync(SP,'utf8'))}catch{}return{apiUrl:'',apiKey:'',model:'gpt-4o-mini',enabled:false}}
  function SC(c){try{FS.writeFileSync(SP,JSON.stringify(c,null,2))}catch{}}
  function MK(k){if(!k)return'';return k.length<=8?k.slice(0,2)+'****'+k.slice(-2):k.slice(0,4)+'****'+k.slice(-4)}
  function BU(b){var u=(b||'').replace(/\\/+$/,'');if(!u.includes('/chat/completions')){if(u.endsWith('/v1'))u+='/chat/completions';else u+='/v1/chat/completions'}return u}
  var FE=[{path:'/',name:'主页',kws:['home','main','设备','状态','主页'],desc:'设备信息与快速操作'},{path:'/reboot',name:'重启模式',kws:['reboot','重启','bootloader','recovery','edl'],desc:'9种重启模式'},{path:'/cloud',name:'云资源',kws:['cloud','云','资源','下载'],desc:'云端资源管理'},{path:'/root',name:'Root工具',kws:['root','破解','权限','刷机'],desc:'完整Root工作流'},{path:'/files',name:'文件管理',kws:['file','文件','adb','push','pull','上传','下载'],desc:'ADB文件管理'},{path:'/apps',name:'应用管理',kws:['app','应用','apk','安装','卸载','z10'],desc:'手表应用管理'},{path:'/tools',name:'工具箱',kws:['tools','工具','充电','wifi','ota','驱动'],desc:'实用工具合集'},{path:'/magisk',name:'Magisk',kws:['magisk','面具','模块'],desc:'Magisk模块管理'},{path:'/backup',name:'备份恢复',kws:['backup','备份','恢复','dcim','twrp'],desc:'多种备份恢复方案'},{path:'/edl-partitions',name:'EDL分区',kws:['edl','分区','gpt','9008'],desc:'EDL分区管理'},{path:'/settings',name:'设置',kws:['settings','设置','配置'],desc:'应用设置'},{path:'/logs',name:'日志',kws:['log','日志','调试'],desc:'实时日志'}];
  function KS(q){var Q=q.toLowerCase().trim();if(!Q)return{matches:[],aiPowered:false};var S=FE.map(function(f){var s=0;for(var i=0;i<f.kws.length;i++){if(Q.indexOf(f.kws[i])>=0)s+=10}if(Q.indexOf(f.name.toLowerCase())>=0)s+=15;return{feat:f,score:s}}).filter(function(x){return x.score>0}).sort(function(a,b){return b.score-a.score});return{matches:S.slice(0,3).map(function(x){return{path:x.feat.path,name:x.feat.name,description:x.feat.desc,confidence:Math.min(100,Math.round(x.score/25*100)),explanation:x.feat.desc}}),aiPowered:false}}
  var ipc=EL.ipcMain;
  ipc.handle('agent:search',async function(_e,q){var c=LC();if(c.enabled&&c.apiUrl&&c.apiKey){try{var L=FE.map(function(f){return'- '+f.path+': '+f.name+' - '+f.desc}).join('\\\\n');var r=await fetch(BU(c.apiUrl),{method:'POST',headers:{'Authorization':'Bearer '+c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:c.model,messages:[{role:'system',content:'You are a feature finder. Available features:\\n'+L+'\\nRespond with JSON array [{path,name,description,confidence,explanation}]. If no match return [].'},{role:'user',content:q}],temperature:0.3,max_tokens:500})});if(!r.ok)throw new Error('API '+r.status);var d=await r.json();var ct=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||'[]';var p=JSON.parse(ct);return{matches:(Array.isArray(p)?p:[]).slice(0,3).map(function(m){return{path:m.path||'',name:m.name||'',description:m.description||'',confidence:typeof m.confidence==='number'?Math.min(100,Math.max(0,m.confidence)):50,explanation:m.explanation||''}}),aiPowered:true}}catch(e){}}return KS(q)});
  ipc.handle('agent:chat',async function(_e,a){var c=LC();if(!c.apiUrl||!c.apiKey)throw new Error('AI未配置');var r=await fetch(BU(c.apiUrl),{method:'POST',headers:{'Authorization':'Bearer '+c.apiKey,'Content-Type':'application/json'},body:JSON.stringify({model:c.model,messages:[{role:'system',content:'你是一个智能助手,帮助用户使用iMooDesktop智能手表工具箱。请用中文回复。'}].concat(a.messages||[]),temperature:0.7,max_tokens:1000})});if(!r.ok)throw new Error('API '+r.status);var d=await r.json();return{reply:(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||''}});
  ipc.handle('agent:get-config',function(){var c=LC();return{apiUrl:c.apiUrl,apiKey:MK(c.apiKey),model:c.model,enabled:c.enabled}});
  ipc.handle('agent:set-config',function(_e,p){var c=LC();if(p.apiUrl!==undefined)c.apiUrl=p.apiUrl;if(p.apiKey!==undefined)c.apiKey=p.apiKey;if(p.model!==undefined)c.model=p.model;if(p.enabled!==undefined)c.enabled=p.enabled;SC(c);return{apiUrl:c.apiUrl,apiKey:MK(c.apiKey),model:c.model,enabled:c.enabled}});
  ipc.handle('agent:test-connection',async function(_e,a){try{var c=LC();var r=await fetch(BU(a.apiUrl||c.apiUrl),{method:'POST',headers:{'Authorization':'Bearer '+(a.apiKey||c.apiKey),'Content-Type':'application/json'},body:JSON.stringify({model:a.model||c.model||'gpt-4o-mini',messages:[{role:'user',content:'Hi'}],max_tokens:10})});if(!r.ok){var t=await r.text();return{success:false,message:'HTTP '+r.status+': '+t.slice(0,200)}}return{success:true,message:'连接成功'}}catch(e){return{success:false,message:e.message}}});
  console.log('[iMooAgent] IPC registered');
})();
`;

// Patch main.js
var mainPath = path.join(TMP, 'dist-electron', 'main', 'main.js');
var mainContent = fs.readFileSync(mainPath, 'utf8');
mainContent += agentAddon;
fs.writeFileSync(mainPath, mainContent, 'utf8');
console.log('Patched main.js');

// Patch preload.js
var preloadPath = path.join(TMP, 'dist-electron', 'preload', 'preload.js');
var preloadContent = fs.readFileSync(preloadPath, 'utf8');
preloadContent += '\ntry{const{contextBridge,ipcRenderer}=require("electron");contextBridge.exposeInMainWorld("agentApi",{search:q=>ipcRenderer.invoke("agent:search",q),chat:m=>ipcRenderer.invoke("agent:chat",{messages:m}),getConfig:()=>ipcRenderer.invoke("agent:get-config"),setConfig:p=>ipcRenderer.invoke("agent:set-config",p),testConnection:(a,k,m)=>ipcRenderer.invoke("agent:test-connection",{apiUrl:a,apiKey:k,model:m})})}catch(e){console.error("[iMooAgent]",e)}';
fs.writeFileSync(preloadPath, preloadContent, 'utf8');
console.log('Patched preload.js');

// Create agent widget
var agentWidget = fs.readFileSync(path.join(__dirname, 'agent-widget.min.js'), 'utf8');

var widgetPath = path.join(TMP, 'dist', 'assets', 'agent-widget.js');
fs.writeFileSync(widgetPath, agentWidget, 'utf8');
console.log('Created agent widget');

// Patch index.html CSP and add widget
var indexPath = path.join(TMP, 'dist', 'index.html');
var indexContent = fs.readFileSync(indexPath, 'utf8');
indexContent = indexContent.replace(
  /<meta[^>]*Content-Security-Policy[^>]*>/,
  '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' file:; script-src \'self\' \'unsafe-inline\' file:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: file:; connect-src *;">'
);
indexContent = indexContent.replace('</body>', '<script src="./assets/agent-widget.js"></script>\n</body>');
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Patched index.html');

// Copy to build project
['dist', 'dist-electron'].forEach(function(dir) {
  var src = path.join(TMP, dir);
  var dst = path.join(BUILD, dir);
  if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
  function copyDir(s, d) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
      var sp = path.join(s, e.name), dp = path.join(d, e.name);
      if (e.isDirectory()) copyDir(sp, dp);
      else fs.copyFileSync(sp, dp);
    });
  }
  copyDir(src, dst);
  console.log('Copied ' + dir);
});

// Copy node_modules
var nmSrc = path.join(TMP, 'node_modules');
var nmDst = path.join(BUILD, 'node_modules');
if (fs.existsSync(nmDst)) fs.rmSync(nmDst, { recursive: true, force: true });
(function copyDir(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
    var sp = path.join(s, e.name), dp = path.join(d, e.name);
    if (e.isDirectory()) copyDir(sp, dp);
    else fs.copyFileSync(sp, dp);
  });
})(nmSrc, nmDst);
console.log('Copied node_modules');

// Ensure resources exist (merge, don't delete if locked)
var resDst = path.join(BUILD, 'resources');
if (!fs.existsSync(resDst)) fs.mkdirSync(resDst, { recursive: true });
(function copyDir(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
    var sp = path.join(s, e.name), dp = path.join(d, e.name);
    if (e.isDirectory()) copyDir(sp, dp);
    else if (!fs.existsSync(dp)) fs.copyFileSync(sp, dp);
  });
})(path.join(TMP, 'resources'), resDst);
console.log('Merged resources');

// Verify
var check = fs.readFileSync(path.join(BUILD, 'dist-electron', 'main', 'main.js'), 'utf8');
if (check.indexOf('agent:search') >= 0 && check.indexOf('electron-log') >= 0) {
  console.log('VERIFIED: Both agent IPC and electron-log present');
} else {
  console.log('WARNING: Verification failed!');
  process.exit(1);
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log('Build ready');
