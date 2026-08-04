import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, MessageCircle, Clock, Copy, ArrowRight } from 'lucide-react';
import { TeamRegistrationState } from '../../types/registration';
import { downloadReceipt } from '../../utils/generateReceipt';

interface SubmittedStepProps {
  state: TeamRegistrationState;
  onNext: () => void;
}

export const SubmittedStep: React.FC<SubmittedStepProps> = ({
  state,
  onNext,
}) => {
  const [copied, setCopied] = React.useState(false);

  const regId = state.registrationId || 'DFR2026-0187';
  const activeMembers = state.members.filter(m => m.name.trim() !== '');

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#07091C]/80 border border-emerald-500/30 rounded-[28px] p-8 sm:p-10 backdrop-blur-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.85)] text-center space-y-6 relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent blur-[0.5px]" />
        
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_40px_rgba(52,211,153,0.3)]"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
            Registration Submitted Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
            {state.teamName}
          </h2>
        </div>

        {/* Registration ID Banner */}
        <div className="p-4 rounded-[18px] bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase text-white/50 block">Registration ID</span>
            <span className="text-lg font-mono font-bold text-[#8DA2FF]">{regId}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className="h-[36px] px-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Pending Verification Notice */}
        <div className="p-4 rounded-[18px] bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-sans text-left space-y-1.5 max-w-lg mx-auto">
          <div className="flex items-center gap-2 font-mono font-bold uppercase text-amber-400 text-[11px]">
            <Clock className="w-4 h-4" />
            <span>Verification Pending</span>
          </div>
          <p className="leading-relaxed text-white/70">
            Your payment verification is pending. The organizing team will verify it shortly. A formal confirmation receipt will be sent via Email once verified.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => downloadReceipt(state)}
            className="w-full sm:w-auto h-[46px] px-6 rounded-full border border-white/14 bg-white/5 text-white font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#8DA2FF]" />
            <span>Download Receipt</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="w-full sm:w-auto h-[48px] px-8 rounded-full bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white font-space font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_24px_rgba(83,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Join Official WhatsApp Group →</span>
          </button>
        </div>

      </motion.div>

    </div>
  );
};
