import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FullWidthParticleBeatsCanvas } from './FullWidthParticleBeatsCanvas';

gsap.registerPlugin(ScrollTrigger);

interface PrizeItem {
  id: string;
  rank: string;
  badge: string;
  amount: string;
  layout: 'left' | 'right';
  description: string;
}

const prizesData: PrizeItem[] = [
  {
    id: '1st-prize',
    rank: '1st Prize',
    badge: 'CHAMPIONS VAULT',
    amount: '₹50,000',
    layout: 'left',
    description: 'Grand Winner Trophy + Internship Opportunities + ACM Direct Mentorship',
  },
  {
    id: '2nd-prize',
    rank: '2nd Prize',
    badge: 'RUNNER UP VAULT',
    amount: '₹30,000',
    layout: 'right',
    description: 'First Runner-Up Shield + Internship Fast-Track + Swag Kit',
  },
  {
    id: '3rd-prize',
    rank: '3rd Prize',
    badge: 'PODIUM VAULT',
    amount: '₹20,000',
    layout: 'left',
    description: 'Second Runner-Up Shield + Industry Mentorship + Developer Goodies',
  },
];

// Canvas Vertical & Circular Beat Particle Energy Engine in Royal Blue (#536BFF / #4F7EFF / #8DA2FF)
const PedestalParticleCanvas: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let isMobile = window.innerWidth < 768;

    const setupCanvas = () => {
      if (!canvas.parentElement) return;
      isMobile = window.innerWidth < 768;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();

    const handleResize = () => {
      setupCanvas();
    };
    window.addEventListener('resize', handleResize);

    let time = 0;

    // 1. Circular Equalizer Beat Ring Columns dataset around pedestal base
    const numRingCols = isMobile ? 28 : 44;
    const ringCols = Array.from({ length: numRingCols }).map((_, i) => ({
      angle: (i / numRingCols) * Math.PI * 2,
      phase: Math.random() * Math.PI * 2,
      currentH: 10,
    }));

    // 2. Core Energy Stacked Dot Columns rising to Prize Amount
    const numCoreCols = isMobile ? 12 : 20;
    const coreCols = Array.from({ length: numCoreCols }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      distRatio: Math.sqrt(Math.random()) * 0.65,
      currentH: 20 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
    }));

    // 3. Floating Micro Spark Particles
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

    const spawnSpark = (x: number, y: number) => {
      const maxSparks = isMobile ? 30 : 80;
      if (sparks.length > maxSparks) return;
      const colors = ['83, 107, 255', '79, 126, 255', '141, 162, 255', '255, 255, 255'];
      sparks.push({
        x: x + (Math.random() - 0.5) * 6,
        y: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -1.2 - Math.random() * 2.2,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.9,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

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

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;

      ctx.clearRect(0, 0, w, h);
      time += 0.045;
      const intensity = isActive ? 1.0 : 0.45;

      const cx = w / 2;
      const baseY = h - 55;
      const rx = Math.min(160, w * 0.36);
      const ry = 40;

      // A. RENDER CIRCULAR EQUALIZER BEAT RING
      for (let i = 0; i < ringCols.length; i++) {
        const col = ringCols[i];
        const cosA = Math.cos(col.angle);
        const sinA = Math.sin(col.angle);

        const colX = cx + cosA * rx;
        const colBaseY = baseY + sinA * ry;

        const depthNorm = (sinA + 1) / 2;
        const scale = 0.65 + depthNorm * 0.5;

        const w1 = Math.sin(time * 3 + col.angle * 3 + col.phase) * 0.4;
        const w2 = Math.cos(time * 2.2 + col.angle * 5) * 0.3;
        const targetH = (12 + (w1 + w2 + 0.7) * 32 * scale) * intensity;

        col.currentH += (targetH - col.currentH) * 0.22;

        const dotW = (isMobile ? 3.5 : 4) * scale;
        const dotH = (isMobile ? 2.5 : 3) * scale;
        const gap = 2 * scale;
        const step = dotH + gap;
        const numDots = Math.floor(col.currentH / step);

        for (let d = 0; d < numDots; d++) {
          const dotY = colBaseY - (d + 1) * step;
          const normH = d / Math.max(1, numDots);

          let color = `rgba(83, 107, 255, ${(0.35 + normH * 0.5) * intensity})`;
          if (normH > 0.8) {
            color = `rgba(255, 255, 255, ${0.95 * intensity})`;
          } else if (normH > 0.5) {
            color = `rgba(141, 162, 255, ${0.8 * intensity})`;
          }

          ctx.fillStyle = color;
          ctx.fillRect(colX - dotW / 2, dotY, dotW, dotH);
        }

        const peakY = colBaseY - col.currentH - 3 * scale;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * intensity})`;
        ctx.fillRect(colX - dotW / 2, peakY, dotW, 2.5 * scale);

        if (isActive && Math.random() < (isMobile ? 0.04 : 0.08)) {
          spawnSpark(colX, peakY);
        }
      }

      // B. RENDER CORE VERTICAL BEAMS
      for (let i = 0; i < coreCols.length; i++) {
        const c = coreCols[i];
        const dist = c.distRatio * (rx * 0.65);
        const colX = cx + Math.cos(c.angle) * dist;
        const startY = baseY + Math.sin(c.angle) * (dist * (ry / rx));

        const w1 = Math.sin(time * 2.5 + c.phase) * 0.4;
        const targetH = (30 + (w1 + 0.5) * (h * 0.45)) * intensity;
        c.currentH += (targetH - c.currentH) * 0.18;

        const dotW = isMobile ? 2.5 : 3;
        const dotH = isMobile ? 2.5 : 3;
        const gap = 2.5;
        const step = dotH + gap;
        const numDots = Math.floor(c.currentH / step);

        for (let d = 0; d < numDots; d++) {
          const dotY = startY - (d + 1) * step;
          const normH = d / Math.max(1, numDots);

          let color = `rgba(79, 126, 255, ${(0.25 + normH * 0.55) * intensity})`;
          if (normH > 0.85) color = `rgba(255, 255, 255, ${0.9 * intensity})`;

          ctx.fillStyle = color;
          ctx.fillRect(colX - dotW / 2, dotY, dotW, dotH);
        }
      }

      // C. RENDER MICRO SPARKS
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.03;

        if (s.alpha <= 0 || s.y < 20) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(${s.color}, ${s.alpha * intensity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    return () => {
      observer.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    />
  );
};

export const PrizesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prizeCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const amountRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pedestalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  // 3D Perspective Tilt on Mouse Movement (Disabled on touchscreen for 60 FPS mobile smoothness)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const pedestal = pedestalRefs.current[index];
    if (!pedestal) return;
    const rect = pedestal.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(pedestal, {
      rotateY: (x / rect.width) * 16,
      rotateX: (-y / rect.height) * 16,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = (index: number) => {
    const pedestal = pedestalRefs.current[index];
    if (!pedestal) return;
    gsap.to(pedestal, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.fromTo(
        '.prizes-header-elem',
        { y: 35, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 78%',
          },
        }
      );

      // 2. Individual Prize Blocks GSAP Timeline Setup with Staggered ScrollTrigger
      prizeCardRefs.current.forEach((block, index) => {
        if (!block) return;

        const badge = block.querySelector('.prize-badge-anim');
        const line = block.querySelector('.prize-line-anim');
        const rank = block.querySelector('.prize-rank-anim');
        const desc = block.querySelector('.prize-desc-anim');
        const pedestal = pedestalRefs.current[index];
        const ring = ringRefs.current[index];
        const amount = amountRefs.current[index];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 78%',
            end: 'bottom 25%',
            toggleActions: 'play reverse play reverse',
            onEnter: () => setActiveStageIndex(index),
            onEnterBack: () => setActiveStageIndex(index),
          },
        });

        // Step A: Badge slides down
        if (badge) {
          tl.fromTo(
            badge,
            { y: -18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
            0
          );
        }

        // Step B: Rank Title slides up with blur reveal
        if (rank) {
          tl.fromTo(
            rank,
            { y: 28, opacity: 0, filter: 'blur(8px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.65, ease: 'power3.out' },
            0.1
          );
        }

        // Step C: Connector Line expands horizontally
        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power3.out' },
            0.2
          );
        }

        // Step D: Description subtext fades & slides up
        if (desc) {
          tl.fromTo(
            desc,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
            0.25
          );
        }

        // Step E: Pedestal rises with 3D spatial rotation
        if (pedestal) {
          tl.fromTo(
            pedestal,
            { y: 65, opacity: 0, scale: 0.88, rotateX: 25 },
            { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.85, ease: 'power3.out' },
            0.15
          );
        }

        // Step F: Holographic Royal Blue ring expansion & glow shockwave
        if (ring) {
          tl.fromTo(
            ring,
            { scale: 0.72, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.8)' },
            0.35
          );
        }

        // Step G: Prize Amount projects upward into mid-air with spring overshoot
        if (amount) {
          tl.fromTo(
            amount,
            { y: 45, opacity: 0, scale: 0.85 },
            { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' },
            0.45
          );

          // Step H: Metallic Reflection Sweep across amount text
          const shine = amount.querySelector('.metallic-shine-beam');
          if (shine) {
            tl.fromTo(
              shine,
              { x: '-120%' },
              { x: '220%', duration: 1.3, ease: 'power2.inOut' },
              0.8
            );
          }
        }
      });

      // 3. Continuation CTA ScrollTrigger
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 50, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ctaRef.current,
              start: 'top 82%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="relative w-full pt-24 lg:pt-36 pb-0 bg-[#040612] text-white overflow-hidden border-t border-[#182544]/60 select-none"
    >
      {/* Anchor for Navbar/Footer smooth scroll */}
      <div id="prize" className="absolute top-0 left-0" />

      {/* Royal Blue Background Depth & Lighting Hierarchy */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Upper 1100px Royal Blue Radial Glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] opacity-25 blur-[150px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(83, 107, 255, 0.45) 0%, rgba(66, 86, 246, 0.15) 50%, transparent 80%)',
          }}
        />

        {/* Center Core Deep Indigo Illumination */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-20 blur-[180px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(79, 126, 255, 0.35) 0%, rgba(4, 6, 18, 0.95) 75%)',
          }}
        />

        {/* 48px Tech Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          }}
        />

        {/* Top & Bottom Royal Blue Accent Highlight Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent shadow-[0_0_15px_#536BFF]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20 lg:mb-28">
          
          {/* Small Decorative Line Label */}
          <div className="prizes-header-elem flex items-center justify-center gap-3.5 mb-3">
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#536BFF]/40" />
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.35em] text-[#A6C0FF] uppercase font-space">
              PRIZE POOL & REWARDS
            </span>
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#536BFF]/40" />
          </div>

          {/* Clean Main Heading */}
          <h2 className="prizes-header-elem text-[40px] sm:text-[52px] lg:text-[62px] font-extrabold text-white tracking-tight leading-[1.08] mb-4 font-space">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DA2FF] via-[#536BFF] to-white">Prizes</span>
          </h2>

          {/* Subtitle Paragraph */}
          <p className="prizes-header-elem text-[#C5D5F8] text-[16px] sm:text-[18px] font-normal leading-[1.65] max-w-[650px] mx-auto font-sans">
            Precision engineered rewards and exclusive career fast-tracks for top performing AI innovators.
          </p>
        </div>

        {/* Vertically Stacked Prize Showcase (Alternating Layout) */}
        <div className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
          {prizesData.map((prize, index) => {
            const isActive = activeStageIndex === index;
            const isLeft = prize.layout === 'left';

            return (
              <div
                key={prize.id}
                ref={(el) => (prizeCardRefs.current[index] = el)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => handleMouseLeave(index)}
                className={`relative w-full flex flex-col ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center justify-between gap-12 md:gap-20 transition-all duration-700 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-75 scale-[0.98]'
                }`}
              >
                {/* Text Content Block (Label + Badge + Description + Indicator Line) */}
                <div
                  className={`w-full md:w-5/12 flex flex-col ${
                    isLeft ? 'items-center md:items-start text-center md:text-left' : 'items-center md:items-end text-center md:text-right'
                  }`}
                >
                  {/* Category Pill Badge (Animated by GSAP) */}
                  <span className="prize-badge-anim text-[10px] font-mono font-bold tracking-[0.24em] text-[#8DA2FF] uppercase bg-[#536BFF]/15 px-3 py-1 rounded-md border border-[#536BFF]/35 mb-3 shadow-[0_0_14px_rgba(83,107,255,0.25)]">
                    {prize.badge}
                  </span>

                  {/* Prize Title & Line Indicator (Animated by GSAP) */}
                  <div className="relative inline-flex items-center gap-4 my-1">
                    {isLeft && (
                      <div className="prize-line-anim hidden md:flex items-center origin-left">
                        <div className="w-[50px] lg:w-[75px] h-[2px] bg-gradient-to-r from-[#536BFF] to-transparent shadow-[0_0_12px_#536BFF]" />
                        <div className="w-[7px] h-[7px] rounded-full bg-[#536BFF] shadow-[0_0_10px_#536BFF] -ml-1.5 animate-ping" />
                      </div>
                    )}

                    <h3 className="prize-rank-anim font-space font-bold text-[28px] sm:text-[34px] lg:text-[40px] tracking-wide text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                      {prize.rank}
                    </h3>

                    {!isLeft && (
                      <div className="prize-line-anim hidden md:flex items-center origin-right">
                        <div className="w-[7px] h-[7px] rounded-full bg-[#536BFF] shadow-[0_0_10px_#536BFF] -mr-1.5 animate-ping" />
                        <div className="w-[50px] lg:w-[75px] h-[2px] bg-gradient-to-l from-[#536BFF] to-transparent shadow-[0_0_12px_#536BFF]" />
                      </div>
                    )}
                  </div>

                  {/* Description Subtext (Animated by GSAP) */}
                  <p className="prize-desc-anim text-[#F4F7FF]/70 text-[13px] sm:text-[14px] font-sans leading-relaxed max-w-xs mt-2">
                    {prize.description}
                  </p>
                </div>

                {/* 3D Energy Pedestal Block */}
                <div
                  ref={(el) => (pedestalRefs.current[index] = el)}
                  className="relative w-full max-w-[440px] h-[320px] sm:h-[360px] flex flex-col items-center justify-end group cursor-pointer"
                  style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                >
                  {/* Canvas Particle Engine */}
                  <PedestalParticleCanvas isActive={isActive} />

                  {/* Projected Floating Prize Amount */}
                  <div
                    ref={(el) => (amountRefs.current[index] = el)}
                    className="relative z-20 mb-20 sm:mb-24 text-center animate-pedestal-float"
                  >
                    <div className="relative inline-block overflow-hidden px-4 py-1">
                      <span
                        className="font-space font-black text-[44px] xs:text-[54px] sm:text-[68px] lg:text-[80px] tracking-tight leading-none block text-transparent bg-clip-text bg-gradient-to-b from-white via-[#C3D2FF] to-[#536BFF]"
                        style={{
                          textShadow: '0 0 35px rgba(83, 107, 255, 0.85), 0 0 75px rgba(83, 107, 255, 0.45)',
                        }}
                      >
                        {prize.amount}
                      </span>

                      {/* Metallic Shine Beam Sweep */}
                      <div className="metallic-shine-beam absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12 pointer-events-none opacity-45" />
                    </div>
                  </div>

                  {/* 3D Metallic Hardware Pedestal Base with Dot-Matrix HUD Ring */}
                  <div className="relative w-[260px] xs:w-[300px] sm:w-[360px] lg:w-[370px] h-[100px] sm:h-[130px] flex items-center justify-center">
                    
                    {/* Volumetric Floor Ambient Glow */}
                    <div
                      className="absolute -bottom-8 w-full h-[45px] rounded-full blur-[26px] transition-all duration-500"
                      style={{
                        background: isActive
                          ? 'radial-gradient(ellipse, rgba(83, 107, 255, 0.75) 0%, rgba(66, 86, 246, 0.3) 50%, transparent 80%)'
                          : 'radial-gradient(ellipse, rgba(83, 107, 255, 0.22) 0%, transparent 70%)',
                      }}
                    />

                    {/* Outer Dot-Matrix Equalizer HUD Perimeter Ring */}
                    <div
                      className="absolute inset-0 rounded-[100%] border border-dashed border-[#536BFF]/40 pointer-events-none transition-all duration-500"
                      style={{
                        boxShadow: isActive ? '0 0 25px rgba(83, 107, 255, 0.45)' : 'none',
                      }}
                    />

                    {/* Pedestal Chassis Frame */}
                    <div
                      className="relative w-[94%] h-[90%] rounded-[100%] border-2 border-[#536BFF]/60 flex items-center justify-center transition-all duration-500 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                      style={{
                        background: 'linear-gradient(180deg, #182544 0%, #0D162D 60%, #040612 100%)',
                        boxShadow: isActive
                          ? '0 0 40px rgba(83, 107, 255, 0.6), inset 0 2px 14px rgba(255, 255, 255, 0.3), inset 0 -14px 28px rgba(0,0,0,0.95)'
                          : '0 0 18px rgba(83, 107, 255, 0.2), inset 0 1px 6px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {/* Radial Dot-Matrix Telemetry Tick Grid */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <div className="w-[90%] h-[90%] rounded-[100%] border border-dotted border-white/60 animate-spin-slow" />
                      </div>

                      {/* Illuminated Core Deck with Concentric HUD Spectrum Grid */}
                      <div
                        className="w-[86%] h-[74%] rounded-[100%] border border-[#536BFF]/70 flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(83, 107, 255, 0.5) 0%, rgba(7, 9, 28, 0.95) 75%)',
                        }}
                      >
                        {/* Concentric Sci-Fi Radar Rings */}
                        <div className="absolute w-[80%] h-[80%] rounded-[100%] border border-[#536BFF]/40" />
                        <div className="absolute w-[52%] h-[52%] rounded-[100%] border border-[#536BFF]/60" />
                        <div className="absolute w-[26%] h-[26%] rounded-[100%] bg-[#536BFF] blur-[4px] opacity-90 animate-pulse" />
                      </div>
                    </div>

                    {/* Floating Holographic Top Energy Ring */}
                    <div
                      ref={(el) => (ringRefs.current[index] = el)}
                      className="absolute -top-4 w-[84%] h-[52px] rounded-[100%] border-[3px] border-[#536BFF] pointer-events-none transition-all duration-500 animate-ring-rotate"
                      style={{
                        boxShadow: isActive
                          ? '0 0 35px #536BFF, 0 0 70px rgba(83, 107, 255, 0.75), inset 0 0 20px #536BFF'
                          : '0 0 16px #536BFF, inset 0 0 10px #536BFF',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continuation CTA Block: Internship Opportunities inside Full-Width Particle Beats Field */}
      <div ref={ctaRef} className="mt-24 lg:mt-32 w-full relative z-10">
        <FullWidthParticleBeatsCanvas>
          {/* Tilted Futuristic Glassmorphism Cards */}
          <div className="relative flex flex-col items-center justify-center gap-3 my-2">
            {/* Card 1: "Is that all?" */}
            <div
              className="relative px-9 py-3 rounded-2xl bg-[#0A1022]/90 border border-[#536BFF]/50 shadow-[0_0_30px_rgba(83,107,255,0.35)] -rotate-3 transition-transform duration-300 hover:rotate-0"
              style={{ backdropFilter: 'blur(18px)' }}
            >
              <span className="font-space font-black italic text-[26px] sm:text-[34px] tracking-wide text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">
                Is that all?
              </span>
            </div>

            {/* Card 2: "NOPE!" */}
            <div
              className="relative px-11 py-4 rounded-2xl bg-[#091533] border-2 border-[#536BFF] shadow-[0_0_45px_rgba(83,107,255,0.7)] rotate-2 transition-transform duration-300 hover:rotate-0 -mt-3"
              style={{ backdropFilter: 'blur(18px)' }}
            >
              <span className="font-space font-black italic text-[34px] sm:text-[44px] tracking-wider text-white drop-shadow-[0_0_22px_#536BFF]">
                NOPE!
              </span>
            </div>
          </div>

          {/* Main Headline: "Selected people get Internship Opportunities!" */}
          <p className="mt-8 text-[20px] sm:text-[24px] lg:text-[28px] font-sans font-medium text-white/95 max-w-2xl leading-snug">
            Selected people get{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DA2FF] via-[#536BFF] to-white font-extrabold drop-shadow-[0_0_20px_rgba(83,107,255,0.85)]">
              Internship Opportunities!
            </span>
          </p>

          <p className="text-[14px] sm:text-[16px] text-[#F4F7FF]/70 font-sans mt-3 max-w-md">
            Direct industry interview fast-tracks, ACM mentorship & exclusive tech swag kits for top builders!
          </p>
        </FullWidthParticleBeatsCanvas>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes pedestalFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-9px);
          }
        }
        .animate-pedestal-float {
          animation: pedestalFloat 4.8s ease-in-out infinite;
        }

        @keyframes ringRotate {
          0%, 100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }
        .animate-ring-rotate {
          animation: ringRotate 3.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
