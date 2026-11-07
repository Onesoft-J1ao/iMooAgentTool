import { useEffect, useState } from 'react';
import {
  Settings, Sun, Zap, Clock, FileText, Globe, Bug, CheckCircle,
  XCircle, RefreshCw, Info, Bot, Key, Link, Cpu, Loader2, Save, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import type { AppSettings } from '@shared/types';
import { DEFAULT_SETTINGS } from '@shared/types';
import { setAgentConfig, testAgentConnection } from '@/lib/agentApi';
import { useSettingsStore } from '@/stores/settingsStore';

const checkUpdateOptions = [
  { value: 0, label: '从不' },
  { value: 1, label: '1 小时' },
  { value: 6, label: '6 小时' },
  { value: 12, label: '12 小时' },
  { value: 24, label: '24 小时' },
];

export default function SettingsPage() {
  const storeSettings = useSettingsStore((s) => s.settings);
  const storeLoaded = useSettingsStore((s) => s.loaded);
  const storeUpdate = useSettingsStore((s) => s.update);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifyResults, setVerifyResults] = useState<Array<{ file: string; ok: boolean; expected: string; actual: string; missing: boolean }> | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [version, setVersion] = useState('...');
  const [saving, setSaving] = useState(false);

  const [agentUrl, setAgentUrl] = useState('');
  const [agentKey, setAgentKey] = useState('');
  const [agentModel, setAgentModel] = useState('gpt-4o-mini');
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);
  const [agentSaving, setAgentSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = storeLoaded ? storeSettings : await api.system.getSettings();
        const v = await api.system.getVersion();
        setSettings(s);
        setVersion(v.version);
        setAgentUrl(s.agentApiUrl || '');
        setAgentKey(s.agentApiKey || '');
        setAgentModel(s.agentModel || 'gpt-4o-mini');
        setAgentEnabled(s.agentEnabled || false);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    load();
  }, [storeLoaded, storeSettings]);

  const updateSetting = async (key: keyof AppSettings, value: unknown) => {
    if (!settings) return;
    setSaving(true);
    try {
      await storeUpdate({ [key]: value } as Partial<AppSettings>);
      const updated = { ...settings, [key]: value };
      setSettings(updated);

      if (key === 'windowOpacity') {
        await api.system.setWindowOpacity(value as number / 100);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const results = await api.system.verifyResources();
      setVerifyResults(results);
    } catch (err) { console.error(err); }
    setVerifying(false);
  };

  const handleSaveAgent = async () => {
    setAgentSaving(true);
    try {
      await setAgentConfig({
        agentApiUrl: agentUrl,
        agentApiKey: agentKey,
        agentModel: agentModel,
        agentEnabled: agentEnabled,
      });
    } catch (err) { console.error(err); }
    setAgentSaving(false);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus(null);
    try {
      await setAgentConfig({
        agentApiUrl: agentUrl,
        agentApiKey: agentKey,
        agentModel: agentModel,
      });
      const result = await testAgentConnection();
      setConnectionStatus(result);
    } catch (err: any) {
      setConnectionStatus({ success: false, message: err.message || '连接失败' });
    }
    setTesting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!settings) {
    return <div className="p-6 text-red-400">加载设置失败。</div>;
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Settings className="w-6 h-6 text-blue-400" />
        设置
      </h1>

      <div className="card space-y-6">
        <div className="space-y-2">
          <label className="label flex items-center gap-2">
            <Sun className="w-4 h-4" />
            窗口透明度 ({settings.windowOpacity}%)
          </label>
          <input type="range" min={20} max={100} value={settings.windowOpacity}
            onChange={(e) => updateSetting('windowOpacity', parseInt(e.target.value))}
            className="w-full accent-blue-500" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>20%</span><span>100%</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Zap className="w-4 h-4" />
              快速启动
            </span>
            <input type="checkbox" checked={settings.speedStart}
              onChange={(e) => updateSetting('speedStart', e.target.checked)}
              className="rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500" />
          </label>

          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <FileText className="w-4 h-4" />
              详细日志
            </span>
            <input type="checkbox" checked={settings.detailedLog}
              onChange={(e) => updateSetting('detailedLog', e.target.checked)}
              className="rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500" />
          </label>

          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Globe className="w-4 h-4" />
              英文模式
            </span>
            <input type="checkbox" checked={settings.infoEn}
              onChange={(e) => updateSetting('infoEn', e.target.checked)}
              className="rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500" />
          </label>

          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-300">
              <Bug className="w-4 h-4" />
              用户调试模式
            </span>
            <input type="checkbox" checked={settings.onUserDebug}
              onChange={(e) => updateSetting('onUserDebug', e.target.checked)}
              className="rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500" />
          </label>
        </div>

        <div>
          <label className="label flex items-center gap-2">
            <Clock className="w-4 h-4" />
            检查更新间隔
          </label>
          <select className="select" value={settings.checkUpdateTime}
            onChange={(e) => updateSetting('checkUpdateTime', parseInt(e.target.value))}>
            {checkUpdateOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Bot className="w-4 h-4" />
          AI Agent 配置
        </h2>

        <label className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Cpu className="w-4 h-4" />
            启用 AI Agent
          </span>
          <input type="checkbox" checked={agentEnabled}
            onChange={(e) => setAgentEnabled(e.target.checked)}
            className="rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500" />
        </label>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Link className="w-4 h-4" />
            API 地址
          </label>
          <input type="text" value={agentUrl}
            onChange={(e) => setAgentUrl(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Key className="w-4 h-4" />
            API Key
          </label>
          <input type="password" value={agentKey}
            onChange={(e) => setAgentKey(e.target.value)}
            placeholder="sk-..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-slate-300 mb-1.5">
            <Cpu className="w-4 h-4" />
            模型名称
          </label>
          <input type="text" value={agentModel}
            onChange={(e) => setAgentModel(e.target.value)}
            placeholder="gpt-4o-mini"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50" />
        </div>

        {connectionStatus && (
          <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
            connectionStatus.success
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {connectionStatus.success ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {connectionStatus.message}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleTestConnection} disabled={testing || !agentUrl || !agentKey}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            测试连接
          </button>
          <button onClick={handleSaveAgent} disabled={agentSaving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {agentSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            保存配置
          </button>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            资源验证
          </h2>
          <button onClick={handleVerify} disabled={verifying}
            className="btn-primary text-xs flex items-center gap-1">
            {verifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            验证
          </button>
        </div>
        {verifyResults && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {verifyResults.map((r) => (
              <div key={r.file} className="flex items-center gap-2 text-xs">
                {r.missing ? (
                  <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                ) : r.ok ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                )}
                <span className="text-slate-300 truncate">{r.file}</span>
                {!r.ok && !r.missing && (
                    <span className="text-slate-500 shrink-0">MD5 不匹配</span>
                  )}
                  {r.missing && <span className="text-red-400 shrink-0">缺失</span>}
              </div>
            ))}
          </div>
        )}
        {verifyResults && verifyResults.length === 0 && (
          <p className="text-xs text-slate-500">所有资源已验证通过。</p>
        )}
      </div>

      <div className="card flex items-center gap-4 text-sm">
        <Info className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-white font-medium">iMooAgentTool</p>
          <p className="text-slate-400">版本 {version}</p>
        </div>
      </div>
    </div>
  );
}
