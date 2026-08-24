import React from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isAiInsight?: boolean;
  accentBarColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  isAiInsight = false,
  accentBarColor,
  padding = 'md',
  className,
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  if (isAiInsight) {
    return (
      <div className={clsx('ai-gradient-card shadow-l1 relative transition-all duration-200', className)} {...props}>
        <div className={clsx('bg-white rounded-xl h-full w-full', paddingStyles[padding])}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-surface-container-lowest rounded-3xl shadow-l1 relative overflow-hidden transition-all duration-300',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {accentBarColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: accentBarColor }}
        />
      )}
      {children}
    </div>
  );
};
