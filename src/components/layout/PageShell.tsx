import React from 'react';
import { useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { FloatingAiAssistant } from './FloatingAiAssistant';

export interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const location = useLocation();
  const isAssistant = location.pathname.startsWith('/assistant');
  const isAuthPage = location.pathname === '/login';

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-dot-grid flex items-center justify-center relative selection:bg-brand-blue/20 selection:text-brand-blue p-4">
        <main className="w-full max-w-md mx-auto">
          <div key={location.pathname} className="animate-page-fade">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dot-grid flex relative selection:bg-brand-blue/20 selection:text-brand-blue">
      {/* Sidebar Nav */}
      <BottomNav />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <TopBar />
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-36">
          <div key={location.pathname} className="animate-page-fade">
            {children}
          </div>
        </main>
      </div>

      {!isAssistant && <FloatingAiAssistant />}
    </div>
  );
};
