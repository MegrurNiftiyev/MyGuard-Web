import React from 'react';
import clsx from 'clsx';
import { ShieldCheck, ShieldAlert, AlertTriangle, Ban, Info, CheckCircle, Clock, XCircle } from 'lucide-react';
import { RiskStatus } from '../../types';

export interface ChipProps {
  status?: RiskStatus | 'processing' | 'completed' | 'warning' | 'failed' | string;
  label?: string;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({ status, label, className }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return { 
          icon: ShieldCheck, 
          style: 'text-emerald-600',
          defaultLabel: 'Təhlükəsiz'
        };
      case 'completed':
        return { 
          icon: CheckCircle, 
          style: 'text-emerald-600',
          defaultLabel: 'Tamamlandı'
        };
      case 'suspicious':
      case 'warning':
        return { 
          icon: AlertTriangle, 
          style: 'text-amber-500',
          defaultLabel: status === 'warning' ? 'Xəbərdarlıq' : 'Şübhəli'
        };
      case 'high_risk':
        return { 
          icon: ShieldAlert, 
          style: 'text-red-500',
          defaultLabel: 'Yüksək Risk'
        };
      case 'failed':
        return { 
          icon: XCircle, 
          style: 'text-red-500',
          defaultLabel: 'Uğursuz'
        };
      case 'blocked':
        return { 
          icon: Ban, 
          style: 'text-red-600',
          defaultLabel: 'Bloklandı'
        };
      case 'processing':
        return { 
          icon: Clock, 
          style: 'text-blue-500',
          defaultLabel: 'Emal olunur'
        };
      default:
        return { 
          icon: Info, 
          style: 'text-on-surface-variant',
          defaultLabel: status || 'Bilinmir'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  return (
    <div
      className={clsx(
        'group flex items-center transition-all duration-300 ease-out cursor-default shrink-0',
        className
      )}
    >
      <div className={clsx("flex items-center justify-center shrink-0 transition-transform duration-300 ease-out group-hover:scale-90", config.style)}>
        <Icon className="w-6 h-6 shrink-0" />
      </div>
      <span className={clsx(
        "max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-out group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 text-label-sm font-bold tracking-wide",
        config.style
      )}>
        {displayLabel}
      </span>
    </div>
  );
};

