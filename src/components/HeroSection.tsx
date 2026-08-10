import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CalendarDays, MapPinned, UsersRound, Clock3 } from 'lucide-react';
import gsap from 'gsap';

interface HeroSectionProps {
  isVisible?: boolean;
  onRegisterClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isVisible = true, onRegisterClick }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const lineLeftRef = useRef<HTMLDivElement>(null);
  const lineRightRef = useRef<HTMLDivElement>(null);
  const presenterTextRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const eventTitleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  const titleText = "DISFRUTAR";

  const handleCtaBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCtaBtnMouseLeave = () => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    btn.style.setProperty('--mouse-x', '50%');
    btn.style.setProperty('--mouse-y', '50%');
  };

  useEffect(() => {
    if (!isVisible || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Initial state reset
      gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0, opacity: 0 });
      gsap.set(presenterTextRef.current, { opacity: 0, y: 10 });
      gsap.set('.char-letter', { y: 30, opacity: 0, filter: isMobile ? 'none' : 'blur(10px)', scale: 0.95 });
      gsap.set(yearRef.current, { scale: 0.8, opacity: 0, filter: isMobile ? 'none' : 'blur(8px)' });
      gsap.set([eventTitleRef.current, taglineRef.current], { y: 20, opacity: 0 });
      gsap.set(cardRef.current, { y: 30, opacity: 0, scale: 0.97 });
      gsap.set(ctaRef.current, { y: 20, opacity: 0 });

      // 1. KARE ACM Decorative Lines Expand & Text Fade
      tl.to([lineLeftRef.current, lineRightRef.current], {
        scaleX: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1
      }, 0.1)
        .to(presenterTextRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4
        }, "-=0.3");

      // 2. DISFRUTAR Character Stagger Revelation
      tl.to('.char-letter', {
        y: 0,
        opacity: 1,
        filter: isMobile ? 'none' : 'blur(0px)',
        scale: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: 'back.out(1.2)'
      }, "-=0.2");

      // 3. 2K26 Subtitle Year Scale & Glow Burst
      tl.to(yearRef.current, {
        scale: 1,
        opacity: 1,
        filter: isMobile ? 'none' : 'blur(0px)',
        duration: 0.6,
        ease: 'back.out(1.5)'
      }, "-=0.3");

      // 4. Event Title & Tagline Rise
      tl.to(eventTitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.5
      }, "-=0.2")
        .to(taglineRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4
        }, "-=0.3");

      // 5. Glass Information Card Rise & Scale
      tl.to(cardRef.current, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out'
      }, "-=0.2");

      // 6. Register CTA Button Scale-In with Fade Upward
      tl.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, "+=0.08");

    }, heroRef);

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <section
      id="home"
      ref={heroRef}
      className={`relative h-screen w-full text-white flex flex-col items-center justify-between font-space overflow-hidden selection:bg-[#4D7CFF] selection:text-white transition-opacity duration-500 ease-out pt-[54px] sm:pt-[60px] md:pt-[64px] pb-4 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      style={{
        backgroundColor: '#050814',
        backgroundImage: "url('/images/hero_secction_bg.png'), url('/hero_secction_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark vignette overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050814]/50 via-transparent to-[#050814]/90 pointer-events-none z-0" />

      {/* Main Hero Content Area - Rhythmic Vertical Spacing (Max Width 1180px) */}
      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 flex-1 flex flex-col items-center justify-center text-center my-auto py-1">

        {/* KARE ACM Presenter Header (Nav -> 54px gap on desktop, reduced to fit without scroll) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 md:mt-[24px] mb-2 sm:mb-3 md:mb-[20px]">
          <div ref={lineLeftRef} className="w-[32px] sm:w-[48px] md:w-[64px] h-[1px] bg-[#4F7EFF] origin-right" />
          <span
            ref={presenterTextRef}
            className="text-[9px] sm:text-[11px] md:text-[12px] lg:text-[13px] font-medium tracking-[0.24em] sm:tracking-[0.36em] md:tracking-[0.42em] text-white/88 uppercase font-space"
          >
            KARE ACM STUDENT CHAPTER PRESENTS
          </span>
          <div ref={lineRightRef} className="w-[32px] sm:w-[48px] md:w-[64px] h-[1px] bg-[#4F7EFF] origin-left" />
        </div>

        {/* Main Display Title: DISFRUTAR (Tracking 0.34em, slightly scaled to prevent scroll) */}
        <h1
          ref={titleRef}
          className="font-space font-bold text-white tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.34em] leading-none mb-1.5 sm:mb-2 md:mb-[12px] select-none text-[32px] sm:text-[52px] md:text-[72px] lg:text-[84px] xl:text-[96px] flex items-center justify-center overflow-hidden"
          style={{
            color: '#F8FAFF',
            textShadow: '0 0 12px rgba(255,255,255,0.08)',
          }}
        >
          {titleText.split('').map((char, index) => (
            <span key={index} className="char-letter inline-block">
              {char}
            </span>
          ))}
        </h1>

        {/* Subtitle Year: 2K26 (Refined #4F7EFF Bloom & 0.30em tracking) */}
        <div
          ref={yearRef}
          className="font-space font-semibold text-[#4F7EFF] tracking-[0.24em] sm:tracking-[0.28em] md:tracking-[0.30em] leading-tight mb-2.5 sm:mb-3 md:mb-[18px] text-[22px] sm:text-[32px] md:text-[40px] lg:text-[46px]"
          style={{
            textShadow: '0 0 8px rgba(79,126,255,0.55), 0 0 18px rgba(79,126,255,0.45), 0 0 36px rgba(79,126,255,0.28)',
          }}
        >
          2K26
        </div>

        {/* Event Title: 32-HOUR AI HACKATHON */}
        <h2
          ref={eventTitleRef}
          className="font-space font-normal text-white tracking-[0.16em] sm:tracking-[0.20em] md:tracking-[0.24em] uppercase mb-1.5 sm:mb-2 md:mb-[10px] text-[13px] sm:text-[17px] md:text-[21px] lg:text-[24px]"
        >
          32-HOUR AI HACKATHON
        </h2>

        {/* Tagline: THINK • BUILD • INNOVATE */}
        <p
          ref={taglineRef}
          className="font-space font-medium tracking-[0.32em] sm:tracking-[0.44em] md:tracking-[0.55em] text-[#FFFFFF]/52 text-[10px] sm:text-[11px] md:text-[12px] uppercase leading-tight mb-4 sm:mb-5 md:mb-[24px]"
        >
          THINK &bull; BUILD &bull; INNOVATE
        </p>

        {/* Information Glass Card with 4 Luminous Corner Radial Lights & Dark Surface */}
        <div
          ref={cardRef}
          className="relative w-full max-w-[1042px] min-h-[58px] md:h-[68px] rounded-[18px] backdrop-blur-[22px] grid grid-cols-2 lg:grid-cols-4 overflow-hidden mb-4 sm:mb-5 md:mb-[24px] energy-border shadow-none"
        >
          {/* 4 Corner Radial Corner Lights (20px radius, #4F7EFF, 70% opacity, 22px blur) */}
          <div className="absolute -top-[10px] -left-[10px] w-[40px] h-[40px] rounded-full bg-[#4F7EFF] opacity-[0.70] blur-[22px] pointer-events-none z-10 animate-corner-1" />
          <div className="absolute -top-[10px] -right-[10px] w-[40px] h-[40px] rounded-full bg-[#4F7EFF] opacity-[0.70] blur-[22px] pointer-events-none z-10 animate-corner-2" />
          <div className="absolute -bottom-[10px] -left-[10px] w-[40px] h-[40px] rounded-full bg-[#4F7EFF] opacity-[0.70] blur-[22px] pointer-events-none z-10 animate-corner-3" />
          <div className="absolute -bottom-[10px] -right-[10px] w-[40px] h-[40px] rounded-full bg-[#4F7EFF] opacity-[0.70] blur-[22px] pointer-events-none z-10 animate-corner-4" />

          {/* Column 1: Date */}
          <div className="flex items-center justify-center gap-2.5 py-1.5 sm:py-2 px-3 relative">
            <CalendarDays
              className="w-[20px] h-[20px] text-[#4F7EFF] shrink-0 stroke-[2]"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,126,255,0.55))' }}
            />
            <span className="text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-[22px] tracking-[0.01em] text-white/95 whitespace-nowrap">
              15 AUGUST 2026
            </span>
            {/* Divider Line (Vertical) */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[40px] bg-white/8" />
          </div>

          {/* Column 2: Location */}
          <div className="flex items-center justify-center gap-2.5 py-1.5 sm:py-2 px-3 relative">
            <MapPinned
              className="w-[20px] h-[20px] text-[#4F7EFF] shrink-0 stroke-[2]"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,126,255,0.55))' }}
            />
            <span className="text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-[22px] tracking-[0.01em] text-white/95 whitespace-nowrap">
              KALASALINGAM UNIVERSITY
            </span>
            {/* Divider Line (Vertical) */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[40px] bg-white/8" />
          </div>

          {/* Column 3: Team Size */}
          <div className="flex items-center justify-center gap-2.5 py-1.5 sm:py-2 px-3 relative">
            <UsersRound
              className="w-[20px] h-[20px] text-[#4F7EFF] shrink-0 stroke-[2]"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,126,255,0.55))' }}
            />
            <span className="text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-[22px] tracking-[0.01em] text-white/95 whitespace-nowrap">
              3–4 MEMBERS
            </span>
            {/* Divider Line (Vertical) */}
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[40px] bg-white/8" />
          </div>

          {/* Column 4: Duration */}
          <div className="flex items-center justify-center gap-2.5 py-1.5 sm:py-2 px-3">
            <Clock3
              className="w-[20px] h-[20px] text-[#4F7EFF] shrink-0 stroke-[2]"
              style={{ filter: 'drop-shadow(0 0 6px rgba(79,126,255,0.55))' }}
            />
            <span className="text-[13px] sm:text-[14px] md:text-[15px] font-medium leading-[22px] tracking-[0.01em] text-white/95 whitespace-nowrap">
              32 HOURS
            </span>
          </div>
        </div>

        {/* Primary Hero CTA Button: Register for DISFRUTAR 2K26 */}
        <div ref={ctaRef} className="mb-2 sm:mb-3 md:mb-4">
          <button
            ref={ctaBtnRef}
            onMouseMove={handleCtaBtnMouseMove}
            onMouseLeave={handleCtaBtnMouseLeave}
            onClick={onRegisterClick}
            className="group relative w-[280px] sm:w-[350px] md:w-[410px] h-[48px] sm:h-[56px] md:h-[62px] rounded-[999px] text-white font-semibold text-[14px] sm:text-[16px] md:text-[18px] tracking-normal flex items-center justify-center gap-3 cursor-pointer overflow-hidden border border-white/14 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(180deg, #536BFF 0%, #4256F6 100%)',
              boxShadow: '0 0 12px rgba(91,120,255,0.55), 0 0 28px rgba(91,120,255,0.40), 0 0 58px rgba(91,120,255,0.22), inset 0 1px 1px rgba(255,255,255,0.18), inset 0 0 18px rgba(255,255,255,0.10)',
            }}
          >
            {/* Top Edge Soft Highlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-white opacity-20 blur-[1px] pointer-events-none" />

            <span className="relative z-10 font-space font-semibold">Register for DISFRUTAR 2K26</span>
            <ArrowRight className="relative z-10 w-4 h-4 md:w-5 md:h-5 stroke-[2]" />
          </button>
        </div>

      </main>
    </section>
  );
};
