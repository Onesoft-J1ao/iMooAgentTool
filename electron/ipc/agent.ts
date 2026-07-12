import { ipcMain } from 'electron';
import { wrap } from '../lib/ipcHelper';
import { agentService } from '../services/AgentService';
import { config } from '../core/config';
import type { AppSettings } from '../../shared/types';

export function registerAgentIpc() {
  ipcMain.handle(
    'agent:search',
    wrap(async (_event, query: string) => {
      return agentService.search(query);
    })
  );

  ipcMain.handle(
    'agent:all-features',
    wrap(async () => {
      return agentService.getAllFeatures();
    })
  );

  ipcMain.handle(
    'agent:random-tip',
    wrap(async () => {
      return agentService.getRandomTip();
    })
  );

  ipcMain.handle(
    'agent:get-config',
    wrap(async () => {
      const settings = config.getSettings();
      return {
        agentApiUrl: settings.agentApiUrl || '',
        agentApiKey: settings.agentApiKey ? maskApiKey(settings.agentApiKey) : '',
        agentModel: settings.agentModel || 'gpt-4o-mini',
        agentEnabled: settings.agentEnabled || false,
      };
    })
  );

  ipcMain.handle(
    'agent:set-config',
    wrap(async (_event, partial: Partial<Pick<AppSettings, 'agentApiUrl' | 'agentApiKey' | 'agentModel' | 'agentEnabled'>>) => {
      const update: Partial<AppSettings> = {};
      if (partial.agentApiUrl !== undefined) update.agentApiUrl = partial.agentApiUrl;
      if (partial.agentApiKey !== undefined) update.agentApiKey = partial.agentApiKey;
      if (partial.agentModel !== undefined) update.agentModel = partial.agentModel;
      if (partial.agentEnabled !== undefined) update.agentEnabled = partial.agentEnabled;
      return config.setSettings(update);
    })
  );

  ipcMain.handle(
    'agent:chat',
    wrap(async (_event, { messages }: { messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> }) => {
      return agentService.chat(messages);
    })
  );

  ipcMain.handle(
    'agent:test-connection',
    wrap(async () => {
      const settings = config.getSettings();
      return agentService.testConnection(
        settings.agentApiUrl || '',
        settings.agentApiKey || '',
        settings.agentModel || 'gpt-4o-mini'
      );
    })
  );
}

function maskApiKey(key: string): string {
  if (key.length <= 8) return key.slice(0, 2) + '****' + key.slice(-2);
  return key.slice(0, 4) + '****' + key.slice(-4);
}
