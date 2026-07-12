import { Smartphone } from 'lucide-react';
import { useDevice } from '@/hooks/useDevice';
import { getDisplayName } from '@/lib/models';
import { APP_META } from '@shared/types';

export default function Home() {
  const device = useDevice();

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
        </div>
        {device ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">型号</span><span className="text-slate-200">{getDisplayName(device.innermodel ?? '') || device.model || '未知'}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">序列号</span><span className="text-slate-200">{device.serial}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">模式</span><span className="text-slate-200">{device.type}</span></div>
            {device.androidVersion && <div className="flex justify-between"><span className="text-slate-400">系统版本</span><span className="text-slate-200">{device.androidVersion}</span></div>}
            {device.softVersion && <div className="flex justify-between"><span className="text-slate-400">软件版本</span><span className="text-slate-200">{device.softVersion}</span></div>}
          </div>
        ) : (
          <p className="text-sm text-slate-500">未检测到设备。请连接设备后重试。</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-2">关于</h2>
        <div className="space-y-1 text-sm text-slate-400">
          <p>版本: {APP_META.version}</p>
          <p>{APP_META.copyright}</p>
          <p>基于 {APP_META.basedOn}</p>
        </div>
      </div>
    </div>
  );
}
