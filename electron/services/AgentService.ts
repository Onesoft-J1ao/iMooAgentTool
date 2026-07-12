import type { SearchMatch, SearchResult } from '../../shared/types';
import { config } from '../core/config';

interface Feature {
  path: string;
  name: string;
  keywords: string[];
  description: string;
  category?: string;
}

interface AgentConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
  enabled: boolean;
}

class AgentService {
  private features: Feature[] = [
    { path: '/', name: '主页', keywords: ['home', 'main', 'dashboard', '设备', '状态', '主页'], description: '显示设备基本信息和状态', category: '设备工具' },
    { path: '/reboot', name: '重启模式', keywords: ['reboot', 'restart', '重启', '重啟', 'bootloader', 'recovery', 'edl', 'fastboot'], description: '提供9种重启模式：系统重启、Bootloader、Recovery、EDL深度刷机模式、TWRP临时 Recovery、QMMI诊断模式、FFBM工厂模式、清除数据、FastbootD' },
    { path: '/cloud', name: '云资源管理', keywords: ['cloud', 'resource', 'download', '云', '资源', '下载', '更新'], description: '管理和下载云端的刷机资源、工具和更新包' },
    { path: '/root', name: 'Root工具', keywords: ['root', '破解', '权限', 'magisk', 'supersu', 'sdk19', 'sdk25', 'sdk27'], description: '完整Root工作流，支持SDK19/25/27/ND03/ND08，一键获取手表Root权限' },
    { path: '/files', name: '文件管理', keywords: ['file', 'files', '文件', 'adb', 'push', 'pull', '上传', '下载', '管理'], description: '通过ADB浏览、上传、下载、删除、重命名手表文件，支持搜索和批量操作' },
    { path: '/apps', name: '应用管理', keywords: ['app', 'apps', '应用', '安装', '卸载', 'apk', 'z10', '解锁', '自启动'], description: '管理手表应用：安装APK、卸载应用、Z10解锁、配置QQ/微信自启动' },
    { path: '/tools', name: '工具箱', keywords: ['tools', 'tool', '工具', '充电', 'wifi', 'ota', '驱动', 'atbmod', 'build.prop', '属性'], description: '实用工具合集：开启充电、查看系统属性、WiFi ADB连接、离线OTA升级、驱动检测安装、ATBMod模块管理、RootPro优化' },
    { path: '/magisk', name: 'Magisk模块', keywords: ['magisk', '模块', 'module', '面具', 'root', 'zygisk'], description: '管理Magisk模块：查看已安装模块、安装/卸载、启用/停用、从商店搜索安装' },
    { path: '/backup', name: '备份恢复', keywords: ['backup', 'restore', '备份', '恢复', 'dcim', 'edl', 'twrp', 'xposed', '数据'], description: '多种备份恢复方案：DCIM照片备份、ADB-dd全分区备份、EDL深度备份、Super Recovery、TWRP刷入、Xposed安装' },
    { path: '/edl-partitions', name: 'EDL分区管理', keywords: ['edl', 'partition', '分区', 'gpt', 'loader', '刷机', '9008'], description: 'EDL模式下的分区管理：查看GPT分区表、备份/恢复/擦除/验证分区' },
    { path: '/settings', name: '设置', keywords: ['settings', 'setting', '设置', '配置', 'config', 'opacity', '透明度'], description: '应用设置：窗口透明度、速度启动、更新检查、详细日志、语言切换、资源校验' },
    { path: '/logs', name: '日志', keywords: ['log', 'logs', '日志', '调试', 'debug', '输出'], description: '实时日志查看器：过滤级别、搜索、自动滚动、复制日志内容' },
  ];

  private tips: string[] = [
    '在重启模式中可以选择EDL深度刷机模式进入高通9008端口',
    'Root工具支持SDK19/25/27/ND03/ND08多种分支',
    '文件管理支持拖拽上传和批量下载操作',
    'Z10解锁功能位于应用管理中',
    'EDL分区管理需要设备处于EDL深度刷机模式',
    'WiFi ADB连接前需要先在设备上启用WiFi ADB',
    '离线OTA升级需要选择对应的OTA ZIP文件',
    '备份恢复中的Super Recovery提供一键式全量备份',
    'Magisk模块可以从内置商店搜索并直接安装',
    '工具箱中的RootPro针对Android 8.1优化',
  ];

