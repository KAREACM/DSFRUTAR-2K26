import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mentors = [
  {
    index: '01',
    name: 'John Paul Antony',
    title: 'ASSOCIATE MANAGER — TECHNICAL LEARNING & DEVELOPMENT',
    description: 'Empowering engineers and teams through AI, Cloud, and Full Stack innovation.',
    image: '/guest/John Paul Antony.png',
    linkedin: 'https://linkedin.com',
    stats: [
      { icon: 'users', value: '7000+', label: 'Engineers Trained', num: 7000, suffix: '+' },
      { icon: 'briefcase', value: '7+', label: 'Years Experience', num: 7, suffix: '+' },
      { icon: 'code', value: '20+', label: 'Technologies', num: 20, suffix: '+' },
    ],
    tags: ['Generative AI', 'Python', 'Data Engineering', 'Cloud', 'AI/ML', 'DevOps'],
  },
  {
    index: '02',
    name: 'Rohith Amula',
    title: 'ASSOCIATE DATA ENGINEER — DE APPLIANCES, A HAIER COMPANY',
    description: 'Building data-driven solutions in the cloud that transform business outcomes.',
    image: '/guest/Rohith Amula.png',
    linkedin: 'https://linkedin.com',
    stats: [
      { icon: 'calendar', value: '5+', label: 'Years Experience', num: 5, suffix: '+' },
      { icon: 'database', value: '15+', label: 'Pipeline Projects', num: 15, suffix: '+' },
      { icon: 'award', value: '10+', label: 'Certifications', num: 10, suffix: '+' },
    ],
    tags: ['Data Engineering', 'BigQuery', 'GCP', 'Analytics'],
  },
];

