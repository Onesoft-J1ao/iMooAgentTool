// iMooAgentTool - UI Patches
(function() {
  var ICON = './assets/icon.png';
  var injected = false;

  function injectAgentBtn() {
    var sidebar = document.querySelector('aside') || document.querySelector('[class*="sidebar"]') || document.querySelector('nav');
    if (!sidebar || document.getElementById('agent-sidebar-btn')) return;
    var btn = document.createElement('div');
    btn.id = 'agent-sidebar-btn';
    btn.style.cssText = 'display:flex;align-items:center;justify-content:center;padding:8px;margin:4px 8px;border-radius:8px;cursor:pointer;transition:all .15s;font-size:18px';
    btn.textContent = '\u{1F916}';
    btn.title = 'AI Assistant (Ctrl+Shift+A)';
    btn.onmouseenter = function() { btn.style.background = 'rgba(59,130,246,0.12)'; };
    btn.onmouseleave = function() { btn.style.background = 'transparent'; };
    btn.onclick = function() {
      var a = window.agentApi || {};
      if (a.openWindow) a.openWindow();
      else if (window.api && window.api.agent && window.api.agent.openWindow) window.api.agent.openWindow();
    };
    var ds = sidebar.querySelector('[class*="border-t"]') || sidebar.lastElementChild;
    if (ds && ds.parentNode === sidebar) sidebar.insertBefore(btn, ds);
    else sidebar.appendChild(btn);
  }

  function replaceTitleBarDot() {
    var dots = document.querySelectorAll('div[class*="rounded-full"]');
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i], cls = d.className || '';
      if (cls.indexOf('bg-blue-500') >= 0 && cls.indexOf('w-') >= 0 && cls.indexOf('h-') >= 0 && cls.indexOf('absolute') === -1) {
        d.style.cssText = 'width:18px;height:18px;background:transparent!important;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0';
        d.innerHTML = '<img src="' + ICON + '" style="width:16px;height:16px;border-radius:2px">';
        break;
      }
    }
  }

  function replaceSplashIcon() {
    var splash = document.querySelector('[class*="animate-\\[splash\\]"]') || document.querySelector('[class*="splash"]');
    if (splash) {
      var p = splash.parentElement;
      while (p) {
        var icons = p.querySelectorAll('div[class*="rounded-full"][class*="bg-blue"]');
        for (var i = 0; i < icons.length; i++) {
          if (icons[i] !== splash) {
            var s = window.getComputedStyle(icons[i]);
            if (parseInt(s.width) >= 40) {
              icons[i].style.cssText = 'width:64px;height:64px;background:transparent!important;display:flex;align-items:center;justify-content:center';
              icons[i].innerHTML = '<img src="' + ICON + '" style="width:48px;height:48px;border-radius:6px">';
              break;
            }
          }
        }
        p = p.parentElement;
      }
    }
  }

  function applyTheme(color) {
    if (!color) return;
    var s = document.getElementById('theme-main') || (function(){var e=document.createElement('style');e.id='theme-main';document.head.appendChild(e);return e})();
    s.textContent =
      '.bg-blue-500,.bg-blue-600,.hover\\:bg-blue-600,.hover\\:bg-blue-700{background:'+color+'!important}' +
      '.text-blue-400:not(button):not(.btn),.text-blue-300:not(button):not(.btn){color:'+color+'!important}' +
      '.border-blue-500,.border-blue-500\\/50,.hover\\:border-blue-500\\/50{border-color:'+color+'!important}' +
      '.ring-blue-500,.focus\\:ring-blue-500{--tw-ring-color:'+color+'!important}' +
      '.bg-blue-500\\/10,.bg-blue-500\\/15,.bg-blue-600\\/10{background:'+color+'1a!important}' +
      '.bg-blue-500\\/20{background:'+color+'33!important}' +
      '.from-blue-600{--tw-gradient-from:'+color+'!important}.to-blue-700{--tw-gradient-to:'+color+'!important}' +
      '.accent-blue-500{accent-color:'+color+'!important}';
  }

  function loadTheme() {
    var a = window.agentApi || {};
    if (a.getConfig) a.getConfig().then(function(cfg){if(cfg.themeColor)applyTheme(cfg.themeColor)}).catch(function(){});
  }

  function patch(retries) {
    if (retries === undefined) retries = 0;
    if (retries > 20) return;
    injectAgentBtn();
    replaceTitleBarDot();
    replaceSplashIcon();
    if (!document.querySelector('aside') && !document.querySelector('[class*="sidebar"]') && !document.querySelector('nav')) {
      setTimeout(function() { patch(retries + 1); }, 500);
    }
    if (retries < 5) {
      setTimeout(function() { replaceTitleBarDot(); replaceSplashIcon(); }, 1000);
      setTimeout(function() { replaceTitleBarDot(); replaceSplashIcon(); }, 3000);
    }
  }

  // Inject update check and theme color picker into settings page
  var injectTimer = setInterval(function() {
    if (window.location.hash !== '#/settings') return;
    
    // Update check UI (only once)
    if (!document.getElementById('update-check-ui')) {
      var headings = document.querySelectorAll('h1,h2,h3,h4');
      var aboutH = null;
      for (var i=0;i<headings.length;i++) {
        if (headings[i].textContent.indexOf('关于') >= 0) { aboutH = headings[i]; break; }
      }
      if (aboutH) {
        var card = aboutH.closest('[class*="rounded-xl"],[class*="card"]') || aboutH.parentElement;
        if (card) {
          var dv = document.createElement('div');
          dv.id = 'update-check-ui';
          dv.style.cssText = 'padding:16px;border-radius:12px;background:rgba(30,41,59,.6);border:1px solid rgba(71,85,105,.3);margin-bottom:16px';
          dv.innerHTML = '<div style="font-size:13px;font-weight:600;color:#f1f5f9;margin-bottom:8px">检查更新</div><div style="font-size:11px;color:#94a3b8;margin-bottom:10px">当前版本: v1.1.1</div><button id="update-btn" class="btn-primary" style="background:#3b82f6;color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:12px">检查更新</button><div id="update-status" style="margin-top:8px;font-size:11px;color:#94a3b8"></div>';
          card.parentNode.insertBefore(dv, card);
          document.getElementById('update-btn').onclick = function() {
            var st = document.getElementById('update-status'); st.textContent = '正在检查...';
            var a = window.agentApi || {};
            (a.checkUpdate?a.checkUpdate():Promise.resolve({})).then(function(r) {
              if (r.error) { st.textContent = '检查失败: ' + r.error; return; }
              if (r.hasUpdate) {
                st.innerHTML = '发现新版本: ' + r.latestVersion + '<br><span style="font-size:10px;color:#64748b">'+(r.releaseNotes||'').slice(0,200)+'</span><br><br>';
                var dl = document.createElement('button'); dl.style.cssText = 'background:#22c55e;color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:12px;margin-right:6px'; dl.textContent = '下载更新';
                dl.onclick = function() {
                  st.textContent = '正在下载...';
                  var asset = r.assets&&r.assets[0]||{};
                  (a.downloadUpdate?a.downloadUpdate(asset.url):Promise.resolve({})).then(function(d) {
                    if (d.error) { st.textContent = '下载失败: ' + d.error; return; }
                    st.innerHTML = '下载完成！<br><button id="run-update" style="background:#22c55e;color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:12px;margin-top:6px">立即安装</button>';
                    document.getElementById('run-update').onclick = function() {
                      (a.installUpdate?a.installUpdate(d.path):Promise.resolve({})).then(function(){st.textContent='安装程序已启动...'});
                    };
                  });
                };
                st.appendChild(dl);
              } else {
                st.innerHTML = '已是最新版本 <span style="color:#22c55e">v1.1.1</span>';
              }
            }).catch(function(e){st.textContent='检查失败: '+e.message});
          };
        }
      }
    }
    
    // Theme color picker
    if (document.getElementById('theme-picker-ui')) return;
    // Find the "关于" section - look for heading containing "关于" or "About"
    var headings = document.querySelectorAll('h1,h2,h3,h4');
    var aboutHeading = null;
    for (var i=0;i<headings.length;i++) {
      if (headings[i].textContent.indexOf('关于') >= 0) { aboutHeading = headings[i]; break; }
    }
    if (!aboutHeading) return;
    var card = aboutHeading.closest('[class*="rounded-xl"],[class*="card"]') || aboutHeading.parentElement;
    if (!card) return;
    
    var api = window.agentApi || {};
    api.getConfig().then(function(cfg) {
      if (document.getElementById('theme-picker-ui')) return;
      var div = document.createElement('div');
      div.id = 'theme-picker-ui';
      div.style.cssText = 'padding:16px;border-radius:12px;background:rgba(30,41,59,.6);border:1px solid rgba(71,85,105,.3);margin-bottom:16px';
      div.innerHTML = '<div style="font-size:13px;font-weight:600;color:#f1f5f9;margin-bottom:10px">主题颜色</div>';
      var colors = ['#3b82f6','#8b5cf6','#ec4899','#ef4444','#f59e0b','#22c55e','#14b8a6','#6366f1'];
      var html = '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px">';
      for (var j=0;j<colors.length;j++) {
        html += '<button class="tcp" data-c="'+colors[j]+'" style="width:28px;height:28px;border-radius:5px;background:'+colors[j]+';border:'+(cfg.themeColor===colors[j]?'2px solid #fff':'1px solid transparent')+';cursor:pointer"></button>';
      }
      html += '</div><div style="display:flex;gap:5px"><input id="tci" value="'+(cfg.themeColor||'')+'" placeholder="#3b82f6" style="flex:1;background:#0f172a;border:1px solid #334155;border-radius:5px;padding:5px 7px;color:#f1f5f9;font-size:12px;outline:none"><button id="tcb" style="background:'+(cfg.themeColor||'#3b82f6')+';color:#fff;border:none;border-radius:5px;padding:5px 10px;cursor:pointer;font-size:11px">应用</button></div>';
      div.innerHTML += html;
      card.parentNode.insertBefore(div, card);
      
      div.querySelectorAll('.tcp').forEach(function(b){
        b.onclick=function(){
          div.querySelectorAll('.tcp').forEach(function(x){x.style.border='1px solid transparent'});
          b.style.border='2px solid #fff';document.getElementById('tci').value=b.dataset.c;
          document.getElementById('tcb').style.background=b.dataset.c;
        };
      });
      document.getElementById('tcb').onclick=function(){
        var tc=document.getElementById('tci').value||'';
        api.setConfig({themeColor:tc});
        if(tc)applyTheme(tc);
      };
    }).catch(function(){});
  }, 1500);

  var style = document.createElement('style');
  style.textContent = '/* icon-patches */';
  document.head.appendChild(style);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ patch(); loadTheme(); });
  else { patch(); loadTheme(); }
})();
