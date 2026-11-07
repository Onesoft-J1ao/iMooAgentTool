import { useEffect, useState } from 'react';
import { Smartphone, Battery, HardDrive, Cpu, Zap, FolderOpen, Grid, Database } from 'lucide-react';
import { useDevice } from '@/hooks/useDevice';
import { getDisplayName } from '@/lib/models';
import { APP_META } from '@shared/types';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

function formatBytes(bytes?: number) {
  if (!bytes) return '未知';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

export default function Home() {
  const device = useDevice();
  const navigate = useNavigate();
  const [disk, setDisk] = useState<{ total: number; used: number; free: number } | null>(null);

  useEffect(() => {
    if (!device?.serial) {
      setDisk(null);
      return;
    }
    api.file.diskInfo(device.serial, '/sdcard').then(setDisk).catch(() => setDisk(null));
  }, [device?.serial]);

  const actions = [
    { label: '文件管理', icon: FolderOpen, path: '/files' },
    { label: '应用管理', icon: Grid, path: '/apps' },
    { label: 'Root 工具', icon: Zap, path: '/root' },
    { label: 'Magisk', icon: Database, path: '/magisk' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">iMooAgentTool</h1>
        <p className="text-sm text-slate-400 mt-1">XTC 电话手表工具箱</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone size={20} className="text-blue-400" />
          <h2 className="text-lg font-semibold text-white">设备状态</h2>
          {device && <span className="badge-success ml-auto">{device.type}</span>}
        </div>
        {device ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">型号</span><span className="text-slate-200">{getDisplayName(device.innermodel ?? '') || device.model || '未知'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">内部型号</span><span className="text-slate-200">{device.innermodel || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">序列号</span><span className="text-slate-200 font-mono">{device.serial}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Android / SDK</span><span className="text-slate-200">{device.androidVersion || '-'} / {device.sdkVersion || '-'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">软件版本</span><span className="text-slate-200">{device.softVersion || '-'}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><Battery className="w-3.5 h-3.5" />电量</span><span className="text-slate-200">{device.batteryLevel != null ? `${device.batteryLevel}%` : '未知'}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" />存储</span><span className="text-slate-200">{disk ? `${formatBytes(disk.used)} / ${formatBytes(disk.total)}` : '未知'}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-1"><Cpu className="w-3.5 h-3.5" />ABI</span><span className="text-slate-200">{device.cpuAbi || '-'}</span></div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">未检测到设备。请连接设备后重试。</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => (
          <button key={action.path} onClick={() => navigate(action.path)}
            className="card flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left">
            <action.icon className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-200">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-2">关于</h2>
        <div className="space-y-1 text-sm text-slate-400">
          <p>版本: {APP_META.version}</p>
          <p>{APP_META.copyright}</p>
          <p>业务逻辑参考 {APP_META.basedOn}</p>
        </div>
      </div>
    </div>
  );
}
