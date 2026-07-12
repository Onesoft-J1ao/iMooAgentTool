"use strict";
const electron = require("electron");
const api = {
  device: {
    current: () => electron.ipcRenderer.invoke("device:current"),
    wait: (types, timeout) => electron.ipcRenderer.invoke("device:wait", { types, timeout }),
    onChange: (cb) => {
      const handler = (_, info) => cb(info);
      electron.ipcRenderer.on("device:change", handler);
      return () => electron.ipcRenderer.removeListener("device:change", handler);
    }
  },
  reboot: {
    execute: (opts) => electron.ipcRenderer.invoke("reboot:execute", opts)
  },
  cloud: {
    list: () => electron.ipcRenderer.invoke("cloud:list"),
    listByCategory: () => electron.ipcRenderer.invoke("cloud:list-by-category"),
    download: (name) => electron.ipcRenderer.invoke("cloud:download", { name }),
    checkUpdates: () => electron.ipcRenderer.invoke("cloud:check-updates"),
    onProgress: (cb) => {
      const handler = (_, data) => cb(data);
      electron.ipcRenderer.on("cloud:progress", handler);
      return () => electron.ipcRenderer.removeListener("cloud:progress", handler);
    }
  },
  scrcpy: {
    launch: (opts) => electron.ipcRenderer.invoke("scrcpy:launch", opts),
    stop: (pid) => electron.ipcRenderer.invoke("scrcpy:stop", { pid }),
    stopAll: () => electron.ipcRenderer.invoke("scrcpy:stop-all"),
    list: () => electron.ipcRenderer.invoke("scrcpy:list"),
    // 订阅进程变化事件(launch/exit),替代轮询
    subscribe: () => electron.ipcRenderer.invoke("scrcpy:subscribe"),
    onProcessChange: (cb) => {
      const handler = (_, data) => cb(data);
      electron.ipcRenderer.on("scrcpy:process-change", handler);
      return () => electron.ipcRenderer.removeListener("scrcpy:process-change", handler);
    }
  },
  app: {
    list: (thirdParty) => electron.ipcRenderer.invoke("app:list", { thirdParty }),
    install: (apk, method) => electron.ipcRenderer.invoke("app:install", { apk, method }),
    uninstall: (pkg) => electron.ipcRenderer.invoke("app:uninstall", { pkg }),
    // Z10 解除安装限制(对应 z10openinst.bat)
    unlockZ10: () => electron.ipcRenderer.invoke("app:unlock-z10"),
    // QQ/微信开机自启(对应 qqwxautestart.bat)
    enableAutoStart: (packages) => electron.ipcRenderer.invoke("app:enable-autostart", { packages })
  },
  tools: {
    openCharge: () => electron.ipcRenderer.invoke("tools:open-charge"),
    readBuildProps: () => electron.ipcRenderer.invoke("tools:read-build-props"),
    wifiEnable: () => electron.ipcRenderer.invoke("tools:wifi-enable"),
    wifiConnect: (ip, port) => electron.ipcRenderer.invoke("tools:wifi-connect", { ip, port }),
    wifiDisconnect: (ip, port) => electron.ipcRenderer.invoke("tools:wifi-disconnect", { ip, port }),
    // 离线 OTA 升级(对应 ota.bat)
    otaStart: (zipPath) => electron.ipcRenderer.invoke("tools:ota-start", { zipPath }),
    // Android 8.1 Root 后优化(对应 rootpro.bat,SDK27 专属)
    rootpro: (options) => electron.ipcRenderer.invoke("tools:rootpro", options),
    // 驱动检测(对应 checkdriver.bat)
    checkDrivers: () => electron.ipcRenderer.invoke("tools:check-drivers"),
    installDrivers: () => electron.ipcRenderer.invoke("tools:install-drivers"),
    // .atbmod 模块(对应 Loadatbmod.bat)
    atbmodScan: () => electron.ipcRenderer.invoke("tools:atbmod-scan"),
    atbmodInstall: (file) => electron.ipcRenderer.invoke("tools:atbmod-install", { file }),
    atbmodList: () => electron.ipcRenderer.invoke("tools:atbmod-list"),
    atbmodUninstall: (modid) => electron.ipcRenderer.invoke("tools:atbmod-uninstall", { modid }),
    // 检查应用更新
    checkAppUpdate: () => electron.ipcRenderer.invoke("tools:check-app-update")
  },
  // ========== magisk:* 通道(对应原 userinstmodule/instmodule/unmodule/magisklist) ==========
  magisk: {
    list: () => electron.ipcRenderer.invoke("magisk:list"),
    install: (zip, method) => electron.ipcRenderer.invoke("magisk:install", { zip, method }),
    uninstall: (id, method) => electron.ipcRenderer.invoke("magisk:uninstall", { id, method }),
    enable: (id) => electron.ipcRenderer.invoke("magisk:enable", { id }),
    disable: (id) => electron.ipcRenderer.invoke("magisk:disable", { id }),
    // 模块商店
    storeSearch: (query) => electron.ipcRenderer.invoke("magisk:store-search", { query }),
    storeInstall: (module) => electron.ipcRenderer.invoke("magisk:store-install", { module })
  },
  // ========== backup:* 通道(对应原 backup/super_recovery/pashtwrp/pashtwrppro/Xposed) ==========
  backup: {
    // DCIM 备份/恢复
    dcimBackup: (outputDir) => electron.ipcRenderer.invoke("backup:dcim-backup", { outputDir }),
    dcimRecover: (inputDir) => electron.ipcRenderer.invoke("backup:dcim-recover", { inputDir }),
    // ADB-dd 备份/恢复(分两步:prepare 返回匹配列表,execute 用户确认后调用)
    adbddBackup: (outputDir) => electron.ipcRenderer.invoke("backup:adbdd-backup", { outputDir }),
    adbddPrepare: (zipPath) => electron.ipcRenderer.invoke("backup:adbdd-prepare", { zipPath }),
    adbddExecute: (extractDir, parts) => electron.ipcRenderer.invoke("backup:adbdd-execute", { extractDir, parts }),
    adbddRecover: (zipPath) => electron.ipcRenderer.invoke("backup:adbdd-recover", { zipPath }),
    // 9008 备份/恢复
    edlBackup: (opts) => electron.ipcRenderer.invoke("backup:edl-backup", opts),
    edlRecover: (zipPath) => electron.ipcRenderer.invoke("backup:edl-recover", { zipPath }),
    // 超级恢复
    superRecovery: (folder) => electron.ipcRenderer.invoke("backup:super-recovery", { folder }),
    // TWRP 刷入(EDL 模式)
    flashTwrp: (innermodel) => electron.ipcRenderer.invoke("backup:flash-twrp", { innermodel }),
    // 开机自刷 TWRP(ADB 模式)
    autoFlashTwrp: (innermodel) => electron.ipcRenderer.invoke("backup:auto-flash-twrp", { innermodel }),
    // Xposed 安装
    xposedInstall: () => electron.ipcRenderer.invoke("backup:xposed-install"),
    // 进度事件订阅
    onProgress: (cb) => {
      const handler = (_, data) => cb(data);
      electron.ipcRenderer.on("backup:progress", handler);
      return () => electron.ipcRenderer.removeListener("backup:progress", handler);
    }
  },
  system: {
    getSettings: () => electron.ipcRenderer.invoke("system:get-settings"),
    setSettings: (settings) => electron.ipcRenderer.invoke("system:set-settings", { settings }),
    pickFile: (opts) => electron.ipcRenderer.invoke("system:pick-file", opts),
    openExternal: (path) => electron.ipcRenderer.invoke("system:open-external", { path }),
    showInFolder: (path) => electron.ipcRenderer.invoke("system:show-in-folder", { path }),
    verifyResources: () => electron.ipcRenderer.invoke("system:verify-resources"),
    getVersion: () => electron.ipcRenderer.invoke("system:get-version"),
    setWindowOpacity: (opacity) => electron.ipcRenderer.invoke("system:set-window-opacity", { opacity }),
    // 窗口控制(自定义标题栏)
    windowMinimize: () => electron.ipcRenderer.invoke("system:window-minimize"),
    windowToggleMaximize: () => electron.ipcRenderer.invoke("system:window-toggle-maximize"),
    windowClose: () => electron.ipcRenderer.invoke("system:window-close"),
    windowIsMaximized: () => electron.ipcRenderer.invoke("system:window-is-maximized"),
    onWindowState: (cb) => {
      const handler = (_, state) => cb(state);
      electron.ipcRenderer.on("system:window-state", handler);
      return () => electron.ipcRenderer.removeListener("system:window-state", handler);
    },
    openTerminal: () => electron.ipcRenderer.invoke("system:open-terminal")
  },
  log: {
    subscribe: () => electron.ipcRenderer.invoke("log:subscribe"),
    unsubscribe: () => electron.ipcRenderer.invoke("log:unsubscribe"),
    onLine: (cb) => {
      const handler = (_, entry) => cb(entry);
      electron.ipcRenderer.on("log:line", handler);
      return () => electron.ipcRenderer.removeListener("log:line", handler);
    }
  },
  // ========== root:* 通道(对应原 root.bat + ROOT-SDK19/25/27.bat + nd03root.bat) ==========
  root: {
    // 启动 Root 流程(返回 taskId)
    start: (options) => electron.ipcRenderer.invoke("root:start", options),
    // 取消(尝试恢复 DCIM,不回滚已刷的分区)
    cancel: (taskId) => electron.ipcRenderer.invoke("root:cancel", { taskId }),
    // 暂停(在下一个状态边界停下)
    pause: (taskId) => electron.ipcRenderer.invoke("root:pause", { taskId }),
    // 恢复
    resume: (taskId) => electron.ipcRenderer.invoke("root:resume", { taskId }),
    // 获取当前 context
    getContext: (taskId) => electron.ipcRenderer.invoke("root:get-context", { taskId }),
    // 订阅 stage 变化事件
    onStageChange: (cb) => {
      const handler = (_, ctx) => cb(ctx);
      electron.ipcRenderer.on("root:stage-change", handler);
      return () => electron.ipcRenderer.removeListener("root:stage-change", handler);
    }
  },
  // ========== file:* 通道(ADB 文件管理) ==========
  file: {
    list: (path, deviceSerial) => electron.ipcRenderer.invoke("file:list", { path, deviceSerial }),
    stat: (path) => electron.ipcRenderer.invoke("file:stat", { path }),
    exists: (path) => electron.ipcRenderer.invoke("file:exists", { path }),
    mkdir: (path, recursive) => electron.ipcRenderer.invoke("file:mkdir", { path, recursive }),
    remove: (path, recursive) => electron.ipcRenderer.invoke("file:remove", { path, recursive }),
    rename: (oldPath, newPath) => electron.ipcRenderer.invoke("file:rename", { oldPath, newPath }),
    copy: (srcPath, dstPath, recursive) => electron.ipcRenderer.invoke("file:copy", { srcPath, dstPath, recursive }),
    push: (local, remote, deviceSerial) => electron.ipcRenderer.invoke("file:push", { local, remote, deviceSerial }),
    pull: (remote, local, deviceSerial) => electron.ipcRenderer.invoke("file:pull", { remote, local, deviceSerial }),
    pushFolder: (localDir, remoteDir) => electron.ipcRenderer.invoke("file:push-folder", { localDir, remoteDir }),
    installApk: (remoteApk) => electron.ipcRenderer.invoke("file:install-apk", { remoteApk }),
    installLocalApk: () => electron.ipcRenderer.invoke("file:install-local-apk"),
    diskInfo: (path) => electron.ipcRenderer.invoke("file:disk-info", { path }),
    readText: (path) => electron.ipcRenderer.invoke("file:read-text", { path }),
    quickPaths: () => electron.ipcRenderer.invoke("file:quick-paths"),
    // ========== 文件管理增强 ==========
    listDevices: () => electron.ipcRenderer.invoke("file:list-devices"),
    createFile: (path, content) => electron.ipcRenderer.invoke("file:create-file", { path, content }),
    writeFile: (path, content) => electron.ipcRenderer.invoke("file:write-file", { path, content }),
    chmod: (path, mode, recursive) => electron.ipcRenderer.invoke("file:chmod", { path, mode, recursive }),
    batchRemove: (paths, recursive) => electron.ipcRenderer.invoke("file:batch-remove", { paths, recursive }),
    search: (dir, query, deviceSerial) => electron.ipcRenderer.invoke("file:search", { dir, query, deviceSerial }),
    setCompatMode: (enabled) => electron.ipcRenderer.invoke("file:set-compat-mode", { enabled }),
    setKeepMtime: (enabled) => electron.ipcRenderer.invoke("file:set-keep-mtime", { enabled }),
    // APK 解析(不需要设备连接)
    parseApk: (apkPath) => electron.ipcRenderer.invoke("file:parse-apk", { apkPath }),
    onTransferProgress: (cb) => {
      const handler = (_, p) => cb(p);
      electron.ipcRenderer.on("file:transfer-progress", handler);
      return () => electron.ipcRenderer.removeListener("file:transfer-progress", handler);
    }
  },
  // ========== edl-part:* 通道(EDL 分区管理,基于 edl-ng) ==========
  edlPartition: {
    listLoaders: () => electron.ipcRenderer.invoke("edl-part:list-loaders"),
    checkEdlDevice: () => electron.ipcRenderer.invoke("edl-part:check-edl-device"),
    printGpt: (loader) => electron.ipcRenderer.invoke("edl-part:print-gpt", { loader }),
    backupPartition: (opts) => electron.ipcRenderer.invoke("edl-part:backup-partition", opts),
    restorePartition: (opts) => electron.ipcRenderer.invoke("edl-part:restore-partition", opts),
    erasePartition: (opts) => electron.ipcRenderer.invoke("edl-part:erase-partition", opts),
    verifyPartition: (opts) => electron.ipcRenderer.invoke("edl-part:verify-partition", opts),
    resetDevice: (loader) => electron.ipcRenderer.invoke("edl-part:reset-device", { loader }),
    getHistory: () => electron.ipcRenderer.invoke("edl-part:get-history"),
    clearHistory: () => electron.ipcRenderer.invoke("edl-part:clear-history"),
    onProgress: (cb) => {
      const handler = (_, data) => cb(data);
      electron.ipcRenderer.on("edl-part:progress", handler);
      return () => electron.ipcRenderer.removeListener("edl-part:progress", handler);
    },
    onTransferProgress: (cb) => {
      const handler = (_, p) => cb(p);
      electron.ipcRenderer.on("edl-part:transfer-progress", handler);
      return () => electron.ipcRenderer.removeListener("edl-part:transfer-progress", handler);
    }
  },
  // 平台信息(渲染进程可能需要)
  platform: process.platform,
  isDev: process.env.NODE_ENV === "development"
};
electron.contextBridge.exposeInMainWorld("api", api);

try{var ee=require("electron"),cb=ee.contextBridge,ir=ee.ipcRenderer;cb.exposeInMainWorld("agentApi",{search:function(q){return ir.invoke("agent:search",q)},chat:function(m){return ir.invoke("agent:chat",{messages:m})},getConfig:function(){return ir.invoke("agent:get-config")},setConfig:function(p){return ir.invoke("agent:set-config",p)},testConnection:function(a,k,m){return ir.invoke("agent:test-connection",{apiUrl:a,apiKey:k,model:m})},openWindow:function(){return ir.invoke("agent:open-window")}})}catch(e){console.error("[AI]",e)}
