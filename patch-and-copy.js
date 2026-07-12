const fs = require('fs');
const path = require('path');
const TMP = 'C:\\Users\\Administrator\\AppData\\Local\\Temp\\asar-fresh';
const PROJ = 'D:\\Users\\Administrator\\Desktop\\XTCAgent_local\\iMooDesktop';

// Patch main.js
var main = path.join(TMP, 'dist-electron', 'main', 'main.js');
var mc = fs.readFileSync(main, 'utf8');
var addon = `
(function(){var M=require("electron").ipcMain;
M.handle("agent:search",async function(e,q){try{var c=JSON.parse(require("fs").readFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),"utf8"));if(c.enabled&&c.apiUrl&&c.apiKey){var url=c.apiUrl.replace(/\\/+$/,"");if(!url.includes("/chat/completions")){url+=(url.endsWith("/v1")?"/chat/completions":"/v1/chat/completions")}var r=await fetch(url,{method:"POST",headers:{"Authorization":"Bearer "+c.apiKey,"Content-Type":"application/json"},body:JSON.stringify({model:c.model||"gpt-4o-mini",messages:[{role:"system",content:"You are a feature finder for iMooDesktop. Available features: / = Home, /reboot = Reboot, /cloud = Cloud, /root = Root, /files = Files, /apps = Apps, /tools = Tools, /magisk = Magisk, /backup = Backup, /edl-partitions = EDL Partitions, /settings = Settings, /logs = Logs. Respond with JSON array [{path,name,description,confidence,explanation}]. If no match return []."},{role:"user",content:q}],temperature:0.3,max_tokens:500})});if(!r.ok)throw new Error("HTTP "+r.status);var d=await r.json();var ct=(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||"[]";var p=JSON.parse(ct);return{matches:(Array.isArray(p)?p:[]).slice(0,3).map(function(m){return{path:m.path||"",name:m.name||"",description:m.description||"",confidence:typeof m.confidence==="number"?Math.min(100,Math.max(0,m.confidence)):50,explanation:m.explanation||""}}),aiPowered:true}}catch(e){}return{matches:[],aiPowered:false}});
M.handle("agent:chat",async function(e,a){var c=JSON.parse(require("fs").readFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),"utf8"));var url=c.apiUrl.replace(/\\/+$/,"");if(!url.includes("/chat/completions")){url+=(url.endsWith("/v1")?"/chat/completions":"/v1/chat/completions")}var r=await fetch(url,{method:"POST",headers:{"Authorization":"Bearer "+c.apiKey,"Content-Type":"application/json"},body:JSON.stringify({model:c.model||"gpt-4o-mini",messages:[{role:"system",content:"You are a helpful assistant for iMooDesktop smartwatch toolbox. Reply in Chinese."}].concat(a.messages||[]),temperature:0.7,max_tokens:1000})});if(!r.ok)throw new Error("HTTP "+r.status);var d=await r.json();return{reply:(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||""}});
M.handle("agent:get-config",function(){try{var c=JSON.parse(require("fs").readFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),"utf8"));return{apiUrl:c.apiUrl||"",apiKey:c.apiKey?c.apiKey.slice(0,4)+"****"+c.apiKey.slice(-4):"",model:c.model||"gpt-4o-mini",enabled:!!c.enabled}}catch(e){return{apiUrl:"",apiKey:"",model:"gpt-4o-mini",enabled:false}}});
M.handle("agent:set-config",function(e,p){var c={};try{c=JSON.parse(require("fs").readFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),"utf8"))}catch(e){}if(p.apiUrl!==undefined)c.apiUrl=p.apiUrl;if(p.apiKey!==undefined)c.apiKey=p.apiKey;if(p.model!==undefined)c.model=p.model;if(p.enabled!==undefined)c.enabled=p.enabled;require("fs").writeFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),JSON.stringify(c,null,2));return{apiUrl:c.apiUrl||"",apiKey:c.apiKey?c.apiKey.slice(0,4)+"****"+c.apiKey.slice(-4):"",model:c.model||"gpt-4o-mini",enabled:!!c.enabled}});
M.handle("agent:test-connection",async function(e,a){try{var c={};try{c=JSON.parse(require("fs").readFileSync(require("path").join(require("electron").app.getPath("userData"),"imooagent-config.json"),"utf8"))}catch(e){}var url=(a.apiUrl||c.apiUrl||"").replace(/\\/+$/,"");if(!url.includes("/chat/completions")){url+=(url.endsWith("/v1")?"/chat/completions":"/v1/chat/completions")}var r=await fetch(url,{method:"POST",headers:{"Authorization":"Bearer "+(a.apiKey||c.apiKey||""),"Content-Type":"application/json"},body:JSON.stringify({model:a.model||c.model||"gpt-4o-mini",messages:[{role:"user",content:"Hi"}],max_tokens:10})});if(!r.ok){var t=await r.text();return{success:false,message:"HTTP "+r.status+": "+t.slice(0,200)}}return{success:true,message:"Connection OK"}}catch(e){return{success:false,message:e.message}}});
console.log("[AI Agent] IPC registered");
})();
`;
mc += addon;
fs.writeFileSync(main, mc, 'utf8');
console.log('Patched main.js');

