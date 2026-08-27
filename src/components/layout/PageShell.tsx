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

  const knownRoutes = [
    '/',
    '/login',
    '/documents',
    '/risk-reports',
    '/assistant',
    '/settings',
    '/scan',
    '/models',
    '/agent-action'
  ];

  const isKnownRoute = knownRoutes.includes(location.pathname) || 
    location.pathname.startsWith('/analysis') || 
    location.pathname.startsWith('/comparison');

  const isNotFoundPage = !isKnownRoute;

  // On Login page or 404 Not Found page, hide TopBar, BottomNav, and Floating AI Assistant
  if (isAuthPage || isNotFoundPage) {
    return (
      <div className="min-h-screen w-full bg-dot-grid relative overflow-hidden flex items-center justify-center selection:bg-brand-blue/20 selection:text-brand-blue">
        <div key={location.pathname} className="w-full h-full min-h-screen flex items-center justify-center animate-page-fade relative z-10">
          {children}
        </div>
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
          <div key={location.pathname} className="animate-page-fade w-full h-full">
            {children}
          </div>
        </main>
      </div>

      {!isAssistant && <FloatingAiAssistant />}
    </div>
  );
};
