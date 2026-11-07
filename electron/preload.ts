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

export interface CloudUpdateState {
  resource: CloudResource;
  updateAvailable: boolean;
}

export interface EdlLoader {
  name: string;
  path: string;
  description: string;
}

export interface EdlPartition {
  label: string;
  sizeBytes: number;
  firstLba: number;
  lastLba?: number;
  lun?: number;
  typeGuid?: string;
  uid?: string;
}

export interface EdlGptResult {
  success: boolean;
  partitions: EdlPartition[];
  storage?: { sectorSize: number; lunCount: number };
  error?: string;
}

export interface EdlHistoryEntry {
  id: string;
  type: string;
  label: string;
  success: boolean;
  message: string;
  timestamp: number;
  durationMs: number;
}

export interface OperationResult {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface AdbInstallResult {
  success: boolean;
  output: string;
  error?: string;
}

const api = {
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development',

  device: {
    current: (): Promise<DeviceInfo | null> => ipcRenderer.invoke('device:current'),
    wait: (types: DeviceType[], timeout?: number): Promise<DeviceInfo> =>
      ipcRenderer.invoke('device:wait', { types, timeout }),
    onChange: (cb: (info: DeviceInfo | null) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, info: DeviceInfo | null) => cb(info);
      ipcRenderer.on('device:change', handler);
      return () => ipcRenderer.removeListener('device:change', handler);
    },
  },

  reboot: {
    execute: (mode: RebootMode): Promise<OperationResult> =>
      ipcRenderer.invoke('reboot:execute', { mode }),
  },

  cloud: {
    list: (): Promise<CloudResource[]> => ipcRenderer.invoke('cloud:list'),
    listByCategory: (): Promise<Record<string, CloudResource[]>> => ipcRenderer.invoke('cloud:list-by-category'),
    download: (resource: CloudResource): Promise<OperationResult> =>
      ipcRenderer.invoke('cloud:download', { name: resource.name }),
    checkUpdates: (): Promise<CloudUpdateState[]> => ipcRenderer.invoke('cloud:check-updates'),
    onProgress: (cb: (progress: { current: number; total: number; file: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { current: number; total: number; file: string }) => cb(progress);
      ipcRenderer.on('cloud:progress', handler);
      return () => ipcRenderer.removeListener('cloud:progress', handler);
    },
  },

  scrcpy: {
    launch: (serial: string, options?: ScrcpyOptions): Promise<number> =>
      ipcRenderer.invoke('scrcpy:launch', { serial, options }),
    stop: (pid: number): Promise<void> => ipcRenderer.invoke('scrcpy:stop', { pid }),
    stopAll: (): Promise<void> => ipcRenderer.invoke('scrcpy:stop-all'),
    list: (): Promise<Array<{ pid: number; serial: string; startedAt: number }>> => ipcRenderer.invoke('scrcpy:list'),
    subscribe: (): Promise<void> => ipcRenderer.invoke('scrcpy:subscribe'),
    onProcessChange: (cb: (session: unknown) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, session: unknown) => cb(session);
      ipcRenderer.on('scrcpy:process-change', handler);
      return () => ipcRenderer.removeListener('scrcpy:process-change', handler);
    },
  },

