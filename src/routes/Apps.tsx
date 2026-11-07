import { useEffect, useState, useCallback } from 'react';
import {
  Grid, RefreshCw, Package, Upload, Trash2, Play, Square, Eraser,
  ShieldCheck, Search, Smartphone, AlertTriangle, CheckCircle, XCircle, Rocket,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

interface AppEntry {
  package: string;
  name: string;
  version: string;
  system: boolean;
}

export default function Apps() {
  const { currentDevice } = useDeviceStore();
  const [apps, setApps] = useState<AppEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [thirdPartyOnly, setThirdPartyOnly] = useState(true);
  const [operating, setOperating] = useState<string | null>(null);
  const [unlockSteps, setUnlockSteps] = useState<Array<{ name: string; status: string; message?: string }>>([]);
  const [unlockResult, setUnlockResult] = useState<string>('');

  const serial = currentDevice?.serial ?? '';

  const loadApps = useCallback(async () => {
    if (!serial) {
      setApps([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = thirdPartyOnly
        ? await api.app.list(serial)
        : await api.app.listAll(serial);
      setApps(Array.isArray(result) ? result : []);
    } catch (e) {
      setError((e as Error).message);
      setApps([]);
    }
    setLoading(false);
  }, [serial, thirdPartyOnly]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  const handleInstall = async () => {
    if (!serial) return;
    try {
      const file = await api.system.pickFile({ kind: 'open', filter: 'apk' });
      if (!file) return;
      setOperating('install');
      const result = await api.app.install(serial, file as string);
      if (!result.success) setError(result.error || '安装失败');
      await loadApps();
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const handleUninstall = async (pkg: string) => {
    if (!serial) return;
    if (!confirm(`卸载 ${pkg}？`)) return;
    setOperating(`uninstall:${pkg}`);
    try {
      const result = await api.app.uninstall(serial, pkg, false);
      if (!result.success) setError(result.error || '卸载失败');
      await loadApps();
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const handleLaunch = async (pkg: string) => {
    if (!serial) return;
    setOperating(`launch:${pkg}`);
    try {
      await api.app.launch(serial, pkg);
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const handleForceStop = async (pkg: string) => {
    if (!serial) return;
    setOperating(`stop:${pkg}`);
    try {
      await api.app.forceStop(serial, pkg);
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const handleClearData = async (pkg: string) => {
    if (!serial) return;
    if (!confirm(`清除 ${pkg} 的全部数据？`)) return;
    setOperating(`clear:${pkg}`);
    try {
      await api.app.clearData(serial, pkg);
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const handleUnlockZ10 = async () => {
    if (!serial) return;
    if (!confirm('Z10 解锁会修改桌面数据库并重启 zygote，继续？')) return;
    setOperating('unlock');
    setUnlockSteps([]);
    setUnlockResult('');
    try {
      const result = await api.app.unlockZ10();
      setUnlockSteps(result.steps || []);
      setUnlockResult(result.success ? '解锁完成' : result.error || '解锁失败');
    } catch (e) {
      setUnlockResult((e as Error).message);
    }
    setOperating(null);
  };

  const handleAutostart = async () => {
    if (!serial) return;
    setOperating('autostart');
    try {
      const result = await api.app.defaultAutostart(true);
      setError(result.success ? '' : '部分应用自启动设置失败');
    } catch (e) {
      setError((e as Error).message);
    }
    setOperating(null);
  };

  const filtered = apps.filter((app) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return app.package.toLowerCase().includes(q) || app.name.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-blue-400" />
          应用管理
        </h1>
        <div className="flex items-center gap-2">
          <button onClick={loadApps} disabled={!serial || loading} className="btn-secondary flex items-center gap-1.5 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />刷新
          </button>
          <button onClick={handleInstall} disabled={!serial || !!operating} className="btn-primary flex items-center gap-1.5 text-sm">
            <Upload className="w-4 h-4" />安装 APK
          </button>
        </div>
      </div>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{currentDevice.innermodel || currentDevice.model || '已连接设备'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{serial}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />未连接设备
        </div>
      )}

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />Z10 安装限制解锁
          </h2>
          <p className="text-xs text-slate-500">替换桌面 switch.db、打开 adb 安装开关并安装配套 APK。</p>
          <button onClick={handleUnlockZ10} disabled={!serial || !!operating} className="btn-primary text-sm flex items-center gap-1.5">
            {operating === 'unlock' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            开始解锁
          </button>
          {unlockResult && <p className="text-xs text-slate-300">{unlockResult}</p>}
          {unlockSteps.length > 0 && (
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {unlockSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {step.status === 'success' ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> :
                    step.status === 'failed' ? <XCircle className="w-3.5 h-3.5 text-red-400" /> :
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                  <span className="text-slate-300">{step.name}</span>
                  {step.message && <span className="text-red-400 truncate">{step.message}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Play className="w-4 h-4" />开机自启
          </h2>
          <p className="text-xs text-slate-500">为 QQ、微信等常用应用设置 XTC 桌面自启动。</p>
          <button onClick={handleAutostart} disabled={!serial || !!operating} className="btn-secondary text-sm flex items-center gap-1.5">
            {operating === 'autostart' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            设置 QQ / 微信自启动
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-slate-700/50">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input className="input pl-9" placeholder="搜索应用名或包名..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap">
            <input type="checkbox" checked={thirdPartyOnly} onChange={(e) => setThirdPartyOnly(e.target.checked)} className="accent-blue-500" />
            仅第三方
          </label>
          <span className="text-xs text-slate-500">{filtered.length} 个</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><RefreshCw className="w-6 h-6 animate-spin text-blue-400" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">没有找到应用。</div>
        ) : (
          <div className="divide-y divide-slate-700/40 max-h-[520px] overflow-y-auto">
            {filtered.map((app) => (
              <div key={app.package} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700/20">
                <Package className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-200 truncate">{app.name}</span>
                    {app.version && <span className="text-[10px] text-slate-500">v{app.version}</span>}
                  </div>
                  <p className="text-xs text-slate-500 font-mono truncate">{app.package}</p>
                </div>
                <button onClick={() => handleLaunch(app.package)} disabled={!!operating} title="启动" className="p-1.5 hover:bg-slate-600 rounded">
                  <Play className="w-3.5 h-3.5 text-green-400" />
                </button>
                <button onClick={() => handleForceStop(app.package)} disabled={!!operating} title="强制停止" className="p-1.5 hover:bg-slate-600 rounded">
                  <Square className="w-3.5 h-3.5 text-yellow-400" />
                </button>
                <button onClick={() => handleClearData(app.package)} disabled={!!operating} title="清除数据" className="p-1.5 hover:bg-slate-600 rounded">
                  <Eraser className="w-3.5 h-3.5 text-purple-400" />
                </button>
                <button onClick={() => handleUninstall(app.package)} disabled={!!operating} title="卸载" className="p-1.5 hover:bg-slate-600 rounded">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
