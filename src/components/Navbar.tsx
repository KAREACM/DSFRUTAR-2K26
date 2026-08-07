import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isVisible?: boolean;
  onRegisterClick?: () => void;
  onHomeClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isVisible = true, onRegisterClick, onHomeClick }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const navBtnRef = useRef<HTMLButtonElement>(null);

  const navItems = ['Home', 'About', 'Guests', 'Prize', 'FAQ', 'Contact'];

  const handleNavBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = navBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleNavBtnMouseLeave = () => {
    const btn = navBtnRef.current;
    if (!btn) return;
    btn.style.setProperty('--mouse-x', '50%');
    btn.style.setProperty('--mouse-y', '50%');
  };

  // Scroll position listener for active tab highlighting and header background shift
  useEffect(() => {
    let ticking = false;

    const updateActiveTab = () => {
      const isScrolled = window.scrollY > 25;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));

      // 1. Check if user has scrolled near the bottom of the page -> set Contact active
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (window.scrollY + windowHeight >= documentHeight - 80) {
        setActiveTab('Contact');
        ticking = false;
        return;
      }

      const scrollPos = window.scrollY + 140;
      const sections = ['home', 'about', 'guests', 'prizes', 'prize', 'faq', 'contact'];

      for (const sectionId of sections) {
        const elem = document.getElementById(sectionId);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            let tabName = 'Home';
            if (sectionId === 'prizes' || sectionId === 'prize') {
              tabName = 'Prize';
            } else if (sectionId === 'faq') {
              tabName = 'FAQ';
            } else if (sectionId === 'contact') {
              tabName = 'Contact';
            } else {
              tabName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            }
            setActiveTab((prev) => (prev !== tabName ? tabName : prev));
            break;
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveTab);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveTab();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation using GSAP with clearProps
  useEffect(() => {
    if (!isVisible || !headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.7, 
        ease: 'power3.out', 
        delay: 0.1,
        clearProps: 'transform' 
      }
    );
  }, [isVisible]);

  const handleNavClick = (item: string) => {
    setActiveTab(item);
    setMobileMenuOpen(false);
    onHomeClick?.();

    const targetId = item.toLowerCase();
    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const elem = document.getElementById(targetId);
    if (elem) {
      const yOffset = -85; // navbar height offset
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  return (
    <header 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'py-2 sm:py-2.5 bg-[#040612]/92 backdrop-blur-[20px] border-b border-[#18233C]/60 shadow-[0_10px_36px_rgba(0,0,0,0.8)] pointer-events-auto'
          : 'pt-3 sm:pt-4 pb-0 bg-transparent border-b border-transparent shadow-none pointer-events-none'
      }`}
    >
      <nav
        className={`w-full max-w-[1000px] mx-auto h-[48px] sm:h-[52px] px-4 sm:px-6 rounded-full flex items-center justify-between transition-colors duration-300 border ${
          scrolled
            ? 'bg-transparent border-transparent shadow-none'
            : 'pointer-events-auto bg-[#07091C]/85 backdrop-blur-[16px] border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        }`}
      >
        {/* Left Side: Logo Emblem & Chapter Details */}
        <div 
          className="flex items-center gap-2.5 sm:gap-3 select-none cursor-pointer"
          onClick={() => {
            onHomeClick?.();
            handleNavClick('Home');
          }}
        >
          <div className="flex flex-col justify-center leading-none">
            <span className="text-[13px] sm:text-[14px] text-white font-space font-bold tracking-[0.14em]">
              DISFRUTAR
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#4F7EFF] font-space font-semibold tracking-[0.16em] mt-0.5">
              2K26
            </span>
          </div>
          <div className="hidden xl:block w-[1px] h-[22px] bg-white/12 mx-1" />
          <div className="hidden xl:flex flex-col justify-center text-[10px] text-white/60 font-space leading-tight">
            <span className="text-white/45">Organized by</span>
            <span className="text-white/90 font-medium">KARE ACM Student Chapter</span>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-5 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`relative text-[13px] lg:text-[14px] font-medium tracking-wide transition-colors duration-200 cursor-pointer py-1 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#F4F7FF]/70 hover:text-white'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#4F7EFF] shadow-[0_0_10px_#4F7EFF]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Side: Register CTA & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Register CTA Capsule */}
          <button
            ref={navBtnRef}
            onMouseMove={handleNavBtnMouseMove}
            onMouseLeave={handleNavBtnMouseLeave}
            onClick={onRegisterClick}
            className="group relative w-[115px] sm:w-[140px] md:w-[155px] h-[34px] sm:h-[38px] md:h-[40px] rounded-full text-white font-semibold text-[11px] sm:text-[13px] md:text-[14px] tracking-[0.01em] flex items-center justify-center gap-1.5 cursor-pointer overflow-hidden border border-white/18 transition-transform duration-300 hover:scale-[1.04] active:scale-[0.96]"
            style={{
              background:
                'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.20) 0%, transparent 60%), linear-gradient(180deg, #536BFF 0%, #4256F6 100%)',
              boxShadow:
                '0 0 12px rgba(95,125,255,0.45), 0 0 28px rgba(95,125,255,0.30), 0 0 60px rgba(95,125,255,0.15)',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-white opacity-25 blur-[1px] pointer-events-none" />
            <span className="relative z-10 font-space">Register Now</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-[36px] h-[36px] rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/18 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Glass Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto w-full max-w-[1000px] mx-auto mt-2 p-4 rounded-[20px] bg-[#040612]/95 backdrop-blur-[28px] border border-white/18 shadow-[0_16px_48px_rgba(0,0,0,0.8)] md:hidden flex flex-col gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = activeTab === item;
            return (
              <button
                key={item}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-4 py-2.5 rounded-[12px] text-[14px] font-medium font-space transition-colors ${
                  isActive
                    ? 'bg-[#4F7EFF]/20 text-white font-semibold border border-[#4F7EFF]/40'
                    : 'text-[#F4F7FF]/80 hover:bg-white/8 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

