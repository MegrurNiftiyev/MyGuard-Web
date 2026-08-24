import React from 'react';
import { Quote } from 'lucide-react';

export interface AiQuoteBlockProps {
  title?: string;
  content: string;
  author?: string;
  date?: string;
}

export const AiQuoteBlock: React.FC<AiQuoteBlockProps> = ({
  title = 'Qeyd',
  content,
  author = 'Risk Analitika Hesabatı',
  date
}) => {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3 space-y-3">
      <div className="flex items-center gap-2 text-brand-purple">
        <Quote className="w-5 h-5 shrink-0" />
        <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
      </div>

      <p className="text-body-md italic text-on-surface leading-relaxed font-normal">
        "{content}"
      </p>

      {(author || date) && (
        <div className="text-body-sm text-on-surface-variant/70 font-medium">
          — {author}{date ? `, ${date}` : ''}
        </div>
      )}
    </div>
  );
};