  app: {
    list: (serial: string): Promise<Array<{ package: string; name: string; version: string; system: boolean }>> =>
      ipcRenderer.invoke('app:list', { serial }),
    listAll: (serial: string): Promise<Array<{ package: string; name: string; version: string; system: boolean }>> =>
      ipcRenderer.invoke('app:list-all', { serial }),
    install: (serial: string, apkPath: string): Promise<AdbInstallResult> =>
      ipcRenderer.invoke('app:install', { serial, apkPath }),
    uninstall: (serial: string, packageName: string, keepData?: boolean): Promise<OperationResult> =>
      ipcRenderer.invoke('app:uninstall', { serial, packageName, keepData }),
    launch: (serial: string, packageName: string): Promise<string> =>
      ipcRenderer.invoke('app:launch', { serial, packageName }),
    forceStop: (serial: string, packageName: string): Promise<string> =>
      ipcRenderer.invoke('app:force-stop', { serial, packageName }),
    clearData: (serial: string, packageName: string): Promise<string> =>
      ipcRenderer.invoke('app:clear-data', { serial, packageName }),
    unlockZ10: (): Promise<{ success: boolean; steps: Array<{ name: string; status: string; message?: string }>; error?: string }> =>
      ipcRenderer.invoke('app:unlock-z10'),
    enableAutoStart: (packageName: string, enabled: boolean): Promise<OperationResult> =>
      ipcRenderer.invoke('app:enable-autostart', { packageName, enabled }),
    defaultAutostart: (enabled: boolean): Promise<OperationResult> =>
      ipcRenderer.invoke('app:default-autostart', { enabled }),
  },

  tools: {
    openCharge: (serial: string): Promise<string> => ipcRenderer.invoke('tools:open-charge', serial),
    readBuildProps: (serial: string): Promise<string> => ipcRenderer.invoke('tools:read-build-props', serial),
    wifiEnable: (serial: string): Promise<string> => ipcRenderer.invoke('tools:wifi-enable', serial),
    wifiConnect: (host: string, port?: number): Promise<string> =>
      ipcRenderer.invoke('tools:wifi-connect', { host, port }),
    wifiDisconnect: (host: string, port?: number): Promise<string> =>
      ipcRenderer.invoke('tools:wifi-disconnect', { host, port }),
    wifiPair: (host: string, port: number, code: string): Promise<string> =>
      ipcRenderer.invoke('tools:wifi-pair', { host, port, code }),
    otaStart: (serial: string, zipPath: string): Promise<OperationResult> =>
      ipcRenderer.invoke('tools:ota-start', { serial, zipPath }),
    rootPro: (options: { installApks?: boolean; installDesktop?: boolean; installMods?: boolean }): Promise<OperationResult> =>
      ipcRenderer.invoke('tools:rootpro', options),
    checkDrivers: (): Promise<Array<{ name: string; installed: boolean; version?: string }>> =>
      ipcRenderer.invoke('tools:check-drivers'),
    installDrivers: (): Promise<OperationResult> => ipcRenderer.invoke('tools:install-drivers'),
    atbmodScan: (): Promise<Array<{ path: string; filename: string; size: number }>> => ipcRenderer.invoke('tools:atbmod-scan'),
    atbmodInstall: (file: string): Promise<OperationResult> => ipcRenderer.invoke('tools:atbmod-install', { file }),
    atbmodList: (): Promise<Array<{ modid: string; dir: string; hasProp: boolean; prop?: { modname?: string; modversion?: string } }>> =>
      ipcRenderer.invoke('tools:atbmod-list'),
    atbmodUninstall: (modid: string): Promise<OperationResult> =>
      ipcRenderer.invoke('tools:atbmod-uninstall', { modid }),
    checkAppUpdate: (): Promise<UpdateInfo> => ipcRenderer.invoke('tools:check-app-update'),
  },

  magisk: {
    list: (): Promise<MagiskModule[]> => ipcRenderer.invoke('magisk:list'),
    install: (zipPath: string, method: InstallMethod): Promise<OperationResult> =>
      ipcRenderer.invoke('magisk:install', { zipPath, method }),
    uninstall: (moduleId: string, method: UninstallMethod): Promise<OperationResult> =>
      ipcRenderer.invoke('magisk:uninstall', { moduleId, method }),
    enable: (moduleId: string): Promise<OperationResult> => ipcRenderer.invoke('magisk:enable', { moduleId }),
    disable: (moduleId: string): Promise<OperationResult> => ipcRenderer.invoke('magisk:disable', { moduleId }),
    storeSearch: (query: string): Promise<StoreModule[]> => ipcRenderer.invoke('magisk:store-search', query),
    storeInstall: (module: StoreModule): Promise<OperationResult> =>
      ipcRenderer.invoke('magisk:store-install', { module }),
  },

