import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, Home, Save, X, Globe, LogOut, User as UserIcon, Mail, Fingerprint, Building2, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isSettingsDirty, setIsSettingsDirty] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDirtyChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDirty: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isDirty === 'boolean') {
        setIsSettingsDirty(customEvent.detail.isDirty);
      }
    };
    window.addEventListener('settings-dirty-changed', handleDirtyChange);
    return () => window.removeEventListener('settings-dirty-changed', handleDirtyChange);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset dirty indicator if navigating away from settings
  useEffect(() => {
    if (location.pathname !== '/settings') {
      setIsSettingsDirty(false);
    }
  }, [location.pathname]);

  const getInitials = (name?: string) => {
    if (!name) return 'SƏ';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
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
          {/* Settings Actions: Cancel (X) & Save Icon Buttons (Only visible on /settings route when modified) */}
          {location.pathname === '/settings' && isSettingsDirty && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('trigger-settings-reset'))}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-red-50 text-on-surface-variant hover:text-red-600 border border-outline-variant/70 flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
                title="Dəyişiklikləri ləğv et"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('trigger-settings-save'))}
                className="w-8 h-8 rounded-full bg-brand-blue hover:bg-brand-blue/90 text-white flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('saveBtn') || 'Yadda Saxla'}
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
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

          {/* User Profile Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/70 pl-1.5 pr-2.5 py-1 rounded-full shadow-2xs transition-all cursor-pointer group"
              title={user?.fullName || 'İstifadəçi Profili'}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-brand-blue">
                  {getInitials(user?.fullName)}
                </div>
              </div>
              <span className="text-xs font-semibold text-on-surface truncate max-w-[110px] hidden sm:inline-block">
                {user?.fullName?.split(' ')[0] || 'Samir'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-outline-variant/80 rounded-2xl shadow-xl p-3 z-[100] animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* User Info Header */}
                <div className="p-3 bg-surface-container-low/70 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue font-bold flex items-center justify-center text-xs shrink-0 border border-brand-blue/20">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-on-surface truncate">
                        {user?.fullName || 'Samir Əliyev'}
                      </p>
                      <p className="text-[11px] text-on-surface-variant/80 truncate flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-on-surface-variant shrink-0" />
                        <span>{user?.email || 'e.mammadov@soc.gov.az'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-outline-variant/40 text-[11px] text-on-surface-variant space-y-1 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant/70 flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-brand-blue" /> FİN:
                      </span>
                      <span className="font-bold text-on-surface">{user?.finCode || '7AB1234'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant/70 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-brand-purple" /> Dep:
                      </span>
                      <span className="font-semibold text-on-surface truncate max-w-[140px]" title={user?.department || 'İT və Kibertəhlükəsizlik'}>
                        {user?.department || 'İT və Kibertəhlükəsizlik'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Language Switcher Row */}
                <div className="flex items-center justify-between px-2 py-1.5 bg-surface-container-lowest border border-outline-variant/60 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
                    <Globe className="w-4 h-4 text-brand-blue" />
                    <span>{t('interfaceLanguage') || 'Dil'}:</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/60">
                    <button
                      type="button"
                      onClick={() => setLang('az')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                        lang === 'az'
                          ? 'bg-brand-blue text-white shadow-2xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      AZ
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                        lang === 'en'
                          ? 'bg-brand-blue text-white shadow-2xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50/80 hover:bg-red-100 border border-red-200/60 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıxış Et</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

