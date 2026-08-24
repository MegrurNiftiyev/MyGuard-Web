import React from 'react';
import { Fingerprint, QrCode, Users } from 'lucide-react';

export interface NationalAuthProvidersProps {
  onSelectProvider: (provider: 'sima' | 'mygov' | 'guest') => void;
}

export const NationalAuthProviders: React.FC<NationalAuthProvidersProps> = ({ onSelectProvider }) => {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {/* myGov Login Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('mygov')}
        className="py-3 px-2.5 sm:px-3 rounded-2xl border border-primary-container bg-primary-container/25 hover:bg-primary-container/60 hover:scale-[1.02] active:scale-95 transition-all flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 text-center sm:text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
          my
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">myGov</p>
          <p className="text-[10px] text-on-surface-variant font-medium flex items-center justify-center sm:justify-start gap-1">
            <QrCode className="w-3 h-3 text-brand-blue shrink-0" />
            <span>QR Giriş</span>
          </p>
        </div>
      </button>

      {/* SİMA İmza Button (Greenish/Teal Brand Color) */}
      <button
        type="button"
        onClick={() => onSelectProvider('sima')}
        className="py-3 px-2.5 sm:px-3 rounded-2xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100/70 hover:scale-[1.02] active:scale-95 transition-all flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 text-center sm:text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <Fingerprint className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-teal-950 dark:text-teal-200 truncate">SİMA</p>
          <p className="text-[10px] text-teal-700/80 dark:text-teal-400 font-medium flex items-center justify-center sm:justify-start gap-1">
            <QrCode className="w-3 h-3 text-teal-600 shrink-0" />
            <span>QR Giriş</span>
          </p>
        </div>
      </button>

      {/* Qonaq (Guest) Access Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('guest')}
        className="py-3 px-2.5 sm:px-3 rounded-2xl border border-outline-variant/80 bg-surface-container-low hover:bg-surface-container hover:scale-[1.02] active:scale-95 transition-all flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 text-center sm:text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-purple to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">Qonaq</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Sürətli Giriş</p>
        </div>
      </button>
    </div>
  );
};
