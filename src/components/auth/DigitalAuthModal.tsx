import React, { useState } from 'react';
import { Smartphone, Fingerprint, QrCode, X } from 'lucide-react';
import { Button } from '../ui/Button';

export interface DigitalAuthModalProps {
  provider: 'asan' | 'sima' | 'mygov';
  onClose: () => void;
  onSuccess: () => void;
}

export const DigitalAuthModal: React.FC<DigitalAuthModalProps> = ({
  provider,
  onClose,
  onSuccess
}) => {
  const [asanPhone, setAsanPhone] = useState('');
  const [asanUserId, setAsanUserId] = useState('');
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

        {provider === 'asan' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
              <Smartphone className="w-6 h-6" />
              <h3 className="text-title-lg font-bold">Asan İmza ilə Giriş</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              Mobil nömrənizi və Asan İmza İdentifikasiya kodunuzu daxil edin.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Mobil Nömrə</label>
                <input
                  type="text"
                  value={asanPhone}
                  onChange={(e) => setAsanPhone(e.target.value)}
                  placeholder="+994 50 123 45 67"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/80 bg-surface-container text-xs text-on-surface font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">İstifadəçi İD</label>
                <input
                  type="text"
                  value={asanUserId}
                  onChange={(e) => setAsanUserId(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/80 bg-surface-container text-xs text-on-surface font-mono"
                />
              </div>
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-emerald-600 hover:!bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? 'Sorğu göndərilir...' : 'Təsdiqlə və Daxil Ol'}
            </Button>
          </div>
        )}

        {provider === 'sima' && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 text-brand-purple">
              <Fingerprint className="w-7 h-7" />
              <h3 className="text-title-lg font-bold">SİMA İmza QR Giriş</h3>
            </div>
            <p className="text-xs text-on-surface-variant">
              SİMA mobil tətbiqi ilə aşağıdakı QR kodu skan edin və biometrik təsdiq verin.
            </p>

            <div className="w-44 h-44 mx-auto border-2 border-dashed border-brand-purple/40 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 flex items-center justify-center p-3">
              <QrCode className="w-36 h-36 text-brand-purple animate-pulse" />
            </div>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-brand-purple hover:!bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? 'QR Təsdiqlənir...' : 'QR Skanını Təsdiqlə (Simulyasiya)'}
            </Button>
          </div>
        )}

        {provider === 'mygov' && (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-lg shadow-md">
              my
            </div>
            <h3 className="text-title-lg font-bold text-on-surface">myGov Vahid Giriş Systemi</h3>
            <p className="text-xs text-on-surface-variant">
              Vahid Rəqəmsal Hökumət Portalı vasitəsilə profiliniz təsdiqlənir.
            </p>

            <Button
              onClick={handleConfirm}
              disabled={isSimulating}
              className="w-full py-3 !bg-blue-600 hover:!bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isSimulating ? 'myGov İdentifikasiyası...' : 'myGov Portalı İlə Daxil Ol'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
