"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
const electron = require("electron");
const path = require("node:path");
const Store = require("electron-store");
const log = require("electron-log");
const fs = require("node:fs");
const node_events = require("node:events");
const node_child_process = require("node:child_process");
const iconv = require("iconv-lite");
const usb = require("usb");
const crypto = require("node:crypto");
const https = require("node:https");
const node_zlib = require("node:zlib");
function fixAsarPath(p) {
  if (electron.app.isPackaged && p.includes(".asar")) {
    return p.replace(".asar", ".asar.unpacked");
  }
  return p;
}
class Paths {
  /** 应用根目录(dev:项目根,prod:app.getAppPath()) */
  get appRoot() {
    if (electron.app.isPackaged) {
      return electron.app.getAppPath();
    }
    return path.resolve(__dirname, "..", "..");
  }
  /** resources/ 目录(包含 bin/edl/scripts/data/assets) */
  get resources() {
    return path.join(this.appRoot, "resources");
  }
  /** resources/bin/ - 所有 .exe + DLL(asarUnpack,spawn 需要) */
  get bin() {
    return fixAsarPath(path.join(this.resources, "bin"));
  }
  /** resources/bin/edl-ng/ - edl-ng 工具目录(asarUnpack) */
  get edlNg() {
    return fixAsarPath(path.join(this.bin, "edl-ng"));
  }
  /** resources/edl/ - EDL 资源(asarUnpack) */
  get edl() {
    return fixAsarPath(path.join(this.resources, "edl"));
  }
  /** resources/edl/allxml/ - 分区表(asarUnpack) */
  get edlAllxml() {
    return fixAsarPath(path.join(this.resources, "edl", "allxml"));
  }
  /** resources/edl/misc/ - misc xml + img(asarUnpack) */
  get edlMisc() {
    return fixAsarPath(path.join(this.resources, "edl", "misc"));
  }
  /** resources/edl/work/ - 临时工作目录(运行时创建,不在 asar 内) */
  get edlWork() {
    return path.join(this.userData, "edl_work");
  }
  /** resources/edl/eboot.img - 33MB 全零(asarUnpack) */
  get edlEboot() {
    return fixAsarPath(path.join(this.resources, "edl", "eboot.img"));
  }
  /** resources/cache/ - 下载的资源缓存(运行时创建,不在 asar 内) */
  get cache() {
    return path.join(this.userData, "cache");
  }
  /** resources/scripts/ - push 到设备的 .sh(asarUnpack) */
  get scripts() {
    return fixAsarPath(path.join(this.resources, "scripts"));
  }
  /** resources/data/ - 数据文件(asar 内,fs 可读) */
  get data() {
    return path.join(this.resources, "data");
  }
  /** resources/assets/ - 应用自身资源(asar 内,fs 可读) */
  get assets() {
    return path.join(this.resources, "assets");
  }
  /** 应用图标路径 */
  get icon() {
    return path.join(this.assets, "icon.png");
  }
  /** 拼接 bin/ 下的文件路径(asarUnpack) */
  binFile(name) {
    return path.join(this.bin, name);
  }
  /** 拼接 bin/edl-ng/ 下的文件路径(asarUnpack) */
  edlNgFile(name) {
    return path.join(this.edlNg, name);
  }
  /** 拼接 edl/ 下的文件路径(asarUnpack) */
  edlFile(name) {
    return path.join(this.edl, name);
  }
  /** 拼接 edl/misc/ 下的文件路径(asarUnpack) */
  edlMiscFile(name) {
    return path.join(this.edlMisc, name);
  }
  /** 拼接 edl/allxml/ 下的文件路径(asarUnpack) */
  edlAllxmlFile(name) {
    return path.join(this.edlAllxml, name);
  }
  /** 拼接 scripts/ 下的文件路径(asarUnpack) */
  scriptFile(name) {
    return path.join(this.scripts, name);
  }
  /** 拼接 data/ 下的文件路径(asar 内,fs 可读) */
  dataFile(name) {
    return path.join(this.data, name);
  }
  /** 用户数据目录(%APPDATA%/iMooAgentTool) */
  get userData() {
    return electron.app.getPath("userData");
  }
  /** 日志目录(%APPDATA%/iMooAgentTool/logs) */
  get logs() {
    return path.join(this.userData, "logs");
  }
  /** 是否处于开发模式 */
  get isDev() {
    return !electron.app.isPackaged;
  }
}
const paths = new Paths();
const DEFAULT_SETTINGS = {
  windowOpacity: 100,
  speedStart: false,
  checkUpdateTime: 1,
  detailedLog: false,
  infoEn: false,
  onUserDebug: false,
  showDisclaimerOnStart: true
};
const APP_META = {
  version: "1.1.0",
  buildDate: "2026-06-18",
  copyright: "Copyright (C) 2026 J1ao",
  // 作者信息
  author: "J1ao",
  authorQQ: "3038929349",
  // GitHub 仓库地址(留空)
  authorEmail: "1987800833@qq.com",
  // 参考的项目(业务逻辑参考,非代码衍生)
  basedOn: "AllToolBox 1.3.8fix1(业务逻辑参考)"
};
const store = new Store({
  name: "settings",
  defaults: DEFAULT_SETTINGS
});
class Config {
  get(key) {
    return store.get(key);
  }
  set(key, value) {
    store.set(key, value);
  }
  getAll() {
    return {
      windowOpacity: store.get("windowOpacity"),
      speedStart: store.get("speedStart"),
      checkUpdateTime: store.get("checkUpdateTime"),
      detailedLog: store.get("detailedLog"),
      infoEn: store.get("infoEn"),
      onUserDebug: store.get("onUserDebug"),
      showDisclaimerOnStart: store.get("showDisclaimerOnStart")
    };
  }
  setAll(settings) {
    for (const [k, v] of Object.entries(settings)) {
      if (v !== void 0) {
        store.set(k, v);
      }
    }
    return this.getAll();
  }
  reset() {
    store.clear();
    return this.getAll();
  }
}
const config = new Config();
let mainWindow$1 = null;
function setMainWindow(win) {
  mainWindow$1 = win;
}
function getMainWindow() {
  return mainWindow$1;
}
function ensureSingleInstance() {
  const gotLock = electron.app.requestSingleInstanceLock();
  if (!gotLock) {
    electron.app.quit();
    return false;
  }
  electron.app.on("second-instance", () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
  });
  return true;
}
const DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"] || "http://localhost:5173";
let mainWindow = null;
function createMainWindow() {
  const preload = path.join(__dirname, "..", "preload", "preload.js");
  const opacity = config.get("windowOpacity") / 100;
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    show: false,
    opacity,
    backgroundColor: "#0a0a0b",
    title: "iMooAgentTool",
    icon: paths.icon,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  setMainWindow(mainWindow);
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      electron.shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
  if (paths.isDev) {
    mainWindow.loadURL(DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(paths.appRoot, "dist", "index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
    setMainWindow(null);
  });
  mainWindow.on("maximize", () => {
    mainWindow?.webContents.send("system:window-state", { maximized: true });
  });
  mainWindow.on("unmaximize", () => {
    mainWindow?.webContents.send("system:window-state", { maximized: false });
  });
  return mainWindow;
}
function setWindowOpacity(opacity) {
  mainWindow?.setOpacity(Math.max(0, Math.min(1, opacity / 100)));
  config.set("windowOpacity", opacity);
}
function minimizeWindow() {
  mainWindow?.minimize();
}
function toggleMaximizeWindow() {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
}
function closeWindow() {
  mainWindow?.close();
}
function isWindowMaximized() {
  return mainWindow?.isMaximized() ?? false;
}
function buildAppMenu() {
  const isDev = !electron.app.isPackaged;
  const template = [
    {
      label: "文件",
      submenu: [
        {
          label: "退出",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => electron.app.quit()
        }
      ]
    },
    {
      label: "编辑",
      submenu: [
        { role: "undo", label: "撤销" },
        { role: "redo", label: "重做" },
        { type: "separator" },
        { role: "cut", label: "剪切" },
        { role: "copy", label: "复制" },
        { role: "paste", label: "粘贴" },
        { role: "selectAll", label: "全选" }
      ]
    },
    {
      label: "视图",
      submenu: [
        { role: "reload", label: "重新加载" },
        { role: "forceReload", label: "强制重新加载" },
        { role: "toggleDevTools", label: "开发者工具" },
        { type: "separator" },
        { role: "resetZoom", label: "重置缩放" },
        { role: "zoomIn", label: "放大" },
        { role: "zoomOut", label: "缩小" },
        { type: "separator" },
        { role: "togglefullscreen", label: "全屏" }
      ]
    },
    {
      label: "帮助",
      submenu: [
        {
          label: "关于 iMooAgentTool",
          click: () => showAboutDialog()
        },
        ...[],
        {
          label: "反馈 Bug",
          click: () => electron.shell.openExternal(`mailto:${APP_META.authorEmail}`)
        },
        ...isDev ? [
          { type: "separator" },
          {
            label: "开发者:打开日志目录",
            click: () => {
              electron.shell.openPath(paths.logs);
            }
          }
        ] : []
      ]
    }
  ];
  return electron.Menu.buildFromTemplate(template);
}
function showAboutDialog() {
  electron.dialog.showMessageBox(electron.BrowserWindow.getFocusedWindow() ?? void 0, {
    type: "info",
    title: "关于 iMooAgentTool",
    message: `iMooAgentTool ${APP_META.version}`,
    detail: [
      APP_META.copyright,
      "",
      `作者:${APP_META.author}`,
      `QQ:${APP_META.authorQQ}`,
      ...[],
      `邮箱:${APP_META.authorEmail}`,
      "",
      `参考 ${APP_META.basedOn}`,
      "",
      "本工具仅供学习交流,严禁用于商业用途与手表强制解绑。",
      "拾取他人手表请归还失主或联系 110。"
    ].join("\n"),
    buttons: ["确定"]
  });
}
log.transports.file.level = "debug";
log.transports.console.level = "info";
log.transports.file.maxSize = 10 * 1024 * 1024;
const logsDir = paths.logs;
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch {
  }
}
log.transports.file.resolvePathFn = () => path.join(logsDir, `${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.log`);
function cleanOldLogs() {
  try {
    const files = fs.readdirSync(logsDir);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1e3;
    for (const f of files) {
      if (!f.endsWith(".log")) continue;
      const full = path.join(logsDir, f);
      const stat = fs.statSync(full);
      if (now - stat.mtimeMs > sevenDays) {
        fs.unlinkSync(full);
      }
    }
  } catch {
  }
}
class LoggerClass {
  static _instance;
  bus = new node_events.EventEmitter();
  subscriberCount = 0;
  static get instance() {
    if (!this._instance) {
      this._instance = new LoggerClass();
    }
    return this._instance;
  }
  constructor() {
    this.bus.setMaxListeners(50);
    cleanOldLogs();
  }
  log(entry) {
    const prefix = `[${new Date(entry.ts).toISOString()}] [${entry.level.toUpperCase()}] [${entry.source}]`;
    const msg = entry.raw ? `${entry.message}
  raw: ${entry.raw}` : entry.message;
    const line = `${prefix} ${msg}`;
    switch (entry.level) {
      case "debug":
        log.debug(line);
        break;
      case "info":
        log.info(line);
        break;
      case "warn":
        log.warn(line);
        break;
      case "error":
        log.error(line);
        break;
    }
    this.bus.emit("log", entry);
    if (this.subscriberCount > 0) {
      for (const w of electron.BrowserWindow.getAllWindows()) {
        if (!w.isDestroyed()) {
          w.webContents.send("log:line", entry);
        }
      }
    }
  }
  debug(source, message, raw) {
    this.log({ ts: Date.now(), level: "debug", source, message, raw });
  }
  info(source, message, raw) {
    this.log({ ts: Date.now(), level: "info", source, message, raw });
  }
  warn(source, message, raw) {
    this.log({ ts: Date.now(), level: "warn", source, message, raw });
  }
  error(source, message, raw) {
    this.log({ ts: Date.now(), level: "error", source, message, raw });
  }
  /** 创建子 logger,自动填 source */
  child(source) {
    return new ChildLogger(this, source);
  }
  /** 内部监听(如 DeviceService 等待日志) */
  onLog(cb) {
    this.bus.on("log", cb);
    return () => this.bus.off("log", cb);
  }
  addSubscriber() {
    this.subscriberCount++;
  }
  removeSubscriber() {
    this.subscriberCount = Math.max(0, this.subscriberCount - 1);
  }
}
class ChildLogger {
  constructor(parent, source) {
    this.parent = parent;
    this.source = source;
  }
  debug(message, raw) {
    this.parent.debug(this.source, message, raw);
  }
  info(message, raw) {
    this.parent.info(this.source, message, raw);
  }
  warn(message, raw) {
    this.parent.warn(this.source, message, raw);
  }
  error(message, raw) {
    this.parent.error(this.source, message, raw);
  }
  log(level, message, raw) {
    this.parent.log({ ts: Date.now(), level, source: this.source, message, raw });
  }
}
const Logger = LoggerClass;
const TIMEOUT = {
  /** 设备检测/属性读取(adb devices / fastboot devices / lsusb / getprop) */
  device: 5e3,
  /** 短 shell 命令(setprop / input tap / am start / pm path 等) */
  shell: 1e4,
  /** 列目录 / 文件操作(ls / mkdir / rm / mv / cp) */
  fileOp: 15e3,
  /** 一般 shell 命令(pm list / cmd package compile / chmod 等) */
  shellLong: 3e4,
  /** 刷分区 / 重启(fh_loader --sendxml / QSaharaServer) */
  flash: 6e4,
  /** APK 安装(adb install / pm install-create+write+commit) */
  install: 12e4,
  /** 大文件传输(push/pull 大分区镜像) */
  transfer: 3e5,
  /** 全盘备份/恢复(9008 全分区读写 + 7z 压缩) */
  backup: 6e5,
  /** 等待开机完成(adb wait-for-device + boot_completed 轮询) */
  bootComplete: 12e4
};
const ISV3_THRESHOLDS = [
  { innermodel: "ND07", minVersion: "1.5.1" },
  { innermodel: "ND01", minVersion: "3.3.2" },
  { innermodel: "I32", minVersion: "3.1.0" },
  { innermodel: "I25D", minVersion: "1.5.8" },
  { innermodel: "I25C", minVersion: "1.9.1" },
  { innermodel: "I25", minVersion: "2.5.1" },
  { innermodel: "I20", minVersion: "2.8.1" }
];
function compareVersion(a, b) {
  const partsA = a.split(".");
  const partsB = b.split(".");
  const len = Math.max(partsA.length, partsB.length);
  for (let i = 0; i < len; i++) {
    const numA = parseInt(partsA[i] ?? "0", 10) || 0;
    const numB = parseInt(partsB[i] ?? "0", 10) || 0;
    if (numA !== numB) {
      return numA - numB;
    }
  }
  return 0;
}
function checkIsV3(innermodel, softVersion) {
  for (const rule of ISV3_THRESHOLDS) {
    if (rule.innermodel === innermodel) {
      return compareVersion(softVersion, rule.minVersion) >= 0;
    }
  }
  return false;
}
function decode(buf, encoding = "gbk") {
  if (encoding === "utf-8") {
    return buf.toString("utf-8");
  }
  return iconv.decode(buf, "gbk");
}
const logger$C = Logger.instance.child("SubprocessPool");
class SubprocessPoolClass {
  tasks = /* @__PURE__ */ new Map();
  bus = new node_events.EventEmitter();
  /**
   * 执行子进程,等待完成
   * @throws {SpawnError} 退出码非 0 或被 kill
   */
  async spawn(opts) {
    const { cmd, args, cwd, timeout = 0, encoding = "gbk", taskId, env } = opts;
    const captureStdout = opts.captureStdout !== false;
    const silent = opts.silent ?? false;
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(cmd, args, {
        cwd,
        env: { ...process.env, ...env },
        windowsHide: true,
        shell: false
      });
      if (taskId) {
        this.tasks.set(taskId, {
          taskId,
          cmd,
          args,
          startedAt: start,
          process: proc
        });
      }
      const stdoutChunks = [];
      const stderrChunks = [];
      let stdoutStr = "";
      let stderrStr = "";
      let stdoutBuf = "";
      let stderrBuf = "";
      let killed = false;
      let timeoutHandle;
      const processLine = (buf, chunk, cb) => {
        const decoded = decode(chunk, encoding);
        const combined = buf + decoded;
        const lines = combined.split(/\r?\n/);
        const remaining = lines.pop() ?? "";
        for (const line of lines) {
          if (line.trim()) {
            cb?.(line);
            this.bus.emit("line", { taskId, line, stream: "stdout" });
          }
        }
        return remaining;
      };
      proc.stdout?.on("data", (chunk) => {
        if (captureStdout) stdoutChunks.push(chunk);
        stdoutBuf = processLine(stdoutBuf, chunk, opts.onStdout);
        stdoutStr += decode(chunk, encoding);
      });
      proc.stderr?.on("data", (chunk) => {
        if (captureStdout) stderrChunks.push(chunk);
        stderrBuf = processLine(stderrBuf, chunk, opts.onStderr);
        stderrStr += decode(chunk, encoding);
      });
      if (timeout > 0) {
        timeoutHandle = setTimeout(() => {
          killed = true;
          if (!silent) logger$C.warn(`超时(${timeout}ms),kill 进程: ${cmd} ${args.join(" ")}`);
          proc.kill("SIGTERM");
          setTimeout(() => {
            if (!proc.killed) {
              proc.kill("SIGKILL");
            }
          }, 5e3);
        }, timeout);
      }
      proc.on("error", (err) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (taskId) this.tasks.delete(taskId);
        if (!silent && err.code !== "ENOENT") {
          logger$C.error(`启动失败: ${cmd} ${args.join(" ")} - ${err.message}`);
        }
        reject(new SpawnError(`启动失败: ${err.message}`, -1, "", "", 0, false, killed));
      });
      proc.on("close", (code, signal) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (taskId) this.tasks.delete(taskId);
        if (stdoutBuf.trim()) {
          opts.onStdout?.(stdoutBuf);
          this.bus.emit("line", { taskId, line: stdoutBuf, stream: "stdout" });
        }
        if (stderrBuf.trim()) {
          opts.onStderr?.(stderrBuf);
          this.bus.emit("line", { taskId, line: stderrBuf, stream: "stderr" });
        }
        const duration = Date.now() - start;
        const result = {
          exitCode: code,
          stdout: captureStdout ? Buffer.concat(stdoutChunks).toString("utf-8") || stdoutStr : stdoutStr,
          stderr: captureStdout ? Buffer.concat(stderrChunks).toString("utf-8") || stderrStr : stderrStr,
          duration,
          signal: signal ?? void 0,
          killed
        };
        if (code === 0 && !killed) {
          if (!silent) logger$C.debug(`完成(${duration}ms): ${cmd} ${args.join(" ")}`);
          resolve(result);
        } else if (killed) {
          reject(new SpawnError(`进程被 kill: ${cmd}`, code ?? -1, result.stdout, result.stderr, duration, false, true));
        } else {
          reject(
            new SpawnError(
              `退出码 ${code}: ${cmd} ${args.join(" ")}`,
              code ?? -1,
              result.stdout,
              result.stderr,
              duration,
              false,
              false
            )
          );
        }
      });
    });
  }
  /**
   * 流式执行,返回行迭代器(用于实时日志场景)
   */
  async *spawnStreaming(opts) {
    const queue = [];
    let done = false;
    let error = null;
    let waiter = null;
    const onLine = (line) => {
      queue.push(line);
      waiter?.(true);
      waiter = null;
    };
    this.spawn({ ...opts, onStdout: onLine, onStderr: onLine, captureStdout: false }).then(() => {
      done = true;
      waiter?.(true);
      waiter = null;
    }).catch((e) => {
      error = e;
      done = true;
      waiter?.(true);
      waiter = null;
    });
    while (true) {
      if (queue.length > 0) {
        yield queue.shift();
        continue;
      }
      if (done) {
        if (error) throw error;
        return;
      }
      await new Promise((resolve) => {
        waiter = resolve;
      });
    }
  }
  /** kill 指定任务 */
  kill(taskId, signal = "SIGTERM") {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    logger$C.warn(`kill 任务 ${taskId}: ${task.cmd} ${task.args.join(" ")}`);
    return task.process.kill(signal);
  }
  /** 列出所有运行中任务 */
  list() {
    return Array.from(this.tasks.values());
  }
  /** 监听所有子进程的行输出(用于日志面板) */
  onLine(cb) {
    this.bus.on("line", cb);
    return () => this.bus.off("line", cb);
  }
}
class SpawnError extends Error {
  constructor(message, exitCode, stdout, stderr, duration, cancelled, killed) {
    super(message);
    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;
    this.duration = duration;
    this.cancelled = cancelled;
    this.killed = killed;
    this.name = "SpawnError";
  }
}
const SubprocessPool = new SubprocessPoolClass();
const MODEL_MAP = {
  I12: { model: "Z2", platform: "otherpash" },
  IB: { model: "Z3", platform: "otherpash" },
  I13C: { model: "Z5A", platform: "otherpash" },
  I13: { model: "Z5/Z5Q", platform: "otherpash" },
  I19: { model: "Z5Pro", platform: "otherpash" },
  I18: { model: "Z6", platform: "otherpash" },
  I20: { model: "Z6巅峰版", platform: "v3pash" },
  I25: { model: "Z7", platform: "v3pash" },
  I25C: { model: "Z7A", platform: "v3pash" },
  I25D: { model: "Z7S", platform: "v3pash" },
  I32: { model: "Z8", platform: "v3pash" },
  ND07: { model: "Z8A", platform: "v3pash" },
  ND01: { model: "Z9", platform: "v3pash" },
  ND03: { model: "Z10", platform: "z10" },
  ND08: { model: "Z11", platform: "z10" }
};
const logger$B = Logger.instance.child("DeviceService");
class DeviceServiceClass {
  static _instance;
  currentInfo = null;
  listeners = /* @__PURE__ */ new Set();
  running = false;
  /** 兜底轮询定时器(10 秒) */
  fallbackTimer = null;
  /** USB 事件 debounce 定时器 */
  debounceTimer = null;
  /** 防止 detectOnce 重入 */
  detecting = false;
  lastNotify = "";
  static get instance() {
    if (!this._instance) {
      this._instance = new DeviceServiceClass();
    }
    return this._instance;
  }
  constructor() {
  }
  /** 当前设备状态(立即返回,不轮询) */
  current() {
    return this.currentInfo;
  }
  /**
   * 等待任一类型设备(阻塞,带超时)
   * 对应原 device_check.exe [adb|fastboot|qcom_edl|...]
   */
  async waitFor(types, timeout = 6e4) {
    const start = Date.now();
    logger$B.info(`等待设备类型: ${types.join(", ")}(超时 ${timeout}ms)`);
    return new Promise((resolve, reject) => {
      const check = () => {
        const info = this.currentInfo;
        if (info && types.includes(info.type)) {
          logger$B.info(`检测到设备: ${info.type} (${info.serial})`);
          resolve(info);
          return;
        }
        if (Date.now() - start > timeout) {
          reject(new Error(`等待设备超时(${timeout}ms)`));
          return;
        }
        setTimeout(check, 500);
      };
      check();
    });
  }
  /** 监听设备变化 */
  onChange(cb) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
  /**
   * 启动设备监听(USB 事件驱动 + 10 秒兜底轮询)
   * - USB connect/disconnect 事件 → 800ms debounce → detectOnce 确认
   * - 10 秒兜底轮询:捕获非物理插拔的状态变化(如 ADB 授权切换)
   */
  start() {
    if (this.running) return;
    this.running = true;
    logger$B.info("设备监听已启动(USB 事件 + 10秒兜底轮询)");
    const onUsbChange = () => {
      this.scheduleDetect(800);
    };
    try {
      usb.webusb.addEventListener("connect", onUsbChange);
      usb.webusb.addEventListener("disconnect", onUsbChange);
    } catch (e) {
      logger$B.warn(`USB 事件注册失败,降级为纯轮询: ${e.message}`);
    }
    this._usbChangeHandler = onUsbChange;
    setImmediate(() => void this.detectAndUpdate());
    this.fallbackTimer = setInterval(() => {
      void this.detectAndUpdate();
    }, 1e4);
  }
  _usbChangeHandler = null;
  /** 停止监听 */
  stop() {
    this.running = false;
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    if (this._usbChangeHandler) {
      try {
        usb.webusb.removeEventListener("connect", this._usbChangeHandler);
        usb.webusb.removeEventListener("disconnect", this._usbChangeHandler);
      } catch {
      }
      this._usbChangeHandler = null;
    }
    logger$B.info("设备监听已停止");
  }
  /** debounce 调度 detectAndUpdate(避免 USB 事件连发) */
  scheduleDetect(delay) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      void this.detectAndUpdate();
    }, delay);
  }
  /** 执行一次检测并更新状态(防重入) */
  async detectAndUpdate() {
    if (this.detecting) return;
    this.detecting = true;
    try {
      const info = await this.detectOnce();
      this.update(info);
    } catch {
    } finally {
      this.detecting = false;
    }
  }
  /** 一次检测:adb → fastboot → 9008 */
  async detectOnce() {
    const adbInfo = await this.detectAdb();
    if (adbInfo) return adbInfo;
    const fastbootInfo = await this.detectFastboot();
    if (fastbootInfo) return fastbootInfo;
    const edlInfo = await this.detectEdl();
    if (edlInfo) return edlInfo;
    return null;
  }
  /** 检测 ADB 设备 */
  // 原 device_check.exe adb:解析 adb devices 输出
  async detectAdb() {
    const adbPath = this.resolveTool("adb");
    if (!adbPath) return null;
    try {
      const result = await SubprocessPool.spawn({
        cmd: adbPath,
        args: ["devices"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      const lines = result.stdout.split("\n").slice(1).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/^(\S+)\s+(\S+)$/);
        if (!m) continue;
        const [, serial, state] = m;
        let type;
        if (serial.startsWith("emulator-")) {
          type = "emulator";
        } else if (state === "unauthorized") {
          type = "unauthorized";
        } else if (state === "offline") {
          type = "offline";
        } else if (state === "device") {
          type = "adb";
        } else {
          continue;
        }
        const info = {
          type,
          serial,
          connectedAt: Date.now()
        };
        if (type === "adb") {
          await this.fillAdbProps(info, adbPath);
        }
        return info;
      }
    } catch {
    }
    return null;
  }
  /**
   * 解析工具路径
   * - Windows:用 resources/bin/<name>.exe
   * - Linux/macOS:优先用系统 PATH 中的同名工具(无 .exe),fallback 到 resources/bin/<name>.exe
   * - 若文件不存在,返回 null(设备检测跳过,不报错)
   */
  resolveTool(name) {
    const isWindows = process.platform === "win32";
    const exeName = isWindows ? `${name}.exe` : name;
    const localPath = paths.binFile(exeName);
    if (fs.existsSync(localPath)) {
      return localPath;
    }
    if (!isWindows) {
      return name;
    }
    return null;
  }
  /** 填充 ADB 设备属性 */
  // 原 root.bat:134-158 多次调用 adb shell getprop
  // 增强:读取更多属性 + 填充 isV3/innermodelName/platform + 电量/存储
  async fillAdbProps(info, adbPath) {
    const cmd = adbPath ?? this.resolveTool("adb");
    if (!cmd) return;
    const props = [
      "ro.product.innermodel",
      "ro.product.model",
      "ro.build.version.release",
      "ro.build.version.sdk",
      "ro.product.current.softversion",
      "ro.product.cpu.abi",
      "ro.sf.lcd_density",
      "ro.build.id",
      "ro.build.date"
    ];
    try {
      const result = await SubprocessPool.spawn({
        cmd,
        args: ["shell", "getprop"].concat(props.map((p) => `[${p}]:`)),
        encoding: "gbk",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      const map = {};
      for (const line of result.stdout.split("\n")) {
        const m = line.match(/^\[([^\]]+)\]:\s*\[([^\]]*)\]/);
        if (m) {
          map[m[1]] = m[2];
        }
      }
      info.innermodel = map["ro.product.innermodel"];
      info.model = map["ro.product.model"];
      info.androidVersion = map["ro.build.version.release"];
      info.sdkVersion = map["ro.build.version.sdk"];
      info.softVersion = map["ro.product.current.softversion"];
      info.cpuAbi = map["ro.product.cpu.abi"] || void 0;
      info.density = map["ro.sf.lcd_density"] || void 0;
      info.buildId = map["ro.build.id"] || void 0;
      info.buildDate = map["ro.build.date"] || void 0;
      if (info.innermodel && info.softVersion) {
        info.isV3 = checkIsV3(info.innermodel, info.softVersion);
      }
      if (info.innermodel) {
        const modelInfo = MODEL_MAP[info.innermodel];
        if (modelInfo) {
          info.innermodelName = modelInfo.model;
          info.platform = modelInfo.platform;
        }
      }
    } catch {
    }
    await this.fillBatteryAndStorage(info, cmd);
  }
  /** 读取电量和存储容量(ADB 模式) */
  async fillBatteryAndStorage(info, cmd) {
    try {
      const batteryResult = await SubprocessPool.spawn({
        cmd,
        args: ["shell", "dumpsys", "battery"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      const levelMatch = batteryResult.stdout.match(/level:\s*(\d+)/i);
      if (levelMatch) {
        info.batteryLevel = parseInt(levelMatch[1], 10);
      }
    } catch {
    }
    try {
      const dfResult = await SubprocessPool.spawn({
        cmd,
        args: ["shell", "df", "/sdcard"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      const lines = dfResult.stdout.split("\n").filter((l) => l.trim());
      if (lines.length >= 2) {
        const parts = lines[lines.length - 1].split(/\s+/);
        if (parts.length >= 4) {
          const totalKb = parseInt(parts[1], 10);
          const availKb = parseInt(parts[3], 10);
          if (!isNaN(totalKb)) info.storageTotal = totalKb * 1024;
          if (!isNaN(availKb)) info.storageAvailable = availKb * 1024;
        }
      }
    } catch {
    }
  }
  /** 检测 Fastboot 设备 */
  async detectFastboot() {
    const fastbootPath = this.resolveTool("fastboot");
    if (!fastbootPath) return null;
    try {
      const result = await SubprocessPool.spawn({
        cmd: fastbootPath,
        args: ["devices"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      const lines = result.stdout.split("\n").map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/^(\S+)\s+fastboot/);
        if (m) {
          return {
            type: "fastboot",
            serial: m[1],
            connectedAt: Date.now()
          };
        }
      }
    } catch {
    }
    return null;
  }
  /** 检测 9008 EDL(通过 lsusb.exe) */
  // 原 edlport.bat:lsusb | find "Qualcomm HS-USB QDLoader 9008"
  async detectEdl() {
    const lsusbPath = this.resolveTool("lsusb");
    if (!lsusbPath) return null;
    try {
      const result = await SubprocessPool.spawn({
        cmd: lsusbPath,
        args: [],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      for (const line of result.stdout.split("\n")) {
        if (line.includes("Qualcomm HS-USB QDLoader 9008")) {
          const portMatch = line.match(/COM(\d+)/i);
          const port = portMatch ? `COM${portMatch[1]}` : void 0;
          return {
            type: "qcom_edl",
            serial: "9008",
            port,
            connectedAt: Date.now()
          };
        }
      }
    } catch {
    }
    return null;
  }
  /** 更新当前设备状态并通知监听者 */
  update(info) {
    const key = info ? `${info.type}:${info.serial}:${info.port ?? ""}` : "none";
    if (key === this.lastNotify) return;
    this.lastNotify = key;
    this.currentInfo = info;
    logger$B.info(`设备状态变更: ${key}`);
    for (const cb of this.listeners) {
      try {
        cb(info);
      } catch (e) {
        logger$B.error(`监听器异常: ${e.message}`);
      }
    }
    for (const w of electron.BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send("device:change", info);
      }
    }
  }
}
const DeviceService = DeviceServiceClass;
const logger$A = Logger.instance.child("ResourceService");
class ResourceServiceClass {
  static _instance;
  manifestPath = paths.dataFile("manifest.json");
  static get instance() {
    if (!this._instance) {
      this._instance = new ResourceServiceClass();
    }
    return this._instance;
  }
  constructor() {
  }
  /**
   * 校验所有 bin/ 文件的完整性
   * 若 manifest.json 不存在(首次运行或开发模式),返回空数组(不阻塞启动)
   */
  async verify() {
    const manifest = this.loadManifest();
    if (!manifest) {
      logger$A.warn("manifest.json 不存在,跳过校验(首次运行或开发模式)");
      return [];
    }
    const results = [];
    for (const entry of manifest) {
      const fullPath = paths.binFile(entry.file);
      const result = await this.verifyFile(fullPath, entry);
      results.push(result);
      if (!result.ok) {
        logger$A.warn(`资源校验失败: ${entry.file} (expected=${entry.md5}, actual=${result.actual}, missing=${result.missing})`);
      }
    }
    const failed = results.filter((r) => !r.ok);
    if (failed.length === 0) {
      logger$A.info(`资源校验通过(${results.length} 个文件)`);
    } else {
      logger$A.error(`资源校验失败 ${failed.length}/${results.length} 个文件`);
    }
    return results;
  }
  async verifyFile(fullPath, entry) {
    try {
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) {
        return { file: entry.file, ok: false, expected: entry.md5, actual: "", missing: true };
      }
      const md5 = await this.computeMd5(fullPath);
      return {
        file: entry.file,
        ok: md5 === entry.md5,
        expected: entry.md5,
        actual: md5,
        missing: false
      };
    } catch {
      return { file: entry.file, ok: false, expected: entry.md5, actual: "", missing: true };
    }
  }
  computeMd5(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("md5");
      const stream = fs.createReadStream(filePath);
      stream.on("data", (data) => hash.update(data));
      stream.on("end", () => resolve(hash.digest("hex")));
      stream.on("error", reject);
    });
  }
  loadManifest() {
    try {
      const content = fs.readFileSync(this.manifestPath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  /**
   * 生成 manifest.json(开发时用,扫描 resources/bin/ 计算所有文件 MD5)
   * 运行:`node -e "require('./electron/services/ResourceService').instance.generateManifest()"`
   */
  async generateManifest() {
    const entries = [];
    const files = fs.readdirSync(paths.bin);
    for (const file of files) {
      const fullPath = paths.binFile(file);
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;
      const md5 = await this.computeMd5(fullPath);
      entries.push({ file, md5, size: stat.size });
    }
    fs.writeFileSync(this.manifestPath, JSON.stringify(entries, null, 2), "utf-8");
    logger$A.info(`manifest.json 已生成(${entries.length} 个文件)`);
    return entries;
  }
}
const ResourceService = ResourceServiceClass;
const logger$z = Logger.instance.child("TerminalService");
class TerminalServiceClass {
  /** 打开终端,cwd 设为 resources/bin(含 adb.exe) */
  openTerminal() {
    const cwd = paths.bin;
    const isWindows = process.platform === "win32";
    try {
      if (isWindows) {
        node_child_process.spawn("cmd", ["/k", `title iMooAgentTool - ADB Shell`], {
          cwd,
          detached: true,
          shell: true,
          stdio: "ignore"
        });
      } else {
        const terminals = [
          "x-terminal-emulator",
          "gnome-terminal",
          "konsole",
          "xfce4-terminal",
          "xterm"
        ];
        for (const term of terminals) {
          try {
            node_child_process.spawn(term, ["--working-directory", cwd], {
              cwd,
              detached: true,
              shell: true,
              stdio: "ignore"
            });
            logger$z.info(`已打开终端: ${term}`);
            return;
          } catch {
          }
        }
        throw new Error("未找到可用的终端模拟器");
      }
      logger$z.info(`已打开终端(cwd=${cwd})`);
    } catch (e) {
      logger$z.error(`打开终端失败: ${e.message}`);
      throw e;
    }
  }
}
const TerminalService = new TerminalServiceClass();
const logger$y = Logger.instance;
function registerSystemIpc() {
  electron.ipcMain.handle("system:get-settings", () => config.getAll());
  electron.ipcMain.handle(
    "system:set-settings",
    (_evt, { settings }) => {
      const updated = config.setAll(settings);
      if (settings.windowOpacity !== void 0) {
        setWindowOpacity(settings.windowOpacity);
      }
      return updated;
    }
  );
  electron.ipcMain.handle("system:set-window-opacity", (_evt, { opacity }) => {
    setWindowOpacity(opacity);
  });
  electron.ipcMain.handle(
    "system:pick-file",
    async (_evt, opts) => {
      const win = electron.BrowserWindow.getFocusedWindow() ?? void 0;
      if (opts.kind === "folder") {
        const result2 = await electron.dialog.showOpenDialog(win, {
          properties: [opts.multi ? "multiSelections" : "openDirectory"].filter(
            Boolean
          )
        });
        if (result2.canceled) return null;
        return opts.multi ? result2.filePaths : result2.filePaths[0];
      }
      const filters = parseFilter(opts.filter);
      const result = await electron.dialog.showOpenDialog(win, {
        properties: [
          "openFile",
          ...opts.multi ? ["multiSelections"] : []
        ],
        filters
      });
      if (result.canceled) return null;
      return opts.multi ? result.filePaths : result.filePaths[0];
    }
  );
  electron.ipcMain.handle("system:open-external", (_evt, { path: path2 }) => {
    electron.shell.openExternal(path2);
  });
  electron.ipcMain.handle("system:show-in-folder", (_evt, { path: path2 }) => {
    electron.shell.showItemInFolder(path2);
  });
  electron.ipcMain.handle("system:verify-resources", async () => {
    return ResourceService.instance.verify();
  });
  electron.ipcMain.handle("system:get-version", () => ({
    version: APP_META.version,
    buildDate: APP_META.buildDate
  }));
  electron.ipcMain.handle("system:window-minimize", () => minimizeWindow());
  electron.ipcMain.handle("system:window-toggle-maximize", () => toggleMaximizeWindow());
  electron.ipcMain.handle("system:window-close", () => closeWindow());
  electron.ipcMain.handle("system:window-is-maximized", () => isWindowMaximized());
  electron.ipcMain.handle("system:open-terminal", () => {
    try {
      TerminalService.openTerminal();
      return { success: true };
    } catch (e) {
      logger$y.error("system", `打开终端失败: ${e.message}`);
      return { success: false, error: e.message };
    }
  });
  logger$y.info("ipc", "system:* 通道已注册");
}
function parseFilter(filter) {
  if (!filter) {
    return [{ name: "所有文件", extensions: ["*"] }];
  }
  const parts = filter.split("|");
  const filters = [];
  for (let i = 0; i + 1 < parts.length; i += 2) {
    const name = parts[i];
    const exts = parts[i + 1].split(";").map((e) => e.replace(/^\*\./, "").trim()).filter(Boolean);
    filters.push({ name, extensions: exts.length ? exts : ["*"] });
  }
  return filters.length ? filters : [{ name: "所有文件", extensions: ["*"] }];
}
const logger$x = Logger.instance;
function registerDeviceIpc() {
  electron.ipcMain.handle("device:current", () => {
    return DeviceService.instance.current();
  });
  electron.ipcMain.handle(
    "device:wait",
    (_evt, { types, timeout }) => {
      return DeviceService.instance.waitFor(types, timeout);
    }
  );
  logger$x.info("ipc", "device:* 通道已注册");
}
function registerLogIpc() {
  electron.ipcMain.handle("log:subscribe", () => {
    Logger.instance.addSubscriber();
  });
  electron.ipcMain.handle("log:unsubscribe", () => {
    Logger.instance.removeSubscriber();
  });
}
const logger$w = Logger.instance.child("AdbService");
class AdbServiceClass {
  // Windows: resources/bin/adb.exe,Linux/macOS: 系统 PATH 的 adb
  adbPath = process.platform === "win32" ? paths.binFile("adb.exe") : "adb";
  /** adb devices */
  async devices() {
    const result = await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["devices"],
      encoding: "utf-8",
      timeout: TIMEOUT.device,
      cwd: paths.bin
    });
    return result.stdout.split("\n").slice(1).map((l) => l.trim()).filter((l) => l.length > 0 && l.includes("	device"));
  }
  /**
   * 执行 adb shell 命令
   * @param cmd shell 命令
   * @param opts.timeout 超时(默认 30000ms)
   * @param opts.root 是否用 root 执行(su -c)
   */
  async shell(cmd, opts = {}) {
    const args = ["shell"];
    if (opts.root) {
      args.push(`su -c '${cmd.replace(/'/g, "'\\''")}'`);
    } else {
      args.push(cmd);
    }
    const result = await SubprocessPool.spawn({
      cmd: this.adbPath,
      args,
      encoding: "gbk",
      timeout: opts.timeout ?? 3e4,
      cwd: paths.bin
    });
    return result.stdout;
  }
  /** 获取单个 prop 值 */
  // 原 root.bat:134:adb shell getprop ro.product.innermodel
  async getprop(prop) {
    const out = await this.shell(`getprop ${prop}`, { timeout: TIMEOUT.device });
    return out.trim();
  }
  /** 安装 APK */
  // 原 instapp.bat:
  //   install:adb install -r -t -d
  //   data:push /data/app/<random>/base.apk + chown system:system
  //   create:pm install-create + install-write + install-commit
  //   3install:push + am start VIEW intent
  async install(apkPath, method = "install") {
    switch (method) {
      case "install":
        return this.installDirect(apkPath);
      case "data":
        return this.installData(apkPath);
      case "3install":
        return this.install3rd(apkPath);
      case "create":
        return this.installCreate(apkPath);
    }
  }
  // adb install -r -t -d
  async installDirect(apkPath) {
    try {
      const result = await SubprocessPool.spawn({
        cmd: this.adbPath,
        args: ["install", "-r", "-t", "-d", apkPath],
        encoding: "gbk",
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        onStdout: (line) => logger$w.info(`install: ${line}`)
      });
      const success = result.stdout.includes("Success");
      return { success };
    } catch (e) {
      logger$w.error(`安装失败: ${e.message}`);
      return { success: false };
    }
  }
  /**
   * data 安装方式:push 到 /data/app/ + pm install
   * 对应原 instapp.bat 的 data 分支
   * 适用:adb install 失败时的备选(权限问题),需要 shell 可写 /data/app
   */
  async installData(apkPath) {
    try {
      const remotePath = `/data/app/tmp_${Date.now()}.apk`;
      logger$w.info(`data 安装: push ${apkPath} → ${remotePath}`);
      await this.push(apkPath, remotePath);
      const out = await this.shell(`pm install -r '${remotePath}'`, { timeout: TIMEOUT.install });
      try {
        await this.shell(`rm -f '${remotePath}'`, { timeout: TIMEOUT.device });
      } catch {
      }
      const success = out.includes("Success");
      if (!success) {
        logger$w.error(`data 安装失败: ${out.trim()}`);
      }
      return { success };
    } catch (e) {
      logger$w.error(`data 安装异常: ${e.message}`);
      return { success: false };
    }
  }
  /**
   * 3install 安装方式:push + am start VIEW intent(触发设备端安装器)
   * 对应原 instapp.bat 的 3install 分支
   * 适用:让用户在设备上手动确认安装(第三方安装器)
   * 注意:异步安装,无法立即确认结果,返回 success=true 只表示 intent 发送成功
   */
  async install3rd(apkPath) {
    try {
      const fileName = path.basename(apkPath).replace(/[^a-zA-Z0-9._-]/g, "_");
      const remotePath = `/sdcard/${fileName}`;
      logger$w.info(`3install: push ${apkPath} → ${remotePath}`);
      await this.push(apkPath, remotePath);
      const out = await this.shell(
        `am start -a android.intent.action.VIEW -d "file://${remotePath}" -t application/vnd.android.package-archive`,
        { timeout: TIMEOUT.shell }
      );
      const success = !out.toLowerCase().includes("error");
      if (!success) {
        logger$w.error(`3install 启动安装器失败: ${out.trim()}`);
      }
      return { success };
    } catch (e) {
      logger$w.error(`3install 异常: ${e.message}`);
      return { success: false };
    }
  }
  /**
   * create 安装方式:pm install-create + install-write + install-commit(分片安装)
   * 对应原 instapp.bat 的 create 分支
   * 适用:大 APK 分片安装,或需要精细控制安装流程
   */
  async installCreate(apkPath) {
    try {
      const createOut = await this.shell("pm install-create -r -t", { timeout: TIMEOUT.shell });
      const m = createOut.match(/\[(\d+)\]/);
      if (!m) {
        logger$w.error(`install-create 失败: ${createOut.trim()}`);
        return { success: false };
      }
      const sessionId = m[1];
      logger$w.info(`create 安装: session ${sessionId}`);
      const size = fs.statSync(apkPath).size;
      const fileName = path.basename(apkPath);
      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
      const writeOut = await this.shell(
        `pm install-write -S ${size} ${sessionId} ${safeFileName} '${apkPath.replace(/'/g, "'\\''")}'`,
        { timeout: TIMEOUT.transfer }
      );
      if (!writeOut.includes("Success")) {
        logger$w.error(`install-write 失败: ${writeOut.trim()}`);
        try {
          await this.shell(`pm install-abandon ${sessionId}`, { timeout: TIMEOUT.device });
        } catch {
        }
        return { success: false };
      }
      const commitOut = await this.shell(`pm install-commit ${sessionId}`, { timeout: TIMEOUT.install });
      const success = commitOut.includes("Success");
      if (!success) {
        logger$w.error(`install-commit 失败: ${commitOut.trim()}`);
        try {
          await this.shell(`pm install-abandon ${sessionId}`, { timeout: TIMEOUT.device });
        } catch {
        }
      }
      return { success };
    } catch (e) {
      logger$w.error(`create 安装异常: ${e.message}`);
      return { success: false };
    }
  }
  /** 卸载应用 */
  async uninstall(pkg) {
    try {
      const result = await SubprocessPool.spawn({
        cmd: this.adbPath,
        args: ["uninstall", pkg],
        encoding: "gbk",
        timeout: TIMEOUT.shellLong,
        cwd: paths.bin
      });
      return result.stdout.includes("Success");
    } catch (e) {
      logger$w.error(`卸载失败: ${e.message}`);
      return false;
    }
  }
  /** push 文件 */
  async push(local, remote) {
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["push", local, remote],
      encoding: "gbk",
      timeout: TIMEOUT.transfer,
      cwd: paths.bin
    });
  }
  /** pull 文件 */
  async pull(remote, local) {
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["pull", remote, local],
      encoding: "gbk",
      timeout: TIMEOUT.transfer,
      cwd: paths.bin
    });
  }
  /** 重启设备 */
  // 原 rebootpro.bat:1 system / 2 bootloader / 3 recovery / 4 edl / sideload
  async reboot(target) {
    const arg = target === "system" ? "reboot" : `reboot ${target}`;
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: arg.split(" "),
      encoding: "utf-8",
      timeout: TIMEOUT.shell,
      cwd: paths.bin
    });
  }
  /** 等待开机完成 */
  // 原 boot_completed.bat:轮询 getprop sys.boot_completed == 1
  async waitForBoot(timeout = 12e4) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const out = await this.shell("getprop sys.boot_completed", { timeout: TIMEOUT.device });
        if (out.trim() === "1") {
          try {
            await this.shell("pm list packages", { timeout: TIMEOUT.shell });
            return;
          } catch {
          }
        }
      } catch {
      }
      await new Promise((r) => setTimeout(r, 2e3));
    }
    throw new Error(`等待开机超时(${timeout}ms)`);
  }
  /** 尝试获取 root 权限 */
  // 原 adbdevice.bat root:先 adb root,失败则 su -c
  async root() {
    try {
      const result = await SubprocessPool.spawn({
        cmd: this.adbPath,
        args: ["root"],
        encoding: "gbk",
        timeout: TIMEOUT.shell,
        cwd: paths.bin
      });
      if (result.stdout.includes("restarting") || result.stdout.includes("already")) {
        await new Promise((r) => setTimeout(r, 2e3));
        return { granted: true, method: "adb-root" };
      }
    } catch {
    }
    try {
      const out = await this.shell("id -u", { timeout: TIMEOUT.device, root: true });
      if (out.trim() === "0") {
        return { granted: true, method: "su" };
      }
    } catch {
    }
    return { granted: false, method: "none" };
  }
  /** 列出已安装应用 */
  // 原 unapp.bat:1 全部 / 2 第三方
  async listPackages(thirdParty = false) {
    const args = ["shell", "pm", "list", "packages"];
    if (thirdParty) args.push("-3");
    const result = await SubprocessPool.spawn({
      cmd: this.adbPath,
      args,
      encoding: "gbk",
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin
    });
    return result.stdout.split("\n").map((l) => l.replace("package:", "").trim()).filter(Boolean);
  }
  /** am start */
  async amStart(activity, extras) {
    const args = ["shell", "am", "start", "-n", activity];
    if (extras) {
      for (const [k, v] of Object.entries(extras)) {
        args.push("--es", k, v);
      }
    }
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args,
      encoding: "gbk",
      timeout: TIMEOUT.shell,
      cwd: paths.bin
    });
  }
  /** input tap */
  // 原 automagisk.bat:input tap 304 26 等
  async inputTap(x, y) {
    await this.shell(`input tap ${x} ${y}`, { timeout: TIMEOUT.device });
  }
  /** input swipe */
  async inputSwipe(x1, y1, x2, y2, ms) {
    await this.shell(`input swipe ${x1} ${y1} ${x2} ${y2} ${ms}`, { timeout: TIMEOUT.device });
  }
  /** setprop */
  async setProp(prop, value) {
    const safeProp = prop.replace(/[^a-zA-Z0-9._-]/g, "_");
    const safeValue = value.replace(/'/g, "'\\''");
    await this.shell(`setprop ${safeProp} '${safeValue}'`, { timeout: TIMEOUT.device });
  }
  /** cmd package compile */
  // 原 ROOT-SDK27.bat:cmd package compile -m everything-profile -f com.xtc.i3launcher
  async cmdPackageCompile(pkg, mode = "everything-profile") {
    const safePkg = pkg.replace(/[^a-zA-Z0-9._-]/g, "_");
    await this.shell(`cmd package compile -m ${mode} -f ${safePkg}`, { timeout: TIMEOUT.flash });
  }
  /** 打开充电可用 */
  // 原 opencharge.bat:adb shell "su -c setprop persist.sys.charge.usable true"
  async openCharge() {
    await this.shell("setprop persist.sys.charge.usable true", { timeout: TIMEOUT.device, root: true });
  }
  /** 读取设备 build 属性(按 build.txt 列表) */
  // 原 listbuild.bat:for each prop in build.txt, adb shell getprop
  async readBuildProps() {
    const buildTxtPath = paths.dataFile("build.txt");
    let content = "";
    try {
      content = fs.readFileSync(buildTxtPath, "utf-8");
    } catch {
      return [];
    }
    const results = [];
    for (const line of content.split("\n")) {
      const m = line.match(/^([^=]+)=(.+)$/);
      if (!m) continue;
      const [, key, label] = m;
      try {
        const value = (await this.getprop(key.trim())).trim();
        if (value) {
          results.push({ key: key.trim(), label: label.trim(), value });
        }
      } catch {
      }
    }
    return results;
  }
  /** 无线 ADB:连接设备 */
  // 原 wifiadb.bat:adb connect <ip:port>
  async wifiConnect(ip, port = 5555) {
    try {
      const result = await SubprocessPool.spawn({
        cmd: this.adbPath,
        args: ["connect", `${ip}:${port}`],
        encoding: "utf-8",
        timeout: TIMEOUT.shell,
        cwd: paths.bin
      });
      return result.stdout.includes("connected");
    } catch {
      return false;
    }
  }
  /** 无线 ADB:断开 */
  async wifiDisconnect(ip, port = 5555) {
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["disconnect", `${ip}:${port}`],
      encoding: "utf-8",
      timeout: TIMEOUT.device,
      cwd: paths.bin
    });
  }
  /** 无线 ADB:切换到无线模式(adb tcpip 5555) */
  // 原 wifiadb.bat :usbtowifi:adb usb → adb tcpip 5555
  async wifiEnable() {
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["usb"],
      encoding: "utf-8",
      timeout: TIMEOUT.device,
      cwd: paths.bin,
      silent: true
    });
    await SubprocessPool.spawn({
      cmd: this.adbPath,
      args: ["tcpip", "5555"],
      encoding: "utf-8",
      timeout: TIMEOUT.shell,
      cwd: paths.bin
    });
  }
}
const AdbService = new AdbServiceClass();
const logger$v = Logger.instance.child("FastbootService");
class FastbootServiceClass {
  fastbootPath = process.platform === "win32" ? paths.binFile("fastboot.exe") : "fastboot";
  async devices() {
    const result = await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["devices"],
      encoding: "utf-8",
      timeout: TIMEOUT.device,
      cwd: paths.bin
    });
    return result.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && l.includes("fastboot"));
  }
  // 原 ROOT-SDK27.bat:fastboot flash boot new-boot.img
  async flash(partition, img) {
    await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["flash", partition, img],
      encoding: "gbk",
      timeout: TIMEOUT.install,
      cwd: paths.bin,
      onStdout: (line) => logger$v.info(`flash ${partition}: ${line}`)
    });
  }
  // 原 ROOT-SDK27.bat:fastboot erase misc
  async erase(partition) {
    await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["erase", partition],
      encoding: "gbk",
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin
    });
  }
  // 原 rebootpro.bat 临时启动 TWRP:fastboot boot twrp-<innermodel>.img
  async boot(img) {
    await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["boot", img],
      encoding: "gbk",
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin
    });
  }
  async reboot(target) {
    const arg = target === "system" ? "reboot" : `reboot ${target}`;
    await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: arg.split(" "),
      encoding: "utf-8",
      timeout: TIMEOUT.shell,
      cwd: paths.bin
    });
  }
  async getVar(name) {
    const result = await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["getvar", name],
      encoding: "utf-8",
      timeout: TIMEOUT.shell,
      cwd: paths.bin
    });
    return result.stdout.trim();
  }
  async oem(cmd) {
    await SubprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["oem", cmd],
      encoding: "gbk",
      timeout: TIMEOUT.shellLong,
      cwd: paths.bin
    });
  }
}
const FastbootService = new FastbootServiceClass();
const logger$u = Logger.instance.child("EdlService");
class EdlServiceClass {
  fhLoaderPath = paths.binFile("fh_loader.exe");
  qsaharaPath = paths.binFile("QSaharaServer.exe");
  /**
   * 加载 firehose(初始化 9008 通信)
   * 对应 QSaharaServer.bat:QSaharaServer.exe -p \\.\COMn -s 13:<loader>
   * 失败=致命,抛错(调用方决定是否重试)
   */
  async loadFirehose(opts) {
    const loaderPath = paths.edlFile(opts.loader);
    if (!fs.existsSync(loaderPath)) {
      throw new Error(`firehose loader 不存在: ${opts.loader}`);
    }
    try {
      await SubprocessPool.spawn({
        cmd: this.qsaharaPath,
        args: ["-p", `\\\\.\\${opts.port}`, "-s", `13:${loaderPath}`],
        encoding: "gbk",
        timeout: TIMEOUT.flash,
        cwd: paths.bin,
        onStdout: (line) => logger$u.info(`QSaharaServer: ${line}`),
        onStderr: (line) => logger$u.warn(`QSaharaServer stderr: ${line}`)
      });
      logger$u.info(`firehose 加载成功: ${opts.loader}`);
    } catch (e) {
      const err = e;
      logger$u.error(`firehose 加载失败: ${err.message}`, err.stderr);
      throw new Error(`firehose 加载失败: ${err.message}`);
    }
  }
  /**
   * 按分区表 XML 刷入(写)
   * 对应 fh_loader.bat:fh_loader.exe --port=... --memoryname=EMMC --search_path=... --sendxml=... --noprompt
   * 失败=致命,死循环重试(对应原 fh_loader.bat 的 goto run)
   */
  async flashPartitions(opts) {
    const { port, xmlPath, imagesDir } = opts;
    try {
      await SubprocessPool.spawn({
        cmd: this.fhLoaderPath,
        args: [
          `--port=\\\\.\\${port}`,
          "--memoryname=EMMC",
          `--search_path=${imagesDir}`,
          `--sendxml=${xmlPath}`,
          "--noprompt"
        ],
        encoding: "gbk",
        timeout: TIMEOUT.transfer,
        cwd: paths.bin,
        onStdout: (line) => logger$u.info(`fh_loader: ${line}`),
        onStderr: (line) => logger$u.warn(`fh_loader stderr: ${line}`)
      });
      logger$u.info(`分区刷入成功: ${xmlPath}`);
    } catch (e) {
      const err = e;
      logger$u.error(`分区刷入失败: ${err.message}`, err.stderr);
      throw new Error(`分区刷入失败: ${err.message}`);
    }
  }
  /**
   * 按分区表 XML 读取(备份)
   * 对应 fh_loader.exe --convertprogram2read
   */
  async readPartitions(opts) {
    const { port, xmlPath, outputDir } = opts;
    try {
      await SubprocessPool.spawn({
        cmd: this.fhLoaderPath,
        args: [
          `--port=\\\\.\\${port}`,
          "--memoryname=EMMC",
          `--search_path=${outputDir}`,
          `--sendxml=${xmlPath}`,
          "--convertprogram2read",
          "--noprompt"
        ],
        encoding: "gbk",
        timeout: TIMEOUT.backup,
        cwd: paths.bin,
        onStdout: (line) => logger$u.info(`fh_loader read: ${line}`)
      });
      logger$u.info(`分区读取成功: ${xmlPath}`);
    } catch (e) {
      const err = e;
      logger$u.error(`分区读取失败: ${err.message}`, err.stderr);
      throw new Error(`分区读取失败: ${err.message}`);
    }
  }
  /**
   * 重启设备
   * 对应原 qfh_loader.bat:qfh_loader.exe --sendxml=reboot.xml
   * 已合并到 fh_loader.exe(见 plan.md 核心约束)
   * 失败=非致命,跳过 + 提示手动按电源键(对应原 qfh_loader.bat 的语义)
   */
  async reboot(opts) {
    try {
      await SubprocessPool.spawn({
        cmd: this.fhLoaderPath,
        args: [
          `--port=\\\\.\\${opts.port}`,
          "--memoryname=EMMC",
          `--search_path=${paths.edl}`,
          "--sendxml=reboot.xml",
          "--noprompt"
        ],
        encoding: "gbk",
        timeout: TIMEOUT.shellLong,
        cwd: paths.bin,
        onStdout: (line) => logger$u.info(`reboot: ${line}`)
      });
      logger$u.info("设备重启指令已发送");
    } catch (e) {
      logger$u.warn(`9008重启失败!已跳过,可能需要手动按10秒电源键重启: ${e.message}`);
    }
  }
  /**
   * 找 9008 COM 端口
   * 对应原 edlport.bat:lsusb | find "Qualcomm HS-USB QDLoader 9008"
   * 解析括号里的 COMn
   */
  async findPort() {
    const lsusbPath = paths.binFile("lsusb.exe");
    try {
      const result = await SubprocessPool.spawn({
        cmd: lsusbPath,
        args: [],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      for (const line of result.stdout.split("\n")) {
        if (line.includes("Qualcomm HS-USB QDLoader 9008")) {
          const portMatch = line.match(/COM(\d+)/i);
          if (portMatch) {
            return `COM${portMatch[1]}`;
          }
        }
      }
    } catch {
    }
    return null;
  }
  /**
   * 等待 9008 设备出现(轮询,带超时)
   * 对应原 edlport.bat 的循环检测
   */
  async waitForEdl(timeout = 12e4) {
    const start = Date.now();
    logger$u.info(`等待 9008 设备(超时 ${timeout}ms)`);
    while (Date.now() - start < timeout) {
      const port = await this.findPort();
      if (port) {
        logger$u.info(`检测到 9008 设备: ${port}`);
        return port;
      }
      await new Promise((r) => setTimeout(r, 1e3));
    }
    throw new Error("等待 9008 设备超时");
  }
  /**
   * 解析 allxml,返回分区清单
   */
  parseAllXml(xmlPath) {
    try {
      const content = fs.readFileSync(xmlPath, "utf-8");
      const partitions = [];
      const re = /<program\s+([^/]+)\/>/g;
      let m;
      while ((m = re.exec(content)) !== null) {
        const attrs = m[1];
        const get = (name) => {
          const am = attrs.match(new RegExp(`${name}="([^"]+)"`));
          return am?.[1];
        };
        partitions.push({
          label: get("label") ?? "",
          filename: get("filename") ?? "",
          startSector: Number(get("start_sector") ?? 0),
          numSectors: Number(get("num_partition_sectors") ?? 0),
          sizeInKb: Number(get("size_in_KB") ?? 0)
        });
      }
      return partitions;
    } catch (e) {
      logger$u.error(`解析 XML 失败: ${e.message}`);
      return [];
    }
  }
  /**
   * 刷入 misc 分区(写 misc img 让设备进入 qmmi/ffbm/wipe/fastbootd)
   * 对应 rebootpro.bat :flash_device 函数
   * 参数:mode = qmmi/ffbm/wipe/fastbootd, platform = z10/otherpash/v3pash, innermodel
   */
  async flashMisc(opts) {
    const { port, mode, platform, innermodel } = opts;
    let loader;
    let miscXml;
    let imgExt;
    if (platform === "z10") {
      loader = "prog_firehose_ddr.elf";
      miscXml = "misc_ND03.xml";
      imgExt = "img";
    } else if (platform === "otherpash") {
      loader = "msm8909w.mbn";
      miscXml = `misc_${innermodel}.xml`;
      imgExt = "mbn";
    } else {
      loader = "msm8937.mbn";
      miscXml = `misc_${innermodel}.xml`;
      imgExt = "img";
    }
    let imageSrc;
    if (mode === "ffbm") {
      imageSrc = "ffbm.img";
    } else if (mode === "wipe") {
      imageSrc = "wipe.img";
    } else if (mode === "fastbootd") {
      imageSrc = "fastbootd.img";
    } else {
      imageSrc = "misc.img";
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const srcXml = paths.edlMiscFile(miscXml);
    const srcImg = paths.edlMiscFile(imageSrc);
    const dstXml = path.join(workDir, "misc.xml");
    const dstImg = path.join(workDir, `misc.${imgExt}`);
    fs.copyFileSync(srcXml, dstXml);
    fs.copyFileSync(srcImg, dstImg);
    await this.loadFirehose({ port, loader });
    await this.flashPartitions({ port, loader, xmlPath: dstXml, imagesDir: workDir });
    await this.reboot({ port, loader });
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
  }
  // ========== 9008 备份(对应 backup.bat :9008-backup-run) ==========
  /**
   * 9008 EDL 备份:读取所有分区 → 7z 打包
   * 对应 backup.bat:9008-backup-run
   * 参数:innermodel(型号), v3(是否 V3 协议,决定用哪个 loader)
   */
  async backup9008(opts) {
    const { innermodel, v3, outputDir, onProgress } = opts;
    const loader = v3 ? "msm8937.mbn" : "msm8909w.mbn";
    const allxml = paths.edlAllxmlFile(`${innermodel}.xml`);
    if (!fs.existsSync(allxml)) {
      throw new Error(`分区表不存在: ${innermodel}.xml`);
    }
    const now = /* @__PURE__ */ new Date();
    const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    const t = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const backupName = `EDL_${innermodel}_${d}_${t}`;
    const backupDir = path.join(outputDir, backupName);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    onProgress?.("等待 9008 设备...");
    const port = await this.waitForEdl(6e4);
    onProgress?.(`发送引导: ${loader}`);
    await this.loadFirehose({ port, loader });
    await new Promise((r) => setTimeout(r, 2e3));
    onProgress?.("正在备份分区...");
    await SubprocessPool.spawn({
      cmd: this.fhLoaderPath,
      args: [
        `--port=\\\\.\\${port}`,
        "--memoryname=EMMC",
        `--sendxml=${allxml}`,
        "--convertprogram2read",
        "--noprompt",
        `--mainoutputdir=${backupDir}\\`
      ],
      encoding: "gbk",
      timeout: TIMEOUT.backup,
      cwd: paths.bin,
      onStdout: (line) => onProgress?.(line)
    });
    onProgress?.("重启设备...");
    await this.reboot({ port, loader });
    onProgress?.("构建备份文件...");
    try {
      const binImgs = fs.readdirSync(paths.bin).filter((f) => f.endsWith(".img"));
      for (const img of binImgs) {
        const src = path.join(paths.bin, img);
        const dst = path.join(backupDir, img);
        if (!fs.existsSync(dst)) {
          fs.copyFileSync(src, dst);
        }
      }
    } catch {
    }
    fs.copyFileSync(allxml, path.join(backupDir, "rawprogram0.xml"));
    fs.writeFileSync(path.join(backupDir, "v3.txt"), v3 ? "1" : "0", "utf-8");
    onProgress?.("压缩备份文件...");
    const zipPath = path.join(outputDir, `${backupName}.zip`);
    await SubprocessPool.spawn({
      cmd: paths.binFile("7z.exe"),
      args: ["a", "-tzip", "-y", zipPath, `${backupDir}\\`],
      encoding: "utf-8",
      timeout: TIMEOUT.transfer,
      cwd: paths.bin,
      onStdout: (line) => onProgress?.(line)
    });
    try {
      fs.rmSync(backupDir, { recursive: true, force: true });
    } catch {
    }
    onProgress?.(`备份完成: ${zipPath}`);
    return zipPath;
  }
  // ========== 9008 恢复(对应 backup.bat :9008-recover) ==========
  /**
   * 9008 EDL 恢复:从 zip 解压 → 读 v3.txt 选 loader → fh_loader 刷 rawprogram0.xml
   * 对应 backup.bat:9008-recover
   */
  async recover9008(opts) {
    const { zipPath, onProgress } = opts;
    onProgress?.("解压备份文件...");
    const tmpDir = path.join(paths.resources, "backup", "tmp");
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
    await SubprocessPool.spawn({
      cmd: paths.binFile("7z.exe"),
      args: ["x", zipPath, `-o${tmpDir}`, "-aoa"],
      encoding: "utf-8",
      timeout: TIMEOUT.install,
      cwd: paths.bin
    });
    const entries = fs.readdirSync(tmpDir);
    const backupSubdir = entries.find((e) => fs.statSync(path.join(tmpDir, e)).isDirectory());
    if (!backupSubdir) {
      throw new Error("备份文件中没有找到备份目录");
    }
    const backupDir = path.join(tmpDir, backupSubdir);
    const v3Path = path.join(backupDir, "v3.txt");
    let v3 = false;
    try {
      const v3Content = fs.readFileSync(v3Path, "utf-8").trim();
      v3 = v3Content === "1";
    } catch {
    }
    const loader = v3 ? "msm8937.mbn" : "msm8909w.mbn";
    onProgress?.("等待 9008 设备...");
    const port = await this.waitForEdl(6e4);
    onProgress?.(`发送引导: ${loader}`);
    await this.loadFirehose({ port, loader });
    await new Promise((r) => setTimeout(r, 2e3));
    const rawprogramXml = path.join(backupDir, "rawprogram0.xml");
    if (!fs.existsSync(rawprogramXml)) {
      throw new Error("备份文件中没有找到 rawprogram0.xml");
    }
    onProgress?.("正在恢复...");
    await this.flashPartitions({ port, loader, xmlPath: rawprogramXml, imagesDir: backupDir });
    onProgress?.("重启设备...");
    await this.reboot({ port, loader });
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
    }
    onProgress?.("恢复完成");
  }
  // ========== 超级恢复(对应 super_recovery.bat) ==========
  /**
   * 超级恢复:选固件目录 → 自动检测 loader → 逐个刷 rawprogram0/1/2.xml + patch0.xml
   * 对应 super_recovery.bat
   */
  async superRecovery(opts) {
    const { folder, onProgress } = opts;
    let loader = null;
    if (fs.existsSync(path.join(folder, "prog_firehose_ddr.elf"))) {
      loader = "prog_firehose_ddr.elf";
    }
    const files = fs.readdirSync(folder);
    if (!loader && files.some((f) => f.includes("8937"))) {
      loader = "msm8937.mbn";
    }
    if (!loader && files.some((f) => f.includes("8909"))) {
      loader = "msm8909w.mbn";
    }
    if (!loader) {
      throw new Error("选择的目录没有引导文件");
    }
    const hasRawprogram1 = fs.existsSync(path.join(folder, "rawprogram1.xml"));
    const hasRawprogram2 = fs.existsSync(path.join(folder, "rawprogram2.xml"));
    const hasRawprogram0 = fs.existsSync(path.join(folder, "rawprogram0.xml"));
    if (!hasRawprogram0) {
      throw new Error("选择的目录没有可刷录入的 xml");
    }
    onProgress?.("等待 9008 设备...");
    const port = await this.waitForEdl(6e4);
    onProgress?.(`发送引导: ${loader}`);
    await this.loadFirehose({ port, loader });
    await new Promise((r) => setTimeout(r, 2e3));
    if (hasRawprogram1 && hasRawprogram2) {
      for (const xmlName of ["rawprogram0.xml", "rawprogram1.xml", "rawprogram2.xml"]) {
        const xmlPath = path.join(folder, xmlName);
        if (fs.existsSync(xmlPath)) {
          onProgress?.(`刷入 ${xmlName}...`);
          await this.flashPartitions({ port, loader, xmlPath, imagesDir: folder });
        }
      }
      const patchXml = path.join(folder, "patch0.xml");
      if (fs.existsSync(patchXml)) {
        onProgress?.("刷入 patch0.xml...");
        await this.flashPartitions({ port, loader, xmlPath: patchXml, imagesDir: folder });
      }
    } else {
      onProgress?.("刷入 rawprogram0.xml...");
      await this.flashPartitions({
        port,
        loader,
        xmlPath: path.join(folder, "rawprogram0.xml"),
        imagesDir: folder
      });
    }
    onProgress?.("重启设备...");
    await this.reboot({ port, loader });
    onProgress?.("超级恢复完成");
  }
  // ========== 刷入 TWRP(对应 pashtwrp.bat) ==========
  /**
   * EDL 模式刷入 TWRP recovery
   * 对应 pashtwrp.bat
   */
  async flashTwrp(opts) {
    const { innermodel, onProgress } = opts;
    const twrpDir = paths.edlFile("twrp");
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const otherpashModels = ["I12", "IB", "I13C", "I13", "I19", "I18"];
    const loader = otherpashModels.includes(innermodel) ? "msm8909w.mbn" : "msm8937.mbn";
    const twrpXml = path.join(twrpDir, `${innermodel}.xml`);
    const twrpImg = path.join(twrpDir, `${innermodel}.img`);
    if (!fs.existsSync(twrpImg)) {
      throw new Error(`TWRP 镜像不存在: ${innermodel}.img`);
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstXml = path.join(workDir, "recovery.xml");
    const dstImg = path.join(workDir, "recovery.img");
    if (fs.existsSync(twrpXml)) {
      fs.copyFileSync(twrpXml, dstXml);
    } else {
      throw new Error(`TWRP XML 不存在: ${innermodel}.xml`);
    }
    fs.copyFileSync(twrpImg, dstImg);
    const device = DeviceService.instance.current();
    if (device?.type === "adb") {
      onProgress?.("设备在 ADB 模式,重启至 9008...");
      try {
        await AdbService.reboot("edl");
      } catch {
      }
    }
    onProgress?.("等待 9008 设备...");
    const port = await this.waitForEdl(6e4);
    onProgress?.(`发送引导: ${loader}`);
    await this.loadFirehose({ port, loader });
    onProgress?.("开始刷入 recovery...");
    await this.flashPartitions({ port, loader, xmlPath: dstXml, imagesDir: workDir });
    onProgress?.("重启设备...");
    await this.reboot({ port, loader });
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
    onProgress?.("TWRP 刷入完成");
  }
}
const EdlService = new EdlServiceClass();
const logger$t = Logger.instance.child("RebootService");
class RebootServiceClass {
  /**
   * 执行重启
   * 对应 rebootpro.bat 的 9 种模式分发
   */
  async reboot(opts) {
    logger$t.info(`执行重启: mode=${opts.mode}, innermodel=${opts.innermodel ?? "-"}, platform=${opts.platform ?? "-"}`);
    switch (opts.mode) {
      case "system":
        return this.rebootSystem();
      case "bootloader":
        return this.rebootBootloader();
      case "recovery":
        return this.rebootRecovery(opts.innermodel);
      case "edl":
        return this.rebootEdl(opts.innermodel);
      case "twrp-temp":
        return this.rebootTwrpTemp(opts.innermodel);
      case "qmmi":
      case "ffbm":
      case "wipe-data":
      case "fastbootd":
        return this.flashMisc(opts.mode, opts.platform, opts.innermodel);
    }
  }
  // ========== 模式 1:重启至系统 ==========
  // 对应 rebootpro.bat:35-44 :rebootP-reboot
  async rebootSystem() {
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await AdbService.reboot("system");
    } else if (device.type === "fastboot") {
      await FastbootService.reboot("system");
    } else if (device.type === "qcom_edl") {
      await this.edlReboot();
    } else {
      throw new Error(`当前设备状态不支持重启至系统: ${device.type}`);
    }
    logger$t.info("已发送重启至系统指令");
  }
  // ========== 模式 2:重启至 Bootloader/Fastboot ==========
  // 对应 rebootpro.bat:72-80 :rebootP-bl
  async rebootBootloader() {
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await AdbService.reboot("bootloader");
    } else if (device.type === "fastboot") {
      await FastbootService.reboot("bootloader");
    } else {
      throw new Error(`当前设备状态不支持重启至 Bootloader: ${device.type}`);
    }
    logger$t.info("已发送重启至 Bootloader 指令");
  }
  // ========== 模式 3:重启至 Recovery ==========
  // 对应 rebootpro.bat:84-92 :rebootP-re
  // ADB 模式:adb reboot recovery
  // Fastboot 模式(rebootpro.bat:94-130 :rebootP-re-bl):boot TWRP → 等 ADB → adb reboot recovery
  async rebootRecovery(innermodel) {
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await AdbService.reboot("recovery");
    } else if (device.type === "fastboot") {
      if (!innermodel) {
        throw new Error("Fastboot 设备重启至 Recovery 需要选择型号");
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await AdbService.reboot("recovery");
    } else {
      throw new Error(`当前设备状态不支持重启至 Recovery: ${device.type}`);
    }
    logger$t.info("已发送重启至 Recovery 指令");
  }
  // ========== 模式 4:重启至 9008 EDL ==========
  // 对应 rebootpro.bat:135-143 :rebootP-edl
  // ADB 模式:adb reboot edl
  // Fastboot 模式(rebootpro.bat:145-181 :rebootP-edl-bl):boot TWRP → 等 ADB → adb reboot edl
  async rebootEdl(innermodel) {
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await AdbService.reboot("edl");
    } else if (device.type === "fastboot") {
      if (!innermodel) {
        throw new Error("Fastboot 设备重启至 9008 需要选择型号");
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await AdbService.reboot("edl");
    } else {
      throw new Error(`当前设备状态不支持重启至 9008: ${device.type}`);
    }
    logger$t.info("已发送重启至 9008 指令");
  }
  /** boot TWRP 并等待 ADB(供 recovery/edl 从 fastboot 模式重启用) */
  // 对应 rebootpro.bat:94-130 / 145-181 的公共流程
  async bootTwrpAndWaitAdb(innermodel) {
    const twrpDir = paths.edlFile("twrp");
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, `${innermodel}.img`);
    if (!fs.existsSync(twrpImg)) {
      throw new Error(`TWRP 镜像不存在: ${innermodel}.img`);
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, "recovery.img");
    fs.copyFileSync(twrpImg, dstImg);
    await FastbootService.boot(dstImg);
    logger$t.info("已临时启动 TWRP,等待 ADB...");
    await DeviceService.instance.waitFor(["adb"], 3e4);
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
  }
  // ========== 模式 5:临时启动 TWRP ==========
  // 对应 rebootpro.bat:185-228 :rebootP-twrp
  async rebootTwrpTemp(innermodel) {
    if (!innermodel) {
      throw new Error("临时启动 TWRP 需要选择型号");
    }
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await AdbService.reboot("bootloader");
      logger$t.info("等待 Fastboot 设备...");
      await DeviceService.instance.waitFor(["fastboot"], 3e4);
    }
    if (device.type !== "fastboot" && device.type !== "adb") {
      throw new Error("临时启动 TWRP 需要 ADB 或 Fastboot 设备");
    }
    const twrpDir = paths.edlFile("twrp");
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, `${innermodel}.img`);
    if (!fs.existsSync(twrpImg)) {
      throw new Error(`TWRP 镜像不存在: ${innermodel}.img`);
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, "recovery.img");
    fs.copyFileSync(twrpImg, dstImg);
    await FastbootService.boot(dstImg);
    logger$t.info("已临时启动 TWRP");
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
  }
  // ========== 模式 6-9:misc 进入 qmmi/ffbm/wipe-data/fastbootd ==========
  // 对应 rebootpro.bat:230-266 + :flash_device (268-343)
  async flashMisc(mode, platform, innermodel) {
    if (!innermodel || !platform) {
      throw new Error(`${mode} 需要选择型号和平台`);
    }
    let port = await EdlService.findPort();
    if (!port) {
      const device = DeviceService.instance.current();
      if (device?.type === "adb") {
        logger$t.info("设备在 ADB 模式,重启至 9008...");
        await AdbService.reboot("edl");
        port = await EdlService.waitForEdl(6e4);
      } else {
        throw new Error("未检测到 9008 设备,请将设备进入 9008 模式");
      }
    }
    const edlMode = mode === "wipe-data" ? "wipe" : mode;
    await EdlService.flashMisc({ port, mode: edlMode, platform, innermodel });
    const modeLabel = {
      qmmi: "QMMI",
      ffbm: "FFBM",
      wipe: "恢复出厂设置",
      fastbootd: "fastbootd"
    };
    logger$t.info(`已进入 ${modeLabel[edlMode]}`);
  }
  // ========== 9008 设备重启(模式 1 的 EDL 分支) ==========
  // 对应 rebootpro.bat:46-68 :rebootP-reboot-edl
  async edlReboot() {
    const port = await EdlService.findPort();
    if (!port) {
      throw new Error("未检测到 9008 设备");
    }
    const loaders = ["msm8937.mbn", "msm8909w.mbn", "prog_firehose_ddr.elf"];
    let loaded = false;
    for (const loader of loaders) {
      try {
        await EdlService.loadFirehose({ port, loader });
        loaded = true;
        break;
      } catch {
      }
    }
    if (!loaded) {
      throw new Error("所有 firehose loader 加载失败");
    }
    await EdlService.reboot({ port, loader: "msm8937.mbn" });
  }
}
const RebootService = new RebootServiceClass();
const logger$s = Logger.instance;
function registerRebootIpc() {
  electron.ipcMain.handle(
    "reboot:execute",
    async (_evt, opts) => {
      try {
        await RebootService.reboot(opts);
        return { success: true };
      } catch (e) {
        logger$s.error("reboot", `重启失败: ${e.message}`);
        return { success: false, error: e.message };
      }
    }
  );
  logger$s.info("ipc", "reboot:* 通道已注册");
}
const logger$r = Logger.instance.child("download");
async function downloadWithAria2(opts) {
  const aria2cPath = paths.binFile("aria2c.exe");
  const { urls, filename, outputDir, onProgress, taskId } = opts;
  const args = [
    `--uri-selector=adaptive`,
    `--console-log-level=notice`,
    `--summary-interval=0`,
    `--check-certificate=false`,
    `--max-connection-per-server=8`,
    `--split=8`,
    `--continue=false`,
    `--allow-overwrite=true`,
    `--lowest-speed-limit=1M`,
    `--user-agent=pan.baidu.com`,
    `--dir=${outputDir}`,
    `--out=${filename}`,
    ...urls
  ];
  logger$r.info(`开始下载: ${filename}(${urls.length} 个镜像)`);
  const result = await SubprocessPool.spawn({
    cmd: aria2cPath,
    args,
    encoding: "utf-8",
    timeout: TIMEOUT.backup,
    // 10 分钟
    cwd: paths.bin,
    taskId,
    onStdout: (line) => {
      const m = line.match(/\((\d+)%\)/);
      if (m && onProgress) {
        onProgress(Number(m[1]));
      }
    },
    onStderr: (line) => logger$r.debug(`aria2c: ${line}`)
  });
  if (result.exitCode !== 0) {
    throw new Error(`下载失败: ${filename} (exit ${result.exitCode})`);
  }
  const outputPath = `${outputDir}/${filename}`;
  logger$r.info(`下载完成: ${outputPath}`);
  return outputPath;
}
const logger$q = Logger.instance.child("CloudService");
class CloudServiceClass {
  linksConfig = null;
  /** 加载 links.json */
  loadConfig() {
    if (this.linksConfig) return this.linksConfig;
    try {
      const content = fs.readFileSync(paths.dataFile("links.json"), "utf-8");
      const config2 = JSON.parse(content);
      this.linksConfig = config2;
      return config2;
    } catch (e) {
      logger$q.error(`加载 links.json 失败: ${e.message}`);
      return { mirrors: [], resources: {} };
    }
  }
  /** 列出所有资源(排除"版本"分类,那些是内部用的) */
  async list() {
    const config2 = this.loadConfig();
    return Object.entries(config2.resources).filter(([, r]) => r.category !== "版本" && r.category !== "工具箱").map(([name, r]) => ({
      name,
      ...r,
      localVersion: this.getLocalVersion(name)
    }));
  }
  /** 按分类列出 */
  async listByCategory() {
    const all = await this.list();
    const grouped = {};
    for (const r of all) {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    }
    return grouped;
  }
  /** 下载单个资源 */
  async download(name, onProgress) {
    const config2 = this.loadConfig();
    const res = config2.resources[name];
    if (!res) {
      throw new Error(`未知资源: ${name}`);
    }
    const urls = config2.mirrors.map((m) => `${m}${res.filename}`);
    if (urls.length === 0) {
      throw new Error("无可用镜像");
    }
    const outputDir = res.extractTo ? path.join(paths.resources, res.extractTo) : paths.cache;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    logger$q.info(`下载资源: ${name} → ${outputDir}/${res.filename}`);
    await downloadWithAria2({
      urls,
      filename: res.filename,
      outputDir,
      onProgress
    });
    if (res.extract) {
      const zipPath = path.join(outputDir, res.filename);
      const extractTo = path.join(paths.resources, res.extractTo ?? "");
      if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
      }
      logger$q.info(`解压: ${zipPath} → ${extractTo}`);
      await SubprocessPool.spawn({
        cmd: paths.binFile("7z.exe"),
        args: ["x", zipPath, `-o${extractTo}`, "-aoa"],
        encoding: "utf-8",
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        onStdout: (line) => logger$q.debug(`7z: ${line}`)
      });
    }
    logger$q.info(`资源 ${name} 处理完成`);
  }
  /** 下载多个资源 */
  async downloadMultiple(names, onProgress) {
    for (const name of names) {
      await this.download(name, (p) => onProgress?.(name, p));
    }
  }
  /** 获取本地资源版本(从 resversion.json) */
  getLocalVersion(name) {
    try {
      const content = fs.readFileSync(paths.dataFile("resversion.json"), "utf-8");
      const versions = JSON.parse(content);
      return versions[name];
    } catch {
      return void 0;
    }
  }
  /** 检查更新(比对本地 vs 云端版本) */
  async checkUpdates() {
    const local = await this.list();
    const cloudVersions = {};
    try {
      const config2 = this.loadConfig();
      const urls = config2.mirrors.map((m) => `${m}resversion.txt`);
      const tmpDir = paths.cache;
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      await downloadWithAria2({
        urls,
        filename: "resversion.txt",
        outputDir: tmpDir
      });
      const content = fs.readFileSync(path.join(tmpDir, "resversion.txt"), "utf-8");
      for (const line of content.split("\n")) {
        const m = line.match(/^(\S+?)=(.+)$/);
        if (m) {
          cloudVersions[m[1]] = m[2].trim();
        }
      }
    } catch (e) {
      logger$q.warn(`拉取云端版本失败: ${e.message}`);
    }
    return local.map((r) => ({
      resource: { ...r, cloudVersion: cloudVersions[r.name] },
      updateAvailable: Boolean(
        cloudVersions[r.name] && cloudVersions[r.name] !== r.localVersion
      )
    }));
  }
}
const CloudService = new CloudServiceClass();
const logger$p = Logger.instance;
function registerCloudIpc() {
  electron.ipcMain.handle("cloud:list", async () => {
    return CloudService.list();
  });
  electron.ipcMain.handle("cloud:list-by-category", async () => {
    return CloudService.listByCategory();
  });
  electron.ipcMain.handle("cloud:download", async (_evt, { name }) => {
    try {
      await CloudService.download(name, (percent) => {
        for (const w of electron.BrowserWindow.getAllWindows()) {
          if (!w.isDestroyed()) {
            w.webContents.send("cloud:progress", { name, percent });
          }
        }
      });
      return { success: true };
    } catch (e) {
      logger$p.error("cloud", `下载失败: ${e.message}`);
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("cloud:check-updates", async () => {
    return CloudService.checkUpdates();
  });
  logger$p.info("ipc", "cloud:* 通道已注册");
}
const logger$o = Logger.instance.child("ScrcpyService");
class ScrcpyServiceClass extends node_events.EventEmitter {
  scrcpyPath = paths.binFile("scrcpy.exe");
  running = /* @__PURE__ */ new Map();
  /** 启动 scrcpy,返回 pid */
  async launch(opts) {
    const args = this.buildArgs(opts);
    logger$o.info(`启动 scrcpy: ${args.join(" ")}`);
    const proc = node_child_process.spawn(this.scrcpyPath, args, {
      cwd: paths.bin,
      windowsHide: false,
      detached: false
    });
    const pid = proc.pid ?? -1;
    const entry = { pid, opts, process: proc, startedAt: Date.now() };
    this.running.set(pid, entry);
    this.emit("process-change", { type: "launch", pid });
    proc.on("error", (err) => {
      logger$o.error(`scrcpy 启动失败: ${err.message}`);
      this.running.delete(pid);
      this.emit("process-change", { type: "exit", pid });
    });
    proc.on("exit", (code) => {
      logger$o.info(`scrcpy 退出(pid=${pid}, code=${code})`);
      if (this.running.has(pid)) {
        this.running.delete(pid);
        this.emit("process-change", { type: "exit", pid, code: code ?? void 0 });
      }
    });
    return pid;
  }
  /** 停止指定 scrcpy */
  async stop(pid) {
    const entry = this.running.get(pid);
    if (!entry) {
      logger$o.warn(`scrcpy pid=${pid} 不存在`);
      return;
    }
    this.running.delete(pid);
    try {
      entry.process.kill();
      logger$o.info(`已停止 scrcpy pid=${pid}`);
    } catch (e) {
      logger$o.error(`停止 scrcpy 失败: ${e.message}`);
    }
    this.emit("process-change", { type: "exit", pid });
  }
  /** 停止所有 scrcpy */
  async stopAll() {
    for (const pid of Array.from(this.running.keys())) {
      await this.stop(pid);
    }
  }
  /** 列出运行中的 scrcpy */
  listRunning() {
    return Array.from(this.running.values()).map((e) => ({
      pid: e.pid,
      opts: e.opts,
      startedAt: e.startedAt
    }));
  }
  /** 构建 scrcpy 命令行参数 */
  buildArgs(opts) {
    const args = [];
    if (opts.noControl) args.push("--no-control");
    if (opts.turnScreenOff) args.push("--turn-screen-off");
    if (opts.stayAwake) args.push("--stay-awake");
    if (opts.record) args.push("--record", opts.record);
    if (opts.noAudio) args.push("--no-audio");
    if (opts.audio) args.push("--audio");
    if (opts.noClipboardAutosync) args.push("--no-clipboard-autosync");
    if (opts.legacyPaste) args.push("--legacy-paste");
    if (opts.showTouches) args.push("--show-touches");
    if (opts.maxFps) args.push("--max-fps", String(opts.maxFps));
    if (opts.alwaysOnTop) args.push("--always-on-top");
    if (opts.fullscreen) args.push("--fullscreen");
    if (opts.windowBorderless) args.push("--window-borderless");
    if (opts.recordFormat) args.push("--record-format", opts.recordFormat);
    if (opts.bitRate) args.push("--bit-rate", String(opts.bitRate));
    if (opts.crop) args.push("--crop", opts.crop);
    if (opts.windowTitle) args.push("--window-title", opts.windowTitle);
    if (opts.maxSize) args.push("--max-size", String(opts.maxSize));
    return args;
  }
}
const ScrcpyService = new ScrcpyServiceClass();
const logger$n = Logger.instance;
function registerScrcpyIpc() {
  electron.ipcMain.handle("scrcpy:launch", async (_evt, opts) => {
    try {
      const pid = await ScrcpyService.launch(opts);
      return { success: true, pid };
    } catch (e) {
      logger$n.error("scrcpy", `启动失败: ${e.message}`);
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("scrcpy:stop", async (_evt, { pid }) => {
    await ScrcpyService.stop(pid);
    return { success: true };
  });
  electron.ipcMain.handle("scrcpy:stop-all", async () => {
    await ScrcpyService.stopAll();
    return { success: true };
  });
  electron.ipcMain.handle("scrcpy:list", () => {
    return ScrcpyService.listRunning();
  });
  electron.ipcMain.handle("scrcpy:subscribe", (evt) => {
    const sender = evt.sender;
    const handler = (data) => {
      if (!sender.isDestroyed()) {
        sender.send("scrcpy:process-change", data);
      }
    };
    ScrcpyService.on("process-change", handler);
    sender.once("did-finish-load", () => {
      ScrcpyService.off("process-change", handler);
    });
    sender.on("destroyed", () => {
      ScrcpyService.off("process-change", handler);
    });
  });
  logger$n.info("ipc", "scrcpy:* 通道已注册");
}
const logger$m = Logger.instance.child("AppService");
const DEFAULT_AUTOSTART_PACKAGES = [
  "com.tencent.qqlite",
  "com.tencent.qqwatch",
  "com.tencent.wechatkids"
];
class AppServiceClass {
  /**
   * 解除 Z10 [1.0.1] 安装限制
   * 对应原 z10openinst.bat:openinst 标签
   */
  async unlockZ10Install() {
    const steps = [
      { name: "检查 ADB 设备", status: "pending" },
      { name: "推送 switch.db 到 /sdcard/", status: "pending" },
      { name: 'adb root(必须含 "restarting")', status: "pending" },
      { name: "等待 3 秒", status: "pending" },
      { name: "setprop persist.sys.xtc.adb_port 1", status: "pending" },
      { name: "setprop persist.sys.adb.install 1", status: "pending" },
      { name: "cp switch.db 到桌面数据库", status: "pending" },
      { name: "setprop ctl.restart zygote(软重启)", status: "pending" },
      { name: "安装 z10apk.Apk", status: "pending" },
      { name: "安装 z10apk1.Apk", status: "pending" }
    ];
    const runStep = async (i, fn) => {
      steps[i].status = "running";
      try {
        await fn();
        steps[i].status = "success";
        return true;
      } catch (e) {
        steps[i].status = "failed";
        steps[i].message = e.message;
        return false;
      }
    };
    let ok = await runStep(0, async () => {
      const devices = await AdbService.devices();
      if (devices.length === 0) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) {
      return { success: false, steps, error: steps[0].message };
    }
    const switchDbPath = paths.binFile("switch.db");
    ok = await runStep(1, async () => {
      await AdbService.push(switchDbPath, "/sdcard/");
    });
    if (!ok) return { success: false, steps, error: steps[1].message };
    const rootOk = await runStep(2, async () => {
      const result = await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["root"],
        encoding: "gbk",
        timeout: TIMEOUT.shell,
        cwd: paths.bin
      });
      if (!result.stdout.includes("restarting") && !result.stdout.includes("already")) {
        throw new Error("获取 root 权限时出错,可能没有降级或者不在 QMMI");
      }
    });
    if (!rootOk) {
      return { success: false, steps, error: steps[2].message };
    }
    await runStep(3, async () => {
      await new Promise((r) => setTimeout(r, 3e3));
    });
    ok = await runStep(4, async () => {
      await AdbService.setProp("persist.sys.xtc.adb_port", "1");
    });
    if (!ok) return { success: false, steps, error: steps[4].message };
    ok = await runStep(5, async () => {
      await AdbService.setProp("persist.sys.adb.install", "1");
    });
    if (!ok) return { success: false, steps, error: steps[5].message };
    ok = await runStep(6, async () => {
      await AdbService.shell(
        "cp -R /sdcard/switch.db /data/data/com.xtc.i3launcher/databases/switch.db",
        { timeout: TIMEOUT.shell }
      );
    });
    if (!ok) return { success: false, steps, error: steps[6].message };
    ok = await runStep(7, async () => {
      await AdbService.setProp("ctl.restart", "zygote");
      await new Promise((r) => setTimeout(r, 8e3));
    });
    if (!ok) return { success: false, steps, error: steps[7].message };
    ok = await runStep(8, async () => {
      const apkPath = path.join(paths.resources, "apks", "z10apk.Apk");
      const result = await this.installApk(apkPath);
      if (!result.success) {
        throw new Error(result.error ?? "安装失败");
      }
    });
    if (!ok) return { success: false, steps, error: steps[8].message };
    ok = await runStep(9, async () => {
      const apkPath = path.join(paths.resources, "apks", "z10apk1.Apk");
      const result = await this.installApk(apkPath);
      if (!result.success) {
        throw new Error(result.error ?? "安装失败");
      }
    });
    if (!ok) return { success: false, steps, error: steps[9].message };
    logger$m.info("Z10 安装限制解除完成");
    return { success: true, steps };
  }
  /**
   * 设置 QQ/微信开机自启
   * 对应原 qqwxautestart.bat
   * 默认包名:com.tencent.qqlite, com.tencent.qqwatch, com.tencent.wechatkids
   */
  async enableAutoStart(packages = DEFAULT_AUTOSTART_PACKAGES) {
    const results = [];
    for (const pkg of packages) {
      try {
        await AdbService.shell(
          `content call --uri content://com.xtc.launcher.self.start --method METHOD_SELF_START --extra EXTRA_ENABLE:b:true --arg ${pkg}`,
          { timeout: TIMEOUT.shell }
        );
        results.push({ pkg, success: true });
      } catch (e) {
        results.push({ pkg, success: false, error: e.message });
      }
    }
    const success = results.every((r) => r.success);
    logger$m.info(`开机自启设置完成: ${results.filter((r) => r.success).length}/${results.length}`);
    return { success, results };
  }
  /**
   * 安装 APK(adb install -r -t -d)
   * 对应 z10openinst.bat 末尾的两次 install 命令
   */
  async installApk(apkPath) {
    try {
      const result = await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["install", "-r", "-t", "-d", apkPath],
        encoding: "gbk",
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        onStdout: (line) => logger$m.info(`install: ${line}`)
      });
      const success = result.stdout.includes("Success");
      if (!success) {
        return { success: false, error: result.stdout.trim() || "安装失败" };
      }
      return { success: true };
    } catch (e) {
      if (e instanceof SpawnError) {
        return { success: false, error: e.stdout.trim() || e.message };
      }
      return { success: false, error: e.message };
    }
  }
}
const AppService = new AppServiceClass();
const logger$l = Logger.instance;
const DEVICE_TYPE_LABEL = {
  adb: "ADB",
  fastboot: "Fastboot",
  qcom_edl: "9008 (EDL)",
  sprd_edl: "展锐 EDL",
  emulator: "模拟器",
  unauthorized: "已授权",
  offline: "离线"
};
function wrap(handler, opts = {}) {
  const { requireDevice, errorExtra = {}, logPrefix } = opts;
  return async (evt, args) => {
    if (requireDevice) {
      const device = DeviceService.instance.current();
      if (device?.type !== requireDevice) {
        const label = DEVICE_TYPE_LABEL[requireDevice] ?? requireDevice;
        return { success: false, error: `需要 ${label} 设备`, ...errorExtra };
      }
    }
    try {
      return await handler(args, evt);
    } catch (e) {
      const msg = e.message;
      const prefix = logPrefix ?? "IPC";
      logger$l.error(prefix, `操作失败: ${msg}`);
      return { success: false, error: msg, ...errorExtra };
    }
  };
}
function wrapNoArgs(handler, opts = {}) {
  const wrapped = wrap(handler, opts);
  return (evt) => wrapped(evt, void 0);
}
const logger$k = Logger.instance;
function registerAppIpc() {
  electron.ipcMain.handle(
    "app:list",
    wrap(({ thirdParty }) => AdbService.listPackages(thirdParty), {
      logPrefix: "app"
    })
  );
  electron.ipcMain.handle(
    "app:install",
    wrap(
      ({ apk, method }) => AdbService.install(apk, method ?? "install"),
      { logPrefix: "app" }
    )
  );
  electron.ipcMain.handle(
    "app:uninstall",
    wrap(
      ({ pkg }) => AdbService.uninstall(pkg).then((success) => ({ success })),
      { logPrefix: "app" }
    )
  );
  electron.ipcMain.handle(
    "app:unlock-z10",
    wrap(() => AppService.unlockZ10Install(), {
      requireDevice: "adb",
      errorExtra: { steps: [] },
      logPrefix: "app"
    })
  );
  electron.ipcMain.handle(
    "app:enable-autostart",
    wrap(
      ({ packages } = {}) => AppService.enableAutoStart(packages ?? DEFAULT_AUTOSTART_PACKAGES),
      {
        requireDevice: "adb",
        errorExtra: { results: [] },
        logPrefix: "app"
      }
    )
  );
  logger$k.info("ipc", "app:* 通道已注册");
}
const logger$j = Logger.instance.child("OtaService");
class OtaServiceClass {
  /**
   * 启动离线 OTA 升级流程
   * 对应原 ota.bat :run + :root 标签
   */
  async start(opts) {
    const steps = [
      { name: "检查 ADB 设备", status: "pending" },
      { name: "读取设备信息(innermodel/softversion)", status: "pending" },
      { name: "检测 V3 协议(V3 版本无法离线 OTA)", status: "pending" },
      { name: 'adb root(必须含 "restarting")', status: "pending" },
      { name: "adb shell rm -rf /data/ota*", status: "pending" },
      { name: "推送 OTA zip 到 /sdcard/xtc/ota_f_vota.zip", status: "pending" },
      { name: "am start OfflineOtaActivity", status: "pending" },
      { name: '启动 scrcpy 引导用户点击"开始升级"', status: "pending" }
    ];
    const runStep = async (i, fn) => {
      steps[i].status = "running";
      try {
        await fn();
        steps[i].status = "success";
        return true;
      } catch (e) {
        steps[i].status = "failed";
        steps[i].message = e.message;
        return false;
      }
    };
    let innermodel = "";
    let softVersion = "";
    let ok = await runStep(0, async () => {
      const devices = await AdbService.devices();
      if (devices.length === 0) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[0].message };
    ok = await runStep(1, async () => {
      innermodel = await AdbService.getprop("ro.product.innermodel");
      softVersion = await AdbService.getprop("ro.product.current.softversion");
      const model = await AdbService.getprop("ro.product.model");
      logger$j.info(`设备 innermodel=${innermodel}, model=${model}, softversion=${softVersion}`);
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[1].message };
    ok = await runStep(2, async () => {
      const isV3 = checkIsV3(innermodel, softVersion);
      if (isV3) {
        throw new Error("你的手表可能是 V3 版本,无需离线 OTA,也无法离线 OTA");
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[2].message };
    ok = await runStep(3, async () => {
      const result = await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["root"],
        encoding: "gbk",
        timeout: TIMEOUT.shell,
        cwd: paths.bin
      });
      if (!result.stdout.includes("restarting") && !result.stdout.includes("already")) {
        throw new Error("当前不是 QMMI 状态下!");
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[3].message };
    ok = await runStep(4, async () => {
      await AdbService.shell("rm -rf /data/ota*", { timeout: TIMEOUT.fileOp });
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[4].message };
    ok = await runStep(5, async () => {
      await AdbService.shell("mkdir -p /sdcard/xtc", { timeout: TIMEOUT.device });
      await AdbService.push(opts.zipPath, "/sdcard/xtc/ota_f_vota.zip");
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[5].message };
    ok = await runStep(6, async () => {
      await AdbService.amStart(
        "com.xtc.setting/.module.secretcode.view.activity.OfflineOtaActivity"
      );
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[6].message };
    let scrcpyStarted = false;
    await runStep(7, async () => {
      const pid = await ScrcpyService.launch({
        stayAwake: true,
        showTouches: true,
        windowTitle: '请点击手表上的"开始升级"'
      });
      if (pid > 0) {
        scrcpyStarted = true;
        logger$j.info(`已启动 scrcpy (pid=${pid}) 引导用户点击"开始升级"`);
      } else {
        throw new Error("scrcpy 启动失败");
      }
    });
    return {
      success: true,
      steps,
      scrcpyStarted
    };
  }
}
const OtaService = new OtaServiceClass();
const logger$i = Logger.instance.child("MagiskService");
class MagiskServiceClass {
  /**
   * 转义 moduleId 防止命令注入
   * moduleId 只允许字母数字下划线横线点,其他字符替换为 _
   */
  escapeModuleId(id) {
    return id.replace(/[^a-zA-Z0-9_\-.]/g, "_");
  }
  /**
   * 列出已安装模块
   * 对应 magisklist.bat:push list_modules.sh → su -c sh → 解析输出
   */
  async list() {
    const rootResult = await AdbService.root();
    if (!rootResult.granted) {
      throw new Error("没有 root 权限");
    }
    const scriptPath = paths.scriptFile("list_modules.sh");
    await AdbService.push(scriptPath, "/data/local/tmp/list_modules.sh");
    const output = await AdbService.shell("sh /data/local/tmp/list_modules.sh", {
      timeout: TIMEOUT.fileOp,
      root: true
    });
    return this.parseModuleList(output);
  }
  /** 解析 list_modules.sh 的输出 */
  parseModuleList(output) {
    const modules = [];
    const blocks = output.split(/={40,}/).filter((b) => b.trim());
    for (const block of blocks) {
      const lines = block.trim().split("\n");
      const mod = {};
      for (const line of lines) {
        const m = line.match(/^(.+?):\s*(.*)$/);
        if (!m) continue;
        const [, key, value] = m;
        const val = value.trim();
        switch (key.trim()) {
          case "模块ID":
            mod.id = val;
            break;
          case "名称":
            mod.name = val;
            break;
          case "版本":
            mod.version = val;
            break;
          case "内部版本":
            mod.versionCode = val;
            break;
          case "作者":
            mod.author = val;
            break;
          case "状态":
            mod.status = val;
            break;
          case "描述":
            mod.description = val;
            break;
          case "更新地址":
            mod.updateJson = val;
            break;
        }
      }
      if (mod.id) {
        modules.push(mod);
      }
    }
    return modules;
  }
  /**
   * 安装模块
   * 对应 instmodule.bat:magisk / shinst / peremptory 三种方式
   */
  async install(zipPath, method) {
    const rootResult = await AdbService.root();
    if (!rootResult.granted) {
      return { success: false, error: "没有 root 权限" };
    }
    switch (method) {
      case "magisk":
        return this.installMagisk(zipPath);
      case "shinst":
        return this.installShinst(zipPath);
      case "peremptory":
        return this.installPeremptory(zipPath);
    }
  }
  // 对应 instmodule.bat :magisk
  // adb push zip → su -c 'magisk --install-module /sdcard/temp_module.zip' → rm
  async installMagisk(zipPath) {
    try {
      await AdbService.push(zipPath, "/sdcard/temp_module.zip");
      await AdbService.shell("magisk --install-module /sdcard/temp_module.zip", {
        timeout: TIMEOUT.flash,
        root: true
      });
      await AdbService.shell("rm /sdcard/temp_module.zip", { timeout: TIMEOUT.device });
      logger$i.info(`模块安装成功(magisk): ${zipPath}`);
      return { success: true };
    } catch (e) {
      try {
        await AdbService.shell("rm /sdcard/temp_module.zip", { timeout: TIMEOUT.device });
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  // 对应 instmodule.bat :shinst
  // adb push zip + module_installer.sh → su -c 'sh /sdcard/module_installer.sh' → rm
  async installShinst(zipPath) {
    try {
      await AdbService.push(zipPath, "/sdcard/temp_module.zip");
      const scriptPath = paths.scriptFile("module_installer.sh");
      await AdbService.push(scriptPath, "/sdcard/module_installer.sh");
      await AdbService.shell("sh /sdcard/module_installer.sh", {
        timeout: TIMEOUT.flash,
        root: true
      });
      await AdbService.shell("rm /sdcard/temp_module.zip /sdcard/module_installer.sh", {
        timeout: TIMEOUT.device
      });
      logger$i.info(`模块安装成功(shinst): ${zipPath}`);
      return { success: true };
    } catch (e) {
      try {
        await AdbService.shell("rm /sdcard/temp_module.zip /sdcard/module_installer.sh", {
          timeout: TIMEOUT.device
        });
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  // 对应 instmodule.bat :peremptory
  // adb push magisk_force_install.sh + zip → su -c 'sh /sdcard/magisk_force_install.sh' → rm
  async installPeremptory(zipPath) {
    try {
      const scriptPath = paths.scriptFile("magisk_force_install.sh");
      await AdbService.push(scriptPath, "/sdcard/magisk_force_install.sh");
      await AdbService.push(zipPath, "/sdcard/temp_module.zip");
      await AdbService.shell("sh /sdcard/magisk_force_install.sh", {
        timeout: TIMEOUT.flash,
        root: true
      });
      await AdbService.shell("rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh", {
        timeout: TIMEOUT.device
      });
      logger$i.info(`模块安装成功(peremptory): ${zipPath}`);
      return { success: true };
    } catch (e) {
      try {
        await AdbService.shell("rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh", {
          timeout: TIMEOUT.device
        });
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  /**
   * 卸载模块
   * 对应 unmodule.bat:mark / direct / script 三种方式
   */
  async uninstall(moduleId, method) {
    const rootResult = await AdbService.root();
    if (!rootResult.granted) {
      return { success: false, error: "没有 root 权限" };
    }
    const safeId = this.escapeModuleId(moduleId);
    const existsCheck = await AdbService.shell(
      `[ -d /data/adb/modules/${safeId} ] && echo EXISTS`,
      { timeout: TIMEOUT.device, root: true }
    );
    if (!existsCheck.includes("EXISTS")) {
      return { success: false, error: `模块不存在: ${moduleId}` };
    }
    switch (method) {
      case "mark":
        return this.uninstallMark(moduleId);
      case "direct":
        return this.uninstallDirect(moduleId);
      case "script":
        return this.uninstallScript(moduleId);
    }
  }
  // 对应 unmodule.bat :MarkRemove
  // touch /data/adb/modules/<id>/remove
  async uninstallMark(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await AdbService.shell(`touch /data/adb/modules/${safeId}/remove`, {
        timeout: TIMEOUT.device,
        root: true
      });
      const check = await AdbService.shell(
        `[ -f /data/adb/modules/${safeId}/remove ] && echo OK`,
        { timeout: TIMEOUT.device, root: true }
      );
      if (!check.includes("OK")) {
        return { success: false, error: "创建标记卸载文件失败" };
      }
      logger$i.info(`模块标记卸载成功: ${moduleId}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  // 对应 unmodule.bat :DirectRemove
  // touch disable && sleep 1 && rm -rf
  async uninstallDirect(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await AdbService.shell(
        `touch /data/adb/modules/${safeId}/disable && sleep 1 && rm -rf /data/adb/modules/${safeId}`,
        { timeout: TIMEOUT.shell, root: true }
      );
      const check = await AdbService.shell(
        `[ ! -d /data/adb/modules/${safeId} ] && echo OK`,
        { timeout: TIMEOUT.device, root: true }
      );
      if (!check.includes("OK")) {
        return { success: false, error: "删除模块目录失败" };
      }
      logger$i.info(`模块直接卸载成功: ${moduleId}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  // 对应 unmodule.bat :ScriptRemove
  // 执行 uninstall.sh + rm -rf
  async uninstallScript(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await AdbService.shell(
        `if [ -f /data/adb/modules/${safeId}/uninstall.sh ]; then sh /data/adb/modules/${safeId}/uninstall.sh; else echo NO_SCRIPT; fi; rm -rf /data/adb/modules/${safeId}`,
        { timeout: TIMEOUT.fileOp, root: true }
      );
      const check = await AdbService.shell(
        `[ ! -d /data/adb/modules/${safeId} ] && echo OK`,
        { timeout: TIMEOUT.device, root: true }
      );
      if (!check.includes("OK")) {
        return { success: false, error: "删除模块目录失败" };
      }
      logger$i.info(`模块脚本卸载成功: ${moduleId}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  /** 启用模块(touch disable 的反操作:rm disable) */
  async enable(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await AdbService.shell(`rm /data/adb/modules/${safeId}/disable`, {
        timeout: TIMEOUT.device,
        root: true
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  /** 禁用模块(touch disable) */
  async disable(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await AdbService.shell(`touch /data/adb/modules/${safeId}/disable`, {
        timeout: TIMEOUT.device,
        root: true
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  // ========== 模块商店 ==========
  /** 商店模块类型 */
  async storeSearch(query) {
    if (!query || !query.trim()) {
      return [];
    }
    const url = `https://api.magiskmodule.com/v1/modules?search=${encodeURIComponent(query)}`;
    logger$i.info(`搜索 Magisk 模块: ${query}`);
    try {
      const data = await this.httpsGetJson(url);
      if (!Array.isArray(data)) {
        return [];
      }
      return data.map((m) => ({
        id: String(m.id ?? m.module_id ?? ""),
        name: String(m.name ?? m.title ?? ""),
        description: String(m.description ?? ""),
        author: String(m.author ?? ""),
        version: String(m.version ?? ""),
        versionCode: String(m.version_code ?? m.versionCode ?? ""),
        downloadUrl: String(m.zip_url ?? m.download_url ?? m.link ?? ""),
        homepage: String(m.homepage ?? m.url ?? ""),
        lastUpdate: String(m.last_update ?? m.lastUpdate ?? "")
      }));
    } catch (e) {
      logger$i.warn(`模块商店搜索失败,返回空列表: ${e.message}`);
      return [];
    }
  }
  /** 从商店下载并安装模块 */
  async installFromStore(module2) {
    if (!module2.downloadUrl) {
      return { success: false, error: "模块缺少下载地址" };
    }
    try {
      if (!fs.existsSync(paths.cache)) {
        fs.mkdirSync(paths.cache, { recursive: true });
      }
      const filename = `${module2.id || "store_module"}_${Date.now()}.zip`;
      const localPath = path.join(paths.cache, filename);
      logger$i.info(`下载商店模块: ${module2.downloadUrl} → ${localPath}`);
      await this.httpsDownload(module2.downloadUrl, localPath);
      const result = await this.install(localPath, "magisk");
      try {
        fs.unlinkSync(localPath);
      } catch {
      }
      return result;
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  /** HTTPS GET JSON(模块商店 API) */
  httpsGetJson(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(
        url,
        {
          headers: { "User-Agent": "iMooAgentTool/1.0" },
          timeout: TIMEOUT.fileOp
        },
        (res) => {
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            reject(new Error(`HTTP ${res.statusCode}`));
            res.resume();
            return;
          }
          let body = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(new Error(`JSON 解析失败: ${e.message}`));
            }
          });
        }
      );
      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy(new Error("请求超时"));
      });
    });
  }
  /** HTTPS 下载文件到本地(流式) */
  httpsDownload(url, destPath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      const req = https.get(
        url,
        {
          headers: { "User-Agent": "iMooAgentTool/1.0" },
          timeout: TIMEOUT.install
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            file.close();
            try {
              fs.unlinkSync(destPath);
            } catch {
            }
            this.httpsDownload(res.headers.location, destPath).then(resolve, reject);
            return;
          }
          if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
            file.close();
            try {
              fs.unlinkSync(destPath);
            } catch {
            }
            reject(new Error(`下载失败: HTTP ${res.statusCode}`));
            return;
          }
          res.pipe(file);
          file.on("finish", () => {
            file.close(() => resolve());
          });
        }
      );
      req.on("error", (err) => {
        file.close();
        try {
          fs.unlinkSync(destPath);
        } catch {
        }
        reject(err);
      });
      req.on("timeout", () => {
        req.destroy(new Error("下载超时"));
      });
    });
  }
}
const MagiskService = new MagiskServiceClass();
const logger$h = Logger.instance.child("RootProService");
class RootProServiceClass {
  /**
   * 执行 Root 后优化(对应 rootpro.bat 完整流程)
   */
  async run(options) {
    const steps = [
      { name: "检查 ADB 设备", status: "pending" },
      { name: "等待 boot_completed", status: "pending" },
      { name: "读取设备信息", status: "pending" },
      { name: "检查 SDK=27", status: "pending" },
      { name: "检测 isv3", status: "pending" },
      { name: "检查 SystemUI(pm path)", status: "pending" },
      { name: "安装拓展应用包", status: "pending" },
      { name: "安装禁用模式切换桌面", status: "pending" },
      { name: "刷拓展 magisk 模块", status: "pending" }
    ];
    const runStep = async (i, fn) => {
      steps[i].status = "running";
      try {
        await fn();
        steps[i].status = "success";
        return true;
      } catch (e) {
        steps[i].status = "failed";
        steps[i].message = e.message;
        return false;
      }
    };
    const skipStep = (i, reason) => {
      steps[i].status = "skipped";
      steps[i].message = reason;
    };
    const result = {
      success: false,
      supported: false,
      steps
    };
    let ok = await runStep(0, async () => {
      const devices = await AdbService.devices();
      if (devices.length === 0) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) {
      result.error = steps[0].message;
      return result;
    }
    ok = await runStep(1, async () => {
      await AdbService.waitForBoot(12e4);
    });
    if (!ok) {
      result.error = steps[1].message;
      return result;
    }
    let innermodel = "";
    let model = "";
    let androidVersion = "";
    let sdkVersion = "";
    let softVersion = "";
    ok = await runStep(2, async () => {
      innermodel = await AdbService.getprop("ro.product.innermodel");
      model = await AdbService.getprop("ro.product.model");
      androidVersion = await AdbService.getprop("ro.build.version.release");
      sdkVersion = await AdbService.getprop("ro.build.version.sdk");
      softVersion = await AdbService.getprop("ro.product.current.softversion");
      logger$h.info(
        `innermodel=${innermodel}, model=${model}, android=${androidVersion}, sdk=${sdkVersion}, version=${softVersion}`
      );
      result.innermodel = innermodel;
      result.model = model;
      result.androidVersion = androidVersion;
      result.sdkVersion = sdkVersion;
      result.softVersion = softVersion;
    });
    if (!ok) {
      result.error = steps[2].message;
      return result;
    }
    ok = await runStep(3, async () => {
      if (sdkVersion !== "27") {
        throw new Error("你的安卓版本不是 8.1,该功能不支持你的手表");
      }
      result.supported = true;
    });
    if (!ok) {
      result.error = steps[3].message;
      return result;
    }
    let isV3 = false;
    ok = await runStep(4, async () => {
      isV3 = checkIsV3(innermodel, softVersion);
      result.isV3 = isV3;
      logger$h.info(`isV3=${isV3}`);
    });
    if (!ok) {
      result.error = steps[4].message;
      return result;
    }
    let haveSystemUI = false;
    ok = await runStep(5, async () => {
      const out = await AdbService.shell("pm path com.android.systemui", { timeout: TIMEOUT.shell });
      haveSystemUI = out.trim().length > 0 && out.includes("package:");
      result.haveSystemUI = haveSystemUI;
      logger$h.info(`haveSystemUI=${haveSystemUI}`);
    });
    if (!ok) {
      result.error = steps[5].message;
      return result;
    }
    if (!options.installApks) {
      skipStep(6, "用户未选择");
    } else {
      ok = await runStep(6, async () => {
        await this.installRootProApks();
      });
      if (!ok) {
        logger$h.warn(`安装拓展应用包失败: ${steps[6].message}`);
      }
    }
    if (!options.installDesktop) {
      skipStep(7, "用户未选择");
    } else {
      ok = await runStep(7, async () => {
        await this.installDesktopApk(isV3, haveSystemUI);
      });
      if (!ok) {
        logger$h.warn(`安装桌面失败: ${steps[7].message}`);
      }
    }
    if (!options.installMods) {
      skipStep(8, "用户未选择");
    } else {
      ok = await runStep(8, async () => {
        await this.installRootProMods();
      });
      if (!ok) {
        logger$h.warn(`安装 magisk 模块失败: ${steps[8].message}`);
      }
    }
    result.success = true;
    logger$h.info("Root 后优化全部完成");
    return result;
  }
  /**
   * 安装拓展应用包
   * 对应:
   *   if not exist ".\rootproapks\rootproapks.txt" echo 找不到 rootproapks.txt
   *   for /f %%i in (rootproapks.txt) do call instapp.bat ".\rootproapks\%%i"
   */
  async installRootProApks() {
    const apksDir = path.join(paths.resources, "rootproapks");
    const txtPath = path.join(apksDir, "rootproapks.txt");
    if (!fs.existsSync(txtPath)) {
      throw new Error("找不到 rootproapks/rootproapks.txt 无法完成安装");
    }
    const lines = fs.readFileSync(txtPath, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const apkPath = path.join(apksDir, line);
      if (!fs.existsSync(apkPath)) {
        logger$h.warn(`APK 不存在,跳过: ${apkPath}`);
        continue;
      }
      logger$h.info(`安装拓展应用: ${line}`);
      const result = await AdbService.install(apkPath, "install");
      if (!result.success) {
        logger$h.warn(`安装失败: ${line}`);
      }
    }
  }
  /**
   * 安装禁用模式切换桌面
   * 对应:
   *   if "%isv3%"=="1" (
   *     if "%havesystemui%"=="1" call instapp.bat .\rootproapks\130510_D.apk
   *     else call instapp.bat .\rootproapks\121750_D.apk
   *   ) else call instapp.bat .\rootproapks\116100_D.apk
   */
  async installDesktopApk(isV3, haveSystemUI) {
    const apksDir = path.join(paths.resources, "rootproapks");
    let apkName;
    if (isV3) {
      apkName = haveSystemUI ? "130510_D.apk" : "121750_D.apk";
    } else {
      apkName = "116100_D.apk";
    }
    const apkPath = path.join(apksDir, apkName);
    if (!fs.existsSync(apkPath)) {
      throw new Error(`桌面 APK 不存在: ${apkName}`);
    }
    logger$h.info(`安装禁用模式切换桌面: ${apkName}(isv3=${isV3}, havesystemui=${haveSystemUI})`);
    const result = await AdbService.install(apkPath, "install");
    if (!result.success) {
      throw new Error(`安装桌面失败: ${apkName}`);
    }
  }
  /**
   * 刷拓展 magisk 模块
   * 对应:
   *   if not exist ".\magiskmod\rootpromods.txt" echo 找不到 rootpromods.txt
   *   for /f %%i in (rootpromods.txt) do call instmodule.bat ".\magiskmod\%%i"
   * 注:instmodule.bat 默认 :magisk 方式(本服务调 MagiskService.install(zip, 'magisk'))
   */
  async installRootProMods() {
    const modsDir = path.join(paths.resources, "magiskmod");
    const txtPath = path.join(modsDir, "rootpromods.txt");
    if (!fs.existsSync(txtPath)) {
      throw new Error("找不到 magiskmod/rootpromods.txt 无法完成安装");
    }
    const lines = fs.readFileSync(txtPath, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const zipPath = path.join(modsDir, line);
      if (!fs.existsSync(zipPath)) {
        logger$h.warn(`模块 zip 不存在,跳过: ${zipPath}`);
        continue;
      }
      logger$h.info(`刷入拓展 magisk 模块: ${line}`);
      const result = await MagiskService.install(zipPath, "magisk");
      if (!result.success) {
        logger$h.warn(`模块安装失败: ${line} - ${result.error}`);
      }
    }
  }
}
const RootProService = new RootProServiceClass();
const logger$g = Logger.instance.child("DriverService");
class DriverServiceClass {
  /**
   * 检查驱动状态
   * 对应 checkdriver.bat 上半段(只检测,不安装)
   */
  async check() {
    const qualcomm = await this.existsGlobInDir("qdbusb*") || await this.existsGlobInDir("qcfilter*") || await this.existsGlobInDir("qcmbn*");
    const adb = await this.existsGlobInDir("android_winusb.inf*");
    const vcRuntime = await this.existsGlobInSystem32("mfc100*") && await this.existsGlobInSystem32("mfc110*") && await this.existsGlobInSystem32("mfc120*");
    const status = { qualcomm, adb, vcRuntime };
    const allInstalled = qualcomm && adb && vcRuntime;
    logger$g.info(
      `驱动检查: qualcomm=${qualcomm}, adb=${adb}, vc=${vcRuntime}, all=${allInstalled}`
    );
    return { success: true, status, allInstalled };
  }
  /**
   * 安装缺失的驱动
   * 对应 checkdriver.bat 下半段
   */
  async installDrivers() {
    const steps = [
      { name: "检查驱动状态", status: "pending" },
      { name: "下载 drivers.zip(若未下载)", status: "pending" },
      { name: "安装 ADB 驱动(pnputil)", status: "pending" },
      { name: "安装 Qualcomm 9008 驱动(9008.bat)", status: "pending" },
      { name: "安装 VC 运行库(vc.exe)", status: "pending" }
    ];
    const runStep = async (i, fn) => {
      steps[i].status = "running";
      try {
        await fn();
        steps[i].status = "success";
        return true;
      } catch (e) {
        steps[i].status = "failed";
        steps[i].message = e.message;
        return false;
      }
    };
    const skipStep = (i, reason) => {
      steps[i].status = "skipped";
      steps[i].message = reason;
    };
    let status = null;
    let ok = await runStep(0, async () => {
      const r = await this.check();
      status = r.status;
    });
    if (!ok) return { success: false, steps, error: steps[0].message };
    ok = await runStep(1, async () => {
      const driversDir = path.join(paths.resources, "drivers");
      if (fs.existsSync(driversDir)) {
        skipStep(1, "drivers 已存在,跳过下载");
        return;
      }
      logger$g.info("下载 drivers 资源...");
      await CloudService.download("drivers");
    });
    if (status.adb) {
      skipStep(2, "ADB 驱动已安装");
    } else {
      ok = await runStep(2, async () => {
        const infPath = path.join(paths.resources, "drivers", "adb", "android_winusb.inf");
        if (!fs.existsSync(infPath)) {
          throw new Error(`ADB 驱动 inf 不存在: ${infPath}`);
        }
        logger$g.info("安装 ADB 驱动...");
        await SubprocessPool.spawn({
          cmd: "pnputil.exe",
          args: ["/add-driver", infPath, "/install"],
          encoding: "gbk",
          timeout: TIMEOUT.flash
        });
      });
      if (!ok) logger$g.warn(`ADB 驱动安装失败: ${steps[2].message}`);
    }
    if (status.qualcomm) {
      skipStep(3, "Qualcomm 9008 驱动已安装");
    } else {
      ok = await runStep(3, async () => {
        const batPath = path.join(paths.resources, "drivers", "9008", "9008.bat");
        if (!fs.existsSync(batPath)) {
          throw new Error(`9008.bat 不存在: ${batPath}`);
        }
        logger$g.info("安装 Qualcomm 9008 驱动...");
        await SubprocessPool.spawn({
          cmd: "cmd.exe",
          args: ["/c", batPath],
          encoding: "gbk",
          timeout: TIMEOUT.install,
          cwd: path.dirname(batPath)
        });
      });
      if (!ok) logger$g.warn(`Qualcomm 9008 驱动安装失败: ${steps[3].message}`);
    }
    if (status.vcRuntime) {
      skipStep(4, "VC 运行库已安装");
    } else {
      ok = await runStep(4, async () => {
        const vcPath = path.join(paths.resources, "drivers", "vc.exe");
        if (!fs.existsSync(vcPath)) {
          throw new Error(`vc.exe 不存在: ${vcPath}`);
        }
        logger$g.info("安装 VC 运行库...");
        await SubprocessPool.spawn({
          cmd: vcPath,
          args: [],
          encoding: "gbk",
          timeout: TIMEOUT.install
        });
      });
      if (!ok) logger$g.warn(`VC 运行库安装失败: ${steps[4].message}`);
    }
    logger$g.info("驱动和环境配置完毕,部分更改可能需要重启电脑以完成安装");
    return { success: true, steps };
  }
  /**
   * 在 %SystemRoot%\System32\DriverStore\FileRepository\ 下检查通配符路径是否存在
   * 对应原 .bat:if exist "%SystemRoot%\System32\DriverStore\FileRepository\<glob>"
   */
  async existsGlobInDir(glob) {
    const baseDir = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "DriverStore", "FileRepository");
    return this.existsGlob(baseDir, glob);
  }
  /** 在 %SystemRoot%\System32\ 下检查通配符(对应 if exist "%SystemRoot%\System32\mfc100*") */
  async existsGlobInSystem32(glob) {
    const baseDir = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32");
    return this.existsGlob(baseDir, glob);
  }
  /**
   * 通配符匹配目录或文件是否存在
   * 原 .bat 用 if exist <path>\<glob>,Windows cmd 会展开 * 通配符
   */
  async existsGlob(baseDir, glob) {
    try {
      if (!fs.existsSync(baseDir)) return false;
      const entries = await fs.promises.readdir(baseDir);
      const regex = new RegExp("^" + glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
      return entries.some((e) => regex.test(e));
    } catch {
      return false;
    }
  }
}
const DriverService = new DriverServiceClass();
const logger$f = Logger.instance.child("AtbmodService");
class AtbmodServiceClass {
  /** 工作目录:resources/bin/mod(对应原 .bat 在 bin 目录下创建 mod/) */
  get modDir() {
    return path.join(paths.bin, "mod");
  }
  /** 7z.exe 路径 */
  get sevenZip() {
    return paths.binFile("7z.exe");
  }
  /**
   * 扫描 *.atbmod 文件
   * 对应 Loadatbmod.bat 开头:for %%f in (*.atbmod) do ...
   */
  async scan() {
    const result = [];
    try {
      const entries = await fs.promises.readdir(paths.bin);
      for (const entry of entries) {
        if (!entry.toLowerCase().endsWith(".atbmod")) continue;
        const full = path.join(paths.bin, entry);
        try {
          const stat = await fs.promises.stat(full);
          if (stat.isFile()) {
            result.push({ path: full, filename: entry, size: stat.size });
          }
        } catch {
        }
      }
    } catch (e) {
      logger$f.warn(`扫描 .atbmod 文件失败: ${e.message}`);
    }
    return result;
  }
  /**
   * 安装一个 .atbmod 文件
   * 对应 Loadatbmod.bat :ProcessModule 完整流程
   */
  async install(file) {
    if (!fs.existsSync(file)) {
      return { success: false, error: "文件已不存在,跳过" };
    }
    if (!fs.existsSync(this.modDir)) {
      fs.mkdirSync(this.modDir, { recursive: true });
    }
    const nutime = String(Date.now());
    const tempDir = path.join(this.modDir, `atbmod_${nutime}_tmp`);
    fs.mkdirSync(tempDir, { recursive: true });
    try {
      await SubprocessPool.spawn({
        cmd: this.sevenZip,
        args: ["x", file, `-o${tempDir}`, "-y"],
        encoding: "utf-8",
        timeout: TIMEOUT.flash,
        cwd: paths.bin
      });
    } catch (e) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: `解压失败,模块可能已损坏: ${e.message}` };
    }
    const propPath = path.join(tempDir, "atbmod.prop");
    if (!fs.existsSync(propPath)) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "模块不完整或格式不正确,缺少 atbmod.prop" };
    }
    const prop = this.parseProp(propPath);
    if (!prop.modid) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "模块不完整或格式不正确,缺少 modid" };
    }
    if (!prop.modversioncode) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "模块不完整或格式不正确,缺少 modversioncode" };
    }
    logger$f.info(`模块名称: ${prop.modname}, 版本: ${prop.modversion}, 类型: ${prop.modtype}`);
    let installer = null;
    const installBat = path.join(tempDir, "install.bat");
    const installExe = path.join(tempDir, "install.exe");
    if (fs.existsSync(installBat)) {
      installer = installBat;
    } else if (fs.existsSync(installExe)) {
      installer = installExe;
    }
    if (!installer) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "模块不完整或格式不正确,缺少 install.bat/install.exe" };
    }
    let exitCode = 0;
    try {
      if (installer.toLowerCase().endsWith(".bat")) {
        const result = await SubprocessPool.spawn({
          cmd: "cmd.exe",
          args: ["/c", installer],
          encoding: "gbk",
          timeout: TIMEOUT.transfer,
          cwd: tempDir,
          onStdout: (line) => logger$f.debug(`atbmod install: ${line}`)
        });
        exitCode = result.exitCode ?? 0;
      } else {
        const result = await SubprocessPool.spawn({
          cmd: installer,
          args: [],
          encoding: "gbk",
          timeout: TIMEOUT.transfer,
          cwd: tempDir
        });
        exitCode = result.exitCode ?? 0;
      }
    } catch (e) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: `安装出错: ${e.message}` };
    }
    if (exitCode !== 0) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: `安装出错,错误码 ${exitCode}` };
    }
    const targetDir = path.join(this.modDir, prop.modid);
    if (fs.existsSync(targetDir)) {
      const oldDir = path.join(this.modDir, `${prop.modid}_old`);
      if (fs.existsSync(oldDir)) {
        this.rmdir(oldDir);
      }
      fs.renameSync(targetDir, oldDir);
    }
    fs.renameSync(tempDir, targetDir);
    this.markAsEnd(file);
    logger$f.info(`模块安装完成: ${prop.modid}`);
    return { success: true, modid: prop.modid };
  }
  /**
   * 列出已安装的 .atbmod 模块
   * 对应 Loadatbmod.bat 开头统计:dir /ad /b mod | findstr /v /e "_old _tmp"
   */
  async listInstalled() {
    const result = [];
    if (!fs.existsSync(this.modDir)) {
      return result;
    }
    const entries = await fs.promises.readdir(this.modDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.endsWith("_old") || entry.name.endsWith("_tmp")) continue;
      const dir = path.join(this.modDir, entry.name);
      const propPath = path.join(dir, "atbmod.prop");
      const hasProp = fs.existsSync(propPath);
      const item = {
        modid: entry.name,
        dir,
        hasProp
      };
      if (hasProp) {
        item.prop = this.parseProp(propPath);
      }
      result.push(item);
    }
    return result;
  }
  /**
   * 卸载已安装的 .atbmod 模块
   * 删除 mod/<modid>/ 目录
   * (原 .bat 没有专门的卸载,这里新增)
   */
  async uninstall(modid) {
    const targetDir = path.join(this.modDir, modid);
    if (!fs.existsSync(targetDir)) {
      return { success: false, error: `模块不存在: ${modid}` };
    }
    try {
      this.rmdir(targetDir);
      logger$f.info(`已卸载 atbmod 模块: ${modid}`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  // ========== 内部工具 ==========
  /** 解析 atbmod.prop(格式:key=value,逐行读取) */
  parseProp(propPath) {
    const prop = {
      modid: "",
      modname: "",
      modversion: "",
      modversioncode: "",
      modtype: ""
    };
    try {
      const content = fs.readFileSync(propPath, "utf-8");
      for (const line of content.split("\n")) {
        const m = line.match(/^([^=]+)=(.*)$/);
        if (!m) continue;
        const key = m[1].trim().toLowerCase();
        const value = m[2].trim();
        switch (key) {
          case "modid":
            prop.modid = value;
            break;
          case "modname":
            prop.modname = value;
            break;
          case "modversion":
            prop.modversion = value;
            break;
          case "modversioncode":
            prop.modversioncode = value;
            break;
          case "modtype":
            prop.modtype = value;
            break;
        }
      }
    } catch (e) {
      logger$f.warn(`解析 atbmod.prop 失败: ${e.message}`);
    }
    return prop;
  }
  /** 递归删除目录(对应 rd /s /q) */
  rmdir(dir) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) {
      logger$f.warn(`删除目录失败: ${dir} - ${e.message}`);
    }
  }
  /** 重命名 .atbmod 为 .atbmod.end(对应 ren "!MODULE!" "%~nx1.end") */
  markAsEnd(file) {
    try {
      fs.renameSync(file, `${file}.end`);
    } catch (e) {
      logger$f.warn(`重命名 .atbmod 为 .end 失败: ${e.message}`);
    }
  }
}
const AtbmodService = new AtbmodServiceClass();
const logger$e = Logger.instance;
function registerToolsIpc() {
  electron.ipcMain.handle(
    "tools:open-charge",
    wrapNoArgs(() => AdbService.openCharge().then(() => ({ success: true })), {
      requireDevice: "adb",
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:read-build-props",
    wrapNoArgs(() => AdbService.readBuildProps().then((props) => ({ success: true, props })), {
      requireDevice: "adb",
      errorExtra: { props: [] },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:wifi-enable",
    wrapNoArgs(() => AdbService.wifiEnable().then(() => ({ success: true })), {
      requireDevice: "adb",
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:wifi-connect",
    wrap(
      ({ ip, port }) => AdbService.wifiConnect(ip, port ?? 5555).then((ok) => ({ success: ok })),
      { logPrefix: "tools" }
    )
  );
  electron.ipcMain.handle(
    "tools:wifi-disconnect",
    wrap(
      ({ ip, port }) => AdbService.wifiDisconnect(ip, port ?? 5555).then(() => ({ success: true })),
      { logPrefix: "tools" }
    )
  );
  electron.ipcMain.handle(
    "tools:ota-start",
    wrap(({ zipPath }) => OtaService.start({ zipPath }), {
      requireDevice: "adb",
      errorExtra: { steps: [], scrcpyStarted: false },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:rootpro",
    wrap(
      (options) => RootProService.run(options),
      {
        requireDevice: "adb",
        errorExtra: { supported: false, steps: [] },
        logPrefix: "tools"
      }
    )
  );
  electron.ipcMain.handle(
    "tools:check-drivers",
    wrapNoArgs(() => DriverService.check(), {
      errorExtra: { status: { qualcomm: false, adb: false, vcRuntime: false }, allInstalled: false },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:install-drivers",
    wrapNoArgs(() => DriverService.installDrivers(), {
      errorExtra: { steps: [] },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:atbmod-scan",
    wrapNoArgs(() => AtbmodService.scan().then((files) => ({ success: true, files })), {
      errorExtra: { files: [] },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:atbmod-install",
    wrap(({ file }) => AtbmodService.install(file), {
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:atbmod-list",
    wrapNoArgs(() => AtbmodService.listInstalled().then((installed) => ({ success: true, installed })), {
      errorExtra: { installed: [] },
      logPrefix: "tools"
    })
  );
  electron.ipcMain.handle(
    "tools:atbmod-uninstall",
    wrap(({ modid }) => AtbmodService.uninstall(modid), {
      logPrefix: "tools"
    })
  );
  logger$e.info("ipc", "tools:* 通道已注册");
}
const logger$d = Logger.instance;
function registerMagiskIpc() {
  electron.ipcMain.handle(
    "magisk:list",
    wrapNoArgs(() => MagiskService.list().then((modules) => ({ success: true, modules })), {
      requireDevice: "adb",
      logPrefix: "magisk"
    })
  );
  electron.ipcMain.handle(
    "magisk:install",
    wrap(
      ({ zip, method }) => MagiskService.install(zip, method),
      { requireDevice: "adb", logPrefix: "magisk" }
    )
  );
  electron.ipcMain.handle(
    "magisk:uninstall",
    wrap(
      ({ id, method }) => MagiskService.uninstall(id, method),
      { requireDevice: "adb", logPrefix: "magisk" }
    )
  );
  electron.ipcMain.handle(
    "magisk:enable",
    wrap(({ id }) => MagiskService.enable(id), {
      requireDevice: "adb",
      logPrefix: "magisk"
    })
  );
  electron.ipcMain.handle(
    "magisk:disable",
    wrap(({ id }) => MagiskService.disable(id), {
      requireDevice: "adb",
      logPrefix: "magisk"
    })
  );
  electron.ipcMain.handle(
    "magisk:store-search",
    wrap(
      ({ query }) => MagiskService.storeSearch(query).then((modules) => ({ success: true, modules })),
      { errorExtra: { modules: [] }, logPrefix: "magisk" }
    )
  );
  electron.ipcMain.handle(
    "magisk:store-install",
    wrap(({ module: module2 }) => MagiskService.installFromStore(module2), {
      requireDevice: "adb",
      logPrefix: "magisk"
    })
  );
  logger$d.info("ipc", "magisk:* 通道已注册");
}
const logger$c = Logger.instance.child("BackupService");
class BackupServiceClass {
  adbPath = process.platform === "win32" ? paths.binFile("adb.exe") : "adb";
  sevenZipPath = paths.binFile("7z.exe");
  // ========== DCIM 备份/恢复(对应 backup.bat :DCIM-backup / :DCIM-recover) ==========
  /**
   * DCIM 备份
   * 对应 backup.bat:DCIM-backup
   * 原:adb pull /storage/emulated/0/DCIM "<sel__folder_path>"
   */
  async backupDcim(outputDir, onProgress) {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      onProgress?.("正在备份相册...");
      await AdbService.pull("/storage/emulated/0/DCIM", outputDir);
      onProgress?.("备份成功");
      logger$c.info(`DCIM 备份成功: ${outputDir}`);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("备份失败");
      logger$c.error(`DCIM 备份失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  /**
   * DCIM 恢复
   * 对应 backup.bat:DCIM-recover
   * 原:adb push "<sel__folder_path>\DCIM" /storage/emulated/0/
   */
  async recoverDcim(inputDir, onProgress) {
    try {
      onProgress?.("正在恢复相册...");
      const dcimPath = path.join(inputDir, "DCIM");
      if (!fs.existsSync(dcimPath)) {
        return { success: false, error: `所选文件夹中没有 DCIM 子目录: ${dcimPath}` };
      }
      await AdbService.push(dcimPath, "/storage/emulated/0/");
      onProgress?.("恢复成功");
      logger$c.info(`DCIM 恢复成功: ${inputDir}`);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("恢复失败");
      logger$c.error(`DCIM 恢复失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  // ========== ADB-dd 备份/恢复(对应 backup.bat :adb-dd-backup / :adb-dd-recover) ==========
  /**
   * ADB-dd 全分区备份(不含 userdata)
   * 对应 backup.bat:adb-dd-backup
   *
   * 步骤(与原 .bat 1:1 等价):
   *   1. 检查 root(原:call adbdevice root)
   *   2. 获取分区列表(原:adb shell "su -c 'ls /dev/block/bootdevice/by-name/'")
   *   3. 跳过 userdata(原:if /i "!PART!"=="userdata" (跳过))
   *   4. 逐分区 dd 读取(原:adb exec-out "su -c 'dd if=/dev/block/bootdevice/by-name/<part> bs=4096 2>/dev/null'" > <part>.img)
   *   5. 7z 打包(原:progress.exe 7z a -tzip -y <zip> <dir> -bsp1)
   *
   * @param outputDir 输出目录,zip 将生成在此目录下
   * @param onProgress 进度回调
   * @returns { success, zipPath?, error? }
   */
  async backupAdbDd(outputDir, onProgress) {
    try {
      const now = /* @__PURE__ */ new Date();
      const d = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const t = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
      const backupName = `ADB_${d}_${t}`;
      const backupDir = path.join(outputDir, backupName);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      onProgress?.("等待设备连接...");
      onProgress?.("检查 root 权限...");
      const rootResult = await AdbService.root();
      if (!rootResult.granted) {
        return { success: false, error: "没有 root 权限,请尝试进入 twrp/qmmi" };
      }
      onProgress?.("正在获取分区列表...");
      const listOutput = await AdbService.shell("ls /dev/block/bootdevice/by-name/", {
        timeout: TIMEOUT.shell,
        root: true
      });
      const partitions = listOutput.split(/\s+/).map((s) => s.trim()).filter(Boolean);
      if (partitions.length === 0) {
        return { success: false, error: "无法获取分区列表,请检查 root 权限或设备支持" };
      }
      const failedParts = [];
      onProgress?.(`开始备份分区(共 ${partitions.length} 个)...`);
      for (const part of partitions) {
        if (part.toLowerCase() === "userdata") {
          onProgress?.("跳过 userdata");
          continue;
        }
        onProgress?.(`正在备份分区: ${part}`);
        const imgFile = path.join(backupDir, `${part}.img`);
        try {
          await this.adbExecOutToFile(
            `su -c 'dd if=/dev/block/bootdevice/by-name/${part} bs=4096 2>/dev/null'`,
            imgFile
          );
          onProgress?.(`备份 ${part} 已完成`);
        } catch (e) {
          logger$c.warn(`分区 ${part} 备份可能失败: ${e.message}`);
          failedParts.push(part);
        }
      }
      onProgress?.("正在校验备份文件完整性...");
      await this.verifyBackupMd5(backupDir, failedParts, onProgress);
      if (failedParts.length > 0) {
        onProgress?.(`备份失败的分区: ${failedParts.join(" ")}`);
      }
      onProgress?.("压缩备份文件...");
      const zipPath = path.join(outputDir, `${backupName}.zip`);
      await SubprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ["a", "-tzip", "-y", zipPath, `${backupDir}${path.sep}`],
        encoding: "utf-8",
        timeout: TIMEOUT.backup,
        cwd: paths.bin,
        onStdout: (line) => onProgress?.(line)
      });
      try {
        fs.rmSync(backupDir, { recursive: true, force: true });
      } catch {
      }
      onProgress?.(`备份完成: ${zipPath}`);
      logger$c.info(`ADB-dd 备份成功: ${zipPath}`);
      return { success: true, zipPath };
    } catch (e) {
      const msg = e.message;
      onProgress?.(`备份失败: ${msg}`);
      logger$c.error(`ADB-dd 备份失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  /**
   * 校验备份 md5(对应 backup.bat :adb-dd-backup 中"正在校验备份文件完整性"块)
   * 行为等价:对每个 .img,从设备取 md5sum,与本地 busybox md5sum 比对,不一致则删除本地文件并加入 errorPart。
   */
  async verifyBackupMd5(backupDir, failedParts, onProgress) {
    let entries = [];
    try {
      entries = fs.readdirSync(backupDir).filter((f) => f.endsWith(".img"));
    } catch {
      return;
    }
    for (const file of entries) {
      const part = path.basename(file, ".img");
      onProgress?.(`正在校验 ${part}...`);
      try {
        const remoteOut = await AdbService.shell(
          `md5sum /dev/block/bootdevice/by-name/${part} 2>/dev/null`,
          { timeout: TIMEOUT.shellLong, root: true }
        );
        const remoteHash = remoteOut.trim().split(/\s+/)[0];
        if (!remoteHash) {
          onProgress?.(`无法获取分区 ${part} 的 MD5,跳过校验`);
          continue;
        }
        const localHash = await this.busyboxMd5(path.join(backupDir, file));
        if (!localHash) {
          onProgress?.(`无法计算本地文件 ${part}.img 的 MD5,跳过校验`);
          continue;
        }
        if (localHash.toLowerCase() !== remoteHash.toLowerCase()) {
          onProgress?.(`分区 ${part} 校验失败,删除不匹配文件`);
          try {
            fs.unlinkSync(path.join(backupDir, file));
          } catch {
          }
          if (!failedParts.includes(part)) {
            failedParts.push(part);
          }
        } else {
          onProgress?.(`分区 ${part} 校验通过`);
        }
      } catch (e) {
        logger$c.warn(`校验 ${part} 异常: ${e.message}`);
      }
    }
  }
  /**
   * ADB-dd 全分区恢复(不含 userdata)
   * 对应 backup.bat:adb-dd-recover
   *
   * 步骤(与原 .bat 1:1 等价):
   *   1. 选 zip → 7z 解压到临时目录
   *   2. 检查 zip 中是否有 .img 文件
   *   3. 检查 root
   *   4. 获取设备分区表
   *   5. 匹配备份 .img 与设备分区(返回匹配/跳过列表,供 UI 确认)
   *   6. 用户确认后逐分区 dd 写入
   *
   * 由于涉及用户确认,本方法拆分为两步:
   *   - prepareAdbDdRecover(zipPath):解压 + 匹配,返回 { matched, skipped, extractDir }
   *   - executeAdbDdRecover(extractDir, matched, onProgress):实际 dd 写入
   *
   * 完整一次性调用入口:recoverAdbDd(zipPath, onProgress, onConfirm)
   *   onConfirm 返回 true 时继续执行
   */
  async prepareAdbDdRecover(zipPath, onProgress) {
    try {
      onProgress?.("解压备份文件...");
      const tmpDir = path.join(paths.resources, "backup", "tmp");
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      fs.mkdirSync(tmpDir, { recursive: true });
      await SubprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ["x", zipPath, `-o${tmpDir}`, "-aoa"],
        encoding: "utf-8",
        timeout: TIMEOUT.install,
        cwd: paths.bin
      });
      let extractDir = tmpDir;
      let imgFiles = this.listImgFiles(extractDir);
      if (imgFiles.length === 0) {
        const subEntries = fs.readdirSync(tmpDir, { withFileTypes: true }).filter((e) => e.isDirectory());
        for (const sub of subEntries) {
          const subDir = path.join(tmpDir, sub.name);
          const subImgs = this.listImgFiles(subDir);
          if (subImgs.length > 0) {
            extractDir = subDir;
            imgFiles = subImgs;
            break;
          }
        }
      }
      if (imgFiles.length === 0) {
        return { success: false, error: "备份文件中没有找到任何 .img 文件" };
      }
      onProgress?.("检查 root 权限...");
      const rootResult = await AdbService.root();
      if (!rootResult.granted) {
        return { success: false, error: "没有 root 权限,请尝试进入 twrp/qmmi" };
      }
      onProgress?.("正在获取设备分区表...");
      const partListOutput = await AdbService.shell("ls /dev/block/bootdevice/by-name/", {
        timeout: TIMEOUT.shell,
        root: true
      });
      const deviceParts = new Set(
        partListOutput.split(/\s+/).map((s) => s.trim()).filter(Boolean)
      );
      const matched = [];
      const skipped = [];
      for (const img of imgFiles) {
        const part = path.basename(img, ".img");
        if (deviceParts.has(part)) {
          matched.push(part);
        } else {
          skipped.push(part);
        }
      }
      if (matched.length === 0) {
        return { success: false, error: "没有可恢复的分区(备份中的分区均未在设备上发现)" };
      }
      onProgress?.(`匹配 ${matched.length} 个分区,跳过 ${skipped.length} 个`);
      return { success: true, extractDir, match: { matched, skipped } };
    } catch (e) {
      const msg = e.message;
      onProgress?.(`准备恢复失败: ${msg}`);
      logger$c.error(`ADB-dd 恢复准备失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  /**
   * 执行 ADB-dd 恢复的 dd 写入阶段
   * 对应 backup.bat:adb-dd-recover 后半段(for %%f in (!RESTORE_LIST!) do ... dd of=...)
   *
   * @param extractDir 解压后的目录(含 .img 文件)
   * @param parts 要恢复的分区名列表(已与设备匹配)
   */
  async executeAdbDdRecover(extractDir, parts, onProgress) {
    const failedParts = [];
    try {
      for (const part of parts) {
        onProgress?.(`恢复分区: ${part} ...`);
        const imgFile = path.join(extractDir, `${part}.img`);
        if (!fs.existsSync(imgFile)) {
          logger$c.warn(`分区 ${part} 的镜像不存在: ${imgFile},跳过`);
          failedParts.push(part);
          continue;
        }
        try {
          await this.adbExecInFromFile(
            `su -c 'dd of=/dev/block/bootdevice/by-name/${part} bs=4096 2>/dev/null'`,
            imgFile
          );
          onProgress?.(`${part} 恢复成功`);
        } catch (e) {
          logger$c.warn(`分区 ${part} 写入可能失败: ${e.message}`);
          failedParts.push(part);
        }
      }
      try {
        fs.rmSync(extractDir, { recursive: true, force: true });
      } catch {
      }
      if (failedParts.length > 0) {
        onProgress?.(`恢复流程结束,部分分区失败: ${failedParts.join(" ")}`);
        return {
          success: false,
          error: `部分分区恢复失败: ${failedParts.join(" ")}`
        };
      }
      onProgress?.("恢复流程结束,建议重启设备");
      logger$c.info("ADB-dd 恢复完成");
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.(`恢复失败: ${msg}`);
      logger$c.error(`ADB-dd 恢复失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  /**
   * ADB-dd 恢复(一站式入口,带用户确认回调)
   */
  async recoverAdbDd(zipPath, onProgress, onConfirm) {
    const prep = await this.prepareAdbDdRecover(zipPath, onProgress);
    if (!prep.success || !prep.extractDir || !prep.match) {
      return { success: false, error: prep.error };
    }
    if (onConfirm) {
      const ok = await onConfirm(prep.match);
      if (!ok) {
        onProgress?.("已取消操作");
        try {
          fs.rmSync(prep.extractDir, { recursive: true, force: true });
        } catch {
        }
        return { success: false, error: "用户已取消" };
      }
    }
    return this.executeAdbDdRecover(prep.extractDir, prep.match.matched, onProgress);
  }
  // ========== 开机自刷 TWRP(对应 pashtwrppro.bat) ==========
  /**
   * 开机自刷 TWRP
   * 对应 pashtwrppro.bat
   *
   * 步骤(与原 .bat 1:1 等价):
   *   1. 选型号(已通过参数传入 innermodel)
   *   2. 复制 twrp/<innermodel>.img → work/recovery.img
   *      (原:copy /Y .\EDL\twrp\%innermodel%.img .\EDL\rooting\recovery.img)
   *   3. adb push recovery.img /sdcard/
   *   4. adb push auto_flash_recovery.sh /sdcard/(原:adb push rec.sh /sdcard/)
   *   5. adb shell "su -c cp /sdcard/recovery.img /data/rec.img"
   *   6. adb shell "su -c cp /sdcard/auto_flash_recovery.sh /data/adb/service.d/rec.sh"
   *      (原:adb shell "su -c cp /sdcard/rec.sh /data/adb/service.d/rec.sh")
   *      注:目标路径 /data/adb/service.d/rec.sh 是 Magisk 服务目录约定,不能改(见 plan.md 2.5.2)
   *   7. adb shell "chmod 755 -R /data/adb/service.d/rec.sh"
   *   8. 清理工作目录
   */
  async autoFlashTwrp(innermodel, onProgress) {
    try {
      const twrpDir = paths.edlFile("twrp");
      if (!fs.existsSync(twrpDir)) {
        return {
          success: false,
          error: 'TWRP 镜像未下载,请先在"资源下载"页下载 TWRP'
        };
      }
      const twrpImg = path.join(twrpDir, `${innermodel}.img`);
      if (!fs.existsSync(twrpImg)) {
        return {
          success: false,
          error: `TWRP 镜像不存在: ${innermodel}.img`
        };
      }
      onProgress?.("拷贝文件到临时目录...");
      const workDir = paths.edlWork;
      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
      }
      const recoveryImg = path.join(workDir, "recovery.img");
      fs.copyFileSync(twrpImg, recoveryImg);
      onProgress?.("推送 recovery.img...");
      await AdbService.push(recoveryImg, "/sdcard/");
      onProgress?.("推送 auto_flash_recovery.sh...");
      const scriptPath = paths.scriptFile("auto_flash_recovery.sh");
      if (!fs.existsSync(scriptPath)) {
        return { success: false, error: `脚本文件不存在: auto_flash_recovery.sh` };
      }
      await AdbService.push(scriptPath, "/sdcard/");
      onProgress?.("安装到 Magisk 服务目录...");
      await AdbService.shell("cp /sdcard/recovery.img /data/rec.img", {
        timeout: TIMEOUT.shell,
        root: true
      });
      await AdbService.shell("cp /sdcard/auto_flash_recovery.sh /data/adb/service.d/rec.sh", {
        timeout: TIMEOUT.shell,
        root: true
      });
      await AdbService.shell("chmod 755 -R /data/adb/service.d/rec.sh", {
        timeout: TIMEOUT.shell,
        root: true
      });
      try {
        const workFiles = fs.readdirSync(workDir);
        for (const f of workFiles) {
          fs.unlinkSync(path.join(workDir, f));
        }
      } catch {
      }
      onProgress?.("刷入完成");
      logger$c.info(`开机自刷 TWRP 完成: ${innermodel}`);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.(`刷入失败: ${msg}`);
      logger$c.error(`开机自刷 TWRP 失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  // ========== Xposed 安装(对应 Xposed.bat) ==========
  /**
   * Xposed 安装
   * 对应 Xposed.bat
   *
   * 步骤(与原 .bat 1:1 等价):
   *   1. 读 sdkversion(原:adb shell getprop ro.build.version.sdk)
   *   2. SDK=19 → MagiskModule-1 分支:
   *      - instapp apks/xpinstaller19.apk
   *      - instmodule tmp/19xposed.zip shinst
   *      - adb reboot
   *   3. SDK=25 → MagiskModule-2 分支:
   *      - instapp apks/toolkit.apk
   *      - instapp apks/xposed-magisk.apk
   *      - instmodule tmp/xposed-magisk-1.zip shinst
   *      - adb reboot
   *      - 等开机(原:device_check.exe adb + boot_completed.bat + busybox sleep 10)
   *      - instmodule tmp/xposed-magisk-2.zip shinst
   *      - adb reboot
   *   4. 其他 SDK:不支持
   *
   * 注:对应 plan.md 6.9 MagiskService 的 install(zip, 'shinst') 等价 instmodule.bat shinst
   *     对应 plan.md 6.10 AppService 的 install(apk, 'install') 等价 instapp.bat(默认 install)
   */
  async installXposed(onProgress) {
    try {
      onProgress?.("等待设备开机完成...");
      await AdbService.waitForBoot(12e4);
      const androidVersion = await AdbService.getprop("ro.build.version.release");
      onProgress?.(`您的设备安卓版本为: ${androidVersion}`);
      const sdkVersion = (await AdbService.getprop("ro.build.version.sdk")).trim();
      onProgress?.(`SDK 版本号: ${sdkVersion}`);
      if (sdkVersion === "19") {
        return await this.installXposedSdk19(onProgress);
      }
      if (sdkVersion === "25") {
        return await this.installXposedSdk25(onProgress);
      }
      onProgress?.("不是安卓 4.4.4,也不是安卓 7.1.1,无法安装");
      return {
        success: false,
        error: `不支持的 SDK 版本: ${sdkVersion}(仅支持 19/25)`
      };
    } catch (e) {
      const msg = e.message;
      onProgress?.(`Xposed 安装失败: ${msg}`);
      logger$c.error(`Xposed 安装失败: ${msg}`);
      return { success: false, error: msg };
    }
  }
  // 对应 Xposed.bat :MagiskModule-1(SDK=19)
  async installXposedSdk19(onProgress) {
    try {
      const ensureOk = await this.ensureXposedResources(onProgress);
      if (!ensureOk.success) {
        return { success: false, error: ensureOk.error };
      }
      onProgress?.("安装 xpinstaller19.apk...");
      const apk1 = path.join(paths.resources, "apks", "xpinstaller19.apk");
      if (!fs.existsSync(apk1)) {
        return { success: false, error: 'apks/xpinstaller19.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      const r1 = await AdbService.install(apk1, "install");
      if (!r1.success) {
        return { success: false, error: "安装 xpinstaller19.apk 失败" };
      }
      onProgress?.("安装 19xposed.zip 模块...");
      const zip1 = path.join(paths.cache, "19xposed.zip");
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/19xposed.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r2 = await MagiskService.install(zip1, "shinst");
      if (!r2.success) {
        return { success: false, error: r2.error ?? "安装 19xposed.zip 失败" };
      }
      onProgress?.("重启手表...");
      await AdbService.reboot("system");
      onProgress?.("Xposed 安装成功");
      logger$c.info("Xposed 安装成功(SDK=19)");
      return { success: true };
    } catch (e) {
      const msg = e.message;
      return { success: false, error: msg };
    }
  }
  // 对应 Xposed.bat :MagiskModule-2(SDK=25)
  async installXposedSdk25(onProgress) {
    try {
      const ensureOk = await this.ensureXposedResources(onProgress);
      if (!ensureOk.success) {
        return { success: false, error: ensureOk.error };
      }
      onProgress?.("安装 toolkit.apk...");
      const apkToolkit = path.join(paths.resources, "apks", "toolkit.apk");
      if (!fs.existsSync(apkToolkit)) {
        return { success: false, error: 'apks/toolkit.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      const r1 = await AdbService.install(apkToolkit, "install");
      if (!r1.success) {
        return { success: false, error: "安装 toolkit.apk 失败" };
      }
      onProgress?.("安装 xposed-magisk.apk...");
      const apkXp = path.join(paths.resources, "apks", "xposed-magisk.apk");
      if (!fs.existsSync(apkXp)) {
        return { success: false, error: 'apks/xposed-magisk.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      const r2 = await AdbService.install(apkXp, "install");
      if (!r2.success) {
        return { success: false, error: "安装 xposed-magisk.apk 失败" };
      }
      onProgress?.("安装 xposed-magisk-1.zip 模块...");
      const zip1 = path.join(paths.cache, "xposed-magisk-1.zip");
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/xposed-magisk-1.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r3 = await MagiskService.install(zip1, "shinst");
      if (!r3.success) {
        return { success: false, error: r3.error ?? "安装 xposed-magisk-1.zip 失败" };
      }
      onProgress?.("重启手表(首次刷入 xp 可能需要 7-15 分钟开机时间,请耐心等待)...");
      await AdbService.reboot("system");
      onProgress?.("等待设备重新开机完成...");
      await AdbService.waitForBoot(9e5);
      await new Promise((r) => setTimeout(r, 1e4));
      onProgress?.("安装 xposed-magisk-2.zip 模块...");
      const zip2 = path.join(paths.cache, "xposed-magisk-2.zip");
      if (!fs.existsSync(zip2)) {
        return { success: false, error: 'tmp/xposed-magisk-2.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r4 = await MagiskService.install(zip2, "shinst");
      if (!r4.success) {
        return { success: false, error: r4.error ?? "安装 xposed-magisk-2.zip 失败" };
      }
      onProgress?.("重启手表...");
      await AdbService.reboot("system");
      onProgress?.("Xposed 安装成功");
      logger$c.info("Xposed 安装成功(SDK=25)");
      return { success: true };
    } catch (e) {
      const msg = e.message;
      return { success: false, error: msg };
    }
  }
  /**
   * 确保 Xposed 所需资源已就绪
   * 对应原 Xposed.bat 开头的:if not exist .\tmp\xposed.zip call cloud xp
   *
   * 资源映射(见 plan.md 2.5.1 + 10.1):
   *   - 原 bin/apks/ → resources/apks/(由 CloudService.download('apks') 解压)
   *   - 原 bin/tmp/  → resources/cache/(原 cloud.bat :xp 把 xp.zip 解压到 ./tmp/)
   *
   * CloudService 的 xp 资源 extract=false,所以这里需要手动解压 xp.zip 到 cache/
   */
  async ensureXposedResources(_onProgress) {
    const xp19 = path.join(paths.cache, "19xposed.zip");
    const xp251 = path.join(paths.cache, "xposed-magisk-1.zip");
    if (fs.existsSync(xp19) || fs.existsSync(xp251)) {
      return { success: true };
    }
    const apk19 = path.join(paths.resources, "apks", "xpinstaller19.apk");
    const apkTool = path.join(paths.resources, "apks", "toolkit.apk");
    const hasApks = fs.existsSync(apk19) || fs.existsSync(apkTool);
    if (!hasApks) {
      return {
        success: false,
        error: '缺少 apks 资源,请先在"资源下载"页下载 apks 资源'
      };
    }
    return {
      success: false,
      error: '缺少 xp 资源,请先在"资源下载"页下载 xp 资源(会自动解压到 cache/)'
    };
  }
  // ========== 底层辅助方法 ==========
  /**
   * 列出目录下的 .img 文件
   */
  listImgFiles(dir) {
    try {
      return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".img")).map((f) => path.join(dir, f));
    } catch {
      return [];
    }
  }
  /**
   * 用本地 busybox.exe 计算 md5
   * 对应原 .bat:busybox md5sum "<file>"
   */
  async busyboxMd5(filePath) {
    try {
      const result = await SubprocessPool.spawn({
        cmd: paths.binFile("busybox.exe"),
        args: ["md5sum", filePath],
        encoding: "utf-8",
        timeout: TIMEOUT.install,
        cwd: paths.bin,
        silent: true
      });
      return result.stdout.trim().split(/\s+/)[0] || null;
    } catch {
      return null;
    }
  }
  /**
   * adb exec-out 命令,将 stdout(可能为二进制)写入本地文件
   * 对应原 .bat:adb exec-out "su -c '...'" > <file>
   *
   * 注:stdout 是二进制(dd 读取的分区数据),不解码,直接写文件。
   */
  adbExecOutToFile(shellCmd, outputFile) {
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(this.adbPath, ["exec-out", shellCmd], {
        cwd: paths.bin,
        windowsHide: true,
        shell: false
      });
      const out = fs.createWriteStream(outputFile);
      proc.stdout?.pipe(out);
      let stderr = "";
      proc.stderr?.on("data", (chunk) => {
        stderr += chunk.toString("utf-8");
      });
      proc.on("error", (err) => {
        try {
          out.close();
        } catch {
        }
        reject(new SpawnError(`adb exec-out 启动失败: ${err.message}`, -1, "", stderr, 0, false, false));
      });
      proc.on("close", (code) => {
        try {
          out.close();
        } catch {
        }
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError(`adb exec-out 退出码 ${code}`, code ?? -1, "", stderr, 0, false, false));
        }
      });
    });
  }
  /**
   * adb exec-in 命令,将本地文件内容写入 stdin
   * 对应原 .bat:adb.exe exec-in "..." < <file>
   */
  adbExecInFromFile(shellCmd, inputFile) {
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(this.adbPath, ["exec-in", shellCmd], {
        cwd: paths.bin,
        windowsHide: true,
        shell: false
      });
      const inp = fs.createReadStream(inputFile);
      let stderr = "";
      proc.stderr?.on("data", (chunk) => {
        stderr += chunk.toString("utf-8");
      });
      inp.on("error", (err) => {
        try {
          proc.kill();
        } catch {
        }
        reject(new SpawnError(`读取文件失败: ${err.message}`, -1, "", stderr, 0, false, false));
      });
      inp.pipe(proc.stdin);
      proc.on("error", (err) => {
        reject(new SpawnError(`adb exec-in 启动失败: ${err.message}`, -1, "", stderr, 0, false, false));
      });
      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError(`adb exec-in 退出码 ${code}`, code ?? -1, "", stderr, 0, false, false));
        }
      });
    });
  }
}
const BackupService = new BackupServiceClass();
const logger$b = Logger.instance;
function emitProgress(msg) {
  for (const w of electron.BrowserWindow.getAllWindows()) {
    if (!w.isDestroyed()) {
      w.webContents.send("backup:progress", { msg, ts: Date.now() });
    }
  }
}
function registerBackupIpc() {
  electron.ipcMain.handle(
    "backup:dcim-backup",
    wrap(
      ({ outputDir }) => BackupService.backupDcim(outputDir, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:dcim-recover",
    wrap(
      ({ inputDir }) => BackupService.recoverDcim(inputDir, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:adbdd-backup",
    wrap(
      ({ outputDir }) => BackupService.backupAdbDd(outputDir, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:adbdd-prepare",
    wrap(
      ({ zipPath }) => BackupService.prepareAdbDdRecover(zipPath, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:adbdd-execute",
    wrap(
      ({ extractDir, parts }) => BackupService.executeAdbDdRecover(extractDir, parts, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:adbdd-recover",
    wrap(
      ({ zipPath }) => BackupService.recoverAdbDd(zipPath, emitProgress, async () => true),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:edl-backup",
    wrap((opts) => {
      const v3 = opts.v3 ?? checkIsV3(opts.innermodel, opts.softVersion ?? "");
      return EdlService.backup9008({
        innermodel: opts.innermodel,
        v3,
        outputDir: opts.outputDir,
        onProgress: emitProgress
      }).then((zipPath) => ({ success: true, zipPath }));
    }, { logPrefix: "backup" })
  );
  electron.ipcMain.handle(
    "backup:edl-recover",
    wrap(
      ({ zipPath }) => EdlService.recover9008({ zipPath, onProgress: emitProgress }).then(() => ({ success: true })),
      { logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:super-recovery",
    wrap(
      ({ folder }) => EdlService.superRecovery({ folder, onProgress: emitProgress }).then(() => ({ success: true })),
      { logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:flash-twrp",
    wrap(
      ({ innermodel }) => EdlService.flashTwrp({ innermodel, onProgress: emitProgress }).then(() => ({ success: true })),
      { logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:auto-flash-twrp",
    wrap(
      ({ innermodel }) => BackupService.autoFlashTwrp(innermodel, emitProgress),
      { requireDevice: "adb", logPrefix: "backup" }
    )
  );
  electron.ipcMain.handle(
    "backup:xposed-install",
    wrapNoArgs(() => BackupService.installXposed(emitProgress), {
      requireDevice: "adb",
      logPrefix: "backup"
    })
  );
  logger$b.info("ipc", "backup:* 通道已注册");
}
const logger$a = Logger.instance.child("MagiskPatcher");
async function magiskboot(args, opts = { cwd: paths.edlWork }) {
  const magiskbootExe = paths.binFile("magiskboot.exe");
  try {
    const r = await SubprocessPool.spawn({
      cmd: magiskbootExe,
      args,
      cwd: opts.cwd,
      encoding: "utf-8",
      timeout: opts.timeout ?? 6e4,
      taskId: opts.taskId,
      onStdout: (line) => logger$a.debug(`magiskboot: ${line}`),
      onStderr: (line) => logger$a.warn(`magiskboot stderr: ${line}`)
    });
    return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode ?? 0 };
  } catch (e) {
    const err = e;
    if (err.exitCode !== void 0 && err.exitCode !== null) {
      return {
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? "",
        exitCode: err.exitCode
      };
    }
    throw e;
  }
}
class MagiskPatcherClass {
  /**
   * 修补 boot.img
   * 对应原 magiskpatch.bat(250 行状态机)
   *
   * @param bootImg 输入 boot.img 的绝对路径
   * @param outputPath 输出 boot.img 的绝对路径
   * @param magiskVer Magisk 版本(21=SDK25, 25=SDK27)
   * @param workDir 工作目录(默认 paths.edlWork)
   * @param taskId 任务 ID(用于日志关联)
   */
  async patch(bootImg, outputPath, magiskVer, workDir = paths.edlWork, taskId) {
    if (!fs.existsSync(bootImg)) {
      return { success: false, status: "stock", error: `boot.img 不存在: ${bootImg}` };
    }
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    logger$a.info(`开始修补 boot.img(magisk ${magiskVer}): ${bootImg} → ${outputPath}`);
    const tempFiles = ["magiskinit", "header", "kernel_dtb", "kernel", "ramdisk.cpio", "config", "ramdisk.cpio.orig"];
    for (const f of tempFiles) {
      const p = path.join(workDir, f);
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {
      }
    }
    const magiskinitSrc = paths.binFile(`magiskinit${magiskVer}`);
    const magiskinitDst = path.join(workDir, "magiskinit");
    if (!fs.existsSync(magiskinitSrc)) {
      return { success: false, status: "stock", error: `magiskinit${magiskVer} 不存在` };
    }
    fs.copyFileSync(magiskinitSrc, magiskinitDst);
    const KEEPVERITY = "true";
    const KEEPFORCEENCRYPT = "true";
    const PATCHVBMETAFLAG = magiskVer === 25 ? "false" : void 0;
    let RECOVERYMODE = "false";
    if (magiskVer === 25) {
      const magisk32xzSrc = paths.binFile("magisk32.xz");
      if (!fs.existsSync(magisk32xzSrc)) {
        return { success: false, status: "stock", error: "magisk32.xz 不存在" };
      }
      fs.copyFileSync(magisk32xzSrc, path.join(workDir, "magisk32.xz"));
    }
    await magiskboot(["unpack", "-h", bootImg], { cwd: workDir, taskId });
    if (magiskVer === 21) {
      if (fs.existsSync(path.join(workDir, "recovery_dtbo"))) {
        RECOVERYMODE = "true";
        logger$a.info("检测到 recovery_dtbo,RECOVERYMODE 强制设为 true");
      }
    }
    let STATUS = 0;
    let sha1 = "";
    let status = "stock";
    if (!fs.existsSync(path.join(workDir, "ramdisk.cpio"))) {
      STATUS = 0;
    } else {
      const testResult = await magiskboot(["cpio", "ramdisk.cpio", "test"], { cwd: workDir, taskId });
      STATUS = testResult.exitCode;
      if (STATUS !== 0 && STATUS !== 1) {
        return { success: false, status: "stock", error: `magiskboot cpio test 返回异常 exitCode: ${STATUS}` };
      }
    }
    if (STATUS === 0) {
      status = "stock";
      const sha1Result = await magiskboot(["sha1", bootImg], { cwd: workDir, taskId });
      sha1 = sha1Result.stdout.trim().split(/\s+/)[0] ?? "";
      const ramdiskCpio = path.join(workDir, "ramdisk.cpio");
      const ramdiskOrig = path.join(workDir, "ramdisk.cpio.orig");
      if (fs.existsSync(ramdiskCpio)) {
        fs.copyFileSync(ramdiskCpio, ramdiskOrig);
      }
    } else {
      status = "magisk-patched";
      const sha1Result = await magiskboot(["cpio", "ramdisk.cpio", "sha1"], { cwd: workDir, taskId });
      sha1 = sha1Result.stdout.trim().split(/\s+/)[0] ?? "";
      await magiskboot(["cpio", "ramdisk.cpio", "restore"], { cwd: workDir, taskId });
      status = "restored";
      const ramdiskCpio = path.join(workDir, "ramdisk.cpio");
      const ramdiskOrig = path.join(workDir, "ramdisk.cpio.orig");
      if (fs.existsSync(ramdiskCpio)) {
        fs.copyFileSync(ramdiskCpio, ramdiskOrig);
      }
    }
    const configLines = [];
    configLines.push(`KEEPVERITY=${KEEPVERITY}`);
    configLines.push(`KEEPFORCEENCRYPT=${KEEPFORCEENCRYPT}`);
    if (PATCHVBMETAFLAG !== void 0) {
      configLines.push(`PATCHVBMETAFLAG=${PATCHVBMETAFLAG}`);
    }
    configLines.push(`RECOVERYMODE=${RECOVERYMODE}`);
    if (sha1) {
      configLines.push(`SHA1=${sha1}`);
    }
    fs.writeFileSync(path.join(workDir, "config"), configLines.join("\n") + "\n", "utf-8");
    if (magiskVer === 25) {
      await magiskboot(
        [
          "cpio",
          "ramdisk.cpio",
          "add 0750 init magiskinit",
          "mkdir 0750 overlay.d",
          "mkdir 0750 overlay.d/sbin",
          "add 0644 overlay.d/sbin/magisk32.xz magisk32.xz",
          "# add 0644 overlay.d/sbin/magisk64.xz magisk64.xz",
          "patch",
          "backup ramdisk.cpio.orig",
          "mkdir 000 .backup",
          "add 000 .backup/.magisk config"
        ],
        { cwd: workDir, taskId }
      );
    } else {
      await magiskboot(
        [
          "cpio",
          "ramdisk.cpio",
          "add 750 init magiskinit",
          "patch",
          "backup ramdisk.cpio.orig",
          "mkdir 000 .backup",
          "add 000 .backup/.magisk config"
        ],
        { cwd: workDir, taskId }
      );
    }
    if (magiskVer === 25) {
      for (const dtbName of ["dtb", "kernel_dtb", "extra"]) {
        const dtbPath = path.join(workDir, dtbName);
        if (fs.existsSync(dtbPath)) {
          await magiskboot(["dtb", dtbName, "test"], { cwd: workDir, taskId });
          await magiskboot(["dtb", dtbName, "patch"], { cwd: workDir, taskId });
        }
      }
    } else {
      let dtbName = null;
      for (const name of ["dtb", "kernel_dtb", "extra", "recovery_dtbo"]) {
        if (fs.existsSync(path.join(workDir, name))) {
          dtbName = name;
          break;
        }
      }
      if (dtbName) {
        await magiskboot(["dtb", dtbName, "patch"], { cwd: workDir, taskId });
      }
    }
    await magiskboot(
      [
        "hexpatch",
        "kernel",
        "49010054011440B93FA00F71E9000054010840B93FA00F7189000054001840B91FA00F7188010054",
        "A1020054011440B93FA00F7140020054010840B93FA00F71E0010054001840B91FA00F7181010054"
      ],
      { cwd: workDir, taskId }
    );
    await magiskboot(["hexpatch", "kernel", "821B8012", "E2FF8F12"], { cwd: workDir, taskId });
    await magiskboot(
      [
        "hexpatch",
        "kernel",
        "77616E745F696E697472616D667300",
        "736B69705F696E697472616D667300"
      ],
      { cwd: workDir, taskId }
    );
    await magiskboot(["repack", bootImg, "boot_new.img"], { cwd: workDir, taskId });
    const bootNewPath = path.join(workDir, "boot_new.img");
    if (!fs.existsSync(bootNewPath)) {
      return { success: false, status, sha1, error: "magiskboot repack 未生成 boot_new.img" };
    }
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    fs.renameSync(bootNewPath, outputPath);
    for (const f of tempFiles) {
      const p = path.join(workDir, f);
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {
      }
    }
    if (magiskVer === 25) {
      try {
        const p = path.join(workDir, "magisk32.xz");
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {
      }
    }
    logger$a.info(`boot.img 修补完成: ${outputPath}(status=${status})`);
    return { success: true, status, sha1 };
  }
}
const MagiskPatcher = new MagiskPatcherClass();
const logger$9 = Logger.instance.child("BootPatcher");
class BootPatcherClass {
  /**
   * 修补 kernel 文件
   * 对应原 patch_boot.exe(逻辑保真:4 条正则替换,顺序敏感)
   *
   * @param kernelPath magiskboot unpack 后的 kernel 文件路径
   * @returns { success, patches, output }
   *   - success: 是否成功
   *   - patches: 已应用的补丁描述(用于 UI 展示)
   *   - output: 'success' 或 'Error'(对应原 .exe 的 stdout)
   */
  patch(kernelPath) {
    const patches = [];
    try {
      if (!fs.existsSync(kernelPath)) {
        logger$9.error(`kernel 文件不存在: ${kernelPath}`);
        return {
          success: false,
          patches: [],
          error: `kernel 文件不存在: ${kernelPath}`,
          output: "Error"
        };
      }
      const buf = fs.readFileSync(kernelPath);
      let content = buf.toString("latin1");
      {
        const before = content;
        content = content.replace(
          /builduser=root/,
          "builduser=rootbuilduser=root"
        );
        if (content !== before) {
          patches.push("builduser=root → 追加 builduser=root(确保存在)");
        } else {
          patches.push("builduser=root 未匹配(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(
          /androidboot\.selinux=enforcing/,
          "androidboot.selinux=permissive"
        );
        if (content !== before) {
          patches.push("androidboot.selinux=enforcing → permissive");
        } else {
          patches.push("androidboot.selinux= 未匹配 enforcing(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(
          /buildvariant=user /,
          "buildvariant=userdebug "
        );
        if (content !== before) {
          patches.push("buildvariant=user → buildvariant=userdebug");
        } else {
          patches.push("buildvariant=user (带尾空格) 未匹配(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(
          /(buildsoftversion=[\d.]+)\s*/g,
          "$1"
        );
        if (content !== before) {
          patches.push("buildsoftversion=x.y.z 后空白已移除");
        } else {
          patches.push("buildsoftversion=x.y.z 未匹配(原样保留)");
        }
      }
      const newBuf = Buffer.from(content, "latin1");
      if (newBuf.length !== buf.length || !newBuf.equals(buf)) {
        fs.writeFileSync(kernelPath, newBuf);
        logger$9.info(`kernel 已修补,共应用 ${patches.length} 条规则`);
      } else {
        logger$9.info("kernel 无变化(所有规则均未匹配)");
      }
      return {
        success: true,
        patches,
        output: "success"
      };
    } catch (e) {
      logger$9.error(`kernel 修补失败: ${e.message}`);
      return {
        success: false,
        patches,
        error: e.message,
        output: "Error"
      };
    }
  }
  /**
   * 修补 kernel 文件,失败时抛错(便于 await 调用)
   * 内部检查 includes('success')
   */
  async patchAsync(kernelPath) {
    const result = this.patch(kernelPath);
    if (!result.success || !result.output.includes("success")) {
      throw new Error(`patch_boot 失败: ${result.error ?? result.output}`);
    }
    return result;
  }
}
const BootPatcher = new BootPatcherClass();
const logger$8 = Logger.instance.child("RootService");
class RootServiceClass {
  tasks = /* @__PURE__ */ new Map();
  bus = new node_events.EventEmitter();
  handlers;
  constructor() {
    this.bus.setMaxListeners(50);
    this.handlers = {
      "idle": async () => {
      },
      "preparing-resources": this.preparingResources.bind(this),
      "showing-disclaimer": async () => {
      },
      "detecting-device": this.detectingDevice.bind(this),
      "selecting-model": async () => {
      },
      "entering-edl": this.enteringEdl.bind(this),
      "waiting-adb-after-edl": this.waitingAdbAfterEdl.bind(this),
      "reading-device-info": this.readingDeviceInfo.bind(this),
      "detecting-v3": this.detectingV3.bind(this),
      "extracting-root-zip": this.extractingRootZip.bind(this),
      "routing-by-sdk": this.routingBySdk.bind(this),
      // SDK19
      "sdk19-backup-dcim": this.sdk19BackupDcim.bind(this),
      "sdk19-flash-boot": this.sdk19FlashBoot.bind(this),
      "sdk19-install-magisk": this.sdk19InstallMagisk.bind(this),
      "sdk19-install-xtcpatch": this.sdk19InstallXtcpatch.bind(this),
      "sdk19-restore-dcim": this.sdk19RestoreDcim.bind(this),
      "sdk19-reboot": this.sdk19Reboot.bind(this),
      // SDK25
      "sdk25-backup-dcim": this.sdk25BackupDcim.bind(this),
      "sdk25-select-scheme": async () => {
      },
      "sdk25-entering-edl": this.sdk25EnteringEdl.bind(this),
      "sdk25-reading-boot": this.sdk25ReadingBoot.bind(this),
      "sdk25-patching-boot": this.sdk25PatchingBoot.bind(this),
      "sdk25-flashing": this.sdk25Flashing.bind(this),
      "sdk25-rebooting": this.sdk25Rebooting.bind(this),
      "sdk25-waiting-boot": this.sdk25WaitingBoot.bind(this),
      "sdk25-install-magisk": this.sdk25InstallMagisk.bind(this),
      "sdk25-install-xtcpatch": this.sdk25InstallXtcpatch.bind(this),
      "sdk25-boot-scheme-second-edl": this.sdk25BootSchemeSecondEdl.bind(this),
      "sdk25-restore-dcim": this.sdk25RestoreDcim.bind(this),
      // SDK27(Android 8.1,EDL + magiskpatch 25,最复杂;Day 4-5 实现)
      "sdk27-backup-dcim": this.sdk27BackupDcim.bind(this),
      "sdk27-entering-edl": this.sdk27EnteringEdl.bind(this),
      "sdk27-reading-boot": this.sdk27ReadingBoot.bind(this),
      "sdk27-patching-boot": this.sdk27PatchingBoot.bind(this),
      "sdk27-flashing-rawprogram": this.sdk27FlashingRawprogram.bind(this),
      "sdk27-rebooting-to-fastboot": this.sdk27RebootingToFastboot.bind(this),
      "sdk27-fastboot-flash-boot": this.sdk27FastbootFlashBoot.bind(this),
      "sdk27-fastboot-flash-userdata": this.sdk27FastbootFlashUserdata.bind(this),
      "sdk27-fastboot-flash-misc": this.sdk27FastbootFlashMisc.bind(this),
      "sdk27-waiting-boot": this.sdk27WaitingBoot.bind(this),
      "sdk27-install-preinstall": this.sdk27InstallPreinstall.bind(this),
      "sdk27-enable-charge": this.sdk27EnableCharge.bind(this),
      "sdk27-auto-grant-magisk": this.sdk27AutoGrantMagisk.bind(this),
      "sdk27-activate-systemplus": this.sdk27ActivateSystemplus.bind(this),
      "sdk27-install-xtcpatch": this.sdk27InstallXtcpatch.bind(this),
      "sdk27-install-systemui": this.sdk27InstallSystemui.bind(this),
      "sdk27-install-preinstall-apk": this.sdk27InstallPreinstallApk.bind(this),
      "sdk27-erase-misc-reboot": this.sdk27EraseMiscReboot.bind(this),
      "sdk27-install-bundled-apks": this.sdk27InstallBundledApks.bind(this),
      "sdk27-compile-packages": this.sdk27CompilePackages.bind(this),
      "sdk27-restore-dcim": this.sdk27RestoreDcim.bind(this),
      // ND03(Z10,prog_firehose_ddr.elf + 281 恢复固件 + LSPosed;Day 4-5 实现)
      "nd03-download-zip": this.nd03DownloadZip.bind(this),
      "nd03-extract": this.nd03Extract.bind(this),
      "nd03-entering-edl": this.nd03EnteringEdl.bind(this),
      "nd03-flash-281-recovery": this.nd03Flash281Recovery.bind(this),
      "nd03-flash-root-firmware": this.nd03FlashRootFirmware.bind(this),
      "nd03-erase-boot": this.nd03EraseBoot.bind(this),
      "nd03-reboot-to-fastboot": this.nd03RebootToFastboot.bind(this),
      "nd03-fastboot-flash-boot": this.nd03FastbootFlashBoot.bind(this),
      "nd03-boot-recovery": this.nd03BootRecovery.bind(this),
      "nd03-sideload-dm": this.nd03SideloadDm.bind(this),
      "nd03-flash-misc-reboot": this.nd03FlashMiscReboot.bind(this),
      "nd03-wait-3-reboots": this.nd03Wait3Reboots.bind(this),
      "nd03-auto-grant-magisk": this.nd03AutoGrantMagisk.bind(this),
      "nd03-install-xtcpatch": this.nd03InstallXtcpatch.bind(this),
      "nd03-install-toolkit": this.nd03InstallToolkit.bind(this),
      "nd03-activate-lsposed": this.nd03ActivateLsposed.bind(this),
      "nd03-install-preinstall": this.nd03InstallPreinstall.bind(this),
      "nd03-compile-packages": this.nd03CompilePackages.bind(this),
      "completed": this.completedStage.bind(this),
      "failed": async () => {
      },
      "cancelled": async () => {
      }
    };
  }
  /**
   * 完成 stage handler
   * 对应 root-SDK27.bat 末尾的 yesno 菜单:
   *   ECHO.%YELLOW%是否进行预装优化[包括模块和应用，期间需要多次选择]？
   *   menu.exe yesno.json
   *   if /i "%rootpro%"=="y" call rootpro
   *
   * 这里只在日志中提示用户:UI 端(Root.tsx)会在 SDK=27 时显示 RootProPrompt 组件
   * 调用 tools:rootpro IPC 实际执行
   */
  async completedStage(ctx) {
    if (ctx.dcimBackupDir) {
      this.log(ctx, "info", `DCIM 备份已保留: ${ctx.dcimBackupDir}(可在备份恢复页手动清理)`);
    }
    if (ctx.sdkVersion === "27") {
      this.log(
        ctx,
        "info",
        "检测到 SDK=27,建议进行预装优化(包括模块和应用,期间需要多次选择)"
      );
      this.log(ctx, "info", "提示:当手表进入长续航模式、睡眠模式等禁用模式时,划到最后一页,点击打开应用列表,即可绕过禁用模式");
      this.log(ctx, "info", "提示:你可以在 /sdcard/hidden_app_list.txt 中填写包名以实现隐藏应用");
      this.log(ctx, "info", "提示:如果需要在手表上安装应用,请在手表端选择弦-安装器,点击始终");
      this.log(ctx, "info", "请永远不要卸载 SystemPlus 和 XTCPatch,否则手表无法开机");
      this.log(ctx, "info", "请永远不要删除 magisk 自带的模块,否则手表无法开机");
      this.log(ctx, "info", "跨越山海 终见曙光");
    }
  }
  // ========== 公开 API ==========
  /**
   * 启动 Root 流程(返回 taskId,异步执行)
   * 对应 root.bat 入口
   */
  async start(options) {
    const taskId = `root_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const ctx = {
      taskId,
      stage: "preparing-resources",
      options,
      device: null,
      innermodel: "",
      isV3: false,
      smodel: false,
      sdkVersion: "",
      androidVersion: "",
      startedAt: Date.now(),
      paused: false,
      cancelled: false,
      logs: [],
      progress: 0,
      sdk25Scheme: options.sdk25Scheme ?? "boot"
    };
    this.tasks.set(taskId, ctx);
    logger$8.info(`Root 任务已启动: ${taskId}`, JSON.stringify(options));
    setImmediate(() => {
      this.run(ctx).catch((e) => {
        this.fail(ctx, e);
      });
    });
    return taskId;
  }
  /** 暂停(在下一个状态边界停下) */
  async pause(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error(`任务不存在: ${taskId}`);
    ctx.paused = true;
    this.log(ctx, "info", "用户已暂停,将在下一个状态边界停止");
    this.emit(ctx);
  }
  /** 恢复 */
  async resume(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error(`任务不存在: ${taskId}`);
    ctx.paused = false;
    this.log(ctx, "info", "用户已恢复");
    this.emit(ctx);
  }
  /** 取消(尝试恢复 DCIM,不回滚已刷的分区) */
  async cancel(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error(`任务不存在: ${taskId}`);
    ctx.cancelled = true;
    this.log(ctx, "warn", "用户已取消");
    SubprocessPool.kill(taskId);
    this.emit(ctx);
  }
  /** 状态订阅 */
  onStageChange(taskId, cb) {
    const channel = `stage-change:${taskId}`;
    this.bus.on(channel, cb);
    return () => this.bus.off(channel, cb);
  }
  /** 获取当前 context */
  getContext(taskId) {
    return this.tasks.get(taskId) ?? null;
  }
  // ========== 内部状态机驱动 ==========
  /**
   * 状态机主循环
   * while (stage not in [completed, failed, cancelled]) { ... }
   */
  async run(ctx) {
    while (ctx.stage !== "completed" && ctx.stage !== "failed" && ctx.stage !== "cancelled") {
      if (ctx.cancelled) {
        ctx.stage = "cancelled";
        ctx.endedAt = Date.now();
        this.emit(ctx);
        this.scheduleCleanup(ctx);
        return;
      }
      if (ctx.paused) {
        this.log(ctx, "info", `已暂停于 stage=${ctx.stage},等待恢复...`);
        await this.waitForResume(ctx);
        if (ctx.cancelled) continue;
      }
      ctx.progress = this.computeProgress(ctx);
      const handler = this.handlers[ctx.stage];
      if (!handler) {
        this.fail(ctx, new Error(`未注册的 stage: ${ctx.stage}`));
        return;
      }
      try {
        this.log(ctx, "info", `→ 进入 stage: ${ctx.stage}`);
        this.emit(ctx);
        await handler(ctx);
        this.log(ctx, "info", `← stage 完成: ${ctx.stage}`);
      } catch (e) {
        this.fail(ctx, e);
        return;
      }
      const next = this.nextStage(ctx);
      if (!next) {
        this.fail(ctx, new Error(`无下一 stage(当前: ${ctx.stage})`));
        return;
      }
      ctx.stage = next;
      this.emit(ctx);
    }
    if (ctx.stage === "completed") {
      ctx.endedAt = Date.now();
      ctx.progress = 100;
      this.log(ctx, "info", "Root 流程已完成");
      this.emit(ctx);
    }
    this.scheduleCleanup(ctx);
  }
  /** 等待用户恢复 */
  async waitForResume(ctx) {
    while (ctx.paused && !ctx.cancelled) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  /** 标记失败 */
  fail(ctx, e) {
    ctx.stage = "failed";
    ctx.endedAt = Date.now();
    ctx.error = {
      stage: ctx.stage,
      message: e.message,
      recoverable: false
    };
    this.log(ctx, "error", `Root 流程失败: ${e.message}`);
    this.emit(ctx);
    this.scheduleCleanup(ctx);
  }
  /** 推送 context 到所有渲染进程 */
  emit(ctx) {
    this.bus.emit(`stage-change:${ctx.taskId}`, ctx);
    for (const w of electron.BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send("root:stage-change", ctx);
      }
    }
  }
  /**
   * 延迟清理已完成的任务(避免 tasks Map 内存泄漏)
   * 完成/失败/取消后 30 分钟清理,让前端有足够时间查询最终状态
   * 同时清理 edlWork 临时文件(保留 DCIM 备份)
   */
  scheduleCleanup(ctx) {
    const taskId = ctx.taskId;
    const delay = 30 * 60 * 1e3;
    setTimeout(() => {
      this.tasks.delete(taskId);
      this.bus.removeAllListeners(`stage-change:${taskId}`);
      try {
        const workDir = paths.edlWork;
        if (fs.existsSync(workDir)) {
          for (const f of fs.readdirSync(workDir)) {
            const p = path.join(workDir, f);
            try {
              fs.rmSync(p, { recursive: true, force: true });
            } catch {
            }
          }
        }
      } catch {
      }
      logger$8.info(`任务 ${taskId} 已清理(30 分钟后)`);
    }, delay);
  }
  /** 内部日志(同时打到 Logger 和 ctx.logs) */
  log(ctx, level, msg) {
    const entry = { ts: Date.now(), level, msg };
    ctx.logs.push(entry);
    if (ctx.logs.length > 500) ctx.logs.shift();
    switch (level) {
      case "info":
        logger$8.info(msg);
        break;
      case "warn":
        logger$8.warn(msg);
        break;
      case "error":
        logger$8.error(msg);
        break;
    }
  }
  /** 计算进度(基于 stage 在总流程中的位置) */
  computeProgress(ctx) {
    const sdk = ctx.sdkVersion;
    let total = 10;
    let current = 1;
    if (sdk === "19") {
      total = 8;
      const stages = [
        "preparing-resources",
        "detecting-device",
        "reading-device-info",
        "extracting-root-zip",
        "routing-by-sdk",
        "sdk19-backup-dcim",
        "sdk19-flash-boot",
        "sdk19-install-magisk",
        "sdk19-install-xtcpatch",
        "sdk19-restore-dcim"
      ];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (sdk === "25") {
      total = 14;
      const stages = [
        "preparing-resources",
        "detecting-device",
        "reading-device-info",
        "extracting-root-zip",
        "routing-by-sdk",
        "sdk25-backup-dcim",
        "sdk25-entering-edl",
        "sdk25-reading-boot",
        "sdk25-patching-boot",
        "sdk25-flashing",
        "sdk25-rebooting",
        "sdk25-waiting-boot",
        "sdk25-install-magisk",
        "sdk25-install-xtcpatch",
        "sdk25-boot-scheme-second-edl",
        "sdk25-restore-dcim"
      ];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (sdk === "27") {
      total = 24;
      const stages = [
        "preparing-resources",
        "detecting-device",
        "reading-device-info",
        "detecting-v3",
        "extracting-root-zip",
        "routing-by-sdk",
        "sdk27-backup-dcim",
        "sdk27-entering-edl",
        "sdk27-reading-boot",
        "sdk27-patching-boot",
        "sdk27-flashing-rawprogram",
        "sdk27-rebooting-to-fastboot",
        "sdk27-fastboot-flash-boot",
        "sdk27-fastboot-flash-userdata",
        "sdk27-fastboot-flash-misc",
        "sdk27-waiting-boot",
        "sdk27-install-preinstall",
        "sdk27-enable-charge",
        "sdk27-auto-grant-magisk",
        "sdk27-activate-systemplus",
        "sdk27-install-xtcpatch",
        "sdk27-install-systemui",
        "sdk27-install-preinstall-apk",
        "sdk27-erase-misc-reboot",
        "sdk27-install-bundled-apks",
        "sdk27-compile-packages",
        "sdk27-restore-dcim"
      ];
      current = stages.indexOf(ctx.stage) + 1;
    } else if (ctx.innermodel === "ND03") {
      total = 21;
      const stages = [
        "preparing-resources",
        "detecting-device",
        "reading-device-info",
        "nd03-download-zip",
        "nd03-extract",
        "nd03-entering-edl",
        "nd03-flash-281-recovery",
        "nd03-flash-root-firmware",
        "nd03-erase-boot",
        "nd03-reboot-to-fastboot",
        "nd03-fastboot-flash-boot",
        "nd03-boot-recovery",
        "nd03-sideload-dm",
        "nd03-flash-misc-reboot",
        "nd03-wait-3-reboots",
        "nd03-auto-grant-magisk",
        "nd03-install-xtcpatch",
        "nd03-install-toolkit",
        "nd03-activate-lsposed",
        "nd03-install-preinstall",
        "nd03-compile-packages"
      ];
      current = stages.indexOf(ctx.stage) + 1;
    }
    if (ctx.stage === "completed") return 100;
    return Math.min(99, Math.round(current / total * 100));
  }
  // ========== nextStage:集中管理 stage 转移规则 ==========
  nextStage(ctx) {
    const s = ctx.stage;
    switch (s) {
      case "preparing-resources":
        return "detecting-device";
      case "detecting-device":
        if (ctx.device?.type === "qcom_edl") {
          return "selecting-model";
        }
        return "reading-device-info";
      case "selecting-model":
        return "entering-edl";
      case "entering-edl":
        return "waiting-adb-after-edl";
      case "waiting-adb-after-edl":
        return "reading-device-info";
      case "reading-device-info":
        if (ctx.androidVersion === "11") {
          this.log(ctx, "info", "触发彩蛋:你是怎么运行到这里的?");
          return "failed";
        }
        if (ctx.innermodel === "ND03") {
          return "nd03-download-zip";
        }
        return "detecting-v3";
      case "detecting-v3":
        return "extracting-root-zip";
      case "extracting-root-zip":
        return "routing-by-sdk";
      case "routing-by-sdk":
        if (ctx.sdkVersion === "19") return "sdk19-backup-dcim";
        if (ctx.sdkVersion === "25") return "sdk25-backup-dcim";
        if (ctx.sdkVersion === "27") return "sdk27-backup-dcim";
        this.log(ctx, "info", "触发彩蛋:这是xtc吗?");
        return "failed";
      case "sdk19-backup-dcim":
        return "sdk19-flash-boot";
      case "sdk19-flash-boot":
        return "sdk19-install-magisk";
      case "sdk19-install-magisk":
        return "sdk19-install-xtcpatch";
      case "sdk19-install-xtcpatch":
        return "sdk19-restore-dcim";
      case "sdk19-restore-dcim":
        return "sdk19-reboot";
      case "sdk19-reboot":
        return "completed";
      case "sdk25-backup-dcim":
        return "sdk25-select-scheme";
      case "sdk25-select-scheme":
        return "sdk25-entering-edl";
      case "sdk25-entering-edl":
        return "sdk25-reading-boot";
      case "sdk25-reading-boot":
        return "sdk25-patching-boot";
      case "sdk25-patching-boot":
        return "sdk25-flashing";
      case "sdk25-flashing":
        return "sdk25-rebooting";
      case "sdk25-rebooting":
        return "sdk25-waiting-boot";
      case "sdk25-waiting-boot":
        return "sdk25-install-magisk";
      case "sdk25-install-magisk":
        return "sdk25-install-xtcpatch";
      case "sdk25-install-xtcpatch":
        if (ctx.sdk25Scheme === "recovery") return "sdk25-boot-scheme-second-edl";
        return "sdk25-restore-dcim";
      case "sdk25-boot-scheme-second-edl":
        return "sdk25-restore-dcim";
      case "sdk25-restore-dcim":
        return "completed";
      case "sdk27-backup-dcim":
        return "sdk27-entering-edl";
      case "sdk27-entering-edl":
        return "sdk27-reading-boot";
      case "sdk27-reading-boot":
        return "sdk27-patching-boot";
      case "sdk27-patching-boot":
        return "sdk27-flashing-rawprogram";
      case "sdk27-flashing-rawprogram":
        if (ctx.smodel) return "sdk27-waiting-boot";
        if (ctx.options.nouserdata) {
          this.log(ctx, "warn", "你选择了不刷userdata,不再继续");
          return "completed";
        }
        return "sdk27-rebooting-to-fastboot";
      case "sdk27-rebooting-to-fastboot":
        return "sdk27-fastboot-flash-boot";
      case "sdk27-fastboot-flash-boot":
        return "sdk27-fastboot-flash-userdata";
      case "sdk27-fastboot-flash-userdata":
        return "sdk27-fastboot-flash-misc";
      case "sdk27-fastboot-flash-misc":
        return "sdk27-waiting-boot";
      case "sdk27-waiting-boot":
        return "sdk27-install-preinstall";
      case "sdk27-install-preinstall":
        return "sdk27-enable-charge";
      case "sdk27-enable-charge":
        return "sdk27-auto-grant-magisk";
      case "sdk27-auto-grant-magisk":
        return "sdk27-activate-systemplus";
      case "sdk27-activate-systemplus":
        return "sdk27-install-xtcpatch";
      case "sdk27-install-xtcpatch":
        return "sdk27-install-systemui";
      case "sdk27-install-systemui":
        return "sdk27-install-preinstall-apk";
      case "sdk27-install-preinstall-apk":
        return "sdk27-erase-misc-reboot";
      case "sdk27-erase-misc-reboot":
        return "sdk27-install-bundled-apks";
      case "sdk27-install-bundled-apks":
        return "sdk27-compile-packages";
      case "sdk27-compile-packages":
        return "sdk27-restore-dcim";
      case "sdk27-restore-dcim":
        return "completed";
      case "nd03-download-zip":
        return "nd03-extract";
      case "nd03-extract":
        return "nd03-entering-edl";
      case "nd03-entering-edl":
        return "nd03-flash-281-recovery";
      case "nd03-flash-281-recovery":
        return "nd03-flash-root-firmware";
      case "nd03-flash-root-firmware":
        return "nd03-erase-boot";
      case "nd03-erase-boot":
        return "nd03-reboot-to-fastboot";
      case "nd03-reboot-to-fastboot":
        return "nd03-fastboot-flash-boot";
      case "nd03-fastboot-flash-boot":
        return "nd03-boot-recovery";
      case "nd03-boot-recovery":
        return "nd03-sideload-dm";
      case "nd03-sideload-dm":
        return "nd03-flash-misc-reboot";
      case "nd03-flash-misc-reboot":
        return "nd03-wait-3-reboots";
      case "nd03-wait-3-reboots":
        return "nd03-auto-grant-magisk";
      case "nd03-auto-grant-magisk":
        return "nd03-install-xtcpatch";
      case "nd03-install-xtcpatch":
        return "nd03-install-toolkit";
      case "nd03-install-toolkit":
        return "nd03-activate-lsposed";
      case "nd03-activate-lsposed":
        return "nd03-install-preinstall";
      case "nd03-install-preinstall":
        return "nd03-compile-packages";
      case "nd03-compile-packages":
        return "completed";
      case "completed":
      case "failed":
      case "cancelled":
        return null;
      default:
        return null;
    }
  }
  // ========== Stage 方法实现 ==========
  // ---------- 通用 stages ----------
  /** 准备资源(检查 userdata/apks/xtcpatch/systemui 是否已下载,对应 root.bat:1-4) */
  async preparingResources(ctx) {
    const cacheDir = paths.cache;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const required = [
      { name: "userdata", file: "userdata.img" },
      { name: "xtcpatch", file: "xtcpatch.zip" },
      { name: "systemui", file: "systemui.zip" }
    ];
    for (const r of required) {
      const p = path.join(cacheDir, r.file);
      if (!fs.existsSync(p)) {
        this.log(ctx, "warn", `资源缺失: ${r.file},请先在"资源下载"页下载`);
      }
    }
    const apksDir = path.join(paths.resources, "apks");
    if (!fs.existsSync(apksDir)) {
      this.log(ctx, "warn", 'apks 目录不存在,请先在"资源下载"页下载 apks');
    }
  }
  /** 检测设备(对应 root.bat:84-92 device_check.exe adb qcom_edl) */
  async detectingDevice(ctx) {
    const device = DeviceService.instance.current();
    if (!device) {
      throw new Error("未检测到设备,请连接手表并开启 ADB/9008 模式");
    }
    ctx.device = device;
    this.log(ctx, "info", `设备类型: ${device.type}, serial: ${device.serial}`);
  }
  /** EDL 模式进入(对应 root.bat EDL_MENU,由 RebootService 触发) */
  async enteringEdl(ctx) {
    this.log(ctx, "info", `EDL 模式已选型号: ${ctx.options.modelChoice ?? "(未选)"}`);
  }
  /** EDL 后等待 ADB 设备(对应 root.bat:97-99) */
  async waitingAdbAfterEdl(ctx) {
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb"], 12e4);
    ctx.device = device;
    this.log(ctx, "info", `ADB 设备已连接: ${device.serial}`);
  }
  /** 读取设备信息(对应 root.bat:134-145) */
  async readingDeviceInfo(ctx) {
    if (!ctx.device || ctx.device.type !== "adb") {
      throw new Error("需要 ADB 模式设备");
    }
    const rawInnermodel = await AdbService.getprop("ro.product.innermodel");
    const innermodel = rawInnermodel.replace(/[^a-zA-Z0-9_]/g, "");
    ctx.innermodel = innermodel;
    this.log(ctx, "info", `设备 innermodel: ${innermodel}`);
    if (innermodel === "I25C") {
      ctx.smodel = true;
      this.log(ctx, "warn", "此型号(I25C/Z7A)ROOT 可能存在不稳定性问题");
    }
    const model = await AdbService.getprop("ro.product.model");
    const androidVersion = await AdbService.getprop("ro.build.version.release");
    const sdkVersion = await AdbService.getprop("ro.build.version.sdk");
    const version = await AdbService.getprop("ro.product.current.softversion");
    ctx.androidVersion = androidVersion;
    ctx.sdkVersion = sdkVersion;
    this.log(
      ctx,
      "info",
      `型号: ${model}, Android: ${androidVersion}, SDK: ${sdkVersion}, 版本: ${version}`
    );
  }
  /** V3 检测(对应 root.bat:148 call isv3) */
  async detectingV3(ctx) {
    const softVersion = await AdbService.getprop("ro.product.current.softversion");
    ctx.isV3 = checkIsV3(ctx.innermodel, softVersion);
    this.log(ctx, "info", `V3 协议: ${ctx.isV3 ? "是" : "否"}(softVersion=${softVersion})`);
  }
  /** 解压 EDL/<innermodel>.zip(对应 root.bat:170-178) */
  async extractingRootZip(ctx) {
    const zipPath = paths.edlFile(`${ctx.innermodel}.zip`);
    if (!fs.existsSync(zipPath)) {
      throw new Error(`Root 资源包不存在: ${ctx.innermodel}.zip,请先在"资源下载"页下载`);
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    this.log(ctx, "info", `解压 ${ctx.innermodel}.zip → ${workDir}`);
    await SubprocessPool.spawn({
      cmd: paths.binFile("7z.exe"),
      args: ["x", zipPath, `-o${workDir}`, "-aoa", "-bsp1"],
      cwd: paths.bin,
      encoding: "utf-8",
      timeout: TIMEOUT.install,
      taskId: ctx.taskId,
      onStdout: (line) => this.log(ctx, "info", `7z: ${line}`)
    });
    this.log(ctx, "info", "解压完成");
  }
  /** SDK 路由(对应 root.bat:180-202) */
  async routingBySdk(ctx) {
    this.log(ctx, "info", `路由到 SDK${ctx.sdkVersion} 分支`);
  }
  // ---------- SDK19 stages(Android 4.4) ----------
  /** SDK19 备份 DCIM(对应 ROOT-SDK19.bat:3-5) */
  async sdk19BackupDcim(ctx) {
    const backupDir = path.join(paths.userData, "root-backup", ctx.taskId);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, "info", "正在备份相册...");
    const r = await BackupService.backupDcim(backupDir, (msg) => this.log(ctx, "info", msg));
    if (!r.success) {
      this.log(ctx, "warn", `相册备份失败(继续流程): ${r.error}`);
    }
  }
  /** SDK19 刷入 boot(对应 ROOT-SDK19.bat:7-15) */
  async sdk19FlashBoot(ctx) {
    this.log(ctx, "info", "正在重启至 Bootloader 模式，设备处于正常状态");
    await AdbService.reboot("bootloader");
    this.log(ctx, "info", "等待 fastboot 设备...");
    await DeviceService.instance.waitFor(["fastboot"], 3e4);
    this.log(ctx, "info", "正在刷入 boot");
    const sbootImg = path.join(paths.edlWork, "sboot.img");
    if (!fs.existsSync(sbootImg)) {
      throw new Error(`sboot.img 不存在: ${sbootImg}`);
    }
    await FastbootService.flash("boot", sbootImg);
    this.log(ctx, "info", "重新启动,退出 bootloader 模式");
    await FastbootService.reboot("system");
    this.log(ctx, "info", "等待设备连接");
    const device = await DeviceService.instance.waitFor(["adb"], 6e4);
    ctx.device = device;
  }
  /** SDK19 安装 Magisk(对应 ROOT-SDK19.bat:17-32) */
  async sdk19InstallMagisk(ctx) {
    this.log(ctx, "info", "请耐心等待 120 秒，设备正在初始化");
    await new Promise((r) => setTimeout(r, 12e4));
    this.log(ctx, "info", "安装管理器");
    const managerApk = path.join(paths.edlWork, "manager.apk");
    if (fs.existsSync(managerApk)) {
      await AdbService.install(managerApk, "install");
    } else {
      this.log(ctx, "warn", `manager.apk 不存在: ${managerApk}`);
    }
    this.log(ctx, "info", "启动管理器");
    await AdbService.amStart("com.topjohnwu.magisk/.ui.MainActivity");
    this.log(ctx, "info", "修复运行环境");
    await AdbService.shell("mkdir -p /sdcard/magisk", { timeout: TIMEOUT.device });
    const magiskfileDir = path.join(paths.edlWork, "magiskfile");
    if (fs.existsSync(magiskfileDir)) {
      await AdbService.push(magiskfileDir, "/sdcard/magisk");
    } else {
      this.log(ctx, "warn", `magiskfile 目录不存在: ${magiskfileDir}`);
    }
    await AdbService.shell("rm -rf /data/adb/magisk", { timeout: TIMEOUT.shell, root: true });
    await AdbService.shell("cp -af /sdcard/magisk/* /data/adb/magisk/", {
      timeout: TIMEOUT.shellLong,
      root: true
    });
    await AdbService.shell("chmod -R 755 /data/adb/magisk/", { timeout: TIMEOUT.shell, root: true });
  }
  /** SDK19 安装 xtcpatch 模块(对应 ROOT-SDK19.bat:34) */
  async sdk19InstallXtcpatch(ctx) {
    this.log(ctx, "info", "刷入 xtcpatch 模块(已修复 instmodule2.bat → instmodule.bat)");
    const xtcpatchZip = path.join(paths.cache, "xtcpatch.zip");
    if (!fs.existsSync(xtcpatchZip)) {
      throw new Error(`xtcpatch.zip 不存在: ${xtcpatchZip}`);
    }
    const r = await MagiskService.install(xtcpatchZip, "magisk");
    if (!r.success) {
      this.log(ctx, "warn", `xtcpatch 安装失败: ${r.error}`);
    }
  }
  /** SDK19 恢复 DCIM(对应 ROOT-SDK19.bat:36-38) */
  async sdk19RestoreDcim(ctx) {
    if (!ctx.dcimBackupDir) {
      this.log(ctx, "warn", "无 DCIM 备份目录,跳过恢复");
      return;
    }
    this.log(ctx, "info", "正在恢复相册...");
    const r = await BackupService.recoverDcim(
      ctx.dcimBackupDir,
      (msg) => this.log(ctx, "info", msg)
    );
    if (!r.success) {
      this.log(ctx, "warn", `相册恢复失败: ${r.error}`);
    }
  }
  /** SDK19 重启(对应 ROOT-SDK19.bat:39-44) */
  async sdk19Reboot(ctx) {
    this.log(ctx, "info", "重启手表");
    await AdbService.reboot("system");
    this.log(ctx, "info", "您的手表 ROOT 完毕");
    try {
      const workDir = paths.edlWork;
      if (fs.existsSync(workDir)) {
        for (const f of fs.readdirSync(workDir)) {
          const p = path.join(workDir, f);
          try {
            fs.rmSync(p, { recursive: true, force: true });
          } catch {
          }
        }
      }
    } catch {
    }
  }
  // ---------- SDK25 stages(Android 7.1,EDL + magiskpatch 21) ----------
  /** SDK25 备份 DCIM(对应 ROOT-SDK25.bat:3-5) */
  async sdk25BackupDcim(ctx) {
    const backupDir = path.join(paths.userData, "root-backup", ctx.taskId);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, "info", "正在备份相册...");
    const r = await BackupService.backupDcim(backupDir, (msg) => this.log(ctx, "info", msg));
    if (!r.success) {
      this.log(ctx, "warn", `相册备份失败(继续流程): ${r.error}`);
    }
  }
  /** SDK25 进入 EDL(对应 ROOT-SDK25.bat:14-23) */
  async sdk25EnteringEdl(ctx) {
    this.log(ctx, "info", "重启手表至 9008");
    await AdbService.reboot("edl");
    this.log(ctx, "info", "等待 9008 设备...");
    const port = await EdlService.waitForEdl(6e4);
    ctx.edlPort = port;
    this.log(ctx, "info", `9008 端口: ${port}`);
    this.log(ctx, "info", "发送引导: msm8909w.mbn");
    await EdlService.loadFirehose({ port, loader: "msm8909w.mbn" });
    await new Promise((r) => setTimeout(r, 2e3));
  }
  /** SDK25 读取 boot(对应 ROOT-SDK25.bat:24-32) */
  async sdk25ReadingBoot(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const bootXml = path.join(paths.edlWork, "boot.xml");
    if (!fs.existsSync(bootXml)) {
      throw new Error(`boot.xml 不存在: ${bootXml}`);
    }
    this.log(ctx, "info", "读取 boot 分区...");
    await EdlService.readPartitions({
      port: ctx.edlPort,
      loader: "msm8909w.mbn",
      xmlPath: bootXml,
      outputDir: paths.edlWork
    });
    const srcBoot = path.join(paths.edlWork, "boot.img");
    const dstBoot = path.join(paths.cache, "boot.img");
    if (!fs.existsSync(srcBoot)) {
      throw new Error(`fh_loader 读取 boot.img 失败: ${srcBoot} 不存在`);
    }
    if (fs.existsSync(dstBoot)) fs.unlinkSync(dstBoot);
    fs.renameSync(srcBoot, dstBoot);
    this.log(ctx, "info", `boot.img 已读取 → ${dstBoot}`);
  }
  /** SDK25 修补 boot(对应 ROOT-SDK25.bat:34-49) */
  async sdk25PatchingBoot(ctx) {
    this.log(ctx, "info", "开始修补 boot(magiskpatch 21)");
    const inputBoot = path.join(paths.cache, "boot.img");
    const patchedBoot = path.join(paths.edlWork, "boot.img");
    const r = await MagiskPatcher.patch(inputBoot, patchedBoot, 21, paths.edlWork, ctx.taskId);
    if (!r.success) {
      throw new Error(`magiskpatch 失败: ${r.error}`);
    }
    ctx.patchedBootPath = patchedBoot;
    this.log(ctx, "info", `magiskpatch 完成(status=${r.status})`);
    this.log(ctx, "info", "解包 boot");
    await this.runMagiskboot(ctx, ["unpack", "-h", "boot.img"]);
    this.log(ctx, "info", "替换 adbd");
    const adbdSrc = paths.binFile("711_adbd");
    const adbdDst = path.join(paths.edlWork, "711_adbd");
    if (fs.existsSync(adbdSrc) && !fs.existsSync(adbdDst)) {
      fs.copyFileSync(adbdSrc, adbdDst);
    }
    await this.runMagiskboot(ctx, ["cpio", "ramdisk.cpio", "add 0750 sbin/adbd 711_adbd"]);
    this.log(ctx, "info", "宽容 selinux(patch_boot)");
    const kernelPath = path.join(paths.edlWork, "kernel");
    const patchResult = BootPatcher.patch(kernelPath);
    if (!patchResult.success || !patchResult.output.includes("success")) {
      throw new Error(`patch_boot 失败: ${patchResult.error ?? patchResult.output}`);
    }
    for (const p of patchResult.patches) {
      this.log(ctx, "info", `patch_boot: ${p}`);
    }
    this.log(ctx, "info", "打包 boot");
    await this.runMagiskboot(ctx, ["repack", "boot.img"]);
    this.log(ctx, "info", "BOOT 处理完成");
    const newBootPath = path.join(paths.edlWork, "new-boot.img");
    if (!fs.existsSync(newBootPath)) {
      throw new Error("magiskboot repack 未生成 new-boot.img");
    }
    if (fs.existsSync(patchedBoot)) fs.unlinkSync(patchedBoot);
    fs.renameSync(newBootPath, patchedBoot);
    const tmpBoot = path.join(paths.cache, "boot.img");
    try {
      if (fs.existsSync(tmpBoot)) fs.unlinkSync(tmpBoot);
    } catch {
    }
  }
  /** SDK25 刷入(对应 ROOT-SDK25.bat:50-59 BOOT 方案 / 70-76 Recovery 方案) */
  async sdk25Flashing(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const workDir = paths.edlWork;
    const scheme = ctx.sdk25Scheme ?? "boot";
    if (scheme === "boot") {
      this.log(ctx, "info", "刷入 BOOT");
      const bootXml = path.join(workDir, "boot.xml");
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "msm8909w.mbn",
        xmlPath: bootXml,
        imagesDir: workDir
      });
      this.log(ctx, "info", "boot 刷入完毕");
    } else {
      this.log(ctx, "info", "刷入 BOOT 至 Recovery 分区");
      const srcBoot = path.join(workDir, "boot.img");
      const dstRecovery = path.join(workDir, "recovery.img");
      if (fs.existsSync(srcBoot)) {
        fs.copyFileSync(srcBoot, dstRecovery);
      }
      const recoveryXml = path.join(workDir, "recovery.xml");
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "msm8909w.mbn",
        xmlPath: recoveryXml,
        imagesDir: workDir
      });
      this.log(ctx, "info", "刷入 misc");
      const miscXml = path.join(workDir, "misc.xml");
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "msm8909w.mbn",
        xmlPath: miscXml,
        imagesDir: workDir
      });
    }
    this.log(ctx, "info", "重启手表(9008)");
    await EdlService.reboot({ port: ctx.edlPort, loader: "msm8909w.mbn" });
    this.log(ctx, "info", "请耐心等待设备响应");
  }
  /** SDK25 rebooting(占位,实际 reboot 已在 flashing 中完成) */
  async sdk25Rebooting(ctx) {
    this.log(ctx, "info", "已发送重启指令");
  }
  /** SDK25 等待开机(对应 ROOT-SDK25.bat:79 call boot_completed.bat) */
  async sdk25WaitingBoot(ctx) {
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb"], 18e4);
    ctx.device = device;
    this.log(ctx, "info", "等待开机完成...");
    await AdbService.waitForBoot(18e4);
  }
  /** SDK25 安装 Magisk 与模块(对应 ROOT-SDK25.bat:80-90) */
  async sdk25InstallMagisk(ctx) {
    this.log(ctx, "info", "安装管理器");
    const managerApk = path.join(paths.edlWork, "manager.apk");
    if (fs.existsSync(managerApk)) {
      await AdbService.install(managerApk, "install");
    } else {
      this.log(ctx, "warn", `manager.apk 不存在: ${managerApk}`);
    }
    this.log(ctx, "info", "启动管理器[等待五秒]");
    await new Promise((r) => setTimeout(r, 5e3));
    await AdbService.amStart("com.topjohnwu.magisk/a.c");
    const xtcpatchDir = path.join(paths.edlWork, "xtcpatch");
    if (fs.existsSync(xtcpatchDir)) {
      this.log(ctx, "info", "push xtcpatch → /sdcard/");
      await AdbService.push(xtcpatchDir, "/sdcard/");
    }
    const magiskfileDir = path.join(paths.edlWork, "magiskfile");
    if (fs.existsSync(magiskfileDir)) {
      this.log(ctx, "info", "push magiskfile → /sdcard/");
      await AdbService.push(magiskfileDir, "/sdcard/");
    }
    this.log(ctx, "info", "复制运行环境及刷入模块");
    const setupSh = paths.scriptFile("setup_magisk_env.sh");
    if (fs.existsSync(setupSh)) {
      await AdbService.push(setupSh, "/sdcard/setup_magisk_env.sh");
      await AdbService.shell("sh /sdcard/setup_magisk_env.sh", { timeout: TIMEOUT.flash, root: true });
    } else {
      this.log(ctx, "warn", `setup_magisk_env.sh 不存在: ${setupSh}`);
    }
  }
  /** SDK25 安装 xtcpatch 模块(shinst 方式)+ 应用商店(对应 ROOT-SDK25.bat:91-99) */
  async sdk25InstallXtcpatch(ctx) {
    this.log(ctx, "info", "刷入 xtcpatch 模块(shinst)");
    const xtcpatchZip = path.join(paths.cache, "xtcpatch.zip");
    if (fs.existsSync(xtcpatchZip)) {
      const r = await MagiskService.install(xtcpatchZip, "shinst");
      if (!r.success) {
        this.log(ctx, "warn", `xtcpatch 安装失败: ${r.error}`);
      }
    } else {
      this.log(ctx, "warn", `xtcpatch.zip 不存在: ${xtcpatchZip}`);
    }
    this.log(ctx, "info", "安装第三方应用商店");
    const apksDir = path.join(paths.resources, "apks");
    const apkFiles = ["appstore.apk", "appstore2.apk", "appstore3.apk", "appstore4.apk", "MoyeInstaller.apk"];
    for (const f of apkFiles) {
      const p = path.join(apksDir, f);
      if (fs.existsSync(p)) {
        this.log(ctx, "info", `安装: ${f}`);
        await AdbService.install(p, "install");
      }
    }
  }
  /** SDK25 Recovery 方案二次进 EDL 刷 recovery+misc(对应 ROOT-SDK25.bat:103-117) */
  async sdk25BootSchemeSecondEdl(ctx) {
    this.log(ctx, "info", "重启手表至 9008(二次 EDL)");
    await AdbService.reboot("edl");
    const port = await EdlService.waitForEdl(6e4);
    ctx.edlPort = port;
    this.log(ctx, "info", `9008 端口: ${port}`);
    this.log(ctx, "info", "发送引导: msm8909w.mbn");
    await EdlService.loadFirehose({ port, loader: "msm8909w.mbn" });
    const workDir = paths.edlWork;
    this.log(ctx, "info", "刷入 BOOT 至 Recovery 分区");
    await EdlService.flashPartitions({
      port,
      loader: "msm8909w.mbn",
      xmlPath: path.join(workDir, "recovery.xml"),
      imagesDir: workDir
    });
    this.log(ctx, "info", "刷入 misc");
    await EdlService.flashPartitions({
      port,
      loader: "msm8909w.mbn",
      xmlPath: path.join(workDir, "misc.xml"),
      imagesDir: workDir
    });
    this.log(ctx, "info", "重启手表");
    await EdlService.reboot({ port, loader: "msm8909w.mbn" });
  }
  /** SDK25 恢复 DCIM + 检查 magisk(对应 ROOT-SDK25.bat:118-145) */
  async sdk25RestoreDcim(ctx) {
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb", "qcom_edl"], 18e4);
    if (device.type === "adb") {
      ctx.device = device;
      this.log(ctx, "info", "等待开机完成...");
      await AdbService.waitForBoot(18e4);
      this.log(ctx, "info", "重启手表");
      await AdbService.reboot("system");
      const device2 = await DeviceService.instance.waitFor(["adb", "qcom_edl"], 18e4);
      if (device2.type === "adb") {
        ctx.device = device2;
        await AdbService.waitForBoot(18e4);
      }
    }
    if (ctx.dcimBackupDir) {
      this.log(ctx, "info", "正在恢复相册...");
      const r = await BackupService.recoverDcim(
        ctx.dcimBackupDir,
        (msg) => this.log(ctx, "info", msg)
      );
      if (!r.success) {
        this.log(ctx, "warn", `相册恢复失败: ${r.error}`);
      }
    }
    this.log(ctx, "info", "正在检查 magisk");
    let retry = 0;
    while (retry < 3) {
      const rootResult = await AdbService.root();
      if (rootResult.granted) {
        this.log(ctx, "info", "Magisk 已就绪");
        return;
      }
      retry++;
      this.log(ctx, "warn", `Magisk 检查失败(${retry}/3),5 秒后重试`);
      await new Promise((r) => setTimeout(r, 5e3));
    }
    this.log(ctx, "error", "ROOT 失败!发生错误,无法获取 magisk,请尝试换方案再次 root");
    throw new Error("ROOT 失败:无法获取 magisk,请尝试换方案再次 root");
  }
  // ========== 辅助:运行 magiskboot 命令(cwd=edlWork) ==========
  async runMagiskboot(ctx, args) {
    const magiskbootExe = paths.binFile("magiskboot.exe");
    await SubprocessPool.spawn({
      cmd: magiskbootExe,
      args,
      cwd: paths.edlWork,
      encoding: "utf-8",
      timeout: TIMEOUT.flash,
      taskId: ctx.taskId,
      onStdout: (line) => this.log(ctx, "info", `magiskboot: ${line}`),
      onStderr: (line) => this.log(ctx, "warn", `magiskboot stderr: ${line}`)
    });
  }
  // ========== SDK27/ND03 共用辅助方法 ==========
  /**
   * 安装 APK(important 方式:最多 6 次重试,每次间隔 30 秒)
   * 对应原 instapp.bat :important / :importanterror
   *   adb install -r -t -d "%args1%" → find "Success"
   *   失败:retry < 6 ? sleep 30 重试 : goto error
   */
  async instappImportant(ctx, apkPath) {
    if (!fs.existsSync(apkPath)) {
      this.log(ctx, "warn", `APK 不存在: ${apkPath}(跳过)`);
      return;
    }
    this.log(ctx, "info", `正在安装(important): ${path.basename(apkPath)}`);
    for (let retry = 0; retry < 6; retry++) {
      const r = await AdbService.install(apkPath, "install");
      if (r.success) {
        this.log(ctx, "info", "安装成功");
        return;
      }
      if (retry < 5) {
        this.log(ctx, "warn", `安装失败,30 秒后重试(${retry + 1}/6)`);
        await new Promise((s) => setTimeout(s, 3e4));
      }
    }
    throw new Error(`安装失败(重试 6 次): ${path.basename(apkPath)}`);
  }
  /**
   * 安装 APK(普通方式,失败仅警告)
   * 对应原 instapp.bat 默认分支:adb install -r -t -d
   */
  async instappOptional(ctx, apkPath) {
    if (!fs.existsSync(apkPath)) {
      return;
    }
    this.log(ctx, "info", `安装: ${path.basename(apkPath)}`);
    const r = await AdbService.install(apkPath, "install");
    if (!r.success) {
      this.log(ctx, "warn", `安装失败: ${path.basename(apkPath)}`);
    }
  }
  /** 等待 ADB 设备并检查 Xse 限制(对应 device_check.exe adb fastboot + devicestatus=adb 检查) */
  async waitForAdbCheckXse(ctx, timeout = 18e4) {
    this.log(ctx, "info", "等待 ADB/fastboot 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb", "fastboot"], timeout);
    if (device.type !== "adb") {
      this.log(ctx, "error", "您的设备可能触发了Xse限制!请重新进行root");
      throw new Error("您的设备可能触发了Xse限制!请重新进行root");
    }
    ctx.device = device;
  }
  /** 等待 ADB 或 9008 设备(对应 device_check.exe adb qcom_edl) */
  async waitForAdbOrEdl(ctx, timeout = 18e4) {
    this.log(ctx, "info", "等待 ADB/9008 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb", "qcom_edl"], timeout);
    ctx.device = device;
  }
  /** 启动 scrcpy 投屏(对应 start scrcpy-noconsole.vbs) */
  async startScrcpy(ctx) {
    try {
      const pid = await ScrcpyService.launch({ showTouches: true });
      this.log(ctx, "info", `scrcpy 已启动(pid=${pid}),请在投屏窗口手动操作`);
      this.log(ctx, "info", "提示:如果手表息屏,在投屏窗口单击右键即可");
      return pid;
    } catch (e) {
      this.log(ctx, "warn", `scrcpy 启动失败: ${e.message}`);
      return null;
    }
  }
  /**
   * 检查 Magisk 是否就绪(对应 adb shell "su -c magisk -v")
   * @returns true=已就绪,false=未就绪
   */
  async checkMagiskReady(ctx) {
    try {
      const out = await AdbService.shell("magisk -v", { timeout: TIMEOUT.shell, root: true });
      const ready = /magisk/i.test(out) && out.trim().length > 0;
      if (ready) {
        this.log(ctx, "info", `magisk -v: ${out.trim()}`);
      }
      return ready;
    } catch {
      return false;
    }
  }
  /**
   * automagisk.bat 的 11 步点击序列(SDK27 专用,坐标逐字一致)
   * 失败时启动 scrcpy 让用户手动操作,然后重新检查
   *
   * 原 .bat 步骤:
   *   am start -n com.topjohnwu.magisk/.ui.MainActivity
   *   busybox sleep 10
   *   input keyevent 4
   *   am start -n com.topjohnwu.magisk/.ui.MainActivity
   *   input tap 304 26
   *   input swipe 160 300 160 60 100 (x5)
   *   input tap 200 100
   *   input tap 200 230
   *   input tap 200 300
   *   input tap 200 140
   *   su -c magisk -v (检查)
   */
  async autoMagiskSdk27(ctx) {
    this.log(ctx, "info", "正在自动打开自动响应,请稍后");
    await AdbService.amStart("com.topjohnwu.magisk/.ui.MainActivity");
    await new Promise((r) => setTimeout(r, 1e4));
    await AdbService.shell("input keyevent 4", { timeout: TIMEOUT.device });
    await AdbService.amStart("com.topjohnwu.magisk/.ui.MainActivity");
    const device = await DeviceService.instance.waitFor(["adb"], 3e4);
    ctx.device = device;
    await AdbService.inputTap(304, 26);
    for (let i = 0; i < 5; i++) {
      await AdbService.inputSwipe(160, 300, 160, 60, 100);
    }
    await AdbService.inputTap(200, 100);
    await AdbService.inputTap(200, 230);
    await AdbService.inputTap(200, 300);
    await AdbService.inputTap(200, 140);
    if (await this.checkMagiskReady(ctx)) {
      return;
    }
    this.log(ctx, "error", "自动授予出错及手动授予权限");
    await this.startScrcpy(ctx);
    this.log(ctx, "info", "请打开 Magisk 右上角设置,往下滑,找到自动响应,修改为允许,然后找到超级用户通知,修改为无");
    this.log(ctx, "info", "然后在主页点击超级用户,将所有开关打开");
    this.log(ctx, "info", "操作完成后请等待自动重新检查(60 秒)");
    for (let retry = 0; retry < 3; retry++) {
      await new Promise((r) => setTimeout(r, 6e4));
      if (await this.checkMagiskReady(ctx)) {
        return;
      }
      this.log(ctx, "warn", `授予出错,请重新授予(${retry + 1}/3)`);
    }
    throw new Error("自动授予 Magisk 失败,请手动操作后重试");
  }
  /**
   * automagisk 的 ND03 变体点击序列(坐标与 SDK27 不同!)
   * 对应 nd03root.bat 中的自动授权点击序列:
   *   am start -n com.xtc.b/com.topjohnwu.magisk.ui.MainActivity
   *   busybox sleep 2
   *   am start -n com.xtc.b/com.topjohnwu.magisk.ui.MainActivity
   *   busybox sleep 5
   *   input tap 376 51
   *   busybox sleep 0.5
   *   input swipe 200 400 200 100 (x8)
   *   busybox sleep 0.5
   *   input tap 200 330
   *   busybox sleep 0.5
   *   input tap 200 180
   *   busybox sleep 0.5
   *   input swipe 200 200 200 300
   *   busybox sleep 0.5
   *   input tap 200 150
   *   busybox sleep 0.5
   *   input tap 200 315
   *   su -c magisk -v (检查)
   */
  async autoMagiskNd03(ctx) {
    this.log(ctx, "info", "正在自动打开自动响应,请稍后");
    await AdbService.amStart("com.xtc.b/com.topjohnwu.magisk.ui.MainActivity");
    await new Promise((r) => setTimeout(r, 2e3));
    await AdbService.amStart("com.xtc.b/com.topjohnwu.magisk.ui.MainActivity");
    const device = await DeviceService.instance.waitFor(["adb"], 3e4);
    ctx.device = device;
    await new Promise((r) => setTimeout(r, 5e3));
    await AdbService.inputTap(376, 51);
    await new Promise((r) => setTimeout(r, 500));
    for (let i = 0; i < 8; i++) {
      await AdbService.inputSwipe(200, 400, 200, 100, 0);
    }
    await new Promise((r) => setTimeout(r, 500));
    await AdbService.inputTap(200, 330);
    await new Promise((r) => setTimeout(r, 500));
    await AdbService.inputTap(200, 180);
    await new Promise((r) => setTimeout(r, 500));
    await AdbService.inputSwipe(200, 200, 200, 300, 0);
    await new Promise((r) => setTimeout(r, 500));
    await AdbService.inputTap(200, 150);
    await new Promise((r) => setTimeout(r, 500));
    await AdbService.inputTap(200, 315);
    if (await this.checkMagiskReady(ctx)) {
      return;
    }
    this.log(ctx, "error", "自动授予出错及手动授予权限");
    await AdbService.amStart("com.xtc.b/com.topjohnwu.magisk.ui.MainActivity");
    await DeviceService.instance.waitFor(["adb"], 3e4);
    await this.startScrcpy(ctx);
    this.log(ctx, "info", "请打开 Magisk 右上角设置,往下滑,找到自动响应,修改为允许,然后找到超级用户通知,修改为无");
    this.log(ctx, "info", "然后在主页点击超级用户,将所有开关打开");
    this.log(ctx, "info", "操作完成后请等待自动重新检查(60 秒)");
    for (let retry = 0; retry < 3; retry++) {
      await new Promise((r) => setTimeout(r, 6e4));
      if (await this.checkMagiskReady(ctx)) {
        return;
      }
      this.log(ctx, "warn", `授予出错,请重新授予(${retry + 1}/3)`);
    }
    throw new Error("自动授予 Magisk 失败,请手动操作后重试");
  }
  /**
   * autosystemplus.bat 的完整流程
   *   1. sleep 10
   *   2. push autosystemplus.sh + 执行
   *   3. push systemplus.sh + 执行 → 检查返回值(0=已激活,1=未激活)
   *   4. push toolkit.sh + 执行 → 检查返回值
   *   失败时:启动 scrcpy + am start ActiveSelfActivity + 等待用户 → 重试
   */
  async autoSystemPlus(ctx) {
    this.log(ctx, "info", "正在自动激活,请稍后");
    await new Promise((r) => setTimeout(r, 1e4));
    const autoSh = paths.scriptFile("autosystemplus.sh");
    if (fs.existsSync(autoSh)) {
      await AdbService.push(autoSh, "/sdcard/autosystemplus.sh");
      try {
        await AdbService.shell("sh /sdcard/autosystemplus.sh", { timeout: TIMEOUT.shellLong, root: true });
      } catch (e) {
        this.log(ctx, "warn", `autosystemplus.sh 执行失败: ${e.message}`);
      }
    } else {
      this.log(ctx, "warn", `autosystemplus.sh 不存在: ${autoSh}`);
    }
    const systemplusSh = paths.scriptFile("systemplus.sh");
    const toolkitSh = paths.scriptFile("toolkit.sh");
    let retry = 0;
    while (retry < 3) {
      if (fs.existsSync(systemplusSh)) {
        await AdbService.push(systemplusSh, "/sdcard/systemplus.sh");
        this.log(ctx, "info", "开始检查 SystemPlus 激活状态...");
        let systemplusOut = "";
        try {
          systemplusOut = await AdbService.shell("sh /sdcard/systemplus.sh", {
            timeout: TIMEOUT.shell,
            root: true
          });
        } catch (e) {
          this.log(ctx, "warn", `systemplus.sh 执行失败: ${e.message}`);
        }
        if (systemplusOut.trim() === "1") {
          this.log(ctx, "error", "未激活");
          this.log(ctx, "error", "没有激活 SystemPlus!请手动激活后重试");
          await this.startScrcpy(ctx);
          try {
            await AdbService.shell("am start -n com.huanli233.systemplus/.ActiveSelfActivity", {
              timeout: TIMEOUT.device,
              root: true
            });
          } catch {
          }
          this.log(ctx, "info", "请往下滑,找到自激活,然后点击激活 SystemPlus 与激活核心破解");
          this.log(ctx, "info", "操作完成后请等待自动重新检查(60 秒)");
          await new Promise((r) => setTimeout(r, 6e4));
          retry++;
          continue;
        }
        this.log(ctx, "info", "已激活");
      } else {
        this.log(ctx, "warn", `systemplus.sh 不存在: ${systemplusSh}`);
        break;
      }
      if (fs.existsSync(toolkitSh)) {
        await AdbService.push(toolkitSh, "/sdcard/toolkit.sh");
        this.log(ctx, "info", "开始检查核心破解激活状态...");
        let toolkitOut = "";
        try {
          toolkitOut = await AdbService.shell("sh /sdcard/toolkit.sh", {
            timeout: TIMEOUT.shell,
            root: true
          });
        } catch (e) {
          this.log(ctx, "warn", `toolkit.sh 执行失败: ${e.message}`);
        }
        if (toolkitOut.trim() === "1") {
          this.log(ctx, "error", "未激活");
          this.log(ctx, "error", "没有激活核心破解!请手动激活后重试");
          await this.startScrcpy(ctx);
          try {
            await AdbService.shell("am start -n com.huanli233.systemplus/.ActiveSelfActivity", {
              timeout: TIMEOUT.device,
              root: true
            });
          } catch {
          }
          this.log(ctx, "info", "请往下滑,找到自激活,然后点击激活 SystemPlus 与激活核心破解");
          this.log(ctx, "info", "操作完成后请等待自动重新检查(60 秒)");
          await new Promise((r) => setTimeout(r, 6e4));
          retry++;
          continue;
        }
        this.log(ctx, "info", "已激活");
      } else {
        this.log(ctx, "warn", `toolkit.sh 不存在: ${toolkitSh}`);
      }
      return;
    }
    throw new Error("SystemPlus/核心破解激活失败,请手动操作后重试");
  }
  /**
   * LSPosed 作用域 7 步点击(ND03 专用,坐标逐字一致)
   * 对应 nd03root.bat:
   *   am start -n org.lsposed.manager/.ui.activity.MainActivity
   *   busybox sleep 5
   *   input tap 115 271 → sleep 0.5
   *   input tap 122 433 → sleep 0.5
   *   input tap 200 173 → sleep 0.5
   *   input tap 180 200 → sleep 0.5
   *   input tap 25 30   → sleep 0.5
   *   input tap 200 250 → sleep 0.5
   *   input tap 180 200 → sleep 0.5
   *   input tap 25 30
   */
  async activateLsposed(ctx) {
    this.log(ctx, "info", "正在勾选作用域,请稍后");
    try {
      await AdbService.shell("am start -n org.lsposed.manager/.ui.activity.MainActivity", {
        timeout: TIMEOUT.device,
        root: true
      });
    } catch (e) {
      this.log(ctx, "warn", `启动 LSPosed 失败: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 5e3));
    const taps = [
      [115, 271],
      [122, 433],
      [200, 173],
      [180, 200],
      [25, 30],
      [200, 250],
      [180, 200],
      [25, 30]
    ];
    for (let i = 0; i < taps.length; i++) {
      const [x, y] = taps[i];
      await AdbService.inputTap(x, y);
      if (i < taps.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }
  /**
   * 写本地 misc.bin 文件(内容 "ffbm-02")
   * 对应原 .bat:echo ffbm-02 > misc.bin
   * 注:echo 会自动追加 \r\n,这里保留 \r\n(原 .bat 字面行为)
   */
  writeMiscBin(ctx) {
    const miscBin = path.join(paths.cache, "misc.bin");
    fs.writeFileSync(miscBin, "ffbm-02\r\n", "latin1");
    this.log(ctx, "info", `已写入 misc.bin: ${miscBin}`);
    return miscBin;
  }
  // ---------- SDK27 stages(Android 8.1,EDL + magiskpatch 25,最复杂) ----------
  /** SDK27 备份 DCIM(对应 root-SDK27.bat:2-4) */
  async sdk27BackupDcim(ctx) {
    const backupDir = path.join(paths.userData, "root-backup", ctx.taskId);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    ctx.dcimBackupDir = backupDir;
    this.log(ctx, "info", "正在备份相册...");
    const r = await BackupService.backupDcim(backupDir, (msg) => this.log(ctx, "info", msg));
    if (!r.success) {
      this.log(ctx, "warn", `相册备份失败(继续流程): ${r.error}`);
    }
  }
  /** SDK27 进入 EDL(对应 root-SDK27.bat:6-12) */
  async sdk27EnteringEdl(ctx) {
    this.log(ctx, "info", "重启手表至 9008");
    await AdbService.reboot("edl");
    this.log(ctx, "info", "等待 9008 设备...");
    const port = await EdlService.waitForEdl(6e4);
    ctx.edlPort = port;
    this.log(ctx, "info", `9008 端口: ${port}`);
    this.log(ctx, "info", "发送引导: msm8937.mbn");
    await EdlService.loadFirehose({ port, loader: "msm8937.mbn" });
    await new Promise((r) => setTimeout(r, 2e3));
  }
  /** SDK27 读取 boot(对应 root-SDK27.bat:13-21) */
  async sdk27ReadingBoot(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const bootXml = path.join(paths.edlWork, "boot.xml");
    if (!fs.existsSync(bootXml)) {
      throw new Error(`boot.xml 不存在: ${bootXml}`);
    }
    this.log(ctx, "info", "读取 boot 分区...");
    await EdlService.readPartitions({
      port: ctx.edlPort,
      loader: "msm8937.mbn",
      xmlPath: bootXml,
      outputDir: paths.edlWork
    });
    const srcBoot = path.join(paths.edlWork, "boot.img");
    const dstBoot = path.join(paths.cache, "boot.img");
    if (!fs.existsSync(srcBoot)) {
      this.log(ctx, "error", "移动 boot.img 文件失败");
      this.log(ctx, "error", "这是一个致命问题,可能数据线连接不稳定,没有成功读取 boot");
      throw new Error("移动 boot.img 文件失败(可能数据线连接不稳定)");
    }
    if (fs.existsSync(dstBoot)) fs.unlinkSync(dstBoot);
    fs.renameSync(srcBoot, dstBoot);
    this.log(ctx, "info", `boot.img 已读取 → ${dstBoot}`);
  }
  /** SDK27 修补 boot(对应 root-SDK27.bat:23-43) */
  async sdk27PatchingBoot(ctx) {
    await new Promise((r2) => setTimeout(r2, 1e3));
    this.log(ctx, "info", "开始修补 boot(magiskpatch 25)");
    const inputBoot = path.join(paths.cache, "boot.img");
    const patchedBoot = path.join(paths.edlWork, "boot.img");
    const r = await MagiskPatcher.patch(
      inputBoot,
      patchedBoot,
      25,
      paths.edlWork,
      ctx.taskId
    );
    if (!r.success) {
      this.log(ctx, "error", "修补 boot 失败,按任意键退出");
      throw new Error(`magiskpatch 失败: ${r.error}`);
    }
    ctx.patchedBootPath = patchedBoot;
    this.log(ctx, "info", `magiskpatch 完成(status=${r.status})`);
    this.log(ctx, "info", "解包 boot");
    await this.runMagiskboot(ctx, ["unpack", "-h", "boot.img"]);
    this.log(ctx, "info", "替换 adbd(810_adbd)");
    const adbdSrc = paths.binFile("810_adbd");
    const adbdDst = path.join(paths.edlWork, "810_adbd");
    if (fs.existsSync(adbdSrc) && !fs.existsSync(adbdDst)) {
      fs.copyFileSync(adbdSrc, adbdDst);
    }
    await this.runMagiskboot(ctx, ["cpio", "ramdisk.cpio", "add 0750 sbin/adbd 810_adbd"]);
    this.log(ctx, "info", "添加 xse.rc overlay");
    const xseRcSrc = paths.binFile("xse.rc");
    const xseRcDst = path.join(paths.edlWork, "xse.rc");
    if (fs.existsSync(xseRcSrc) && !fs.existsSync(xseRcDst)) {
      fs.copyFileSync(xseRcSrc, xseRcDst);
    }
    await this.runMagiskboot(ctx, ["cpio", "ramdisk.cpio", "add 0750 overlay.d/xse.rc xse.rc"]);
    this.log(ctx, "info", "宽容 selinux(patch_boot)");
    const kernelPath = path.join(paths.edlWork, "kernel");
    const patchResult = BootPatcher.patch(kernelPath);
    if (!patchResult.success || !patchResult.output.includes("success")) {
      this.log(ctx, "error", "patch_boot.exe 无法运行,请尝试安装 VC 运行库合集");
      throw new Error(`patch_boot 失败: ${patchResult.error ?? patchResult.output}`);
    }
    for (const p of patchResult.patches) {
      this.log(ctx, "info", `patch_boot: ${p}`);
    }
    this.log(ctx, "info", "打包 boot");
    await this.runMagiskboot(ctx, ["repack", "boot.img"]);
    this.log(ctx, "info", "BOOT 处理完成!!!");
    const newBootPath = path.join(paths.edlWork, "new-boot.img");
    if (!fs.existsSync(newBootPath)) {
      throw new Error("magiskboot repack 未生成 new-boot.img");
    }
    const sbootImg = path.join(paths.edlWork, "sboot.img");
    if (fs.existsSync(sbootImg)) fs.unlinkSync(sbootImg);
    fs.copyFileSync(newBootPath, sbootImg);
    this.log(ctx, "info", `已生成 sboot.img: ${sbootImg}`);
    const tmpBoot = path.join(paths.cache, "boot.img");
    try {
      if (fs.existsSync(tmpBoot)) fs.unlinkSync(tmpBoot);
    } catch {
    }
  }
  /**
   * SDK27 刷入 rawprogram(对应 root-SDK27.bat:45-73)
   * - smodel=1:copy sboot→recovery + flash recovery.xml + flash rawprogram0 + qfh_loader reboot(然后 nextStage 跳 waiting-boot)
   * - 非 smodel=1:flash rawprogram0
   *   - nouserdata=1:qfh_loader reboot + 退出(然后 nextStage 跳 completed)
   *   - 否则:copy eboot.img → tmp/boot.img + flash boot.xml(擦除 boot)+ qfh_loader reboot
   */
  async sdk27FlashingRawprogram(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const workDir = paths.edlWork;
    if (ctx.smodel) {
      this.log(ctx, "info", "刷入 recovery");
      const sbootImg = path.join(workDir, "sboot.img");
      const recoveryImg = path.join(workDir, "recovery.img");
      if (fs.existsSync(sbootImg)) {
        fs.copyFileSync(sbootImg, recoveryImg);
      }
      const recoveryXml = path.join(workDir, "recovery.xml");
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "msm8937.mbn",
        xmlPath: recoveryXml,
        imagesDir: workDir
      });
      this.log(ctx, "info", "刷入 boot,aboot,userdata,misc");
      const rawprogramXml2 = path.join(workDir, "rawprogram0.xml");
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "msm8937.mbn",
        xmlPath: rawprogramXml2,
        imagesDir: workDir
      });
      this.log(ctx, "info", "重启手表(9008)");
      await EdlService.reboot({ port: ctx.edlPort, loader: "msm8937.mbn" });
      return;
    }
    this.log(ctx, "info", "刷入 recovery,aboot");
    const rawprogramXml = path.join(workDir, "rawprogram0.xml");
    await EdlService.flashPartitions({
      port: ctx.edlPort,
      loader: "msm8937.mbn",
      xmlPath: rawprogramXml,
      imagesDir: workDir
    });
    if (ctx.options.nouserdata) {
      this.log(ctx, "info", "重启手表");
      await EdlService.reboot({ port: ctx.edlPort, loader: "msm8937.mbn" });
      this.log(ctx, "info", "你选择了不刷 userdata,不再继续");
      return;
    }
    this.log(ctx, "info", "擦除 boot");
    const ebootSrc = paths.edlEboot;
    const tmpBoot = path.join(paths.cache, "boot.img");
    if (fs.existsSync(ebootSrc)) {
      fs.copyFileSync(ebootSrc, tmpBoot);
    } else {
      this.log(ctx, "warn", `eboot.img 不存在: ${ebootSrc}(将尝试继续)`);
    }
    const bootXml = path.join(workDir, "boot.xml");
    await EdlService.flashPartitions({
      port: ctx.edlPort,
      loader: "msm8937.mbn",
      xmlPath: bootXml,
      imagesDir: paths.cache
    });
    this.log(ctx, "info", "等待重启手表并进入 fastboot");
    await EdlService.reboot({ port: ctx.edlPort, loader: "msm8937.mbn" });
    this.log(ctx, "info", "等待开机并进入 fastboot");
    this.log(ctx, "warn", "设备即将进入 Fastboot 模式，如长时间无响应请检查驱动");
    this.log(ctx, "warn", "如果一直卡在这里,可能需要安装驱动");
  }
  /** SDK27 等待 fastboot 设备(对应 root-SDK27.bat:77 device_check.exe fastboot) */
  async sdk27RebootingToFastboot(ctx) {
    this.log(ctx, "info", "等待 fastboot 设备...");
    const device = await DeviceService.instance.waitFor(["fastboot"], 12e4);
    ctx.device = device;
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备即将进入 Fastboot 模式，如长时间无响应请检查驱动");
  }
  /** SDK27 fastboot 刷入 boot(对应 root-SDK27.bat:82-83) */
  async sdk27FastbootFlashBoot(ctx) {
    this.log(ctx, "info", "刷入 boot");
    const newBoot = path.join(paths.edlWork, "new-boot.img");
    if (!fs.existsSync(newBoot)) {
      const sboot = path.join(paths.edlWork, "sboot.img");
      if (fs.existsSync(sboot)) {
        this.log(ctx, "warn", `new-boot.img 不存在,使用 sboot.img`);
        await FastbootService.flash("boot", sboot);
        return;
      }
      throw new Error(`new-boot.img 不存在: ${newBoot}`);
    }
    await FastbootService.flash("boot", newBoot);
  }
  /** SDK27 fastboot 刷入 userdata(对应 root-SDK27.bat:84-85) */
  async sdk27FastbootFlashUserdata(ctx) {
    this.log(ctx, "info", "刷入 userdata");
    const userdataImg = path.join(paths.cache, "userdata.img");
    if (!fs.existsSync(userdataImg)) {
      throw new Error(`userdata.img 不存在: ${userdataImg},请先在"资源下载"页下载`);
    }
    await FastbootService.flash("userdata", userdataImg);
  }
  /** SDK27 fastboot 刷入 misc + 重启 + 等 ADB + boot_completed(对应 root-SDK27.bat:86-101) */
  async sdk27FastbootFlashMisc(ctx) {
    this.log(ctx, "info", "刷入 misc(ffbm-02)");
    const miscBin = this.writeMiscBin(ctx);
    await FastbootService.flash("misc", miscBin);
    this.log(ctx, "info", "fastboot reboot");
    await FastbootService.reboot("system");
    this.log(ctx, "info", "请耐心等待设备响应");
    await this.waitForAdbCheckXse(ctx, 18e4);
    this.log(ctx, "warn", "在工具给出进一步提示前，请勿在手表上进行任何操作");
    this.log(ctx, "warn", "请 不要 点击重启-重启并进入正常启动模式");
    this.log(ctx, "info", "稍等片刻,即将进入 qmmi");
    await AdbService.waitForBoot(18e4);
    this.log(ctx, "info", "已进入 qmmi");
    this.log(ctx, "warn", "在工具给出进一步提示前，请勿在手表上进行任何操作");
    this.log(ctx, "warn", "请 不要 点击重启-重启并进入正常启动模式");
  }
  /**
   * SDK27 ROOT-SDK27-WAIT:等待开机(smodel=1 专用)
   * 对应 root-SDK27.bat:104-113
   *   if "%smodel%"=="1" (
   *     device_check.exe adb qcom_edl
   *     call boot_completed.bat
   *     busybox sleep 15
   *   )
   * 非 smodel=1:已在 fastboot-flash-misc 中 boot_completed,此处仅做轻量校验
   */
  async sdk27WaitingBoot(ctx) {
    if (ctx.smodel) {
      this.log(ctx, "info", "请耐心等待设备响应");
      await this.waitForAdbOrEdl(ctx, 18e4);
      this.log(ctx, "info", "稍等片刻,即将开始");
      await AdbService.waitForBoot(18e4);
      this.log(ctx, "info", "busybox sleep 15");
      await new Promise((r) => setTimeout(r, 15e3));
    } else {
      if (!ctx.device || ctx.device.type !== "adb") {
        await this.waitForAdbOrEdl(ctx, 6e4);
      }
    }
  }
  /**
   * SDK27 安装预装 APK(smodel=1 专用:54850.apk important)
   * 对应 root-SDK27.bat:112 call instapp .\apks\54850.apk important
   * 非 smodel=1:无操作(原 .bat 在此 stage 不执行任何 APK 安装)
   */
  async sdk27InstallPreinstall(ctx) {
    if (!ctx.smodel) {
      return;
    }
    const apk = path.join(paths.resources, "apks", "54850.apk");
    await this.instappImportant(ctx, apk);
  }
  /**
   * SDK27 启用充电可用 + 模拟未充电 + wifi/density 调整
   * 对应 root-SDK27.bat:115-128
   *   adb shell pm path com.android.systemui (检查 SystemUI)
   *   adb shell setprop persist.sys.charge.usable true
   *   adb shell dumpsys battery unplug
   *   adb shell svc wifi disable
   *   adb shell wm density 200
   */
  async sdk27EnableCharge(ctx) {
    let hasSystemUI = false;
    try {
      const out = await AdbService.shell("pm path com.android.systemui", { timeout: TIMEOUT.device });
      hasSystemUI = out.trim().length > 0;
    } catch {
    }
    if (hasSystemUI) {
      this.log(ctx, "info", "系统已存在 SystemUI");
    } else {
      this.log(ctx, "info", "系统不存在 SystemUI,将为你安装 SystemUI 模块");
    }
    this.log(ctx, "warn", "请一定要根据工具的提示来,root 未完成前禁止联网,禁止重复绑定!");
    await AdbService.shell("setprop persist.sys.charge.usable true", { timeout: TIMEOUT.device });
    this.log(ctx, "info", "充电可用已开启");
    await AdbService.shell("dumpsys battery unplug", { timeout: TIMEOUT.device });
    this.log(ctx, "info", "已模拟未充电状态");
    await AdbService.shell("svc wifi disable", { timeout: TIMEOUT.device });
    await AdbService.shell("wm density 200", { timeout: TIMEOUT.device });
  }
  /**
   * SDK27 自动授权 Magisk + 打开 EdXposed Installer
   * 对应 root-SDK27.bat:129-134(call automagisk.bat + am start EdXposed + sleep 7)
   */
  async sdk27AutoGrantMagisk(ctx) {
    await this.autoMagiskSdk27(ctx);
    this.log(ctx, "info", "正在自动打开 EdXposed Installer,请稍后");
    await this.waitForAdbOrEdl(ctx, 6e4);
    await AdbService.amStart(
      "com.solohsu.android.edxp.manager/de.robv.android.xposed.installer.WelcomeActivity"
    );
    await new Promise((r) => setTimeout(r, 7e3));
  }
  /** SDK27 自动激活 SystemPlus(对应 root-SDK27.bat:135 call autosystemplus.bat) */
  async sdk27ActivateSystemplus(ctx) {
    await this.autoSystemPlus(ctx);
  }
  /**
   * SDK27 安装 XTC Patch 模块
   * 对应 root-SDK27.bat:137-144
   *   call logo(占位)
   *   把时间交给我们 -
   *   ECHO.%INFO%开始安装XTC Patch模块
   *   adb shell setprop persist.sys.rooting true
   *   call instmodule.bat tmp\xtcpatch.zip magisk
   *   adb shell setprop persist.sys.rooting false
   *   ECHO.%INFO%安装XTC Patch模块成功
   */
  async sdk27InstallXtcpatch(ctx) {
    this.log(ctx, "info", "------------------------------------");
    this.log(ctx, "info", "后续步骤将由工具自动完成");
    this.log(ctx, "info", "开始安装 XTC Patch 模块");
    await AdbService.shell("setprop persist.sys.rooting true", { timeout: TIMEOUT.device });
    const xtcpatchZip = path.join(paths.cache, "xtcpatch.zip");
    if (!fs.existsSync(xtcpatchZip)) {
      this.log(ctx, "warn", `xtcpatch.zip 不存在: ${xtcpatchZip}`);
    } else {
      const r = await MagiskService.install(xtcpatchZip, "magisk");
      if (!r.success) {
        this.log(ctx, "warn", `xtcpatch 安装失败: ${r.error}`);
      }
    }
    await AdbService.shell("setprop persist.sys.rooting false", { timeout: TIMEOUT.device });
    this.log(ctx, "info", "安装 XTC Patch 模块成功");
  }
  /**
   * SDK27 安装 SystemUI 模块(isv3 且 ≠I20 才安装)
   * 对应 root-SDK27.bat:145-151
   *   if "%isv3%"=="1" if not "%innermodel%"=="I20" (
   *     call instmodule.bat tmp\systemui.zip magisk
   *   )
   */
  async sdk27InstallSystemui(ctx) {
    if (!(ctx.isV3 && ctx.innermodel !== "I20")) {
      this.log(ctx, "info", `跳过 SystemUI 模块安装(isv3=${ctx.isV3 ? 1 : 0}, innermodel=${ctx.innermodel})`);
      return;
    }
    this.log(ctx, "info", "开始安装 systemui 模块");
    const systemuiZip = path.join(paths.cache, "systemui.zip");
    if (!fs.existsSync(systemuiZip)) {
      this.log(ctx, "warn", `systemui.zip 不存在: ${systemuiZip}`);
      return;
    }
    const r = await MagiskService.install(systemuiZip, "magisk");
    if (!r.success) {
      this.log(ctx, "warn", `systemui 安装失败: ${r.error}`);
    } else {
      this.log(ctx, "info", "安装 systemui 模块成功");
    }
  }
  /**
   * SDK27 wm density reset + pm clear packageinstaller
   * 对应 root-SDK27.bat:154-155
   */
  async sdk27InstallPreinstallApk(ctx) {
    this.log(ctx, "info", "wm density reset + pm clear packageinstaller");
    await AdbService.shell("wm density reset", { timeout: TIMEOUT.device });
    await AdbService.shell("pm clear com.android.packageinstaller", { timeout: TIMEOUT.shell });
  }
  /**
   * SDK27 重启 + 等 ADB + boot_completed + (smodel=1: 激活模块)
   * 对应 root-SDK27.bat:158-179
   *   adb reboot
   *   device_check.exe adb qcom_edl fastboot + 检查 devicestatus=adb (Xse 检查)
   *   call boot_completed.bat
   *   if "%smodel%"=="1" (
   *     busybox sleep 5
   *     su -c sh /data/adb/modules/XTCPatch/active_module.sh com.huanli233.systemplus
   *     su -c sh /data/adb/modules/XTCPatch/active_module.sh com.zcg.xtcpatch
   *     adb reboot
   *     device_check.exe adb qcom_edl
   *     call boot_completed.bat
   *     busybox sleep 5
   *   )
   * 然后接 :ROOT-SDK27-WAIT 后面的"安装系统应用"段(原 .bat:182-197):
   *   busybox sleep 5
   *   if isv3 && !=I20: instapp 130510.apk important
   *   if isv3 && ==I20: instapp 121750.apk important
   *   if !isv3: instapp 116100.apk important
   * 注:此 stage 已含"安装系统应用"段,后续 stage sdk27-erase-misc-reboot 处理擦 misc
   */
  async sdk27EraseMiscReboot(ctx) {
    this.log(ctx, "info", "重启手表");
    await AdbService.reboot("system");
    this.log(ctx, "info", "请耐心等待设备开机");
    const device = await DeviceService.instance.waitFor(
      ["adb", "qcom_edl", "fastboot"],
      18e4
    );
    if (device.type === "fastboot") {
      this.log(ctx, "error", "您的设备可能触发了Xse限制!请重新进行root");
      throw new Error("您的设备可能触发了Xse限制!请重新进行root");
    }
    ctx.device = device;
    await AdbService.waitForBoot(18e4);
    if (ctx.smodel) {
      await new Promise((r) => setTimeout(r, 5e3));
      this.log(ctx, "info", "激活 SystemPlus 模块");
      await AdbService.shell(
        "sh /data/adb/modules/XTCPatch/active_module.sh com.huanli233.systemplus",
        { timeout: TIMEOUT.fileOp, root: true }
      );
      this.log(ctx, "info", "激活 XTCPatch 模块");
      await AdbService.shell(
        "sh /data/adb/modules/XTCPatch/active_module.sh com.zcg.xtcpatch",
        { timeout: TIMEOUT.fileOp, root: true }
      );
      this.log(ctx, "info", "重启手表");
      await AdbService.reboot("system");
      await this.waitForAdbOrEdl(ctx, 18e4);
      await AdbService.waitForBoot(18e4);
      await new Promise((r) => setTimeout(r, 5e3));
    }
    await new Promise((r) => setTimeout(r, 5e3));
    this.log(ctx, "info", "开始安装系统应用[请勿跳过]");
    const apksDir = path.join(paths.resources, "apks");
    if (ctx.isV3) {
      if (ctx.innermodel === "I20") {
        await this.instappImportant(ctx, path.join(apksDir, "121750.apk"));
      } else {
        await this.instappImportant(ctx, path.join(apksDir, "130510.apk"));
      }
    } else {
      await this.instappImportant(ctx, path.join(apksDir, "116100.apk"));
    }
    this.log(ctx, "info", "系统应用安装完成");
    if (ctx.smodel) {
      this.log(ctx, "info", "重启手表");
      await AdbService.reboot("system");
    } else {
      this.log(ctx, "info", "擦除 misc 并重启");
      await AdbService.reboot("bootloader");
      this.log(ctx, "info", "等待 fastboot 设备...");
      const device2 = await DeviceService.instance.waitFor(["adb", "fastboot"], 6e4);
      if (device2.type === "adb") {
        ctx.device = device2;
        this.log(ctx, "warn", "设备仍为 ADB 模式,再次尝试重启到 bootloader");
        await AdbService.reboot("bootloader");
        await DeviceService.instance.waitFor(["fastboot"], 6e4);
      }
      await FastbootService.erase("misc");
      await FastbootService.reboot("system");
    }
  }
  /**
   * SDK27 安装预装应用 + 等 ADB + boot_completed
   * 对应 root-SDK27.bat:213-230
   *   device_check.exe adb
   *   call boot_completed.bat
   *   ECHO.%INFO%开始安装预装应用
   *   call instapp.bat .\apks\selftest.apk important
   *   call instapp.bat .\apks\settings.apk important
   *   if exist .\apks\wxzf.apk call instapp.bat .\apks\wxzf.apk
   *   if exist .\apks\MoyeInstaller.apk call instapp.bat .\apks\MoyeInstaller.apk
   *   if exist .\apks\appsettings.apk call instapp.bat .\apks\appsettings.apk
   *   if exist .\apks\personalcenter.apk call instapp.bat .\apks\personalcenter.apk
   *   if exist .\apks\appmanager.apk call instapp.bat .\apks\appmanager.apk
   *   if exist .\apks\wcp2.apk call instapp.bat .\apks\wcp2.apk
   *   call instapp.bat .\apks\appstore.apk
   *   if exist .\apks\appstore2.apk call instapp.bat .\apks\appstore2.apk
   *   if exist .\apks\appstore3.apk call instapp.bat .\apks\appstore3.apk
   *   if exist .\apks\appstore4.apk call instapp.bat .\apks\appstore4.apk
   *   if exist .\apks\weichat.apk call instapp.bat .\apks\weichat.apk
   */
  async sdk27InstallBundledApks(ctx) {
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb"], 12e4);
    ctx.device = device;
    await AdbService.waitForBoot(12e4);
    this.log(ctx, "info", "开始安装预装应用");
    const apksDir = path.join(paths.resources, "apks");
    await this.instappImportant(ctx, path.join(apksDir, "selftest.apk"));
    await this.instappImportant(ctx, path.join(apksDir, "settings.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "wxzf.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "MoyeInstaller.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appsettings.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "personalcenter.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appmanager.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "wcp2.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore2.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore3.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore4.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "weichat.apk"));
    this.log(ctx, "info", "预装应用安装完成");
  }
  /**
   * SDK27 提前编译 i3launcher + setting
   * 对应 root-SDK27.bat:231-233
   */
  async sdk27CompilePackages(ctx) {
    this.log(ctx, "info", "正在执行提前编译,可能需要一些时间");
    await AdbService.cmdPackageCompile("com.xtc.i3launcher");
    await AdbService.cmdPackageCompile("com.xtc.setting");
  }
  /** SDK27 恢复 DCIM(对应 root-SDK27.bat:235-236) */
  async sdk27RestoreDcim(ctx) {
    if (!ctx.dcimBackupDir) {
      this.log(ctx, "warn", "无 DCIM 备份目录,跳过恢复");
      return;
    }
    this.log(ctx, "info", "正在恢复相册...");
    const r = await BackupService.recoverDcim(
      ctx.dcimBackupDir,
      (msg) => this.log(ctx, "info", msg)
    );
    if (!r.success) {
      this.log(ctx, "warn", `相册恢复失败: ${r.error}`);
    }
    this.log(ctx, "warn", "切勿卸载 SystemPlus 和 XTCPatch，否则设备将无法启动");
    this.log(ctx, "warn", "切勿卸载 SystemPlus 和 XTCPatch，否则设备将无法启动");
    this.log(ctx, "warn", "切勿删除 Magisk 内置模块，否则设备将无法启动");
    this.log(ctx, "warn", "切勿删除 Magisk 内置模块，否则设备将无法启动");
    this.log(ctx, "info", "历经千帆，终达彼岸");
    this.log(ctx, "info", "提示:当手表进入长续航模式、睡眠模式等禁用模式时,划到最后一页,点击打开应用列表,即可绕过禁用模式");
    this.log(ctx, "info", "提示:你可以在 /sdcard/hidden_app_list.txt 中填写包名以实现隐藏应用");
    this.log(ctx, "info", "提示:如果需要在手表上安装应用,请在手表端选择弦-安装器,点击始终");
    this.log(ctx, "info", "您的手表已 ROOT 完毕");
    this.log(ctx, "info", "是否进行预装优化[包括模块和应用,期间需要多次选择]?");
    this.log(ctx, "info", "(可选,需用户在 Tools 页手动触发 rootpro)");
  }
  // ---------- ND03 stages(Z10,prog_firehose_ddr.elf + 281 恢复固件 + LSPosed) ----------
  /**
   * ND03 清理临时文件 + 下载 ND03.zip(对应 nd03root.bat:7-29)
   *   del tmp.txt + *.img + tmp\boot.img + header + kernel_dtb + kernel + ramdisk.cpio + port_trace.txt
   *   del EDL\rooting\*.*
   *   rd EDL\rooting\xtcpatch + magiskfile
   *   md EDL\rooting
   *   if not exist EDL\ND03.zip call cloud z10
   */
  async nd03DownloadZip(ctx) {
    this.log(ctx, "info", "免责声明:");
    this.log(ctx, "info", "Root 会自动超级恢复到 2.8.1 版本");
    this.log(ctx, "info", "Root 后版本为 3.0.2,底包 2.8.1");
    this.log(ctx, "info", "Root 文件为网络搜集而来");
    this.log(ctx, "info", "正在为你准备开始");
    const workDir = paths.edlWork;
    try {
      if (fs.existsSync(workDir)) {
        for (const f of fs.readdirSync(workDir)) {
          try {
            fs.rmSync(path.join(workDir, f), { recursive: true, force: true });
          } catch {
          }
        }
      } else {
        fs.mkdirSync(workDir, { recursive: true });
      }
    } catch {
    }
    for (const f of ["boot.img", "header", "kernel_dtb", "kernel", "ramdisk.cpio", "port_trace.txt"]) {
      try {
        const p = path.join(paths.cache, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {
      }
    }
    this.log(ctx, "info", "开始准备文件");
    const nd03Zip = paths.edlFile("ND03.zip");
    if (!fs.existsSync(nd03Zip)) {
      this.log(ctx, "info", "下载 Z10 资源(ND03.zip)...");
      try {
        await CloudService.download("Z10");
      } catch (e) {
        throw new Error(`下载 ND03.zip 失败: ${e.message}`);
      }
      if (!fs.existsSync(nd03Zip)) {
        throw new Error(`ND03.zip 下载后仍未存在: ${nd03Zip}`);
      }
    }
  }
  /** ND03 解压 ND03.zip → EDL/rooting(对应 nd03root.bat:30-31) */
  async nd03Extract(ctx) {
    this.log(ctx, "info", "正在解压文件...");
    const nd03Zip = paths.edlFile("ND03.zip");
    if (!fs.existsSync(nd03Zip)) {
      throw new Error(`ND03.zip 不存在: ${nd03Zip}`);
    }
    const workDir = paths.edlWork;
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    await SubprocessPool.spawn({
      cmd: paths.binFile("7z.exe"),
      args: ["x", nd03Zip, `-o${workDir}`, "-aoa", "-bsp1"],
      cwd: paths.bin,
      encoding: "utf-8",
      timeout: TIMEOUT.install,
      taskId: ctx.taskId,
      onStdout: (line) => this.log(ctx, "info", `7z: ${line}`)
    });
    this.log(ctx, "info", "准备完成,即将开始 root");
  }
  /**
   * ND03 进入 EDL(对应 nd03root.bat:32-41)
   *   echo.%info%等待9008设备连接...
   *   device_check.exe qcom_edl
   *   call edlport
   *   call QSaharaServer.bat -p \\.\COM%port% -s 13:%cd%\EDL\prog_firehose_ddr.elf
   *   busybox sleep 2
   */
  async nd03EnteringEdl(ctx) {
    this.log(ctx, "info", "等待 9008 设备连接...");
    const port = await EdlService.waitForEdl(12e4);
    ctx.edlPort = port;
    this.log(ctx, "info", `获取 9008 端口: ${port}`);
    this.log(ctx, "info", "发送引导: prog_firehose_ddr.elf");
    await EdlService.loadFirehose({ port, loader: "prog_firehose_ddr.elf" });
    await new Promise((r) => setTimeout(r, 2e3));
  }
  /**
   * ND03 刷入 281 恢复固件(对应 nd03root.bat:43-50)
   *   progress.exe P_fh_loader.bat ... --search_path=EDL\rooting\281\ --sendxml=EDL\rooting\281\rawprogram0.xml
   *   if exist fh_error.txt ( ... 恢复失败!刷入失败! )
   *   call fh_loader.bat ... --sendxml=EDL\rooting\281\patch0.xml
   */
  async nd03Flash281Recovery(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const workDir = paths.edlWork;
    this.log(ctx, "info", "刷入恢复固件(281/rawprogram0.xml)");
    const raw281 = path.join(workDir, "281", "rawprogram0.xml");
    if (!fs.existsSync(raw281)) {
      throw new Error(`281/rawprogram0.xml 不存在: ${raw281}`);
    }
    await EdlService.flashPartitions({
      port: ctx.edlPort,
      loader: "prog_firehose_ddr.elf",
      xmlPath: raw281,
      imagesDir: path.join(workDir, "281")
    });
    this.log(ctx, "info", "刷入 281/patch0.xml");
    const patch281 = path.join(workDir, "281", "patch0.xml");
    if (fs.existsSync(patch281)) {
      await EdlService.flashPartitions({
        port: ctx.edlPort,
        loader: "prog_firehose_ddr.elf",
        xmlPath: patch281,
        imagesDir: path.join(workDir, "281")
      });
    } else {
      this.log(ctx, "warn", `281/patch0.xml 不存在(跳过): ${patch281}`);
    }
  }
  /**
   * ND03 刷入 root 固件 + 复制 eboot.img(对应 nd03root.bat:52-57)
   *   progress.exe P_fh_loader.bat ... --sendxml=EDL\rooting\rawprogram0.xml
   *   copy /Y tmp\eboot.img EDL\rooting\eboot.img
   *   if exist fh_error.txt ( ... root失败!刷入失败! )
   */
  async nd03FlashRootFirmware(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    const workDir = paths.edlWork;
    this.log(ctx, "info", "刷入 root 固件");
    const rawprogramXml = path.join(workDir, "rawprogram0.xml");
    if (!fs.existsSync(rawprogramXml)) {
      throw new Error(`rawprogram0.xml 不存在: ${rawprogramXml}`);
    }
    await EdlService.flashPartitions({
      port: ctx.edlPort,
      loader: "prog_firehose_ddr.elf",
      xmlPath: rawprogramXml,
      imagesDir: workDir
    });
    const ebootSrc = paths.edlEboot;
    const ebootDst = path.join(workDir, "eboot.img");
    if (fs.existsSync(ebootSrc)) {
      fs.copyFileSync(ebootSrc, ebootDst);
      this.log(ctx, "info", `已复制 eboot.img → ${ebootDst}`);
    } else {
      this.log(ctx, "warn", `eboot.img 源文件不存在: ${ebootSrc}`);
    }
  }
  /**
   * ND03 擦除 boot(对应 nd03root.bat:58-60)
   *   ECHO.%INFO%清除boot
   *   call fh_loader.bat ... --search_path=EDL\rooting --sendxml=EDL\rooting\eboot.xml
   */
  async nd03EraseBoot(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    this.log(ctx, "info", "清除 boot");
    const workDir = paths.edlWork;
    const ebootXml = path.join(workDir, "eboot.xml");
    if (!fs.existsSync(ebootXml)) {
      throw new Error(`eboot.xml 不存在: ${ebootXml}`);
    }
    await EdlService.flashPartitions({
      port: ctx.edlPort,
      loader: "prog_firehose_ddr.elf",
      xmlPath: ebootXml,
      imagesDir: workDir
    });
  }
  /**
   * ND03 重启 + 等 fastboot(对应 nd03root.bat:61-67)
   *   call qfh_loader.bat ... --sendxml=reboot.xml
   *   设备处于正常刷写状态，请勿断开数据线(x3)
   *   不是进入fastboot就是变砖!
   *   device_check.exe fastboot
   */
  async nd03RebootToFastboot(ctx) {
    if (!ctx.edlPort) throw new Error("未获取 9008 端口");
    this.log(ctx, "info", "重启手表");
    await EdlService.reboot({ port: ctx.edlPort, loader: "prog_firehose_ddr.elf" });
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备即将进入 Fastboot 模式，如长时间无响应请检查驱动");
    this.log(ctx, "info", "等待 fastboot 连接...");
    const device = await DeviceService.instance.waitFor(["fastboot"], 12e4);
    ctx.device = device;
  }
  /**
   * ND03 fastboot 刷入 boot(对应 nd03root.bat:68-69)
   *   run_cmd "fastboot flash boot EDL\rooting\boot.img"
   */
  async nd03FastbootFlashBoot(ctx) {
    this.log(ctx, "info", "刷入 boot");
    const bootImg = path.join(paths.edlWork, "boot.img");
    if (!fs.existsSync(bootImg)) {
      throw new Error(`boot.img 不存在: ${bootImg}`);
    }
    await FastbootService.flash("boot", bootImg);
  }
  /**
   * ND03 fastboot boot recovery(临时启动 recovery)(对应 nd03root.bat:70-72)
   *   run_cmd "fastboot boot EDL\rooting\recovery.img"
   *   ECHO.%INFO%坐和放宽，让我们等待您的手表一段时间
   *   ECHO.%INFO%进入sideload
   *   call adbdevice.bat sideload
   */
  async nd03BootRecovery(ctx) {
    this.log(ctx, "info", "重启并进入 recovery");
    const recoveryImg = path.join(paths.edlWork, "recovery.img");
    if (!fs.existsSync(recoveryImg)) {
      throw new Error(`recovery.img 不存在: ${recoveryImg}`);
    }
    await FastbootService.boot(recoveryImg);
    this.log(ctx, "info", "请耐心等待设备响应");
    this.log(ctx, "info", "进入 sideload");
    const start = Date.now();
    while (Date.now() - start < 12e4) {
      try {
        const result = await SubprocessPool.spawn({
          cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
          args: ["get-state"],
          encoding: "utf-8",
          timeout: TIMEOUT.device,
          cwd: paths.bin,
          silent: true
        });
        if (result.stdout.trim() === "sideload") {
          this.log(ctx, "info", "设备已进入 sideload 模式");
          return;
        }
      } catch {
      }
      await new Promise((r) => setTimeout(r, 2e3));
    }
    throw new Error("等待 sideload 模式超时");
  }
  /**
   * ND03 sideload Dm.zip + adbdevice noadb(对应 nd03root.bat:73-76)
   *   ECHO.%INFO%正在刷dm，请等待20秒...
   *   busybox timeout 20 cmd /c adb sideload .\EDL\rooting\Dm.zip
   *   ECHO.
   *   call adbdevice.bat noadb
   */
  async nd03SideloadDm(ctx) {
    this.log(ctx, "info", "正在刷 dm,请等待 20 秒...");
    const dmZip = path.join(paths.edlWork, "Dm.zip");
    if (!fs.existsSync(dmZip)) {
      throw new Error(`Dm.zip 不存在: ${dmZip}`);
    }
    try {
      await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["sideload", dmZip],
        encoding: "utf-8",
        timeout: TIMEOUT.transfer,
        cwd: paths.bin,
        taskId: ctx.taskId,
        onStdout: (line) => this.log(ctx, "info", `sideload: ${line}`)
      });
    } catch (e) {
      this.log(ctx, "info", `sideload 已超时(预期行为,设备端继续): ${e.message}`);
    }
    try {
      await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["kill-server"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
      await SubprocessPool.spawn({
        cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
        args: ["start-server"],
        encoding: "utf-8",
        timeout: TIMEOUT.device,
        cwd: paths.bin,
        silent: true
      });
    } catch {
    }
  }
  /**
   * ND03 等 fastboot + 刷 misc + fastboot reboot(对应 nd03root.bat:77-83)
   *   设备处于正常刷写状态，请勿断开数据线(x3)
   *   不是进入fastboot就是变砖!
   *   device_check.exe fastboot
   *   echo ffbm-02 > misc.bin
   *   fastboot flash misc misc.bin
   *   fastboot reboot
   */
  async nd03FlashMiscReboot(ctx) {
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备处于正常刷写状态，请勿断开数据线");
    this.log(ctx, "warn", "设备即将进入 Fastboot 模式，如长时间无响应请检查驱动");
    this.log(ctx, "info", "等待 fastboot 连接...");
    const device = await DeviceService.instance.waitFor(["fastboot"], 12e4);
    ctx.device = device;
    this.log(ctx, "info", "刷入 misc 并重启");
    const miscBin = this.writeMiscBin(ctx);
    await FastbootService.flash("misc", miscBin);
    await FastbootService.reboot("system");
    this.log(ctx, "info", "让我们等待重启三次修复环境");
  }
  /**
   * ND03 循环检测 bin.mt.plus + 等开机 + wm density + am start magisk
   * 对应 nd03root.bat:84-95
   *   :test3
   *   adb shell pm path bin.mt.plus
   *   if not %errorlevel%==0 ( goto test3 )
   *   busybox sleep 5
   *   call boot_completed.bat
   *   busybox sleep 5
   *   wm density 288
   *   settings put system screen_off_timeout 2147483647
   *   busybox sleep 5
   *   am start -n com.xtc.b/com.topjohnwu.magisk.ui.MainActivity
   *   busybox sleep 2
   *   am start (再次)
   *   device_check.exe adb
   *   busybox sleep 5
   */
  async nd03Wait3Reboots(ctx) {
    this.log(ctx, "info", "等待 bin.mt.plus 安装完成(循环检测)");
    const start = Date.now();
    let installed = false;
    while (Date.now() - start < 6e5) {
      try {
        const out = await AdbService.shell("pm path bin.mt.plus", { timeout: TIMEOUT.device });
        if (out.trim().length > 0) {
          installed = true;
          break;
        }
      } catch {
      }
      await new Promise((r) => setTimeout(r, 3e3));
    }
    if (!installed) {
      throw new Error("等待 bin.mt.plus 安装超时(10 分钟)");
    }
    await new Promise((r) => setTimeout(r, 5e3));
    this.log(ctx, "info", "等待开机完成...");
    await AdbService.waitForBoot(18e4);
    await new Promise((r) => setTimeout(r, 5e3));
    await AdbService.shell("wm density 288", { timeout: TIMEOUT.device });
    await AdbService.shell("settings put system screen_off_timeout 2147483647", {
      timeout: TIMEOUT.device
    });
    this.log(ctx, "info", "正在自动打开自动响应,请稍后");
    await new Promise((r) => setTimeout(r, 5e3));
    await AdbService.amStart("com.xtc.b/com.topjohnwu.magisk.ui.MainActivity");
    await new Promise((r) => setTimeout(r, 2e3));
    await AdbService.amStart("com.xtc.b/com.topjohnwu.magisk.ui.MainActivity");
    const device = await DeviceService.instance.waitFor(["adb"], 6e4);
    ctx.device = device;
    await new Promise((r) => setTimeout(r, 5e3));
  }
  /** ND03 自动授权 Magisk(11 步点击,坐标与 SDK27 不同) */
  async nd03AutoGrantMagisk(ctx) {
    await this.autoMagiskNd03(ctx);
  }
  /**
   * ND03 安装 XTC Patch 模块 + pm clear packageinstaller
   * 对应 nd03root.bat:automagisk 标签后
   *   device_check.exe adb
   *   ECHO.%INFO%开始安装XTC Patch模块
   *   adb push tmp\xtcpatch.zip /sdcard/xtcpatch.zip
   *   adb shell "su -c magisk --install-module /sdcard/xtcpatch.zip"
   *   adb shell "rm -rf /sdcard/xtcpatch.zip"
   *   ECHO.%INFO%安装XTC Patch模块成功
   *   run_cmd "adb shell pm clear com.android.packageinstaller"
   */
  async nd03InstallXtcpatch(ctx) {
    const device = await DeviceService.instance.waitFor(["adb"], 6e4);
    ctx.device = device;
    this.log(ctx, "info", "------------------------------------");
    this.log(ctx, "info", "后续步骤将由工具自动完成");
    this.log(ctx, "info", "开始安装 XTC Patch 模块");
    const xtcpatchZip = path.join(paths.cache, "xtcpatch.zip");
    if (!fs.existsSync(xtcpatchZip)) {
      throw new Error(`xtcpatch.zip 不存在: ${xtcpatchZip}`);
    }
    await AdbService.push(xtcpatchZip, "/sdcard/xtcpatch.zip");
    await AdbService.shell("magisk --install-module /sdcard/xtcpatch.zip", {
      timeout: TIMEOUT.flash,
      root: true
    });
    await AdbService.shell("rm -rf /sdcard/xtcpatch.zip", { timeout: TIMEOUT.device });
    this.log(ctx, "info", "安装 XTC Patch 模块成功");
    await AdbService.shell("pm clear com.android.packageinstaller", { timeout: TIMEOUT.shell });
  }
  /**
   * ND03 安装 toolkit + SystemPlus + 启动 LSPosed
   * 对应 nd03root.bat:automagisk 标签后
   *   ECHO.%INFO%开始安装核心破解和systemplus
   *   call instapp.bat .\apks\toolkit_4.8.apk important
   *   call instapp.bat .\apks\Z10_SystemPlus.apk important
   *   run_cmd "adb shell ""su -c am start -n org.lsposed.manager/.ui.activity.MainActivity"""
   *   ECHO.%INFO%正在勾选作用域，请稍后
   *   busybox sleep 5
   */
  async nd03InstallToolkit(ctx) {
    this.log(ctx, "info", "开始安装核心破解和 systemplus");
    const apksDir = path.join(paths.resources, "apks");
    await this.instappImportant(ctx, path.join(apksDir, "toolkit_4.8.apk"));
    await this.instappImportant(ctx, path.join(apksDir, "Z10_SystemPlus.apk"));
    this.log(ctx, "info", "正在勾选作用域,请稍后");
    try {
      await AdbService.shell("am start -n org.lsposed.manager/.ui.activity.MainActivity", {
        timeout: TIMEOUT.device,
        root: true
      });
    } catch (e) {
      this.log(ctx, "warn", `启动 LSPosed 失败: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 5e3));
  }
  /** ND03 激活 LSPosed 作用域(7 步点击) */
  async nd03ActivateLsposed(ctx) {
    await this.activateLsposed(ctx);
  }
  /**
   * ND03 adb reboot + 等 ADB + boot_completed + 擦 misc + 重启 + 安装预装
   * 对应 nd03root.bat:activate-lsposed 之后到 :ROOT-noapp 之前
   *   run_cmd "adb reboot"
   *   device_check.exe adb
   *   call boot_completed.bat
   *   busybox sleep 5
   *   ECHO.%INFO%即将完成
   *   wm density reset
   *   settings put system screen_off_timeout 30
   *   ECHO.%INFO%擦除misc并重启
   *   adb reboot bootloader
   *   device_check.exe adb fastboot (检查 devicestatus=adb 时再 reboot bootloader)
   *   fastboot erase misc
   *   fastboot reboot
   *   device_check.exe adb
   *   call boot_completed.bat
   *   busybox sleep 5
   *   ECHO.%INFO%开始安装预装应用
   *   call instapp.bat .\apks\appsettings-ND03.apk
   *   call instapp.bat .\apks\appmanager.apk
   *   call instapp.bat .\apks\poke.apk
   *   call instapp.bat .\apks\appstore.apk
   *   if exist .\apks\appstore2.apk call instapp.bat .\apks\appstore2.apk
   *   if exist .\apks\appstore3.apk call instapp.bat .\apks\appstore3.apk
   *   if exist .\apks\appstore4.apk call instapp.bat .\apks\appstore4.apk
   *   ECHO.%INFO%预装应用安装完成
   */
  async nd03InstallPreinstall(ctx) {
    await AdbService.reboot("system");
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device = await DeviceService.instance.waitFor(["adb"], 18e4);
    ctx.device = device;
    await AdbService.waitForBoot(18e4);
    await new Promise((r) => setTimeout(r, 5e3));
    this.log(ctx, "info", "即将完成");
    await AdbService.shell("wm density reset", { timeout: TIMEOUT.device });
    await AdbService.shell("settings put system screen_off_timeout 30", { timeout: TIMEOUT.device });
    this.log(ctx, "info", "擦除 misc 并重启");
    await AdbService.reboot("bootloader");
    this.log(ctx, "info", "等待 fastboot 设备...");
    const device2 = await DeviceService.instance.waitFor(["adb", "fastboot"], 6e4);
    if (device2.type === "adb") {
      ctx.device = device2;
      this.log(ctx, "warn", "设备仍为 ADB 模式,再次尝试重启到 bootloader");
      await AdbService.reboot("bootloader");
      await DeviceService.instance.waitFor(["fastboot"], 6e4);
    }
    await FastbootService.erase("misc");
    await FastbootService.reboot("system");
    this.log(ctx, "info", "等待 ADB 设备连接...");
    const device3 = await DeviceService.instance.waitFor(["adb"], 18e4);
    ctx.device = device3;
    await AdbService.waitForBoot(18e4);
    await new Promise((r) => setTimeout(r, 5e3));
    this.log(ctx, "info", "开始安装预装应用");
    const apksDir = path.join(paths.resources, "apks");
    await this.instappOptional(ctx, path.join(apksDir, "appsettings-ND03.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appmanager.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "poke.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore2.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore3.apk"));
    await this.instappOptional(ctx, path.join(apksDir, "appstore4.apk"));
    this.log(ctx, "info", "预装应用安装完成");
  }
  /**
   * ND03 提前编译 i3launcher + setting
   * 对应 nd03root.bat::ROOT-noapp 标签后
   *   ECHO.%INFO%正在执行提前编译，可能需要一些时间
   *   run_cmd "adb shell cmd package compile -m everything-profile -f com.xtc.i3launcher"
   *   run_cmd "adb shell cmd package compile -m everything-profile -f com.xtc.setting"
   *   ECHO.%GRAY%-跨越山海 终见曙光-
   *   ECHO.%INFO%您的手表已ROOT完毕，耗时：
   */
  async nd03CompilePackages(ctx) {
    this.log(ctx, "info", "正在执行提前编译,可能需要一些时间");
    await AdbService.cmdPackageCompile("com.xtc.i3launcher");
    await AdbService.cmdPackageCompile("com.xtc.setting");
    this.log(ctx, "info", "历经千帆，终达彼岸");
    this.log(ctx, "info", "您的手表已 ROOT 完毕");
  }
}
const RootService = new RootServiceClass();
const logger$7 = Logger.instance;
function registerRootIpc() {
  electron.ipcMain.handle(
    "root:start",
    wrap(
      (options) => RootService.start(options).then((taskId) => ({ success: true, taskId })),
      { logPrefix: "root" }
    )
  );
  electron.ipcMain.handle(
    "root:cancel",
    wrap(
      ({ taskId }) => RootService.cancel(taskId).then(() => ({ success: true })),
      { logPrefix: "root" }
    )
  );
  electron.ipcMain.handle(
    "root:pause",
    wrap(
      ({ taskId }) => RootService.pause(taskId).then(() => ({ success: true })),
      { logPrefix: "root" }
    )
  );
  electron.ipcMain.handle(
    "root:resume",
    wrap(
      ({ taskId }) => RootService.resume(taskId).then(() => ({ success: true })),
      { logPrefix: "root" }
    )
  );
  electron.ipcMain.handle(
    "root:get-context",
    wrap(({ taskId }) => {
      const ctx = RootService.getContext(taskId);
      if (!ctx) {
        return { success: false, error: `任务不存在: ${taskId}` };
      }
      return { success: true, context: ctx };
    }, { logPrefix: "root" })
  );
  logger$7.info("ipc", "root:* 通道已注册");
}
const logger$6 = Logger.instance.child("FileService");
class FileServiceClass extends node_events.EventEmitter {
  /** 旧 Android 兼容模式(对应 T0biasCZe/AdbFileManager 的 compatibility fix) */
  compatMode = false;
  /** 推送/拉取时是否保留源文件修改时间(对应 T0biasCZe 的 Keep file modified date) */
  keepMtime = false;
  /** 常用快捷路径(参考 HandShaker/QtAdb 侧栏) */
  QUICK_PATHS = [
    { label: "内部存储", path: "/sdcard", icon: "home" },
    { label: "DCIM 相册", path: "/sdcard/DCIM", icon: "image" },
    { label: "下载", path: "/sdcard/Download", icon: "download" },
    { label: "图片", path: "/sdcard/Pictures", icon: "image" },
    { label: "音乐", path: "/sdcard/Music", icon: "music" },
    { label: "电影", path: "/sdcard/Movies", icon: "film" },
    { label: "文档", path: "/sdcard/Documents", icon: "file" },
    { label: "存储根", path: "/storage", icon: "drive" },
    { label: "根目录", path: "/", icon: "terminal" },
    { label: "data 分区", path: "/data", icon: "database" }
  ];
  /**
   * 列出目录内容
   * 使用 `adb shell ls -lA <path>`,解析长格式
   * 兼容模式:旧 Android 不支持 -A,回退到 `ls -l`
   */
  async list(remotePath, deviceSerial) {
    const safePath = this.quote(remotePath);
    const flag = this.compatMode ? "-l" : "-lA";
    const out = await this.shellDevice(`ls ${flag} ${safePath}`, { timeout: TIMEOUT.fileOp }, deviceSerial);
    let entries = this.parseLsOutput(out, remotePath);
    if (this.compatMode) {
      entries = entries.filter((e) => e.name !== "." && e.name !== "..");
    }
    return entries;
  }
  /**
   * 解析 ls -lA 输出
   * toybox 格式:
   *   drwxrwxr-x 2 root root 4096 2024-01-15 10:30 dirname
   *   -rw-rw-r-- 1 root root 1024 2024-01-15 10:30 file.txt
   * 旧 busybox 可能:
   *   drwxrwxr-x root root 4096 Jan 15 10:30 dirname
   * 软链接:
   *   lrwxrwxrwx 1 root root 7 2024-01-15 10:30 link -> /target
   */
  parseLsOutput(output, baseDir) {
    const entries = [];
    const lines = output.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^total\s+\d+/i.test(line)) continue;
      if (/permission denied|no such file|not a directory|opendir/i.test(line)) continue;
      let m = line.match(
        /^([dlbcsp-])([rwxst-]{9})\s+(\d+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.*)$/
      );
      let typeChar;
      let perms;
      let owner;
      let group;
      let size;
      let mtime;
      let nameRaw;
      if (m) {
        [, typeChar, perms, , owner, group, , mtime, , nameRaw] = m;
        mtime = `${mtime} ${m[8]}`;
        size = parseInt(m[6], 10) || 0;
      } else {
        m = line.match(
          /^([dlbcsp-])([rwxst-]{9})\s+(\S+)\s+(\S+)\s+(\d+)\s+(\w{3}\s+\d{1,2}\s+[\d:]{4,5})\s+(.*)$/
        );
        if (m) {
          [, typeChar, perms, owner, group, , mtime, nameRaw] = m;
          size = parseInt(m[5], 10) || 0;
        } else {
          logger$6.warn(`无法解析 ls 行: ${line}`);
          continue;
        }
      }
      const isLink = typeChar === "l";
      let linkTarget;
      let name = nameRaw;
      if (isLink) {
        const arrowIdx = nameRaw.indexOf(" -> ");
        if (arrowIdx >= 0) {
          name = nameRaw.slice(0, arrowIdx);
          linkTarget = nameRaw.slice(arrowIdx + 4);
        }
      }
      if (name === "." || name === "..") continue;
      const isDir = typeChar === "d";
      const fullPath = this.joinPath(baseDir, name);
      const ext = isDir || isLink ? "" : this.getExt(name);
      entries.push({
        name,
        path: fullPath,
        isDir,
        isLink,
        linkTarget,
        size: isDir ? 0 : size,
        perms,
        type: typeChar,
        owner,
        group,
        mtime,
        ext
      });
    }
    entries.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return entries;
  }
  /** 获取文件/目录 stat */
  async stat(remotePath, deviceSerial) {
    const safePath = this.quote(remotePath);
    try {
      const out = await this.shellDevice(`ls -ld ${safePath}`, { timeout: TIMEOUT.device }, deviceSerial);
      const entries = this.parseLsOutput(out, this.parentDir(remotePath));
      return entries.find((e) => e.path === remotePath) ?? entries[0] ?? null;
    } catch {
      return null;
    }
  }
  /** 判断路径是否存在 */
  async exists(remotePath) {
    const safePath = this.quote(remotePath);
    try {
      const out = await AdbService.shell(`[ -e ${safePath} ] && echo yes || echo no`, {
        timeout: TIMEOUT.device
      });
      return out.trim() === "yes";
    } catch {
      return false;
    }
  }
  /** 创建目录(支持递归) */
  async mkdir(remotePath, recursive = true) {
    const flag = recursive ? "-p" : "";
    await AdbService.shell(`mkdir ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT.shell });
  }
  /** 删除文件或目录(递归) */
  async remove(remotePath, recursive = true) {
    const flag = recursive ? "-rf" : "-f";
    await AdbService.shell(`rm ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT.flash });
  }
  /** 重命名/移动 */
  async rename(oldPath, newPath) {
    await AdbService.shell(
      `mv ${this.quote(oldPath)} ${this.quote(newPath)}`,
      { timeout: TIMEOUT.flash }
    );
  }
  /** 复制(支持递归) */
  async copy(srcPath, dstPath, recursive = true) {
    const flag = recursive ? "-r" : "";
    await AdbService.shell(
      `cp ${flag} ${this.quote(srcPath)} ${this.quote(dstPath)}`,
      { timeout: TIMEOUT.install }
    );
  }
  /** 推送本地文件到设备(带进度) */
  async push(local, remote, deviceSerial, onProgress) {
    logger$6.info("file", `push: ${local} -> ${remote}`);
    const remoteDir = this.parentDir(remote);
    if (remoteDir && remoteDir !== "/") {
      try {
        await this.mkdir(remoteDir, true);
      } catch {
      }
    }
    const args = this.deviceArgs(deviceSerial);
    args.push("push", local, remote);
    await this.spawnWithProgress(args, {
      local,
      remote,
      direction: "push",
      onProgress
    });
    if (this.keepMtime) {
      try {
        const localMtime = await this.getLocalMtime(local);
        if (localMtime) {
          await this.shellDevice(
            `touch -d '${localMtime}' ${this.quote(remote)}`,
            { timeout: TIMEOUT.device, root: false },
            deviceSerial
          );
        }
      } catch {
      }
    }
  }
  /** 从设备拉取文件到本地(带进度) */
  async pull(remote, local, deviceSerial, onProgress) {
    logger$6.info("file", `pull: ${remote} -> ${local}`);
    const args = this.deviceArgs(deviceSerial);
    args.push("pull", remote, local);
    await this.spawnWithProgress(args, {
      local,
      remote,
      direction: "pull",
      onProgress
    });
    if (this.keepMtime) ;
  }
  /** 安装设备上的 APK 文件(远程安装) */
  async installRemoteApk(remoteApk) {
    try {
      const out = await AdbService.shell(`pm install -r ${this.quote(remoteApk)}`, {
        timeout: TIMEOUT.install
      });
      const success = out.includes("Success");
      if (!success) {
        return { success: false, error: out.trim() || "安装失败" };
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  /** 获取磁盘信息(df) */
  async diskInfo(remotePath = "/sdcard") {
    try {
      const out = await AdbService.shell(`df -k ${this.quote(remotePath)}`, { timeout: TIMEOUT.shell });
      const lines = out.split("\n").filter((l) => l.trim());
      const dataLine = lines[lines.length - 1];
      if (!dataLine) return null;
      const parts = dataLine.split(/\s+/);
      const nums = [];
      for (const p of parts) {
        const n = parseInt(p, 10);
        if (!isNaN(n) && /^\d+$/.test(p)) nums.push(n);
      }
      if (nums.length < 4) return null;
      const total = nums[0] * 1024;
      const used = nums[1] * 1024;
      const available = nums[2] * 1024;
      const usagePercent = nums[3] > 100 ? Math.round(used / total * 100) : nums[3];
      return { path: remotePath, total, used, available, usagePercent };
    } catch {
      return null;
    }
  }
  /** 读取文本文件内容(限小文件,<1MB) */
  async readTextFile(remotePath, maxBytes = 1024 * 1024) {
    const safePath = this.quote(remotePath);
    const out = await AdbService.shell(`cat ${safePath}`, { timeout: TIMEOUT.shell });
    if (out.length > maxBytes) {
      return out.slice(0, maxBytes) + "\n... [文件过大,已截断]";
    }
    return out;
  }
  /** 创建空文件(对应 wkbin 的 Create file) */
  async createFile(remotePath, content = "") {
    const safePath = this.quote(remotePath);
    if (content) {
      const escaped = content.replace(/'/g, `'\\''`);
      await AdbService.shell(`printf '%s' '${escaped}' > ${safePath}`, { timeout: TIMEOUT.shell });
    } else {
      await AdbService.shell(`touch ${safePath}`, { timeout: TIMEOUT.device });
    }
  }
  /** 写入文本文件(覆盖,对应 wkbin 的 Edit) */
  async writeFile(remotePath, content) {
    const safePath = this.quote(remotePath);
    const escaped = content.replace(/'/g, `'\\''`);
    await AdbService.shell(`printf '%s' '${escaped}' > ${safePath}`, { timeout: TIMEOUT.shellLong });
  }
  /** 修改权限(对应 wkbin 计划中的 File permission modification) */
  async chmod(remotePath, mode, recursive = false) {
    const flag = recursive ? "-R" : "";
    await AdbService.shell(`chmod ${flag} ${mode} ${this.quote(remotePath)}`, {
      timeout: TIMEOUT.shellLong,
      root: false
    });
  }
  /** 批量删除(对应 T0biasCZe/JSleim 的多选批量操作) */
  async batchRemove(paths2, recursive = true) {
    const flag = recursive ? "-rf" : "-f";
    const success = [];
    const failed = [];
    for (const p of paths2) {
      try {
        await AdbService.shell(`rm ${flag} ${this.quote(p)}`, { timeout: TIMEOUT.flash });
        success.push(p);
      } catch (e) {
        failed.push({ path: p, error: e.message });
      }
    }
    return { success, failed };
  }
  /** 在当前目录内搜索(对应 wkbin 的 File search) */
  async searchInDir(dir, query, deviceSerial) {
    const safeDir = this.quote(dir);
    const safeQuery = this.quote(`*${query}*`);
    let out;
    try {
      out = await this.shellDevice(
        `find ${safeDir} -maxdepth 1 -iname ${safeQuery} 2>/dev/null`,
        { timeout: TIMEOUT.fileOp },
        deviceSerial
      );
    } catch {
      out = await this.shellDevice(
        `ls ${safeDir} | grep -i ${this.quote(query)}`,
        { timeout: TIMEOUT.fileOp },
        deviceSerial
      );
    }
    const foundPaths = out.split("\n").map((l) => l.trim()).filter(Boolean);
    const results = [];
    for (const p of foundPaths) {
      const e = await this.stat(p, deviceSerial);
      if (e) results.push(e);
    }
    return results;
  }
  /** 列出所有已连接的 ADB 设备(对应 wkbin/JSleim 的 Multi-device support) */
  async listDevices() {
    const result = await SubprocessPool.spawn({
      cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
      args: ["devices", "-l"],
      encoding: "utf-8",
      timeout: TIMEOUT.device,
      cwd: paths.bin
    });
    const devices = [];
    const lines = result.stdout.split("\n").slice(1);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) continue;
      const serial = parts[0];
      const state = parts[1];
      if (state !== "device" && state !== "unauthorized" && state !== "offline") continue;
      const modelField = parts.find((p) => p.startsWith("model:"));
      const model = modelField ? modelField.slice(6) : void 0;
      devices.push({ serial, state, model });
    }
    return devices;
  }
  // ========== 内部:多设备/进度相关 ==========
  /** 构造带 -s <serial> 的 adb 参数前缀 */
  deviceArgs(serial) {
    return serial ? ["-s", serial] : [];
  }
  /** 在指定设备上执行 shell(默认走 AdbService,指定 serial 时直接 spawn) */
  async shellDevice(cmd, opts = {}, deviceSerial) {
    if (!deviceSerial) {
      return AdbService.shell(cmd, opts);
    }
    const args = ["-s", deviceSerial, "shell"];
    if (opts.root) {
      args.push(`su -c '${cmd.replace(/'/g, "'\\''")}'`);
    } else {
      args.push(cmd);
    }
    const result = await SubprocessPool.spawn({
      cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
      args,
      encoding: "gbk",
      timeout: opts.timeout ?? 3e4,
      cwd: paths.bin
    });
    return result.stdout;
  }
  /**
   * spawn adb push/pull 并解析 [XX%] 进度
   * adb push/pull 进度行格式(无换行,用 \r 刷新):
   *   [ 10%] /sdcard/x.mp4
   *   [100%] /sdcard/x.mp4
   */
  async spawnWithProgress(args, ctx) {
    let lastPercent = 0;
    await SubprocessPool.spawn({
      cmd: process.platform === "win32" ? paths.binFile("adb.exe") : "adb",
      args,
      encoding: "utf-8",
      timeout: 0,
      // 不超时(大文件)
      cwd: paths.bin,
      onStdout: (line) => {
        const m = line.match(/\[\s*(\d+)%\]/);
        if (m && ctx.onProgress) {
          const percent = parseInt(m[1], 10);
          if (percent !== lastPercent) {
            lastPercent = percent;
            ctx.onProgress({
              local: ctx.local,
              remote: ctx.remote,
              direction: ctx.direction,
              transferred: 0,
              total: 0,
              percent
            });
          }
        }
      }
    });
    if (ctx.onProgress && lastPercent < 100) {
      ctx.onProgress({
        local: ctx.local,
        remote: ctx.remote,
        direction: ctx.direction,
        transferred: 0,
        total: 0,
        percent: 100
      });
    }
  }
  /** 获取本地文件的修改时间(YYYY-MM-DD HH:MM:SS 格式,供 touch -d 用) */
  async getLocalMtime(localPath) {
    try {
      const fs2 = await import("node:fs");
      const stat = fs2.statSync(localPath);
      const d = stat.mtime;
      const pad = (n) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return null;
    }
  }
  // ========== 工具方法 ==========
  /** 单引号转义路径 */
  quote(p) {
    return `'${String(p).replace(/'/g, `'\\''`)}'`;
  }
  /** 拼接路径 */
  joinPath(base, name) {
    if (base.endsWith("/")) return base + name;
    return base + "/" + name;
  }
  /** 获取父目录 */
  parentDir(p) {
    const idx = p.lastIndexOf("/");
    if (idx <= 0) return "/";
    return p.slice(0, idx);
  }
  /** 获取扩展名(小写无点) */
  getExt(name) {
    const idx = name.lastIndexOf(".");
    if (idx <= 0 || idx === name.length - 1) return "";
    return name.slice(idx + 1).toLowerCase();
  }
}
const FileService = new FileServiceClass();
const logger$5 = Logger.instance.child("ApkParser");
function parseZipEntries(buffer) {
  const entries = [];
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65536); i--) {
    if (buffer.readUInt32LE(i) === 101010256) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error("ZIP EOCD 未找到");
  }
  const cdOffset = buffer.readUInt32LE(eocdOffset + 16);
  const cdCount = buffer.readUInt16LE(eocdOffset + 10);
  let pos = cdOffset;
  for (let i = 0; i < cdCount; i++) {
    if (buffer.readUInt32LE(pos) !== 33639248) break;
    const compressionMethod = buffer.readUInt16LE(pos + 10);
    const compressedSize = buffer.readUInt32LE(pos + 20);
    const uncompressedSize = buffer.readUInt32LE(pos + 24);
    const filenameLength = buffer.readUInt16LE(pos + 28);
    const extraFieldLength = buffer.readUInt16LE(pos + 30);
    const commentLength = buffer.readUInt16LE(pos + 32);
    const localHeaderOffset = buffer.readUInt32LE(pos + 42);
    const filename = buffer.toString("utf8", pos + 46, pos + 46 + filenameLength);
    entries.push({
      filename,
      offset: localHeaderOffset,
      compressedSize,
      uncompressedSize,
      compressionMethod
    });
    pos += 46 + filenameLength + extraFieldLength + commentLength;
  }
  return entries;
}
function extractZipEntry(buffer, entry) {
  if (entry.offset + 30 > buffer.length) {
    throw new Error("ZIP entry offset 超出 buffer");
  }
  const localFilenameLength = buffer.readUInt16LE(entry.offset + 26);
  const localExtraLength = buffer.readUInt16LE(entry.offset + 28);
  const dataOffset = entry.offset + 30 + localFilenameLength + localExtraLength;
  if (dataOffset > buffer.length) {
    throw new Error("ZIP data offset 超出 buffer");
  }
  if (entry.compressionMethod === 0) {
    const end = Math.min(dataOffset + entry.uncompressedSize, buffer.length);
    return buffer.subarray(dataOffset, end);
  } else if (entry.compressionMethod === 8) {
    const end = Math.min(dataOffset + entry.compressedSize, buffer.length);
    const compressed = buffer.subarray(dataOffset, end);
    return node_zlib.inflateSync(compressed);
  }
  throw new Error(`不支持的压缩方法: ${entry.compressionMethod}`);
}
class AxmlParser {
  buffer;
  pos = 0;
  /** 字符串池 */
  strings = [];
  constructor(buffer) {
    this.buffer = buffer;
  }
  parse() {
    const magic = this.readUInt16(0);
    if (magic !== 3) {
      throw new Error(`AXML magic 错误: 0x${magic.toString(16)}`);
    }
    this.pos = 8;
    const result = {
      permissions: []
    };
    while (this.pos < this.buffer.length) {
      const chunkType = this.readUInt16(this.pos);
      const chunkSize = this.readUInt32(this.pos + 4);
      switch (chunkType) {
        case 1:
          this.parseStringPool();
          break;
        case 384:
          this.parseStartTag(result);
          break;
        default:
          this.pos += chunkSize;
          break;
      }
    }
    return result;
  }
  /** 解析字符串池 */
  parseStringPool() {
    const startPos = this.pos;
    const stringCount = this.readUInt32(startPos + 8);
    const stringsStart = this.readUInt32(startPos + 12);
    const offsets = [];
    for (let i = 0; i < stringCount; i++) {
      offsets.push(this.readUInt32(startPos + 20 + i * 4));
    }
    this.strings = [];
    for (let i = 0; i < stringCount; i++) {
      const strOffset = startPos + stringsStart + offsets[i];
      let len = this.buffer.readUInt16LE(strOffset);
      if (len & 32768) {
        len = (len & 32767) << 16 | this.buffer.readUInt16LE(strOffset + 2);
        const strData = this.buffer.toString("utf16le", strOffset + 4, strOffset + 4 + len * 2);
        this.strings.push(strData);
      } else {
        const strData = this.buffer.toString("utf16le", strOffset + 2, strOffset + 2 + len * 2);
        this.strings.push(strData);
      }
    }
    const chunkSize = this.readUInt32(startPos + 4);
    this.pos = startPos + chunkSize;
  }
  /** 解析 StartTag(提取属性) */
  parseStartTag(result) {
    const startPos = this.pos;
    const attrCount = this.readUInt16(startPos + 14);
    const attrStart = startPos + 36;
    for (let i = 0; i < attrCount; i++) {
      const attrPos = attrStart + i * 20;
      if (attrPos + 20 > this.buffer.length) break;
      const nameIdx = this.readUInt32(attrPos + 4);
      const valueIdx = this.readUInt32(attrPos + 12);
      const attrName = nameIdx < this.strings.length ? this.strings[nameIdx] : "";
      const attrValue = valueIdx < this.strings.length ? this.strings[valueIdx] : "";
      if (attrName === "package" && attrValue) {
        result.packageName = attrValue;
      } else if (attrName === "versionName" && attrValue) {
        result.versionName = attrValue;
      } else if (attrName === "versionCode") {
        const rawValue = this.readUInt32(attrPos + 16);
        if (rawValue) {
          result.versionCode = String(rawValue);
        } else if (attrValue) {
          result.versionCode = attrValue;
        }
      } else if (attrName === "minSdkVersion") {
        const rawValue = this.readUInt32(attrPos + 16);
        if (rawValue) {
          result.minSdkVersion = rawValue;
        }
      } else if (attrName === "targetSdkVersion") {
        const rawValue = this.readUInt32(attrPos + 16);
        if (rawValue) {
          result.targetSdkVersion = rawValue;
        }
      } else if (attrName === "name" && attrValue && attrValue.startsWith("android.permission.")) {
        const perms = result.permissions;
        perms.push(attrValue.replace("android.permission.", ""));
      } else if (attrName === "label" && attrValue && !attrValue.startsWith("@")) {
        result.label = attrValue;
      }
    }
    const chunkSize = this.readUInt32(startPos + 4);
    this.pos = startPos + chunkSize;
  }
  readUInt16(offset) {
    if (offset + 2 > this.buffer.length) return 0;
    return this.buffer.readUInt16LE(offset);
  }
  readUInt32(offset) {
    if (offset + 4 > this.buffer.length) return 0;
    return this.buffer.readUInt32LE(offset);
  }
}
class ApkParserClass {
  /**
   * 解析 APK 文件
   * @param apkPath APK 文件路径
   * @returns 解析结果
   */
  async parse(apkPath) {
    if (!fs.existsSync(apkPath)) {
      throw new Error(`文件不存在: ${apkPath}`);
    }
    const stat = fs.statSync(apkPath);
    const buffer = fs.readFileSync(apkPath);
    const entries = parseZipEntries(buffer);
    logger$5.info(`APK 包含 ${entries.length} 个文件`);
    const manifestEntry = entries.find((e) => e.filename === "AndroidManifest.xml");
    if (!manifestEntry) {
      throw new Error("AndroidManifest.xml 不存在");
    }
    const manifestData = extractZipEntry(buffer, manifestEntry);
    const parser = new AxmlParser(manifestData);
    const parsed = parser.parse();
    const abis = [];
    let dexSize;
    let signer;
    let iconEntry = null;
    for (const entry of entries) {
      const libMatch = entry.filename.match(/^lib\/([^/]+)\//);
      if (libMatch && !abis.includes(libMatch[1])) {
        abis.push(libMatch[1]);
      }
      if (entry.filename === "classes.dex" || entry.filename.match(/^classes\d+\.dex$/)) {
        dexSize = (dexSize ?? 0) + entry.uncompressedSize;
      }
      if (entry.filename.match(/^META-INF\/.*\.(RSA|DSA|EC)$/)) {
        signer = entry.filename.split("/").pop();
      }
    }
    const iconPatterns = [
      /^res\/mipmap-xxxhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-xxhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-xhdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-hdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-mdpi-v?\d*\/ic_launcher\.png$/i,
      /^res\/mipmap-[^/]+\/ic_launcher\.png$/i,
      /^res\/drawable-[^/]+\/ic_launcher\.png$/i,
      /^res\/drawable\/ic_launcher\.png$/i,
      // Adaptive icon(前景层,可能不够好看但能用)
      /^res\/mipmap-xxxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-xxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-[^/]+\/ic_launcher_foreground\.png$/i,
      // 通用:任何 mipmap 下的 PNG(最后兜底)
      /^res\/mipmap-xxxhdpi\/[^/]+\.png$/i,
      /^res\/mipmap-xxhdpi\/[^/]+\.png$/i,
      /^res\/mipmap-[^/]+\/[^/]+\.png$/i
    ];
    for (const pattern of iconPatterns) {
      iconEntry = entries.find((e) => pattern.test(e.filename)) ?? null;
      if (iconEntry) break;
    }
    let iconBase64;
    let iconMime;
    if (iconEntry) {
      try {
        const iconData = extractZipEntry(buffer, iconEntry);
        if (iconData.length < 512 * 1024) {
          iconBase64 = iconData.toString("base64");
          iconMime = iconEntry.filename.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
        }
      } catch {
      }
    }
    const info = {
      packageName: parsed.packageName,
      versionName: parsed.versionName,
      versionCode: parsed.versionCode,
      minSdkVersion: parsed.minSdkVersion,
      targetSdkVersion: parsed.targetSdkVersion,
      permissions: parsed.permissions ?? [],
      apkSize: stat.size,
      dexSize,
      abis,
      signer,
      label: parsed.label,
      iconBase64,
      iconMime
    };
    logger$5.info(`解析成功: ${info.packageName} v${info.versionName ?? "?"}(${info.permissions.length} 权限, 图标: ${iconBase64 ? "有" : "无"})`);
    return info;
  }
}
const ApkParser = new ApkParserClass();
const logger$4 = Logger.instance;
function registerFileIpc() {
  electron.ipcMain.handle(
    "file:list",
    wrap(
      ({ path: path2, deviceSerial }) => FileService.list(path2, deviceSerial).then((entries) => ({ success: true, entries })),
      { requireDevice: "adb", errorExtra: { entries: [] }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:stat",
    wrap(
      ({ path: path2 }) => FileService.stat(path2).then((entry) => ({ success: true, entry })),
      { requireDevice: "adb", errorExtra: { entry: null }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:exists",
    wrap(
      ({ path: path2 }) => FileService.exists(path2).then((exists) => ({ success: true, exists })),
      { requireDevice: "adb", errorExtra: { exists: false }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:mkdir",
    wrap(
      ({ path: path2, recursive = true }) => FileService.mkdir(path2, recursive).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:remove",
    wrap(
      ({ path: path2, recursive = true }) => FileService.remove(path2, recursive).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:rename",
    wrap(
      ({ oldPath, newPath }) => FileService.rename(oldPath, newPath).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:copy",
    wrap(
      ({ srcPath, dstPath, recursive = true }) => FileService.copy(srcPath, dstPath, recursive).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:push",
    wrap(
      ({ local, remote, deviceSerial }, evt) => FileService.push(local, remote, deviceSerial, (p) => {
        evt.sender.send("file:transfer-progress", p);
      }).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:pull",
    wrap(
      ({ remote, local, deviceSerial }, evt) => FileService.pull(remote, local, deviceSerial, (p) => {
        evt.sender.send("file:transfer-progress", p);
      }).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:push-folder",
    wrap(
      ({ localDir, remoteDir }) => AdbService.push(localDir, remoteDir).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:install-apk",
    wrap(({ remoteApk }) => FileService.installRemoteApk(remoteApk), {
      requireDevice: "adb",
      logPrefix: "file"
    })
  );
  electron.ipcMain.handle(
    "file:install-local-apk",
    wrapNoArgs(async () => {
      const result = await electron.dialog.showOpenDialog({
        title: "选择 APK 文件",
        filters: [{ name: "Android 应用包", extensions: ["apk"] }],
        properties: ["openFile"]
      });
      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, error: "未选择文件" };
      }
      const local = result.filePaths[0];
      const r = await AdbService.install(local, "install");
      return { success: r.success, pkg: r.pkg };
    }, { requireDevice: "adb", logPrefix: "file" })
  );
  electron.ipcMain.handle(
    "file:disk-info",
    wrap(
      ({ path: path2 = "/sdcard" }) => FileService.diskInfo(path2).then((info) => ({ success: true, info })),
      { requireDevice: "adb", errorExtra: { info: null }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:read-text",
    wrap(
      ({ path: path2 }) => FileService.readTextFile(path2).then((content) => ({ success: true, content })),
      { requireDevice: "adb", errorExtra: { content: "" }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle("file:quick-paths", async () => {
    return { success: true, paths: FileService.QUICK_PATHS };
  });
  electron.ipcMain.handle("file:list-devices", async () => {
    try {
      const devices = await FileService.listDevices();
      return { success: true, devices };
    } catch (e) {
      return { success: false, devices: [], error: e.message };
    }
  });
  electron.ipcMain.handle(
    "file:create-file",
    wrap(
      ({ path: path2, content = "" }) => FileService.createFile(path2, content).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:write-file",
    wrap(
      ({ path: path2, content }) => FileService.writeFile(path2, content).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:chmod",
    wrap(
      ({ path: path2, mode, recursive = false }) => FileService.chmod(path2, mode, recursive).then(() => ({ success: true })),
      { requireDevice: "adb", logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:batch-remove",
    wrap(
      ({ paths: paths2, recursive = true }) => FileService.batchRemove(paths2, recursive).then((result) => ({
        success: true,
        deleted: result.success,
        failed: result.failed
      })),
      { requireDevice: "adb", errorExtra: { deleted: [], failed: [] }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:search",
    wrap(
      ({ dir, query, deviceSerial }) => FileService.searchInDir(dir, query, deviceSerial).then((entries) => ({ success: true, entries })),
      { requireDevice: "adb", errorExtra: { entries: [] }, logPrefix: "file" }
    )
  );
  electron.ipcMain.handle(
    "file:set-compat-mode",
    wrap(({ enabled }) => {
      FileService.compatMode = enabled;
      return { success: true, compatMode: FileService.compatMode };
    }, { logPrefix: "file" })
  );
  electron.ipcMain.handle(
    "file:set-keep-mtime",
    wrap(({ enabled }) => {
      FileService.keepMtime = enabled;
      return { success: true, keepMtime: FileService.keepMtime };
    }, { logPrefix: "file" })
  );
  electron.ipcMain.handle(
    "file:parse-apk",
    wrap(
      ({ apkPath }) => ApkParser.parse(apkPath),
      { logPrefix: "file" }
    )
  );
  logger$4.info("ipc", "file:* 通道已注册");
}
const logger$3 = Logger.instance.child("EdlPartitionService");
const CRITICAL_PARTITIONS = [
  "boot",
  "system",
  "modem",
  "recovery",
  "xbl",
  "sbl",
  "aboot",
  "tz",
  "rpm",
  "hyp",
  "modemst1",
  "modemst2",
  "fsg",
  "fsc",
  "ssd",
  "DDR",
  "pad"
];
const PROGRESS_RE = /(\w+):\s*([\d.]+)%\s*\(([\d.]+)\s*\/\s*([\d.]+)\s*MiB\)\s*\[([^\]]+)\]/;
class EdlPartitionServiceClass {
  /** edl-ng 可执行文件路径 */
  edlNgPath = paths.edlNgFile("edl-ng.exe");
  /** edl-ng 工作目录(放 libusb-1.0.dll) */
  edlNgDir = paths.edlNg;
  /** 操作记录(最近 50 条) */
  operationHistory = [];
  historyIdCounter = 0;
  // ========== 分区表(实时读设备 GPT) ==========
  /**
   * 读 GPT 分区表(edl-ng printgpt)
   * 实时从设备读取,不依赖静态 XML
   */
  async printGpt(opts) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error(`firehose loader 不存在: ${loader}`);
      }
      onProgress?.("正在读取 GPT 分区表...");
      const result = await this.spawnEdlNg([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        // iMoo 是 eMMC
        "--slot",
        "0",
        "printgpt"
      ], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = `printgpt 失败(退出码 ${result.exitCode}): ${result.stderr || result.stdout}`;
        this.recordOperation({ type: "printgpt", label: "-", success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, partitions: [], error: msg2 };
      }
      const partitions = this.parseGptOutput(result.stdout);
      const storage = this.parseStorageInfo(result.stdout);
      const msg = `读取成功,共 ${partitions.length} 个分区`;
      onProgress?.(msg);
      this.recordOperation({ type: "printgpt", label: "-", success: true, message: msg, durationMs: Date.now() - start });
      return { success: true, partitions, storage };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`printgpt 失败: ${msg}`);
      this.recordOperation({ type: "printgpt", label: "-", success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, partitions: [], error: msg };
    }
  }
  /**
   * 解析 edl-ng printgpt 输出
   * 格式(每分区多行):
   *   --- Partitions LUN 0 ---
   *     Name: modem
   *       Type: {GUID}
   *       UID:  {GUID}
   *       LBA:  1024-5120 (Size: 20.00 MiB)
   */
  parseGptOutput(output) {
    const partitions = [];
    let current = null;
    let currentLun = 0;
    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      const lunMatch = trimmed.match(/--- Partitions\s+(?:LUN\s+)?(\d+)\s*---/i);
      if (lunMatch) {
        currentLun = parseInt(lunMatch[1], 10);
        continue;
      }
      const nameMatch = trimmed.match(/^Name:\s*(.+)$/);
      if (nameMatch) {
        if (current) partitions.push(current);
        current = { label: nameMatch[1].trim(), lun: currentLun };
        continue;
      }
      if (!current) continue;
      const typeMatch = trimmed.match(/^Type:\s*(.+)$/);
      if (typeMatch) {
        current.typeGuid = typeMatch[1].trim();
        continue;
      }
      const uidMatch = trimmed.match(/^UID:\s*(.+)$/);
      if (uidMatch) {
        current.uid = uidMatch[1].trim();
        continue;
      }
      const lbaMatch = trimmed.match(/^LBA:\s*(\d+)-(\d+)\s*\(Size:\s*([\d.]+)\s*(KiB|MiB|GiB)\)/i);
      if (lbaMatch) {
        current.firstLba = parseInt(lbaMatch[1], 10);
        current.lastLba = parseInt(lbaMatch[2], 10);
        const val = parseFloat(lbaMatch[3]);
        const unit = lbaMatch[4].toLowerCase();
        const mult = unit === "kib" ? 1024 : unit === "mib" ? 1024 * 1024 : 1024 * 1024 * 1024;
        current.sizeBytes = Math.round(val * mult);
        continue;
      }
    }
    if (current) partitions.push(current);
    return partitions.filter((p) => p.label && p.sizeBytes > 0);
  }
  /** 解析存储几何信息(扇区大小、LUN 数) */
  parseStorageInfo(output) {
    let sectorSize = 512;
    let lunCount = 1;
    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      const sectorMatch = trimmed.match(/sector size:\s*(\d+)\s*bytes/i);
      if (sectorMatch) {
        sectorSize = parseInt(sectorMatch[1], 10);
      }
      const lunHeaderMatch = trimmed.match(/--- (?:GPT Header|Partitions)\s+LUN\s+(\d+)\s*---/i);
      if (lunHeaderMatch) {
        const lun = parseInt(lunHeaderMatch[1], 10) + 1;
        if (lun > lunCount) lunCount = lun;
      }
    }
    return { sectorSize, lunCount };
  }
  // ========== 单分区操作 ==========
  /**
   * 备份单个分区(edl-ng read-part)
   * edl-ng 自动按分区名找位置,不需要手动指定 LBA
   */
  async backupPartition(opts) {
    const { loader, label, outputFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error(`firehose loader 不存在: ${loader}`);
      }
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      onProgress?.(`正在备份分区: ${label}`);
      const result = await this.spawnEdlNgWithProgress([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        "--slot",
        "0",
        "read-part",
        label,
        outputFile
      ], onProgress, onTransferProgress);
      if (result.exitCode !== 0) {
        const msg2 = `备份失败: ${result.stderr || result.stdout}`;
        this.recordOperation({ type: "backup", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      if (!fs.existsSync(outputFile)) {
        const msg2 = "备份失败: 输出文件未生成";
        this.recordOperation({ type: "backup", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = `备份完成: ${outputFile}`;
      onProgress?.(msg);
      this.recordOperation({ type: "backup", label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`备份分区 ${label} 失败: ${msg}`);
      this.recordOperation({ type: "backup", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  /**
   * 恢复单个分区(edl-ng write-part)
   * 安全:可选恢复前备份 + 可选恢复后校验
   */
  async restorePartition(opts) {
    const {
      loader,
      label,
      inputFile,
      backupBeforeRestore = true,
      backupOutputDir,
      verifyAfterRestore = false,
      onProgress,
      onTransferProgress
    } = opts;
    const start = Date.now();
    let backupPath;
    try {
      if (!fs.existsSync(loader)) {
        throw new Error(`firehose loader 不存在: ${loader}`);
      }
      if (!fs.existsSync(inputFile)) {
        throw new Error(`输入文件不存在: ${inputFile}`);
      }
      if (backupBeforeRestore) {
        if (!backupOutputDir) {
          throw new Error("backupBeforeRestore=true 时需提供 backupOutputDir");
        }
        const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
        backupPath = path.join(backupOutputDir, `${label}_pre_restore_${ts}.img`);
        onProgress?.(`恢复前备份当前分区到: ${backupPath}`);
        const backupRes = await this.backupPartition({
          loader,
          label,
          outputFile: backupPath,
          onProgress,
          onTransferProgress
        });
        if (!backupRes.success) {
          throw new Error(`恢复前备份失败: ${backupRes.error}(已中止恢复以防数据丢失)`);
        }
      }
      onProgress?.(`正在恢复分区: ${label}`);
      const result = await this.spawnEdlNgWithProgress([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        "--slot",
        "0",
        "write-part",
        label,
        inputFile
      ], onProgress, onTransferProgress);
      if (result.exitCode !== 0) {
        const msg2 = `恢复失败: ${result.stderr || result.stdout}`;
        this.recordOperation({ type: "restore", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2, backupPath };
      }
      if (verifyAfterRestore) {
        onProgress?.("恢复后读回校验...");
        const verify = await this.verifyPartition({ loader, label, expectedFile: inputFile, onProgress, onTransferProgress });
        if (!verify.matched) {
          onProgress?.(`校验未通过: ${verify.error ?? "数据不一致"}`);
        } else {
          onProgress?.("校验通过");
        }
      }
      const msg = `恢复完成: ${label}`;
      onProgress?.(msg);
      this.recordOperation({
        type: "restore",
        label,
        success: true,
        message: msg + (backupPath ? "(已备份原数据)" : ""),
        durationMs: Date.now() - start
      });
      return { success: true, backupPath };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`恢复分区 ${label} 失败: ${msg}`);
      this.recordOperation({ type: "restore", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg, backupPath };
    }
  }
  /**
   * 校验分区:读回分区与本地文件逐字节比对
   */
  async verifyPartition(opts) {
    const { loader, label, expectedFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(expectedFile)) {
        return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: "预期文件不存在" };
      }
      const expectedSize = fs.statSync(expectedFile).size;
      const workDir = paths.edlWork;
      if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
      const readBackPath = path.join(workDir, `verify_${label}_${Date.now()}.img`);
      onProgress?.(`读回分区 ${label} 进行校验...`);
      const result = await this.spawnEdlNgWithProgress([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        "--slot",
        "0",
        "read-part",
        label,
        readBackPath
      ], onProgress, onTransferProgress);
      if (result.exitCode !== 0 || !fs.existsSync(readBackPath)) {
        this.recordOperation({ type: "verify", label, success: false, message: "读回失败", durationMs: Date.now() - start });
        return { success: false, matched: false, bytesRead: 0, bytesExpected: expectedSize, error: "读回失败" };
      }
      const actualSize = fs.statSync(readBackPath).size;
      let matched = actualSize === expectedSize;
      if (matched) {
        const expectedFd = fs.openSync(expectedFile, "r");
        const actualFd = fs.openSync(readBackPath, "r");
        const bufSize = 4 * 1024 * 1024;
        const buf1 = Buffer.alloc(bufSize);
        const buf2 = Buffer.alloc(bufSize);
        let offset = 0;
        while (offset < expectedSize) {
          const toRead = Math.min(bufSize, expectedSize - offset);
          const r1 = fs.readSync(expectedFd, buf1, 0, toRead, offset);
          const r2 = fs.readSync(actualFd, buf2, 0, toRead, offset);
          if (r1 !== r2 || buf1.compare(buf2, 0, r1, 0, r2) !== 0) {
            matched = false;
            break;
          }
          offset += r1;
        }
        fs.closeSync(expectedFd);
        fs.closeSync(actualFd);
      }
      try {
        fs.unlinkSync(readBackPath);
      } catch {
      }
      this.recordOperation({
        type: "verify",
        label,
        success: true,
        message: matched ? "校验通过" : "数据不一致",
        durationMs: Date.now() - start
      });
      return { success: true, matched, bytesRead: actualSize, bytesExpected: expectedSize };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`校验分区 ${label} 失败: ${msg}`);
      this.recordOperation({ type: "verify", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: msg };
    }
  }
  /**
   * 擦除单个分区(edl-ng erase-part)
   * edl-ng 直接发 firehose erase 命令,不需要生成全零镜像
   */
  async erasePartition(opts) {
    const { loader, label, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error(`firehose loader 不存在: ${loader}`);
      }
      onProgress?.(`正在擦除分区: ${label}`);
      const result = await this.spawnEdlNg([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        "--slot",
        "0",
        "erase-part",
        label
      ], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = `擦除失败: ${result.stderr || result.stdout}`;
        this.recordOperation({ type: "erase", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = `擦除完成: ${label}`;
      onProgress?.(msg);
      this.recordOperation({ type: "erase", label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`擦除分区 ${label} 失败: ${msg}`);
      this.recordOperation({ type: "erase", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  /** 重启设备(edl-ng reset) */
  async resetDevice(opts) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error(`firehose loader 不存在: ${loader}`);
      }
      onProgress?.("正在重启设备...");
      const result = await this.spawnEdlNg([
        "--loader",
        loader,
        "--memory",
        "Sdcc",
        "--slot",
        "0",
        "reset",
        "--mode",
        "Reset",
        "--delay",
        "1"
      ], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = `重启失败: ${result.stderr || result.stdout}`;
        this.recordOperation({ type: "reset", label: "-", success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = "重启指令已发送";
      onProgress?.(msg);
      this.recordOperation({ type: "reset", label: "-", success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$3.error(`重启失败: ${msg}`);
      this.recordOperation({ type: "reset", label: "-", success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  // ========== 辅助 ==========
  /** 检查设备是否在 9008 模式 */
  async checkEdlDevice() {
    const device = DeviceService.instance.current();
    if (device?.type === "qcom_edl") {
      return { inEdl: true, port: device.port };
    }
    return { inEdl: false };
  }
  /** 判断分区是否关键 */
  isCritical(label) {
    return CRITICAL_PARTITIONS.includes(label);
  }
  /** 获取可用 loader 列表 */
  listLoaders() {
    return [
      { name: "msm8909w.mbn", path: paths.edlFile("msm8909w.mbn"), description: "Z2-Z6 非 V3" },
      { name: "msm8937.mbn", path: paths.edlFile("msm8937.mbn"), description: "V3 机型(Z6+/Z7+)" },
      { name: "prog_firehose_ddr.elf", path: paths.edlFile("prog_firehose_ddr.elf"), description: "Z10/ND03" }
    ];
  }
  // ========== 操作历史 ==========
  getHistory() {
    return [...this.operationHistory].reverse();
  }
  clearHistory() {
    this.operationHistory = [];
  }
  recordOperation(opts) {
    this.operationHistory.push({
      id: `op-${++this.historyIdCounter}`,
      ...opts,
      timestamp: Date.now()
    });
    if (this.operationHistory.length > 50) {
      this.operationHistory.shift();
    }
  }
  // ========== 内部:edl-ng 调用 ==========
  /** spawn edl-ng,捕获完整输出(无进度解析) */
  async spawnEdlNg(args, onProgress) {
    logger$3.info(`edl-ng ${args.join(" ")}`);
    return SubprocessPool.spawn({
      cmd: this.edlNgPath,
      args,
      encoding: "utf-8",
      timeout: 0,
      // 不超时(大文件操作)
      cwd: this.edlNgDir,
      onStdout: (line) => {
        logger$3.info(`edl-ng: ${line}`);
        onProgress?.(line);
      },
      onStderr: (line) => {
        logger$3.warn(`edl-ng stderr: ${line}`);
      }
    });
  }
  /** spawn edl-ng,解析进度行(\r 前缀的百分比行) */
  async spawnEdlNgWithProgress(args, onProgress, onTransferProgress) {
    logger$3.info(`edl-ng ${args.join(" ")}`);
    return SubprocessPool.spawn({
      cmd: this.edlNgPath,
      args,
      encoding: "utf-8",
      timeout: 0,
      cwd: this.edlNgDir,
      onStdout: (line) => {
        const m = line.match(PROGRESS_RE);
        if (m && onTransferProgress) {
          onTransferProgress({
            operation: m[1],
            percent: parseFloat(m[2]),
            transferredMiB: parseFloat(m[3]),
            totalMiB: parseFloat(m[4]),
            speed: m[5]
          });
        } else {
          logger$3.info(`edl-ng: ${line}`);
          onProgress?.(line);
        }
      },
      onStderr: (line) => {
        logger$3.warn(`edl-ng stderr: ${line}`);
      }
    });
  }
}
const EdlPartitionService = new EdlPartitionServiceClass();
const logger$2 = Logger.instance;
function registerEdlPartitionIpc() {
  electron.ipcMain.handle("edl-part:list-loaders", async () => {
    return { success: true, loaders: EdlPartitionService.listLoaders() };
  });
  electron.ipcMain.handle("edl-part:check-edl-device", async () => {
    try {
      const result = await EdlPartitionService.checkEdlDevice();
      return { success: true, ...result };
    } catch (e) {
      return { success: false, inEdl: false, error: e.message };
    }
  });
  electron.ipcMain.handle(
    "edl-part:print-gpt",
    async (evt, opts) => {
      return EdlPartitionService.printGpt({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        }
      });
    }
  );
  electron.ipcMain.handle(
    "edl-part:backup-partition",
    async (evt, opts) => {
      return EdlPartitionService.backupPartition({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        },
        onTransferProgress: (p) => {
          evt.sender.send("edl-part:transfer-progress", p);
        }
      });
    }
  );
  electron.ipcMain.handle(
    "edl-part:restore-partition",
    async (evt, opts) => {
      return EdlPartitionService.restorePartition({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        },
        onTransferProgress: (p) => {
          evt.sender.send("edl-part:transfer-progress", p);
        }
      });
    }
  );
  electron.ipcMain.handle(
    "edl-part:erase-partition",
    async (evt, opts) => {
      return EdlPartitionService.erasePartition({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        }
      });
    }
  );
  electron.ipcMain.handle(
    "edl-part:verify-partition",
    async (evt, opts) => {
      const result = await EdlPartitionService.verifyPartition({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        },
        onTransferProgress: (p) => {
          evt.sender.send("edl-part:transfer-progress", p);
        }
      });
      return { success: true, result };
    }
  );
  electron.ipcMain.handle(
    "edl-part:reset-device",
    async (evt, opts) => {
      return EdlPartitionService.resetDevice({
        ...opts,
        onProgress: (msg) => {
          evt.sender.send("edl-part:progress", { msg, ts: Date.now() });
        }
      });
    }
  );
  electron.ipcMain.handle("edl-part:get-history", async () => {
    return { success: true, history: EdlPartitionService.getHistory() };
  });
  electron.ipcMain.handle("edl-part:clear-history", async () => {
    EdlPartitionService.clearHistory();
    return { success: true };
  });
  logger$2.info("ipc", "edl-part:* 通道已注册");
}
const logger$1 = Logger.instance;
function registerAllIpc() {
  registerSystemIpc();
  registerDeviceIpc();
  registerLogIpc();
  registerRebootIpc();
  registerCloudIpc();
  registerScrcpyIpc();
  registerAppIpc();
  registerToolsIpc();
  registerMagiskIpc();
  registerBackupIpc();
  registerRootIpc();
  registerFileIpc();
  registerEdlPartitionIpc();
  logger$1.info("ipc", "所有 IPC 通道已注册");
}
if (!ensureSingleInstance()) {
  process.exit(0);
}
const logger = Logger.instance;
logger.info("main", `iMooAgentTool 启动中(dev=${paths.isDev})`);
const deviceService = DeviceService.instance;
electron.app.whenReady().then(() => {
  electron.Menu.setApplicationMenu(buildAppMenu());
  createMainWindow();
  registerAllIpc();
  deviceService.start();
  logger.info("main", "应用就绪");
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", () => {
  deviceService.stop();
  logger.info("main", "应用退出");
});
process.on("uncaughtException", (err) => {
  logger.error("main", `未捕获异常: ${err.message}`, err.stack);
});
process.on("unhandledRejection", (reason) => {
  logger.error("main", `未处理的 Promise 拒绝: ${String(reason)}`);
});


// [iMooAgent]
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
