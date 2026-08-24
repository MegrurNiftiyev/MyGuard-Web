import React from 'react';

export interface AiHeaderBlockProps {
  title: string;
  subtitle?: string;
}

export const AiHeaderBlock: React.FC<AiHeaderBlockProps> = ({ title, subtitle }) => {
  return (
    <div className="space-y-1.5 mb-2 text-left">
      <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">{title}</h2>
      {subtitle && (
        <p className="text-body-md text-on-surface-variant/80 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
