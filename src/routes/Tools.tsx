import { useState, useEffect } from 'react';
import {
  Wrench, Battery, FileText, Wifi, Upload, Shield, Package,
  RefreshCw, CheckCircle, XCircle, Smartphone, Settings
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

export default function Tools() {
  const { currentDevice } = useDeviceStore();
  const [wifiIp, setWifiIp] = useState('');
  const [wifiPort, setWifiPort] = useState('5555');
  const [otaZip, setOtaZip] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [buildProps, setBuildProps] = useState<Record<string, string> | null>(null);
  const [drivers, setDrivers] = useState<Array<{ name: string; installed: boolean; version?: string }> | null>(null);
  const [atbmods, setAtbmods] = useState<Array<{ id: string; name: string; version: string; status: string }> | null>(null);

  const handleOpenCharge = async () => {
    try { await api.tools.openCharge(); } catch (err) { console.error(err); }
  };

  const handleReadBuildProps = async () => {
    setLoading('buildprops');
    try {
      const props = await api.tools.readBuildProps();
      setBuildProps(props);
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleWifiEnable = async () => {
    setLoading('wifienable');
    try {
      await api.tools.wifiEnable();
      alert('WiFi ADB 已启用');
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleWifiConnect = async () => {
    if (!wifiIp) return;
    setLoading('wificonnect');
    try {
      await api.tools.wifiConnect(wifiIp, parseInt(wifiPort) || 5555);
      alert('WiFi ADB 已连接');
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleWifiDisconnect = async () => {
    if (!wifiIp) return;
    setLoading('wifidisconnect');
    try {
      await api.tools.wifiDisconnect(wifiIp, parseInt(wifiPort) || 5555);
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleSelectOtaZip = async () => {
    try {
      const file = await api.system.pickFile({ kind: 'open', filter: 'ZIP files (*.zip)' });
      if (file) setOtaZip(file as string);
    } catch (err) { console.error(err); }
  };

  const handleOtaStart = async () => {
    if (!otaZip) return;
    setLoading('ota');
    try {
      await api.tools.otaStart(otaZip);
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleRootPro = async () => {
    setLoading('rootpro');
    try {
      await api.tools.rootpro({ androidVersion: currentDevice?.androidVersion });
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleCheckDrivers = async () => {
    setLoading('drivers');
    try {
      const list = await api.tools.checkDrivers();
      setDrivers(list);
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleInstallDrivers = async () => {
    setLoading('installdrivers');
    try {
      await api.tools.installDrivers();
      handleCheckDrivers();
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAtbmodScan = async () => {
    setLoading('atbscan');
    try {
      await api.tools.atbmodScan();
      const list = await api.tools.atbmodList();
      setAtbmods(list);
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAtbmodInstall = async () => {
    try {
      const file = await api.system.pickFile({ kind: 'open', filter: 'ZIP files (*.zip)' });
      if (file) {
        await api.tools.atbmodInstall(file as string);
        handleAtbmodScan();
      }
    } catch (err) { console.error(err); }
  };

  const handleAtbmodUninstall = async (modid: string) => {
    try {
      await api.tools.atbmodUninstall(modid);
      handleAtbmodScan();
    } catch (err) { console.error(err); }
  };

  const handleCheckAppUpdate = async () => {
    setLoading('update');
    try {
      const result = await api.tools.checkAppUpdate();
      if (result.hasUpdate) {
        alert(`发现更新: v${result.latestVersion}\n${result.releaseNotes ?? ''}`);
      } else {
        alert('当前已是最新版本。');
      }
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const toolsCards = [
    { title: '开启充电', icon: Battery, desc: '在设备上打开充电应用', action: handleOpenCharge, disabled: !currentDevice },
    { title: '读取 Build Props', icon: FileText, desc: '读取设备 build.prop 属性', action: handleReadBuildProps, disabled: !currentDevice },
    { title: '检查驱动', icon: Settings, desc: '检查和安装 USB 驱动', action: handleCheckDrivers, disabled: false },
    { title: 'Root 优化', icon: Shield, desc: 'Android 8.1 Root 优化', action: handleRootPro, disabled: !currentDevice },
    { title: '检查更新', icon: RefreshCw, desc: '检查 iMooDesktop 更新', action: handleCheckAppUpdate, disabled: false },
    { title: '安装驱动', icon: Settings, desc: '安装/重新安装 USB 驱动', action: handleInstallDrivers, disabled: false },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Wrench className="w-6 h-6 text-blue-400" />
        工具箱
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {toolsCards.map((tool) => (
          <button key={tool.title} onClick={tool.action} disabled={tool.disabled || loading === tool.title.toLowerCase().replace(/\s+/g, '')}
            className="card flex flex-col items-center text-center gap-3 py-5 hover:bg-slate-700/60 transition-colors disabled:opacity-40">
            <tool.icon className="w-8 h-8 text-blue-400" />
            <span className="font-semibold text-white">{tool.title}</span>
            <span className="text-xs text-slate-400">{tool.desc}</span>
          </button>
        ))}
      </div>

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Wifi className="w-4 h-4" />
          WiFi ADB
        </h2>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label">设备 IP</label>
            <input className="input" placeholder="192.168.x.x" value={wifiIp} onChange={(e) => setWifiIp(e.target.value)} />
          </div>
          <div className="w-24">
            <label className="label">端口</label>
            <input className="input" placeholder="5555" value={wifiPort} onChange={(e) => setWifiPort(e.target.value)} />
          </div>
          <button onClick={handleWifiEnable} disabled={!currentDevice} className="btn-secondary text-sm">启用</button>
          <button onClick={handleWifiConnect} disabled={!wifiIp} className="btn-primary text-sm">连接</button>
          <button onClick={handleWifiDisconnect} disabled={!wifiIp} className="btn-danger text-sm">断开</button>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          离线 OTA
        </h2>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="label">OTA ZIP 文件</label>
            <input className="input" placeholder="选择 OTA zip 文件..." value={otaZip} readOnly />
          </div>
          <button onClick={handleSelectOtaZip} className="btn-secondary text-sm">浏览</button>
          <button onClick={handleOtaStart} disabled={!otaZip} className="btn-primary text-sm">开始 OTA</button>
        </div>
      </div>

      {buildProps && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Build Props
            </h2>
            <button onClick={() => setBuildProps(null)} className="text-xs text-slate-500 hover:text-white">关闭</button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {Object.entries(buildProps).map(([k, v]) => (
              <div key={k} className="text-xs font-mono">
                <span className="text-blue-400">{k}</span>=<span className="text-slate-300">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {drivers && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              驱动状态
            </h2>
            <button onClick={() => setDrivers(null)} className="text-xs text-slate-500 hover:text-white">关闭</button>
          </div>
          <div className="space-y-1">
            {drivers.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                {d.installed ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                <span className="text-slate-300">{d.name}</span>
                {d.version && <span className="text-xs text-slate-500">v{d.version}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Package className="w-4 h-4" />
            ATBMod 管理器
          </h2>
          <div className="flex gap-2">
            <button onClick={handleAtbmodScan} className="btn-secondary text-xs">扫描</button>
            <button onClick={handleAtbmodInstall} className="btn-primary text-xs">安装</button>
          </div>
        </div>
        {atbmods && atbmods.length > 0 ? (
          <div className="divide-y divide-slate-700/50">
            {atbmods.map((mod) => (
              <div key={mod.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="text-slate-200">{mod.name}</span>
                  <span className="text-xs text-slate-500 ml-2">v{mod.version}</span>
                </div>
                <button onClick={() => handleAtbmodUninstall(mod.id)} className="text-xs text-red-400 hover:text-red-300">卸载</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">未找到模块。点击扫描刷新。</p>
        )}
      </div>
    </div>
  );
}
