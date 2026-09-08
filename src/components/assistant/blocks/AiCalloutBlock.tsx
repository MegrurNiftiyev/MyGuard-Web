import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckSquare, XCircle, AlertTriangle, Info } from 'lucide-react';
import { SemanticTone } from '../../../types';

const toneHeaderColors: Record<string, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  danger: 'text-error',
  warning: 'text-amber-500',
  info: 'text-brand-blue',
  primary: 'text-brand-blue',
  purple: 'text-purple-600',
  indigo: 'text-indigo-600',
};

const toneIcons: Record<string, React.ElementType> = {
  success: CheckSquare,
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
};

interface CalloutProps {
  tone: SemanticTone | string;
  title?: string;
  content: string;
}

export const AiCalloutBlock: React.FC<CalloutProps> = ({ tone, title, content }) => {
  const headerColor = toneHeaderColors[tone] || toneHeaderColors.info;
  const IconComponent = toneIcons[tone] || CheckSquare;

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3">
      {title && (
        <div className={`flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/30 ${headerColor}`}>
          <IconComponent className="w-5 h-5 shrink-0" />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
      )}
      <div className="text-body-md text-on-surface leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&_strong]:font-bold font-sans">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
