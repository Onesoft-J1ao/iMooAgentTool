// iMooAgentTool - Agent Window Preload
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentApi', {
  search: q => ipcRenderer.invoke('agent:search', q),
  chat: m => ipcRenderer.invoke('agent:chat', { messages: m }),
  getConfig: () => ipcRenderer.invoke('agent:get-config'),
  setConfig: p => ipcRenderer.invoke('agent:set-config', p),
  testConnection: (a, k, m) => ipcRenderer.invoke('agent:test-connection', { apiUrl: a, apiKey: k, model: m }),
  openWindow: () => ipcRenderer.invoke('agent:open-window'),
  minimize: () => ipcRenderer.invoke('agent:minimize'),
});