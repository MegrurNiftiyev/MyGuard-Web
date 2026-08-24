import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export interface AiImageBlockProps {
  title?: string;
  description?: string;
  url?: string;
  alt?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export const AiImageBlock: React.FC<AiImageBlockProps> = ({
  title = 'Risk Trend İllüstrasiyası',
  description = 'Son rüb ərzində sistemdə həyata keçirilən təhlükəsizlik yeniləmələri və risk trendlərinin vizual təhlili.',
  url,
  alt = 'Security Trend Illustration',
  actionLabel = 'Trend xəritəsinə baxın',
  actionUrl = '#'
}) => {
  return (
    <div className="w-full bg-surface-container-lowest border border-outline-variant/60 rounded-3xl p-4 sm:p-5 shadow-xs my-3 flex flex-col md:flex-row items-center gap-6 text-left">
      {/* Left Side Image */}
      <div className="w-full md:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden border border-outline-variant/40 bg-zinc-950 relative group shrink-0">
        {url ? (
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* High-Tech Security Vector Banner Fallback */
          <div className="w-full h-full p-6 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center justify-between z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="z-10 text-left space-y-1 mt-auto">
              <h4 className="text-white font-bold text-base tracking-wide">MyGuard Infrastructure</h4>
              <p className="text-blue-200/70 text-xs font-mono">Zero-Trust Inspection Active</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Side Content & Action */}
      <div className="w-full md:w-1/2 flex flex-col justify-between py-1 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            {title}
          </h3>
          <p className="text-body-md text-on-surface-variant/80 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        <div>
          <a
            href={actionUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border border-brand-purple/30 bg-purple-50/60 dark:bg-purple-950/40 text-brand-purple hover:bg-purple-100/80 transition-all text-sm font-bold shadow-2xs group cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};
