import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { getParticleLogoBounds } from '../lib/logoTargets';

interface HeroRevealSequenceProps {
  currentTime: number; // 0.0s to 8.0s
}

export const HeroRevealSequence: React.FC<HeroRevealSequenceProps> = ({ currentTime }) => {
  const t = currentTime;

  const verticalLineRef = useRef<HTMLDivElement>(null);
  const horizontalLineRef = useRef<HTMLDivElement>(null);

  // Window dimension listener for exact pixel alignment with canvas particles
  const [dimensions, setDimensions] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1200,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate exact particle cloud target bounds
  const bounds = useMemo(() => {
    return getParticleLogoBounds(dimensions.w, dimensions.h);
  }, [dimensions.w, dimensions.h]);

  // Phase 7: GSAP-inspired character stagger helper for title with enhanced 3D rise & blur reveal
  const splitTextIntoSpans = (text: string, baseDelay: number, charStagger: number = 0.035, keyPrefix: string = 'text') => {
    return text.split('').map((char, index) => {
      const charDelay = baseDelay + index * charStagger;
      const elapsedTime = Math.max(0, t - charDelay);
      const progress = Math.min(1.0, elapsedTime / 0.35);
      const eased = 1 - Math.pow(1 - progress, 3);
      const yOffset = (1 - eased) * 22;
      const scale = 0.8 + eased * 0.2;
      const blur = (1 - eased) * 8;
      const opacity = eased;

      return (
        <span
          key={`${keyPrefix}-${char}-${index}`}
          className="inline-block transition-all ease-out"
          style={{
            transform: `translateY(${yOffset}px) scale(${scale})`,
            filter: `blur(${blur}px)`,
            opacity: opacity,
            whiteSpace: 'pre',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const titleDisfrutar = useMemo(() => splitTextIntoSpans('DISFRUTAR', 5.9, 0.04, 'disfrutar'), [t]);
  const titleYear = useMemo(() => splitTextIntoSpans('2K26', 6.35, 0.05, 'year'), [t]);

  // Early return after all hooks are declared
  if (t < 3.7) return null;

  // 1. Logo opacity (3.7s to 4.3s)
  const logoOpacity = Math.min(1.0, (t - 3.7) / 0.6);

  // 2. Phase 5: Logo Elevation & Size Reduction Sequence (4.5s to 5.3s)
  const shiftProgress = Math.min(1.0, Math.max(0, (t - 4.5) / 0.8));
  const shiftEased = 1 - Math.pow(1 - shiftProgress, 3); // Smooth cubic ease-out
  
  // Scale decreases smoothly from 1.0 down to 0.42
  const logoScale = 1.0 - shiftEased * 0.58;
  
  // Upward elevation Y-offset: starts at 0px and glides smoothly up
  const targetElevation = Math.min(Math.max(dimensions.h * 0.22, 140), 190);
  const logoYOffset = -shiftEased * targetElevation;

  // 3. Vertical laser crosshair line (5.0s to 5.6s)
  const vLineProgress = t >= 5.0 ? Math.min(1.0, (t - 5.0) / 0.6) : 0;
  const vLineEased = 1 - Math.pow(1 - vLineProgress, 3);

  // 4. Presenter Header opacity & offset (5.3s to 5.8s)
  const headerOpacity = t >= 5.3 ? Math.min(1.0, (t - 5.3) / 0.5) : 0;
  const headerTranslateY = (1 - headerOpacity) * 12;

  // 5. Horizontal lens flare line (5.7s to 6.3s)
  const hLineProgress = t >= 5.7 ? Math.min(1.0, (t - 5.7) / 0.6) : 0;
  const hLineEased = 1 - Math.pow(1 - hLineProgress, 3);

  // Calculate top offset for text stack so it rests right below elevated logo
  const elevatedLogoBottom = (dimensions.h / 2) - targetElevation + (bounds.boundingSize * 0.42 / 2);
  const textStackTop = elevatedLogoBottom + 24;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* Vertical Cinematic Laser Line through center axis */}
      <div
        ref={verticalLineRef}
        className="fixed left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1.5px] pointer-events-none z-10 origin-center transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(79, 126, 255, 0.25) 15%, #4F7EFF 50%, rgba(79, 126, 255, 0.25) 85%, transparent 100%)',
          boxShadow: '0 0 10px rgba(79, 126, 255, 0.8), 0 0 20px rgba(79, 126, 255, 0.4)',
          opacity: vLineEased * 0.85,
          transform: `scaleY(${vLineEased})`,
        }}
      />

      {/* KARE ACM LOGO: Fixed at dead center & elevated */}
      <div
        className="fixed top-1/2 left-1/2 flex items-center justify-center pointer-events-none z-30 transition-transform duration-75 ease-out"
        style={{
          width: `${bounds.boundingSize}px`,
          height: `${bounds.boundingSize}px`,
          transform: `translate(-50%, calc(-50% + ${logoYOffset}px)) scale(${logoScale})`,
          transformOrigin: 'center center',
          opacity: logoOpacity,
        }}
      >
        {/* Ambient Radial Glow Aura matching matrix scale */}
        <div
          className="absolute rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(79, 126, 255, 0.45) 0%, rgba(79, 126, 255, 0.15) 55%, transparent 80%)',
            filter: 'blur(26px)',
            opacity: logoOpacity,
          }}
        />

        {/* Pulsing Shockwave Ring during assembly materialization (3.7s - 4.8s) */}
        {t >= 3.7 && t <= 4.8 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
            className="absolute rounded-full border border-[#4F7EFF]/60 w-full h-full"
          />
        )}

        {/* KARE ACM Logo Image */}
        <img
          src="/acm_logo.png"
          alt="KARE ACM Student Chapter Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_28px_rgba(79,126,255,0.75)]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* TYPOGRAPHY & HERO CONTENT STACK */}
      <div
        className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center justify-start w-full max-w-5xl px-4 pointer-events-none text-center transition-opacity duration-500 z-20"
        style={{
          top: `${textStackTop}px`,
          opacity: t >= 5.3 ? 1 : 0,
        }}
      >
        {/* A. PRESENTER HEADER */}
        <div
          className="flex flex-col items-center transition-all duration-500 ease-out"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerTranslateY}px)`,
          }}
        >
          <div className="flex items-center justify-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7EFF] shadow-[0_0_8px_#4F7EFF] animate-pulse" />
            <p className="text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.32em] text-[#80A5FF] uppercase font-jakarta">
              KARE ACM STUDENT CHAPTER
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7EFF] shadow-[0_0_8px_#4F7EFF] animate-pulse" />
          </div>
          
          <p
            className="text-[10px] sm:text-xs tracking-[0.55em] text-white/75 uppercase font-mono font-black"
            style={{ marginTop: '10px' }}
          >
            PRESENTS
          </p>
        </div>

        {/* B. HERO TITLE: DISFRUTAR (with wide letter spacing tracking-[0.24em]) */}
        <div
          className="relative w-full flex items-center justify-center px-2"
          style={{ marginTop: '28px' }}
        >
          {/* Horizontal Cinematic Flare Line Behind DISFRUTAR */}
          <div
            ref={horizontalLineRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[2px] pointer-events-none z-0 transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(79, 126, 255, 0.4) 20%, #4F7EFF 50%, rgba(79, 126, 255, 0.4) 80%, transparent 100%)',
              boxShadow: '0 0 16px rgba(79, 126, 255, 0.9), 0 0 35px rgba(79, 126, 255, 0.5)',
              opacity: hLineEased,
              transform: `translate(-50%, -50%) scaleX(${hLineEased})`,
            }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[6px] rounded-full bg-white blur-[2px] shadow-[0_0_25px_#4F7EFF]" />
          </div>

          <h1 className="relative z-10 font-black font-syne text-white leading-none select-none text-center tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.32em] text-[clamp(2.2rem,6.2vw,5.2rem)] drop-shadow-[0_0_35px_rgba(79,126,255,0.65)]">
            {titleDisfrutar}
          </h1>
        </div>

        {/* C. SUBTITLE YEAR: 2K26 (Centered on its own line below DISFRUTAR with wide letter spacing tracking-[0.48em]) */}
        <div
          className="relative w-full flex items-center justify-center px-2"
          style={{ marginTop: '14px' }}
        >
          <div className="relative z-10 font-black font-syne text-transparent bg-clip-text bg-gradient-to-r from-[#4F7EFF] via-[#80A5FF] to-white leading-none select-none text-center tracking-[0.42em] sm:tracking-[0.52em] text-[clamp(1.5rem,3.8vw,3.2rem)] drop-shadow-[0_0_30px_rgba(79,126,255,0.85)]">
            {titleYear}
          </div>
        </div>

      </div>
    </div>
  );
};

