import React from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export interface AiMessageWrapperProps {
  timestamp: string;
  children: React.ReactNode;
}

export const AiMessageWrapper: React.FC<AiMessageWrapperProps> = ({ timestamp, children }) => {
  return (
    <div className="flex justify-start w-full animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full space-y-4">
        {children}
      </div>
    </div>
  );
};
