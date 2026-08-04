import React, { useState, useEffect, useRef } from 'react';
import { CanvasParticleSystem } from './CanvasParticleSystem';
import { PreloaderHUD } from './PreloaderHUD';
import { HeroRevealSequence } from './HeroRevealSequence';

interface BootExperienceProps {
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BootExperience: React.FC<BootExperienceProps> = ({ onComplete, className, style }) => {
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  const duration = 8.0;
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const hasTriggeredComplete = useRef<boolean>(false);

  // Main animation clock loop driving the timeline
  useEffect(() => {
    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + delta;
        return next >= duration ? duration : next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration]);

  // Trigger completion callback when timeline reaches duration
  useEffect(() => {
    if (currentTime >= duration && !hasTriggeredComplete.current) {
      hasTriggeredComplete.current = true;
      if (onComplete) onComplete();
    }
  }, [currentTime, duration, onComplete]);

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden bg-[#06080B] text-white selection:bg-[#50A7D8] ${className || ''}`}
      style={style}
    >
      
      {/* 1. Background Depth - Large Soft Upper Radial Gradient (1200px radius at 50% 35%) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(1200px circle at 50% 35%, rgba(100, 160, 255, 0.035), transparent 70%)',
        }}
      />

      {/* 2. Center Ambient Light - Extremely Subtle Radial Illumination Behind Logo (700px radius at 50% 50%) */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(700px circle at 50% 50%, rgba(80, 170, 255, 0.08), transparent 70%)',
        }}
      />

      {/* 3. Vignette Layer - 55% Opacity Edge Darkening & Light Falloff for Pure OLED Depth */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />

      {/* 4. Fine Film Grain Noise Layer (Opacity 2%, Soft Light) to Eliminate Color Banding */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none z-[2] opacity-[0.02]"
        style={{ mixBlendMode: 'soft-light' }}
      >
        <filter id="oledNoiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#oledNoiseFilter)" />
      </svg>

      {/* Phase 1: Preloader HUD (0s to 2.2s) */}
      <PreloaderHUD currentTime={currentTime} />

      {/* Canvas Particle Layer (2,500 particles with Sky Blue & White branding) */}
      <CanvasParticleSystem
        currentTime={currentTime}
        performanceMode="high"
      />

      {/* Unified Hero Logo & Typography Reveal Sequence */}
      <HeroRevealSequence currentTime={currentTime} />

    </div>
  );
};

