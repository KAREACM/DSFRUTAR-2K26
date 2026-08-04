import React, { useEffect, useRef } from 'react';
import { Rocket, Users, Lightbulb, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLDivElement>(null);
  const howItWorksLineRef = useRef<HTMLDivElement>(null);
  const stepNodesRef = useRef<HTMLDivElement>(null);
  const trustGalleryRef = useRef<HTMLDivElement>(null);
  const rocketCountRef = useRef<HTMLSpanElement>(null);
  const satCountRef = useRef<HTMLSpanElement>(null);
  const rocketIconRef = useRef<HTMLDivElement>(null);
  const usersIconRef = useRef<HTMLDivElement>(null);

  const descText =
    "DISFRUTAR 2K26 is more than a hackathon — it's a movement to empower the next generation of innovators. We bring together curiosity, creativity, and technology to build solutions that shape a better tomorrow.";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Reveal Timeline
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      // Label Line & Text
      headerTl
        .fromTo(
          labelRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        )
        // Heading Word Slide Up
        .fromTo(
          headingRef.current?.querySelectorAll('.heading-word') || [],
          { y: '100%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        // Description Word Stagger Reveal (Apple-style word mask)
        .fromTo(
          descRef.current?.querySelectorAll('.desc-word') || [],
          { y: '110%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.5,
            stagger: 0.012,
            ease: 'power3.out',
          },
          '-=0.4'
        );

      // 2. Timeline Row Animation (Sequential left to right)
      if (timelineRef.current) {
        const items = timelineRef.current.querySelectorAll('.timeline-item');
        const lines = timelineRef.current.querySelectorAll('.timeline-separator');

        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
            },
          }
        );

        gsap.fromTo(
          lines,
          { opacity: 0, scaleY: 0 },
          {
            opacity: 1,
            scaleY: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 3. Cards Entrance Animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 78%',
            },
          }
        );
      }

      // 4. Left Image Clip-Path / Reveal
      if (leftImageRef.current) {
        gsap.fromTo(
          leftImageRef.current,
          { clipPath: 'inset(0 100% 0 0)', scale: 1.06 },
          {
            clipPath: 'inset(0 0 0 0)',
            scale: 1,
            duration: 1.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: leftImageRef.current,
              start: 'top 75%',
            },
          }
        );
      }

      // 5. How It Works Vertical Line & Steps Animation
      if (howItWorksLineRef.current && stepNodesRef.current) {
        const steps = stepNodesRef.current.children;

        // Line growth
        gsap.fromTo(
          howItWorksLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stepNodesRef.current,
              start: 'top 75%',
            },
          }
        );

        // Individual steps pop in sequence
        Array.from(steps).forEach((stepNode, idx) => {
          const step = stepNode as HTMLElement;
          const badge = step.querySelector('.step-badge');
          const title = step.querySelector('.step-title');
          const desc = step.querySelector('.step-desc');

          const stepTl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 82%',
            },
          });

          if (badge) {
            stepTl.fromTo(
              badge,
              { scale: 0.5, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' },
              idx * 0.08
            );
          }
          if (title) {
            stepTl.fromTo(
              title,
              { x: 15, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
              '-=0.25'
            );
          }
          if (desc) {
            stepTl.fromTo(
              desc,
              { opacity: 0, y: 8 },
              { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' },
              '-=0.25'
            );
          }
        });
      }

      // 6. Right Card Gallery Reveal
      if (trustGalleryRef.current) {
        const thumbnails = trustGalleryRef.current.children;
        gsap.fromTo(
          thumbnails,
          { opacity: 0, scale: 0.93, y: 12 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.07,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trustGalleryRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 7. Stats Count-Up & Icon Rotation
      const statsObj = { count1: 0, count2: 0 };
      gsap.to(statsObj, {
        count1: 50,
        count2: 100,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 70%',
        },
        onUpdate: () => {
          if (rocketCountRef.current) {
            rocketCountRef.current.textContent = `${Math.floor(statsObj.count1)}+`;
          }
          if (satCountRef.current) {
            satCountRef.current.textContent = `${Math.floor(statsObj.count2)}%`;
          }
        },
      });

      if (rocketIconRef.current && usersIconRef.current) {
        gsap.fromTo(
          [rocketIconRef.current, usersIconRef.current],
          { rotate: -12, scale: 0.8 },
          {
            rotate: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.5)',
            stagger: 0.12,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 70%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timelineEvents = [
    {
      number: '15',
      month: 'AUGUST',
      title: 'Bootcamps Begin',
      description: 'Kickstart your learning journey',
    },
    {
      number: '29',
      month: 'AUGUST',
      title: 'Bootcamps Continue',
      description: 'Offline workshops & sessions',
    },
    {
      number: '4 – 5',
      month: 'SEPTEMBER',
      title: 'Hackathon',
      description: '32-Hour Innovation Sprint',
    },
    {
      number: '₹350',
      month: '',
      title: 'Event Registration',
      description: 'Selected participants may get internship opportunities',
    },
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Learn',
      description: 'Attend online & offline bootcamps from industry experts.',
    },
    {
      step: '02',
      title: 'Build',
      description: 'Collaborate, ideate, and build innovative solutions.',
    },
    {
      step: '03',
      title: 'Pitch',
      description: 'Present your ideas to mentors and industry leaders.',
    },
    {
      step: '04',
      title: 'Grow',
      description: 'Top teams get recognition and internship opportunities.',
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-[#040612] text-white py-[90px] lg:py-[115px] px-5 sm:px-10 lg:px-[80px] font-space overflow-hidden border-t border-b border-[#182544]/60 select-none"
    >
      {/* Dynamic Animated Ambient Mesh Background (Register Button Palette) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Luminous Top Central Glow Core */}
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[130px] opacity-70 animate-mesh-3"
          style={{
            background: 'radial-gradient(circle, rgba(83, 107, 255, 0.28) 0%, rgba(66, 86, 246, 0.18) 45%, rgba(5, 8, 20, 0) 80%)'
          }}
        />

        {/* Floating Orb 1 - Vibrant Electric Blue (Left) */}
        <div 
          className="absolute top-[15%] left-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-60 animate-mesh-1"
          style={{
            background: 'radial-gradient(circle, rgba(79, 126, 255, 0.25) 0%, rgba(66, 86, 246, 0.14) 50%, transparent 75%)'
          }}
        />

        {/* Floating Orb 2 - Deep Indigo Cyan Glow (Right) */}
        <div 
          className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[150px] opacity-55 animate-mesh-2"
          style={{
            background: 'radial-gradient(circle, rgba(96, 136, 255, 0.22) 0%, rgba(56, 72, 224, 0.16) 55%, transparent 80%)'
          }}
        />

        {/* Ambient Ethereal Light Beam Sweep */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-[100%] blur-[160px] opacity-30 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(83,107,255,0.2) 0%, rgba(79,126,255,0.15) 50%, rgba(66,86,246,0.05) 100%)'
          }}
        />

        {/* Subtle Diagonal Grid Overlay for Tech Texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #4F7EFF 1px, transparent 1px), linear-gradient(to bottom, #4F7EFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-[52px] lg:mb-[64px]">
          {/* Small Decorative Label */}
          <div
            ref={labelRef}
            className="flex items-center justify-center gap-3.5 mb-3"
          >
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.4em] text-[#A6C0FF] uppercase">
              ABOUT DISFRUTAR 2K26
            </span>
            <div className="w-[30px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
          </div>

          {/* Main Heading with Masked Slide-up Words */}
          <h2
            ref={headingRef}
            className="text-[40px] sm:text-[50px] lg:text-[56px] font-extrabold text-white tracking-tight leading-[1.08] mb-4 overflow-hidden flex gap-3 justify-center"
          >
            <span className="inline-block overflow-hidden py-1">
              <span className="heading-word inline-block">About</span>
            </span>
            <span className="inline-block overflow-hidden py-1">
              <span className="heading-word inline-block">Us</span>
            </span>
          </h2>

          {/* Subtitle Paragraph - Word-by-Word Reveal */}
          <p
            ref={descRef}
            className="text-[16px] sm:text-[18px] lg:text-[19px] font-normal text-[#C5D5F8] leading-[1.65] max-w-[700px] mx-auto flex flex-wrap justify-center gap-x-1.5 gap-y-0.5"
          >
            {descText.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block overflow-hidden py-0.5"
              >
                <span className="desc-word inline-block">{word}</span>
              </span>
            ))}
          </p>
        </div>

        {/* Timeline Row (4 Equal Columns with 40px gap & separators) */}
        <div
          ref={timelineRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-[40px] mb-[56px] lg:mb-[64px] relative"
        >
          {timelineEvents.map((item, idx) => (
            <div
              key={idx}
              className="timeline-item relative flex flex-col justify-start pr-2 py-1"
            >
              {/* Big Number & Month */}
              <div className="flex items-baseline gap-2 mb-2 select-none">
                <span 
                  className="text-[38px] sm:text-[44px] lg:text-[48px] font-extrabold text-[#4F7EFF] leading-none tracking-tight"
                  style={{ textShadow: '0 0 14px rgba(79,126,255,0.45)' }}
                >
                  {item.number}
                </span>
                {item.month && (
                  <span className="text-[12px] lg:text-[13px] font-bold tracking-[0.18em] text-[#4F7EFF] uppercase">
                    {item.month}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-[18px] lg:text-[20px] font-semibold text-white mb-1 tracking-tight">
                {item.title}
              </h3>

              {/* Subtitle Description */}
              <p className="text-[13px] lg:text-[14px] text-[#A2B6DE] font-normal leading-relaxed">
                {item.description}
              </p>

              {/* Vertical Separator between cards */}
              {idx < timelineEvents.length - 1 && (
                <div className="timeline-separator hidden lg:block absolute -right-[20px] top-1/2 -translate-y-1/2 w-[1px] h-[85px] bg-white/10 origin-center" />
              )}
            </div>
          ))}
        </div>

        {/* 3 Cards Section Grid (Compact 480px height, 28px padding) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[28px] items-stretch"
        >
          {/* LEFT CARD: Photo + Bottom Stats Panel */}
          <div className="group bg-[#07091C]/80 border border-white/12 rounded-[24px] backdrop-blur-[16px] overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[5px] hover:border-[#4F7EFF]/50 hover:shadow-[0_20px_60px_rgba(79,126,255,0.18)] lg:h-[480px]">
            {/* Top Photo */}
            <div className="p-3 flex-1 flex flex-col overflow-hidden">
              <div
                ref={leftImageRef}
                className="relative w-full h-full min-h-[220px] rounded-[18px] overflow-hidden border border-white/10 shadow-sm"
              >
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                  alt="DISFRUTAR Hackathon Auditorium"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07091C]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </div>

            {/* Bottom Stats Panel (110px Height) */}
            <div className="h-[110px] grid grid-cols-2 border-t border-white/10 bg-[#050716] shrink-0">
              {/* Stat 1 */}
              <div className="flex items-center justify-center gap-3 px-3 border-r border-white/10">
                <div
                  ref={rocketIconRef}
                  className="w-[44px] h-[44px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)]"
                >
                  <Rocket className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <span
                    ref={rocketCountRef}
                    className="text-[30px] lg:text-[34px] font-extrabold text-white leading-none tracking-tight"
                  >
                    50+
                  </span>
                  <span className="text-[12px] text-[#A2B6DE] font-medium mt-1">
                    Projects Built
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center justify-center gap-3 px-3">
                <div
                  ref={usersIconRef}
                  className="w-[44px] h-[44px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)]"
                >
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex flex-col">
                  <span
                    ref={satCountRef}
                    className="text-[30px] lg:text-[34px] font-extrabold text-white leading-none tracking-tight"
                  >
                    100%
                  </span>
                  <span className="text-[11px] lg:text-[12px] text-[#A2B6DE] font-medium mt-1 leading-tight">
                    Participant Satisfaction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER CARD: How It Works */}
          <div className="group bg-[#07091C]/80 border border-white/12 rounded-[24px] p-6 lg:p-[30px] backdrop-blur-[16px] shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[5px] hover:border-[#4F7EFF]/50 hover:shadow-[0_20px_60px_rgba(79,126,255,0.18)] lg:h-[480px]">
            {/* Card Header */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-[46px] h-[46px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)]">
                <Lightbulb className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-[22px] lg:text-[25px] font-bold text-white tracking-tight">
                How It Works
              </h3>
            </div>

            {/* Vertical Timeline List */}
            <div className="relative flex-1 flex flex-col justify-between my-1">
              {/* Vertical Line */}
              <div
                ref={howItWorksLineRef}
                className="absolute left-[17px] top-[18px] bottom-[18px] w-[2px] bg-[#4F7EFF]/35 origin-top pointer-events-none"
              />

              <div ref={stepNodesRef} className="flex flex-col justify-between h-full py-0.5">
                {howItWorksSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3.5 z-10 my-0.5"
                  >
                    {/* Number Badge */}
                    <div className="step-badge w-[36px] h-[36px] rounded-full bg-[#07091C] border-2 border-[#4F7EFF] text-[#4F7EFF] font-bold text-[13px] flex items-center justify-center shrink-0 shadow-[0_0_14px_rgba(79,126,255,0.35)]">
                      {step.step}
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col pt-0.5">
                      <h4 className="step-title text-[15px] lg:text-[17px] font-semibold text-white tracking-tight leading-none mb-1">
                        {step.title}
                      </h4>
                      <p className="step-desc text-[12px] lg:text-[13px] text-[#A2B6DE] font-normal leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARD: Built on Trust */}
          <div className="group bg-[#07091C]/80 border border-white/12 rounded-[24px] p-6 lg:p-[30px] backdrop-blur-[16px] shadow-[0_16px_60px_rgba(0,0,0,0.35)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-[5px] hover:border-[#4F7EFF]/50 hover:shadow-[0_20px_60px_rgba(79,126,255,0.18)] lg:h-[480px]">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-[46px] h-[46px] rounded-full bg-[#4F7EFF]/15 border border-[#4F7EFF]/40 flex items-center justify-center text-[#4F7EFF] shrink-0 shadow-[0_0_18px_rgba(79,126,255,0.35)]">
                  <ShieldCheck className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="text-[22px] lg:text-[25px] font-bold text-white tracking-tight">
                  Built on Trust
                </h3>
              </div>

              {/* Subtitle Paragraph */}
              <p className="text-[13px] lg:text-[14px] text-[#C5D5F8] font-normal leading-relaxed mb-4">
                Our community is our strength. We ensure a transparent, inclusive,
                and high-impact experience for every participant.
              </p>
            </div>

            {/* 2x2 Image Grid Gallery */}
            <div ref={trustGalleryRef} className="grid grid-cols-2 gap-3 mt-auto">
              {/* Image 1 */}
              <div className="relative h-[95px] lg:h-[105px] rounded-[14px] overflow-hidden border border-white/10 shadow-sm group/img">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
                  alt="Hackathon Collaboration"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06]"
                />
              </div>

              {/* Image 2 */}
              <div className="relative h-[95px] lg:h-[105px] rounded-[14px] overflow-hidden border border-white/10 shadow-sm group/img">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80"
                  alt="Workshop Session"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06]"
                />
              </div>

              {/* Image 3 */}
              <div className="relative h-[95px] lg:h-[105px] rounded-[14px] overflow-hidden border border-white/10 shadow-sm group/img">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80"
                  alt="Project Presentation"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06]"
                />
              </div>

              {/* Image 4 */}
              <div className="relative h-[95px] lg:h-[105px] rounded-[14px] overflow-hidden border border-white/10 shadow-sm group/img">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
                  alt="Organizing Team"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


