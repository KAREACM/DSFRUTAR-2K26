import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, CheckCircle2, ArrowLeft, ExternalLink, Sparkles, Bell, Calendar, MapPin, Trophy } from 'lucide-react';

interface WhatsAppStepProps {
  onReturnToDashboard: () => void;
}

const WhatsAppStepComponent: React.FC<WhatsAppStepProps> = ({
  onReturnToDashboard,
}) => {
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    window.open('https://chat.whatsapp.com/CT6etElQq8g1rNMuLMAVEq?s=cl&p=i&ilr=0', '_blank');
    setJoined(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 gpu-accelerate">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#07091C]/80 border border-[#25D366]/40 rounded-[28px] p-8 sm:p-10 backdrop-blur-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.85)] text-center space-y-6 relative overflow-hidden gpu-accelerate registration-card"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#25D366]/70 to-transparent blur-[0.5px]" />

        {/* WhatsApp Icon Circle */}
        <div className="w-20 h-20 rounded-full bg-[#25D366]/15 border-2 border-[#25D366]/40 flex items-center justify-center text-[#25D366] mx-auto shadow-[0_0_40px_rgba(37,211,102,0.3)] gpu-accelerate">
          <MessageCircle className="w-10 h-10" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#25D366] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 inline-block">
            Official Community Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
            Stay Updated & Connected
          </h2>
          <p className="text-white/60 text-xs sm:text-sm font-sans max-w-md mx-auto">
            Join the official DISFRUTAR 2K26 WhatsApp group for live announcements and team mentorship.
          </p>
        </div>

        {/* Benefits List */}
        <div className="p-5 rounded-[20px] bg-white/[0.03] border border-white/10 text-left space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#25D366] font-bold block">
            What You Will Receive:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-sans text-white/80">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <Sparkles className="w-4 h-4 text-[#8DA2FF] shrink-0" />
              <span>Bootcamp Updates</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <MapPin className="w-4 h-4 text-[#8DA2FF] shrink-0" />
              <span>Venue & Desk Details</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <Calendar className="w-4 h-4 text-[#8DA2FF] shrink-0" />
              <span>Hackathon Schedule</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03]">
              <Bell className="w-4 h-4 text-[#8DA2FF] shrink-0" />
              <span>Live Announcements</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] sm:col-span-2">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Evaluation & Results</span>
            </div>
          </div>
        </div>

        {/* Join WhatsApp Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleJoin}
            className="w-full h-[50px] rounded-full bg-gradient-to-r from-[#25D366] to-[#1DA851] text-white font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_24px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join WhatsApp Group</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {joined && (
            <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Joined Official WhatsApp Community
            </p>
          )}
        </div>

        {/* Return to Dashboard Button */}
        <div className="pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onReturnToDashboard}
            className="w-full h-[46px] rounded-full border border-white/14 bg-white/5 text-white font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal Dashboard</span>
          </button>
        </div>

      </motion.div>

    </div>
  );
};

export const WhatsAppStep = React.memo(WhatsAppStepComponent);
