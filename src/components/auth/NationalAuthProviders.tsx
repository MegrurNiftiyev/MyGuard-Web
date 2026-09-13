import React from 'react';
import { Fingerprint, QrCode } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface NationalAuthProvidersProps {
  onSelectProvider: (provider: 'sima' | 'mygov') => void;
}

export const NationalAuthProviders: React.FC<NationalAuthProvidersProps> = ({ onSelectProvider }) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* myGov Login Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('mygov')}
        className="py-3 px-3 rounded-2xl border border-outline-variant/80 bg-surface-container-low hover:bg-blue-50/70 hover:border-brand-blue/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-center sm:text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-9 h-9 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
          my
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate group-hover:text-brand-blue transition-colors">
            myGov
          </p>
          <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
            <QrCode className="w-3 h-3 text-brand-blue shrink-0" />
            <span>{t('qrLogin')}</span>
          </p>
        </div>
      </button>

      {/* SİMA İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('sima')}
        className="py-3 px-3 rounded-2xl border border-outline-variant/80 bg-surface-container-low hover:bg-teal-50/70 hover:border-teal-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-center sm:text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <Fingerprint className="w-4.5 h-4.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate group-hover:text-teal-700 transition-colors">
            SİMA
          </p>
          <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
            <QrCode className="w-3 h-3 text-teal-600 shrink-0" />
            <span>{t('qrLogin')}</span>
          </p>
        </div>
      </button>
    </div>
  );
};
