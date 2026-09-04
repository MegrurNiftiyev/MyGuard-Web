import React from 'react';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FolderOpen,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = ''
}) => {
  return (
    <div className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-400 ${className}`}>
      {/* Icon Badge with Glow Ring */}
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-on-surface-variant shadow-sm transition-transform hover:scale-105">
          <Icon className="w-10 h-10 text-brand-blue" />
        </div>
        <div className="absolute inset-0 rounded-3xl bg-brand-blue/10 blur-xl pointer-events-none -z-10" />
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-title-lg font-bold text-on-surface tracking-tight">
          {title}
        </h3>
        <p className="text-body-md text-on-surface-variant/80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      {(primaryActionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="outline"
              size="md"
              onClick={onSecondaryAction}
              className="rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
            >
              {secondaryActionLabel}
            </Button>
          )}

          {primaryActionLabel && onPrimaryAction && (
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer group"
            >
              <span>{primaryActionLabel}</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
