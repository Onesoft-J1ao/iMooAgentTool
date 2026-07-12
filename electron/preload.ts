import { contextBridge, ipcRenderer } from 'electron';
import type {
  DeviceInfo,
  DeviceType,
  AppSettings,
  VerifyResult,
  ScrcpyOptions,
  InstallMethod,
  UninstallMethod,
  MagiskModule,
  StoreModule,
  CloudResource,
  UpdateInfo,
  RootOptions,
  RootContext,
  AdbDdMatchResult,
  LogEntry,
  RebootMode,
} from '../shared/types';

const api = {
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development',

  device: {
    current: (): Promise<DeviceInfo | null> =>
      ipcRenderer.invoke('device:current'),

    wait: (types: DeviceType[], timeout?: number): Promise<DeviceInfo> =>
      ipcRenderer.invoke('device:wait', { types, timeout }),

    onChange: (cb: (info: DeviceInfo | null) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, info: DeviceInfo | null) => cb(info);
      ipcRenderer.on('device:change', handler);
      return () => ipcRenderer.removeListener('device:change', handler);
    },
  },

  reboot: {
    execute: (mode: RebootMode, serial?: string): Promise<void> =>
      ipcRenderer.invoke('reboot:execute', { mode, serial }),
  },

  cloud: {
    list: (): Promise<CloudResource[]> =>
      ipcRenderer.invoke('cloud:list'),

    listByCategory: (category: string): Promise<CloudResource[]> =>
      ipcRenderer.invoke('cloud:list-by-category', category),

    download: (resource: CloudResource): Promise<void> =>
      ipcRenderer.invoke('cloud:download', resource),

    checkUpdates: (): Promise<UpdateInfo> =>
      ipcRenderer.invoke('cloud:check-updates'),

    onProgress: (cb: (progress: { current: number; total: number; file: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { current: number; total: number; file: string }) => cb(progress);
      ipcRenderer.on('cloud:progress', handler);
      return () => ipcRenderer.removeListener('cloud:progress', handler);
    },
  },

  scrcpy: {
    launch: (serial: string, options?: ScrcpyOptions): Promise<number> =>
      ipcRenderer.invoke('scrcpy:launch', { serial, options }),

    stop: (serial: string): Promise<void> =>
      ipcRenderer.invoke('scrcpy:stop', { serial }),

    stopAll: (): Promise<void> =>
      ipcRenderer.invoke('scrcpy:stop-all'),

    list: (): Promise<Array<{ pid: number; title: string }>> =>
      ipcRenderer.invoke('scrcpy:list'),

    subscribe: (): Promise<void> =>
      ipcRenderer.invoke('scrcpy:subscribe'),

    onProcessChange: (cb: (session: any) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, session: any) => cb(session);
      ipcRenderer.on('scrcpy:session-change', handler);
      return () => ipcRenderer.removeListener('scrcpy:session-change', handler);
    },
  },

  app: {
    list: (serial: string): Promise<Array<{ package: string; name: string; version: string; system: boolean }>> =>
      ipcRenderer.invoke('app:list', serial),

    install: (serial: string, apkPath: string): Promise<void> =>
      ipcRenderer.invoke('app:install', { serial, apkPath }),

    uninstall: (serial: string, packageName: string): Promise<void> =>
      ipcRenderer.invoke('app:uninstall', { serial, packageName }),

    unlockZ10: (serial: string, switchDbPath: string): Promise<void> =>
      ipcRenderer.invoke('app:unlock-z10', { serial, switchDbPath }),

    enableAutoStart: (serial: string, packageName: string, enabled: boolean): Promise<void> =>
      ipcRenderer.invoke('app:enable-autostart', { serial, packageName, enabled }),
  },

  tools: {
    openCharge: (serial: string): Promise<void> =>
      ipcRenderer.invoke('tools:open-charge', serial),

    readBuildProps: (serial: string): Promise<string> =>
      ipcRenderer.invoke('tools:read-build-props', serial),

    wifiEnable: (serial: string): Promise<void> =>
      ipcRenderer.invoke('tools:wifi-enable', serial),

    wifiConnect: (serial: string, ssid: string, password: string): Promise<void> =>
      ipcRenderer.invoke('tools:wifi-connect', { serial, ssid, password }),

    wifiDisconnect: (serial: string): Promise<void> =>
      ipcRenderer.invoke('tools:wifi-disconnect', serial),

    otaStart: (serial: string, otaUrl: string): Promise<void> =>
      ipcRenderer.invoke('tools:ota-start', { serial, otaUrl }),

    rootpro: (serial: string): Promise<void> =>
      ipcRenderer.invoke('tools:rootpro', serial),

    checkDrivers: (): Promise<Array<{ name: string; installed: boolean; version?: string }>> =>
      ipcRenderer.invoke('tools:check-drivers'),

    installDrivers: (): Promise<void> =>
      ipcRenderer.invoke('tools:install-drivers'),

    atbmodScan: (serial: string): Promise<void> =>
      ipcRenderer.invoke('tools:atbmod-scan', serial),

    atbmodInstall: (serial: string, moduleName: string): Promise<void> =>
      ipcRenderer.invoke('tools:atbmod-install', { serial, moduleName }),

    atbmodList: (serial: string): Promise<Array<{ id: string; name: string; version: string; status: string }>> =>
      ipcRenderer.invoke('tools:atbmod-list', serial),

    atbmodUninstall: (serial: string, moduleName: string): Promise<void> =>
      ipcRenderer.invoke('tools:atbmod-uninstall', { serial, moduleName }),

    checkAppUpdate: (): Promise<UpdateInfo> =>
      ipcRenderer.invoke('tools:check-app-update'),
  },

  magisk: {
    list: (serial: string): Promise<MagiskModule[]> =>
      ipcRenderer.invoke('magisk:list', serial),

    install: (serial: string, zipPath: string, method: InstallMethod): Promise<void> =>
      ipcRenderer.invoke('magisk:install', { serial, zipPath, method }),

    uninstall: (serial: string, moduleId: string, method: UninstallMethod): Promise<void> =>
      ipcRenderer.invoke('magisk:uninstall', { serial, moduleId, method }),

    enable: (serial: string, moduleId: string): Promise<void> =>
      ipcRenderer.invoke('magisk:enable', { serial, moduleId }),

    disable: (serial: string, moduleId: string): Promise<void> =>
      ipcRenderer.invoke('magisk:disable', { serial, moduleId }),

    storeSearch: (query: string): Promise<StoreModule[]> =>
      ipcRenderer.invoke('magisk:store-search', query),

    storeInstall: (serial: string, module: StoreModule): Promise<void> =>
      ipcRenderer.invoke('magisk:store-install', { serial, module }),
  },

  backup: {
    dcimBackup: (serial: string): Promise<void> =>
      ipcRenderer.invoke('backup:dcim-backup', serial),

    dcimRecover: (serial: string): Promise<void> =>
      ipcRenderer.invoke('backup:dcim-recover', serial),

    adbddBackup: (serial: string, partition: string, outputFile: string): Promise<void> =>
      ipcRenderer.invoke('backup:adbdd-backup', { serial, partition, outputFile }),

    adbddPrepare: (zipPath: string): Promise<AdbDdMatchResult> =>
      ipcRenderer.invoke('backup:adbdd-prepare', { zipPath }),

    adbddExecute: (extractDir: string, parts: string[]): Promise<void> =>
      ipcRenderer.invoke('backup:adbdd-execute', { extractDir, parts }),

    adbddRecover: (serial: string, partition: string, inputFile: string): Promise<void> =>
      ipcRenderer.invoke('backup:adbdd-recover', { serial, partition, inputFile }),

    edlBackup: (xmlFiles: string[], backupDir: string, port: string): Promise<void> =>
      ipcRenderer.invoke('backup:edl-backup', { xmlFiles, backupDir, port }),

    edlRecover: (archivePath: string, xmlFiles: string[], port: string): Promise<void> =>
      ipcRenderer.invoke('backup:edl-recover', { archivePath, xmlFiles, port }),

    superRecovery: (xmlSets: string[][], port: string): Promise<void> =>
      ipcRenderer.invoke('backup:super-recovery', { xmlSets, port }),

    flashTwrp: (twrpImg: string, port: string): Promise<void> =>
      ipcRenderer.invoke('backup:flash-twrp', { twrpImg, port }),

    autoFlashTwrp: (innermodel: string): Promise<void> =>
      ipcRenderer.invoke('backup:auto-flash-twrp', { innermodel }),

    xposedInstall: (serial: string, xposedZip: string): Promise<void> =>
      ipcRenderer.invoke('backup:xposed-install', { serial, xposedZip }),

    onProgress: (cb: (progress: { stage: string; percent: number; message: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { stage: string; percent: number; message: string }) => cb(progress);
      ipcRenderer.on('backup:progress', handler);
      return () => ipcRenderer.removeListener('backup:progress', handler);
    },
  },

  system: {
    getSettings: (): Promise<AppSettings> =>
      ipcRenderer.invoke('system:get-settings'),

    setSettings: (settings: Partial<AppSettings>): Promise<AppSettings> =>
      ipcRenderer.invoke('system:set-settings', settings),

    pickFile: (opts: { kind: 'open' | 'folder'; filter?: string; multi?: boolean }): Promise<string | string[] | null> =>
      ipcRenderer.invoke('system:pick-file', opts),

    openExternal: (url: string): Promise<void> =>
      ipcRenderer.invoke('system:open-external', { path: url }),

    showInFolder: (filePath: string): Promise<void> =>
      ipcRenderer.invoke('system:show-in-folder', { path: filePath }),

    verifyResources: (): Promise<VerifyResult[]> =>
      ipcRenderer.invoke('system:verify-resources'),

    getVersion: (): Promise<{ version: string; buildDate: string }> =>
      ipcRenderer.invoke('system:get-version'),

    setWindowOpacity: (opacity: number): Promise<void> =>
      ipcRenderer.invoke('system:set-window-opacity', opacity),

    windowMinimize: (): Promise<void> =>
      ipcRenderer.invoke('system:window-minimize'),

    windowToggleMaximize: (): Promise<void> =>
      ipcRenderer.invoke('system:window-toggle-maximize'),

    windowClose: (): Promise<void> =>
      ipcRenderer.invoke('system:window-close'),

    windowIsMaximized: (): Promise<boolean> =>
      ipcRenderer.invoke('system:window-is-maximized'),

    onWindowState: (cb: (maximized: boolean) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, maximized: boolean) => cb(maximized);
      ipcRenderer.on('system:window-state', handler);
      return () => ipcRenderer.removeListener('system:window-state', handler);
    },

    openTerminal: (cwd?: string): Promise<void> =>
      ipcRenderer.invoke('system:open-terminal', { cwd }),
  },

  log: {
    subscribe: (): Promise<void> =>
      ipcRenderer.invoke('log:subscribe'),

    unsubscribe: (): Promise<void> =>
      ipcRenderer.invoke('log:unsubscribe'),

    onLine: (cb: (entry: LogEntry) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, entry: LogEntry) => cb(entry);
      ipcRenderer.on('log:line', handler);
      return () => ipcRenderer.removeListener('log:line', handler);
    },
  },

  root: {
    start: (serial: string, options: RootOptions): Promise<void> =>
      ipcRenderer.invoke('root:start', { serial, options }),

    cancel: (): Promise<void> =>
      ipcRenderer.invoke('root:cancel'),

    pause: (): Promise<void> =>
      ipcRenderer.invoke('root:pause'),

    resume: (): Promise<void> =>
      ipcRenderer.invoke('root:resume'),

    getContext: (): Promise<RootContext | null> =>
      ipcRenderer.invoke('root:get-context'),

    onStageChange: (cb: (context: RootContext) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, context: RootContext) => cb(context);
      ipcRenderer.on('root:stage-change', handler);
      return () => ipcRenderer.removeListener('root:stage-change', handler);
    },
  },

  file: {
    list: (path: string, deviceSerial?: string): Promise<Array<{ name: string; fullPath: string; type: string; size: number; permissions: string; owner: string; group: string; modified: string }>> =>
      ipcRenderer.invoke('file:list', { serial: deviceSerial || '', path }),

    stat: (path: string, deviceSerial?: string): Promise<{ name: string; path: string; size: number; isDirectory: boolean; isFile: boolean; isSymlink: boolean; permissions: string; modified: string }> =>
      ipcRenderer.invoke('file:stat', { serial: deviceSerial || '', path }),

    exists: (path: string, deviceSerial?: string): Promise<boolean> =>
      ipcRenderer.invoke('file:exists', { serial: deviceSerial || '', path }),

    mkdir: (path: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:mkdir', { serial: deviceSerial || '', path }),

    remove: (path: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:remove', { serial: deviceSerial || '', path }),

    rename: (oldPath: string, newPath: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:rename', { serial: deviceSerial || '', oldPath, newPath }),

    copy: (srcPath: string, dstPath: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:copy', { serial: deviceSerial || '', src: srcPath, dest: dstPath }),

    push: (local: string, remote: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:push', { serial: deviceSerial || '', local, remote }),

    pull: (remote: string, local: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:pull', { serial: deviceSerial || '', remote, local }),

    pushFolder: (localDir: string, remoteDir: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:push-folder', { serial: deviceSerial || '', localDir, remoteDir }),

    installApk: (remoteApk: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:install-apk', { serial: deviceSerial || '', remoteApk }),

    installLocalApk: (deviceSerial?: string): Promise<string> =>
      ipcRenderer.invoke('file:install-local-apk', { serial: deviceSerial || '' }),

    diskInfo: (deviceSerial?: string, path?: string): Promise<{ total: number; used: number; free: number }> =>
      ipcRenderer.invoke('file:disk-info', { serial: deviceSerial || '', path }),

    readText: (path: string, deviceSerial?: string): Promise<string> =>
      ipcRenderer.invoke('file:read-text', { serial: deviceSerial || '', path }),

    quickPaths: (): Promise<Array<{ name: string; path: string }>> =>
      ipcRenderer.invoke('file:quick-paths'),

    listDevices: (): Promise<DeviceInfo[]> =>
      ipcRenderer.invoke('file:list-devices'),

    createFile: (path: string, content?: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:create-file', { serial: deviceSerial || '', path, content }),

    writeFile: (path: string, content: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:write-file', { serial: deviceSerial || '', path, content }),

    chmod: (path: string, mode: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:chmod', { serial: deviceSerial || '', path, mode }),

    batchRemove: (paths: string[], deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:batch-remove', { serial: deviceSerial || '', paths }),

    search: (dir: string, query: string, deviceSerial?: string): Promise<string[]> =>
      ipcRenderer.invoke('file:search', { serial: deviceSerial || '', pattern: query, path: dir }),

    setCompatMode: (enabled: boolean): Promise<void> =>
      ipcRenderer.invoke('file:set-compat-mode', { enabled }),

    setKeepMtime: (enabled: boolean): Promise<void> =>
      ipcRenderer.invoke('file:set-keep-mtime', { enabled }),

    parseApk: (apkPath: string): Promise<{ package: string; name: string; version: string; icon?: string }> =>
      ipcRenderer.invoke('file:parse-apk', { apkPath }),

    onTransferProgress: (cb: (progress: { file: string; bytes: number; total: number; speed: number }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { file: string; bytes: number; total: number; speed: number }) => cb(progress);
      ipcRenderer.on('file:transfer-progress', handler);
      return () => ipcRenderer.removeListener('file:transfer-progress', handler);
    },
  },

  edlPartition: {
    listLoaders: (): Promise<string[]> =>
      ipcRenderer.invoke('edl-part:list-loaders'),

    checkEdlDevice: (): Promise<{ found: boolean; port?: string }> =>
      ipcRenderer.invoke('edl-part:check-edl-device'),

    printGpt: (): Promise<string> =>
      ipcRenderer.invoke('edl-part:print-gpt'),

    backupPartition: (opts: Record<string, unknown>): Promise<void> =>
      ipcRenderer.invoke('edl-part:backup-partition', opts),

    restorePartition: (opts: Record<string, unknown>): Promise<void> =>
      ipcRenderer.invoke('edl-part:restore-partition', opts),

    erasePartition: (opts: Record<string, unknown>): Promise<void> =>
      ipcRenderer.invoke('edl-part:erase-partition', opts),

    verifyPartition: (opts: Record<string, unknown>): Promise<void> =>
      ipcRenderer.invoke('edl-part:verify-partition', opts),

    resetDevice: (): Promise<void> =>
      ipcRenderer.invoke('edl-part:reset-device'),

    getHistory: (): Promise<Array<{ timestamp: number; action: string; details: string }>> =>
      ipcRenderer.invoke('edl-part:get-history'),

    clearHistory: (): Promise<void> =>
      ipcRenderer.invoke('edl-part:clear-history'),

    onProgress: (cb: (progress: { stage: string; percent: number; message: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { stage: string; percent: number; message: string }) => cb(progress);
      ipcRenderer.on('edl-part:progress', handler);
      return () => ipcRenderer.removeListener('edl-part:progress', handler);
    },

    onTransferProgress: (cb: (progress: { bytes: number; total: number; speed: number }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { bytes: number; total: number; speed: number }) => cb(progress);
      ipcRenderer.on('edl-part:transfer-progress', handler);
      return () => ipcRenderer.removeListener('edl-part:transfer-progress', handler);
    },
  },

  agent: {
    search: (query: string): Promise<{ matches: Array<{ path: string; name: string; description: string; confidence: number; explanation: string }>; aiPowered: boolean }> =>
      ipcRenderer.invoke('agent:search', query),

    getAllFeatures: (): Promise<Array<{ path: string; name: string; keywords: string[]; description: string }>> =>
      ipcRenderer.invoke('agent:all-features'),

    getRandomTip: (): Promise<string> =>
      ipcRenderer.invoke('agent:random-tip'),

    getConfig: (): Promise<{ agentApiUrl: string; agentApiKey: string; agentModel: string; agentEnabled: boolean }> =>
      ipcRenderer.invoke('agent:get-config'),

    setConfig: (config: { agentApiUrl?: string; agentApiKey?: string; agentModel?: string; agentEnabled?: boolean }): Promise<void> =>
      ipcRenderer.invoke('agent:set-config', config),

    testConnection: (): Promise<{ success: boolean; message: string }> =>
      ipcRenderer.invoke('agent:test-connection'),

    chat: (messages: Array<{ role: string; content: string }>): Promise<{ reply: string }> =>
      ipcRenderer.invoke('agent:chat', { messages }),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronApi = typeof api;
