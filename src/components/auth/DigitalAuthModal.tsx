import React, { useState } from 'react';
import { Fingerprint, QrCode, X, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export interface DigitalAuthModalProps {
  provider: 'sima' | 'mygov';
  onClose: () => void;
  onSuccess: () => void;
}

export const DigitalAuthModal: React.FC<DigitalAuthModalProps> = ({
  provider,
  onClose,
  onSuccess
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleConfirm = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onSuccess();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {provider === 'sima' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-brand-purple">
              <Fingerprint className="w-7 h-7" />
              <h3 className="text-title-lg font-bold text-on-surface">SİMA İmza QR Giriş</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              SİMA mobil tətbiqi ilə aşağıdakı QR kodu skan edin və biometrik təsdiq verin.
            </p>

            <div className="w-44 h-44 mx-auto border-2 border-dashed border-brand-purple/40 rounded-2xl bg-secondary-container/30 flex items-center justify-center p-3">
              <QrCode className="w-36 h-36 text-brand-purple animate-pulse" />
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-brand-purple text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? 'QR Təsdiqlənir...' : 'QR Skanını Təsdiqlə (Simulyasiya)'}
            </Button>
          </div>
        )}

        {provider === 'mygov' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-brand-blue">
              <div className="w-8 h-8 rounded-xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                my
              </div>
              <h3 className="text-title-lg font-bold text-on-surface">myGov QR Giriş</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              myGov mobil tətbiqi ilə aşağıdakı QR kodu skan edərək identifikasiyadan keçin.
            </p>

            <div className="w-44 h-44 mx-auto border-2 border-dashed border-brand-blue/40 rounded-2xl bg-primary-container/30 flex items-center justify-center p-3">
              <QrCode className="w-36 h-36 text-brand-blue animate-pulse" />
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-brand-blue text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? 'myGov İdentifikasiyası...' : 'QR Skanını Təsdiqlə (Simulyasiya)'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
