import React from 'react';
import { AlertTriangle, Eye, Clock } from 'lucide-react';

interface HumanReviewBoxProps {
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryIcon?: React.ReactNode;
  title?: string;
  description?: string;
  customLabel?: string | null;
}

export const HumanReviewBox: React.FC<HumanReviewBoxProps> = ({
  onPrimaryClick,
  onSecondaryClick,
  primaryLabel = 'İndi yoxla',
  secondaryLabel = 'Sonra bax',
  primaryIcon = <Eye className="w-4 h-4" />,
  title = 'İnsan Təsdiqi Tələb Olunur',
  description = 'Yüksək riskli elementlər aşkar edilməyib, lakin sənədin məzmununu nəzərdən keçirməyiniz tövsiyə olunur.',
  customLabel = 'İSTƏYƏ BAĞLI'
}) => {
  return (
    <div className="bg-amber-50/70 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-100/50 my-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-amber-100/80 text-amber-500 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-base font-bold text-gray-900">
              {title}
            </h3>
            {customLabel && (
              <span className="bg-amber-100/80 text-amber-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {customLabel}
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 font-medium">
            {description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center md:justify-end gap-3 shrink-0 w-full md:w-auto mt-2 md:mt-0">
        {onSecondaryClick && (
          <button 
            onClick={onSecondaryClick} 
            className="px-4 py-2 rounded-xl text-gray-600 font-semibold text-sm bg-white border border-gray-200 shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Clock className="w-4 h-4 text-gray-400" /> {secondaryLabel}
          </button>
        )}
        <button 
          onClick={onPrimaryClick} 
          className="px-5 py-2 rounded-xl text-white font-semibold text-sm bg-amber-500 shadow-sm flex items-center gap-2 hover:bg-amber-600 transition-colors cursor-pointer"
        >
          {primaryIcon} {primaryLabel}
        </button>
      </div>
    </div>
  );
};
