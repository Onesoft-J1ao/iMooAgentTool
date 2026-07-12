// Agent addon code - loaded by build-clean.js
(function() {
  var electron = require("electron");
  var fs = require("fs");
  var path = require("path");
  var ipcMain = electron.ipcMain;
  var userDataPath = electron.app.getPath("userData");
  var configPath = path.join(userDataPath, "imooagent-config.json");

  function loadConfig() {
    try { if (fs.existsSync(configPath)) return JSON.parse(fs.readFileSync(configPath, "utf8")); } catch (e) {}
    return { apiUrl: "", apiKey: "", model: "gpt-4o-mini", enabled: false };
  }
  function saveConfig(c) { try { fs.writeFileSync(configPath, JSON.stringify(c, null, 2)); } catch (e) {} }
  function maskKey(k) { if (!k) return ""; return k.length <= 8 ? k.slice(0,2)+"****"+k.slice(-2) : k.slice(0,4)+"****"+k.slice(-4); }
  function buildUrl(b) { var u = (b||"").replace(/\/+$/, ""); if (u.indexOf("/chat/completions") === -1) { u += u.endsWith("/v1") ? "/chat/completions" : "/v1/chat/completions"; } return u; }

  ipcMain.handle("agent:get-config", function() {
    var c = loadConfig();
    return { apiUrl: c.apiUrl||"", apiKey: maskKey(c.apiKey), model: c.model||"gpt-4o-mini", enabled: !!c.enabled, themeColor: c.themeColor||"" };
  });
  ipcMain.handle("agent:set-config", function(e, p) {
    var c = loadConfig();
    if (p.apiUrl !== undefined) c.apiUrl = p.apiUrl;
    if (p.apiKey !== undefined) c.apiKey = p.apiKey;
    if (p.model !== undefined) c.model = p.model;
    if (p.enabled !== undefined) c.enabled = p.enabled;
    if (p.themeColor !== undefined) c.themeColor = p.themeColor;
    saveConfig(c);
    return { apiUrl: c.apiUrl||"", apiKey: maskKey(c.apiKey), model: c.model||"gpt-4o-mini", enabled: !!c.enabled, themeColor: c.themeColor||"" };
  });
  ipcMain.handle("agent:test-connection", async function(e, a) {
    try {
      var c = loadConfig();
      var url = buildUrl((a&&a.apiUrl)||c.apiUrl||"");
      var key = (a&&a.apiKey)||c.apiKey||"";
      var mdl = (a&&a.model)||c.model||"gpt-4o-mini";
      var r = await fetch(url, { method:"POST", headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"}, body:JSON.stringify({model:mdl,messages:[{role:"user",content:"Hi"}],max_tokens:10}) });
      if (!r.ok) { var t=await r.text(); return {success:false,message:"HTTP "+r.status+": "+t.slice(0,200)}; }
      return {success:true,message:"Connection OK"};
    } catch(e) { return {success:false,message:e.message}; }
  });

  var FEATURES = [
    { path:"/", kws:["home","main","dashboard","homepage","device","status"], desc:"Device status dashboard" },
    { path:"/reboot", kws:["reboot","restart","bootloader","recovery","edl","fastboot","9008","rec","shutdown"], desc:"9 reboot modes: bootloader, recovery, EDL" },
    { path:"/cloud", kws:["cloud","resource","download","firmware","link","update"], desc:"Cloud resource management" },
    { path:"/root", kws:["root","unlock","permission","magisk","supersu","sdk19","sdk25","sdk27","privilege"], desc:"Complete root workflow SDK19/25/27" },
    { path:"/files", kws:["file","folder","directory","adb","push","pull","upload","download","copy","delete","sdcard","manager"], desc:"ADB file manager" },
    { path:"/apps", kws:["app","apk","install","uninstall","z10","unlock","autostart","qq","wechat","package","software"], desc:"App management: install/uninstall APK" },
    { path:"/tools", kws:["tools","charge","wifi","wireless","ota","upgrade","driver","atbmod","build.prop","properties","rootpro","usb"], desc:"Utility tools: charge, WiFi ADB, OTA" },
    { path:"/magisk", kws:["magisk","module","zygisk","lsposed","framework","plugin","mask"], desc:"Magisk module management" },
    { path:"/backup", kws:["backup","restore","recover","dcim","photo","data","twrp","xposed","partition","export","import"], desc:"Backup: DCIM, ADB-dd, EDL, TWRP" },
    { path:"/edl-partitions", kws:["edl","partition","gpt","loader","flash","erase","verify","edl-ng"], desc:"EDL partition manager" },
    { path:"/settings", kws:["settings","config","option","transparency","theme","language","preference"], desc:"App settings" },
    { path:"/logs", kws:["log","logs","debug","output","console","logging","logcat"], desc:"Real-time log viewer" }
  ];

  function keywordSearch(query) {
    var q = (query||"").toLowerCase().trim();
    if (!q) return {matches:[], aiPowered:false};
    var results = [];
    for (var i=0;i<FEATURES.length;i++) {
      var f = FEATURES[i], score = 0;
      for (var k=0;k<f.kws.length;k++) {
        var kw = f.kws[k].toLowerCase();
        if (q === kw) score += 30;
        else if (q.indexOf(kw) >= 0) score += 15;
        else if (kw.indexOf(q) >= 0 && q.length >= 2) score += 8;
      }
      if (score > 0) results.push({feat:f, score:Math.min(score,99)});
    }
    results.sort(function(a,b){return b.score-a.score});
    return {matches:results.slice(0,3).map(function(r){return{path:r.feat.path,name:r.feat.kws[0],description:r.feat.desc,confidence:r.score,explanation:r.feat.desc}}), aiPowered:false};
  }

  ipcMain.handle("agent:search", async function(event, query) {
    var cfg = loadConfig();
    if (cfg.enabled && cfg.apiUrl && cfg.apiKey) {
      try {
        var url = buildUrl(cfg.apiUrl);
        var fl = "";
        for (var i=0;i<FEATURES.length;i++) fl += "- "+FEATURES[i].path+": "+FEATURES[i].desc+"\\n";
        var r = await fetch(url, {
          method:"POST", headers:{"Authorization":"Bearer "+cfg.apiKey,"Content-Type":"application/json"},
          body:JSON.stringify({model:cfg.model,messages:[{role:"system",content:"You are a feature finder. Available features: "+fl+"Respond with JSON array [{path,name,description,confidence(0-100),explanation}]. No markdown."},{role:"user",content:query}],temperature:0.3,max_tokens:500})
        });
        if (r.ok) {
          var d = await r.json();
          var raw = (d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||"[]";
          var p = JSON.parse(raw);
          if (Array.isArray(p)) return {matches:p.slice(0,3).map(function(m){return{path:m.path||"",name:m.name||"",description:m.description||"",confidence:typeof m.confidence==="number"?Math.min(100,Math.max(0,m.confidence)):50,explanation:m.explanation||""}}), aiPowered:true};
        }
      } catch(e) {}
    }
    return keywordSearch(query);
  });

  ipcMain.handle("agent:chat", async function(event, args) {
    var cfg = loadConfig();
    if (!cfg.apiUrl || !cfg.apiKey) return {reply:"AI not configured. Configure AI Agent in settings."};
    var url = buildUrl(cfg.apiUrl);
    var msgs = (args&&args.messages)||[];
    var r = await fetch(url, {
      method:"POST", headers:{"Authorization":"Bearer "+cfg.apiKey,"Content-Type":"application/json"},
      body:JSON.stringify({model:cfg.model||"gpt-4o-mini",messages:[{role:"system",content:"You are a helpful assistant for iMooAgentTool smartwatch toolbox. Be concise."}].concat(msgs),temperature:0.7,max_tokens:1000})
    });
    if (!r.ok) { var t=await r.text(); throw new Error("HTTP "+r.status+": "+t.slice(0,200)); }
    var d = await r.json();
    return {reply:(d.choices&&d.choices[0]&&d.choices[0].message&&d.choices[0].message.content)||""};
  });

  // Agent window
  var agentWin = null;
  try {
    var gl = require("electron").globalShortcut;
    gl.register("CmdOrCtrl+Shift+A", function() {
      if (agentWin && !agentWin.isDestroyed()) { agentWin.focus(); return; }
      var BW = require("electron").BrowserWindow;
      agentWin = new BW({width:380,height:560,show:false,frame:false,resizable:false,alwaysOnTop:true,skipTaskbar:true,webPreferences:{preload:path.join(__dirname,"..","preload","agent-preload.js"),contextIsolation:true,sandbox:false}});
      agentWin.loadFile(path.join(__dirname,"..","..","dist","agent.html"));
      agentWin.once("ready-to-show",function(){agentWin.show()});
      agentWin.on("closed",function(){agentWin=null});
    });
  } catch(e) {}

  ipcMain.handle("agent:open-window", function() {
    if (agentWin && !agentWin.isDestroyed()) { agentWin.focus(); return; }
    var BW = require("electron").BrowserWindow;
    agentWin = new BW({width:380,height:560,show:false,frame:false,resizable:false,alwaysOnTop:true,skipTaskbar:true,webPreferences:{preload:path.join(__dirname,"..","preload","agent-preload.js"),contextIsolation:true,sandbox:false}});
    agentWin.loadFile(path.join(__dirname,"..","..","dist","agent.html"));
    agentWin.once("ready-to-show",function(){agentWin.show()});
    agentWin.on("closed",function(){agentWin=null});
  });
  ipcMain.handle("agent:minimize", function() { if (agentWin&&!agentWin.isDestroyed()) agentWin.minimize(); });

  // Set app icon on all windows
  try {
    var nativeImage = require("electron").nativeImage;
    var img = nativeImage.createFromPath(path.join(require("electron").app.getAppPath(),"dist","assets","icon.png"));
    require("electron").BrowserWindow.getAllWindows().forEach(function(w) { if (!w.isDestroyed()) try { w.setIcon(img); } catch(e) {} });
  } catch(e) {}

  // Check for updates from GitHub Releases
  ipcMain.handle("agent:check-update", async function() {
    try {
      var repo = "Onesoft-J1ao/iMooAgentTool";
      var url = "https://api.github.com/repos/" + repo + "/releases/latest";
      var res = await fetch(url, { headers: { "Accept": "application/vnd.github.v3+json", "User-Agent": "iMooAgentTool" } });
      if (!res.ok) return { error: "HTTP " + res.status };
      var data = await res.json();
      var tag = data.tag_name || "";
      var current = "v1.1.1";
      var hasUpdate = tag.toLowerCase() !== current.toLowerCase();
      return {
        hasUpdate: hasUpdate,
        currentVersion: current,
        latestVersion: tag,
        releaseUrl: data.html_url || "",
        releaseNotes: (data.body || "").slice(0, 500),
        downloadUrl: null,
        assets: (data.assets || []).map(function(a) { return { name: a.name, url: a.browser_download_url, size: a.size }; })
      };
    } catch(e) { return { error: e.message }; }
  });

  ipcMain.handle("agent:download-update", async function(event, args) {
    try {
      var url = args && args.url;
      if (!url) return { error: "No URL" };
      var dest = path.join(require("electron").app.getPath("temp"), "iMooAgentTool-update.exe");
      var res = await fetch(url);
      if (!res.ok) return { error: "Download failed: HTTP " + res.status };
      var buf = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buf));
      return { success: true, path: dest };
    } catch(e) { return { error: e.message }; }
  });

  ipcMain.handle("agent:install-update", async function(event, args) {
    try {
      var exePath = args && args.path;
      if (!exePath || !fs.existsSync(exePath)) return { error: "File not found" };
      require("child_process").execFile(exePath, ["/S", "/D=" + path.dirname(require("electron").app.getPath("exe"))]);
      return { success: true };
    } catch(e) { return { error: e.message }; }
  });

  console.log("[iMooAgent] IPC registered");
})();
