import { useEffect, useState } from 'react';
import {
  HardDrive, Download, Upload, RefreshCw, Shield, Zap, Smartphone,
  AlertTriangle, CheckCircle, FolderOpen, Puzzle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';

type TabId = 'dcim' | 'adbdd' | 'edl' | 'super' | 'twrp' | 'xposed';

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'dcim', label: '相册备份' },
  { id: 'adbdd', label: 'ADB-dd 分区' },
  { id: 'edl', label: 'EDL 9008' },
  { id: 'super', label: '超级恢复' },
  { id: 'twrp', label: 'TWRP' },
  { id: 'xposed', label: 'Xposed' },
];

export default function Backup() {
  const { currentDevice } = useDeviceStore();
  const [activeTab, setActiveTab] = useState<TabId>('dcim');
  const [loading, setLoading] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ stage: string; percent: number; message: string } | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = api.backup.onProgress(setProgress);
    return () => unsub();
  }, []);

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
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(null);
  };

  const pickFolder = async () => {
    const result = await api.system.pickFile({ kind: 'folder' });
    return result as string | null;
  };

  const pickZip = async () => {
    const result = await api.system.pickFile({ kind: 'open', filter: 'zip' });
    return result as string | null;
  };

  const handleDcimBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run('dcim-backup', () => api.backup.dcimBackup(folder), '相册备份完成');
  };

  const handleDcimRecover = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run('dcim-recover', () => api.backup.dcimRecover(folder), '相册恢复完成');
  };

  const handleAdbddBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run('adbdd-backup', () => api.backup.adbddBackup(folder), 'ADB-dd 分区备份完成');
  };

  const handleAdbddRecover = async () => {
    const zip = await pickZip();
    if (!zip) return;
    await run('adbdd-recover', () => api.backup.adbddRecover(zip), 'ADB-dd 分区恢复完成');
  };

  const handleEdlBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    const xmlFiles: string[] = [];
    setError('EDL 备份需要选择 rawprogram XML 文件，当前版本请使用 EDL 分区管理逐个备份。');
    setLoading(null);
    return xmlFiles;
  };

  const handleEdlRecover = async () => {
    setError('EDL 恢复需要 rawprogram XML 文件，当前版本请使用 EDL 分区管理逐个恢复。');
  };

  const handleSuperRecovery = async () => {
    setError('超级恢复需要按机型准备 XML 文件组，当前版本请使用 EDL 分区管理逐分区恢复。');
  };

  const handleTwrp = async () => {
    if (!currentDevice?.innermodel) {
      setError('未检测到设备内部型号');
      return;
    }
    await run('twrp', () => api.backup.autoFlashTwrp(currentDevice.innermodel!), 'TWRP 刷入完成');
  };

  const handleXposed = async () => {
    await run('xposed', () => api.backup.xposedInstall(), 'Xposed 安装完成');
  };

  const disabled = !currentDevice && (activeTab === 'dcim' || activeTab === 'adbdd' || activeTab === 'twrp');

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <HardDrive className="w-6 h-6 text-blue-400" />备份与恢复
      </h1>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{currentDevice.innermodel || currentDevice.model || '已连接设备'}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">{currentDevice.serial}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />未连接设备
        </div>
      )}

      {message && <div className="card text-sm text-green-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{message}</div>}
      {error && <div className="card text-sm text-red-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{error}</div>}

      {progress && (
        <div className="card text-sm">
          <p className="text-slate-300">{progress.stage} — {progress.message}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, progress.percent)}%` }} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm ${activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dcim' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-blue-400" />相册备份 / 恢复</h2>
          <p className="text-sm text-slate-400">把设备 DCIM 目录拉取到本地，或从本地 DCIM 目录恢复。</p>
          <div className="flex gap-3">
            <button onClick={handleDcimBackup} disabled={disabled || loading === 'dcim-backup'} className="btn-primary flex items-center gap-2">
              {loading === 'dcim-backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}备份相册
            </button>
            <button onClick={handleDcimRecover} disabled={disabled || loading === 'dcim-recover'} className="btn-secondary flex items-center gap-2">
              {loading === 'dcim-recover' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}恢复相册
            </button>
          </div>
        </div>
      )}

      {activeTab === 'adbdd' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><HardDrive className="w-5 h-5 text-blue-400" />ADB-dd 分区备份</h2>
          <p className="text-sm text-slate-400">需要 Root。备份时自动跳过 userdata，并在完成后校验 MD5。</p>
          <div className="flex gap-3">
            <button onClick={handleAdbddBackup} disabled={disabled || loading === 'adbdd-backup'} className="btn-primary flex items-center gap-2">
              {loading === 'adbdd-backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}备份分区
            </button>
            <button onClick={handleAdbddRecover} disabled={disabled || loading === 'adbdd-recover'} className="btn-secondary flex items-center gap-2">
              {loading === 'adbdd-recover' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}恢复分区
            </button>
          </div>
        </div>
      )}

      {activeTab === 'edl' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-blue-400" />EDL 9008</h2>
          <p className="text-sm text-slate-400">EDL 批量备份/恢复需要 rawprogram XML。可前往「EDL 分区管理」逐分区操作，或在此选择 XML 文件。</p>
          <div className="flex gap-3">
            <button onClick={handleEdlBackup} className="btn-primary flex items-center gap-2"><Download className="w-4 h-4" />EDL 备份</button>
            <button onClick={handleEdlRecover} className="btn-secondary flex items-center gap-2"><Upload className="w-4 h-4" />EDL 恢复</button>
          </div>
        </div>
      )}

      {activeTab === 'super' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" />超级恢复</h2>
          <p className="text-sm text-slate-400">按机型资源包中的 XML 序列执行恢复。资源下载完成后可在这里一键执行。</p>
          <button onClick={handleSuperRecovery} className="btn-primary flex items-center gap-2"><Upload className="w-4 h-4" />开始超级恢复</button>
        </div>
      )}

      {activeTab === 'twrp' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" />TWRP</h2>
          <p className="text-sm text-slate-400">使用当前设备内部型号自动匹配并刷入 TWRP 镜像。请先在资源管理下载 TWRP。</p>
          <button onClick={handleTwrp} disabled={disabled || loading === 'twrp'} className="btn-primary flex items-center gap-2">
            {loading === 'twrp' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}刷入 TWRP
          </button>
        </div>
      )}

      {activeTab === 'xposed' && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Puzzle className="w-5 h-5 text-blue-400" />Xposed</h2>
          <p className="text-sm text-slate-400">自动识别 SDK 19/25 并安装对应 Xposed 框架。请先在资源管理下载 apks 与 xp 资源。</p>
          <button onClick={handleXposed} disabled={disabled || loading === 'xposed'} className="btn-primary flex items-center gap-2">
            {loading === 'xposed' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}安装 Xposed
          </button>
        </div>
      )}
    </div>
  );
}
