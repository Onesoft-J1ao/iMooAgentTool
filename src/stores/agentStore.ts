import { create } from 'zustand';
import { searchFeatures, chatWithAI, getAgentConfig } from '@/lib/agentApi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  features?: Array<{
    featurePath: string;
    featureName: string;
    explanation: string;
    confidence: number;
  }>;
  aiPowered?: boolean;
  modelName?: string;
}

interface AgentState {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  modelName: string;
  mode: 'chat' | 'search';
  toggle: () => void;
  open: () => void;
  close: () => void;
  setMode: (mode: 'chat' | 'search') => void;
  sendMessage: (content: string) => Promise<void>;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  loadModelName: () => Promise<void>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  modelName: '',
  mode: 'search',
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode, messages: [] }),
  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content,
    };
    get().addMessage(userMsg);
    set({ isLoading: true });

    const mode = get().mode;

    try {
      if (mode === 'search') {
        const result = await searchFeatures(content);
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: result.matches.length > 0
            ? `我找到了 ${result.matches.length} 个相关功能：`
            : '抱歉，没有找到与您查询相关的功能。请尝试其他关键词。',
          features: result.matches.map((m) => ({
            featurePath: m.path,
            featureName: m.name,
            explanation: m.explanation,
            confidence: m.confidence,
          })),
          aiPowered: result.aiPowered,
          modelName: result.aiPowered ? get().modelName : undefined,
        };
        get().addMessage(assistantMsg);
      } else {
        const messages = get().messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        const result = await chatWithAI(messages);
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-assistant`,
          role: 'assistant',
          content: result.reply,
        };
        get().addMessage(assistantMsg);
      }
    } catch (err: any) {
      get().addMessage({
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: err.message || '操作时出现错误，请稍后重试。',
      });
    }
    set({ isLoading: false });
  },
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  loadModelName: async () => {
    try {
      const cfg = await getAgentConfig();
      set({ modelName: cfg.agentModel || '' });
    } catch {
      set({ modelName: '' });
    }
  },
}));
