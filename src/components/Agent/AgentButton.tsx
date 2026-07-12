import { Bot } from 'lucide-react';
import { useAgentStore } from '@/stores/agentStore';

export default function AgentButton() {
  const { isOpen, toggle } = useAgentStore();

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-4 right-4 z-[9999] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        isOpen
          ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400/50'
          : 'bg-slate-700 hover:bg-slate-600 border border-slate-600'
      }`}
      title="AI 助手"
    >
      <Bot className="w-5 h-5 text-white" />
    </button>
  );
}
