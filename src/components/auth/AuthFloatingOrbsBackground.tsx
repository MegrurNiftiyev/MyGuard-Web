import React from 'react';
import { THEME_COLORS, hexToRgba } from '../../constants/themeColors';

interface ShootingOrbConfig {
  id: string;
  size: number; // Diameter of ball in px
  tailLength: number; // Length of the cylinder tail in px
  color: 'blue' | 'purple' | 'green';
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationClass: string;
  opacity?: number;
}

const ORB_CONFIGS: ShootingOrbConfig[] = [
  // 1. Large Purple - Top Left
  {
    id: 'orb-1',
    size: 110,
    tailLength: 320,
    color: 'purple',
    top: '-40px',
    left: '2%',
    animationClass: 'animate-beam-glide-1',
    opacity: 0.85
  },
  // 2. Large Blue - Top Right
  {
    id: 'orb-2',
    size: 130,
    tailLength: 360,
    color: 'blue',
    top: '-60px',
    right: '4%',
    animationClass: 'animate-beam-glide-2',
    opacity: 0.85
  },
  // 3. Medium Green - Top Center
  {
    id: 'orb-3',
    size: 70,
    tailLength: 220,
    color: 'green',
    top: '5%',
    left: '38%',
    animationClass: 'animate-beam-glide-3',
    opacity: 0.75
  },
  // 4. Medium Purple - Center Right
  {
    id: 'orb-4',
    size: 85,
    tailLength: 260,
    color: 'purple',
    top: '42%',
    right: '-20px',
    animationClass: 'animate-beam-glide-1',
    opacity: 0.8
  },
  // 5. Large Green - Bottom Right
  {
    id: 'orb-5',
    size: 120,
    tailLength: 340,
    color: 'green',
    bottom: '-50px',
    right: '8%',
    animationClass: 'animate-beam-glide-2',
    opacity: 0.85
  },
  // 6. Medium Blue - Center Left
  {
    id: 'orb-6',
    size: 80,
    tailLength: 240,
    color: 'blue',
    top: '48%',
    left: '3%',
    animationClass: 'animate-beam-glide-3',
    opacity: 0.8
  },
  // 7. Small Purple - Bottom Left
  {
    id: 'orb-7',
    size: 60,
    tailLength: 190,
    color: 'purple',
    bottom: '8%',
    left: '12%',
    animationClass: 'animate-beam-glide-1',
    opacity: 0.75
  },
  // 8. Small Blue - Bottom Center
  {
    id: 'orb-8',
    size: 55,
    tailLength: 170,
    color: 'blue',
    bottom: '-20px',
    left: '42%',
    animationClass: 'animate-beam-glide-2',
    opacity: 0.7
  }
];

export const AuthFloatingOrbsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {ORB_CONFIGS.map((orb) => {
        let sphereGradient = '';
        let tailGradient = '';
        let glowColor = '';

        if (orb.color === 'purple') {
          sphereGradient = 'linear-gradient(135deg, #C084FC 0%, #9333EA 50%, #6B21A8 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandPurple, 0.42)} 0%, ${hexToRgba(THEME_COLORS.brandPurple, 0.15)} 55%, transparent 100%)`;
          glowColor = 'rgba(147, 51, 234, 0.4)';
        } else if (orb.color === 'blue') {
          sphereGradient = 'linear-gradient(135deg, #60A5FA 0%, #0066FF 50%, #1D4ED8 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandBlue, 0.42)} 0%, ${hexToRgba(THEME_COLORS.brandBlue, 0.15)} 55%, transparent 100%)`;
          glowColor = 'rgba(0, 102, 255, 0.4)';
        } else {
          // Green / Emerald
          sphereGradient = 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #047857 100%)';
          tailGradient = `linear-gradient(to top, ${hexToRgba(THEME_COLORS.brandGreen, 0.42)} 0%, ${hexToRgba(THEME_COLORS.brandGreen, 0.15)} 55%, transparent 100%)`;
          glowColor = 'rgba(16, 185, 129, 0.4)';
        }

        return (
          <div
            key={orb.id}
            className={`absolute ${orb.animationClass} will-change-transform`}
            style={{
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              width: `${orb.size}px`,
              height: `${orb.size + orb.tailLength}px`,
              opacity: orb.opacity ?? 0.8,
              transformOrigin: 'center center'
            }}
          >
            {/* Elongated Tube / Cylinder Tail Beam */}
            <div
              className="w-full rounded-t-full absolute top-0 left-0"
              style={{
                height: `${orb.tailLength + orb.size / 2}px`,
                background: tailGradient,
                boxShadow: `0 0 20px ${glowColor}`
              }}
            />

            {/* Leading Sphere (Ball) at the lower edge of the cylinder */}
            <div
              className="rounded-full absolute bottom-0 left-0 w-full"
              style={{
                height: `${orb.size}px`,
                background: sphereGradient,
                boxShadow: `0 8px 32px ${glowColor}, inset 0 2px 6px rgba(255, 255, 255, 0.6)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
