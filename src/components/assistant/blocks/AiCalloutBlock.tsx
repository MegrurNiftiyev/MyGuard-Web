import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SemanticTone } from '../../../types';

const toneStyles: Record<string, string> = {
  info: 'bg-primary-container/10 border-primary/20 text-primary',
  warning: 'bg-secondary-container/10 border-secondary/20 text-secondary',
  danger: 'bg-error-container/10 border-error/20 text-error',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  primary: 'bg-blue-50 border-blue-200 text-brand-blue',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
};

interface CalloutProps {
  tone: SemanticTone | string;
  title?: string;
  content: string;
}

export const AiCalloutBlock: React.FC<CalloutProps> = ({ tone, title, content }) => {
  const style = toneStyles[tone] || toneStyles.info;
  return (
    <div className={`rounded-2xl border p-4.5 my-2.5 shadow-2xs ${style}`}>
      {title && <p className="font-label-md text-label-md font-bold mb-2 flex items-center gap-2">{title}</p>}
      <div className="text-body-sm leading-relaxed opacity-95 [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-5 [&_strong]:font-bold">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
