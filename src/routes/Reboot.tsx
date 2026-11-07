import { useState } from 'react';
import {
  RefreshCw, Smartphone, AlertTriangle, Power, HardDriveDownload, Wrench,
  Zap, Factory, RotateCcw, Monitor, CheckCircle, XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useDeviceStore } from '@/stores/deviceStore';
import type { RebootMode } from '@shared/types';

interface RebootOption {
  mode: RebootMode;
  title: string;
  description: string;
  icon: typeof Power;
  danger?: boolean;
}

const options: RebootOption[] = [
  { mode: 'system', title: '重启至系统', description: '正常重启并回到 Android 系统', icon: Power },
  { mode: 'bootloader', title: '重启至 Bootloader', description: '进入 Fastboot / Bootloader 模式', icon: Wrench },
  { mode: 'recovery', title: '重启至 Recovery', description: '进入设备 Recovery 分区', icon: RotateCcw },
  { mode: 'edl', title: '重启至 EDL 9008', description: '进入高通 9008 深度刷机模式', icon: HardDriveDownload },
  { mode: 'twrp-temp', title: '临时启动 TWRP', description: '不刷入，临时引导 TWRP Recovery', icon: Zap },
  { mode: 'qmmi', title: 'QMMI 诊断模式', description: '通过 misc 分区进入 QMMI', icon: Monitor },
  { mode: 'ffbm', title: 'FFBM 工厂模式', description: '通过 misc 分区进入工厂模式', icon: Factory },
  { mode: 'wipe-data', title: '清除数据', description: '进入 Recovery 并清除 data 分区', icon: XCircle, danger: true },
  { mode: 'fastbootd', title: 'FastbootD', description: '进入用户空间 FastbootD 模式', icon: CheckCircle },
];

export default function Reboot() {
  const { currentDevice } = useDeviceStore();
  const [running, setRunning] = useState<RebootMode | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReboot = async (option: RebootOption) => {
    if (!currentDevice) return;
    if (option.danger && !confirm(`${option.title} 会清除设备数据，继续？`)) return;
    setRunning(option.mode);
    setError('');
    setMessage('');
    try {
      const result = await api.reboot.execute(option.mode);
      if (result && typeof result === 'object' && 'error' in result) {
        setError(String(result.error));
      } else {
        setMessage(`${option.title} 指令已发送`);
      }
    } catch (e) {
      setError((e as Error).message);
    }
    setRunning(null);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <RefreshCw className="w-6 h-6 text-blue-400" />
        重启模式
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

      {message && <div className="card text-sm text-green-400">{message}</div>}
      {error && <div className="card text-sm text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {options.map((option) => (
          <button
            key={option.mode}
            onClick={() => handleReboot(option)}
            disabled={!currentDevice || !!running}
            className={`card text-left flex items-start gap-3 hover:bg-slate-700/40 transition-colors disabled:opacity-50 ${option.danger ? 'border-red-700/50' : ''}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${option.danger ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>
              {running === option.mode ? <RefreshCw className="w-5 h-5 animate-spin" /> : <option.icon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">{option.title}</h2>
              <p className="text-xs text-slate-400 mt-1">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
