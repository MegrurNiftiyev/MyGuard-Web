import React, { useState, useEffect } from 'react';
import { ShieldAlert, Shield, User, Sparkles, Home, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { user } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'SƏ';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <header className="sticky top-4 z-50 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:pl-24 pointer-events-auto">
      <div className="px-6 py-3 rounded-full bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/70 shadow-xs flex items-center justify-between gap-4 transition-all">
        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 cursor-pointer group"
        >
          <span className="text-title-lg font-extrabold text-on-surface tracking-tight group-hover:text-brand-blue transition-colors">
            {t('brandName')}
          </span>
          <div className="text-brand-blue flex items-center justify-center transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5" fill="currentColor" stroke="none" />
          </div>
        </div>

        {/* Right: Controls & Profile Settings */}
        <div className="flex items-center gap-3">
          {/* PWA Install App Button */}
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md hover:opacity-95 transition-all cursor-pointer animate-pulse"
              title="Tətbiqi Telefona / Kompüterə Yüklə"
            >
              <Smartphone className="w-4 h-4" />
              <span>Tətbiqi Yüklə</span>
            </button>
          )}

          {/* AI Assistant / Home Button (Mobile Only) */}
          {location.pathname.startsWith('/assistant') ? (
            <button
              onClick={() => navigate('/')}
              className="md:hidden w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-brand-blue transition-colors cursor-pointer border border-brand-blue/20 relative overflow-hidden"
              title="Home"
            >
              <Home className="w-5 h-5 relative z-10" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/assistant')}
              className="md:hidden w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-brand-blue transition-colors cursor-pointer border border-brand-blue/20 relative overflow-hidden"
              title="MyGuard AI"
            >
              <Sparkles className="w-5 h-5 relative z-10" />
            </button>
          )}

          {/* Settings / Profile Button */}
          <button
            onClick={() => navigate('/settings')}
            className="hidden md:flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/70 pl-1.5 pr-3 py-1 rounded-full shadow-2xs transition-all cursor-pointer group"
            title={`${user?.fullName || 'İstifadəçi Profili'} (${user?.role || 'user'})`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-brand-blue">
                {getInitials(user?.fullName)}
              </div>
            </div>
            <span className="text-xs font-semibold text-on-surface truncate max-w-[100px] hidden sm:inline-block">
              {user?.fullName?.split(' ')[0] || 'Samir'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