const Icons = {
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.896 1.975-1.975 1.975H5.725a1.975 1.975 0 01-1.975-1.975v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 text-[#536BFF]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  ),
};

export const MentorsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });

      if (labelRef.current) {
        headerTl.fromTo(
          labelRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
      }

      if (headingRef.current) {
        headerTl.fromTo(
          headingRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.3'
        );
      }

      if (descRef.current) {
        headerTl.fromTo(
          descRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
          '-=0.4'
        );
      }

      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );

        Array.from(cards).forEach((cardEl, idx) => {
          const counters = (cardEl as Element).querySelectorAll('.gsap-counter');
          counters.forEach((counter) => {
            const targetVal = parseFloat((counter as HTMLElement).dataset.target || '0');
            const suffix = (counter as HTMLElement).dataset.suffix || '';
            const obj = { val: 0 };

            gsap.to(obj, {
              val: targetVal,
              duration: 1.8,
              delay: idx * 0.14 + 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
              },
              onUpdate: () => {
                counter.innerHTML = `${Math.floor(obj.val)}${suffix}`;
              },
            });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const descText =
    'Our mentors bring decades of industry experience and a passion for innovation to help you build solutions that create real impact.';

  return (
    <section
      id="guests"
      ref={sectionRef}
      className="relative w-full bg-[#040612] text-white py-[60px] sm:py-[85px] lg:py-[105px] px-4 sm:px-8 lg:px-[80px] font-space overflow-hidden border-t border-b border-[#182544]/60 select-none"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[130px] opacity-70 animate-mesh-3"
          style={{
            background:
              'radial-gradient(circle, rgba(83, 107, 255, 0.28) 0%, rgba(66, 86, 246, 0.18) 45%, rgba(5, 8, 20, 0) 80%)',
          }}
        />
        <div
          className="absolute top-[15%] left-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-60 animate-mesh-1"
          style={{
            background:
              'radial-gradient(circle, rgba(79, 126, 255, 0.25) 0%, rgba(66, 86, 246, 0.14) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[150px] opacity-55 animate-mesh-2"
          style={{
            background:
              'radial-gradient(circle, rgba(96, 136, 255, 0.22) 0%, rgba(56, 72, 224, 0.16) 55%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #4F7EFF 1px, transparent 1px), linear-gradient(to bottom, #4F7EFF 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center text-center mb-[36px] sm:mb-[48px] lg:mb-[56px]">
          <div ref={labelRef} className="flex items-center justify-center gap-3 mb-2.5">
            <div className="w-[24px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
            <span className="text-[10px] sm:text-[12px] font-semibold tracking-[0.35em] text-[#A6C0FF] uppercase font-space">
              MEET OUR MENTORS & GUESTS
            </span>
            <div className="w-[24px] sm:w-[60px] h-[1px] bg-[#4F7EFF]/40" />
          </div>

          <h2
            ref={headingRef}
            className="text-[28px] sm:text-[42px] lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.12] mb-3 font-space"
          >
            Experience.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#536BFF] via-[#4F7EFF] to-[#92A9FF]">
              Perspective.
            </span>{' '}
            Impact.
          </h2>

          <p
            ref={descRef}
            className="text-[14px] sm:text-[17px] font-normal text-[#C5D5F8] leading-[1.6] max-w-[680px] mx-auto font-space px-2"
          >
            {descText}
          </p>
        </div>

        {/* Portfolio / Mentor Cards Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {mentors.map((mentor, index) => (
            <div
              key={index}
              className="group relative rounded-[22px] transition-all duration-300 border overflow-hidden flex flex-col sm:flex-row bg-[#07091C]/75 border-white/12 hover:bg-[#07091C]/95 hover:border-[#536BFF]/60 hover:shadow-[0_12px_40px_rgba(83,107,255,0.25)]"
            >
              {/* Top Inner Highlight Line matching FAQ Active State */}
              <div
                className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(83,107,255,0.95) 50%, transparent 100%)',
                }}
              />

              {/* Left Side: Responsive Portrait Image */}
              <div className="relative w-full sm:w-[42%] h-[250px] xs:h-[280px] sm:h-auto min-h-[220px] overflow-hidden bg-[#040612] shrink-0">
                {/* Index / Guest Pill */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 px-3 py-1 rounded-xl transition-all duration-300 border backdrop-blur-md bg-[#040612]/75 text-white/80 border-white/15 group-hover:bg-[#536BFF] group-hover:text-white group-hover:border-[#536BFF] group-hover:shadow-[0_0_16px_rgba(83,107,255,0.6)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#536BFF] group-hover:bg-white transition-colors duration-300" />
                  <span className="text-[10px] sm:text-[11px] font-bold font-space uppercase tracking-wider">
                    GUEST {mentor.index}
                  </span>
                </div>

                {/* Portrait Image */}
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Smooth Edge Blend */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07091C] via-[#07091C]/25 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:via-[#07091C]/40 sm:to-[#07091C] pointer-events-none" />
              </div>

              {/* Right Side: Details & Stats */}
              <div className="w-full sm:w-[58%] p-5 sm:p-6 flex flex-col justify-between relative z-10">
                <div>
                  {/* Top Header Row: Name & LinkedIn Button */}
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <h3 className="text-white font-space font-extrabold text-[19px] sm:text-[22px] tracking-tight leading-tight group-hover:text-white transition-colors duration-200">
                      {mentor.name}
                    </h3>

                    {/* LinkedIn Button */}
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white border border-white/20 hover:scale-110 active:scale-95 transition-all duration-200 shrink-0 shadow-[0_0_14px_rgba(83,107,255,0.45)] group-hover:shadow-[0_0_18px_rgba(83,107,255,0.75)]"
                      style={{
                        background: 'linear-gradient(180deg, #536BFF 0%, #4256F6 100%)',
                      }}
                      title={`Connect with ${mentor.name}`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  </div>

                  {/* Job Title */}
                  <p className="text-[#4F7EFF] font-space text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase mb-2 leading-snug">
                    {mentor.title}
                  </p>

                  {/* Description */}
                  <p className="text-[#C5D5F8]/85 font-space text-[13px] sm:text-[14px] leading-relaxed mb-3">
                    {mentor.description}
                  </p>
                </div>

                {/* Middle: Stats Grid */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-3 my-1.5 border-t border-b border-white/10 group-hover:border-white/18 transition-colors duration-300">
                  {mentor.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex items-center gap-1 text-[#536BFF] mb-0.5">
                        {Icons[stat.icon as keyof typeof Icons]}
                        <span className="font-space text-white font-extrabold text-[14px] sm:text-[16px] leading-none">
                          <span className="gsap-counter" data-target={stat.num} data-suffix={stat.suffix}>
                            {stat.value}
                          </span>
                        </span>
                      </div>
                      <span className="text-[#A6C0FF]/75 font-space text-[9px] sm:text-[10px] uppercase tracking-[0.08em] font-semibold leading-tight">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom: Expertise Tags */}
                <div className="pt-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-[#536BFF]/12 border border-[#536BFF]/30 text-[#8EA6FF] font-space text-[10px] sm:text-[11px] font-semibold tracking-wide transition-all duration-300 group-hover:border-[#536BFF]/50 hover:!bg-[#536BFF] hover:!text-white hover:!border-[#536BFF] hover:shadow-[0_0_12px_rgba(83,107,255,0.4)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
