import React from 'react';

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
  showShield = false,
}) => {
  const sizeMap = {
    sm: { container: 'w-12 h-12', orb: 'w-3 h-3' },
    md: { container: 'w-20 h-20', orb: 'w-4 h-4' },
    lg: { container: 'w-28 h-28', orb: 'w-5 h-5' },
    xl: { container: 'w-36 h-36', orb: 'w-6.5 h-6.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`relative flex items-center justify-center ${currentSize.container}`}>
        {/* Outer Glowing Ring Tracks */}
        <div className="absolute inset-0 rounded-full border border-brand-blue/20 animate-[spin_4s_linear_infinite]" />
        <div className="absolute inset-1.5 rounded-full border border-brand-purple/20 animate-[spin_5s_linear_infinite_reverse]" />
        
        {/* 3 Orbiting Signature Glowing Orbs */}
        {/* Orb 1: Brand Blue (#0066FF) */}
        <div className="absolute inset-0 animate-[spin_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]">
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-[#0066FF] shadow-[0_0_16px_#0066FF] ${currentSize.orb}`}
          />
        </div>

        {/* Orb 2: Brand Purple (#9333EA) */}
        <div className="absolute inset-0 animate-[spin_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite_reverse]">
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-[#9333EA] shadow-[0_0_16px_#9333EA] ${currentSize.orb}`}
          />
        </div>

        {/* Orb 3: Brand Emerald Green (#10B981) - Fully Visible & Vibrant */}
        <div className="absolute inset-0 animate-[spin_2.1s_ease-in-out_infinite]">
          <div
            className={`absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-[#10B981] shadow-[0_0_16px_#10B981] ${currentSize.orb}`}
          />
        </div>
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
