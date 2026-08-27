import React, { useEffect, useRef } from 'react';
import { THEME_COLORS } from '../../constants/themeColors';

interface CometParticle {
  id: number;
  x: number;
  y: number;
  speed: number;
  radius: number; // Circle radius in px (diameter = radius * 2)
  tailLength: number;
  angle: number;
  color: 'blue' | 'purple' | 'green';
  opacity: number;
}

export const AuthFloatingOrbsBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Exact equal 1/3 color distribution: 6 Blue, 6 Purple, 6 Green (18 Total)
    const particleColors: ('blue' | 'purple' | 'green')[] = [
      'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
      'purple', 'purple', 'purple', 'purple', 'purple', 'purple',
      'green', 'green', 'green', 'green', 'green', 'green',
    ];

    const particles: CometParticle[] = [];

    // Helper to check for collision/overlap with existing particles
    const isOverlapping = (x: number, y: number, radius: number, existingParticles: CometParticle[]): boolean => {
      const minGap = 50; // Minimum distance gap between circle centers
      for (const other of existingParticles) {
        const dist = Math.hypot(x - other.x, y - other.y);
        if (dist < radius + other.radius + minGap) {
          return true;
        }
      }
      return false;
    };

    const createSingleParticle = (
      id: number,
      color: 'blue' | 'purple' | 'green',
      randomizePosition = true,
      existing: CometParticle[] = []
    ): CometParticle => {
      // Radius between 8px and 28px
      const radius = Math.random() * 20 + 8;
      
      // Inverse speed scaling: smaller circles move faster, larger circles move slower
      const baseSpeedFactor = 46;
      const speed = (baseSpeedFactor / radius) * (Math.random() * 0.35 + 0.82);
      
      const tailLength = Math.random() * 220 + radius * 11;
      const angle = Math.PI / 4 + (Math.random() * 0.14 - 0.07); // ~45 deg diagonal angle

      let x = 0;
      let y = 0;
      let attempts = 0;
      const maxAttempts = 50;

      while (attempts < maxAttempts) {
        if (randomizePosition) {
          x = Math.random() * (width + 400) - 200;
          y = Math.random() * (height + 400) - 200;
        } else {
          if (Math.random() > 0.5) {
            x = Math.random() * width;
            y = -tailLength - 60;
          } else {
            x = -tailLength - 60;
            y = Math.random() * height;
          }
        }

        if (!isOverlapping(x, y, radius, existing)) {
          break;
        }
        attempts++;
      }

      return {
        id,
        x,
        y,
        speed,
        radius,
        tailLength,
        angle,
        color,
        opacity: Math.random() * 0.22 + 0.75, // 0.75 to 0.97
      };
    };

    // Initialize 18 particles with strict equal color allocation and collision avoidance
    particleColors.forEach((color, i) => {
      const particle = createSingleParticle(i, color, true, particles);
      particles.push(particle);
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // Update position according to speed and angle
        const vx = Math.cos(p.angle) * p.speed;
        const vy = Math.sin(p.angle) * p.speed;

        p.x += vx;
        p.y += vy;

        // Tail endpoint calculation
        const tailX = p.x - Math.cos(p.angle) * p.tailLength;
        const tailY = p.y - Math.sin(p.angle) * p.tailLength;

        // Solid core color matching theme
        let mainRgb: string = '0, 102, 255';
        let coreColor: string = THEME_COLORS.brandBlue;

        if (p.color === 'purple') {
          mainRgb = '147, 51, 234';
          coreColor = THEME_COLORS.brandPurple;
        } else if (p.color === 'green') {
          mainRgb = '16, 185, 129';
          coreColor = THEME_COLORS.brandGreen;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;

        // 1. Long Fading Shadow Tail — Width matches exact circle diameter (radius * 2)
        const tailGrad = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(${mainRgb}, 0.52)`);
        tailGrad.addColorStop(0.38, `rgba(${mainRgb}, 0.2)`);
        tailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = p.radius * 2; // Exact circle diameter width
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${mainRgb}, 0.35)`;
        ctx.shadowBlur = 12;
        ctx.stroke();

        // 2. Pure Solid Color Circle Head (No white shine spot)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.shadowColor = `rgba(${mainRgb}, 0.6)`;
        ctx.shadowBlur = 22;
        ctx.fill();

        ctx.restore();

        // 3. Boundary Check — Respawn retaining exact same color to maintain equal distribution
        if (p.x - p.tailLength > width + 120 || p.y - p.tailLength > height + 120) {
          particles[index] = createSingleParticle(p.id, p.color, false, particles.filter(other => other.id !== p.id));
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none"
    />
  );
};

export default AuthFloatingOrbsBackground;
