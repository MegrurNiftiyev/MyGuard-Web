import { ShieldAlert, User, Settings, ShieldCheck, Shield, ChevronDown, Check, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useUserRole } from '../../context/UserRoleContext';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const { role, setRole, isAdmin } = useUserRole();

  return (
    <header className="sticky top-4 z-40 w-full max-w-[1440px] mx-auto pr-6 sm:pr-8 pointer-events-auto">
      <div className="px-6 py-3 rounded-full bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/70 shadow-xs flex items-center justify-between gap-4 transition-all">
        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* White/neutral icon box background with blue shield icon inside */}
          <div className="w-9 h-9 rounded-full bg-white border border-outline-variant flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <ShieldAlert className="w-5 h-5 text-brand-blue" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-title-lg font-extrabold text-on-surface tracking-tight group-hover:text-brand-blue transition-colors">
              {t('brandName')}
            </span>
          </div>
        </div>

        {/* Right: User/Admin Role Switcher Hover Menu & Profile/Settings Icon Button */}
        <div className="flex items-center gap-3">
          {/* Language Switcher with Sliding Background Box */}
          <div className="relative flex items-center bg-surface-container-lowest border border-outline-variant/80 p-0.5 rounded-full shadow-xs">
            <div
              className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-brand-blue rounded-full shadow-xs transition-transform duration-300 ease-out ${
                lang === 'az' ? 'translate-x-0' : 'translate-x-[calc(100%+2px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setLang('az')}
              className={`relative z-10 px-3 py-1 text-[12px] font-bold rounded-full transition-colors cursor-pointer min-w-[36px] text-center ${
                lang === 'az' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              AZ
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`relative z-10 px-3 py-1 text-[12px] font-bold rounded-full transition-colors cursor-pointer min-w-[36px] text-center ${
                lang === 'en' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              EN
            </button>
          </div>

          {/* Login / Auth Button */}
          <button
            onClick={() => navigate('/login')}
            className="px-3.5 py-1.5 rounded-full bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue font-bold text-xs border border-brand-blue/30 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-105"
            title="Daxil ol / Qeydiyyat"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daxil ol</span>
          </button>

          {/* Clean Profile/Settings Icon Button */}
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple p-0.5 shadow-xs cursor-pointer hover:scale-105 transition-transform"
            title="Settings"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-on-surface">
              <User className="w-4 h-4 text-brand-blue" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
