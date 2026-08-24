import React from 'react';
import { ExternalLink, Paperclip } from 'lucide-react';

export interface AiLinkBlockProps {
  url: string;
  label: string;
  description?: string;
  prefixText?: string;
}

export const AiLinkBlock: React.FC<AiLinkBlockProps> = ({
  url = '#',
  label,
  description,
  prefixText = 'Daha ətraflı metodologiya və mənbə üçün sənədləşməyə baxın:'
}) => {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xs my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-md text-on-surface">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <Paperclip className="w-4 h-4 text-on-surface-variant/70 shrink-0" />
        <span>{prefixText}</span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline text-body-md cursor-pointer shrink-0"
      >
        <span>{label}</span>
        <ExternalLink className="w-4 h-4 ml-0.5" />
      </a>
    </div>
  );
};
