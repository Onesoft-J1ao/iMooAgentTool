import { Cloud } from 'lucide-react';

export default function CloudPage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Cloud size={24} className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">资源管理</h1>
      </div>
      <p className="text-slate-400">云端资源下载和管理。</p>
    </div>
  );
}
