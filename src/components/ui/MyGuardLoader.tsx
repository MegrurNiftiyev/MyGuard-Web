import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface MyGuardLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  showShield?: boolean;
}

export const MyGuardLoader: React.FC<MyGuardLoaderProps> = ({
  size = 'md',
  text,
  className = '',
  showShield = true,
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', orb: 'w-2.5 h-2.5', icon: 'w-4 h-4' },
    md: { container: 'w-16 h-16', orb: 'w-3.5 h-3.5', icon: 'w-6 h-6' },
    lg: { container: 'w-24 h-24', orb: 'w-4.5 h-4.5', icon: 'w-9 h-9' },
    xl: { container: 'w-32 h-32', orb: 'w-6 h-6', icon: 'w-12 h-12' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        {/* Subtle Outer Glowing Rings */}
        <div className="absolute inset-0 rounded-full border border-brand-blue/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-1 rounded-full border border-brand-purple/20 animate-[spin_5s_linear_infinite_reverse]" />
        
        {/* Orbiting Signature Glowing Orbs */}
        {/* Orb 1: Brand Blue */}
        <div className="absolute inset-0 animate-[spin_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]">
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-blue shadow-[0_0_14px_rgba(0,102,255,0.95)] ${currentSize.orb}`}
          />
        </div>

        {/* Orb 2: Brand Purple */}
        <div className="absolute inset-0 animate-[spin_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse]">
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-brand-purple shadow-[0_0_14px_rgba(147,51,234,0.95)] ${currentSize.orb}`}
          />
        </div>

        {/* Orb 3: Brand Green */}
        <div className="absolute inset-0 animate-[spin_2.1s_ease-in-out_infinite]">
          <div
            className={`absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-brand-green shadow-[0_0_14px_rgba(16,185,129,0.95)] ${currentSize.orb}`}
          />
        </div>

        {/* Center Glass Shield Icon */}
        {showShield && (
          <div className="w-1/2 h-1/2 rounded-2xl bg-white/90 border border-outline-variant/60 flex items-center justify-center shadow-md animate-pulse z-10">
            <ShieldCheck className={`${currentSize.icon} text-brand-blue`} />
          </div>
        )}
      </div>

      {text && (
        <p className="text-body-md font-bold text-on-surface-variant animate-pulse tracking-wide text-center">
          {text}
        </p>
      )}
    </div>
  );
};

export default MyGuardLoader;
