import React, { useEffect, useRef } from 'react';
import { THEME_COLORS } from '../../constants/themeColors';

interface CometParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
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
      const size = Math.random() * 20 + 12; // 12px to 32px
      const tailLength = Math.random() * 350 + 250; // 250px to 600px
      const speed = Math.random() * 2.5 + 1.8; // 1.8 to 4.3 speed
      const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 deg diagonal angle

      let x: number;
      let y: number;

      if (randomizePosition) {
        x = Math.random() * (width + 400) - 200;
        y = Math.random() * (height + 400) - 200;
      } else {
        // Spawn from top or left edge
        if (Math.random() > 0.5) {
          x = Math.random() * width;
          y = -tailLength - 50;
        } else {
          x = -tailLength - 50;
          y = Math.random() * height;
        }
      }

      return {
        x,
        y,
        speed,
        size,
        tailLength,
        angle,
        color,
        opacity: Math.random() * 0.25 + 0.7, // 0.7 to 0.95
      };
    };

    // Pool of 18 active comets
    const particleCount = 18;
    const particles: CometParticle[] = Array.from({ length: particleCount }, () =>
      createParticle(true)
    );

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // Update velocity
        const vx = Math.cos(p.angle) * p.speed;
        const vy = Math.sin(p.angle) * p.speed;

        p.x += vx;
        p.y += vy;

        // Calculate tail end coordinate
        const tailX = p.x - Math.cos(p.angle) * p.tailLength;
        const tailY = p.y - Math.sin(p.angle) * p.tailLength;

        // Color definitions
        let mainRgb: string = '0, 102, 255';
        let highlightColor: string = '#DBEAFE';
        let coreColor: string = THEME_COLORS.brandBlue;
        let deepColor: string = '#1E40AF';

        if (p.color === 'purple') {
          mainRgb = '147, 51, 234';
          highlightColor = '#E9D5FF';
          coreColor = THEME_COLORS.brandPurple;
          deepColor = '#581C87';
        } else if (p.color === 'green') {
          mainRgb = '16, 185, 129';
          highlightColor = '#D1FAE5';
          coreColor = THEME_COLORS.brandGreen;
          deepColor = '#064E3B';
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;

        // 1. Draw Long Fading Diagonal Tail Beam
        const tailGrad = ctx.createLinearGradient(p.x, p.y, tailX, tailY);
        tailGrad.addColorStop(0, `rgba(${mainRgb}, 0.5)`);
        tailGrad.addColorStop(0.4, `rgba(${mainRgb}, 0.18)`);
        tailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = p.size * 0.85;
        ctx.lineCap = 'round';
        ctx.shadowColor = `rgba(${mainRgb}, 0.4)`;
        ctx.shadowBlur = 15;
        ctx.stroke();

        // 2. Draw 3D Glowing Sphere Head
        const sphereGrad = ctx.createRadialGradient(
          p.x - p.size * 0.2,
          p.y - p.size * 0.2,
          p.size * 0.1,
          p.x,
          p.y,
          p.size
        );
        sphereGrad.addColorStop(0, highlightColor);
        sphereGrad.addColorStop(0.4, coreColor);
        sphereGrad.addColorStop(1, deepColor);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.shadowColor = `rgba(${mainRgb}, 0.6)`;
        ctx.shadowBlur = 25;
        ctx.fill();

        ctx.restore();

        // 3. Boundary Check — Respawn if moved past screen
        if (p.x - p.tailLength > width || p.y - p.tailLength > height) {
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
