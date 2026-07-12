import { type ReactNode } from 'react';
import { TitleBar } from '@/components/layout/TitleBar';
import { Sidebar } from '@/components/layout/Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#0f0f1a] overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-[#0f0f1a]">
          {children}
        </main>
      </div>
    </div>
  );
}
