import React from 'react';
import { Fingerprint, QrCode } from 'lucide-react';

export interface NationalAuthProvidersProps {
  onSelectProvider: (provider: 'sima' | 'mygov') => void;
}

export const NationalAuthProviders: React.FC<NationalAuthProvidersProps> = ({ onSelectProvider }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* myGov Login Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('mygov')}
        className="py-3 px-3.5 rounded-2xl border border-primary-container bg-primary-container/20 hover:bg-primary-container/50 transition-all flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-xs shadow-sm shrink-0">
          my
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">myGov</p>
          <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
            <QrCode className="w-3 h-3 text-brand-blue shrink-0" />
            <span>QR Giriş</span>
          </p>
        </div>
      </button>

      {/* SİMA İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('sima')}
        className="py-3 px-3.5 rounded-2xl border border-secondary-container bg-secondary-container/20 hover:bg-secondary-container/50 transition-all flex items-center gap-2.5 text-left cursor-pointer group shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-sm shrink-0">
          <Fingerprint className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-on-surface truncate">SİMA İmza</p>
          <p className="text-[10px] text-on-surface-variant font-medium flex items-center gap-1">
            <QrCode className="w-3 h-3 text-brand-purple shrink-0" />
            <span>QR Giriş</span>
          </p>
        </div>
      </button>
    </div>
  );
};
