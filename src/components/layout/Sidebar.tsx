import { NavLink } from 'react-router-dom';
import { Smartphone, WifiOff } from 'lucide-react';
import brandIcon from '@/assets/icon.png';
import { menuItems, categories } from '@/lib/menus';
import { useDevice } from '@/hooks/useDevice';
import { getDisplayName } from '@/lib/models';
import type { DeviceType } from '@shared/types';

const deviceTypeColors: Record<DeviceType, string> = {
  adb: 'text-green-400',
  fastboot: 'text-blue-400',
  qcom_edl: 'text-purple-400',
  sprd_edl: 'text-purple-400',
  emulator: 'text-yellow-400',
  unauthorized: 'text-orange-400',
  offline: 'text-red-400',
};

const deviceTypeLabels: Record<DeviceType, string> = {
  adb: 'ADB',
  fastboot: 'Fastboot',
  qcom_edl: 'EDL (QCOM)',
  sprd_edl: 'EDL (SPRD)',
  emulator: '模拟器',
  unauthorized: '未授权',
  offline: '离线',
};

export function Sidebar() {
  const device = useDevice();

  return (
    <aside className="w-56 flex flex-col bg-slate-900/80 border-r border-slate-700/50 h-full">
      <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-700/50">
        <img src={brandIcon} alt="iMooAgentTool" className="w-8 h-8 rounded-lg object-cover" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">iMooAgentTool</p>
          <p className="text-[10px] text-slate-500">XTC Toolbox</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {categories.map((category) => {
          const items = menuItems.filter((m) => m.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category} className="mb-2">
              <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {category}
              </div>
              {items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-700/50 p-3">
        {device ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Smartphone size={18} className={deviceTypeColors[device.type] ?? 'text-slate-400'} />
              <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${device.type === 'adb' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-300 truncate">
                {getDisplayName(device.innermodel ?? '') || device.model || device.serial}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {deviceTypeLabels[device.type] ?? device.type} - {device.serial?.slice(0, 8)}...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <WifiOff size={16} />
            <span className="text-xs">未检测到设备</span>
          </div>
        )}
      </div>
    </aside>
  );
}
