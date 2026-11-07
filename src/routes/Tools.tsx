import { useState, useEffect } from 'react';
import {
  Wrench, Battery, FileText, Wifi, Upload, Shield, Package, RefreshCw,
  CheckCircle, XCircle, Settings, Monitor, Link, Unplug,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

export default function Tools() {
  const { currentDevice } = useDeviceStore();
  const [wifiHost, setWifiHost] = useState('');
  const [wifiPort, setWifiPort] = useState('5555');
  const [pairPort, setPairPort] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [otaZip, setOtaZip] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [buildProps, setBuildProps] = useState<Record<string, string> | null>(null);
  const [drivers, setDrivers] = useState<Array<{ name: string; installed: boolean; version?: string }> | null>(null);
  const [atbmods, setAtbmods] = useState<Array<{ modid: string; prop?: { modname?: string; modversion?: string } }>>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const serial = currentDevice?.serial ?? '';

  useEffect(() => {
    if (currentDevice) {
      setWifiHost(currentDevice.serial?.includes(':') ? currentDevice.serial.split(':')[0] : '');
    }
  }, [currentDevice]);

  const run = async (key: string, fn: () => Promise<unknown>, successText: string) => {
    setLoading(key);
    setError('');
    setMessage('');
    try {
      const result = await fn();
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        setError(String(result.error));
      } else {
        setMessage(successText);
      }
      return result;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(null);
    }
  };

  const handleReadBuildProps = async () => {
    const result = await run('buildprops', () => api.tools.readBuildProps(serial), '属性已读取');
    if (typeof result === 'string') {
      const props: Record<string, string> = {};
      for (const line of result.split('\n')) {
        const m = line.match(/^\[([^\]]+)\]:\s*\[([^\]]*)\]$/);
        if (m) props[m[1]] = m[2];
      }
      setBuildProps(props);
    }
  };

  const handleWifiEnable = async () => {
    await run('wifienable', () => api.tools.wifiEnable(serial), '已切换 ADB 到 TCP 模式，请用设备 IP 连接');
  };

  const handleWifiConnect = async () => {
    if (!wifiHost) return;
    await run('wificonnect', () => api.tools.wifiConnect(wifiHost, parseInt(wifiPort, 10) || 5555), 'WiFi ADB 已连接');
  };

  const handleWifiDisconnect = async () => {
    if (!wifiHost) return;
    await run('wifidisconnect', () => api.tools.wifiDisconnect(wifiHost, parseInt(wifiPort, 10) || 5555), 'WiFi ADB 已断开');
  };

  const handleWifiPair = async () => {
    const port = parseInt(pairPort, 10);
    if (!wifiHost || !port || !pairCode) {
      setError('请填写配对端口和配对码');
      return;
    }
    await run('wifipair', () => api.tools.wifiPair(wifiHost, port, pairCode), '无线调试配对成功');
  };

  const handleSelectOtaZip = async () => {
    const file = await api.system.pickFile({ kind: 'open', filter: 'zip' });
    if (file) setOtaZip(file as string);
  };

  const handleOtaStart = async () => {
    if (!otaZip) return;
    await run('ota', () => api.tools.otaStart(serial, otaZip), '离线 OTA 已启动');
  };

  const handleRootPro = async () => {
    await run('rootpro', () => api.tools.rootPro({ installApks: true, installDesktop: true, installMods: true }), 'Root 后优化完成');
  };

  const handleCheckDrivers = async () => {
    const result = await run('drivers', () => api.tools.checkDrivers(), '驱动检查完成');
    if (Array.isArray(result)) setDrivers(result);
  };

  const handleInstallDrivers = async () => {
    await run('installdrivers', () => api.tools.installDrivers(), '驱动安装完成');
    await handleCheckDrivers();
  };

  const handleAtbmodScan = async () => {
    const result = await run('atbscan', () => api.tools.atbmodScan(), 'ATBMod 扫描完成');
    if (Array.isArray(result)) {
      const list = await api.tools.atbmodList();
      setAtbmods(Array.isArray(list) ? list : []);
    }
  };

  const handleAtbmodInstall = async () => {
    const file = await api.system.pickFile({ kind: 'open', filter: 'atbmod' });
    if (!file) return;
    const result = await run('atbmodinstall', () => api.tools.atbmodInstall(file as string), 'ATBMod 安装完成');
    if (result) await handleAtbmodScan();
  };

  const handleAtbmodUninstall = async (modid: string) => {
    await run(`atbmoduninstall:${modid}`, () => api.tools.atbmodUninstall(modid), 'ATBMod 已卸载');
    await handleAtbmodScan();
  };

  const handleCheckAppUpdate = async () => {
    const result = await run('update', () => api.tools.checkAppUpdate(), '');
    if (result && typeof result === 'object' && 'hasUpdate' in result) {
      const update = result as { hasUpdate: boolean; latestVersion?: string; releaseNotes?: string; releaseUrl?: string };
      if (update.hasUpdate) {
        setMessage(`发现新版本 v${update.latestVersion}`);
        if (update.releaseUrl) await api.system.openExternal(update.releaseUrl);
      } else {
        setMessage('当前已是最新版本');
      }
    }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Wrench className="w-6 h-6 text-blue-400" />工具箱
      </h1>

      {message && <div className="card text-sm text-green-400">{message}</div>}
      {error && <div className="card text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { key: 'charge', title: '开启充电常亮', icon: Battery, desc: '保持充电时屏幕常亮', action: () => run('charge', () => api.tools.openCharge(serial), '已开启充电常亮'), disabled: !serial },
          { key: 'buildprops', title: '读取系统属性', icon: FileText, desc: '读取设备 build.prop 属性', action: handleReadBuildProps, disabled: !serial },
          { key: 'rootpro', title: 'Root 后优化', icon: Shield, desc: 'Android 8.1 扩展与模块', action: handleRootPro, disabled: !serial },
          { key: 'drivers', title: '检查驱动', icon: Settings, desc: '检测 ADB / 9008 / VC 运行库', action: handleCheckDrivers, disabled: false },
          { key: 'installdrivers', title: '安装驱动', icon: Settings, desc: '安装或重装 USB 驱动', action: handleInstallDrivers, disabled: false },
          { key: 'update', title: '检查应用更新', icon: RefreshCw, desc: '从 GitHub Releases 检查更新', action: handleCheckAppUpdate, disabled: false },
        ].map((tool) => (
          <button key={tool.key} onClick={tool.action} disabled={tool.disabled || loading === tool.key}
            className="card flex flex-col items-center text-center gap-3 py-5 hover:bg-slate-700/60 transition-colors disabled:opacity-40">
            {loading === tool.key ? <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" /> : <tool.icon className="w-8 h-8 text-blue-400" />}
            <span className="font-semibold text-white">{tool.title}</span>
            <span className="text-xs text-slate-400">{tool.desc}</span>
          </button>
        ))}
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Wifi className="w-4 h-4" />无线 ADB</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label">设备 IP</label>
            <input className="input" placeholder="192.168.x.x" value={wifiHost} onChange={(e) => setWifiHost(e.target.value)} />
          </div>
          <div>
            <label className="label">ADB 端口</label>
            <input className="input" value={wifiPort} onChange={(e) => setWifiPort(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleWifiEnable} disabled={!serial} className="btn-secondary text-sm">切换 TCP</button>
            <button onClick={handleWifiConnect} disabled={!wifiHost} className="btn-primary text-sm">连接</button>
            <button onClick={handleWifiDisconnect} disabled={!wifiHost} className="btn-danger text-sm">断开</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/50">
          <div>
            <label className="label">配对端口</label>
            <input className="input" placeholder="从无线调试页面获取" value={pairPort} onChange={(e) => setPairPort(e.target.value)} />
          </div>
          <div>
            <label className="label">配对码</label>
            <input className="input" placeholder="6 位配对码" value={pairCode} onChange={(e) => setPairCode(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button onClick={handleWifiPair} disabled={!wifiHost || !pairPort || !pairCode} className="btn-secondary text-sm flex items-center gap-1">
              <Link className="w-4 h-4" />配对
            </button>
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Upload className="w-4 h-4" />离线 OTA</h2>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label">OTA ZIP 文件</label>
            <input className="input" placeholder="选择 OTA zip 文件..." value={otaZip} readOnly />
          </div>
          <button onClick={handleSelectOtaZip} className="btn-secondary text-sm">浏览</button>
          <button onClick={handleOtaStart} disabled={!otaZip || !serial} className="btn-primary text-sm">开始 OTA</button>
        </div>
      </div>

      {buildProps && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><FileText className="w-4 h-4" />系统属性</h2>
            <button onClick={() => setBuildProps(null)} className="text-xs text-slate-500 hover:text-white">关闭</button>
          </div>
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {Object.entries(buildProps).map(([key, value]) => (
              <div key={key} className="text-xs font-mono">
                <span className="text-blue-400">{key}</span>=<span className="text-slate-300">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {drivers && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Settings className="w-4 h-4" />驱动状态</h2>
            <button onClick={() => setDrivers(null)} className="text-xs text-slate-500 hover:text-white">关闭</button>
          </div>
          <div className="space-y-1">
            {drivers.map((driver) => (
              <div key={driver.name} className="flex items-center gap-2 text-sm">
                {driver.installed ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-slate-300">{driver.name}</span>
                {driver.version && <span className="text-xs text-slate-500">v{driver.version}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><Package className="w-4 h-4" />ATBMod 模块</h2>
          <div className="flex gap-2">
            <button onClick={handleAtbmodScan} disabled={!!loading} className="btn-secondary text-xs">扫描</button>
            <button onClick={handleAtbmodInstall} disabled={!!loading} className="btn-primary text-xs">安装 .atbmod</button>
          </div>
        </div>
        {atbmods.length === 0 ? (
          <p className="text-xs text-slate-500">未找到已安装模块，点击扫描刷新。</p>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {atbmods.map((mod) => (
              <div key={mod.modid} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="text-slate-200">{mod.prop?.modname || mod.modid}</span>
                  {mod.prop?.modversion && <span className="text-xs text-slate-500 ml-2">v{mod.prop.modversion}</span>}
                </div>
                <button onClick={() => handleAtbmodUninstall(mod.modid)} disabled={!!loading} className="text-xs text-red-400 hover:text-red-300">卸载</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card text-xs text-slate-500 flex items-center gap-2">
        <Monitor className="w-4 h-4" />
        <span>投屏请前往「投屏控制」页面；资源缺失时先到「资源管理」下载对应包。</span>
      </div>
    </div>
  );
}