  backup: {
    dcimBackup: (outputDir: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:dcim-backup', { outputDir }),
    dcimRecover: (inputDir: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:dcim-recover', { inputDir }),
    adbddBackup: (outputDir: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:adbdd-backup', { outputDir }),
    adbddRecover: (zipPath: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:adbdd-recover', { zipPath }),
    adbddPrepare: (zipPath: string): Promise<AdbDdMatchResult & { extractDir?: string; success?: boolean; error?: string }> =>
      ipcRenderer.invoke('backup:adbdd-prepare', { zipPath }),
    adbddExecute: (extractDir: string, parts: string[]): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:adbdd-execute', { extractDir, parts }),
    edlBackup: (xmlFiles: string[], backupDir: string, port: string): Promise<string> =>
      ipcRenderer.invoke('backup:edl-backup', { xmlFiles, backupDir, port }),
    edlRecover: (archivePath: string, xmlFiles: string[], port: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:edl-recover', { archivePath, xmlFiles, port }),
    superRecovery: (xmlSets: string[][], port: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:super-recovery', { xmlSets, port }),
    flashTwrp: (innermodel: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:flash-twrp', { innermodel }),
    autoFlashTwrp: (innermodel: string): Promise<OperationResult> =>
      ipcRenderer.invoke('backup:auto-flash-twrp', { innermodel }),
    xposedInstall: (): Promise<OperationResult> => ipcRenderer.invoke('backup:xposed-install'),
    onProgress: (cb: (progress: { stage: string; percent: number; message: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { stage: string; percent: number; message: string }) => cb(progress);
      ipcRenderer.on('backup:progress', handler);
      return () => ipcRenderer.removeListener('backup:progress', handler);
    },
  },

  system: {
    getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('system:get-settings'),
    setSettings: (settings: Partial<AppSettings>): Promise<AppSettings> =>
      ipcRenderer.invoke('system:set-settings', settings),
    pickFile: (opts: { kind: 'open' | 'folder'; filter?: string; multi?: boolean }): Promise<string | string[] | null> =>
      ipcRenderer.invoke('system:pick-file', opts),
    openExternal: (url: string): Promise<void> => ipcRenderer.invoke('system:open-external', { url }),
    showInFolder: (filePath: string): Promise<void> => ipcRenderer.invoke('system:show-in-folder', { path: filePath }),
    verifyResources: (): Promise<VerifyResult[]> => ipcRenderer.invoke('system:verify-resources'),
    getVersion: (): Promise<{ version: string; buildDate: string }> => ipcRenderer.invoke('system:get-version'),
    setWindowOpacity: (opacity: number): Promise<void> =>
      ipcRenderer.invoke('system:set-window-opacity', opacity),
    windowMinimize: (): Promise<void> => ipcRenderer.invoke('system:window-minimize'),
    windowToggleMaximize: (): Promise<void> => ipcRenderer.invoke('system:window-toggle-maximize'),
    windowClose: (): Promise<void> => ipcRenderer.invoke('system:window-close'),
    windowIsMaximized: (): Promise<boolean> => ipcRenderer.invoke('system:window-is-maximized'),
    onWindowState: (cb: (maximized: boolean) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, maximized: boolean) => cb(maximized);
      ipcRenderer.on('system:window-state', handler);
      return () => ipcRenderer.removeListener('system:window-state', handler);
    },
    openTerminal: (cwd?: string): Promise<void> => ipcRenderer.invoke('system:open-terminal', { cwd }),
  },

  log: {
    subscribe: (): Promise<void> => ipcRenderer.invoke('log:subscribe'),
    unsubscribe: (): Promise<void> => ipcRenderer.invoke('log:unsubscribe'),
    onLine: (cb: (entry: LogEntry) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, entry: LogEntry) => cb(entry);
      ipcRenderer.on('log:line', handler);
      return () => ipcRenderer.removeListener('log:line', handler);
    },
  },

  root: {
    start: (options: RootOptions): Promise<string> => ipcRenderer.invoke('root:start', options),
    cancel: (taskId: string): Promise<void> => ipcRenderer.invoke('root:cancel', { taskId }),
    pause: (taskId: string): Promise<void> => ipcRenderer.invoke('root:pause', { taskId }),
    resume: (taskId: string): Promise<void> => ipcRenderer.invoke('root:resume', { taskId }),
    getContext: (taskId: string): Promise<RootContext | null> => ipcRenderer.invoke('root:get-context', { taskId }),
    onStageChange: (cb: (context: RootContext) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, context: RootContext) => cb(context);
      ipcRenderer.on('root:stage-change', handler);
      return () => ipcRenderer.removeListener('root:stage-change', handler);
    },
  },

  file: {
    list: (path: string, deviceSerial?: string): Promise<Array<{ name: string; path: string; isDir: boolean; size: number; mtime: string; perms: string }>> =>
      ipcRenderer.invoke('file:list', { serial: deviceSerial || '', path }),
    stat: (path: string, deviceSerial?: string): Promise<unknown> =>
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
    pushFolder: (localDir: string, remoteDir: string, deviceSerial?: string): Promise<string> =>
      ipcRenderer.invoke('file:push-folder', { serial: deviceSerial || '', localDir, remoteDir }),
    installApk: (remoteApk: string, deviceSerial?: string): Promise<OperationResult> =>
      ipcRenderer.invoke('file:install-apk', { serial: deviceSerial || '', remoteApk }),
    installLocalApk: (deviceSerial?: string): Promise<string> =>
      ipcRenderer.invoke('file:install-local-apk', { serial: deviceSerial || '' }),
    diskInfo: (deviceSerial?: string, path?: string): Promise<{ total: number; used: number; free: number } | null> =>
      ipcRenderer.invoke('file:disk-info', { serial: deviceSerial || '', path }),
    readText: (path: string, deviceSerial?: string): Promise<string> =>
      ipcRenderer.invoke('file:read-text', { serial: deviceSerial || '', path }),
    quickPaths: (): Promise<Array<{ name: string; path: string }>> => ipcRenderer.invoke('file:quick-paths'),
    listDevices: (): Promise<DeviceInfo[]> => ipcRenderer.invoke('file:list-devices'),
    createFile: (path: string, content?: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:create-file', { serial: deviceSerial || '', path, content }),
    writeFile: (path: string, content: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:write-file', { serial: deviceSerial || '', path, content }),
    chmod: (path: string, mode: string, deviceSerial?: string): Promise<void> =>
      ipcRenderer.invoke('file:chmod', { serial: deviceSerial || '', path, mode }),
    batchRemove: (paths: string[], deviceSerial?: string): Promise<{ success: string[]; failed: Array<{ path: string; error: string }> }> =>
      ipcRenderer.invoke('file:batch-remove', { serial: deviceSerial || '', paths }),
    search: (dir: string, query: string, deviceSerial?: string): Promise<Array<{ name: string; path: string; isDir: boolean; size: number; mtime: string; perms: string }>> =>
      ipcRenderer.invoke('file:search', { serial: deviceSerial || '', pattern: query, path: dir }),
    setCompatMode: (enabled: boolean): Promise<void> => ipcRenderer.invoke('file:set-compat-mode', { enabled }),
    setKeepMtime: (enabled: boolean): Promise<void> => ipcRenderer.invoke('file:set-keep-mtime', { enabled }),
    parseApk: (apkPath: string): Promise<{ package: string; name: string; version: string; icon?: string }> =>
      ipcRenderer.invoke('file:parse-apk', { apkPath }),
    onTransferProgress: (cb: (progress: { file: string; bytes: number; total: number; speed: number }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { file: string; bytes: number; total: number; speed: number }) => cb(progress);
      ipcRenderer.on('file:transfer-progress', handler);
      return () => ipcRenderer.removeListener('file:transfer-progress', handler);
    },
  },

  edlPartition: {
    listLoaders: (): Promise<EdlLoader[]> => ipcRenderer.invoke('edl-part:list-loaders'),
    checkEdlDevice: (): Promise<{ found: boolean; port?: string }> => ipcRenderer.invoke('edl-part:check-edl-device'),
    printGpt: (loader: string): Promise<EdlGptResult> => ipcRenderer.invoke('edl-part:print-gpt', { loader }),
    backupPartition: (opts: { loader: string; label: string; outputFile: string }): Promise<OperationResult> =>
      ipcRenderer.invoke('edl-part:backup-partition', opts),
    restorePartition: (opts: {
      loader: string;
      label: string;
      inputFile: string;
      backupBeforeRestore?: boolean;
      backupOutputDir?: string;
      verifyAfterRestore?: boolean;
    }): Promise<OperationResult> => ipcRenderer.invoke('edl-part:restore-partition', opts),
    erasePartition: (opts: { loader: string; label: string }): Promise<OperationResult> =>
      ipcRenderer.invoke('edl-part:erase-partition', opts),
    verifyPartition: (opts: { loader: string; label: string; filePath: string }): Promise<OperationResult & { matched?: boolean }> =>
      ipcRenderer.invoke('edl-part:verify-partition', opts),
    resetDevice: (loader: string): Promise<OperationResult> => ipcRenderer.invoke('edl-part:reset-device', { loader }),
    getHistory: (): Promise<EdlHistoryEntry[]> => ipcRenderer.invoke('edl-part:get-history'),
    clearHistory: (): Promise<void> => ipcRenderer.invoke('edl-part:clear-history'),
    onProgress: (cb: (progress: { stage: string; percent: number; message: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { stage: string; percent: number; message: string }) => cb(progress);
      ipcRenderer.on('edl-part:progress', handler);
      return () => ipcRenderer.removeListener('edl-part:progress', handler);
    },
    onTransferProgress: (cb: (progress: { operation: string; percent: number; transferredMiB: number; totalMiB: number; speed: string }) => void): (() => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { operation: string; percent: number; transferredMiB: number; totalMiB: number; speed: string }) => cb(progress);
      ipcRenderer.on('edl-part:transfer-progress', handler);
      return () => ipcRenderer.removeListener('edl-part:transfer-progress', handler);
    },
  },

  agent: {
    search: (query: string): Promise<{ matches: Array<{ path: string; name: string; description: string; confidence: number; explanation: string }>; aiPowered: boolean }> =>
      ipcRenderer.invoke('agent:search', query),
    getAllFeatures: (): Promise<Array<{ path: string; name: string; keywords: string[]; description: string }>> =>
      ipcRenderer.invoke('agent:all-features'),
    getRandomTip: (): Promise<string> => ipcRenderer.invoke('agent:random-tip'),
    getConfig: (): Promise<{ agentApiUrl: string; agentApiKey: string; agentModel: string; agentEnabled: boolean }> =>
      ipcRenderer.invoke('agent:get-config'),
    setConfig: (config: { agentApiUrl?: string; agentApiKey?: string; agentModel?: string; agentEnabled?: boolean }): Promise<void> =>
      ipcRenderer.invoke('agent:set-config', config),
    testConnection: (): Promise<{ success: boolean; message: string }> => ipcRenderer.invoke('agent:test-connection'),
    chat: (messages: Array<{ role: string; content: string }>): Promise<{ reply: string }> =>
      ipcRenderer.invoke('agent:chat', { messages }),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronApi = typeof api;
