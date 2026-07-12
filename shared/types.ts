export type DeviceType =
  | 'adb'
  | 'fastboot'
  | 'qcom_edl'
  | 'sprd_edl'
  | 'emulator'
  | 'unauthorized'
  | 'offline';

export interface DeviceInfo {
  type: DeviceType;
  serial: string;
  port?: string;
  innermodel?: string;
  model?: string;
  androidVersion?: string;
  sdkVersion?: string;
  softVersion?: string;
  isV3?: boolean;
  innermodelName?: string;
  platform?: 'otherpass' | 'v3pash' | 'z10';
  connectedAt?: number;
  cpuAbi?: string;
  density?: string;
  batteryLevel?: number;
  storageTotal?: number;
  storageAvailable?: number;
  buildId?: string;
  buildDate?: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  ts: number;
  level: LogLevel;
  taskId?: string;
  source: string;
  message: string;
  raw?: string;
}

export interface AppSettings {
  windowOpacity: number;
  speedStart: boolean;
  checkUpdateTime: number;
  detailedLog: boolean;
  infoEn: boolean;
  onUserDebug: boolean;
  showDisclaimerOnStart: boolean;
  agentApiUrl: string;
  agentApiKey: string;
  agentModel: string;
  agentEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  windowOpacity: 100,
  speedStart: false,
  checkUpdateTime: 1,
  detailedLog: false,
  infoEn: false,
  onUserDebug: false,
  showDisclaimerOnStart: true,
  agentApiUrl: '',
  agentApiKey: '',
  agentModel: 'gpt-4o-mini',
  agentEnabled: false,
};

export interface SearchMatch {
  path: string;
  name: string;
  description: string;
  confidence: number;
  explanation: string;
}

export interface SearchResult {
  matches: SearchMatch[];
  aiPowered: boolean;
}

export interface ManifestEntry {
  file: string;
  md5: string;
  size: number;
}

export interface VerifyResult {
  file: string;
  ok: boolean;
  expected: string;
  actual: string;
  missing: boolean;
}

export interface IpcChannels {
  'device:current': { args: void; result: DeviceInfo | null };
  'device:wait': { args: { types: DeviceType[]; timeout?: number }; result: DeviceInfo };
  'system:get-settings': { args: void; result: AppSettings };
  'system:set-settings': { args: { settings: Partial<AppSettings> }; result: AppSettings };
  'system:pick-file': { args: { kind: 'open' | 'folder'; filter?: string; multi?: boolean }; result: string | string[] | null };
  'system:open-external': { args: { path: string }; result: void };
  'system:show-in-folder': { args: { path: string }; result: void };
  'system:verify-resources': { args: void; result: VerifyResult[] };
  'system:get-version': { args: void; result: { version: string; buildDate: string } };
  'log:subscribe': { args: void; result: void };
  'log:unsubscribe': { args: void; result: void };
}

export interface IpcEvents {
  'log:line': (entry: LogEntry) => void;
  'device:change': (info: DeviceInfo | null) => void;
}

export type InstallMethod = 'magisk' | 'shinst' | 'peremptory';
export type UninstallMethod = 'mark' | 'direct' | 'script';

export interface MagiskModule {
  id: string;
  name: string;
  version: string;
  versionCode: string;
  author: string;
  status: string;
  description: string;
  updateJson: string;
}

export interface StoreModule {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  downloadUrl: string;
  size?: number;
}

export interface CloudResource {
  name: string;
  filename: string;
  required: boolean;
  extract: boolean;
  extractTo?: string;
  category: string;
  description: string;
  cloudVersion?: string;
  localVersion?: string;
}

export interface ScrcpyOptions {
  noControl?: boolean;
  turnScreenOff?: boolean;
  stayAwake?: boolean;
  record?: string;
  noAudio?: boolean;
  audio?: boolean;
  noClipboardAutosync?: boolean;
  legacyPaste?: boolean;
  showTouches?: boolean;
  maxFps?: number;
  alwaysOnTop?: boolean;
  fullscreen?: boolean;
  windowBorderless?: boolean;
  recordFormat?: 'mp4' | 'mkv';
  bitRate?: number;
  crop?: string;
  windowTitle?: string;
  maxSize?: number;
}

export interface AdbDdMatchResult {
  matched: string[];
  skipped: string[];
}

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion?: string;
  releaseNotes?: string;
  releaseUrl?: string;
  error?: string;
}

export type RebootMode =
  | 'system'
  | 'bootloader'
  | 'recovery'
  | 'edl'
  | 'twrp-temp'
  | 'qmmi'
  | 'ffbm'
  | 'wipe-data'
  | 'fastbootd';

export interface RootOptions {
  nouserdata?: boolean;
  sdkBranch?: 19 | 25 | 27 | 'nd03' | 'nd08';
  modelChoice?: string;
  sdk25Scheme?: 'boot' | 'recovery';
}

export interface RootContext {
  stage: string;
  options: RootOptions;
  innermodel: string;
  isV3: boolean;
  smodel: boolean;
  startedAt: number;
  logs: { ts: number; level: string; msg: string }[];
  error?: { stage: string; message: string; recoverable: boolean };
  edlPort?: string;
  sdkVersion?: string;
  androidVersion?: string;
  softVersion?: string;
  progress: number;
}

export const APP_META = {
  name: 'iMooAgentTool',
  version: '1.1.0',
  buildDate: '2026-06-18',
  copyright: 'Copyright (C) 2026 J1ao',
  author: 'J1ao',
  authorQQ: '',
  authorEmail: '',
  basedOn: 'AllToolBox 1.3.8fix1(独立重写�?',
};
