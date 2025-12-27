'use client';

import { useEffect, useRef } from 'react';

type BackgroundParticlesProps = {
  count?: number;
  color?: string;
  reduceMotion?: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  twinkleOffset: number;
};

const BackgroundParticles = ({
  count = 60,
  color = 'white',
  reduceMotion = false,
}: BackgroundParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    const particles: Particle[] = [];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0002,
          vy: (Math.random() - 0.5) * 0.0002,
          size: Math.random() * 3 + 0.5,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.0002,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, outerRadius: number, rotation: number) => {
      const points = 5;
      const innerRadius = outerRadius * 0.5;

      ctx.beginPath();
      for (let i = 0; i < points * 2; i += 1) {
        const angle = (i * Math.PI) / points + rotation;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
      ctx.closePath();
      ctx.fill();
    };

    const updateParticles = (timestamp: number) => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        if (particle.x <= 0 || particle.x >= 1) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= 1) particle.vy *= -1;

        const x = particle.x * width;
        const y = particle.y * height;

        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(timestamp * 0.002 + particle.twinkleOffset));
        context.save();
        context.globalAlpha = twinkle;
        context.fillStyle = color;
        drawStar(context, x, y, particle.size, particle.rotation);
        context.restore();
      });

      animationFrameId = window.requestAnimationFrame(updateParticles);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = window.requestAnimationFrame(updateParticles);
      }
    };

    resizeCanvas();
    initParticles();
    animationFrameId = window.requestAnimationFrame(updateParticles);

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [count, color, reduceMotion]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
};

export default BackgroundParticles;