  async search(query: string): Promise<SearchResult> {
    const settings = config.getSettings();
    if (settings.agentEnabled && settings.agentApiUrl && settings.agentApiKey) {
      return this.callAI(query, settings.agentApiUrl, settings.agentApiKey, settings.agentModel);
    }
    return this.keywordSearch(query);
  }

  private keywordSearch(query: string): SearchResult {
    const q = query.toLowerCase().trim();
    if (!q) return { matches: [], aiPowered: false };

    const scored = this.features.map((f) => {
      let score = 0;

      for (const kw of f.keywords) {
        if (q.includes(kw.toLowerCase())) {
          score += 10;
        } else if (kw.toLowerCase().includes(q)) {
          score += 5;
        }
      }

      if (q.includes(f.name.toLowerCase())) {
        score += 15;
      }

      if (f.description.toLowerCase().includes(q)) {
        score += 3;
      }

      return { feature: f, score };
    });

    const sorted = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);

    return {
      matches: sorted.slice(0, 3).map((s) => ({
        path: s.feature.path,
        name: s.feature.name,
        description: s.feature.description,
        confidence: Math.min(100, Math.round((s.score / 30) * 100)),
        explanation: s.feature.description,
      })),
      aiPowered: false,
    };
  }

  private buildApiUrl(base: string): string {
    let url = base.replace(/\/+$/, '');
    if (!url.endsWith('/v1/chat/completions') && !url.endsWith('/v1/chat/completions/')) {
      if (url.endsWith('/v1')) url += '/chat/completions';
      else url += '/v1/chat/completions';
    }
    return url;
  }

  private async callAI(query: string, apiUrl: string, apiKey: string, model: string): Promise<SearchResult> {
    try {
      const featuresList = this.features.map((f) =>
        `- path: ${f.path}\n  name: ${f.name}\n  description: ${f.description}`
      ).join('\n');

      const systemPrompt = `You are a feature finder for iMooDesktop, a smartwatch tool application.

Available features:
${featuresList}

Analyze the user's query and select the most relevant features (up to 3).
Respond ONLY with a valid JSON array (no markdown, no extra text):
[
  {
    "path": "...",
    "name": "...",
    "description": "...",
    "confidence": 95,
    "explanation": "Why this feature matches the query"
  }
]
If no features match, respond with []`;

      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          temperature: 0.3,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '[]';
      const parsed = JSON.parse(content);

      const matches: SearchMatch[] = (Array.isArray(parsed) ? parsed : []).slice(0, 3).map((m: any) => ({
        path: m.path || '',
        name: m.name || '',
        description: m.description || '',
        confidence: typeof m.confidence === 'number' ? Math.min(100, Math.max(0, m.confidence)) : 50,
        explanation: m.explanation || '',
      }));

      return { matches, aiPowered: true };
    } catch {
      return this.keywordSearch(query);
    }
  }

  async chat(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<{ reply: string }> {
    const settings = config.getSettings();
    const apiUrl = settings.agentApiUrl || '';
    const apiKey = settings.agentApiKey || '';
    const model = settings.agentModel || 'gpt-4o-mini';

    if (!apiUrl || !apiKey) {
      throw new Error('AI 服务未配置，请在设置中配置 API');
    }

    try {
      const systemMessage = { role: 'system' as const, content: '你是一个智能助手，帮助用户使用 iMooDesktop 智能手表工具箱。你可以回答关于软件功能、使用方法和一般性问题。请用中文回复，简洁明了。' };

      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${text.slice(0, 200)}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || '';
      return { reply };
    } catch (err: any) {
      throw new Error(`AI 对话失败: ${err.message}`);
    }
  }

  async testConnection(apiUrl: string, apiKey: string, model: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(this.buildApiUrl(apiUrl), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        return { success: false, message: `HTTP ${response.status}: ${text.slice(0, 200)}` };
      }
      return { success: true, message: '连接成功' };
    } catch (err: any) {
      return { success: false, message: err.message || '连接失败' };
    }
  }

  getFeature(path: string): Feature | undefined {
    return this.features.find((f) => f.path === path);
  }

  getAllFeatures(): Feature[] {
    return [...this.features];
  }

  getRandomTip(): string {
    return this.tips[Math.floor(Math.random() * this.tips.length)];
  }
}

export const agentService = new AgentService();
