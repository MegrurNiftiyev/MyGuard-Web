import React, { useEffect, useRef } from 'react';
import { THEME_COLORS } from '../../constants/themeColors';

interface CometParticle {
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

    const colors: ('blue' | 'purple' | 'green')[] = ['blue', 'purple', 'green'];

    const createParticle = (randomizePosition = true): CometParticle => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      // Radius between 7px and 30px (diameter 14px to 60px)
      const radius = Math.random() * 23 + 7;
      
      // Inverse physics speed scaling: smaller circles move faster, larger circles move slower
      const baseSpeedFactor = 48;
      const speed = (baseSpeedFactor / radius) * (Math.random() * 0.35 + 0.82);
      
      const tailLength = Math.random() * 250 + radius * 12; // Tail scales nicely with size
      const angle = Math.PI / 4 + (Math.random() * 0.16 - 0.08); // ~45 deg diagonal glide

      let x: number;
      let y: number;

      if (randomizePosition) {
        x = Math.random() * (width + 400) - 200;
        y = Math.random() * (height + 400) - 200;
      } else {
        // Spawn from top or left edge outside screen bounds
        if (Math.random() > 0.5) {
          x = Math.random() * width;
          y = -tailLength - 60;
        } else {
          x = -tailLength - 60;
          y = Math.random() * height;
        }
      }

      return {
        x,
        y,
        speed,
        radius,
        tailLength,
        angle,
        color,
        opacity: Math.random() * 0.25 + 0.72, // 0.72 to 0.97
      };
    };

    // Pool of 20 active comets
    const particleCount = 20;
    const particles: CometParticle[] = Array.from({ length: particleCount }, () =>
      createParticle(true)
    );

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

        // Solid core color matching theme (no white highlights)
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
        tailGrad.addColorStop(0, `rgba(${mainRgb}, 0.5)`);
        tailGrad.addColorStop(0.35, `rgba(${mainRgb}, 0.18)`);
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

        // 2. Pure Solid Color Circle Head (No white 3D shine spot)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.shadowColor = `rgba(${mainRgb}, 0.55)`;
        ctx.shadowBlur = 20;
        ctx.fill();

        ctx.restore();

        // 3. Boundary Check — Respawn if particle moved off canvas
        if (p.x - p.tailLength > width + 100 || p.y - p.tailLength > height + 100) {
          particles[index] = createParticle(false);
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