// Patch preload.js
var pre = path.join(TMP, 'dist-electron', 'preload', 'preload.js');
var pc = fs.readFileSync(pre, 'utf8');
pc += '\ntry{var e=require("electron"),cb=e.contextBridge,ir=e.ipcRenderer;cb.exposeInMainWorld("agentApi",{search:function(q){return ir.invoke("agent:search",q)},chat:function(m){return ir.invoke("agent:chat",{messages:m})},getConfig:function(){return ir.invoke("agent:get-config")},setConfig:function(p){return ir.invoke("agent:set-config",p)},testConnection:function(a,k,m){return ir.invoke("agent:test-connection",{apiUrl:a,apiKey:k,model:m})}})}catch(e){console.error("[AI]",e)}\n';
fs.writeFileSync(pre, pc, 'utf8');
console.log('Patched preload.js');

// Patch index.html
var idxPath = path.join(TMP, 'dist', 'index.html');
var idx = fs.readFileSync(idxPath, 'utf8');
idx = idx.replace(/<meta[^>]*Content-Security-Policy[^>]*>/, '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' file:; script-src \'self\' \'unsafe-inline\' file:; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: file:; connect-src *;">');
idx = idx.replace('</body>', '<script src="./assets/agent-widget.js"></script>\n</body>');
fs.writeFileSync(idxPath, idx, 'utf8');
console.log('Patched index.html');

// Copy widget
var widgetSrc = path.join(PROJ, 'agent-widget.min.js');
var widgetDst = path.join(TMP, 'dist', 'assets', 'agent-widget.js');
fs.copyFileSync(widgetSrc, widgetDst);
console.log('Copied widget');

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

// Copy runtime deps from original asar node_modules
var nmSrc = path.join(TMP, 'node_modules');
var nmDst = path.join(PROJ, 'node_modules');
// Don't delete, just merge what's missing
var needed = ['electron-log', 'electron-store', 'iconv-lite', 'lucide-react', 'react', 'react-dom', 'react-router-dom', 'zustand', '@tanstack', 'string-argv', 'semver', 'conf', 'dot-prop', 'env-paths', 'atomically', 'type-fest', 'json-schema-typed', 'debounce-fn', 'p-try', 'onetime', 'mimic-fn', 'pkg-up', 'find-up', 'locate-path', 'path-exists', 'usb', 'safer-buffer', 'js-tokens', 'loose-envify', 'scheduler'];
needed.forEach(function(pkgName) {
  var srcPkg = path.join(nmSrc, pkgName);
  var dstPkg = path.join(nmDst, pkgName);
  if (fs.existsSync(srcPkg) && !fs.existsSync(dstPkg)) {
    (function cp(s, d) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.readdirSync(s, { withFileTypes: true }).forEach(function(e) {
        var sp = path.join(s, e.name), dp = path.join(d, e.name);
        if (e.isDirectory()) cp(sp, dp);
        else fs.copyFileSync(sp, dp);
      });
    })(srcPkg, dstPkg);
    console.log('Added ' + pkgName);
  }
});

console.log('ALL DONE');
