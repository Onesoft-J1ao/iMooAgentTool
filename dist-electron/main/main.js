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
const fs = require("node:fs");
const node_child_process = require("node:child_process");
const node_events = require("node:events");
const iconv = require("iconv-lite");
const https = require("node:https");
const node_zlib = require("node:zlib");
const Store = require("electron-store");
const crypto = require("node:crypto");
const fs$1 = require("fs");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const iconv__namespace = /* @__PURE__ */ _interopNamespaceDefault(iconv);
const isDev = !electron.app.isPackaged;
function getUnpackedPath() {
  if (isDev) return electron.app.getAppPath();
  return path.join(process.resourcesPath, "app.asar.unpacked");
}
const appPath = electron.app.getAppPath();
const unpackedPath = getUnpackedPath();
const paths = {
  isDev,
  root: appPath,
  resources: path.join(appPath, "resources"),
  bin: path.join(unpackedPath, "resources", "bin"),
  edl: path.join(unpackedPath, "resources", "edl"),
  scripts: path.join(unpackedPath, "resources", "scripts"),
  data: path.join(appPath, "resources", "data"),
  assets: path.join(appPath, "resources", "assets"),
  cache: path.join(electron.app.getPath("userData"), "cache"),
  logs: path.join(electron.app.getPath("userData"), "logs"),
  dist: path.join(appPath, "dist"),
  preload: path.join(appPath, "dist-electron", "preload", "preload.js"),
  adb() {
    return path.join(this.bin, process.platform === "win32" ? "adb.exe" : "adb");
  },
  fastboot() {
    return path.join(this.bin, process.platform === "win32" ? "fastboot.exe" : "fastboot");
  },
  aria2c() {
    return path.join(this.bin, process.platform === "win32" ? "aria2c.exe" : "aria2c");
  },
  sevenZip() {
    return path.join(this.bin, process.platform === "win32" ? "7z.exe" : "7z");
  },
  qsahara() {
    return path.join(this.bin, "QSaharaServer.exe");
  },
  fhLoader() {
    return path.join(this.bin, "fh_loader.exe");
  },
  scrcpy() {
    return path.join(this.bin, "scrcpy.exe");
  },
  ensure(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
};
let mainWindow = null;
function createMainWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    show: false,
    icon: path.join(paths.assets, "icon.png"),
    webPreferences: {
      preload: paths.preload,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });
  if (paths.isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(paths.dist, "index.html"));
  }
  mainWindow.on("maximize", () => {
    mainWindow?.webContents.send("system:window-state", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow?.webContents.send("system:window-state", false);
  });
  return mainWindow;
}
function buildAppMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    {
      label: "File",
      submenu: [
        { type: "separator" },
        {
          label: "Quit",
          accelerator: isMac ? "Cmd+Q" : "Ctrl+Q",
          click: () => electron.app.quit()
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo", label: "Undo" },
        { role: "redo", label: "Redo" },
        { type: "separator" },
        { role: "cut", label: "Cut" },
        { role: "copy", label: "Copy" },
        { role: "paste", label: "Paste" },
        { type: "separator" },
        { role: "selectAll", label: "Select All" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload", label: "Reload" },
        { role: "toggleDevTools", label: "Toggle Developer Tools" },
        { type: "separator" },
        { role: "zoomIn", label: "Zoom In" },
        { role: "zoomOut", label: "Zoom Out" },
        { role: "resetZoom", label: "Reset Zoom" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About iMooAgentTool",
          click: () => {
            electron.dialog.showMessageBox({
              type: "info",
              title: "About iMooAgentTool",
              message: `iMooAgentTool v${electron.app.getVersion()}`,
              detail: `iMooAgentTool - XTC 电话手表工具箱
业务逻辑参考 AllToolBox 1.3.8fix1
Copyright (C) 2026 J1ao`
            });
          }
        }
      ]
    }
  ];
  return electron.Menu.buildFromTemplate(template);
}
function ensureSingleInstance() {
  const gotLock = electron.app.requestSingleInstanceLock();
  if (!gotLock) {
    electron.app.on("second-instance", () => {
      const windows = electron.BrowserWindow.getAllWindows();
      if (windows.length > 0) {
        const main = windows[0];
        if (main.isMinimized()) main.restore();
        main.focus();
      }
    });
  }
  return gotLock;
}
class Logger {
  static get instance() {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }
  formatMessage(source, message) {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] [${source}] ${message}`;
  }
  debug(source, message) {
    console.debug(this.formatMessage(source, message));
  }
  info(source, message) {
    console.info(this.formatMessage(source, message));
  }
  warn(source, message) {
    console.warn(this.formatMessage(source, message));
  }
  error(source, message, stack) {
    console.error(this.formatMessage(source, message));
    if (stack) {
      console.error(stack);
    }
  }
}
const logger$i = Logger.instance;
function checkIsV3(innermodel, softVersion) {
  const thresholds = {
    ND07: "1.5.1",
    ND01: "3.3.2",
    I32: "3.1.0",
    I25D: "1.5.8",
    I25C: "1.9.1",
    I25: "2.5.1",
    I20: "2.8.1"
  };
  const threshold = thresholds[innermodel];
  if (!threshold) return false;
  const normalize = (v) => v.split(".").map(Number);
  const a = normalize(softVersion);
  const b = normalize(threshold);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const va = a[i] || 0;
    const vb = b[i] || 0;
    if (va > vb) return true;
    if (va < vb) return false;
  }
  return false;
}
const MODEL_MAP = {
  I25: { model: "Z7", platform: "otherpass" },
  I25C: { model: "Z7-C", platform: "otherpass" },
  I25D: { model: "Z7-D", platform: "otherpass" },
  I20: { model: "Z7-3G", platform: "otherpass" },
  I32: { model: "Z8", platform: "otherpass" },
  I33: { model: "Z8-Pro", platform: "otherpass" },
  ND01: { model: "Z9", platform: "v3pash" },
  ND03: { model: "Z10", platform: "z10" },
  ND07: { model: "Z10", platform: "z10" },
  ND08: { model: "Z11", platform: "z10" },
  ND09: { model: "Z11", platform: "z10" },
  I13: { model: "Z6", platform: "otherpass" },
  I13C: { model: "Z6-C", platform: "otherpass" },
  I19: { model: "Z5", platform: "otherpass" }
};
const TIMEOUTS$1 = { device: 1e4 };
function spawnTool(cmd, args, timeout = TIMEOUTS$1.device) {
  return new Promise((resolve, reject) => {
    node_child_process.execFile(cmd, args, { cwd: paths.bin, timeout, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => {
      if (err && err.code !== void 0) {
        resolve({ stdout, stderr, code: err.code ?? 1 });
        return;
      }
      resolve({ stdout, stderr, code: 0 });
    });
  });
}
function resolveTool(name) {
  const isWin = process.platform === "win32";
  const exe = isWin ? `${name}.exe` : name;
  const p = path.join(paths.bin, exe);
  if (fs.existsSync(p)) return p;
  return isWin ? null : name;
}
class DeviceService {
  constructor() {
    this._running = false;
    this.currentInfo = null;
    this.listeners = /* @__PURE__ */ new Set();
    this.fallbackTimer = null;
    this.debounceTimer = null;
    this.detecting = false;
    this.lastNotify = "";
  }
  static get instance() {
    if (!DeviceService._instance) {
      DeviceService._instance = new DeviceService();
    }
    return DeviceService._instance;
  }
  getCurrentDevice() {
    return this.currentInfo;
  }
  onDeviceChange(cb) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
  async waitFor(types, timeout = 6e4) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        const info = this.currentInfo;
        if (info && types.includes(info.type)) {
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
  start() {
    if (this._running) return;
    this._running = true;
    setImmediate(() => this.detectAndUpdate());
    this.fallbackTimer = setInterval(() => this.detectAndUpdate(), 1e4);
  }
  stop() {
    this._running = false;
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
  scheduleDetect(delay) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.debounceTimer = null;
      this.detectAndUpdate();
    }, delay);
  }
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
  async detectOnce() {
    const adbInfo = await this.detectAdb();
    if (adbInfo) return adbInfo;
    const fbInfo = await this.detectFastboot();
    if (fbInfo) return fbInfo;
    const edlInfo = await this.detectEdl();
    if (edlInfo) return edlInfo;
    return null;
  }
  async detectAdb() {
    const adb = resolveTool("adb");
    if (!adb) return null;
    try {
      const result = await spawnTool(adb, ["devices"]);
      const lines = result.stdout.split("\n").slice(1).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/^(\S+)\s+(\S+)$/);
        if (!m) continue;
        const [, serial, state] = m;
        let type;
        if (serial.startsWith("emulator-")) type = "emulator";
        else if (state === "unauthorized") type = "unauthorized";
        else if (state === "offline") type = "offline";
        else if (state === "device") type = "adb";
        else continue;
        const info = { type, serial, connectedAt: Date.now() };
        if (type === "adb") await this.fillAdbProps(info, adb);
        return info;
      }
    } catch {
    }
    return null;
  }
  async fillAdbProps(info, adbPath2) {
    try {
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
      const result = await spawnTool(adbPath2, ["shell", "getprop"]);
      const map = {};
      for (const line of result.stdout.split("\n")) {
        const m = line.match(/^\[([^\]]+)\]:\s*\[([^\]]*)\]/);
        if (m) map[m[1]] = m[2];
      }
      if (!map["ro.product.innermodel"] && !map["ro.product.model"]) {
        for (const p of props) {
          try {
            const fb = await spawnTool(adbPath2, ["shell", "getprop", p]);
            const val = fb.stdout.trim();
            if (val) map[p] = val;
          } catch {
          }
        }
      }
      info.innermodel = map["ro.product.innermodel"] || void 0;
      info.model = map["ro.product.model"] || void 0;
      info.androidVersion = map["ro.build.version.release"] || void 0;
      info.sdkVersion = map["ro.build.version.sdk"] || void 0;
      info.softVersion = map["ro.product.current.softversion"] || void 0;
      info.cpuAbi = map["ro.product.cpu.abi"] || void 0;
      info.density = map["ro.sf.lcd_density"] || void 0;
      info.buildId = map["ro.build.id"] || void 0;
      info.buildDate = map["ro.build.date"] || void 0;
      if (info.innermodel && info.softVersion) {
        info.isV3 = checkIsV3(info.innermodel, info.softVersion);
        info.innermodelName = MODEL_MAP[info.innermodel]?.model;
        info.platform = MODEL_MAP[info.innermodel]?.platform || void 0;
      }
    } catch {
    }
    try {
      const batResult = await spawnTool(adbPath2, ["shell", "dumpsys", "battery"]);
      const levelMatch = batResult.stdout.match(/level:\s*(\d+)/i);
      if (levelMatch) info.batteryLevel = parseInt(levelMatch[1], 10);
    } catch {
    }
    try {
      const dfResult = await spawnTool(adbPath2, ["shell", "df", "/sdcard"]);
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
  async detectFastboot() {
    const fb = resolveTool("fastboot");
    if (!fb) return null;
    try {
      const result = await spawnTool(fb, ["devices"]);
      for (const line of result.stdout.split("\n").map((l) => l.trim()).filter(Boolean)) {
        const m = line.match(/^(\S+)\s+fastboot/);
        if (m) return { type: "fastboot", serial: m[1], connectedAt: Date.now() };
      }
    } catch {
    }
    return null;
  }
  async detectEdl() {
    const lsusb = resolveTool("lsusb");
    if (!lsusb) return null;
    try {
      const result = await spawnTool(lsusb, []);
      for (const line of result.stdout.split("\n")) {
        if (line.includes("Qualcomm HS-USB QDLoader 9008")) {
          const portMatch = line.match(/COM(\d+)/i);
          const port = portMatch ? `COM${portMatch[1]}` : void 0;
          return { type: "qcom_edl", serial: "9008", port, connectedAt: Date.now() };
        }
      }
    } catch {
    }
    return null;
  }
  update(info) {
    const key = info ? `${info.type}:${info.serial}:${info.port ?? ""}` : "none";
    if (key === this.lastNotify) return;
    this.lastNotify = key;
    this.currentInfo = info;
    for (const cb of this.listeners) {
      try {
        cb(info);
      } catch {
      }
    }
    for (const w of electron.BrowserWindow.getAllWindows()) {
      if (!w.isDestroyed()) {
        w.webContents.send("device:change", info);
      }
    }
  }
}
function wrap(handler, options = {}) {
  return async (event, args) => {
    try {
      if (options.needDevice) {
        const device = DeviceService.instance.getCurrentDevice();
        if (!device) {
          throw new Error("No device connected");
        }
        if (options.deviceTypes && !options.deviceTypes.includes(device.type)) {
          throw new Error(`Device type ${device.type} not supported for this operation`);
        }
      }
      return await handler(event, args);
    } catch (err) {
      return { error: err.message || "Unknown error" };
    }
  };
}
class SpawnError extends Error {
  constructor(msg, code, stdout, stderr, duration, _cancelled, killed) {
    super(msg);
    this.exitCode = code;
    this.stdout = stdout;
    this.stderr = stderr;
    this.duration = duration;
    this.killed = killed;
    this.name = "SpawnError";
  }
}
function decode(chunk, encoding) {
  if (encoding === "gbk") {
    try {
      return iconv__namespace.decode(chunk, "GBK");
    } catch {
    }
  }
  return chunk.toString("utf-8");
}
class SubprocessPoolClass {
  constructor() {
    this.tasks = /* @__PURE__ */ new Map();
    this.bus = new node_events.EventEmitter();
  }
  async spawn(opts) {
    const { cmd, args, cwd, timeout = 0, encoding = "gbk", taskId, env } = opts;
    const captureStdout = opts.captureStdout !== false;
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(cmd, args, {
        cwd,
        env: { ...process.env, ...env },
        windowsHide: true,
        shell: false
      });
      if (taskId) this.tasks.set(taskId, { taskId, cmd, args, startedAt: start, process: proc });
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
        try {
          stdoutStr += decode(chunk, encoding);
        } catch {
          stdoutStr += chunk.toString("utf-8");
        }
      });
      proc.stderr?.on("data", (chunk) => {
        if (captureStdout) stderrChunks.push(chunk);
        stderrBuf = processLine(stderrBuf, chunk, opts.onStderr);
        try {
          stderrStr += decode(chunk, encoding);
        } catch {
          stderrStr += chunk.toString("utf-8");
        }
      });
      if (timeout > 0) {
        timeoutHandle = setTimeout(() => {
          killed = true;
          proc.kill("SIGTERM");
          setTimeout(() => {
            if (!proc.killed) proc.kill("SIGKILL");
          }, 5e3);
        }, timeout);
      }
      proc.on("error", (err) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (taskId) this.tasks.delete(taskId);
        reject(new SpawnError(`启动失败: ${err.message}`, -1, "", "", 0, false, killed));
      });
      proc.on("close", (code) => {
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
          signal: void 0,
          killed
        };
        if (code === 0 && !killed) resolve(result);
        else if (killed) reject(new SpawnError(`进程被 kill: ${cmd}`, code ?? -1, result.stdout, result.stderr, duration, false, true));
        else reject(new SpawnError(`退出码 ${code}: ${cmd} ${args.join(" ")}`, code ?? -1, result.stdout, result.stderr, duration, false, false));
      });
    });
  }
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
  kill(taskId, signal = "SIGTERM") {
    const task = this.tasks.get(taskId);
    if (!task) return false;
    return task.process.kill(signal);
  }
  list() {
    return Array.from(this.tasks.values());
  }
  onLine(cb) {
    this.bus.on("line", cb);
    return () => this.bus.off("line", cb);
  }
}
const subprocessPool = new SubprocessPoolClass();
const ADB_TIMEOUT = 3e4;
function adbPath() {
  const isWin = process.platform === "win32";
  const p = path.join(paths.bin, isWin ? "adb.exe" : "adb");
  try {
    fs.accessSync(p);
    return p;
  } catch {
    return "adb";
  }
}
class AdbService {
  async spawn(args, opts) {
    return subprocessPool.spawn({
      cmd: adbPath(),
      args,
      cwd: opts?.cwd,
      timeout: opts?.timeout ?? ADB_TIMEOUT,
      silent: opts?.silent,
      encoding: "gbk"
    });
  }
  withSerial(serial, args) {
    return serial ? ["-s", serial, ...args] : args;
  }
  async devices() {
    try {
      const r = await this.spawn(["devices"], { silent: true });
      const list = [];
      for (const line of r.stdout.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || /^List of devices/i.test(trimmed)) continue;
        const m = trimmed.match(/^(\S+)\s+(\S+)/);
        if (m) list.push({ serial: m[1], state: m[2] });
      }
      return list;
    } catch {
      return [];
    }
  }
  async shell(serial, cmd) {
    const r = await this.spawn(this.withSerial(serial, ["shell", cmd]));
    return r.stdout;
  }
  async shellWithCode(serial, cmd) {
    try {
      const r = await this.spawn(this.withSerial(serial, ["shell", cmd]));
      return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode };
    } catch (e) {
      if (e instanceof SpawnError) {
        return { stdout: e.stdout, stderr: e.stderr, exitCode: e.exitCode };
      }
      throw e;
    }
  }
  async execOut(serial, cmd) {
    const r = await this.spawn(this.withSerial(serial, ["exec-out", cmd]));
    return r.stdout;
  }
  async push(serial, local, remote) {
    const r = await this.spawn(this.withSerial(serial, ["push", local, remote]));
    return r.stdout;
  }
  async pull(serial, remote, local) {
    const r = await this.spawn(this.withSerial(serial, ["pull", remote, local]));
    return r.stdout;
  }
  async install(serial, apk) {
    try {
      const r = await this.spawn(this.withSerial(serial, ["install", "-r", "-t", "-d", apk]), { timeout: 18e4 });
      const output = `${r.stdout}
${r.stderr}`.trim();
      const success = /\bSuccess\b/i.test(output);
      return { success, output, error: success ? void 0 : output || "安装失败" };
    } catch (e) {
      if (e instanceof SpawnError) {
        const output = `${e.stdout}
${e.stderr}`.trim();
        return { success: false, output, error: output || e.message };
      }
      return { success: false, output: "", error: e.message };
    }
  }
  async uninstall(serial, pkg) {
    const r = await this.spawn(this.withSerial(serial, ["uninstall", pkg]));
    return r.stdout;
  }
  async reboot(serial, mode = "") {
    const args = ["reboot"];
    if (mode) args.push(mode);
    await this.spawn(this.withSerial(serial, args));
  }
  async root(serial) {
    try {
      const r = await this.spawn(this.withSerial(serial, ["root"]), { timeout: 15e3 });
      const output = `${r.stdout}
${r.stderr}`.trim();
      const granted = /restarting|already running as root|adbd is already running as root/i.test(output);
      return { granted, output };
    } catch (e) {
      const output = e instanceof SpawnError ? `${e.stdout}
${e.stderr}`.trim() : e.message;
      return { granted: /restarting|already running as root/i.test(output), output };
    }
  }
  async waitForBoot(timeout = 12e4) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const out = await this.shell("", "getprop sys.boot_completed");
        if (out.trim() === "1") return true;
      } catch {
      }
      await new Promise((r) => setTimeout(r, 1e3));
    }
    throw new Error("等待设备开机超时");
  }
  async getProp(serial, key) {
    try {
      const r = await this.spawn(this.withSerial(serial, ["shell", "getprop", key]), { silent: true });
      return r.stdout.trim();
    } catch {
      return "";
    }
  }
  async forward(serial, local, remote) {
    const r = await this.spawn(this.withSerial(serial, ["forward", local, remote]));
    return r.stdout;
  }
  async tcpip(serial, port = 5555) {
    const r = await this.spawn(this.withSerial(serial, ["tcpip", String(port)]));
    return r.stdout;
  }
  async connect(host, port = 5555) {
    const r = await this.spawn(["connect", `${host}:${port}`], { timeout: 15e3 });
    return r.stdout;
  }
  async disconnect(host, port = 5555) {
    const r = await this.spawn(["disconnect", `${host}:${port}`], { timeout: 15e3 });
    return r.stdout;
  }
  async pair(host, port, code) {
    const r = await this.spawn(["pair", `${host}:${port}`, code], { timeout: 3e4 });
    return r.stdout;
  }
  async listPackages(serial, thirdPartyOnly = false) {
    const out = await this.shell(serial, `pm list packages${thirdPartyOnly ? " -3" : ""}`);
    return out.split("\n").map((line) => line.trim().replace(/^package:/, "")).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }
  async packageInfo(serial, pkg) {
    const out = await this.shell(serial, `dumpsys package ${pkg}`);
    const versionName = out.match(/versionName=([^\s]+)/)?.[1] ?? "";
    const versionCode = out.match(/versionCode=(\d+)/)?.[1] ?? "";
    const label = out.match(/applicationLabel=([^\n]+)/)?.[1]?.trim() ?? "";
    return { packageName: pkg, versionName, versionCode, label };
  }
}
const adbService = new AdbService();
const logger$h = {
  info: (...args) => console.log("[AppService]", ...args),
  warn: (...args) => console.warn("[AppService]", ...args),
  error: (...args) => console.error("[AppService]", ...args)
};
const DEFAULT_AUTOSTART_PACKAGES = [
  "com.tencent.qqlite",
  "com.tencent.qqwatch",
  "com.tencent.wechatkids"
];
class AppServiceClass {
  async unlockZ10Install() {
    const steps = [
      { name: "检查 ADB 设备", status: "pending", message: "" },
      { name: "推送 switch.db 到 /sdcard/", status: "pending", message: "" },
      { name: "adb root", status: "pending", message: "" },
      { name: "等待 3 秒", status: "pending", message: "" },
      { name: "setprop persist.sys.xtc.adb_port 1", status: "pending", message: "" },
      { name: "setprop persist.sys.adb.install 1", status: "pending", message: "" },
      { name: "替换桌面 switch.db", status: "pending", message: "" },
      { name: "重启 zygote", status: "pending", message: "" },
      { name: "安装 z10apk.Apk", status: "pending", message: "" },
      { name: "安装 z10apk1.Apk", status: "pending", message: "" }
    ];
    const runStep = async (index, fn) => {
      steps[index].status = "running";
      try {
        await fn();
        steps[index].status = "success";
        return true;
      } catch (e) {
        steps[index].status = "failed";
        steps[index].message = e.message;
        return false;
      }
    };
    let ok = await runStep(0, async () => {
      const devices = await adbService.devices();
      if (!devices.some((d) => d.state === "device")) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) return { success: false, steps, error: steps[0].message };
    const switchDbPath = path.join(paths.bin, "switch.db");
    if (!fs.existsSync(switchDbPath)) {
      steps[1].status = "failed";
      steps[1].message = `缺少文件: ${switchDbPath}`;
      return { success: false, steps, error: steps[1].message };
    }
    ok = await runStep(1, async () => {
      await adbService.push("", switchDbPath, "/sdcard/");
    });
    if (!ok) return { success: false, steps, error: steps[1].message };
    ok = await runStep(2, async () => {
      const result = await adbService.root("");
      if (!result.granted) {
        throw new Error("获取 root 权限失败，可能没有降级或不在 QMMI");
      }
    });
    if (!ok) return { success: false, steps, error: steps[2].message };
    await runStep(3, async () => {
      await new Promise((resolve) => setTimeout(resolve, 3e3));
    });
    ok = await runStep(4, async () => {
      await adbService.shell("", "setprop persist.sys.xtc.adb_port 1");
    });
    if (!ok) return { success: false, steps, error: steps[4].message };
    ok = await runStep(5, async () => {
      await adbService.shell("", "setprop persist.sys.adb.install 1");
    });
    if (!ok) return { success: false, steps, error: steps[5].message };
    ok = await runStep(6, async () => {
      await adbService.shell("", "cp -R /sdcard/switch.db /data/data/com.xtc.i3launcher/databases/switch.db");
    });
    if (!ok) return { success: false, steps, error: steps[6].message };
    ok = await runStep(7, async () => {
      await adbService.shell("", "setprop ctl.restart zygote");
      await new Promise((resolve) => setTimeout(resolve, 8e3));
    });
    if (!ok) return { success: false, steps, error: steps[7].message };
    const apks = ["z10apk.Apk", "z10apk1.Apk"];
    for (let i = 0; i < apks.length; i++) {
      const apkPath = path.join(paths.resources, "apks", apks[i]);
      ok = await runStep(8 + i, async () => {
        if (!fs.existsSync(apkPath)) {
          throw new Error(`缺少资源: ${apkPath}，请先下载 apks 资源`);
        }
        const result = await adbService.install("", apkPath);
        if (!result.success) throw new Error(result.error ?? "安装失败");
      });
      if (!ok) return { success: false, steps, error: steps[8 + i].message };
    }
    logger$h.info("Z10 安装限制解除完成");
    return { success: true, steps };
  }
  async enableAutoStart(packages = DEFAULT_AUTOSTART_PACKAGES, enabled = true) {
    const results = [];
    for (const pkg of packages) {
      try {
        await adbService.shell(
          "",
          `content call --uri content://com.xtc.launcher.self.start --method METHOD_SELF_START --extra EXTRA_ENABLE:b:${enabled} --arg ${pkg}`
        );
        results.push({ pkg, success: true });
      } catch (e) {
        results.push({ pkg, success: false, error: e.message });
      }
    }
    const success = results.every((r) => r.success);
    logger$h.info(`开机自启${enabled ? "设置" : "取消"}完成: ${results.filter((r) => r.success).length}/${results.length}`);
    return { success, results };
  }
  async installApk(serial, apkPath) {
    if (!fs.existsSync(apkPath)) {
      return { success: false, error: `APK 不存在: ${apkPath}` };
    }
    const result = await adbService.install(serial, apkPath);
    if (result.success) logger$h.info(`安装成功: ${apkPath}`);
    else logger$h.warn(`安装失败: ${apkPath} - ${result.error}`);
    return result;
  }
  async uninstallApk(serial, packageName, keepData = false) {
    const cmd = `pm uninstall${keepData ? " -k" : ""} ${packageName}`;
    const output = await adbService.shell(serial, cmd);
    const success = /\bSuccess\b/i.test(output);
    return { success, output, error: success ? void 0 : output.trim() || "卸载失败" };
  }
}
const appService = new AppServiceClass();
function registerAppIpc() {
  electron.ipcMain.handle("app:list", wrap(async (_event, { serial }) => {
    const packages = await adbService.listPackages(serial, true);
    const result = [];
    for (const pkg of packages) {
      try {
        const info = await adbService.packageInfo(serial, pkg);
        result.push({
          package: pkg,
          name: info.label || pkg,
          version: info.versionName || info.versionCode || "",
          system: false
        });
      } catch {
        result.push({ package: pkg, name: pkg, version: "", system: false });
      }
    }
    return result;
  }));
  electron.ipcMain.handle("app:list-all", wrap(async (_event, { serial }) => {
    const packages = await adbService.listPackages(serial, false);
    return packages.map((pkg) => ({ package: pkg, name: pkg, version: "", system: true }));
  }));
  electron.ipcMain.handle("app:install", wrap(async (_event, { serial, apkPath }) => {
    return appService.installApk(serial, apkPath);
  }));
  electron.ipcMain.handle("app:uninstall", wrap(async (_event, { serial, packageName, keepData }) => {
    return appService.uninstallApk(serial, packageName, keepData);
  }));
  electron.ipcMain.handle("app:launch", wrap(async (_event, { serial, packageName }) => {
    const out = await adbService.shell(serial, `monkey -p ${packageName} -c android.intent.category.LAUNCHER 1`);
    if (/No activities found|aborted/i.test(out)) {
      throw new Error(`无法启动 ${packageName}: ${out.trim()}`);
    }
    return out;
  }));
  electron.ipcMain.handle("app:force-stop", wrap(async (_event, { serial, packageName }) => {
    return adbService.shell(serial, `am force-stop ${packageName}`);
  }));
  electron.ipcMain.handle("app:clear-data", wrap(async (_event, { serial, packageName }) => {
    return adbService.shell(serial, `pm clear ${packageName}`);
  }));
  electron.ipcMain.handle("app:unlock-z10", wrap(async () => {
    return appService.unlockZ10Install();
  }));
  electron.ipcMain.handle("app:enable-autostart", wrap(async (_event, { packageName, enabled }) => {
    return appService.enableAutoStart([packageName], enabled);
  }));
  electron.ipcMain.handle("app:default-autostart", wrap(async (_event, { enabled }) => {
    return appService.enableAutoStart(void 0, enabled);
  }));
}
const logger$g = {
  info: (...args) => console.log("[MagiskService]", ...args),
  warn: (...args) => console.warn("[MagiskService]", ...args),
  error: (...args) => console.error("[MagiskService]", ...args)
};
const TIMEOUT$7 = {
  fileOp: 15e3,
  install: 12e4
};
class MagiskServiceClass {
  escapeModuleId(id) {
    return id.replace(/[^a-zA-Z0-9_\-.]/g, "_");
  }
  async list() {
    const rootResult = await adbService.root("");
    if (!rootResult.granted) {
      throw new Error("没有 root 权限");
    }
    const scriptPath = path.join(paths.scripts, "list_modules.sh");
    await adbService.push("", scriptPath, "/data/local/tmp/list_modules.sh");
    const output = await adbService.shell("", "sh /data/local/tmp/list_modules.sh");
    return this.parseModuleList(output);
  }
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
  async install(zipPath, method) {
    const rootResult = await adbService.root("");
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
    return { success: false, error: "未知安装方式" };
  }
  async installMagisk(zipPath) {
    try {
      await adbService.push("", zipPath, "/sdcard/temp_module.zip");
      await adbService.shell("", "magisk --install-module /sdcard/temp_module.zip");
      await adbService.shell("", "rm /sdcard/temp_module.zip");
      logger$g.info("模块安装成功(magisk): " + zipPath);
      return { success: true };
    } catch (e) {
      try {
        await adbService.shell("", "rm /sdcard/temp_module.zip");
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  async installShinst(zipPath) {
    try {
      await adbService.push("", zipPath, "/sdcard/temp_module.zip");
      const scriptPath = path.join(paths.scripts, "module_installer.sh");
      await adbService.push("", scriptPath, "/sdcard/module_installer.sh");
      await adbService.shell("", "sh /sdcard/module_installer.sh");
      await adbService.shell("", "rm /sdcard/temp_module.zip /sdcard/module_installer.sh");
      logger$g.info("模块安装成功(shinst): " + zipPath);
      return { success: true };
    } catch (e) {
      try {
        await adbService.shell("", "rm /sdcard/temp_module.zip /sdcard/module_installer.sh");
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  async installPeremptory(zipPath) {
    try {
      const scriptPath = path.join(paths.scripts, "magisk_force_install.sh");
      await adbService.push("", scriptPath, "/sdcard/magisk_force_install.sh");
      await adbService.push("", zipPath, "/sdcard/temp_module.zip");
      await adbService.shell("", "sh /sdcard/magisk_force_install.sh");
      await adbService.shell("", "rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh");
      logger$g.info("模块安装成功(peremptory): " + zipPath);
      return { success: true };
    } catch (e) {
      try {
        await adbService.shell("", "rm /sdcard/temp_module.zip /sdcard/magisk_force_install.sh");
      } catch {
      }
      return { success: false, error: e.message };
    }
  }
  async uninstall(moduleId, method) {
    const rootResult = await adbService.root("");
    if (!rootResult.granted) {
      return { success: false, error: "没有 root 权限" };
    }
    const safeId = this.escapeModuleId(moduleId);
    const existsCheck = await adbService.shell("", `[ -d /data/adb/modules/${safeId} ] && echo EXISTS`);
    if (!existsCheck.includes("EXISTS")) {
      return { success: false, error: "模块不存在: " + moduleId };
    }
    switch (method) {
      case "mark":
        return this.uninstallMark(moduleId);
      case "direct":
        return this.uninstallDirect(moduleId);
      case "script":
        return this.uninstallScript(moduleId);
    }
    return { success: false, error: "未知卸载方式" };
  }
  async uninstallMark(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell("", `touch /data/adb/modules/${safeId}/remove`);
      const check = await adbService.shell("", `[ -f /data/adb/modules/${safeId}/remove ] && echo OK`);
      if (!check.includes("OK")) {
        return { success: false, error: "创建标记卸载文件失败" };
      }
      logger$g.info("模块标记卸载成功: " + moduleId);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  async uninstallDirect(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell("", `touch /data/adb/modules/${safeId}/disable && sleep 1 && rm -rf /data/adb/modules/${safeId}`);
      const check = await adbService.shell("", `[ ! -d /data/adb/modules/${safeId} ] && echo OK`);
      if (!check.includes("OK")) {
        return { success: false, error: "删除模块目录失败" };
      }
      logger$g.info("模块直接卸载成功: " + moduleId);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  async uninstallScript(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell("", `if [ -f /data/adb/modules/${safeId}/uninstall.sh ]; then sh /data/adb/modules/${safeId}/uninstall.sh; else echo NO_SCRIPT; fi; rm -rf /data/adb/modules/${safeId}`);
      const check = await adbService.shell("", `[ ! -d /data/adb/modules/${safeId} ] && echo OK`);
      if (!check.includes("OK")) {
        return { success: false, error: "删除模块目录失败" };
      }
      logger$g.info("模块脚本卸载成功: " + moduleId);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  async enable(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell("", `rm /data/adb/modules/${safeId}/disable`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  async disable(moduleId) {
    try {
      const safeId = this.escapeModuleId(moduleId);
      await adbService.shell("", `touch /data/adb/modules/${safeId}/disable`);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  async storeSearch(query) {
    if (!query || !query.trim()) {
      return [];
    }
    const url = "https://api.magiskmodule.com/v1/modules?search=" + encodeURIComponent(query);
    logger$g.info("搜索 Magisk 模块: " + query);
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
      logger$g.warn("模块商店搜索失败,返回空列表: " + e.message);
      return [];
    }
  }
  async installFromStore(module2) {
    if (!module2.downloadUrl) {
      return { success: false, error: "模块缺少下载地址" };
    }
    try {
      if (!fs.existsSync(paths.cache)) {
        fs.mkdirSync(paths.cache, { recursive: true });
      }
      const filename = (module2.id || "store_module") + "_" + Date.now() + ".zip";
      const localPath = path.join(paths.cache, filename);
      logger$g.info("下载商店模块: " + module2.downloadUrl + " → " + localPath);
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
  httpsGetJson(url) {
    return new Promise((resolve, reject) => {
      const req = https.get(url, {
        headers: { "User-Agent": "iMooAgentTool/1.1.1" },
        timeout: TIMEOUT$7.fileOp
      }, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          reject(new Error("HTTP " + res.statusCode));
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
            reject(new Error("JSON 解析失败: " + e.message));
          }
        });
      });
      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy(new Error("请求超时"));
      });
    });
  }
  httpsDownload(url, destPath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destPath);
      const req = https.get(url, {
        headers: { "User-Agent": "iMooAgentTool/1.1.1" },
        timeout: TIMEOUT$7.install
      }, (res) => {
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
          reject(new Error("下载失败: HTTP " + res.statusCode));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve());
        });
      });
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
const magiskService = new MagiskServiceClass();
const logger$f = {
  info: (...args) => console.log("[BackupService]", ...args),
  warn: (...args) => console.warn("[BackupService]", ...args),
  error: (...args) => console.error("[BackupService]", ...args)
};
const TIMEOUT$6 = {
  shell: 1e4,
  shellLong: 3e4,
  install: 12e4,
  backup: 6e5,
  device: 5e3,
  flash: 6e4,
  transfer: 3e5
};
class BackupServiceClass {
  constructor() {
    this.adbPath = process.platform === "win32" ? path.join(paths.bin, "adb.exe") : "adb";
    this.sevenZipPath = path.join(paths.bin, "7z.exe");
  }
  async backupDcim(outputDir, onProgress) {
    try {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      onProgress?.("正在备份相册...");
      await adbService.pull("", "/storage/emulated/0/DCIM", outputDir);
      onProgress?.("备份成功");
      logger$f.info("DCIM 备份成功: " + outputDir);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("备份失败");
      logger$f.error("DCIM 备份失败: " + msg);
      return { success: false, error: msg };
    }
  }
  async recoverDcim(inputDir, onProgress) {
    try {
      onProgress?.("正在恢复相册...");
      const dcimPath = path.join(inputDir, "DCIM");
      if (!fs.existsSync(dcimPath)) {
        return { success: false, error: "所选文件夹中没有 DCIM 子目录: " + dcimPath };
      }
      await adbService.push("", dcimPath, "/storage/emulated/0/");
      onProgress?.("恢复成功");
      logger$f.info("DCIM 恢复成功: " + inputDir);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("恢复失败");
      logger$f.error("DCIM 恢复失败: " + msg);
      return { success: false, error: msg };
    }
  }
  async backupAdbDd(outputDir, onProgress) {
    try {
      const now = /* @__PURE__ */ new Date();
      const d = "" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");
      const t = String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
      const backupName = "ADB_" + d + "_" + t;
      const backupDir = path.join(outputDir, backupName);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      onProgress?.("等待设备连接...");
      onProgress?.("检查 root 权限...");
      const rootResult = await adbService.root("");
      if (!rootResult.granted) {
        return { success: false, error: "没有 root 权限,请尝试进入 twrp/qmmi" };
      }
      onProgress?.("正在获取分区列表...");
      const listOutput = await adbService.shell("", "ls /dev/block/bootdevice/by-name/");
      const partitions = listOutput.split(/\s+/).map((s) => s.trim()).filter(Boolean);
      if (partitions.length === 0) {
        return { success: false, error: "无法获取分区列表,请检查 root 权限或设备支持" };
      }
      const failedParts = [];
      onProgress?.("开始备份分区(共 " + partitions.length + " 个)...");
      for (const part of partitions) {
        if (part.toLowerCase() === "userdata") {
          onProgress?.("跳过 userdata");
          continue;
        }
        onProgress?.("正在备份分区: " + part);
        const imgFile = path.join(backupDir, part + ".img");
        try {
          await this.adbExecOutToFile("su -c 'dd if=/dev/block/bootdevice/by-name/" + part + " bs=4096 2>/dev/null'", imgFile);
          onProgress?.("备份 " + part + " 已完成");
        } catch (e) {
          logger$f.warn("分区 " + part + " 备份可能失败: " + e.message);
          failedParts.push(part);
        }
      }
      onProgress?.("正在校验备份文件完整性...");
      await this.verifyBackupMd5(backupDir, failedParts, onProgress);
      if (failedParts.length > 0) {
        onProgress?.("备份失败的分区: " + failedParts.join(" "));
      }
      onProgress?.("压缩备份文件...");
      const zipPath = path.join(outputDir, backupName + ".zip");
      await subprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ["a", "-tzip", "-y", zipPath, backupDir + path.sep],
        encoding: "utf-8",
        timeout: TIMEOUT$6.backup,
        cwd: paths.bin,
        onStdout: (line) => onProgress?.(line)
      });
      try {
        fs.rmSync(backupDir, { recursive: true, force: true });
      } catch {
      }
      onProgress?.("备份完成: " + zipPath);
      logger$f.info("ADB-dd 备份成功: " + zipPath);
      return { success: true, zipPath };
    } catch (e) {
      const msg = e.message;
      onProgress?.("备份失败: " + msg);
      logger$f.error("ADB-dd 备份失败: " + msg);
      return { success: false, error: msg };
    }
  }
  async verifyBackupMd5(backupDir, failedParts, onProgress) {
    let entries = [];
    try {
      entries = fs.readdirSync(backupDir).filter((f) => f.endsWith(".img"));
    } catch {
      return;
    }
    for (const file of entries) {
      const part = path.basename(file, ".img");
      onProgress?.("正在校验 " + part + "...");
      try {
        const remoteOut = await adbService.shell("", "md5sum /dev/block/bootdevice/by-name/" + part + " 2>/dev/null");
        const remoteHash = remoteOut.trim().split(/\s+/)[0];
        if (!remoteHash) {
          onProgress?.("无法获取分区 " + part + " 的 MD5,跳过校验");
          continue;
        }
        const localHash = await this.busyboxMd5(path.join(backupDir, file));
        if (!localHash) {
          onProgress?.("无法计算本地文件 " + part + ".img 的 MD5,跳过校验");
          continue;
        }
        if (localHash.toLowerCase() !== remoteHash.toLowerCase()) {
          onProgress?.("分区 " + part + " 校验失败,删除不匹配文件");
          try {
            fs.unlinkSync(path.join(backupDir, file));
          } catch {
          }
          if (!failedParts.includes(part)) failedParts.push(part);
        } else {
          onProgress?.("分区 " + part + " 校验通过");
        }
      } catch (e) {
        logger$f.warn("校验 " + part + " 异常: " + e.message);
      }
    }
  }
  async prepareAdbDdRecover(zipPath, onProgress) {
    try {
      onProgress?.("解压备份文件...");
      const tmpDir = path.join(paths.resources, "backup", "tmp");
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
      fs.mkdirSync(tmpDir, { recursive: true });
      await subprocessPool.spawn({
        cmd: this.sevenZipPath,
        args: ["x", zipPath, "-o" + tmpDir, "-aoa"],
        encoding: "utf-8",
        timeout: TIMEOUT$6.install,
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
      const rootResult = await adbService.root("");
      if (!rootResult.granted) {
        return { success: false, error: "没有 root 权限,请尝试进入 twrp/qmmi" };
      }
      onProgress?.("正在获取设备分区表...");
      const partListOutput = await adbService.shell("", "ls /dev/block/bootdevice/by-name/");
      const deviceParts = new Set(partListOutput.split(/\s+/).map((s) => s.trim()).filter(Boolean));
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
      onProgress?.("匹配 " + matched.length + " 个分区,跳过 " + skipped.length + " 个");
      return { success: true, extractDir, match: { matched, skipped } };
    } catch (e) {
      const msg = e.message;
      onProgress?.("准备恢复失败: " + msg);
      logger$f.error("ADB-dd 恢复准备失败: " + msg);
      return { success: false, error: msg };
    }
  }
  async executeAdbDdRecover(extractDir, parts, onProgress) {
    const failedParts = [];
    try {
      for (const part of parts) {
        onProgress?.("恢复分区: " + part + " ...");
        const imgFile = path.join(extractDir, part + ".img");
        if (!fs.existsSync(imgFile)) {
          logger$f.warn("分区 " + part + " 的镜像不存在: " + imgFile + ",跳过");
          failedParts.push(part);
          continue;
        }
        try {
          await this.adbExecInFromFile("su -c 'dd of=/dev/block/bootdevice/by-name/" + part + " bs=4096 2>/dev/null'", imgFile);
          onProgress?.(part + " 恢复成功");
        } catch (e) {
          logger$f.warn("分区 " + part + " 写入可能失败: " + e.message);
          failedParts.push(part);
        }
      }
      try {
        fs.rmSync(extractDir, { recursive: true, force: true });
      } catch {
      }
      if (failedParts.length > 0) {
        onProgress?.("恢复流程结束,部分分区失败: " + failedParts.join(" "));
        return { success: false, error: "部分分区恢复失败: " + failedParts.join(" ") };
      }
      onProgress?.("恢复流程结束,建议重启设备");
      logger$f.info("ADB-dd 恢复完成");
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("恢复失败: " + msg);
      logger$f.error("ADB-dd 恢复失败: " + msg);
      return { success: false, error: msg };
    }
  }
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
  async autoFlashTwrp(innermodel, onProgress) {
    try {
      const twrpDir = path.join(paths.edl, "twrp");
      if (!fs.existsSync(twrpDir)) {
        return { success: false, error: 'TWRP 镜像未下载,请先在"资源下载"页下载 TWRP' };
      }
      const twrpImg = path.join(twrpDir, innermodel + ".img");
      if (!fs.existsSync(twrpImg)) {
        return { success: false, error: "TWRP 镜像不存在: " + innermodel + ".img" };
      }
      onProgress?.("拷贝文件到临时目录...");
      const workDir = path.join(paths.edl, "work");
      if (!fs.existsSync(workDir)) {
        fs.mkdirSync(workDir, { recursive: true });
      }
      const recoveryImg = path.join(workDir, "recovery.img");
      fs.copyFileSync(twrpImg, recoveryImg);
      onProgress?.("推送 recovery.img...");
      await adbService.push("", recoveryImg, "/sdcard/");
      onProgress?.("推送 auto_flash_recovery.sh...");
      const scriptPath = path.join(paths.scripts, "auto_flash_recovery.sh");
      if (!fs.existsSync(scriptPath)) {
        return { success: false, error: "脚本文件不存在: auto_flash_recovery.sh" };
      }
      await adbService.push("", scriptPath, "/sdcard/");
      onProgress?.("安装到 Magisk 服务目录...");
      await adbService.shell("", "cp /sdcard/recovery.img /data/rec.img");
      await adbService.shell("", "cp /sdcard/auto_flash_recovery.sh /data/adb/service.d/rec.sh");
      await adbService.shell("", "chmod 755 -R /data/adb/service.d/rec.sh");
      try {
        const workFiles = fs.readdirSync(workDir);
        for (const f of workFiles) {
          fs.unlinkSync(path.join(workDir, f));
        }
      } catch {
      }
      onProgress?.("刷入完成");
      logger$f.info("开机自刷 TWRP 完成: " + innermodel);
      return { success: true };
    } catch (e) {
      const msg = e.message;
      onProgress?.("刷入失败: " + msg);
      logger$f.error("开机自刷 TWRP 失败: " + msg);
      return { success: false, error: msg };
    }
  }
  async installXposed(onProgress) {
    try {
      onProgress?.("等待设备开机完成...");
      await adbService.waitForBoot(12e4);
      const androidVersion = await adbService.getProp("", "ro.build.version.release");
      onProgress?.("您的设备安卓版本为: " + androidVersion);
      const sdkVersion = (await adbService.getProp("", "ro.build.version.sdk")).trim();
      onProgress?.("SDK 版本号: " + sdkVersion);
      if (sdkVersion === "19") {
        return await this.installXposedSdk19(onProgress);
      }
      if (sdkVersion === "25") {
        return await this.installXposedSdk25(onProgress);
      }
      onProgress?.("不是安卓 4.4.4,也不是安卓 7.1.1,无法安装");
      return { success: false, error: "不支持的 SDK 版本: " + sdkVersion + "(仅支持 19/25)" };
    } catch (e) {
      const msg = e.message;
      onProgress?.("Xposed 安装失败: " + msg);
      logger$f.error("Xposed 安装失败: " + msg);
      return { success: false, error: msg };
    }
  }
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
      const r1 = await adbService.install(apk1, "install");
      if (!r1.success) {
        return { success: false, error: "安装 xpinstaller19.apk 失败" };
      }
      onProgress?.("安装 19xposed.zip 模块...");
      const zip1 = path.join(paths.cache, "19xposed.zip");
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/19xposed.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r2 = await magiskService.install(zip1, "shinst");
      if (!r2.success) {
        return { success: false, error: r2.error ?? "安装 19xposed.zip 失败" };
      }
      onProgress?.("重启手表...");
      await adbService.reboot("", "system");
      onProgress?.("Xposed 安装成功");
      logger$f.info("Xposed 安装成功(SDK=19)");
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
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
      const r1 = await adbService.install(apkToolkit, "install");
      if (!r1.success) {
        return { success: false, error: "安装 toolkit.apk 失败" };
      }
      onProgress?.("安装 xposed-magisk.apk...");
      const apkXp = path.join(paths.resources, "apks", "xposed-magisk.apk");
      if (!fs.existsSync(apkXp)) {
        return { success: false, error: 'apks/xposed-magisk.apk 不存在,请先在"资源下载"页下载 apks 资源' };
      }
      const r2 = await adbService.install(apkXp, "install");
      if (!r2.success) {
        return { success: false, error: "安装 xposed-magisk.apk 失败" };
      }
      onProgress?.("安装 xposed-magisk-1.zip 模块...");
      const zip1 = path.join(paths.cache, "xposed-magisk-1.zip");
      if (!fs.existsSync(zip1)) {
        return { success: false, error: 'tmp/xposed-magisk-1.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r3 = await magiskService.install(zip1, "shinst");
      if (!r3.success) {
        return { success: false, error: r3.error ?? "安装 xposed-magisk-1.zip 失败" };
      }
      onProgress?.("重启手表(首次刷入 xp 可能需要 7-15 分钟开机时间,请耐心等待)...");
      await adbService.reboot("", "system");
      onProgress?.("等待设备重新开机完成...");
      await adbService.waitForBoot(9e5);
      await new Promise((r) => setTimeout(r, 1e4));
      onProgress?.("安装 xposed-magisk-2.zip 模块...");
      const zip2 = path.join(paths.cache, "xposed-magisk-2.zip");
      if (!fs.existsSync(zip2)) {
        return { success: false, error: 'tmp/xposed-magisk-2.zip 不存在,请先在"资源下载"页下载 xp 资源' };
      }
      const r4 = await magiskService.install(zip2, "shinst");
      if (!r4.success) {
        return { success: false, error: r4.error ?? "安装 xposed-magisk-2.zip 失败" };
      }
      onProgress?.("重启手表...");
      await adbService.reboot("", "system");
      onProgress?.("Xposed 安装成功");
      logger$f.info("Xposed 安装成功(SDK=25)");
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
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
      return { success: false, error: '缺少 apks 资源,请先在"资源下载"页下载 apks 资源' };
    }
    return { success: false, error: '缺少 xp 资源,请先在"资源下载"页下载 xp 资源(会自动解压到 cache/)' };
  }
  listImgFiles(dir) {
    try {
      return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".img")).map((f) => path.join(dir, f));
    } catch {
      return [];
    }
  }
  async busyboxMd5(filePath) {
    try {
      const result = await subprocessPool.spawn({
        cmd: path.join(paths.bin, "busybox.exe"),
        args: ["md5sum", filePath],
        encoding: "utf-8",
        timeout: TIMEOUT$6.install,
        cwd: paths.bin,
        silent: true
      });
      return result.stdout.trim().split(/\s+/)[0] || null;
    } catch {
      return null;
    }
  }
  adbExecOutToFile(shellCmd, outputFile) {
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(this.adbPath, ["exec-out", shellCmd], { cwd: paths.bin, windowsHide: true, shell: false });
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
        reject(new SpawnError("adb exec-out 启动失败: " + err.message, -1, "", stderr, 0, false, false));
      });
      proc.on("close", (code) => {
        try {
          out.close();
        } catch {
        }
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError("adb exec-out 退出码 " + code, code ?? -1, "", stderr, 0, false, false));
        }
      });
    });
  }
  adbExecInFromFile(shellCmd, inputFile) {
    return new Promise((resolve, reject) => {
      const proc = node_child_process.spawn(this.adbPath, ["exec-in", shellCmd], { cwd: paths.bin, windowsHide: true, shell: false });
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
        reject(new SpawnError("读取文件失败: " + err.message, -1, "", stderr, 0, false, false));
      });
      inp.pipe(proc.stdin);
      proc.on("error", (err) => {
        reject(new SpawnError("adb exec-in 启动失败: " + err.message, -1, "", stderr, 0, false, false));
      });
      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new SpawnError("adb exec-in 退出码 " + code, code ?? -1, "", stderr, 0, false, false));
        }
      });
    });
  }
}
const backupService = new BackupServiceClass();
const TIMEOUTS = {
  ADB_SHELL: 3e4,
  ADB_EXEC: 3e4,
  ADB_INSTALL: 12e4,
  ADB_UNINSTALL: 3e4,
  ADB_PUSH: 3e5,
  ADB_PULL: 3e5,
  ADB_REBOOT: 6e4,
  ADB_WAIT: 12e4,
  ADB_CONNECT: 15e3,
  ADB_ROOT: 3e4,
  ADB_REMOUNT: 3e4,
  ADB_GET_PROP: 1e4,
  ADB_SET_PROP: 15e3,
  FASTBOOT_DEVICES: 1e4,
  FASTBOOT_FLASH: 12e4,
  FASTBOOT_BOOT: 6e4,
  FASTBOOT_REBOOT: 3e4,
  FASTBOOT_GETVAR: 1e4,
  FASTBOOT_OEM: 3e4,
  EDL_LOAD_FIREHOSE: 3e4,
  EDL_FLASH: 3e5,
  EDL_READ: 3e5,
  EDL_REBOOT: 15e3,
  EDL_WAIT: 6e4,
  SCRCPY_LAUNCH: 1e4,
  SCRCPY_STOP: 1e4,
  ROOT_STAGE: 3e5,
  ROOT_TOTAL: 18e5,
  DEVICE_POLL_INTERVAL: 1e4,
  DEVICE_USB_DEBOUNCE: 800,
  DOWNLOAD_CHUNK: 3e5,
  MODULE_INSTALL: 12e4,
  BACKUP_DCIM: 6e5,
  BACKUP_EDL: 6e5,
  RECOVERY_EDL: 6e5,
  SUPER_RECOVERY: 6e5,
  SEVEN_ZIP: 12e4,
  PING: 5e3,
  DEFAULT: 3e4
};
function decodeGbk(buffer) {
  return iconv.decode(buffer, "gbk");
}
const SRC$2 = "EdlService";
class EdlService {
  async loadFirehose(progPath, port) {
    if (!fs.existsSync(progPath)) throw new Error("Firehose loader 不存在: " + progPath);
    const qsahara = paths.qsahara();
    const args = ["--tool=2", "--port=" + port, "--sahara=" + progPath];
    logger$i.info(SRC$2, `Loading firehose on ${port}`);
    try {
      for await (const _line of subprocessPool.spawnStreaming({
        cmd: qsahara,
        args,
        timeout: TIMEOUTS.EDL_LOAD_FIREHOSE
      })) {
      }
    } catch (err) {
      logger$i.error(SRC$2, `loadFirehose failed: ${err.message}`);
      throw err;
    }
  }
  async flashPartitions(xmlFiles, port, onProgress, imagesDir) {
    if (xmlFiles.length === 0) throw new Error("没有可刷写的 XML 文件");
    const fhLoader = paths.fhLoader();
    const searchDir = imagesDir || path.dirname(xmlFiles[0]);
    const args = [
      "--port=" + port,
      "--convertprogram2read=0",
      "--memoryname=emmc",
      "--resetafter=0",
      "--maxpayloadsizemb=2048",
      "--zlpawarehost=1",
      "--waitforprocesstimeout=5000",
      "--search_path=" + searchDir,
      ...xmlFiles.map((x) => "--sendxml=" + x),
      "--noprompt"
    ];
    logger$i.info(SRC$2, `Flashing partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_FLASH
      })) {
        onProgress?.(line);
      }
    } catch (err) {
      logger$i.error(SRC$2, `flashPartitions failed: ${err.message}`);
      throw err;
    }
  }
  async readPartitions(xmlFiles, port, onProgress, imagesDir) {
    if (xmlFiles.length === 0) throw new Error("没有可读取的 XML 文件");
    const fhLoader = paths.fhLoader();
    const searchDir = imagesDir || path.dirname(xmlFiles[0]);
    const args = [
      "--port=" + port,
      "--convertprogram2read=1",
      "--memoryname=emmc",
      "--resetafter=0",
      "--maxpayloadsizemb=2048",
      "--zlpawarehost=1",
      "--waitforprocesstimeout=5000",
      "--search_path=" + searchDir,
      ...xmlFiles.map((x) => "--sendxml=" + x),
      "--noprompt"
    ];
    logger$i.info(SRC$2, `Reading partitions on ${port}`);
    try {
      for await (const line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_READ
      })) {
        onProgress?.(line);
      }
    } catch (err) {
      logger$i.error(SRC$2, `readPartitions failed: ${err.message}`);
      throw err;
    }
  }
  async reboot(port) {
    const fhLoader = paths.fhLoader();
    const args = [
      "--port=" + port,
      "--convertprogram2read=0",
      "--memoryname=emmc",
      "--resetafter=1",
      "--maxpayloadsizemb=2048",
      "--zlpawarehost=1",
      "--waitforprocesstimeout=5000"
    ];
    try {
      for await (const _line of subprocessPool.spawnStreaming({
        cmd: fhLoader,
        args,
        timeout: TIMEOUTS.EDL_REBOOT
      })) {
      }
    } catch (err) {
      logger$i.error(SRC$2, `EDL reboot failed: ${err.message}`);
      throw err;
    }
  }
  findPort() {
    return new Promise((resolve) => {
      try {
        const proc = node_child_process.spawn("wmic", ["path", "Win32_PnPEntity", "get", "Name", "/format:list"], {
          windowsHide: true,
          stdio: ["ignore", "pipe", "pipe"]
        });
        let output = "";
        proc.stdout.on("data", (data) => {
          output += decodeGbk(data);
        });
        proc.on("close", () => {
          if (/QDLoader|Qualcomm|9008/i.test(output)) {
            const match = output.match(/COM(\d+)/);
            resolve(match ? `COM${match[1]}` : null);
          } else {
            resolve(null);
          }
        });
        proc.on("error", () => resolve(null));
      } catch {
        resolve(null);
      }
    });
  }
  async waitForEdl(timeout = TIMEOUTS.EDL_WAIT) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const port = await this.findPort();
      if (port) return port;
      await new Promise((r) => setTimeout(r, 1e3));
    }
    throw new Error("等待 EDL 设备超时");
  }
  async backup9008(xmlFiles, backupDir, port, onProgress) {
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
    await this.readPartitions(xmlFiles, port, onProgress);
    const sevenZip = paths.sevenZip();
    const archivePath = path.join(backupDir, `edl_backup_${Date.now()}.7z`);
    const args = ["a", "-t7z", "-mx=5", archivePath, ...xmlFiles.map((x) => path.dirname(x))];
    for await (const line of subprocessPool.spawnStreaming({
      cmd: sevenZip,
      args,
      timeout: TIMEOUTS.BACKUP_EDL
    })) {
      onProgress?.(line);
    }
    return archivePath;
  }
  async recover9008(archivePath, xmlFiles, port, onProgress) {
    const sevenZip = paths.sevenZip();
    const extractDir = path.dirname(xmlFiles[0]);
    for await (const line of subprocessPool.spawnStreaming({
      cmd: sevenZip,
      args: ["x", archivePath, "-o" + extractDir, "-y"],
      timeout: TIMEOUTS.RECOVERY_EDL
    })) {
      onProgress?.(line);
    }
    await this.flashPartitions(xmlFiles, port, onProgress);
  }
  async superRecovery(xmlSets, port, onProgress) {
    for (let i = 0; i < xmlSets.length; i++) {
      onProgress?.(`Super recovery stage ${i + 1}/${xmlSets.length}`);
      await this.flashPartitions(xmlSets[i], port, onProgress);
    }
  }
  async flashTwrp(twrpImg, port) {
    const xmlDir = path.dirname(twrpImg);
    const rawprogram = path.join(xmlDir, "rawprogram0.xml");
    const patch = path.join(xmlDir, "patch0.xml");
    const xmls = [];
    if (fs.existsSync(rawprogram)) xmls.push(rawprogram);
    if (fs.existsSync(patch)) xmls.push(patch);
    if (xmls.length === 0) throw new Error("TWRP 刷写缺少 rawprogram0.xml / patch0.xml");
    await this.loadFirehose(path.join(xmlDir, "prog_firehose_ddr.elf"), port);
    await this.flashPartitions(xmls, port, void 0, xmlDir);
  }
  async flashMisc(xmlPath, port) {
    if (!fs.existsSync(xmlPath)) throw new Error("misc XML 不存在: " + xmlPath);
    await this.loadFirehose(path.join(paths.edl, "prog_firehose_ddr.elf"), port);
    await this.flashPartitions([xmlPath], port, void 0, path.dirname(xmlPath));
  }
}
const edlService = new EdlService();
function broadcast(channel, payload) {
  for (const win of electron.BrowserWindow.getAllWindows()) {
    if (!win.isDestroyed()) win.webContents.send(channel, payload);
  }
}
function progress(stage, percent, message) {
  broadcast("backup:progress", { stage, percent, message });
}
function registerBackupIpc() {
  electron.ipcMain.handle(
    "backup:dcim-backup",
    wrap(async (_event, { outputDir }) => {
      return backupService.backupDcim(outputDir, (msg) => progress("DCIM 备份", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:dcim-recover",
    wrap(async (_event, { inputDir }) => {
      return backupService.recoverDcim(inputDir, (msg) => progress("DCIM 恢复", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:adbdd-backup",
    wrap(async (_event, { outputDir }) => {
      return backupService.backupAdbDd(outputDir, (msg) => progress("ADB-dd 备份", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:adbdd-recover",
    wrap(async (_event, { zipPath }) => {
      return backupService.recoverAdbDd(zipPath, (msg) => progress("ADB-dd 恢复", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:adbdd-prepare",
    wrap(async (_event, { zipPath }) => {
      const result = await backupService.prepareAdbDdRecover(zipPath, (msg) => progress("准备恢复", 30, msg));
      if (!result.success || !result.match) {
        return { matched: [], skipped: [], extractDir: result.extractDir, success: false, error: result.error };
      }
      return { ...result.match, extractDir: result.extractDir, success: true };
    })
  );
  electron.ipcMain.handle(
    "backup:adbdd-execute",
    wrap(async (_event, { extractDir, parts }) => {
      return backupService.executeAdbDdRecover(extractDir, parts, (msg) => progress("恢复分区", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:edl-backup",
    wrap(async (_event, { xmlFiles, backupDir, port }) => {
      if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
      return edlService.backup9008(xmlFiles, backupDir, port, (msg) => progress("EDL 备份", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:edl-recover",
    wrap(async (_event, { archivePath, xmlFiles, port }) => {
      return edlService.recover9008(archivePath, xmlFiles, port, (msg) => progress("EDL 恢复", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:super-recovery",
    wrap(async (_event, { xmlSets, port }) => {
      return edlService.superRecovery(xmlSets, port, (msg) => progress("Super Recovery", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:flash-twrp",
    wrap(async (_event, { innermodel }) => {
      return backupService.autoFlashTwrp(innermodel, (msg) => progress("刷入 TWRP", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:auto-flash-twrp",
    wrap(async (_event, { innermodel }) => {
      return backupService.autoFlashTwrp(innermodel, (msg) => progress("自动刷入 TWRP", 50, msg));
    })
  );
  electron.ipcMain.handle(
    "backup:xposed-install",
    wrap(async () => {
      return backupService.installXposed((msg) => progress("Xposed 安装", 50, msg));
    })
  );
}
const logger$e = {
  info: (...args) => console.log("[CloudService]", ...args),
  warn: (...args) => console.warn("[CloudService]", ...args),
  error: (...args) => console.error("[CloudService]", ...args),
  debug: (...args) => console.debug("[CloudService]", ...args)
};
const TIMEOUT$5 = {
  install: 12e4
};
class CloudServiceClass {
  constructor() {
    this.linksConfig = null;
  }
  loadConfig() {
    if (this.linksConfig) return this.linksConfig;
    try {
      const content = fs.readFileSync(path.join(paths.data, "links.json"), "utf-8");
      const config2 = JSON.parse(content);
      this.linksConfig = config2;
      return config2;
    } catch (e) {
      logger$e.error("加载 links.json 失败: " + e.message);
      return { mirrors: [], resources: {} };
    }
  }
  async list() {
    const config2 = this.loadConfig();
    return Object.entries(config2.resources).filter(([, r]) => r.category !== "版本" && r.category !== "工具箱").map(([name, r]) => ({
      name,
      ...r,
      localVersion: this.getLocalVersion(name)
    }));
  }
  async listByCategory() {
    const all = await this.list();
    const grouped = {};
    for (const r of all) {
      if (!grouped[r.category]) grouped[r.category] = [];
      grouped[r.category].push(r);
    }
    return grouped;
  }
  async download(name, onProgress) {
    const config2 = this.loadConfig();
    const res = config2.resources[name];
    if (!res) {
      throw new Error("未知资源: " + name);
    }
    const urls = config2.mirrors.map((m) => `${m}${res.filename}`);
    if (urls.length === 0) {
      throw new Error("无可用镜像");
    }
    const outputDir = res.extractTo ? path.join(paths.resources, res.extractTo) : paths.cache;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    logger$e.info("下载资源: " + name + " → " + outputDir + "/" + res.filename);
    const aria2cPath = path.join(paths.bin, "aria2c.exe");
    const args = [
      "--uri-selector=adaptive",
      "--console-log-level=notice",
      "--summary-interval=0",
      "--check-certificate=false",
      "--max-connection-per-server=8",
      "--split=8",
      "--continue=false",
      "--allow-overwrite=true",
      "--lowest-speed-limit=1M",
      "--user-agent=pan.baidu.com",
      "--dir=" + outputDir,
      "--out=" + res.filename,
      ...urls
    ];
    await subprocessPool.spawn({
      cmd: aria2cPath,
      args,
      encoding: "utf-8",
      timeout: TIMEOUT$5.install,
      cwd: paths.bin,
      onStdout: (line) => {
        const m = line.match(/\((\d+)%\)/);
        if (m && onProgress) onProgress(Number(m[1]));
      }
    });
    if (res.extract) {
      const zipPath = path.join(outputDir, res.filename);
      const extractTo = path.join(paths.resources, res.extractTo ?? "");
      if (!fs.existsSync(extractTo)) {
        fs.mkdirSync(extractTo, { recursive: true });
      }
      logger$e.info("解压: " + zipPath + " → " + extractTo);
      await subprocessPool.spawn({
        cmd: path.join(paths.bin, "7z.exe"),
        args: ["x", zipPath, "-o" + extractTo, "-aoa"],
        encoding: "utf-8",
        timeout: TIMEOUT$5.install,
        cwd: paths.bin,
        onStdout: (line) => logger$e.debug("7z: " + line)
      });
    }
    logger$e.info("资源 " + name + " 处理完成");
  }
  async downloadMultiple(names, onProgress) {
    for (const name of names) {
      await this.download(name, (p) => onProgress?.(name, p));
    }
  }
  getLocalVersion(name) {
    try {
      const content = fs.readFileSync(path.join(paths.data, "resversion.json"), "utf-8");
      const versions = JSON.parse(content);
      return versions[name];
    } catch {
      return void 0;
    }
  }
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
      const aria2cPath = path.join(paths.bin, "aria2c.exe");
      await subprocessPool.spawn({
        cmd: aria2cPath,
        args: [
          "--uri-selector=adaptive",
          "--console-log-level=notice",
          "--summary-interval=0",
          "--check-certificate=false",
          "--max-connection-per-server=8",
          "--split=8",
          "--continue=false",
          "--allow-overwrite=true",
          "--lowest-speed-limit=1M",
          "--user-agent=pan.baidu.com",
          "--dir=" + tmpDir,
          "--out=resversion.txt",
          ...urls
        ],
        encoding: "utf-8",
        timeout: TIMEOUT$5.install,
        cwd: paths.bin
      });
      const content = fs.readFileSync(path.join(tmpDir, "resversion.txt"), "utf-8");
      for (const line of content.split("\n")) {
        const m = line.match(/^(\S+?)=(.+)$/);
        if (m) {
          cloudVersions[m[1]] = m[2].trim();
        }
      }
    } catch (e) {
      logger$e.warn("拉取云端版本失败: " + e.message);
    }
    return local.map((r) => ({
      resource: { ...r, cloudVersion: cloudVersions[r.name] },
      updateAvailable: Boolean(cloudVersions[r.name] && cloudVersions[r.name] !== r.localVersion)
    }));
  }
}
const cloudService = new CloudServiceClass();
function registerCloudIpc() {
  electron.ipcMain.handle("cloud:list", wrap(async () => {
    return cloudService.list();
  }));
  electron.ipcMain.handle("cloud:list-by-category", wrap(async () => {
    return cloudService.listByCategory();
  }));
  electron.ipcMain.handle("cloud:download", wrap(async (_event, { name }) => {
    return cloudService.download(name);
  }));
  electron.ipcMain.handle("cloud:check-updates", wrap(async () => {
    return cloudService.checkUpdates();
  }));
}
function registerDeviceIpc() {
  electron.ipcMain.handle(
    "device:current",
    wrap(async () => {
      return DeviceService.instance.getCurrentDevice();
    })
  );
  electron.ipcMain.handle(
    "device:wait",
    wrap(async (_event, { types, timeout }) => {
      return DeviceService.instance.waitFor(types, timeout);
    })
  );
}
const logger$d = {
  info: (...args) => console.log("[EdlPartitionService]", ...args),
  warn: (...args) => console.warn("[EdlPartitionService]", ...args),
  error: (...args) => console.error("[EdlPartitionService]", ...args)
};
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
  constructor() {
    this.edlNgPath = path.join(paths.bin, "edl-ng", "edl-ng.exe");
    this.edlNgDir = path.join(paths.bin, "edl-ng");
    this.operationHistory = [];
    this.historyIdCounter = 0;
  }
  async printGpt(opts) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error("firehose loader 不存在: " + loader);
      }
      onProgress?.("正在读取 GPT 分区表...");
      const result = await this.spawnEdlNg(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "printgpt"], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = "printgpt 失败(退出码 " + result.exitCode + "): " + (result.stderr || result.stdout);
        this.recordOperation({ type: "printgpt", label: "-", success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, partitions: [], error: msg2 };
      }
      const partitions = this.parseGptOutput(result.stdout);
      const storage = this.parseStorageInfo(result.stdout);
      const msg = "读取成功,共 " + partitions.length + " 个分区";
      onProgress?.(msg);
      this.recordOperation({ type: "printgpt", label: "-", success: true, message: msg, durationMs: Date.now() - start });
      return { success: true, partitions, storage };
    } catch (e) {
      const msg = e.message;
      logger$d.error("printgpt 失败: " + msg);
      this.recordOperation({ type: "printgpt", label: "-", success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, partitions: [], error: msg };
    }
  }
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
  async backupPartition(opts) {
    const { loader, label, outputFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error("firehose loader 不存在: " + loader);
      }
      const outputDir = path.dirname(outputFile);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      onProgress?.("正在备份分区: " + label);
      const result = await this.spawnEdlNgWithProgress(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "read-part", label, outputFile], onProgress, onTransferProgress);
      if (result.exitCode !== 0) {
        const msg2 = "备份失败: " + (result.stderr || result.stdout);
        this.recordOperation({ type: "backup", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      if (!fs.existsSync(outputFile)) {
        const msg2 = "备份失败: 输出文件未生成";
        this.recordOperation({ type: "backup", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = "备份完成: " + outputFile;
      onProgress?.(msg);
      this.recordOperation({ type: "backup", label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$d.error("备份分区 " + label + " 失败: " + msg);
      this.recordOperation({ type: "backup", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  async restorePartition(opts) {
    const { loader, label, inputFile, backupBeforeRestore = true, backupOutputDir, verifyAfterRestore = false, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    let backupPath;
    try {
      if (!fs.existsSync(loader)) {
        throw new Error("firehose loader 不存在: " + loader);
      }
      if (!fs.existsSync(inputFile)) {
        throw new Error("输入文件不存在: " + inputFile);
      }
      if (backupBeforeRestore) {
        if (!backupOutputDir) {
          throw new Error("backupBeforeRestore=true 时需提供 backupOutputDir");
        }
        const ts = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").slice(0, 19);
        backupPath = path.join(backupOutputDir, label + "_pre_restore_" + ts + ".img");
        onProgress?.("恢复前备份当前分区到: " + backupPath);
        const backupRes = await this.backupPartition({ loader, label, outputFile: backupPath, onProgress, onTransferProgress });
        if (!backupRes.success) {
          throw new Error("恢复前备份失败: " + backupRes.error + "(已中止恢复以防数据丢失)");
        }
      }
      onProgress?.("正在恢复分区: " + label);
      const result = await this.spawnEdlNgWithProgress(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "write-part", label, inputFile], onProgress, onTransferProgress);
      if (result.exitCode !== 0) {
        const msg2 = "恢复失败: " + (result.stderr || result.stdout);
        this.recordOperation({ type: "restore", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2, backupPath };
      }
      if (verifyAfterRestore) {
        onProgress?.("恢复后读回校验...");
        const verify = await this.verifyPartition({ loader, label, expectedFile: inputFile, onProgress, onTransferProgress });
        if (!verify.matched) {
          onProgress?.("校验未通过: " + (verify.error ?? "数据不一致"));
        } else {
          onProgress?.("校验通过");
        }
      }
      const msg = "恢复完成: " + label;
      onProgress?.(msg);
      this.recordOperation({ type: "restore", label, success: true, message: msg + (backupPath ? "(已备份原数据)" : ""), durationMs: Date.now() - start });
      return { success: true, backupPath };
    } catch (e) {
      const msg = e.message;
      logger$d.error("恢复分区 " + label + " 失败: " + msg);
      this.recordOperation({ type: "restore", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg, backupPath };
    }
  }
  async verifyPartition(opts) {
    const { loader, label, expectedFile, onProgress, onTransferProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(expectedFile)) {
        return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: "预期文件不存在" };
      }
      const expectedSize = fs.statSync(expectedFile).size;
      const workDir = path.join(electron.app.getPath("userData"), "edl_work");
      if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
      const readBackPath = path.join(workDir, "verify_" + label + "_" + Date.now() + ".img");
      onProgress?.("读回分区 " + label + " 进行校验...");
      const result = await this.spawnEdlNgWithProgress(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "read-part", label, readBackPath], onProgress, onTransferProgress);
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
      this.recordOperation({ type: "verify", label, success: true, message: matched ? "校验通过" : "数据不一致", durationMs: Date.now() - start });
      return { success: true, matched, bytesRead: actualSize, bytesExpected: expectedSize };
    } catch (e) {
      const msg = e.message;
      logger$d.error("校验分区 " + label + " 失败: " + msg);
      this.recordOperation({ type: "verify", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, matched: false, bytesRead: 0, bytesExpected: 0, error: msg };
    }
  }
  async erasePartition(opts) {
    const { loader, label, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error("firehose loader 不存在: " + loader);
      }
      onProgress?.("正在擦除分区: " + label);
      const result = await this.spawnEdlNg(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "erase-part", label], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = "擦除失败: " + (result.stderr || result.stdout);
        this.recordOperation({ type: "erase", label, success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = "擦除完成: " + label;
      onProgress?.(msg);
      this.recordOperation({ type: "erase", label, success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$d.error("擦除分区 " + label + " 失败: " + msg);
      this.recordOperation({ type: "erase", label, success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  async resetDevice(opts) {
    const { loader, onProgress } = opts;
    const start = Date.now();
    try {
      if (!fs.existsSync(loader)) {
        throw new Error("firehose loader 不存在: " + loader);
      }
      onProgress?.("正在重启设备...");
      const result = await this.spawnEdlNg(["--loader", loader, "--memory", "Sdcc", "--slot", "0", "reset", "--mode", "Reset", "--delay", "1"], onProgress);
      if (result.exitCode !== 0) {
        const msg2 = "重启失败: " + (result.stderr || result.stdout);
        this.recordOperation({ type: "reset", label: "-", success: false, message: msg2, durationMs: Date.now() - start });
        return { success: false, error: msg2 };
      }
      const msg = "重启指令已发送";
      onProgress?.(msg);
      this.recordOperation({ type: "reset", label: "-", success: true, message: msg, durationMs: Date.now() - start });
      return { success: true };
    } catch (e) {
      const msg = e.message;
      logger$d.error("重启失败: " + msg);
      this.recordOperation({ type: "reset", label: "-", success: false, message: msg, durationMs: Date.now() - start });
      return { success: false, error: msg };
    }
  }
  async checkEdlDevice() {
    const device = DeviceService.instance.getCurrentDevice();
    if (device?.type === "qcom_edl") {
      return { inEdl: true, port: device.port };
    }
    return { inEdl: false };
  }
  isCritical(label) {
    return CRITICAL_PARTITIONS.includes(label);
  }
  listLoaders() {
    return [
      { name: "msm8909w.mbn", path: path.join(paths.edl, "msm8909w.mbn"), description: "Z2-Z6 非 V3" },
      { name: "msm8937.mbn", path: path.join(paths.edl, "msm8937.mbn"), description: "V3 机型(Z6+/Z7+)" },
      { name: "prog_firehose_ddr.elf", path: path.join(paths.edl, "prog_firehose_ddr.elf"), description: "Z10/ND03" }
    ];
  }
  getHistory() {
    return [...this.operationHistory].reverse();
  }
  clearHistory() {
    this.operationHistory = [];
  }
  recordOperation(opts) {
    this.operationHistory.push({ id: "op-" + ++this.historyIdCounter, ...opts, timestamp: Date.now() });
    if (this.operationHistory.length > 50) {
      this.operationHistory.shift();
    }
  }
  async spawnEdlNg(args, onProgress) {
    logger$d.info("edl-ng " + args.join(" "));
    return subprocessPool.spawn({
      cmd: this.edlNgPath,
      args,
      encoding: "utf-8",
      timeout: 0,
      cwd: this.edlNgDir,
      onStdout: (line) => {
        logger$d.info("edl-ng: " + line);
        onProgress?.(line);
        this.emitProgress(line);
      },
      onStderr: (line) => logger$d.warn("edl-ng stderr: " + line)
    });
  }
  async spawnEdlNgWithProgress(args, onProgress, onTransferProgress) {
    logger$d.info("edl-ng " + args.join(" "));
    return subprocessPool.spawn({
      cmd: this.edlNgPath,
      args,
      encoding: "utf-8",
      timeout: 0,
      cwd: this.edlNgDir,
      onStdout: (line) => {
        const m = line.match(PROGRESS_RE);
        if (m && onTransferProgress) {
          onTransferProgress({ operation: m[1], percent: parseFloat(m[2]), transferredMiB: parseFloat(m[3]), totalMiB: parseFloat(m[4]), speed: m[5] });
          this.emitProgress(line, parseFloat(m[2]));
        } else {
          logger$d.info("edl-ng: " + line);
          onProgress?.(line);
          this.emitProgress(line);
        }
      },
      onStderr: (line) => logger$d.warn("edl-ng stderr: " + line)
    });
  }
  emitProgress(message, percent = 0) {
    for (const win of require("electron").BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send("edl-part:progress", { stage: "EDL", percent, message });
    }
  }
}
const edlPartitionService = new EdlPartitionServiceClass();
function registerEdlPartitionIpc() {
  electron.ipcMain.handle(
    "edl-part:list-loaders",
    wrap(async () => {
      return edlPartitionService.listLoaders();
    })
  );
  electron.ipcMain.handle(
    "edl-part:check-edl-device",
    wrap(async () => {
      const result = await edlPartitionService.checkEdlDevice();
      return { found: result.inEdl, port: result.port };
    })
  );
  electron.ipcMain.handle(
    "edl-part:print-gpt",
    wrap(async (_event, { loader }) => {
      const result = await edlPartitionService.printGpt({ loader });
      if (!result.success) throw new Error(result.error || "读取 GPT 失败");
      return result;
    })
  );
  electron.ipcMain.handle(
    "edl-part:backup-partition",
    wrap(async (_event, { loader, label, outputFile }) => {
      return edlPartitionService.backupPartition({ loader, label, outputFile });
    })
  );
  electron.ipcMain.handle(
    "edl-part:restore-partition",
    wrap(async (_event, { loader, label, inputFile }) => {
      return edlPartitionService.restorePartition({ loader, label, inputFile });
    })
  );
  electron.ipcMain.handle(
    "edl-part:erase-partition",
    wrap(async (_event, { loader, label }) => {
      return edlPartitionService.erasePartition({ loader, label });
    })
  );
  electron.ipcMain.handle(
    "edl-part:verify-partition",
    wrap(async (_event, { loader, label, filePath }) => {
      return edlPartitionService.verifyPartition({ loader, label, expectedFile: filePath });
    })
  );
  electron.ipcMain.handle(
    "edl-part:reset-device",
    wrap(async (_event, { loader }) => {
      return edlPartitionService.resetDevice({ loader });
    })
  );
  electron.ipcMain.handle(
    "edl-part:get-history",
    wrap(async () => {
      return edlPartitionService.getHistory();
    })
  );
  electron.ipcMain.handle(
    "edl-part:clear-history",
    wrap(async () => {
      edlPartitionService.clearHistory();
    })
  );
}
const logger$c = {
  info: (...args) => console.log("[FileService]", ...args),
  warn: (...args) => console.warn("[FileService]", ...args)
};
const TIMEOUT$4 = {
  fileOp: 15e3,
  device: 5e3,
  shell: 1e4,
  flash: 6e4,
  install: 12e4
};
class FileServiceClass extends node_events.EventEmitter {
  constructor() {
    super(...arguments);
    this.compatMode = false;
    this.keepMtime = false;
    this.QUICK_PATHS = [
      { name: "内部存储", path: "/sdcard" },
      { name: "DCIM 相册", path: "/sdcard/DCIM" },
      { name: "下载", path: "/sdcard/Download" },
      { name: "图片", path: "/sdcard/Pictures" },
      { name: "音乐", path: "/sdcard/Music" },
      { name: "电影", path: "/sdcard/Movies" },
      { name: "文档", path: "/sdcard/Documents" },
      { name: "存储根", path: "/storage" },
      { name: "根目录", path: "/" },
      { name: "data 分区", path: "/data" }
    ];
  }
  async list(remotePath, deviceSerial) {
    const safePath = this.quote(remotePath);
    const flag = this.compatMode ? "-l" : "-lA";
    const out = await this.shellDevice("ls " + flag + " " + safePath, { timeout: TIMEOUT$4.fileOp }, deviceSerial);
    let entries = this.parseLsOutput(out, remotePath);
    if (this.compatMode) {
      entries = entries.filter((e) => e.name !== "." && e.name !== "..");
    }
    return entries;
  }
  parseLsOutput(output, baseDir) {
    const entries = [];
    const lines = output.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (/^total\s+\d+/i.test(line)) continue;
      if (/permission denied|no such file|not a directory|opendir/i.test(line)) continue;
      let m = line.match(/^([dlbcsp-])([rwxst-]{9})\s+(\d+)\s+(\S+)\s+(\S+)\s+(\d+)\s+(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+(.*)$/);
      let typeChar, perms, owner, group, size, mtime, nameRaw;
      if (m) {
        [, typeChar, perms, , owner, group, , mtime, , nameRaw] = m;
        mtime = `${mtime} ${m[8]}`;
        size = parseInt(m[6], 10) || 0;
      } else {
        m = line.match(/^([dlbcsp-])([rwxst-]{9})\s+(\S+)\s+(\S+)\s+(\d+)\s+(\w{3}\s+\d{1,2}\s+[\d:]{4,5})\s+(.*)$/);
        if (m) {
          [, typeChar, perms, owner, group, , mtime, nameRaw] = m;
          size = parseInt(m[5], 10) || 0;
        } else {
          logger$c.warn("无法解析 ls 行: " + line);
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
      entries.push({
        name,
        path: this.joinPath(baseDir, name),
        isDir,
        isLink,
        linkTarget,
        size: isDir ? 0 : size,
        perms,
        mode: perms,
        type: typeChar,
        owner,
        group,
        mtime,
        modified: mtime,
        ext: isDir || isLink ? "" : this.getExt(name)
      });
    }
    entries.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    return entries;
  }
  async stat(remotePath, deviceSerial) {
    const safePath = this.quote(remotePath);
    try {
      const out = await this.shellDevice("ls -ld " + safePath, { timeout: TIMEOUT$4.device }, deviceSerial);
      const entries = this.parseLsOutput(out, this.parentDir(remotePath));
      return entries.find((e) => e.path === remotePath) ?? entries[0] ?? null;
    } catch {
      return null;
    }
  }
  async exists(remotePath, deviceSerial) {
    try {
      const out = await this.shellDevice(`[ -e ${this.quote(remotePath)} ] && echo yes || echo no`, { timeout: TIMEOUT$4.device }, deviceSerial);
      return out.trim() === "yes";
    } catch {
      return false;
    }
  }
  async mkdir(remotePath, recursive = true, deviceSerial) {
    const flag = recursive ? "-p" : "";
    await this.shellDevice(`mkdir ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT$4.device }, deviceSerial);
  }
  async remove(remotePath, recursive = true, deviceSerial) {
    const flag = recursive ? "-rf" : "-f";
    await this.shellDevice(`rm ${flag} ${this.quote(remotePath)}`, { timeout: TIMEOUT$4.fileOp }, deviceSerial);
  }
  async rename(oldPath, newPath, deviceSerial) {
    await this.shellDevice(`mv ${this.quote(oldPath)} ${this.quote(newPath)}`, { timeout: TIMEOUT$4.device }, deviceSerial);
  }
  async copy(srcPath, dstPath, recursive = true, deviceSerial) {
    const flag = recursive ? "-r" : "";
    await this.shellDevice(`cp ${flag} ${this.quote(srcPath)} ${this.quote(dstPath)}`, { timeout: TIMEOUT$4.fileOp }, deviceSerial);
  }
  async push(local, remote, deviceSerial, onProgress) {
    logger$c.info("push: " + local + " -> " + remote);
    const remoteDir = this.parentDir(remote);
    if (remoteDir && remoteDir !== "/") {
      try {
        await this.mkdir(remoteDir, true, deviceSerial);
      } catch {
      }
    }
    const args = this.deviceArgs(deviceSerial);
    args.push("push", local, remote);
    await this.spawnWithProgress(args, { local, remote, direction: "push", onProgress });
    if (this.keepMtime) {
      try {
        const localMtime = await this.getLocalMtime(local);
        if (localMtime) {
          await this.shellDevice(`touch -d '${localMtime}' ${this.quote(remote)}`, { timeout: TIMEOUT$4.device }, deviceSerial);
        }
      } catch {
      }
    }
  }
  async pull(remote, local, deviceSerial, onProgress) {
    logger$c.info("pull: " + remote + " -> " + local);
    const args = this.deviceArgs(deviceSerial);
    args.push("pull", remote, local);
    await this.spawnWithProgress(args, { local, remote, direction: "pull", onProgress });
  }
  async installRemoteApk(remoteApk, deviceSerial) {
    const out = await this.shellDevice(`pm install -r ${this.quote(remoteApk)}`, { timeout: TIMEOUT$4.install }, deviceSerial);
    const success = /\bSuccess\b/i.test(out);
    return { success, output: out, error: success ? void 0 : out.trim() || "安装失败" };
  }
  async diskInfo(remotePath = "/sdcard") {
    try {
      const out = await adbService.shell("", "df -k " + this.quote(remotePath));
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
      return { path: remotePath, total, used, available, free: available, usagePercent };
    } catch {
      return null;
    }
  }
  async readTextFile(remotePath, maxBytes = 1024 * 1024) {
    const out = await adbService.shell("", "cat " + this.quote(remotePath));
    if (out.length > maxBytes) return out.slice(0, maxBytes) + "\n... [文件过大,已截断]";
    return out;
  }
  async createFile(remotePath, content = "") {
    if (content) {
      await this.writeFile(remotePath, content);
    } else {
      await adbService.shell("", "touch " + this.quote(remotePath));
    }
  }
  async writeFile(remotePath, content) {
    const escaped = content.replace(/'/g, "'\\''");
    await adbService.shell("", `printf '%s' '${escaped}' > ${this.quote(remotePath)}`);
  }
  async chmod(remotePath, mode, recursive = false) {
    const flag = recursive ? "-R" : "";
    await adbService.shell("", `chmod ${flag} ${mode} ${this.quote(remotePath)}`);
  }
  async batchRemove(pathsToRemove, recursive = true) {
    const flag = recursive ? "-rf" : "-f";
    const success = [];
    const failed = [];
    for (const p of pathsToRemove) {
      try {
        await adbService.shell("", `rm ${flag} ${this.quote(p)}`);
        success.push(p);
      } catch (e) {
        failed.push({ path: p, error: e.message });
      }
    }
    return { success, failed };
  }
  async searchInDir(dir, query, deviceSerial) {
    const safeDir = this.quote(dir);
    const safeQuery = this.quote("*" + query + "*");
    let out;
    try {
      out = await this.shellDevice(`find ${safeDir} -maxdepth 1 -iname ${safeQuery} 2>/dev/null`, { timeout: TIMEOUT$4.fileOp }, deviceSerial);
    } catch {
      out = await this.shellDevice(`ls ${safeDir} | grep -i ${this.quote(query)}`, { timeout: TIMEOUT$4.fileOp }, deviceSerial);
    }
    const foundPaths = out.split("\n").map((l) => l.trim()).filter(Boolean);
    const results = [];
    for (const p of foundPaths) {
      const entry = await this.stat(p, deviceSerial);
      if (entry) results.push(entry);
    }
    return results;
  }
  async listDevices() {
    const result = await subprocessPool.spawn({
      cmd: process.platform === "win32" ? path.join(paths.bin, "adb.exe") : "adb",
      args: ["devices", "-l"],
      encoding: "utf-8",
      timeout: TIMEOUT$4.device,
      cwd: paths.bin
    });
    const devices = [];
    for (const line of result.stdout.split("\n").slice(1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parts = trimmed.split(/\s+/);
      if (parts.length < 2) continue;
      const [serial, state] = parts;
      if (!["device", "unauthorized", "offline"].includes(state)) continue;
      const modelField = parts.find((p) => p.startsWith("model:"));
      devices.push({ serial, state, model: modelField ? modelField.slice(6) : void 0, type: "adb" });
    }
    return devices;
  }
  deviceArgs(serial) {
    return serial ? ["-s", serial] : [];
  }
  async shellDevice(cmd, opts = {}, deviceSerial) {
    const args = this.deviceArgs(deviceSerial);
    args.push("shell");
    if (opts.root) {
      args.push("su -c '" + cmd.replace(/'/g, "'\\''") + "'");
    } else {
      args.push(cmd);
    }
    const result = await subprocessPool.spawn({
      cmd: process.platform === "win32" ? path.join(paths.bin, "adb.exe") : "adb",
      args,
      encoding: "gbk",
      timeout: opts.timeout ?? 3e4,
      cwd: paths.bin
    });
    return result.stdout;
  }
  async spawnWithProgress(args, ctx) {
    let lastPercent = 0;
    await subprocessPool.spawn({
      cmd: process.platform === "win32" ? path.join(paths.bin, "adb.exe") : "adb",
      args,
      encoding: "utf-8",
      timeout: 0,
      cwd: paths.bin,
      onStdout: (line) => {
        const m = line.match(/\[\s*(\d+)%\]/);
        if (!m) return;
        const percent = parseInt(m[1], 10);
        if (percent === lastPercent) return;
        lastPercent = percent;
        const progress2 = {
          file: path.basename(ctx.local),
          local: ctx.local,
          remote: ctx.remote,
          direction: ctx.direction,
          percent,
          bytes: percent,
          total: 100,
          speed: 0
        };
        ctx.onProgress?.(progress2);
        this.emit("transfer-progress", progress2);
      }
    });
    if (lastPercent < 100) {
      const progress2 = {
        file: path.basename(ctx.local),
        local: ctx.local,
        remote: ctx.remote,
        direction: ctx.direction,
        percent: 100,
        bytes: 100,
        total: 100,
        speed: 0
      };
      ctx.onProgress?.(progress2);
      this.emit("transfer-progress", progress2);
    }
  }
  async getLocalMtime(localPath) {
    try {
      const d = fs.statSync(localPath).mtime;
      const pad = (n) => n.toString().padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    } catch {
      return null;
    }
  }
  quote(p) {
    return "'" + String(p).replace(/'/g, "'\\''") + "'";
  }
  joinPath(base, name) {
    return base.endsWith("/") ? base + name : base + "/" + name;
  }
  parentDir(p) {
    const idx = p.lastIndexOf("/");
    return idx <= 0 ? "/" : p.slice(0, idx);
  }
  getExt(name) {
    const idx = name.lastIndexOf(".");
    return idx <= 0 || idx === name.length - 1 ? "" : name.slice(idx + 1).toLowerCase();
  }
}
const fileService = new FileServiceClass();
const logger$b = {
  info: (...args) => console.log("[ApkParser]", ...args)
};
function parseZipEntries(buffer) {
  const entries = [];
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65536); i--) {
    if (buffer.readUInt32LE(i) === 101010256) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) throw new Error("ZIP EOCD 未找到");
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
    entries.push({ filename, offset: localHeaderOffset, compressedSize, uncompressedSize, compressionMethod });
    pos += 46 + filenameLength + extraFieldLength + commentLength;
  }
  return entries;
}
function extractZipEntry(buffer, entry) {
  if (entry.offset + 30 > buffer.length) throw new Error("ZIP entry offset 超出 buffer");
  const localFilenameLength = buffer.readUInt16LE(entry.offset + 26);
  const localExtraLength = buffer.readUInt16LE(entry.offset + 28);
  const dataOffset = entry.offset + 30 + localFilenameLength + localExtraLength;
  if (dataOffset > buffer.length) throw new Error("ZIP data offset 超出 buffer");
  if (entry.compressionMethod === 0) {
    const end = Math.min(dataOffset + entry.uncompressedSize, buffer.length);
    return buffer.subarray(dataOffset, end);
  } else if (entry.compressionMethod === 8) {
    const end = Math.min(dataOffset + entry.compressedSize, buffer.length);
    const compressed = buffer.subarray(dataOffset, end);
    return node_zlib.inflateSync(compressed);
  }
  throw new Error("不支持的压缩方法: " + entry.compressionMethod);
}
class AxmlParser {
  constructor(buffer) {
    this.pos = 0;
    this.strings = [];
    this.buffer = buffer;
  }
  parse() {
    const magic = this.readUInt16(0);
    if (magic !== 3) throw new Error("AXML magic 错误: 0x" + magic.toString(16));
    this.pos = 8;
    const result = { permissions: [] };
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
        result.permissions.push(attrValue.replace("android.permission.", ""));
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
  async parse(apkPath) {
    if (!fs.existsSync(apkPath)) {
      throw new Error("文件不存在: " + apkPath);
    }
    const stat = fs.statSync(apkPath);
    const buffer = fs.readFileSync(apkPath);
    const entries = parseZipEntries(buffer);
    logger$b.info("APK 包含 " + entries.length + " 个文件");
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
      /^res\/mipmap-xxxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-xxhdpi-v?\d*\/ic_launcher_foreground\.png$/i,
      /^res\/mipmap-[^/]+\/ic_launcher_foreground\.png$/i,
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
    logger$b.info("解析成功: " + info.packageName + " v" + (info.versionName ?? "?") + "(" + info.permissions.length + " 权限, 图标: " + (iconBase64 ? "有" : "无") + ")");
    return info;
  }
}
const apkParser = new ApkParserClass();
function registerFileIpc() {
  electron.ipcMain.handle(
    "file:list",
    wrap(async (_event, { serial, path: p }) => {
      return fileService.list(p, serial);
    })
  );
  electron.ipcMain.handle(
    "file:stat",
    wrap(async (_event, { serial, path: p }) => {
      return fileService.stat(p, serial);
    })
  );
  electron.ipcMain.handle(
    "file:mkdir",
    wrap(async (_event, { serial, path: p }) => {
      return fileService.mkdir(p, true, serial);
    })
  );
  electron.ipcMain.handle(
    "file:remove",
    wrap(async (_event, { serial, path: p }) => {
      return fileService.remove(p, true, serial);
    })
  );
  electron.ipcMain.handle(
    "file:rename",
    wrap(async (_event, { serial, oldPath, newPath }) => {
      return fileService.rename(oldPath, newPath, serial);
    })
  );
  electron.ipcMain.handle(
    "file:copy",
    wrap(async (_event, { serial, src, dest }) => {
      return fileService.copy(src, dest, true, serial);
    })
  );
  electron.ipcMain.handle(
    "file:push",
    wrap(async (_event, { serial, local, remote }) => {
      return fileService.push(local, remote, serial);
    })
  );
  electron.ipcMain.handle(
    "file:pull",
    wrap(async (_event, { serial, remote, local }) => {
      return fileService.pull(remote, local, serial);
    })
  );
  electron.ipcMain.handle(
    "file:push-folder",
    wrap(async (_event, { serial, localDir, remoteDir }) => {
      if (!fs.existsSync(localDir) || !fs.statSync(localDir).isDirectory()) {
        throw new Error("本地目录不存在: " + localDir);
      }
      const target = `${remoteDir.replace(/\/+$/, "")}/${path.basename(localDir)}`;
      await fileService.mkdir(target, true, serial);
      const walk = async (dir, remoteBase) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const localPath = path.join(dir, entry.name);
          const remotePath = `${remoteBase}/${entry.name}`;
          if (entry.isDirectory()) {
            await fileService.mkdir(remotePath, true, serial);
            await walk(localPath, remotePath);
          } else {
            await fileService.push(localPath, remotePath, serial);
          }
        }
      };
      await walk(localDir, target);
      return target;
    })
  );
  electron.ipcMain.handle(
    "file:install-apk",
    wrap(async (_event, { serial, remoteApk }) => {
      return fileService.installRemoteApk(remoteApk, serial);
    })
  );
  electron.ipcMain.handle(
    "file:install-local-apk",
    wrap(async (_event, { serial }) => {
      const { dialog } = await import("electron");
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [{ name: "APK files", extensions: ["apk"] }]
      });
      if (canceled || filePaths.length === 0) return "";
      if (!fs.existsSync(paths.cache)) fs.mkdirSync(paths.cache, { recursive: true });
      const tmp = path.join(paths.cache, `install_${Date.now()}.apk`);
      fs.copyFileSync(filePaths[0], tmp);
      const result = await adbService.install(serial || "", tmp);
      try {
        fs.unlinkSync(tmp);
      } catch {
      }
      if (!result.success) throw new Error(result.error || "安装失败");
      return result.output;
    })
  );
  electron.ipcMain.handle(
    "file:disk-info",
    wrap(async (_event, { path: p }) => {
      return fileService.diskInfo(p || "/sdcard");
    })
  );
  electron.ipcMain.handle(
    "file:read-text",
    wrap(async (_event, { path: p }) => {
      return fileService.readTextFile(p);
    })
  );
  electron.ipcMain.handle(
    "file:quick-paths",
    wrap(async () => {
      return fileService.QUICK_PATHS;
    })
  );
  electron.ipcMain.handle(
    "file:list-devices",
    wrap(async () => {
      return fileService.listDevices();
    })
  );
  electron.ipcMain.handle(
    "file:create-file",
    wrap(async (_event, { path: p, content }) => {
      return fileService.createFile(p, content || "");
    })
  );
  electron.ipcMain.handle(
    "file:write-file",
    wrap(async (_event, { path: p, content }) => {
      return fileService.writeFile(p, content);
    })
  );
  electron.ipcMain.handle(
    "file:chmod",
    wrap(async (_event, { path: p, mode }) => {
      return fileService.chmod(p, mode, false);
    })
  );
  electron.ipcMain.handle(
    "file:batch-remove",
    wrap(async (_event, { paths: ps }) => {
      return fileService.batchRemove(ps, true);
    })
  );
  electron.ipcMain.handle(
    "file:search",
    wrap(async (_event, { serial, pattern, path: p }) => {
      return fileService.searchInDir(p || "/sdcard", pattern, serial);
    })
  );
  electron.ipcMain.handle(
    "file:set-compat-mode",
    wrap(async (_event, { enabled }) => {
      fileService.compatMode = enabled;
    })
  );
  electron.ipcMain.handle(
    "file:set-keep-mtime",
    wrap(async (_event, { enabled }) => {
      fileService.keepMtime = enabled;
    })
  );
  electron.ipcMain.handle(
    "file:parse-apk",
    wrap(async (_event, { apkPath }) => {
      const meta = await apkParser.parse(apkPath);
      return {
        package: meta.packageName,
        name: meta.label,
        version: meta.versionName,
        icon: meta.iconBase64 ? `data:${meta.iconMime};base64,${meta.iconBase64}` : void 0
      };
    })
  );
}
const logBus = new node_events.EventEmitter();
const origDebug = logger$i.debug.bind(logger$i);
const origInfo = logger$i.info.bind(logger$i);
const origWarn = logger$i.warn.bind(logger$i);
const origError = logger$i.error.bind(logger$i);
logger$i.debug = (source, message) => {
  origDebug(source, message);
  logBus.emit("line", { ts: Date.now(), level: "debug", source, message });
};
logger$i.info = (source, message) => {
  origInfo(source, message);
  logBus.emit("line", { ts: Date.now(), level: "info", source, message });
};
logger$i.warn = (source, message) => {
  origWarn(source, message);
  logBus.emit("line", { ts: Date.now(), level: "warn", source, message });
};
logger$i.error = (source, message, stack) => {
  origError(source, message, stack);
  logBus.emit("line", { ts: Date.now(), level: "error", source, message, raw: stack });
};
function registerLogIpc() {
  const subscriptions = /* @__PURE__ */ new Set();
  electron.ipcMain.handle(
    "log:subscribe",
    wrap(async (event) => {
      const id = `${event.sender.id}`;
      if (subscriptions.has(id)) return;
      subscriptions.add(id);
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      const sendLog = (entry) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send("log:line", entry);
        }
      };
      logBus.on("line", sendLog);
      event.sender.on("destroyed", () => {
        subscriptions.delete(id);
        logBus.off("line", sendLog);
      });
    })
  );
  electron.ipcMain.handle(
    "log:unsubscribe",
    wrap(async (event) => {
      subscriptions.delete(`${event.sender.id}`);
    })
  );
}
function registerMagiskIpc() {
  electron.ipcMain.handle(
    "magisk:list",
    wrap(async () => {
      return magiskService.list();
    })
  );
  electron.ipcMain.handle(
    "magisk:install",
    wrap(async (_event, { zipPath, method }) => {
      return magiskService.install(zipPath, method);
    })
  );
  electron.ipcMain.handle(
    "magisk:uninstall",
    wrap(async (_event, { moduleId, method }) => {
      return magiskService.uninstall(moduleId, method);
    })
  );
  electron.ipcMain.handle(
    "magisk:enable",
    wrap(async (_event, { moduleId }) => {
      return magiskService.enable(moduleId);
    })
  );
  electron.ipcMain.handle(
    "magisk:disable",
    wrap(async (_event, { moduleId }) => {
      return magiskService.disable(moduleId);
    })
  );
  electron.ipcMain.handle(
    "magisk:store-search",
    wrap(async (_event, query) => {
      return magiskService.storeSearch(query);
    })
  );
  electron.ipcMain.handle(
    "magisk:store-install",
    wrap(async (_event, { module: module2 }) => {
      return magiskService.installFromStore(module2);
    })
  );
}
const logger$a = {
  info: (...args) => console.log("[FastbootService]", ...args),
  warn: (...args) => console.warn("[FastbootService]", ...args),
  error: (...args) => console.error("[FastbootService]", ...args),
  debug: (...args) => console.debug("[FastbootService]", ...args)
};
const TIMEOUT$3 = {
  device: 5e3,
  install: 12e4,
  shellLong: 3e4,
  shell: 1e4
};
class FastbootServiceClass {
  constructor() {
    this.fastbootPath = process.platform === "win32" ? path.join(paths.bin, "fastboot.exe") : "fastboot";
  }
  async devices() {
    const result = await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["devices"],
      encoding: "utf-8",
      timeout: TIMEOUT$3.device,
      cwd: paths.bin
    });
    return result.stdout.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && l.includes("fastboot"));
  }
  async flash(partition, img) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["flash", partition, img],
      encoding: "gbk",
      timeout: TIMEOUT$3.install,
      cwd: paths.bin,
      onStdout: (line) => logger$a.info(`flash ${partition}: ${line}`)
    });
  }
  async erase(partition) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["erase", partition],
      encoding: "gbk",
      timeout: TIMEOUT$3.shellLong,
      cwd: paths.bin
    });
  }
  async boot(img) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["boot", img],
      encoding: "gbk",
      timeout: TIMEOUT$3.shellLong,
      cwd: paths.bin
    });
  }
  async reboot(target) {
    const arg = target === "system" ? "reboot" : `reboot ${target}`;
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: arg.split(" "),
      encoding: "utf-8",
      timeout: TIMEOUT$3.shell,
      cwd: paths.bin
    });
  }
  async getVar(name) {
    const result = await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["getvar", name],
      encoding: "utf-8",
      timeout: TIMEOUT$3.shell,
      cwd: paths.bin
    });
    return result.stdout.trim();
  }
  async oem(cmd) {
    await subprocessPool.spawn({
      cmd: this.fastbootPath,
      args: ["oem", cmd],
      encoding: "gbk",
      timeout: TIMEOUT$3.shellLong,
      cwd: paths.bin
    });
  }
}
const fastbootService = new FastbootServiceClass();
const logger$9 = {
  info: (...args) => console.log("[RebootService]", ...args),
  warn: (...args) => console.warn("[RebootService]", ...args),
  error: (...args) => console.error("[RebootService]", ...args)
};
class RebootServiceClass {
  async reboot(opts) {
    logger$9.info("执行重启: mode=" + opts.mode + ", innermodel=" + (opts.innermodel ?? "-") + ", platform=" + (opts.platform ?? "-"));
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
  async rebootSystem() {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await adbService.reboot("", "system");
    } else if (device.type === "fastboot") {
      await fastbootService.reboot("system");
    } else if (device.type === "qcom_edl") {
      await this.edlReboot();
    } else {
      throw new Error("当前设备状态不支持重启至系统: " + device.type);
    }
    logger$9.info("已发送重启至系统指令");
  }
  async rebootBootloader() {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await adbService.reboot("", "bootloader");
    } else if (device.type === "fastboot") {
      await fastbootService.reboot("bootloader");
    } else {
      throw new Error("当前设备状态不支持重启至 Bootloader: " + device.type);
    }
    logger$9.info("已发送重启至 Bootloader 指令");
  }
  async rebootRecovery(innermodel) {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await adbService.reboot("", "recovery");
    } else if (device.type === "fastboot") {
      if (!innermodel) {
        throw new Error("Fastboot 设备重启至 Recovery 需要选择型号");
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await adbService.reboot("", "recovery");
    } else {
      throw new Error("当前设备状态不支持重启至 Recovery: " + device.type);
    }
    logger$9.info("已发送重启至 Recovery 指令");
  }
  async rebootEdl(innermodel) {
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await adbService.reboot("", "edl");
    } else if (device.type === "fastboot") {
      if (!innermodel) {
        throw new Error("Fastboot 设备重启至 9008 需要选择型号");
      }
      await this.bootTwrpAndWaitAdb(innermodel);
      await adbService.reboot("", "edl");
    } else {
      throw new Error("当前设备状态不支持重启至 9008: " + device.type);
    }
    logger$9.info("已发送重启至 9008 指令");
  }
  async bootTwrpAndWaitAdb(innermodel) {
    const twrpDir = path.join(paths.edl, "twrp");
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, innermodel + ".img");
    if (!fs.existsSync(twrpImg)) {
      throw new Error("TWRP 镜像不存在: " + innermodel + ".img");
    }
    const workDir = path.join(electron.app.getPath("userData"), "edl_work");
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, "recovery.img");
    fs.copyFileSync(twrpImg, dstImg);
    await fastbootService.boot(dstImg);
    logger$9.info("已临时启动 TWRP,等待 ADB...");
    await DeviceService.instance.waitFor(["adb"], 3e4);
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
  }
  async rebootTwrpTemp(innermodel) {
    if (!innermodel) {
      throw new Error("临时启动 TWRP 需要选择型号");
    }
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) {
      throw new Error("未检测到设备");
    }
    if (device.type === "adb") {
      await adbService.reboot("", "bootloader");
      logger$9.info("等待 Fastboot 设备...");
      await DeviceService.instance.waitFor(["fastboot"], 3e4);
    }
    const currentDevice = DeviceService.instance.getCurrentDevice();
    if (currentDevice?.type !== "fastboot" && currentDevice?.type !== "adb") {
      throw new Error("临时启动 TWRP 需要 ADB 或 Fastboot 设备");
    }
    const twrpDir = path.join(paths.edl, "twrp");
    if (!fs.existsSync(twrpDir)) {
      throw new Error('TWRP 镜像未下载,请先在"资源下载"页下载 TWRP');
    }
    const twrpImg = path.join(twrpDir, innermodel + ".img");
    if (!fs.existsSync(twrpImg)) {
      throw new Error("TWRP 镜像不存在: " + innermodel + ".img");
    }
    const workDir = path.join(electron.app.getPath("userData"), "edl_work");
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    const dstImg = path.join(workDir, "recovery.img");
    fs.copyFileSync(twrpImg, dstImg);
    await fastbootService.boot(dstImg);
    logger$9.info("已临时启动 TWRP");
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
      fs.mkdirSync(workDir, { recursive: true });
    } catch {
    }
  }
  async flashMisc(mode, platform, innermodel) {
    if (!innermodel || !platform) {
      throw new Error(mode + " 需要选择型号和平台");
    }
    let port = await edlService.findPort();
    if (!port) {
      const device = DeviceService.instance.getCurrentDevice();
      if (device?.type === "adb") {
        logger$9.info("设备在 ADB 模式,重启至 9008...");
        await adbService.reboot("", "edl");
        port = await edlService.waitForEdl(6e4);
      } else {
        throw new Error("未检测到 9008 设备,请将设备进入 9008 模式");
      }
    }
    const edlMode = mode === "wipe-data" ? "wipe" : mode;
    const miscDir = path.join(paths.edl, "misc");
    const imageSrc = edlMode === "ffbm" ? "ffbm.img" : edlMode === "wipe" ? "wipe.img" : edlMode === "fastbootd" ? "fastbootd.img" : "misc.img";
    const xmlSrc = platform === "z10" ? "misc_ND03.xml" : `misc_${innermodel}.xml`;
    const workDir = path.join(paths.edl, "rooting");
    if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });
    const imgExt = platform === "otherpass" ? "mbn" : "img";
    const workXml = path.join(workDir, "misc.xml");
    fs.copyFileSync(path.join(miscDir, xmlSrc), workXml);
    fs.copyFileSync(path.join(miscDir, imageSrc), path.join(workDir, `misc.${imgExt}`));
    await edlService.loadFirehose(path.join(paths.edl, platform === "z10" ? "prog_firehose_ddr.elf" : platform === "v3pash" ? "msm8937.mbn" : "msm8909w.mbn"), port);
    await edlService.flashPartitions([workXml], port, void 0, workDir);
    await edlService.reboot(port);
    const modeLabel = {
      qmmi: "QMMI",
      ffbm: "FFBM",
      wipe: "恢复出厂设置",
      fastbootd: "fastbootd"
    };
    logger$9.info("已进入 " + modeLabel[edlMode]);
  }
  async edlReboot() {
    const port = await edlService.findPort();
    if (!port) {
      throw new Error("未检测到 9008 设备");
    }
    const loaders = ["msm8937.mbn", "msm8909w.mbn", "prog_firehose_ddr.elf"];
    let loaded = false;
    for (const loader of loaders) {
      try {
        await edlService.loadFirehose(path.join(paths.edl, loader), port);
        loaded = true;
        break;
      } catch {
      }
    }
    if (!loaded) {
      throw new Error("所有 firehose loader 加载失败");
    }
    await edlService.reboot(port);
  }
}
const rebootService = new RebootServiceClass();
function registerRebootIpc() {
  electron.ipcMain.handle(
    "reboot:execute",
    wrap(async (_event, { mode, innermodel, platform }) => {
      const device = DeviceService.instance.getCurrentDevice();
      return rebootService.reboot({
        mode,
        innermodel: innermodel || device?.innermodel,
        platform: platform || device?.platform
      });
    })
  );
}
const logger$8 = {
  info: (...args) => console.log("[MagiskPatcher]", ...args),
  warn: (...args) => console.warn("[MagiskPatcher]", ...args),
  error: (...args) => console.error("[MagiskPatcher]", ...args),
  debug: (...args) => console.debug("[MagiskPatcher]", ...args)
};
async function magiskboot(args, opts = { cwd: paths.edl }) {
  const magiskbootExe = path.join(paths.bin, "magiskboot.exe");
  try {
    const r = await subprocessPool.spawn({
      cmd: magiskbootExe,
      args,
      cwd: opts.cwd,
      encoding: "utf-8",
      timeout: opts.timeout ?? 6e4,
      taskId: opts.taskId,
      onStdout: (line) => logger$8.debug("magiskboot: " + line),
      onStderr: (line) => logger$8.warn("magiskboot stderr: " + line)
    });
    return { stdout: r.stdout, stderr: r.stderr, exitCode: r.exitCode ?? 0 };
  } catch (e) {
    if (e.exitCode !== void 0 && e.exitCode !== null) {
      return { stdout: e.stdout ?? "", stderr: e.stderr ?? "", exitCode: e.exitCode };
    }
    throw e;
  }
}
class MagiskPatcherClass {
  async patch(bootImg, outputPath, magiskVer, workDir = path.join(paths.edl, "work"), taskId) {
    if (!fs.existsSync(bootImg)) {
      return { success: false, status: "stock", error: "boot.img 不存在: " + bootImg };
    }
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    logger$8.info("开始修补 boot.img(magisk " + magiskVer + "): " + bootImg + " → " + outputPath);
    const tempFiles = ["magiskinit", "header", "kernel_dtb", "kernel", "ramdisk.cpio", "config", "ramdisk.cpio.orig"];
    for (const f of tempFiles) {
      const p = path.join(workDir, f);
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch {
      }
    }
    const magiskinitSrc = path.join(paths.bin, "magiskinit" + magiskVer);
    const magiskinitDst = path.join(workDir, "magiskinit");
    if (!fs.existsSync(magiskinitSrc)) {
      return { success: false, status: "stock", error: "magiskinit" + magiskVer + " 不存在" };
    }
    fs.copyFileSync(magiskinitSrc, magiskinitDst);
    const KEEPVERITY = "true";
    const KEEPFORCEENCRYPT = "true";
    const PATCHVBMETAFLAG = magiskVer === 25 ? "false" : void 0;
    let RECOVERYMODE = "false";
    if (magiskVer === 25) {
      const magisk32xzSrc = path.join(paths.bin, "magisk32.xz");
      if (!fs.existsSync(magisk32xzSrc)) {
        return { success: false, status: "stock", error: "magisk32.xz 不存在" };
      }
      fs.copyFileSync(magisk32xzSrc, path.join(workDir, "magisk32.xz"));
    }
    await magiskboot(["unpack", "-h", bootImg], { cwd: workDir, taskId });
    if (magiskVer === 21) {
      if (fs.existsSync(path.join(workDir, "recovery_dtbo"))) {
        RECOVERYMODE = "true";
        logger$8.info("检测到 recovery_dtbo,RECOVERYMODE 强制设为 true");
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
        return { success: false, status: "stock", error: "magiskboot cpio test 返回异常 exitCode: " + STATUS };
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
    configLines.push("KEEPVERITY=" + KEEPVERITY);
    configLines.push("KEEPFORCEENCRYPT=" + KEEPFORCEENCRYPT);
    if (PATCHVBMETAFLAG !== void 0) {
      configLines.push("PATCHVBMETAFLAG=" + PATCHVBMETAFLAG);
    }
    configLines.push("RECOVERYMODE=" + RECOVERYMODE);
    if (sha1) {
      configLines.push("SHA1=" + sha1);
    }
    fs.writeFileSync(path.join(workDir, "config"), configLines.join("\n") + "\n", "utf-8");
    if (magiskVer === 25) {
      await magiskboot([
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
      ], { cwd: workDir, taskId });
    } else {
      await magiskboot([
        "cpio",
        "ramdisk.cpio",
        "add 750 init magiskinit",
        "patch",
        "backup ramdisk.cpio.orig",
        "mkdir 000 .backup",
        "add 000 .backup/.magisk config"
      ], { cwd: workDir, taskId });
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
    await magiskboot([
      "hexpatch",
      "kernel",
      "49010054011440B93FA00F71E9000054010840B93FA00F7189000054001840B91FA00F7188010054",
      "A1020054011440B93FA00F7140020054010840B93FA00F71E0010054001840B91FA00F7181010054"
    ], { cwd: workDir, taskId });
    await magiskboot(["hexpatch", "kernel", "821B8012", "E2FF8F12"], { cwd: workDir, taskId });
    await magiskboot([
      "hexpatch",
      "kernel",
      "77616E745F696E697472616D667300",
      "736B69705F696E697472616D667300"
    ], { cwd: workDir, taskId });
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
    logger$8.info("boot.img 修补完成: " + outputPath + "(status=" + status + ")");
    return { success: true, status, sha1 };
  }
}
const magiskPatcher = new MagiskPatcherClass();
const logger$7 = {
  info: (...args) => console.log("[BootPatcher]", ...args),
  error: (...args) => console.error("[BootPatcher]", ...args)
};
class BootPatcherClass {
  patch(kernelPath) {
    const patches = [];
    try {
      if (!fs.existsSync(kernelPath)) {
        logger$7.error("kernel 文件不存在: " + kernelPath);
        return { success: false, patches: [], error: "kernel 文件不存在: " + kernelPath, output: "Error" };
      }
      const buf = fs.readFileSync(kernelPath);
      let content = buf.toString("latin1");
      {
        const before = content;
        content = content.replace(/builduser=root/, "builduser=rootbuilduser=root");
        if (content !== before) {
          patches.push("builduser=root → 追加 builduser=root(确保存在)");
        } else {
          patches.push("builduser=root 未匹配(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(/androidboot\.selinux=enforcing/, "androidboot.selinux=permissive");
        if (content !== before) {
          patches.push("androidboot.selinux=enforcing → permissive");
        } else {
          patches.push("androidboot.selinux= 未匹配 enforcing(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(/buildvariant=user /, "buildvariant=userdebug ");
        if (content !== before) {
          patches.push("buildvariant=user → buildvariant=userdebug");
        } else {
          patches.push("buildvariant=user (带尾空格) 未匹配(原样保留)");
        }
      }
      {
        const before = content;
        content = content.replace(/(buildsoftversion=[\d.]+)\s*/g, "$1");
        if (content !== before) {
          patches.push("buildsoftversion=x.y.z 后空白已移除");
        } else {
          patches.push("buildsoftversion=x.y.z 未匹配(原样保留)");
        }
      }
      const newBuf = Buffer.from(content, "latin1");
      if (newBuf.length !== buf.length || !newBuf.equals(buf)) {
        fs.writeFileSync(kernelPath, newBuf);
        logger$7.info("kernel 已修补,共应用 " + patches.length + " 条规则");
      } else {
        logger$7.info("kernel 无变化(所有规则均未匹配)");
      }
      return { success: true, patches, output: "success" };
    } catch (e) {
      logger$7.error("kernel 修补失败: " + e.message);
      return { success: false, patches, error: e.message, output: "Error" };
    }
  }
  async patchAsync(kernelPath) {
    const result = this.patch(kernelPath);
    if (!result.success || !result.output.includes("success")) {
      throw new Error("patch_boot 失败: " + (result.error ?? result.output));
    }
    return result;
  }
}
const bootPatcher = new BootPatcherClass();
const logger$6 = {
  info: (...args) => console.log("[RootService]", ...args),
  warn: (...args) => console.warn("[RootService]", ...args),
  error: (...args) => console.error("[RootService]", ...args)
};
const MAX_LOGS = 800;
class RootServiceClass {
  constructor() {
    this.tasks = /* @__PURE__ */ new Map();
    this.bus = new node_events.EventEmitter();
  }
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
      progress: 0
    };
    this.tasks.set(taskId, ctx);
    logger$6.info(`Root 任务已启动: ${taskId}`, JSON.stringify(options));
    setImmediate(() => {
      this.run(ctx).catch((e) => this.fail(ctx, e));
    });
    return taskId;
  }
  async pause(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error("任务不存在: " + taskId);
    ctx.paused = true;
    this.log(ctx, "info", "用户已暂停，将在下一个阶段边界停止");
    this.emit(ctx);
  }
  async resume(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error("任务不存在: " + taskId);
    ctx.paused = false;
    this.log(ctx, "info", "用户已恢复");
    this.emit(ctx);
  }
  async cancel(taskId) {
    const ctx = this.tasks.get(taskId);
    if (!ctx) throw new Error("任务不存在: " + taskId);
    ctx.cancelled = true;
    this.log(ctx, "warn", "用户已取消");
    this.emit(ctx);
  }
  getContext(taskId) {
    return this.tasks.get(taskId) ?? null;
  }
  async run(ctx) {
    try {
      await this.checkDevice(ctx);
      await this.readDeviceInfo(ctx);
      await this.enterEdl(ctx);
      await this.readBoot(ctx);
      await this.patchBoot(ctx);
      await this.flashPatchedBoot(ctx);
      await this.waitForSystem(ctx);
      await this.installRootApps(ctx);
      await this.finish(ctx);
    } catch (e) {
      this.fail(ctx, e);
    }
  }
  async checkDevice(ctx) {
    this.setStage(ctx, "detecting-device", 5);
    const device = DeviceService.instance.getCurrentDevice();
    if (!device) throw new Error("未检测到设备");
    ctx.device = device;
    this.log(ctx, "info", `当前设备: ${device.type} ${device.serial}`);
  }
  async readDeviceInfo(ctx) {
    this.setStage(ctx, "reading-device-info", 12);
    ctx.innermodel = ctx.options.innermodel || ctx.device?.innermodel || "";
    ctx.sdkVersion = String(ctx.options.sdkBranch || ctx.device?.sdkVersion || "");
    if (!ctx.innermodel) throw new Error("请选择型号");
    ctx.isV3 = checkIsV3(ctx.innermodel, ctx.options.softVersion || ctx.device?.softVersion || "");
    ctx.androidVersion = ctx.device?.androidVersion || "";
    this.log(ctx, "info", `型号=${ctx.innermodel}, SDK=${ctx.sdkVersion}, isV3=${ctx.isV3}`);
  }
  async enterEdl(ctx) {
    this.setStage(ctx, "entering-edl", 20);
    const device = DeviceService.instance.getCurrentDevice();
    if (device?.type === "qcom_edl") {
      ctx.edlPort = device.port;
      this.log(ctx, "info", "设备已在 EDL 模式: " + ctx.edlPort);
      return;
    }
    if (device?.type === "adb") {
      this.log(ctx, "info", "从 ADB 重启到 EDL 9008...");
      await adbService.reboot("", "edl");
    } else if (device?.type === "fastboot") {
      this.log(ctx, "info", "从 Fastboot 重启到 EDL...");
      await fastbootService.reboot("edl");
    } else {
      throw new Error("当前设备状态不支持进入 EDL: " + (device?.type || "unknown"));
    }
    ctx.edlPort = await edlService.waitForEdl(9e4);
    this.log(ctx, "info", "EDL 端口: " + ctx.edlPort);
  }
  async readBoot(ctx) {
    this.setStage(ctx, "reading-boot", 30);
    const workDir = path.join(electron.app.getPath("userData"), "edl_work");
    const resourceDir = path.join(paths.cache, "edl_work");
    if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true, force: true });
    fs.mkdirSync(workDir, { recursive: true });
    if (fs.existsSync(resourceDir)) {
      fs.cpSync(resourceDir, workDir, { recursive: true, force: true });
      this.log(ctx, "info", "已合并 Root 资源目录: " + resourceDir);
    }
    ctx.workDir = workDir;
    const loader = path.join(paths.edl, ctx.isV3 ? "msm8937.mbn" : "msm8909w.mbn");
    if (!fs.existsSync(loader)) throw new Error("Firehose loader 不存在: " + loader);
    await edlService.loadFirehose(loader, ctx.edlPort);
    const bootPath = path.join(workDir, "boot.img");
    this.log(ctx, "info", "读取 boot 分区...");
    const result = await edlPartitionService.backupPartition({
      loader,
      label: "boot",
      outputFile: bootPath,
      onProgress: (msg) => this.log(ctx, "info", msg)
    });
    if (!result.success || !fs.existsSync(bootPath)) {
      throw new Error("读取 boot 分区失败: " + (result.error || "文件未生成"));
    }
    ctx.bootPath = bootPath;
    this.log(ctx, "info", "boot 已读取: " + bootPath);
  }
  async patchBoot(ctx) {
    this.setStage(ctx, "patching-boot", 45);
    const magiskVer = ctx.sdkVersion === "19" ? 21 : 25;
    const outputPath = path.join(ctx.workDir, "boot_patched.img");
    this.log(ctx, "info", `使用 Magisk ${magiskVer} 修补 boot...`);
    const result = await magiskPatcher.patch(ctx.bootPath, outputPath, magiskVer, ctx.workDir, ctx.taskId);
    if (!result.success || !fs.existsSync(outputPath)) {
      throw new Error("boot 修补失败: " + (result.error || "输出文件未生成"));
    }
    ctx.patchedBoot = outputPath;
    const unpackDir = path.join(ctx.workDir, "ramdisk");
    if (fs.existsSync(unpackDir)) fs.rmSync(unpackDir, { recursive: true, force: true });
    fs.mkdirSync(unpackDir, { recursive: true });
    try {
      const { spawn } = await import("node:child_process");
      const magiskboot2 = path.join(paths.bin, "magiskboot.exe");
      await new Promise((resolve, reject) => {
        const proc = spawn(magiskboot2, ["unpack", "-h", outputPath], { cwd: unpackDir, windowsHide: true });
        proc.on("error", reject);
        proc.on("close", (code) => code === 0 ? resolve() : reject(new Error("magiskboot unpack 失败: " + code)));
      });
      const kernel = path.join(unpackDir, "kernel");
      if (fs.existsSync(kernel)) {
        await bootPatcher.patchAsync(kernel);
        await new Promise((resolve, reject) => {
          const proc = spawn(magiskboot2, ["repack", outputPath, "boot_patched.img"], { cwd: unpackDir, windowsHide: true });
          proc.on("error", reject);
          proc.on("close", (code) => code === 0 ? resolve() : reject(new Error("magiskboot repack 失败: " + code)));
        });
        fs.copyFileSync(path.join(unpackDir, "boot_patched.img"), outputPath);
      }
      this.log(ctx, "info", "内核补丁完成");
    } catch (e) {
      this.log(ctx, "warn", "内核补丁步骤跳过: " + e.message);
    }
    this.log(ctx, "info", "boot 修补完成: " + outputPath);
  }
  async flashPatchedBoot(ctx) {
    this.setStage(ctx, "flashing-boot", 60);
    path.join(paths.edl, ctx.isV3 ? "msm8937.mbn" : "msm8909w.mbn");
    const workDir = ctx.workDir;
    const image = ctx.patchedBoot;
    const targetName = ctx.isV3 ? "boot.img" : "sboot.img";
    fs.copyFileSync(image, path.join(workDir, targetName));
    const rawXml = path.join(paths.edl, "rooting", "boot.xml");
    if (fs.existsSync(rawXml)) {
      const xml = fs.readFileSync(rawXml, "utf-8");
      const adjusted = xml.replace(/filename="[^"]*"/g, `filename="${targetName}"`);
      fs.writeFileSync(path.join(workDir, "boot.xml"), adjusted);
      this.log(ctx, "info", "刷入修补后的 boot...");
      await edlService.flashPartitions([path.join(workDir, "boot.xml")], ctx.edlPort, (msg) => this.log(ctx, "info", msg), workDir);
    } else {
      this.log(ctx, "warn", "缺少 boot.xml，尝试直接按分区名刷入 boot");
      const { spawn } = await import("node:child_process");
      const edlNg = path.join(paths.bin, "edl-ng", "edl-ng.exe");
      const loader2 = path.join(paths.edl, ctx.isV3 ? "msm8937.mbn" : "msm8909w.mbn");
      await new Promise((resolve, reject) => {
        const proc = spawn(edlNg, ["--loader", loader2, "--memory", "Sdcc", "write-part", "boot", image], { cwd: path.dirname(edlNg), windowsHide: true });
        proc.on("error", reject);
        proc.on("close", (code) => code === 0 ? resolve() : reject(new Error("edl-ng write-part 失败: " + code)));
      });
    }
    this.log(ctx, "info", "重启设备...");
    await edlService.reboot(ctx.edlPort);
  }
  async waitForSystem(ctx) {
    this.setStage(ctx, "waiting-boot", 75);
    const device = await DeviceService.instance.waitFor(["adb", "fastboot"], 3e5);
    ctx.device = device;
    this.log(ctx, "info", "设备已重新连接: " + device.type);
    if (device.type === "adb") {
      await adbService.waitForBoot(3e5);
      this.log(ctx, "info", "系统已启动");
    }
  }
  async installRootApps(ctx) {
    this.setStage(ctx, "installing-root-apps", 88);
    const apksDir = path.join(ctx.workDir, "apks");
    if (fs.existsSync(apksDir)) {
      for (const name of fs.readdirSync(apksDir).filter((f) => f.toLowerCase().endsWith(".apk"))) {
        this.log(ctx, "info", "安装: " + name);
        const result = await adbService.install("", path.join(apksDir, name));
        if (!result.success) this.log(ctx, "warn", `${name} 安装失败: ${result.error}`);
      }
    } else {
      this.log(ctx, "warn", "Root 资源没有 apks 目录，跳过应用安装");
    }
    const moduleCandidates = [
      path.join(paths.cache, "xtcpatch.zip"),
      path.join(paths.cache, "systemui.zip")
    ];
    for (const modulePath of moduleCandidates) {
      if (!fs.existsSync(modulePath)) {
        this.log(ctx, "warn", "模块不存在，跳过: " + modulePath);
        continue;
      }
      this.log(ctx, "info", "刷入模块: " + path.basename(modulePath));
      const result = await magiskService.install(modulePath, "magisk");
      if (!result.success) this.log(ctx, "warn", path.basename(modulePath) + " 刷入失败: " + result.error);
    }
  }
  async finish(ctx) {
    this.setStage(ctx, "completed", 100);
    this.log(ctx, "info", "Root 流程完成");
    if (ctx.device?.type === "adb") {
      try {
        await adbService.reboot("", "system");
      } catch {
      }
    }
    this.cleanup(ctx);
  }
  setStage(ctx, stage, progress2) {
    ctx.stage = stage;
    ctx.progress = progress2;
    this.log(ctx, "info", `→ ${stage}`);
    this.emit(ctx);
  }
  fail(ctx, e) {
    ctx.stage = "failed";
    ctx.error = { stage: ctx.stage, message: e.message, recoverable: false };
    this.log(ctx, "error", "Root 流程失败: " + e.message);
    this.emit(ctx);
    this.cleanup(ctx);
  }
  cleanup(ctx) {
    const timer = setTimeout(() => this.tasks.delete(ctx.taskId), 30 * 60 * 1e3);
    timer.unref?.();
  }
  log(ctx, level, msg) {
    const entry = { ts: Date.now(), level, msg };
    ctx.logs.push(entry);
    if (ctx.logs.length > MAX_LOGS) ctx.logs.shift();
    if (level === "error") logger$6.error(msg);
    else if (level === "warn") logger$6.warn(msg);
    else logger$6.info(msg);
  }
  emit(ctx) {
    for (const win of electron.BrowserWindow.getAllWindows()) {
      if (!win.isDestroyed()) win.webContents.send("root:stage-change", ctx);
    }
  }
}
const rootService = new RootServiceClass();
function registerRootIpc() {
  electron.ipcMain.handle(
    "root:start",
    wrap(async (_event, options) => {
      return rootService.start(options);
    })
  );
  electron.ipcMain.handle(
    "root:cancel",
    wrap(async (_event, { taskId }) => {
      return rootService.cancel(taskId);
    })
  );
  electron.ipcMain.handle(
    "root:pause",
    wrap(async (_event, { taskId }) => {
      return rootService.pause(taskId);
    })
  );
  electron.ipcMain.handle(
    "root:resume",
    wrap(async (_event, { taskId }) => {
      return rootService.resume(taskId);
    })
  );
  electron.ipcMain.handle(
    "root:get-context",
    wrap(async (_event, { taskId }) => {
      return rootService.getContext(taskId);
    })
  );
}
const logger$5 = {
  info: (...args) => console.log("[ScrcpyService]", ...args),
  warn: (...args) => console.warn("[ScrcpyService]", ...args),
  error: (...args) => console.error("[ScrcpyService]", ...args)
};
class ScrcpyServiceClass extends node_events.EventEmitter {
  constructor() {
    super(...arguments);
    this.scrcpyPath = path.join(paths.bin, "scrcpy.exe");
    this.running = /* @__PURE__ */ new Map();
  }
  async launch(serial, opts = {}) {
    const args = this.buildArgs(serial, opts);
    logger$5.info("启动 scrcpy: " + args.join(" "));
    const proc = node_child_process.spawn(this.scrcpyPath, args, {
      cwd: paths.bin,
      windowsHide: false,
      detached: false
    });
    const pid = proc.pid ?? -1;
    const entry = {
      pid,
      serial: serial || "",
      opts,
      startedAt: Date.now(),
      process: proc
    };
    this.running.set(pid, entry);
    this.emit("process-change", { type: "launch", pid, serial });
    proc.on("error", (err) => {
      logger$5.error("scrcpy 启动失败: " + err.message);
      this.running.delete(pid);
      this.emit("process-change", { type: "exit", pid });
    });
    proc.on("exit", (code) => {
      logger$5.info(`scrcpy 退出(pid=${pid}, code=${code})`);
      if (this.running.has(pid)) {
        this.running.delete(pid);
        this.emit("process-change", { type: "exit", pid, code });
      }
    });
    return pid;
  }
  async stop(pid) {
    const entry = this.running.get(pid);
    if (!entry) {
      logger$5.warn("scrcpy pid=" + pid + " 不存在");
      return;
    }
    this.running.delete(pid);
    try {
      entry.process.kill();
      logger$5.info("已停止 scrcpy pid=" + pid);
    } catch (e) {
      logger$5.error("停止 scrcpy 失败: " + e.message);
    }
    this.emit("process-change", { type: "exit", pid });
  }
  async stopAll() {
    for (const pid of Array.from(this.running.keys())) {
      await this.stop(pid);
    }
  }
  listRunning() {
    return Array.from(this.running.values()).map((e) => ({
      pid: e.pid,
      serial: e.serial,
      opts: e.opts,
      startedAt: e.startedAt
    }));
  }
  buildArgs(serial, opts = {}) {
    const args = [];
    if (serial) args.push("-s", serial);
    if (opts.noControl) args.push("--no-control");
    if (opts.turnScreenOff) args.push("--turn-screen-off");
    if (opts.stayAwake) args.push("--stay-awake");
    if (opts.record) args.push("--record", String(opts.record));
    if (opts.noAudio) args.push("--no-audio");
    if (opts.audio) args.push("--audio");
    if (opts.noClipboardAutosync) args.push("--no-clipboard-autosync");
    if (opts.legacyPaste) args.push("--legacy-paste");
    if (opts.showTouches) args.push("--show-touches");
    if (opts.maxFps) args.push("--max-fps", String(opts.maxFps));
    if (opts.alwaysOnTop) args.push("--always-on-top");
    if (opts.fullscreen) args.push("--fullscreen");
    if (opts.windowBorderless) args.push("--window-borderless");
    if (opts.recordFormat) args.push("--record-format", String(opts.recordFormat));
    if (opts.bitRate) args.push("--bit-rate", String(opts.bitRate));
    if (opts.crop) args.push("--crop", String(opts.crop));
    if (opts.windowTitle) args.push("--window-title", String(opts.windowTitle));
    if (opts.maxSize) args.push("--max-size", String(opts.maxSize));
    return args;
  }
}
const scrcpyService = new ScrcpyServiceClass();
function registerScrcpyIpc() {
  electron.ipcMain.handle(
    "scrcpy:launch",
    wrap(async (_event, { serial, options }) => {
      return scrcpyService.launch(serial, options || {});
    })
  );
  electron.ipcMain.handle(
    "scrcpy:stop",
    wrap(async (_event, { pid }) => {
      return scrcpyService.stop(pid);
    })
  );
  electron.ipcMain.handle(
    "scrcpy:stop-all",
    wrap(async () => {
      return scrcpyService.stopAll();
    })
  );
  electron.ipcMain.handle(
    "scrcpy:list",
    wrap(async () => {
      return scrcpyService.listRunning();
    })
  );
  electron.ipcMain.handle(
    "scrcpy:subscribe",
    wrap(async (event) => {
      const win = electron.BrowserWindow.fromWebContents(event.sender);
      const handler = (data) => {
        if (win && !win.isDestroyed()) {
          win.webContents.send("scrcpy:process-change", data);
        }
      };
      scrcpyService.on("process-change", handler);
      event.sender.on("destroyed", () => {
        scrcpyService.off("process-change", handler);
      });
    })
  );
}
const DEFAULT_SETTINGS = {
  windowOpacity: 100,
  speedStart: false,
  checkUpdateTime: 1,
  detailedLog: false,
  infoEn: false,
  onUserDebug: false,
  showDisclaimerOnStart: true,
  agentApiUrl: "",
  agentApiKey: "",
  agentModel: "gpt-4o-mini",
  agentEnabled: false
};
const APP_META = {
  name: "iMooAgentTool",
  version: "1.1.1",
  buildDate: "2026-11-07",
  copyright: "Copyright (C) 2026 J1ao",
  author: "J1ao",
  authorQQ: "",
  authorEmail: "",
  basedOn: "AllToolBox 1.3.8fix1（业务逻辑参考）"
};
const store = new Store({
  name: "imooagenttool-config",
  defaults: {
    settings: { ...DEFAULT_SETTINGS },
    windowBounds: { x: 0, y: 0, width: 1200, height: 800 },
    lastDeviceSerial: "",
    windowOpacity: 100
  }
});
const config = {
  get(key) {
    return store.get(key);
  },
  set(key, value) {
    store.set(key, value);
  },
  reset() {
    store.clear();
  },
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...store.get("settings") };
  },
  setSettings(partial) {
    const current = this.getSettings();
    const merged = { ...current, ...partial };
    store.set("settings", merged);
    return merged;
  }
};
const SRC$1 = "ResourceService";
class ResourceService {
  verify(manifestPath, resourceDir) {
    const results = [];
    if (!fs$1.existsSync(manifestPath)) {
      logger$i.error(SRC$1, `Manifest not found: ${manifestPath}`);
      return results;
    }
    let manifest;
    try {
      const raw = fs$1.readFileSync(manifestPath, "utf-8");
      const parsed = JSON.parse(raw);
      manifest = Array.isArray(parsed) ? parsed : parsed.files || parsed.entries || [];
    } catch (err) {
      logger$i.error(SRC$1, `Failed to parse manifest: ${err.message}`);
      return results;
    }
    for (const entry of manifest) {
      const filePath = path.join(resourceDir, entry.file);
      const result = {
        file: entry.file,
        ok: false,
        expected: entry.md5,
        actual: "",
        missing: false
      };
      if (!fs$1.existsSync(filePath)) {
        result.missing = true;
        result.actual = "FILE_NOT_FOUND";
        results.push(result);
        continue;
      }
      try {
        const fileBuffer = fs$1.readFileSync(filePath);
        const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");
        result.actual = hash;
        result.ok = hash.toLowerCase() === entry.md5.toLowerCase();
      } catch (err) {
        result.actual = `ERROR: ${err.message}`;
      }
      results.push(result);
    }
    const okCount = results.filter((r) => r.ok).length;
    logger$i.info(SRC$1, `Verified ${results.length} resources: ${okCount} OK, ${results.length - okCount} failed`);
    return results;
  }
  verifySingle(filePath, expectedMd5) {
    if (!fs$1.existsSync(filePath)) return false;
    try {
      const fileBuffer = fs$1.readFileSync(filePath);
      const hash = crypto.createHash("md5").update(fileBuffer).digest("hex");
      return hash.toLowerCase() === expectedMd5.toLowerCase();
    } catch {
      return false;
    }
  }
  md5(filePath) {
    if (!fs$1.existsSync(filePath)) return null;
    try {
      const fileBuffer = fs$1.readFileSync(filePath);
      return crypto.createHash("md5").update(fileBuffer).digest("hex");
    } catch {
      return null;
    }
  }
}
const resourceService = new ResourceService();
function registerSystemIpc() {
  electron.ipcMain.handle(
    "system:get-settings",
    wrap(async () => {
      return config.getSettings();
    })
  );
  electron.ipcMain.handle(
    "system:set-settings",
    wrap(async (_event, settings) => {
      return config.setSettings(settings);
    })
  );
  electron.ipcMain.handle(
    "system:pick-file",
    wrap(async (_event, { kind, filter, multi }) => {
      const options = {};
      if (kind === "folder") {
        options.properties = ["openDirectory"];
      } else {
        options.properties = multi ? ["openFile", "multiSelections"] : ["openFile"];
        if (filter) options.filters = [{ name: "Filter", extensions: filter.split(",") }];
      }
      const result = await electron.dialog.showOpenDialog(options);
      if (result.canceled || result.filePaths.length === 0) return null;
      if (multi) return result.filePaths;
      return result.filePaths[0];
    })
  );
  electron.ipcMain.handle(
    "system:open-external",
    wrap(async (_event, { url }) => {
      await electron.shell.openExternal(url);
    })
  );
  electron.ipcMain.handle(
    "system:show-in-folder",
    wrap(async (_event, { path: p }) => {
      electron.shell.showItemInFolder(p);
    })
  );
  electron.ipcMain.handle(
    "system:verify-resources",
    wrap(async () => {
      return resourceService.verify(path.join(paths.resources, "manifest.json"), paths.resources);
    })
  );
  electron.ipcMain.handle(
    "system:get-version",
    wrap(async () => {
      return { version: APP_META.version, buildDate: APP_META.buildDate };
    })
  );
  electron.ipcMain.handle(
    "system:set-window-opacity",
    wrap(async (_event, opacity) => {
      const win = electron.BrowserWindow.getFocusedWindow();
      if (win) win.setOpacity(Math.max(0.2, Math.min(1, opacity)));
    })
  );
  electron.ipcMain.handle(
    "system:window-minimize",
    wrap(async () => {
      const win = electron.BrowserWindow.getFocusedWindow();
      if (win) win.minimize();
    })
  );
  electron.ipcMain.handle(
    "system:window-toggle-maximize",
    wrap(async () => {
      const win = electron.BrowserWindow.getFocusedWindow();
      if (!win) return;
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    })
  );
  electron.ipcMain.handle(
    "system:window-close",
    wrap(async () => {
      const win = electron.BrowserWindow.getFocusedWindow();
      if (win) win.close();
    })
  );
  electron.ipcMain.handle(
    "system:window-is-maximized",
    wrap(async () => {
      const win = electron.BrowserWindow.getFocusedWindow();
      return win ? win.isMaximized() : false;
    })
  );
  electron.ipcMain.handle(
    "system:open-terminal",
    wrap(async (_event, { cwd }) => {
      const terminal = process.env.COMSPEC || "cmd.exe";
      const childProcess = await import("child_process");
      childProcess.exec(`start "${terminal}" ${cwd ? `/D "${cwd}"` : ""}`, { cwd });
    })
  );
}
const logger$4 = {
  info: (...args) => console.log("[DriverService]", ...args),
  warn: (...args) => console.warn("[DriverService]", ...args),
  error: (...args) => console.error("[DriverService]", ...args)
};
const TIMEOUT$2 = {
  flash: 6e4,
  install: 12e4
};
class DriverServiceClass {
  async check() {
    const qualcomm = await this.existsGlobInDir("qdbusb*") || await this.existsGlobInDir("qcfilter*") || await this.existsGlobInDir("qcmbn*");
    const adb = await this.existsGlobInDir("android_winusb.inf*");
    const vcRuntime = await this.existsGlobInSystem32("mfc100*") && await this.existsGlobInSystem32("mfc110*") && await this.existsGlobInSystem32("mfc120*");
    logger$4.info(`驱动检查: qualcomm=${qualcomm}, adb=${adb}, vc=${vcRuntime}`);
    return [
      { name: "Qualcomm 9008 驱动", installed: qualcomm },
      { name: "ADB 驱动", installed: adb },
      { name: "VC++ 运行库", installed: vcRuntime }
    ];
  }
  async installDrivers() {
    const steps = [
      { name: "检查驱动状态", status: "pending", message: "" },
      { name: "下载 drivers.zip(若未下载)", status: "pending", message: "" },
      { name: "安装 ADB 驱动(pnputil)", status: "pending", message: "" },
      { name: "安装 Qualcomm 9008 驱动(9008.bat)", status: "pending", message: "" },
      { name: "安装 VC 运行库(vc.exe)", status: "pending", message: "" }
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
    const status = await this.check();
    const byName = (name) => status.find((s) => s.name.includes(name))?.installed ?? false;
    const ok0 = await runStep(0, async () => void 0);
    if (!ok0) return { success: false, steps, error: steps[0].message };
    const driversDir = path.join(paths.resources, "drivers");
    if (fs.existsSync(driversDir)) {
      skipStep(1, "drivers 已存在,跳过下载");
    } else {
      const ok = await runStep(1, async () => {
        await cloudService.download("drivers");
      });
      if (!ok) logger$4.warn("下载 drivers 失败: " + steps[1].message);
    }
    if (byName("ADB")) {
      skipStep(2, "ADB 驱动已安装");
    } else {
      const ok = await runStep(2, async () => {
        const infPath = path.join(driversDir, "adb", "android_winusb.inf");
        if (!fs.existsSync(infPath)) throw new Error("ADB 驱动 inf 不存在: " + infPath);
        await subprocessPool.spawn({
          cmd: "pnputil.exe",
          args: ["/add-driver", infPath, "/install"],
          encoding: "gbk",
          timeout: TIMEOUT$2.flash
        });
      });
      if (!ok) logger$4.warn("ADB 驱动安装失败: " + steps[2].message);
    }
    if (byName("Qualcomm")) {
      skipStep(3, "Qualcomm 9008 驱动已安装");
    } else {
      const ok = await runStep(3, async () => {
        const batPath = path.join(driversDir, "9008", "9008.bat");
        if (!fs.existsSync(batPath)) throw new Error("9008.bat 不存在: " + batPath);
        await subprocessPool.spawn({
          cmd: "cmd.exe",
          args: ["/c", batPath],
          encoding: "gbk",
          timeout: TIMEOUT$2.install,
          cwd: path.dirname(batPath)
        });
      });
      if (!ok) logger$4.warn("Qualcomm 驱动安装失败: " + steps[3].message);
    }
    if (byName("VC++")) {
      skipStep(4, "VC 运行库已安装");
    } else {
      const ok = await runStep(4, async () => {
        const vcPath = path.join(driversDir, "vc.exe");
        if (!fs.existsSync(vcPath)) throw new Error("vc.exe 不存在: " + vcPath);
        await subprocessPool.spawn({
          cmd: vcPath,
          args: [],
          encoding: "gbk",
          timeout: TIMEOUT$2.install
        });
      });
      if (!ok) logger$4.warn("VC 运行库安装失败: " + steps[4].message);
    }
    return { success: true, steps };
  }
  async existsGlobInDir(glob) {
    const baseDir = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "DriverStore", "FileRepository");
    return this.existsGlob(baseDir, glob);
  }
  async existsGlobInSystem32(glob) {
    const baseDir = path.join(process.env.SystemRoot ?? "C:\\Windows", "System32");
    return this.existsGlob(baseDir, glob);
  }
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
const driverService = new DriverServiceClass();
const logger$3 = {
  info: (...args) => console.log("[OtaService]", ...args),
  warn: (...args) => console.warn("[OtaService]", ...args),
  error: (...args) => console.error("[OtaService]", ...args)
};
const TIMEOUT$1 = {
  shell: 1e4,
  fileOp: 15e3
};
class OtaServiceClass {
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
      const devices = await adbService.devices();
      if (devices.length === 0) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[0].message };
    ok = await runStep(1, async () => {
      innermodel = await adbService.getProp("", "ro.product.innermodel");
      softVersion = await adbService.getProp("", "ro.product.current.softversion");
      const model = await adbService.getProp("", "ro.product.model");
      logger$3.info("设备 innermodel=" + innermodel + ", model=" + model + ", softversion=" + softVersion);
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
      const result = await subprocessPool.spawn({
        cmd: process.platform === "win32" ? path.join(paths.bin, "adb.exe") : "adb",
        args: ["root"],
        encoding: "gbk",
        timeout: TIMEOUT$1.shell,
        cwd: paths.bin
      });
      if (!result.stdout.includes("restarting") && !result.stdout.includes("already")) {
        throw new Error("当前不是 QMMI 状态下!");
      }
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[3].message };
    ok = await runStep(4, async () => {
      await adbService.shell("", "rm -rf /data/ota*");
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[4].message };
    ok = await runStep(5, async () => {
      await adbService.shell("", "mkdir -p /sdcard/xtc");
      await adbService.push("", opts.zipPath, "/sdcard/xtc/ota_f_vota.zip");
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[5].message };
    ok = await runStep(6, async () => {
      await adbService.shell("", "am start -n com.xtc.setting/.module.secretcode.view.activity.OfflineOtaActivity");
    });
    if (!ok) return { success: false, steps, scrcpyStarted: false, error: steps[6].message };
    let scrcpyStarted = false;
    await runStep(7, async () => {
      const pid = await scrcpyService.launch("", {
        stayAwake: true,
        showTouches: true,
        windowTitle: '请点击手表上的"开始升级"'
      });
      if (pid > 0) {
        scrcpyStarted = true;
        logger$3.info("已启动 scrcpy (pid=" + pid + ') 引导用户点击"开始升级"');
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
const otaService = new OtaServiceClass();
const logger$2 = {
  info: (...args) => console.log("[RootProService]", ...args),
  warn: (...args) => console.warn("[RootProService]", ...args),
  error: (...args) => console.error("[RootProService]", ...args)
};
class RootProServiceClass {
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
    const result = { success: false, supported: false, steps };
    let ok = await runStep(0, async () => {
      const devices = await adbService.devices();
      if (devices.length === 0) {
        throw new Error("未检测到 ADB 设备");
      }
    });
    if (!ok) {
      result.error = steps[0].message;
      return result;
    }
    ok = await runStep(1, async () => {
      await adbService.waitForBoot(12e4);
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
      innermodel = await adbService.getProp("", "ro.product.innermodel");
      model = await adbService.getProp("", "ro.product.model");
      androidVersion = await adbService.getProp("", "ro.build.version.release");
      sdkVersion = await adbService.getProp("", "ro.build.version.sdk");
      softVersion = await adbService.getProp("", "ro.product.current.softversion");
      logger$2.info("innermodel=" + innermodel + ", model=" + model + ", android=" + androidVersion + ", sdk=" + sdkVersion + ", version=" + softVersion);
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
      logger$2.info("isV3=" + isV3);
    });
    if (!ok) {
      result.error = steps[4].message;
      return result;
    }
    let haveSystemUI = false;
    ok = await runStep(5, async () => {
      const out = await adbService.shell("", "pm path com.android.systemui");
      haveSystemUI = out.trim().length > 0 && out.includes("package:");
      result.haveSystemUI = haveSystemUI;
      logger$2.info("haveSystemUI=" + haveSystemUI);
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
      if (!ok) logger$2.warn("安装拓展应用包失败: " + steps[6].message);
    }
    if (!options.installDesktop) {
      skipStep(7, "用户未选择");
    } else {
      ok = await runStep(7, async () => {
        await this.installDesktopApk(isV3, haveSystemUI);
      });
      if (!ok) logger$2.warn("安装桌面失败: " + steps[7].message);
    }
    if (!options.installMods) {
      skipStep(8, "用户未选择");
    } else {
      ok = await runStep(8, async () => {
        await this.installRootProMods();
      });
      if (!ok) logger$2.warn("安装 magisk 模块失败: " + steps[8].message);
    }
    result.success = true;
    logger$2.info("Root 后优化全部完成");
    return result;
  }
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
        logger$2.warn("APK 不存在,跳过: " + apkPath);
        continue;
      }
      logger$2.info("安装拓展应用: " + line);
      const result = await adbService.install(apkPath, "install");
      if (!result.success) {
        logger$2.warn("安装失败: " + line);
      }
    }
  }
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
      throw new Error("桌面 APK 不存在: " + apkName);
    }
    logger$2.info("安装禁用模式切换桌面: " + apkName + "(isv3=" + isV3 + ", havesystemui=" + haveSystemUI + ")");
    const result = await adbService.install(apkPath, "install");
    if (!result.success) {
      throw new Error("安装桌面失败: " + apkName);
    }
  }
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
        logger$2.warn("模块 zip 不存在,跳过: " + zipPath);
        continue;
      }
      logger$2.info("刷入拓展 magisk 模块: " + line);
      const result = await magiskService.install(zipPath, "magisk");
      if (!result.success) {
        logger$2.warn("模块安装失败: " + line + " - " + result.error);
      }
    }
  }
}
const rootProService = new RootProServiceClass();
const logger$1 = {
  info: (...args) => console.log("[AtbmodService]", ...args),
  warn: (...args) => console.warn("[AtbmodService]", ...args),
  error: (...args) => console.error("[AtbmodService]", ...args),
  debug: (...args) => console.debug("[AtbmodService]", ...args)
};
const TIMEOUT = {
  flash: 6e4,
  transfer: 3e5
};
class AtbmodServiceClass {
  get modDir() {
    return path.join(paths.bin, "mod");
  }
  get sevenZip() {
    return path.join(paths.bin, "7z.exe");
  }
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
      logger$1.warn("扫描 .atbmod 文件失败: " + e.message);
    }
    return result;
  }
  async install(file, serial) {
    if (!fs.existsSync(file)) {
      return { success: false, error: "文件已不存在,跳过" };
    }
    if (!fs.existsSync(this.modDir)) {
      fs.mkdirSync(this.modDir, { recursive: true });
    }
    const nutime = String(Date.now());
    const tempDir = path.join(this.modDir, "atbmod_" + nutime + "_tmp");
    fs.mkdirSync(tempDir, { recursive: true });
    try {
      await subprocessPool.spawn({
        cmd: this.sevenZip,
        args: ["x", file, "-o" + tempDir, "-y"],
        encoding: "utf-8",
        timeout: TIMEOUT.flash,
        cwd: paths.bin
      });
    } catch (e) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "解压失败,模块可能已损坏: " + e.message };
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
    logger$1.info("模块名称: " + prop.modname + ", 版本: " + prop.modversion + ", 类型: " + prop.modtype);
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
        const result = await subprocessPool.spawn({
          cmd: "cmd.exe",
          args: ["/c", installer],
          encoding: "gbk",
          timeout: TIMEOUT.transfer,
          cwd: tempDir,
          onStdout: (line) => logger$1.debug("atbmod install: " + line)
        });
        exitCode = result.exitCode ?? 0;
      } else {
        const result = await subprocessPool.spawn({
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
      return { success: false, error: "安装出错: " + e.message };
    }
    if (exitCode !== 0) {
      this.rmdir(tempDir);
      this.markAsEnd(file);
      return { success: false, error: "安装出错,错误码 " + exitCode };
    }
    const targetDir = path.join(this.modDir, prop.modid);
    if (fs.existsSync(targetDir)) {
      const oldDir = path.join(this.modDir, prop.modid + "_old");
      if (fs.existsSync(oldDir)) {
        this.rmdir(oldDir);
      }
      fs.renameSync(targetDir, oldDir);
    }
    fs.renameSync(tempDir, targetDir);
    this.markAsEnd(file);
    logger$1.info("模块安装完成: " + prop.modid);
    return { success: true, modid: prop.modid };
  }
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
      const item = { modid: entry.name, dir, hasProp };
      if (hasProp) {
        item.prop = this.parseProp(propPath);
      }
      result.push(item);
    }
    return result;
  }
  async uninstall(modid, serial) {
    const targetDir = path.join(this.modDir, modid);
    if (!fs.existsSync(targetDir)) {
      return { success: false, error: "模块不存在: " + modid };
    }
    try {
      this.rmdir(targetDir);
      logger$1.info("已卸载 atbmod 模块: " + modid);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
  parseProp(propPath) {
    const prop = { modid: "", modname: "", modversion: "", modversioncode: "", modtype: "" };
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
      logger$1.warn("解析 atbmod.prop 失败: " + e.message);
    }
    return prop;
  }
  rmdir(dir) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (e) {
      logger$1.warn("删除目录失败: " + dir + " - " + e.message);
    }
  }
  markAsEnd(file) {
    try {
      fs.renameSync(file, file + ".end");
    } catch (e) {
      logger$1.warn("重命名 .atbmod 为 .end 失败: " + e.message);
    }
  }
}
const atbmodService = new AtbmodServiceClass();
const SRC = "UpdateService";
class UpdateService {
  async checkForUpdate() {
    const currentVersion = APP_META.version;
    const result = {
      hasUpdate: false,
      currentVersion
    };
    try {
      const response = await fetch(
        "https://api.github.com/repos/Onesoft-J1ao/iMooAgentTool/releases/latest",
        {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(1e4)
        }
      );
      if (!response.ok) {
        result.error = `GitHub API returned ${response.status}`;
        return result;
      }
      const data = await response.json();
      const latestVersion = (data.tag_name || data.name || "").replace(/^v/, "").trim();
      if (!latestVersion) {
        result.error = "Could not parse latest version";
        return result;
      }
      result.latestVersion = latestVersion;
      result.releaseNotes = data.body || "";
      result.releaseUrl = data.html_url || "";
      const currentParts = currentVersion.split(".").map(Number);
      const latestParts = latestVersion.split(".").map(Number);
      for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
        const cp = currentParts[i] || 0;
        const lp = latestParts[i] || 0;
        if (lp > cp) {
          result.hasUpdate = true;
          break;
        }
        if (lp < cp) break;
      }
    } catch (err) {
      result.error = err.message || "Network error";
      logger$i.warn(SRC, `Update check failed: ${result.error}`);
    }
    return result;
  }
}
const updateService = new UpdateService();
function registerToolsIpc() {
  electron.ipcMain.handle("tools:open-charge", wrap(async (_event, serial) => {
    return adbService.shell(serial, "svc power stayon true");
  }));
  electron.ipcMain.handle("tools:read-build-props", wrap(async (_event, serial) => {
    return adbService.shell(serial, "getprop");
  }));
  electron.ipcMain.handle("tools:wifi-enable", wrap(async (_event, serial) => {
    await adbService.shell(serial, "svc wifi enable");
    return adbService.tcpip(serial, 5555);
  }));
  electron.ipcMain.handle("tools:wifi-connect", wrap(async (_event, { host, port }) => {
    return adbService.connect(host, port || 5555);
  }));
  electron.ipcMain.handle("tools:wifi-disconnect", wrap(async (_event, { host, port }) => {
    return adbService.disconnect(host, port || 5555);
  }));
  electron.ipcMain.handle("tools:wifi-pair", wrap(async (_event, { host, port, code }) => {
    return adbService.pair(host, port, code);
  }));
  electron.ipcMain.handle("tools:ota-start", wrap(async (_event, { zipPath }) => {
    return otaService.start({ zipPath });
  }));
  electron.ipcMain.handle("tools:rootpro", wrap(async (_event, options) => {
    return rootProService.run(options);
  }));
  electron.ipcMain.handle("tools:check-drivers", wrap(async () => {
    return driverService.check();
  }));
  electron.ipcMain.handle("tools:install-drivers", wrap(async () => {
    return driverService.installDrivers();
  }));
  electron.ipcMain.handle("tools:atbmod-scan", wrap(async () => {
    return atbmodService.scan();
  }));
  electron.ipcMain.handle("tools:atbmod-install", wrap(async (_event, { file }) => {
    return atbmodService.install(file);
  }));
  electron.ipcMain.handle("tools:atbmod-list", wrap(async () => {
    return atbmodService.listInstalled();
  }));
  electron.ipcMain.handle("tools:atbmod-uninstall", wrap(async (_event, { modid }) => {
    return atbmodService.uninstall(modid);
  }));
  electron.ipcMain.handle("tools:check-app-update", wrap(async () => {
    return updateService.checkForUpdate();
  }));
}
class AgentService {
  constructor() {
    this.features = [
      { path: "/", name: "主页", keywords: ["home", "main", "dashboard", "设备", "状态", "主页"], description: "显示设备基本信息和状态", category: "设备工具" },
      { path: "/reboot", name: "重启模式", keywords: ["reboot", "restart", "重启", "重啟", "bootloader", "recovery", "edl", "fastboot"], description: "提供9种重启模式：系统重启、Bootloader、Recovery、EDL深度刷机模式、TWRP临时 Recovery、QMMI诊断模式、FFBM工厂模式、清除数据、FastbootD" },
      { path: "/cloud", name: "云资源管理", keywords: ["cloud", "resource", "download", "云", "资源", "下载", "更新"], description: "管理和下载云端的刷机资源、工具和更新包" },
      { path: "/root", name: "Root工具", keywords: ["root", "破解", "权限", "magisk", "supersu", "sdk19", "sdk25", "sdk27"], description: "完整Root工作流，支持SDK19/25/27/ND03/ND08，一键获取手表Root权限" },
      { path: "/files", name: "文件管理", keywords: ["file", "files", "文件", "adb", "push", "pull", "上传", "下载", "管理"], description: "通过ADB浏览、上传、下载、删除、重命名手表文件，支持搜索和批量操作" },
      { path: "/apps", name: "应用管理", keywords: ["app", "apps", "应用", "安装", "卸载", "apk", "z10", "解锁", "自启动"], description: "管理手表应用：安装APK、卸载应用、Z10解锁、配置QQ/微信自启动" },
      { path: "/tools", name: "工具箱", keywords: ["tools", "tool", "工具", "充电", "wifi", "ota", "驱动", "atbmod", "build.prop", "属性"], description: "实用工具合集：开启充电、查看系统属性、WiFi ADB连接、离线OTA升级、驱动检测安装、ATBMod模块管理、RootPro优化" },
      { path: "/cast", name: "投屏控制", keywords: ["scrcpy", "投屏", "cast", "screen", "镜像", "远程"], description: "使用 scrcpy 投屏并控制手表，支持帧率、尺寸、保持唤醒和只读模式" },
      { path: "/magisk", name: "Magisk模块", keywords: ["magisk", "模块", "module", "面具", "root", "zygisk"], description: "管理Magisk模块：查看已安装模块、安装/卸载、启用/停用、从商店搜索安装" },
      { path: "/backup", name: "备份恢复", keywords: ["backup", "restore", "备份", "恢复", "dcim", "edl", "twrp", "xposed", "数据"], description: "多种备份恢复方案：DCIM照片备份、ADB-dd全分区备份、EDL深度备份、Super Recovery、TWRP刷入、Xposed安装" },
      { path: "/edl-partitions", name: "EDL分区管理", keywords: ["edl", "partition", "分区", "gpt", "loader", "刷机", "9008"], description: "EDL模式下的分区管理：查看GPT分区表、备份/恢复/擦除/验证分区" },
      { path: "/settings", name: "设置", keywords: ["settings", "setting", "设置", "配置", "config", "opacity", "透明度"], description: "应用设置：窗口透明度、速度启动、更新检查、详细日志、语言切换、资源校验" },
      { path: "/logs", name: "日志", keywords: ["log", "logs", "日志", "调试", "debug", "输出"], description: "实时日志查看器：过滤级别、搜索、自动滚动、复制日志内容" }
    ];
    this.tips = [
      "在重启模式中可以选择EDL深度刷机模式进入高通9008端口",
      "Root工具支持SDK19/25/27/ND03/ND08多种分支",
      "文件管理支持拖拽上传和批量下载操作",
      "Z10解锁功能位于应用管理中",
      "EDL分区管理需要设备处于EDL深度刷机模式",
      "WiFi ADB连接前需要先在设备上启用WiFi ADB",
      "离线OTA升级需要选择对应的OTA ZIP文件",
      "备份恢复中的Super Recovery提供一键式全量备份",
      "Magisk模块可以从内置商店搜索并直接安装",
      "工具箱中的RootPro针对Android 8.1优化"
    ];
  }
  async search(query) {
    const settings = config.getSettings();
    if (settings.agentEnabled && settings.agentApiUrl && settings.agentApiKey) {
      return this.callAI(query, settings.agentApiUrl, settings.agentApiKey, settings.agentModel);
    }
    return this.keywordSearch(query);
  }
  keywordSearch(query) {
    const q = query.toLowerCase().trim();
    if (!q) return { matches: [], aiPowered: false };
    const scored = this.features.map((f) => {
      let score = 0;
      for (const kw of f.keywords) {
        if (q.includes(kw.toLowerCase())) {
          score += 10;
        } else if (kw.toLowerCase().includes(q)) {
          score += 5;
        }
      }
      if (q.includes(f.name.toLowerCase())) {
        score += 15;
      }
      if (f.description.toLowerCase().includes(q)) {
        score += 3;
      }
      return { feature: f, score };
    });
    const sorted = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
    return {
      matches: sorted.slice(0, 3).map((s) => ({
        path: s.feature.path,
        name: s.feature.name,
        description: s.feature.description,
        confidence: Math.min(100, Math.round(s.score / 30 * 100)),
        explanation: s.feature.description
      })),
      aiPowered: false
    };
  }
  buildApiUrl(base) {
    let url = base.replace(/\/+$/, "");
    if (!url.endsWith("/v1/chat/completions") && !url.endsWith("/v1/chat/completions/")) {
      if (url.endsWith("/v1")) url += "/chat/completions";
      else url += "/v1/chat/completions";
    }
    return url;
  }
  async callAI(query, apiUrl, apiKey, model) {
    try {
      const featuresList = this.features.map(
        (f) => `- path: ${f.path}
  name: ${f.name}
  description: ${f.description}`
      ).join("\n");
      const systemPrompt = `You are a feature finder for iMooAgentTool, a smartwatch tool application.

Available features:
${featuresList}

Analyze the user's query and select the most relevant features (up to 3).
Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  {
    "path": "...",
    "name": "...",
    "description": "...",
    "confidence": 95,
    "explanation": "Why this feature matches the query"
  }
]
If no features match, respond with []`;
      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "[]";
      const parsed = JSON.parse(content);
      const matches = (Array.isArray(parsed) ? parsed : []).slice(0, 3).map((m) => ({
        path: m.path || "",
        name: m.name || "",
        description: m.description || "",
        confidence: typeof m.confidence === "number" ? Math.min(100, Math.max(0, m.confidence)) : 50,
        explanation: m.explanation || ""
      }));
      return { matches, aiPowered: true };
    } catch {
      return this.keywordSearch(query);
    }
  }
  async chat(messages) {
    const settings = config.getSettings();
    const apiUrl = settings.agentApiUrl || "";
    const apiKey = settings.agentApiKey || "";
    const model = settings.agentModel || "gpt-4o-mini";
    if (!apiUrl || !apiKey) {
      throw new Error("AI 服务未配置，请在设置中配置 API");
    }
    try {
      const systemMessage = { role: "system", content: "你是一个智能助手，帮助用户使用 iMooAgentTool 智能手表工具箱。你可以回答关于软件功能、使用方法和一般性问题。请用中文回复，简洁明了。" };
      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1e3
        })
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`);
      }
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "";
      return { reply };
    } catch (err) {
      throw new Error(`AI 对话失败: ${err.message}`);
    }
  }
  async testConnection(apiUrl, apiKey, model) {
    try {
      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: "Hello" }],
          max_tokens: 10
        })
      });
      if (!response.ok) {
        const text = await response.text();
        return { success: false, message: `HTTP ${response.status}: ${text.slice(0, 200)}` };
      }
      return { success: true, message: "连接成功" };
    } catch (err) {
      return { success: false, message: err.message || "连接失败" };
    }
  }
  getFeature(path2) {
    return this.features.find((f) => f.path === path2);
  }
  getAllFeatures() {
    return [...this.features];
  }
  getRandomTip() {
    return this.tips[Math.floor(Math.random() * this.tips.length)];
  }
}
const agentService = new AgentService();
function registerAgentIpc() {
  electron.ipcMain.handle(
    "agent:search",
    wrap(async (_event, query) => {
      return agentService.search(query);
    })
  );
  electron.ipcMain.handle(
    "agent:all-features",
    wrap(async () => {
      return agentService.getAllFeatures();
    })
  );
  electron.ipcMain.handle(
    "agent:random-tip",
    wrap(async () => {
      return agentService.getRandomTip();
    })
  );
  electron.ipcMain.handle(
    "agent:get-config",
    wrap(async () => {
      const settings = config.getSettings();
      return {
        agentApiUrl: settings.agentApiUrl || "",
        agentApiKey: settings.agentApiKey ? maskApiKey(settings.agentApiKey) : "",
        agentModel: settings.agentModel || "gpt-4o-mini",
        agentEnabled: settings.agentEnabled || false
      };
    })
  );
  electron.ipcMain.handle(
    "agent:set-config",
    wrap(async (_event, partial) => {
      const update = {};
      if (partial.agentApiUrl !== void 0) update.agentApiUrl = partial.agentApiUrl;
      if (partial.agentApiKey !== void 0) update.agentApiKey = partial.agentApiKey;
      if (partial.agentModel !== void 0) update.agentModel = partial.agentModel;
      if (partial.agentEnabled !== void 0) update.agentEnabled = partial.agentEnabled;
      return config.setSettings(update);
    })
  );
  electron.ipcMain.handle(
    "agent:chat",
    wrap(async (_event, { messages }) => {
      return agentService.chat(messages);
    })
  );
  electron.ipcMain.handle(
    "agent:test-connection",
    wrap(async () => {
      const settings = config.getSettings();
      return agentService.testConnection(
        settings.agentApiUrl || "",
        settings.agentApiKey || "",
        settings.agentModel || "gpt-4o-mini"
      );
    })
  );
}
function maskApiKey(key) {
  if (key.length <= 8) return key.slice(0, 2) + "****" + key.slice(-2);
  return key.slice(0, 4) + "****" + key.slice(-4);
}
function registerAllIpc() {
  registerAppIpc();
  registerBackupIpc();
  registerCloudIpc();
  registerDeviceIpc();
  registerEdlPartitionIpc();
  registerFileIpc();
  registerLogIpc();
  registerMagiskIpc();
  registerRebootIpc();
  registerRootIpc();
  registerScrcpyIpc();
  registerSystemIpc();
  registerToolsIpc();
  registerAgentIpc();
}
if (!ensureSingleInstance()) {
  process.exit(0);
}
const logger = Logger.instance;
logger.info("main", `iMooAgentTool 启动(dev=${paths.isDev})`);
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
