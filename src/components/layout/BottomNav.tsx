import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Scan, ShieldAlert, Sparkles, SlidersHorizontal, ChevronRight, ChevronLeft, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useUserRole } from '../../context/UserRoleContext';

interface SideNavProps {
  disableFixed?: boolean;
}

export const BottomNav: React.FC<SideNavProps> = ({ disableFixed = false }) => {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const { isAdmin } = useUserRole();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // State to track if sidebar is expanded with labels
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_expanded') === 'true';
  });

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_expanded', String(next));
      return next;
    });
  };

  // Navigation Items including Scan Et
  const allNavItems: Array<{
    id: string;
    label: string;
    path: string;
    icon: React.ElementType;
    adminOnly?: boolean;
  }> = [
    { id: 'home', label: t('home'), path: '/', icon: Home },
    { id: 'documents', label: t('documents'), path: '/documents', icon: FileText },
    { id: 'scan', label: 'Skan et', path: '/scan', icon: Scan },
    { id: 'risks', label: t('risks'), path: '/risk-reports', icon: ShieldAlert, adminOnly: true },
    { id: 'assistant', label: t('assistant'), path: '/assistant', icon: Sparkles },
    { id: 'settings', label: t('settings'), path: '/settings', icon: SlidersHorizontal },
  ];

  // Filter items if user is not admin
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);
  
  // For mobile, exclude Assistant (AI) so we can put Settings in its place
  const mobileNavItems = navItems.filter((item) => item.id !== 'assistant');

  // Find active index for desktop
  const getActiveIndex = () => {
    return navItems.findIndex((item) => {
      if (item.path === '/') return location.pathname === '/';
      if (item.path === '/documents' && location.pathname.startsWith('/analysis')) return true;
      return location.pathname.startsWith(item.path);
    });
  };
  
  // Find active index for mobile
  const getMobileActiveIndex = () => {
    return mobileNavItems.findIndex((item) => {
      if (item.path === '/') return location.pathname === '/';
      if (item.path === '/documents' && location.pathname.startsWith('/analysis')) return true;
      return location.pathname.startsWith(item.path);
    });
  };
  
  const activeIndex = getActiveIndex();
  const mobileActiveIndex = getMobileActiveIndex();
  const isAssistantPage = location.pathname.startsWith('/assistant');

  const [indicatorStyle, setIndicatorStyle] = useState<{ top: number; left: number; width: number; height: number; opacity: number }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    const updateIndicator = () => {
      const currentItem = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (currentItem && navRef.current) {
        setIndicatorStyle({
          top: currentItem.offsetTop,
          left: currentItem.offsetLeft,
          width: currentItem.offsetWidth,
          height: currentItem.offsetHeight,
          opacity: 1,
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    const timeoutId = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname, activeIndex, navItems.length, lang, isExpanded]);

  const DesktopNav = (
    <nav
      ref={navRef}
      className={`hidden md:flex relative flex-col gap-2 p-2 bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/70 shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-52 items-start rounded-3xl p-3' : 'w-16 items-center rounded-full py-3'
      }`}
    >
      {/* Right Side Toggle Arrow Button */}
      <button
        type="button"
        onClick={toggleExpand}
        className="absolute -right-3.5 top-7 z-30 w-7 h-7 rounded-full bg-white border border-outline-variant/80 shadow-md flex items-center justify-center text-brand-blue hover:bg-surface-container-high hover:scale-110 active:scale-95 transition-all cursor-pointer"
        title={isExpanded ? 'Menyunu sıxlaşdır' : 'Menyunu genişləndir'}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeIndex === index;

        if (isExpanded) {
          return (
            <NavLink
              key={item.id}
              to={item.path}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`relative z-10 flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl transition-all duration-200 select-none overflow-hidden ${
                isActive
                  ? 'text-brand-blue font-bold bg-blue-50/70 border border-brand-blue/15'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-blue' : ''}`} />
              <span className="text-sm truncate font-sans">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-brand-blue rounded-l-full shadow-2xs" />
              )}
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.id}
            to={item.path}
            title={item.label}
            ref={(el) => { itemRefs.current[index] = el; }}
            className="relative z-10 p-0.5 flex items-center justify-center transition-all duration-200 select-none"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-brand-blue text-white shadow-xs scale-105'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/70'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
            </div>
          </NavLink>
        );
      })}
    </nav>
  );

  const MobileNav = (
    <nav className="flex md:hidden relative flex-row items-center justify-between gap-1 sm:gap-2 p-2 px-4 w-[92vw] sm:w-[85vw] bg-white/95 backdrop-blur-xl border border-outline-variant/70 shadow-2xl rounded-[2rem]">
      {mobileNavItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = mobileActiveIndex === index;
        const isScan = item.id === 'scan';

        if (isScan) {
          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={item.label}
              className="relative -top-5 z-20 flex items-center justify-center w-14 h-14 rounded-[22px] bg-brand-blue text-white shadow-[0_4px_12px_rgba(49,116,239,0.22)] transition-transform active:scale-95 mx-2"
            >
              <Icon className="w-7 h-7" />
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.id}
            to={item.path}
            title={item.label}
            className={`relative z-10 flex flex-col items-center justify-center p-3 sm:px-4 rounded-xl transition-colors duration-200 select-none ${
              isActive
                ? 'text-brand-blue font-bold'
                : 'text-on-surface-variant'
            }`}
          >
            <Icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
          </NavLink>
        );
      })}
    </nav>
  );

  if (disableFixed) {
    return (
      <>
        {MobileNav}
        {DesktopNav}
      </>
    );
  }

  return (
    <>
      <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto h-max ${isAssistantPage ? 'hidden' : ''}`}>
        {MobileNav}
      </div>
      <div className="hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-50 pointer-events-auto h-max">
        {DesktopNav}
      </div>
    </>
  );
};
