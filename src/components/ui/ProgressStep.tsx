import React from 'react';
import clsx from 'clsx';
import { CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { StepStatus } from '../../types';

export interface ProgressStepProps {
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
  isLast?: boolean;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({
  stepNumber,
  title,
  description,
  status,
  isLast = false,
}) => {
  const renderIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-brand-blue animate-spin" />;
    }
  };

  const getContainerStyles = () => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'failed':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'processing':
        return 'bg-blue-50 border-brand-blue/30 text-blue-900 ring-2 ring-brand-blue/20';
    }
  };

  return (
    <div className="relative flex items-start gap-4 pb-6 group">
      {!isLast && (
        <div
          className={clsx(
            'absolute left-4 top-8 -bottom-2 w-0.5 transition-colors',
            status === 'completed' ? 'bg-emerald-300' : 'bg-outline-variant'
          )}
        />
      )}

      <div
        className={clsx(
          'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border shrink-0 transition-all duration-300',
          getContainerStyles()
        )}
      >
        {renderIcon()}
      </div>

      <div className="flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-title-lg text-on-surface font-semibold flex items-center gap-2">
            <span className="text-label-sm font-bold text-on-surface-variant/70">0{stepNumber}.</span>
            {title}
          </h4>
          <span
            className={clsx(
              'text-label-sm font-semibold capitalize px-2 py-0.5 rounded-full',
              status === 'completed' && 'bg-emerald-100 text-emerald-800',
              status === 'warning' && 'bg-amber-100 text-amber-800',
              status === 'failed' && 'bg-red-100 text-red-800',
              status === 'processing' && 'bg-blue-100 text-blue-800'
            )}
          >
            {status === 'completed' && 'Tamamlandı'}
            {status === 'warning' && 'Xəbərdarlıq'}
            {status === 'failed' && 'Xəta'}
            {status === 'processing' && 'İcraya alındı...'}
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
