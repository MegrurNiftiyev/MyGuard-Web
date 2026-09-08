import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, AlertTriangle, XCircle, Info, Sparkles, Shield } from 'lucide-react';
import { SemanticTone } from '../../../types';

interface ToneConfig {
  containerClass: string;
  titleClass: string;
  iconClass: string;
  Icon: React.ElementType;
}

const TONE_CONFIG: Record<string, ToneConfig> = {
  info: {
    containerClass: 'bg-blue-50 border-blue-200',
    titleClass: 'text-brand-blue',
    iconClass: 'text-brand-blue',
    Icon: Info,
  },
  warning: {
    containerClass: 'bg-amber-50 border-amber-200',
    titleClass: 'text-amber-700',
    iconClass: 'text-amber-500',
    Icon: AlertTriangle,
  },
  danger: {
    containerClass: 'bg-red-50 border-red-200',
    titleClass: 'text-red-700',
    iconClass: 'text-red-500',
    Icon: XCircle,
  },
  success: {
    containerClass: 'bg-emerald-50 border-emerald-200',
    titleClass: 'text-emerald-700',
    iconClass: 'text-emerald-500',
    Icon: CheckCircle2,
  },
  primary: {
    containerClass: 'bg-blue-50 border-blue-200',
    titleClass: 'text-brand-blue',
    iconClass: 'text-brand-blue',
    Icon: Sparkles,
  },
  purple: {
    containerClass: 'bg-purple-50 border-purple-200',
    titleClass: 'text-purple-700',
    iconClass: 'text-purple-500',
    Icon: Sparkles,
  },
  indigo: {
    containerClass: 'bg-indigo-50 border-indigo-200',
    titleClass: 'text-indigo-700',
    iconClass: 'text-indigo-500',
    Icon: Shield,
  },
};

interface CalloutProps {
  tone: SemanticTone | string;
  title?: string;
  content: string;
}

export const AiCalloutBlock: React.FC<CalloutProps> = ({ tone, title, content }) => {
  const config = TONE_CONFIG[tone] || TONE_CONFIG.info;
  const { containerClass, titleClass, iconClass, Icon } = config;

  return (
    <div className={`rounded-2xl border ${containerClass} p-4 my-2.5 shadow-2xs animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {/* Header row with icon + title */}
      {title && (
        <div className={`flex items-center gap-2 mb-2.5 ${titleClass}`}>
          <Icon className={`w-4.5 h-4.5 shrink-0 ${iconClass}`} />
          <p className="font-bold text-sm leading-snug">{title}</p>
        </div>
      )}

      {/* Body content */}
      <div className={`text-sm leading-relaxed opacity-90 text-on-surface
        [&>p]:mb-1.5 [&>p:last-child]:mb-0
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul>li]:marker:text-current
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol>li]:marker:font-bold [&>ol>li]:marker:text-current
        [&_strong]:font-bold
      `}>
        {!title && (
          <span className={`inline-flex items-center gap-1.5 mb-1.5 ${titleClass} font-semibold`}>
            <Icon className={`w-4 h-4 shrink-0 ${iconClass}`} />
          </span>
        )}
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
