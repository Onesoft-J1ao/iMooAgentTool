import { RefreshCw } from 'lucide-react';

export default function Reboot() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <RefreshCw size={24} className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">重启模式</h1>
      </div>
      <p className="text-slate-400">重启设备到不同模式。</p>
    </div>
  );
}
