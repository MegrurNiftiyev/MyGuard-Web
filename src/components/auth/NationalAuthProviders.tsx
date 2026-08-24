import React from 'react';
import { ArrowRight, Fingerprint, Smartphone } from 'lucide-react';

export interface NationalAuthProvidersProps {
  onSelectProvider: (provider: 'asan' | 'sima' | 'mygov') => void;
}

export const NationalAuthProviders: React.FC<NationalAuthProvidersProps> = ({ onSelectProvider }) => {
  return (
    <div className="space-y-2.5">
      {/* myGov Login Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('mygov')}
        className="w-full py-3 px-4 rounded-2xl border border-primary-container bg-primary-container/30 hover:bg-primary-container/60 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
            my
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">myGov Portal</p>
            <p className="text-[11px] text-on-surface-variant font-medium">Rəqəmsal Hökumət Girişi</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-brand-blue group-hover:translate-x-1 transition-transform" />
      </button>

      {/* SİMA İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('sima')}
        className="w-full py-3 px-4 rounded-2xl border border-secondary-container bg-secondary-container/30 hover:bg-secondary-container/60 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-sm">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">SİMA İmza</p>
            <p className="text-[11px] text-on-surface-variant font-medium">Biometrik Rəqəmsal İmza</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-brand-purple group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Asan İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('asan')}
        className="w-full py-3 px-4 rounded-2xl border border-success-container bg-success-container/30 hover:bg-success-container/60 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-success text-white flex items-center justify-center shadow-sm">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-on-surface">Asan İmza</p>
            <p className="text-[11px] text-on-surface-variant font-medium">Mobil Elektron İmza</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-success group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
