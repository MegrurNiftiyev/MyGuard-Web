import React from 'react';

interface MyGuardLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export const MyGuardLogo: React.FC<MyGuardLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  textClassName = ''
}) => {
  const getDimension = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'xs': return 20;
      case 'sm': return 28;
      case 'md': return 36;
      case 'lg': return 48;
      case 'xl': return 64;
      default: return 36;
    }
  };

  const dimension = getDimension();

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Official MyGuard Shield Logo Icon */}
      <svg
        width={dimension}
        height={dimension * 1.1}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="myguard-shield-gradient" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#00A3FF" />
            <stop offset="45%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0044DD" />
          </linearGradient>
          <linearGradient id="myguard-inner-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Outer Shield Shell */}
        <path
          d="M 50 4 C 70 8, 88 14, 94 28 C 96 60, 78 88, 50 106 C 22 88, 4 60, 6 28 C 12 14, 30 8, 50 4 Z"
          fill="url(#myguard-shield-gradient)"
        />

        {/* Glossy Top Inner Highlight */}
        <path
          d="M 50 7 C 68 11, 84 16, 89 29 C 91 55, 78 78, 50 99 C 22 78, 9 55, 11 29 C 16 16, 32 11, 50 7 Z"
          fill="url(#myguard-inner-highlight)"
        />

        {/* Center MyGuard Emblem Typography (White 'MyGuard' Text Inside Shield) */}
        <g fill="#FFFFFF" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          <text
            x="50"
            y="64"
            fontSize="30"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="-0.5px"
          >
            MyGuard
          </text>
        </g>
      </svg>

      {showText && (
        <div className={`flex flex-col ${textClassName}`}>
          <span className="text-title-lg font-black tracking-tight text-on-surface leading-none font-sans" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            My<span className="text-brand-blue">Guard</span>
          </span>
          <span className="text-[10px] font-bold text-on-surface-variant/70 tracking-wider uppercase mt-0.5">
            AI Security
          </span>
        </div>
      )}
    </div>
  );
};
