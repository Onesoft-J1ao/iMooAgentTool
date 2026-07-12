import { useState, useEffect } from 'react';
import {
  HardDrive, Download, Upload, RefreshCw, Flashlight, Smartphone,
  Shield, Zap, Folder, CheckCircle, AlertTriangle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';
import { getDisplayName } from '@/lib/models';

type TabId = 'dcim' | 'adbdd' | 'edl' | 'super' | 'twrp' | 'auto-twrp' | 'xposed';

interface TabInfo {
  id: TabId;
  label: string;
}

const tabs: TabInfo[] = [
  { id: 'dcim', label: 'DCIM' },
  { id: 'adbdd', label: 'ADB-dd' },
  { id: 'edl', label: 'EDL 9008' },
  { id: 'super', label: 'Super Recovery' },
  { id: 'twrp', label: 'TWRP Flash' },
  { id: 'auto-twrp', label: 'Auto Flash TWRP' },
  { id: 'xposed', label: 'Xposed Install' },
];

export default function Backup() {
  const { currentDevice } = useDeviceStore();
  const [activeTab, setActiveTab] = useState<TabId>('dcim');
  const [progress, setProgress] = useState<{ stage: string; percent: number; message: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const unsub = api.backup.onProgress(setProgress);
    return () => unsub();
  }, []);

  const pickFolder = async (): Promise<string | null> => {
    const result = await api.system.pickFile({ kind: 'folder' });
    return result as string | null;
  };

  const pickZip = async (): Promise<string | null> => {
    const result = await api.system.pickFile({ kind: 'open', filter: 'ZIP files (*.zip)' });
    return result as string | null;
  };

  const handleDcimBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    setLoading('dcim-backup');
    try { await api.backup.dcimBackup(folder); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleDcimRecover = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    setLoading('dcim-recover');
    try { await api.backup.dcimRecover(folder); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAdbddBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    setLoading('adbdd-backup');
    try { await api.backup.adbddBackup(folder); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAdbddRecover = async () => {
    const zip = await pickZip();
    if (!zip) return;
    setLoading('adbdd-recover');
    try { await api.backup.adbddRecover(zip); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAdbddPrepare = async () => {
    const zip = await pickZip();
    if (!zip) return;
    setLoading('adbdd-prepare');
    try {
      const result = await api.backup.adbddPrepare(zip);
      if (result.matched.length > 0) {
        const dir = await pickFolder();
        if (dir) {
          await api.backup.adbddExecute(dir, result.matched);
        }
      }
    } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleEdlBackup = async () => {
    setLoading('edl-backup');
    try { await api.backup.edlBackup({}); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleEdlRecover = async () => {
    const zip = await pickZip();
    if (!zip) return;
    setLoading('edl-recover');
    try { await api.backup.edlRecover(zip); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleSuperRecovery = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    setLoading('super');
    try { await api.backup.superRecovery(folder); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleFlashTwrp = async () => {
    if (!currentDevice?.innermodel) return;
    setLoading('twrp');
    try { await api.backup.flashTwrp(currentDevice.innermodel); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleAutoFlashTwrp = async () => {
    if (!currentDevice?.innermodel) return;
    setLoading('auto-twrp');
    try { await api.backup.autoFlashTwrp(currentDevice.innermodel); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const handleXposedInstall = async () => {
    setLoading('xposed');
    try { await api.backup.xposedInstall(); } catch (err) { console.error(err); }
    setLoading(null);
  };

  const isTabDisabled = (tabId: TabId): boolean => {
    if (tabId === 'twrp' || tabId === 'auto-twrp' || tabId === 'dcim' || tabId === 'adbdd') return !currentDevice;
    return false;
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <HardDrive className="w-6 h-6 text-blue-400" />
        备份与恢复
      </h1>

      {currentDevice ? (
        <div className="card text-sm flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{getDisplayName(currentDevice.innermodel ?? '')}</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">{currentDevice.serial}</span>
          <span className="badge-success ml-auto">{currentDevice.type}</span>
        </div>
      ) : (
        <div className="card text-sm text-yellow-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          未连接设备
        </div>
      )}

      <div className="flex gap-1 border-b border-slate-700 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} disabled={isTabDisabled(t.id)}
            className={`shrink-0 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.id ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
            } disabled:opacity-40 disabled:cursor-not-allowed`}>
            {t.label}
          </button>
        ))}
      </div>

      {progress && (
        <div className="card text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-300">{progress.stage}</span>
            <span className="text-slate-400">{progress.percent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">{progress.message}</p>
        </div>
      )}

      <div className="card space-y-4">
        {activeTab === 'dcim' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Folder className="w-5 h-5 text-blue-400" />
              DCIM 备份 / 恢复
            </h2>
            <p className="text-sm text-slate-400">从设备备份或恢复 DCIM（照片/视频）。</p>
            <div className="flex gap-3">
              <button onClick={handleDcimBackup} disabled={loading === 'dcim-backup'}
                className="btn-primary flex items-center gap-2">
                {loading === 'dcim-backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                备份 DCIM
              </button>
              <button onClick={handleDcimRecover} disabled={loading === 'dcim-recover'}
                className="btn-secondary flex items-center gap-2">
                {loading === 'dcim-recover' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                恢复 DCIM
              </button>
            </div>
          </>
        )}

        {activeTab === 'adbdd' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-400" />
              ADB-dd 备份 / 恢复
            </h2>
            <p className="text-sm text-slate-400">通过 ADB dd 命令备份或恢复分区。</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleAdbddBackup} disabled={loading === 'adbdd-backup'}
                className="btn-primary flex items-center gap-2">
                {loading === 'adbdd-backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                备份
              </button>
              <button onClick={handleAdbddRecover} disabled={loading === 'adbdd-recover'}
                className="btn-secondary flex items-center gap-2">
                {loading === 'adbdd-recover' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                恢复
              </button>
              <button onClick={handleAdbddPrepare} disabled={loading === 'adbdd-prepare'}
                className="btn-secondary flex items-center gap-2">
                {loading === 'adbdd-prepare' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                准备并执行
              </button>
            </div>
          </>
        )}

        {activeTab === 'edl' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              EDL 9008 备份 / 恢复
            </h2>
            <p className="text-sm text-slate-400">通过 Qualcomm EDL 9008 模式进行完整设备备份/恢复。</p>
            <div className="flex gap-3">
              <button onClick={handleEdlBackup} disabled={loading === 'edl-backup'}
                className="btn-primary flex items-center gap-2">
                {loading === 'edl-backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                EDL 备份
              </button>
              <button onClick={handleEdlRecover} disabled={loading === 'edl-recover'}
                className="btn-secondary flex items-center gap-2">
                {loading === 'edl-recover' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                EDL 恢复
              </button>
            </div>
          </>
        )}

        {activeTab === 'super' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              超级恢复
            </h2>
            <p className="text-sm text-slate-400">从超级恢复文件夹恢复设备。</p>
            <button onClick={handleSuperRecovery} disabled={loading === 'super'}
              className="btn-primary flex items-center gap-2">
              {loading === 'super' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              开始超级恢复
            </button>
          </>
        )}

        {activeTab === 'twrp' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Flashlight className="w-5 h-5 text-blue-400" />
              TWRP 刷写
            </h2>
            <p className="text-sm text-slate-400">将 TWRP Recovery 刷写到设备。</p>
            <button onClick={handleFlashTwrp} disabled={loading === 'twrp' || !currentDevice}

              className="btn-primary flex items-center gap-2">
              {loading === 'twrp' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flashlight className="w-4 h-4" />}
              刷写 TWRP
            </button>
          </>
        )}

        {activeTab === 'auto-twrp' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-400" />
              自动刷写 TWRP
            </h2>
            <p className="text-sm text-slate-400">自动下载并刷写对应机型的 TWRP。</p>
            <button onClick={handleAutoFlashTwrp} disabled={loading === 'auto-twrp' || !currentDevice}
              className="btn-primary flex items-center gap-2">
              {loading === 'auto-twrp' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              自动刷写
            </button>
          </>
        )}

        {activeTab === 'xposed' && (
          <>
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Xposed 安装
            </h2>
            <p className="text-sm text-slate-400">在设备上安装 Xposed 框架。</p>
            <button onClick={handleXposedInstall} disabled={loading === 'xposed'}
              className="btn-primary flex items-center gap-2">
              {loading === 'xposed' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              安装 Xposed
            </button>
          </>
        )}
      </div>
    </div>
  );
}
