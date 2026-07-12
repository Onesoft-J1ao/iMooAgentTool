import { Grid } from 'lucide-react';

export default function Apps() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Grid size={24} className="text-blue-400" />
        <h1 className="text-2xl font-bold text-white">应用管理</h1>
      </div>
      <p className="text-slate-400">管理设备应用。</p>
    </div>
  );
}
