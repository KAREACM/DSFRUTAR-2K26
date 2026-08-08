import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, MessageCircle, Clock, Copy, ShieldAlert, Check, Sparkles } from 'lucide-react';
import { TeamRegistrationState } from '../../types/registration';
import { downloadReceipt } from '../../utils/generateReceipt';

interface SubmittedStepProps {
  state: TeamRegistrationState;
  onNext: () => void;
}

const SubmittedStepComponent: React.FC<SubmittedStepProps> = ({
  state,
  onNext,
}) => {
  const [copied, setCopied] = useState(false);

  const regId = state.registrationId || 'DFR2026-0187';
  const activeMembers = state.members.filter(m => m.name.trim() !== '');

  const handleCopyId = () => {
    navigator.clipboard.writeText(regId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApproved = state.paymentStatus === 'approved';
  const isRejected = state.paymentStatus === 'rejected';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 gpu-accelerate">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`bg-[#07091C]/80 border rounded-[28px] p-6 sm:p-10 backdrop-blur-[24px] shadow-2xl text-center space-y-6 relative overflow-hidden gpu-accelerate registration-card ${
          isApproved 
            ? 'border-emerald-500/40 shadow-[0_32px_80px_rgba(52,211,153,0.2)]' 
            : isRejected 
            ? 'border-red-500/40 shadow-[0_32px_80px_rgba(239,68,68,0.2)]'
            : 'border-[#536BFF]/40 shadow-[0_32px_80px_rgba(83,107,255,0.2)]'
        }`}
      >
        {/* Glow accent */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1.5px] blur-[0.5px] ${
          isApproved 
            ? 'bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent' 
            : isRejected 
            ? 'bg-gradient-to-r from-transparent via-red-500/80 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#536BFF]/80 to-transparent'
        }`} />
        
        {/* Animated Main Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto border-2 gpu-accelerate ${
            isApproved 
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.35)]' 
              : isRejected 
              ? 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_40px_rgba(239,68,68,0.35)]'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
          }`}
        >
          {isApproved ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : isRejected ? (
            <ShieldAlert className="w-10 h-10" />
          ) : (
            <Clock className="w-10 h-10 animate-pulse" />
          )}
        </motion.div>

        {/* Title & Status Badge */}
        <div className="space-y-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full inline-block border ${
            isApproved 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : isRejected 
              ? 'bg-red-500/10 text-red-400 border-red-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {isApproved ? 'Registration & Payment Verified ✓' : isRejected ? 'Payment Rejected — Action Required ✗' : 'Submission Received — Verification Pending ⏳'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
            {state.teamName}
          </h2>
        </div>

        {/* Registration ID Banner */}
        <div className="p-4 rounded-[20px] bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 max-w-md mx-auto hover:border-white/20 transition-all">
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">Registration ID</span>
            <span className="text-lg font-mono font-bold text-[#8DA2FF] select-all">{regId}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            className={`h-[36px] px-3.5 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              copied 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied ID!' : 'Copy'}</span>
          </button>
        </div>

        {/* Dynamic Verification Status Detailed Callout Card */}
        {isApproved ? (
          <div className="p-4 sm:p-5 rounded-[22px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs font-sans text-left space-y-2 max-w-lg mx-auto shadow-[0_0_24px_rgba(52,211,153,0.15)]">
            <div className="flex items-center gap-2 font-mono font-bold uppercase text-emerald-400 text-[11px] tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Application Status: Verified & Approved</span>
            </div>
            <p className="leading-relaxed text-white/80">
              Your team registration and payment details have been verified and approved by the KARE ACM organizing committee. Welcome to DISFRUTAR 2K26!
            </p>
          </div>
        ) : isRejected ? (
          <div className="p-4 sm:p-5 rounded-[22px] bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-sans text-left space-y-2 max-w-lg mx-auto shadow-[0_0_24px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-2 font-mono font-bold uppercase text-red-400 text-[11px] tracking-wider">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Application Status: Payment Disqualified</span>
            </div>
            <p className="leading-relaxed text-white/80">
              Reason: <strong className="text-red-300 font-mono font-bold">{state.rejectReason || 'Payment details verification failed.'}</strong>
            </p>
            <p className="text-[11px] text-white/60 pt-1 border-t border-red-500/20">
              Please check your payment screenshot or UTR number and contact the organizing team for assistance.
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-[22px] bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs font-sans text-left space-y-2 max-w-lg mx-auto shadow-[0_0_24px_rgba(245,158,11,0.12)]">
            <div className="flex items-center gap-2 font-mono font-bold uppercase text-amber-400 text-[11px] tracking-wider">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Application Status: Pending Manual Verification</span>
            </div>
            <p className="leading-relaxed text-white/70">
              Your registration & UPI payment details have been logged in the system. The organizing committee is verifying your submission.
            </p>
          </div>
        )}

        {/* Registered Team Roster Details */}
        <div className="p-4 sm:p-5 rounded-[22px] bg-white/[0.02] border border-white/10 text-left space-y-3 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-mono font-bold text-[#8DA2FF] uppercase tracking-wider">Registered Team Roster</span>
            <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {activeMembers.length} Members
            </span>
          </div>
          <div className="space-y-2">
            {activeMembers.map((m, idx) => (
              <div key={m.id || idx} className="flex flex-wrap items-center justify-between text-xs font-mono py-2 px-3 rounded-xl bg-white/[0.03] border border-white/5 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#8DA2FF] font-bold">[{m.role}]</span>
                  <span className="text-white font-bold">{m.name}</span>
                </div>
                <div className="text-white/50 text-[11px]">
                  {m.registerNumber} • {m.department} ({m.section})
                </div>
              </div>
            ))}
          </div>
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

export const SubmittedStep = React.memo(SubmittedStepComponent);

