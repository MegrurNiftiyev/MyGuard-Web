import React from 'react';
import { THEME_COLORS, hexToRgba } from '../../constants/themeColors';

interface ShootingCometConfig {
  id: string;
  size: number; // Diameter of ball in px
  tailLength: number; // Length of the diagonal fading shadow beam in px
  color: 'blue' | 'purple' | 'green';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationClass: string;
  opacity?: number;
}

const COMET_CONFIGS: ShootingCometConfig[] = [
  {
    id: 'comet-1',
    size: 130,
    tailLength: 550,
    color: 'purple',
    top: '-80px',
    left: '2%',
    animationClass: 'animate-comet-glide-1',
    opacity: 0.85
  },
  {
    id: 'comet-2',
    size: 140,
    tailLength: 600,
    color: 'blue',
    top: '-90px',
    right: '3%',
    animationClass: 'animate-comet-glide-2',
    opacity: 0.85
  },
  {
    id: 'comet-3',
    size: 90,
    tailLength: 420,
    color: 'green',
    top: '4%',
    left: '35%',
    animationClass: 'animate-comet-glide-3',
    opacity: 0.8
  },
  {
    id: 'comet-4',
    size: 110,
    tailLength: 480,
    color: 'purple',
    top: '38%',
    right: '-30px',
    animationClass: 'animate-comet-glide-1',
    opacity: 0.82
  },
  {
    id: 'comet-5',
    size: 135,
    tailLength: 580,
    color: 'green',
    bottom: '-60px',
    right: '6%',
    animationClass: 'animate-comet-glide-2',
    opacity: 0.85
  },
  {
    id: 'comet-6',
    size: 100,
    tailLength: 460,
    color: 'blue',
    top: '46%',
    left: '1%',
    animationClass: 'animate-comet-glide-3',
    opacity: 0.82
  },
  {
    id: 'comet-7',
    size: 85,
    tailLength: 390,
    color: 'purple',
    bottom: '5%',
    left: '10%',
    animationClass: 'animate-comet-glide-1',
    opacity: 0.78
  },
  {
    id: 'comet-8',
    size: 95,
    tailLength: 410,
    color: 'blue',
    bottom: '-30px',
    left: '40%',
    animationClass: 'animate-comet-glide-2',
    opacity: 0.8
  }
];

export const AuthFloatingOrbsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {COMET_CONFIGS.map((comet) => {
        let sphereGradient = '';
        let tailGradient = '';
        let glowColor = '';

        if (comet.color === 'purple') {
          sphereGradient = 'linear-gradient(135deg, #E9D5FF 0%, #9333EA 45%, #581C87 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandPurple, 0.45)} 0%, ${hexToRgba(THEME_COLORS.brandPurple, 0.12)} 60%, transparent 100%)`;
          glowColor = 'rgba(147, 51, 234, 0.45)';
        } else if (comet.color === 'blue') {
          sphereGradient = 'linear-gradient(135deg, #DBEAFE 0%, #0066FF 45%, #1E40AF 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandBlue, 0.45)} 0%, ${hexToRgba(THEME_COLORS.brandBlue, 0.12)} 60%, transparent 100%)`;
          glowColor = 'rgba(0, 102, 255, 0.45)';
        } else {
          // Green / Emerald
          sphereGradient = 'linear-gradient(135deg, #D1FAE5 0%, #10B981 45%, #064E3B 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandGreen, 0.45)} 0%, ${hexToRgba(THEME_COLORS.brandGreen, 0.12)} 60%, transparent 100%)`;
          glowColor = 'rgba(16, 185, 129, 0.45)';
        }

        return (
          <div
            key={comet.id}
            className={`absolute ${comet.animationClass} will-change-transform`}
            style={{
              top: comet.top,
              bottom: comet.bottom,
              left: comet.left,
              right: comet.right,
              width: `${comet.size}px`,
              height: `${comet.size + comet.tailLength}px`,
              opacity: comet.opacity ?? 0.85,
              transformOrigin: 'center center'
            }}
          >
            {/* Long Fading Diagonal Shadow / Light Beam Tail in Matching Color */}
            <div
              className="w-full rounded-t-full absolute top-0 left-0"
              style={{
                height: `${comet.tailLength + comet.size / 2}px`,
                background: tailGradient,
                boxShadow: `0 0 35px ${glowColor}`,
                filter: 'blur(2px)'
              }}
            />

            {/* Leading 3D Comet Sphere Ball */}
            <div
              className="rounded-full absolute bottom-0 left-0 w-full"
              style={{
                height: `${comet.size}px`,
                background: sphereGradient,
                boxShadow: `0 10px 40px ${glowColor}, inset 0 2px 8px rgba(255, 255, 255, 0.85)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
