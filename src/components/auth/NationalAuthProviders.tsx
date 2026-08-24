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
        className="w-full py-3 px-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
            my
          </div>
          <div>
            <p className="text-xs font-bold text-blue-950 dark:text-blue-200">myGov Portal</p>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-400">Rəqəmsal Hökumət Girişi</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* SİMA İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('sima')}
        className="w-full py-3 px-4 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-sm">
            <Fingerprint className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-purple-950 dark:text-purple-200">SİMA İmza</p>
            <p className="text-[11px] text-purple-700/80 dark:text-purple-400">Biometrik Rəqəmsal İmza</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-brand-purple group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Asan İmza Button */}
      <button
        type="button"
        onClick={() => onSelectProvider('asan')}
        className="w-full py-3 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Asan İmza</p>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Mobil Elektron İmza</p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
