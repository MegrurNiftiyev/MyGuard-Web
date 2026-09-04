import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export interface AiMessageWrapperProps {
  timestamp: string;
  children: React.ReactNode;
}

export const AiMessageWrapper: React.FC<AiMessageWrapperProps> = ({ timestamp, children }) => {
  return (
    <div className="flex items-start gap-3.5 w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="relative flex items-center justify-center shrink-0 mt-1">
        <span className="absolute w-8 h-8 rounded-full bg-brand-blue/20 animate-breathe" />
        <div className="w-8 h-8 rounded-full bg-blue-50 border border-brand-blue/30 text-brand-blue flex items-center justify-center shadow-xs z-10">
          <Sparkles className="w-4 h-4 text-brand-blue animate-icon-breathe" />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-4">
        {children}
      </div>
    </div>
  );
};
