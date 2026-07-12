import { Loader2 } from 'lucide-react';

interface SplashScreenProps {
  message?: string;
}

export function SplashScreen({ message = '加载中...' }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 bg-[#0f0f1a] flex flex-col items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-3xl font-bold text-white">iM</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <Loader2 size={14} className="text-white animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">iMooDesktop</h1>
          <p className="text-sm text-slate-400 mt-1">XTC 电话手表工具箱</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 size={14} className="animate-spin" />
          <span className="text-xs">{message}</span>
        </div>
      </div>
    </div>
  );
}
