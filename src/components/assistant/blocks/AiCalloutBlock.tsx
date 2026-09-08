import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { SemanticTone } from '../../../types';

const toneStyles: Record<string, string> = {
  info: 'bg-primary-container/10 border-primary/20 text-primary',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  danger: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  primary: 'bg-blue-50 border-blue-200 text-brand-blue',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
};

const toneIcons: Record<string, React.ElementType> = {
  success: CheckCircle2,
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
  const style = toneStyles[tone] || toneStyles.info;
  const IconComponent = toneIcons[tone] || CheckCircle2;

  return (
    <div className={`rounded-2xl border p-4.5 my-2.5 shadow-2xs ${style}`}>
      {title && (
        <p className="font-label-md text-label-md font-bold mb-2 flex items-center gap-2">
          <IconComponent className="w-5 h-5 shrink-0" />
          <span>{title}</span>
        </p>
      )}
      <div className="text-body-sm leading-relaxed opacity-95 [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:font-bold">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
