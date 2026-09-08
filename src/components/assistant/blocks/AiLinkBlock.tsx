import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight, Compass, Shield, FileText, Scan, SlidersHorizontal, Sparkles } from 'lucide-react';

export interface AiLinkBlockProps {
  url: string;
  label: string;
  description?: string;
  prefixText?: string;
  onNavigate?: () => void;
}

export const resolveScreenRoute = (
  urlOrEnum?: string
): { path: string; defaultLabel: string; icon: React.ElementType } | null => {
  if (!urlOrEnum) return null;
  const raw = urlOrEnum.trim().toUpperCase();

  if (raw === 'HOME_SCREEN' || raw === 'HOME' || urlOrEnum === '/') {
    return { path: '/', defaultLabel: 'Əsas Səhifəyə Keç', icon: Shield };
  }
  if (raw === 'DOCUMENTS_SCREEN' || raw === 'DOCUMENTS' || urlOrEnum.startsWith('/documents')) {
    return { path: '/documents', defaultLabel: 'Sənədlər Səhifəsinə Keç', icon: FileText };
  }
  if (raw === 'SCAN_SCREEN' || raw === 'SCAN' || urlOrEnum.startsWith('/scan')) {
    return { path: '/scan', defaultLabel: 'Skan Et Səhifəsinə Keç', icon: Scan };
  }
  if (raw === 'SETTINGS_SCREEN' || raw === 'SETTINGS' || urlOrEnum.startsWith('/settings')) {
    return { path: '/settings', defaultLabel: 'Parametrlər Səhifəsinə Keç', icon: SlidersHorizontal };
  }
  if (raw === 'AI_SCREEN' || raw === 'ASSISTANT' || urlOrEnum.startsWith('/assistant')) {
    return { path: '/assistant', defaultLabel: 'AI Assistant Səhifəsinə Keç', icon: Sparkles };
  }

  if (urlOrEnum.startsWith('/') && !urlOrEnum.includes('risk')) {
    return { path: urlOrEnum, defaultLabel: 'Səhifəyə Keç', icon: Compass };
  }

  return null;
};

export const AiLinkBlock: React.FC<AiLinkBlockProps> = ({
  url = '#',
  label,
  description,
  onNavigate
}) => {
  const navigate = useNavigate();
  const screenRoute = resolveScreenRoute(url);

  const handleClick = (e: React.MouseEvent) => {
    if (screenRoute) {
      e.preventDefault();
      navigate(screenRoute.path);
      // Close floating quick chat popup when navigating
      window.dispatchEvent(new CustomEvent('close-floating-chat'));
      if (onNavigate) onNavigate();
    }
  };

  if (screenRoute) {
    const Icon = screenRoute.icon;
    const buttonText = label || screenRoute.defaultLabel;

    return (
      <div className="w-full mt-2.5 mb-0.5 animate-in fade-in zoom-in-95 duration-300">
        <button
          type="button"
          onClick={handleClick}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-between shadow-md hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-white shrink-0" />
            </div>
            <span className="truncate">{buttonText}</span>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-3 shadow-xs mt-2.5 mb-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-body-md text-on-surface animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-on-surface-variant text-xs">
        <Compass className="w-4 h-4 text-on-surface-variant/70 shrink-0" />
        <span>{description || 'Daha ətraflı keçid üçün:'}</span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline text-xs cursor-pointer shrink-0"
      >
        <span>{label}</span>
        <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
      </a>
    </div>
  );
};
