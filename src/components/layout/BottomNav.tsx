import React, { useRef, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Scan, ShieldAlert, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useUserRole } from '../../context/UserRoleContext';
import { translations } from '../../i18n/translations';

interface SideNavProps {
  disableFixed?: boolean;
}

export const BottomNav: React.FC<SideNavProps> = ({ disableFixed = false }) => {
  const location = useLocation();
  const { lang, t } = useLanguage();
  const { isAdmin } = useUserRole();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

  // Find active index
  const getActiveIndex = () => {
    return navItems.findIndex((item) => {
      if (item.path === '/') return location.pathname === '/';
      // Mapp /analysis to Documents tab
      if (item.path === '/documents' && location.pathname.startsWith('/analysis')) return true;
      return location.pathname.startsWith(item.path);
    });
  };
  const activeIndex = getActiveIndex();

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

    // Use a small timeout to allow DOM to update text width before measuring
    const timeoutId = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [location.pathname, activeIndex, navItems.length, lang]);

  const isAssistant = location.pathname.startsWith('/assistant');

  const navContent = (
      <nav
        ref={navRef}
        className={`relative flex flex-col items-center gap-2 p-2 bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/70 shadow-xs rounded-full overflow-hidden`}
      >
        {/* Animated Sliding Background Box Indicator (Always Solid Brand Blue) */}
        <div
          className="absolute rounded-full bg-brand-blue shadow-md ring-2 ring-brand-blue/30 transition-all duration-300 ease-out z-0"
          style={{
            top: `${indicatorStyle.top}px`,
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeIndex === index;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={item.label}
              ref={(el) => { itemRefs.current[index] = el; }}
              className={`relative z-10 flex items-center justify-center p-3 rounded-full transition-colors duration-200 select-none ${
                isActive
                  ? '!text-white'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              <Icon className={`w-6 h-6 shrink-0 ${isActive ? '!text-white' : ''}`} />
            </NavLink>
          );
        })}
      </nav>
  );

  if (disableFixed) {
    return navContent;
  }

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-auto h-max">
      {navContent}
    </div>
  );
};
