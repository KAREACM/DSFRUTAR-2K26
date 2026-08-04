import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Activity, Cpu } from 'lucide-react';

interface PreloaderHUDProps {
  currentTime: number; // 0.0s to 8.0s
}

export const PreloaderHUD: React.FC<PreloaderHUDProps> = ({ currentTime }) => {
  if (currentTime > 2.4) return null;

  const preloaderDuration = 2.2;
  const progressPercent = Math.min(100, Math.floor((currentTime / preloaderDuration) * 100));

  // Smooth fade out as preloader reaches 2.2s
  const opacity = currentTime >= 1.8 ? Math.max(0, 1 - (currentTime - 1.8) / 0.4) : 1;

  // Status log telemetry text based on progress milestone
  let statusText = 'INITIALIZING DISFRUTAR-OS KERNEL v2.26...';
  if (progressPercent > 35 && progressPercent <= 70) {
    statusText = 'ALLOCATING KARE ACM PARTICLE MATRIX [2500 PTS]...';
  } else if (progressPercent > 70) {
    statusText = 'SYNCHRONIZING VECTOR GEOMETRY...';
  }

  // SVG ring stroke calculations
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 flex flex-col items-center justify-center p-4 transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Central Concentric Tech HUD HUD Ring */}
      <div className="relative flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64">
        
        {/* SVG Radial Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
          {/* Background Track Ring */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-[#50A7D8]/15"
            strokeWidth="3"
            fill="transparent"
          />
          {/* Active Progress Ring */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="stroke-[#50A7D8] transition-all duration-150 ease-out"
            strokeWidth="3.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Outer Counter-Rotating Dash Decorative Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border border-dashed border-[#50A7D8]/25"
        />

        {/* Inner Rotating Segmented Tech Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-5 rounded-full border border-[#50A7D8]/30 border-t-[#50A7D8] border-r-transparent"
        />

        {/* Ambient Radial Core Glow */}
        <div className="absolute inset-10 rounded-full bg-radial from-[#50A7D8]/25 via-[#50A7D8]/5 to-transparent blur-lg" />

        {/* Center Percentage Number */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 mb-1.5 text-[#50A7D8] text-[11px] font-mono font-semibold uppercase tracking-[0.25em]">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#50A7D8]" />
            <span>KARE ACM</span>
          </div>

          <div className="flex items-baseline justify-center">
            <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#70C5F5] drop-shadow-[0_0_20px_rgba(80,167,216,0.8)]">
              {progressPercent.toString().padStart(2, '0')}
            </span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-[#50A7D8] ml-1">
              %
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Telemetry Status Bar */}
      <div className="mt-8 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/60 border border-[#50A7D8]/30 backdrop-blur-md shadow-2xl">
        <Terminal className="w-3.5 h-3.5 text-[#50A7D8] animate-pulse" />
        <span className="text-xs font-mono tracking-wider text-white/90">
          {statusText}
        </span>
      </div>
    </div>
  );
};
