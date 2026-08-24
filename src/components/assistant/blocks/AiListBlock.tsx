import React from 'react';
import { CheckSquare } from 'lucide-react';

export interface AiListBlockProps {
  title?: string;
  items: string[];
  listType?: 'numbered' | 'bullet';
}

export const AiListBlock: React.FC<AiListBlockProps> = ({
  title = 'Ən Yaxşı Tövsiyələr',
  items = [],
  listType = 'numbered'
}) => {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-5 shadow-xs my-3">
      {title && (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-outline-variant/30 text-emerald-600 dark:text-emerald-400">
          <CheckSquare className="w-5 h-5 shrink-0" />
          <h3 className="text-title-md font-bold text-on-surface">{title}</h3>
        </div>
      )}

      <ol className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-body-md text-on-surface">
            {listType === 'numbered' ? (
              <span className="font-bold text-on-surface-variant font-mono text-sm shrink-0 mt-0.5">
                {idx + 1}.
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0 mt-2" />
            )}
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
