import { useState } from 'react';
import { X, Send, Bot, ChevronRight, Loader2, Settings, MessageSquare, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAgentStore } from '@/stores/agentStore';

export default function AgentPanel() {
  const navigate = useNavigate();
  const { isOpen, messages, isLoading, mode, close, sendMessage, clearMessages, loadModelName, modelName, setMode } = useAgentStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    loadModelName();
  }, [loadModelName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = draft.trim();
    if (!val || isLoading) return;
    sendMessage(val);
    setDraft('');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    close();
  };

  const handleGoSettings = () => {
    navigate('/settings');
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9998] w-80 sm:w-96">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/90">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-white">AI 助手</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={clearMessages} className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-700/50">
              清除
            </button>
            <button onClick={close} className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-700/50">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-700">
          <button
            onClick={() => setMode('search')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mode === 'search' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            搜索功能
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
              mode === 'chat' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            自由对话
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[280px] max-h-[360px]">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              {mode === 'search' ? (
                <>
                  <p className="text-sm text-slate-500">输入关键词搜索功能</p>
                  <p className="text-xs text-slate-600 mt-1">例如：重启、备份、Root</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-500">开始与 AI 自由对话</p>
                  <p className="text-xs text-slate-600 mt-1">询问任何关于 iMooAgentTool 的问题</p>
                </>
              )}
              {!modelName && (
                <button onClick={handleGoSettings}
                  className="mt-4 flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-xs bg-slate-700/50 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors">
                  <Settings className="w-3.5 h-3.5" />
                  配置 AI Agent
                </button>
              )}
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-500/20 border border-blue-500/20' : 'bg-slate-700/50 border border-slate-600/30'} rounded-lg p-3`}>
                {msg.role === 'assistant' && msg.features && msg.features.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-2">
                    {msg.aiPowered ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/20">
                        AI
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-600/50 text-slate-400 border border-slate-500/30">
                        关键词
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.content}</p>
                {msg.features && msg.features.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.features.map((f, i) => (
                      <div key={i} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-600/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-300">{f.featureName}</span>
                          <button
                            onClick={() => handleNavigate(f.featurePath)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5"
                          >
                            前往 <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{f.explanation}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${f.confidence >= 70 ? 'bg-green-500' : f.confidence >= 40 ? 'bg-yellow-500' : 'bg-slate-500'}`}
                              style={{ width: `${f.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{f.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {msg.role === 'assistant' && msg.aiPowered && msg.modelName && (
                  <div className="mt-2 text-right">
                    <span className="text-[10px] text-slate-600">Powered by {msg.modelName}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 border border-slate-600/30 rounded-lg p-3">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              placeholder={mode === 'search' ? '搜索功能...' : '输入消息...'}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
              disabled={isLoading}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading || !draft.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg px-3 py-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
