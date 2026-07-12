import { useEffect, useState, useCallback } from 'react';
import {
  Terminal, RefreshCw, Download, Upload, Trash2, CheckCircle,
  RotateCcw, Clock, AlertTriangle, HardDrive, FileText
} from 'lucide-react';
import { api } from '@/lib/api';

interface PartitionEntry {
  label: string;
  size: number;
  lba: number;
}

interface HistoryEntry {
  timestamp: number;
  action: string;
  details: string;
}

export default function EdlPartitions() {
  const [loaders, setLoaders] = useState<string[]>([]);
  const [selectedLoader, setSelectedLoader] = useState('');
  const [partitions, setPartitions] = useState<PartitionEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [edlFound, setEdlFound] = useState(false);
  const [progress, setProgress] = useState<{ stage: string; percent: number; message: string } | null>(null);
  const [operating, setOperating] = useState<string | null>(null);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const lrs = await api.edlPartition.listLoaders();
      setLoaders(lrs);
      if (lrs.length > 0) setSelectedLoader(lrs[0]);

      const edl = await api.edlPartition.checkEdlDevice();
      setEdlFound(edl.found);

      const hist = await api.edlPartition.getHistory();
      setHistory(hist);
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
    const unsub1 = api.edlPartition.onProgress(setProgress);
    const unsub2 = api.edlPartition.onTransferProgress(() => {});
    return () => { unsub1(); unsub2(); };
  }, [init]);

  const handlePrintGpt = async () => {
    if (!selectedLoader) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.edlPartition.printGpt(selectedLoader);
      const lines = result.split('\n').filter(l => l.trim());
      const parsed: PartitionEntry[] = [];
      for (const line of lines) {
        const parts = line.split(/\s+/);
        if (parts.length >= 3) {
          parsed.push({ label: parts[0], size: parseInt(parts[1]) || 0, lba: parseInt(parts[2]) || 0 });
        }
      }
      setPartitions(parsed.length > 0 ? parsed : []);
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  };

  const handleOp = async (op: string, label: string) => {
    const key = `${op}:${label}`;
    setOperating(key);
    setError('');
    try {
      const opts: Record<string, unknown> = { loader: selectedLoader, partition: label };
      switch (op) {
        case 'backup':
          await api.edlPartition.backupPartition(opts);
          break;
        case 'restore':
          await api.edlPartition.restorePartition(opts);
          break;
        case 'erase':
          if (!confirm(`擦除分区 "${label}"？此操作不可撤销！`)) return;
          await api.edlPartition.erasePartition(opts);
          break;
        case 'verify':
          await api.edlPartition.verifyPartition(opts);
          break;
      }
      const hist = await api.edlPartition.getHistory();
      setHistory(hist);
    } catch (err) {
      setError(String(err));
    }
    setOperating(null);
  };

  const handleReset = async () => {
    if (!selectedLoader) return;
    if (!confirm('重置设备？设备将从 EDL 模式重启。')) return;
    try {
      await api.edlPartition.resetDevice(selectedLoader);
    } catch (err) {
      setError(String(err));
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) { size /= 1024; i++; }
    return `${size.toFixed(2)} ${units[i]}`;
  };

  if (loading && partitions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Terminal className="w-6 h-6 text-blue-400" />
        EDL 分区管理
      </h1>

      <div className="flex items-center gap-3">
        <AlertTriangle className={`w-4 h-4 ${edlFound ? 'text-green-400' : 'text-red-400'}`} />
        <span className={`text-sm ${edlFound ? 'text-green-400' : 'text-red-400'}`}>
          EDL 设备：{edlFound ? '已找到' : '未找到'}
        </span>
        <button onClick={init} className="btn-secondary text-xs ml-auto">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="label">加载器</label>
          <select className="select" value={selectedLoader} onChange={(e) => setSelectedLoader(e.target.value)}>
            <option value="">-- 选择加载器 --</option>
            {loaders.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={handlePrintGpt} disabled={!selectedLoader || loading} className="btn-primary flex items-center gap-2">
          <FileText className="w-4 h-4" />
          读取 GPT
        </button>
        <button onClick={handleReset} disabled={!selectedLoader} className="btn-danger flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          重置
        </button>
      </div>

      {error && <div className="card text-red-400 text-sm">{error}</div>}

      {progress && (
        <div className="card text-sm">
          <p className="text-slate-300">{progress.stage}: {progress.message}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      {partitions.length > 0 && (
        <div className="card p-0 overflow-hidden">
          <div className="grid grid-cols-6 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50">
            <span className="col-span-2">分区名</span>
            <span className="col-span-1 text-right">大小</span>
            <span className="col-span-1 text-right">LBA</span>
            <span className="col-span-2 text-right">操作</span>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-80 overflow-y-auto">
            {partitions.map((p) => (
              <div key={p.label} className="grid grid-cols-6 gap-2 px-4 py-2 text-sm hover:bg-slate-700/30 transition-colors items-center">
                <span className="col-span-2 text-slate-200 font-mono">{p.label}</span>
                <span className="col-span-1 text-right text-slate-400 text-xs">{formatSize(p.size)}</span>
                <span className="col-span-1 text-right text-slate-400 text-xs">{p.lba}</span>
                <div className="col-span-2 flex justify-end gap-1">
                    <button onClick={() => handleOp('backup', p.label)} disabled={operating === `backup:${p.label}`}
                      className="p-1.5 hover:bg-slate-600 rounded" title="备份">
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                    </button>
                    <button onClick={() => handleOp('restore', p.label)} disabled={operating === `restore:${p.label}`}
                      className="p-1.5 hover:bg-slate-600 rounded" title="恢复">
                      <Upload className="w-3.5 h-3.5 text-green-400" />
                    </button>
                    <button onClick={() => handleOp('erase', p.label)} disabled={operating === `erase:${p.label}`}
                      className="p-1.5 hover:bg-slate-600 rounded" title="擦除">
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                    <button onClick={() => handleOp('verify', p.label)} disabled={operating === `verify:${p.label}`}
                      className="p-1.5 hover:bg-slate-600 rounded" title="验证">
                      <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4" />
          操作历史
        </h2>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm">暂无历史记录。</p>
          ) : (
            history.slice().reverse().map((h, i) => (
              <div key={i} className="text-xs text-slate-400">
                <span className="text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                {' '}[<span className="text-blue-400">{h.action}</span>] {h.details}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
