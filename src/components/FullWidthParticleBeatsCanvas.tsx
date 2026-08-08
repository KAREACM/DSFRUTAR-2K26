import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FullWidthParticleBeatsCanvasProps {
  children?: React.ReactNode;
}

export const FullWidthParticleBeatsCanvas: React.FC<FullWidthParticleBeatsCanvasProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const shockwavesRef = useRef<Array<{ x: number; radius: number; maxRadius: number; strength: number }>>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isMobile = window.innerWidth < 768;

    const getCanvasDims = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      return { w, h };
    };

    let { w: width, h: height } = getCanvasDims();

    const setupCanvasScale = () => {
      isMobile = window.innerWidth < 768;
      const dims = getCanvasDims();
      width = dims.w;
      height = dims.h;

      // DPR capping for 60 FPS mobile butter-smooth rendering
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvasScale();

    const handleResize = () => {
      setupCanvasScale();
      initColumns();
    };
    window.addEventListener('resize', handleResize);

    // Audio Equalizer Column Setup across FULL width
    let colWidth = isMobile ? 10 : 8;
    let barWidth = isMobile ? 4.5 : 5.5;
    let numCols = Math.ceil(width / colWidth) + 4;

    interface BeatColumn {
      x: number;
      currentHeight: number;
      targetHeight: number;
      peakY: number;
      peakVelocity: number;
      basePhase: number;
      speed: number;
      interactiveBoost: number;
    }

    const columns: BeatColumn[] = [];

    const initColumns = () => {
      columns.length = 0;
      colWidth = isMobile ? 10 : 8;
      barWidth = isMobile ? 4.5 : 5.5;
      // Guarantee edge-to-edge coverage starting before 0 to past width
      numCols = Math.ceil(width / colWidth) + 4;
      const startX = -colWidth;

      for (let i = 0; i < numCols; i++) {
        columns.push({
          x: startX + i * colWidth + colWidth / 2,
          currentHeight: 25,
          targetHeight: 25,
          peakY: height - 25,
          peakVelocity: 0,
          basePhase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.04,
          interactiveBoost: 0,
        });
      }
    };

    initColumns();

    // Floating micro sparks & seam particles
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }
    const sparks: Spark[] = [];

    const spawnSpark = (x: number, y: number, isSeam = false) => {
      const maxSparks = isMobile ? 50 : 150;
      if (sparks.length > maxSparks) return;
      const colors = [
        '83, 107, 255',  // Royal Blue (#536BFF)
        '79, 126, 255',  // Vibrant Blue (#4F7EFF)
        '141, 162, 255', // Light Royal (#8DA2FF)
        '255, 255, 255', // Pure White (#FFFFFF)
      ];
      sparks.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y,
        vx: (Math.random() - 0.5) * (isSeam ? 0.8 : 1.2),
        vy: isSeam ? 0.4 + Math.random() * 1.2 : -1 - Math.random() * 2.5,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.9,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // ScrollTrigger entrance amplitude scaling
    const animState = { globalAmplitude: 0.1, time: 0 };
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      end: 'bottom 20%',
      onEnter: () => {
        gsap.to(animState, { globalAmplitude: 1.0, duration: 1.2, ease: 'power2.out' });
      },
      onLeaveBack: () => {
        gsap.to(animState, { globalAmplitude: 0.15, duration: 0.8, ease: 'power2.out' });
      },
    });

    let isVisible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId) {
            animId = requestAnimationFrame(render);
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    // 60 FPS Optimized Render Loop matching Prize Pedestal Base Aesthetics
    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      ctx.clearRect(0, 0, width, height);
      animState.time += 0.04;

      const mouse = mousePosRef.current;
      const mouseX = mouse.x;
      const mouseY = mouse.y;
      const isMouseIn = mouse.active;

      const baseY = height - 15;
      const maxBarHeight = height * 0.84;
      const centerX = width / 2;

      // 0. Render Grounded Baseline Laser Energy Beam behind beats
      ctx.strokeStyle = 'rgba(83, 107, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(width, baseY);
      ctx.stroke();

      // 1. Update and Render Beat Columns (stacked particle dots matching Prize Base)
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // Fill side areas continuously - side edges rise up to frame the visualizer without blank space
        const distFromCenter = Math.abs(col.x - centerX) / (width / 2);
        const edgeFactor = 0.55 + Math.pow(distFromCenter, 1.2) * 0.65;

        const wave1 = Math.sin(animState.time * 2 + col.basePhase) * 0.35;
        const wave2 = Math.cos(animState.time * 3.8 + col.x * 0.015) * 0.25;
        const wave3 = Math.sin(animState.time * 1.2 + i * 0.2) * 0.25;
        const rFactor = 0.35 + (wave1 + wave2 + wave3 + 0.85) * 0.4;

        let mouseBoost = 0;
        if (isMouseIn) {
          const dx = col.x - mouseX;
          const dy = (height * 0.5) - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = isMobile ? 160 : 240;
          if (dist < maxDist) {
            mouseBoost = Math.pow(1 - dist / maxDist, 2) * 1.9;
          }
        }

        let shockBoost = 0;
        for (let s = 0; s < shockwavesRef.current.length; s++) {
          const sw = shockwavesRef.current[s];
          const dist = Math.abs(col.x - sw.x);
          if (Math.abs(dist - sw.radius) < 45) {
            const factor = 1 - Math.abs(dist - sw.radius) / 45;
            shockBoost += factor * sw.strength;
          }
        }

        col.interactiveBoost += (mouseBoost + shockBoost - col.interactiveBoost) * 0.18;

        const targetH = Math.min(
          maxBarHeight,
          (25 + rFactor * maxBarHeight * edgeFactor + col.interactiveBoost * 95) * animState.globalAmplitude
        );

        col.currentHeight += (targetH - col.currentHeight) * 0.22;

        const currentCapY = baseY - col.currentHeight - 4;
        if (currentCapY < col.peakY) {
          col.peakY = currentCapY;
          col.peakVelocity = -2.8;
          if (Math.random() < (isMobile ? 0.09 : 0.18) * animState.globalAmplitude) {
            spawnSpark(col.x, col.peakY, false);
          }
        } else {
          col.peakVelocity += 0.32;
          col.peakY += col.peakVelocity;
          if (col.peakY > currentCapY) {
            col.peakY = currentCapY;
            col.peakVelocity = 0;
          }
        }

        // RENDER COLUMN AS STACKED DOT-MATRIX PARTICLES (EXACT PRIZE PEDESTAL STYLING)
        const dotHeight = isMobile ? 3 : 3.5;
        const dotGap = isMobile ? 2 : 2.5;
        const totalDotStep = dotHeight + dotGap;
        const numDots = Math.floor(col.currentHeight / totalDotStep);

        for (let d = 0; d < numDots; d++) {
          const dotY = baseY - (d + 1) * totalDotStep;
          const normH = d / Math.max(1, numDots);

          let dotColor = 'rgba(83, 107, 255, 0.45)';
          if (normH > 0.85) {
            dotColor = 'rgba(255, 255, 255, 0.98)';
          } else if (normH > 0.6) {
            dotColor = `rgba(141, 162, 255, ${0.78 + col.interactiveBoost * 0.22})`;
          } else if (normH > 0.3) {
            dotColor = `rgba(83, 107, 255, ${0.68 + col.interactiveBoost * 0.32})`;
          } else {
            dotColor = `rgba(50, 75, 200, ${0.42 + normH * 0.38})`;
          }

          ctx.fillStyle = dotColor;
          ctx.fillRect(col.x - barWidth / 2, dotY, barWidth, dotHeight);
        }

        // Glowing Peak Indicator Cap
        const capAlpha = Math.min(1, Math.max(0.35, 1 - (col.peakY - currentCapY) / 45));
        ctx.fillStyle = `rgba(255, 255, 255, ${capAlpha})`;
        ctx.fillRect(col.x - barWidth / 2, col.peakY, barWidth, 2.8);
      }

      // 2. Update Shockwaves
      for (let s = shockwavesRef.current.length - 1; s >= 0; s--) {
        const sw = shockwavesRef.current[s];
        sw.radius += 15;
        sw.strength *= 0.90;
        if (sw.radius > sw.maxRadius || sw.strength < 0.05) {
          shockwavesRef.current.splice(s, 1);
        }
      }

      // 3. Render Micro Sparks
      for (let p = sparks.length - 1; p >= 0; p--) {
        const spark = sparks[p];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.alpha -= 0.022;

        if (spark.alpha <= 0 || spark.y < 0 || spark.y > height + 50) {
          sparks.splice(p, 1);
          continue;
        }

        ctx.fillStyle = `rgba(${spark.color}, ${spark.alpha})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (Math.random() < (isMobile ? 0.15 : 0.35)) {
        spawnSpark(Math.random() * width, height - 30, true);
      }

      // 4. Seam Bottom Gradient Overlay
      const bottomFadeHeight = 130;
      const bottomGrad = ctx.createLinearGradient(0, height - bottomFadeHeight, 0, height);
      bottomGrad.addColorStop(0, 'rgba(4, 6, 18, 0)');
      bottomGrad.addColorStop(0.5, 'rgba(4, 6, 18, 0.45)');
      bottomGrad.addColorStop(0.85, 'rgba(4, 6, 18, 0.92)');
      bottomGrad.addColorStop(1.0, '#040612');

      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height - bottomFadeHeight, width, bottomFadeHeight);

      animId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      shockwavesRef.current.push({
        x: e.clientX - rect.left,
        radius: 10,
        maxRadius: isMobile ? 180 : 320,
        strength: 1.8,
      });
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        mousePosRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top, active: true };
      }
    };
    const handleTouchEnd = () => {
      mousePosRef.current.active = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      trigger.kill();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col items-center justify-center pt-14 sm:pt-24 pb-20 sm:pb-32"
    >
      {/* Top Ambient Blend Glow from Prizes Showcase */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[180px] pointer-events-none z-0"
        style={{
          background: 'linear-gradient(180deg, #040612 0%, rgba(4, 6, 18, 0.4) 60%, transparent 100%)',
        }}
      />

      {/* Hardware Accelerated Canvas for 60 FPS Butter-Smooth Mobile Rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-crosshair z-0"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
      />

      {/* Central Dark Glow Overlay behind text for ultra-crisp legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(4, 6, 18, 0.88) 0%, rgba(4, 6, 18, 0.5) 60%, transparent 100%)',
        }}
      />

      {/* Content positioned in the middle, between the beats */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {children}
      </div>

      {/* AWARDS-LEVEL SEAM BRIDGE: Pulsing Sci-Fi Energy Beam & Ambient Aura bridging into FAQ */}
      <div className="absolute bottom-0 inset-x-0 h-[100px] pointer-events-none z-10 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[70px] blur-[35px] opacity-70"
          style={{
            background: 'radial-gradient(ellipse, rgba(83, 107, 255, 0.35) 0%, rgba(79, 126, 255, 0.12) 60%, transparent 85%)',
          }}
        />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 sm:w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#536BFF] to-transparent shadow-[0_0_20px_#536BFF]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#8DA2FF] to-transparent shadow-[0_0_12px_#8DA2FF] animate-pulse" />
      </div>
    </div>
  );
};
