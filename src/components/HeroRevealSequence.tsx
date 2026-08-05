import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { getParticleLogoBounds } from '../lib/logoTargets';

interface HeroRevealSequenceProps {
  currentTime: number; // 0.0s to 8.0s
}

export const HeroRevealSequence: React.FC<HeroRevealSequenceProps> = ({ currentTime }) => {
  const t = currentTime;

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

  // 4. Phase 7: Character stagger helper for title with enhanced 3D rise & blur reveal
  const splitTextIntoSpans = (text: string, baseDelay: number, charStagger: number = 0.03) => {
    return text.split('').map((char, index) => {
      const charDelay = baseDelay + index * charStagger;
      const elapsedTime = Math.max(0, t - charDelay);
      const progress = Math.min(1.0, elapsedTime / 0.35);
      const eased = 1 - Math.pow(1 - progress, 3);
      const yOffset = (1 - eased) * 20;
      const scale = 0.82 + eased * 0.18;
      const blur = (1 - eased) * 6;
      const opacity = eased;

      return (
        <span
          key={`${char}-${index}`}
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

  const titleDisfrutar = useMemo(() => splitTextIntoSpans('DISFRUTAR', 5.9, 0.03), [t]);
  const titleYear = useMemo(() => splitTextIntoSpans('2K26', 6.25, 0.035), [t]);

  // Early return after all hooks are declared to strictly satisfy Rules of Hooks
  if (t < 3.7) return null;

  // 1. Logo opacity (3.7s to 4.3s)
  const logoOpacity = Math.min(1.0, (t - 3.7) / 0.6);

  // 2. Phase 5: Logo Elevation & Size Reduction Sequence (4.5s to 5.3s)
  const shiftProgress = Math.min(1.0, Math.max(0, (t - 4.5) / 0.8));
  const shiftEased = 1 - Math.pow(1 - shiftProgress, 3); // Smooth cubic ease-out
  
  // Scale decreases smoothly from 1.0 (dead center match to particle matrix) down to 0.42 (compact header logo)
  const logoScale = 1.0 - shiftEased * 0.58;
  
  // Upward elevation Y-offset: starts at 0px (exact dead center) and glides smoothly up
  const targetElevation = Math.min(Math.max(dimensions.h * 0.22, 140), 190);
  const logoYOffset = -shiftEased * targetElevation;

  // 3. Presenter Header opacity & offset (5.3s to 5.9s)
  const headerOpacity = t >= 5.3 ? Math.min(1.0, (t - 5.3) / 0.5) : 0;
  const headerTranslateY = (1 - headerOpacity) * 12;

  // 5. Subtitle pill badge opacity (6.6s to 7.2s)
  const subOpacity = t >= 6.6 ? Math.min(1.0, (t - 6.6) / 0.5) : 0;
  const subTranslateY = (1 - subOpacity) * 12;

  // Calculate top offset for text stack so it rests right below the elevated logo
  const elevatedLogoBottom = (dimensions.h / 2) - targetElevation + (bounds.boundingSize * 0.42 / 2);
  const textStackTop = elevatedLogoBottom + 28; // 28px gap below logo

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      
      {/* 1. KARE ACM LOGO: Fixed at exact dead center (50vw, 50vh) & exact particle bounding box */}
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

        {/* KARE ACM Logo Image - Exactly fills bounding box with zero position or scale jump */}
        <img
          src="/acm_logo.png"
          alt="KARE ACM Student Chapter Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_28px_rgba(79,126,255,0.75)]"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* 2. TYPOGRAPHY & HERO CONTENT STACK: Positioned with perfect vertical rhythm below elevated logo */}
      <div
        className="fixed left-1/2 -translate-x-1/2 flex flex-col items-center justify-start w-full max-w-4xl px-4 pointer-events-none text-center transition-opacity duration-500 z-20"
        style={{
          top: `${textStackTop}px`,
          opacity: t >= 5.3 ? 1 : 0,
        }}
      >
        {/* A. PRESENTER HEADER (KARE ACM STUDENT CHAPTER PRESENTS) - Phase 6 (5.3s) */}
        <div
          className="flex flex-col items-center transition-all duration-500 ease-out"
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerTranslateY}px)`,
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7EFF] animate-pulse" />
            <p className="text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.28em] text-[#80A5FF] uppercase font-jakarta">
              KARE ACM STUDENT CHAPTER
            </p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4F7EFF] animate-pulse" />
          </div>
          
          <p
            className="text-[10px] sm:text-xs tracking-[0.6em] text-white/80 uppercase font-mono font-black"
            style={{ marginTop: '10px' }} // 10px below KARE ACM STUDENT CHAPTER per spec
          >
            PRESENTS
          </p>
        </div>

        {/* B. HERO TITLE (DISFRUTAR 2K26) - Phase 7 (5.9s) */}
        {/* 40px below PRESENTS per spec, responsive clamp font size to eliminate overflow/clipping */}
        <div
          className="w-full flex items-center justify-center px-2"
          style={{ marginTop: '36px' }}
        >
          <h1 className="font-black font-syne tracking-tight text-white leading-none select-none text-center flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 text-[clamp(2.2rem,6.5vw,5.5rem)]">
            <span className="inline-block drop-shadow-[0_0_35px_rgba(79,126,255,0.55)]">
              {titleDisfrutar}
            </span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#4F7EFF] via-[#80A5FF] to-white drop-shadow-[0_0_30px_rgba(79,126,255,0.65)]">
              {titleYear}
            </span>
          </h1>
        </div>

        {/* C. SUBTITLE PILL BADGE (24-HOUR NATIONAL AI HACKATHON) - (6.6s) */}
        {/* ~28px below title per spec */}
        <div
          className="transition-all duration-500 ease-out"
          style={{
            marginTop: '28px',
            opacity: subOpacity,
            transform: `translateY(${subTranslateY}px)`,
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#050814]/60 border border-[#4F7EFF]/35 backdrop-blur-md shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#4F7EFF] animate-pulse" />
            <p className="text-[11px] sm:text-xs md:text-sm font-semibold tracking-[0.22em] text-white/90 uppercase font-jakarta whitespace-nowrap">
              32-HOUR NATIONAL AI HACKATHON
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
