import React, { useState } from 'react';
import { Fingerprint, QrCode, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t } = useLanguage();
  const [isSimulating, setIsSimulating] = useState(false);

  const handleConfirm = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      onSuccess();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-high cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {provider === 'sima' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-teal-600">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-title-lg font-bold text-on-surface">{t('simaQrLoginTitle')}</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              SİMA mobil tətbiqi ilə aşağıdakı QR kodu skan edin və biometrik təsdiq verin.
            </p>

            <div className="w-44 h-44 mx-auto border-2 border-dashed border-teal-400/50 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 flex items-center justify-center p-3">
              <QrCode className="w-36 h-36 text-teal-600 animate-pulse" />
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-teal-600 hover:!bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? (t('verifying')) : (t('confirmCodeBtn'))}
            </Button>
          </div>
        )}

        {provider === 'mygov' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-brand-blue">
              <div className="w-9 h-9 rounded-xl bg-brand-blue text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
                my
              </div>
              <h3 className="text-title-lg font-bold text-on-surface">{t('myGovQrLoginTitle')}</h3>
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
              {isSimulating ? (t('verifying')) : (t('confirmCodeBtn'))}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
