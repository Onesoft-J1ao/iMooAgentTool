"use strict";
const electron = require("electron");
const api = {
  platform: process.platform,
  isDev: process.env.NODE_ENV === "development",
  device: {
    current: () => electron.ipcRenderer.invoke("device:current"),
    wait: (types, timeout) => electron.ipcRenderer.invoke("device:wait", { types, timeout }),
    onChange: (cb) => {
      const handler = (_event, info) => cb(info);
      electron.ipcRenderer.on("device:change", handler);
      return () => electron.ipcRenderer.removeListener("device:change", handler);
    }
  },
  reboot: {
    execute: (mode) => electron.ipcRenderer.invoke("reboot:execute", { mode })
  },
  cloud: {
    list: () => electron.ipcRenderer.invoke("cloud:list"),
    listByCategory: () => electron.ipcRenderer.invoke("cloud:list-by-category"),
    download: (resource) => electron.ipcRenderer.invoke("cloud:download", { name: resource.name }),
    checkUpdates: () => electron.ipcRenderer.invoke("cloud:check-updates"),
    onProgress: (cb) => {
      const handler = (_event, progress) => cb(progress);
      electron.ipcRenderer.on("cloud:progress", handler);
      return () => electron.ipcRenderer.removeListener("cloud:progress", handler);
    }
  },
  scrcpy: {
    launch: (serial, options) => electron.ipcRenderer.invoke("scrcpy:launch", { serial, options }),
    stop: (pid) => electron.ipcRenderer.invoke("scrcpy:stop", { pid }),
    stopAll: () => electron.ipcRenderer.invoke("scrcpy:stop-all"),
    list: () => electron.ipcRenderer.invoke("scrcpy:list"),
    subscribe: () => electron.ipcRenderer.invoke("scrcpy:subscribe"),
    onProcessChange: (cb) => {
      const handler = (_event, session) => cb(session);
      electron.ipcRenderer.on("scrcpy:process-change", handler);
      return () => electron.ipcRenderer.removeListener("scrcpy:process-change", handler);
    }
  },
  app: {
    list: (serial) => electron.ipcRenderer.invoke("app:list", { serial }),
    listAll: (serial) => electron.ipcRenderer.invoke("app:list-all", { serial }),
    install: (serial, apkPath) => electron.ipcRenderer.invoke("app:install", { serial, apkPath }),
    uninstall: (serial, packageName, keepData) => electron.ipcRenderer.invoke("app:uninstall", { serial, packageName, keepData }),
    launch: (serial, packageName) => electron.ipcRenderer.invoke("app:launch", { serial, packageName }),
    forceStop: (serial, packageName) => electron.ipcRenderer.invoke("app:force-stop", { serial, packageName }),
    clearData: (serial, packageName) => electron.ipcRenderer.invoke("app:clear-data", { serial, packageName }),
    unlockZ10: () => electron.ipcRenderer.invoke("app:unlock-z10"),
    enableAutoStart: (packageName, enabled) => electron.ipcRenderer.invoke("app:enable-autostart", { packageName, enabled }),
    defaultAutostart: (enabled) => electron.ipcRenderer.invoke("app:default-autostart", { enabled })
  },
  tools: {
    openCharge: (serial) => electron.ipcRenderer.invoke("tools:open-charge", serial),
    readBuildProps: (serial) => electron.ipcRenderer.invoke("tools:read-build-props", serial),
    wifiEnable: (serial) => electron.ipcRenderer.invoke("tools:wifi-enable", serial),
    wifiConnect: (host, port) => electron.ipcRenderer.invoke("tools:wifi-connect", { host, port }),
    wifiDisconnect: (host, port) => electron.ipcRenderer.invoke("tools:wifi-disconnect", { host, port }),
    wifiPair: (host, port, code) => electron.ipcRenderer.invoke("tools:wifi-pair", { host, port, code }),
    otaStart: (serial, zipPath) => electron.ipcRenderer.invoke("tools:ota-start", { serial, zipPath }),
    rootPro: (options) => electron.ipcRenderer.invoke("tools:rootpro", options),
    checkDrivers: () => electron.ipcRenderer.invoke("tools:check-drivers"),
    installDrivers: () => electron.ipcRenderer.invoke("tools:install-drivers"),
    atbmodScan: () => electron.ipcRenderer.invoke("tools:atbmod-scan"),
    atbmodInstall: (file) => electron.ipcRenderer.invoke("tools:atbmod-install", { file }),
    atbmodList: () => electron.ipcRenderer.invoke("tools:atbmod-list"),
    atbmodUninstall: (modid) => electron.ipcRenderer.invoke("tools:atbmod-uninstall", { modid }),
    checkAppUpdate: () => electron.ipcRenderer.invoke("tools:check-app-update")
  },
  magisk: {
    list: () => electron.ipcRenderer.invoke("magisk:list"),
    install: (zipPath, method) => electron.ipcRenderer.invoke("magisk:install", { zipPath, method }),
    uninstall: (moduleId, method) => electron.ipcRenderer.invoke("magisk:uninstall", { moduleId, method }),
    enable: (moduleId) => electron.ipcRenderer.invoke("magisk:enable", { moduleId }),
    disable: (moduleId) => electron.ipcRenderer.invoke("magisk:disable", { moduleId }),
    storeSearch: (query) => electron.ipcRenderer.invoke("magisk:store-search", query),
    storeInstall: (module) => electron.ipcRenderer.invoke("magisk:store-install", { module })
  },
  backup: {
    dcimBackup: (outputDir) => electron.ipcRenderer.invoke("backup:dcim-backup", { outputDir }),
    dcimRecover: (inputDir) => electron.ipcRenderer.invoke("backup:dcim-recover", { inputDir }),
    adbddBackup: (outputDir) => electron.ipcRenderer.invoke("backup:adbdd-backup", { outputDir }),
    adbddRecover: (zipPath) => electron.ipcRenderer.invoke("backup:adbdd-recover", { zipPath }),
    adbddPrepare: (zipPath) => electron.ipcRenderer.invoke("backup:adbdd-prepare", { zipPath }),
    adbddExecute: (extractDir, parts) => electron.ipcRenderer.invoke("backup:adbdd-execute", { extractDir, parts }),
    edlBackup: (xmlFiles, backupDir, port) => electron.ipcRenderer.invoke("backup:edl-backup", { xmlFiles, backupDir, port }),
    edlRecover: (archivePath, xmlFiles, port) => electron.ipcRenderer.invoke("backup:edl-recover", { archivePath, xmlFiles, port }),
    superRecovery: (xmlSets, port) => electron.ipcRenderer.invoke("backup:super-recovery", { xmlSets, port }),
    flashTwrp: (innermodel) => electron.ipcRenderer.invoke("backup:flash-twrp", { innermodel }),
    autoFlashTwrp: (innermodel) => electron.ipcRenderer.invoke("backup:auto-flash-twrp", { innermodel }),
    xposedInstall: () => electron.ipcRenderer.invoke("backup:xposed-install"),
    onProgress: (cb) => {
      const handler = (_event, progress) => cb(progress);
      electron.ipcRenderer.on("backup:progress", handler);
      return () => electron.ipcRenderer.removeListener("backup:progress", handler);
    }
  },
  system: {
    getSettings: () => electron.ipcRenderer.invoke("system:get-settings"),
    setSettings: (settings) => electron.ipcRenderer.invoke("system:set-settings", settings),
    pickFile: (opts) => electron.ipcRenderer.invoke("system:pick-file", opts),
    openExternal: (url) => electron.ipcRenderer.invoke("system:open-external", { url }),
    showInFolder: (filePath) => electron.ipcRenderer.invoke("system:show-in-folder", { path: filePath }),
    verifyResources: () => electron.ipcRenderer.invoke("system:verify-resources"),
    getVersion: () => electron.ipcRenderer.invoke("system:get-version"),
    setWindowOpacity: (opacity) => electron.ipcRenderer.invoke("system:set-window-opacity", opacity),
    windowMinimize: () => electron.ipcRenderer.invoke("system:window-minimize"),
    windowToggleMaximize: () => electron.ipcRenderer.invoke("system:window-toggle-maximize"),
    windowClose: () => electron.ipcRenderer.invoke("system:window-close"),
    windowIsMaximized: () => electron.ipcRenderer.invoke("system:window-is-maximized"),
    onWindowState: (cb) => {
      const handler = (_event, maximized) => cb(maximized);
      electron.ipcRenderer.on("system:window-state", handler);
      return () => electron.ipcRenderer.removeListener("system:window-state", handler);
    },
    openTerminal: (cwd) => electron.ipcRenderer.invoke("system:open-terminal", { cwd })
  },
  log: {
    subscribe: () => electron.ipcRenderer.invoke("log:subscribe"),
    unsubscribe: () => electron.ipcRenderer.invoke("log:unsubscribe"),
    onLine: (cb) => {
      const handler = (_event, entry) => cb(entry);
      electron.ipcRenderer.on("log:line", handler);
      return () => electron.ipcRenderer.removeListener("log:line", handler);
    }
  },
  root: {
    start: (options) => electron.ipcRenderer.invoke("root:start", options),
    cancel: (taskId) => electron.ipcRenderer.invoke("root:cancel", { taskId }),
    pause: (taskId) => electron.ipcRenderer.invoke("root:pause", { taskId }),
    resume: (taskId) => electron.ipcRenderer.invoke("root:resume", { taskId }),
    getContext: (taskId) => electron.ipcRenderer.invoke("root:get-context", { taskId }),
    onStageChange: (cb) => {
      const handler = (_event, context) => cb(context);
      electron.ipcRenderer.on("root:stage-change", handler);
      return () => electron.ipcRenderer.removeListener("root:stage-change", handler);
    }
  },
  file: {
    list: (path, deviceSerial) => electron.ipcRenderer.invoke("file:list", { serial: deviceSerial || "", path }),
    stat: (path, deviceSerial) => electron.ipcRenderer.invoke("file:stat", { serial: deviceSerial || "", path }),
    exists: (path, deviceSerial) => electron.ipcRenderer.invoke("file:exists", { serial: deviceSerial || "", path }),
    mkdir: (path, deviceSerial) => electron.ipcRenderer.invoke("file:mkdir", { serial: deviceSerial || "", path }),
    remove: (path, deviceSerial) => electron.ipcRenderer.invoke("file:remove", { serial: deviceSerial || "", path }),
    rename: (oldPath, newPath, deviceSerial) => electron.ipcRenderer.invoke("file:rename", { serial: deviceSerial || "", oldPath, newPath }),
    copy: (srcPath, dstPath, deviceSerial) => electron.ipcRenderer.invoke("file:copy", { serial: deviceSerial || "", src: srcPath, dest: dstPath }),
    push: (local, remote, deviceSerial) => electron.ipcRenderer.invoke("file:push", { serial: deviceSerial || "", local, remote }),
    pull: (remote, local, deviceSerial) => electron.ipcRenderer.invoke("file:pull", { serial: deviceSerial || "", remote, local }),
    pushFolder: (localDir, remoteDir, deviceSerial) => electron.ipcRenderer.invoke("file:push-folder", { serial: deviceSerial || "", localDir, remoteDir }),
    installApk: (remoteApk, deviceSerial) => electron.ipcRenderer.invoke("file:install-apk", { serial: deviceSerial || "", remoteApk }),
    installLocalApk: (deviceSerial) => electron.ipcRenderer.invoke("file:install-local-apk", { serial: deviceSerial || "" }),
    diskInfo: (deviceSerial, path) => electron.ipcRenderer.invoke("file:disk-info", { serial: deviceSerial || "", path }),
    readText: (path, deviceSerial) => electron.ipcRenderer.invoke("file:read-text", { serial: deviceSerial || "", path }),
    quickPaths: () => electron.ipcRenderer.invoke("file:quick-paths"),
    listDevices: () => electron.ipcRenderer.invoke("file:list-devices"),
    createFile: (path, content, deviceSerial) => electron.ipcRenderer.invoke("file:create-file", { serial: deviceSerial || "", path, content }),
    writeFile: (path, content, deviceSerial) => electron.ipcRenderer.invoke("file:write-file", { serial: deviceSerial || "", path, content }),
    chmod: (path, mode, deviceSerial) => electron.ipcRenderer.invoke("file:chmod", { serial: deviceSerial || "", path, mode }),
    batchRemove: (paths, deviceSerial) => electron.ipcRenderer.invoke("file:batch-remove", { serial: deviceSerial || "", paths }),
    search: (dir, query, deviceSerial) => electron.ipcRenderer.invoke("file:search", { serial: deviceSerial || "", pattern: query, path: dir }),
    setCompatMode: (enabled) => electron.ipcRenderer.invoke("file:set-compat-mode", { enabled }),
    setKeepMtime: (enabled) => electron.ipcRenderer.invoke("file:set-keep-mtime", { enabled }),
    parseApk: (apkPath) => electron.ipcRenderer.invoke("file:parse-apk", { apkPath }),
    onTransferProgress: (cb) => {
      const handler = (_event, progress) => cb(progress);
      electron.ipcRenderer.on("file:transfer-progress", handler);
      return () => electron.ipcRenderer.removeListener("file:transfer-progress", handler);
    }
  },
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
      const handler = (_event, progress) => cb(progress);
      electron.ipcRenderer.on("edl-part:progress", handler);
      return () => electron.ipcRenderer.removeListener("edl-part:progress", handler);
    },
    onTransferProgress: (cb) => {
      const handler = (_event, progress) => cb(progress);
      electron.ipcRenderer.on("edl-part:transfer-progress", handler);
      return () => electron.ipcRenderer.removeListener("edl-part:transfer-progress", handler);
    }
  },
  agent: {
    search: (query) => electron.ipcRenderer.invoke("agent:search", query),
    getAllFeatures: () => electron.ipcRenderer.invoke("agent:all-features"),
    getRandomTip: () => electron.ipcRenderer.invoke("agent:random-tip"),
    getConfig: () => electron.ipcRenderer.invoke("agent:get-config"),
    setConfig: (config) => electron.ipcRenderer.invoke("agent:set-config", config),
    testConnection: () => electron.ipcRenderer.invoke("agent:test-connection"),
    chat: (messages) => electron.ipcRenderer.invoke("agent:chat", { messages })
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
