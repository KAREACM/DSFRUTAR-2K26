import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CreditCard, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  ShieldAlert, 
  Building2, 
  Home, 
  UserCheck
} from 'lucide-react';
import { TeamRegistrationState } from '../../types/registration';

interface ReviewStepProps {
  state: TeamRegistrationState;
  onBack: () => void;
  onConfirm: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  state,
  onBack,
  onConfirm,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const activeMembers = state.members.filter(m => m.name.trim() !== '');
  const memberCount = activeMembers.length;
  const totalAmount = memberCount * 350;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#536BFF]/15 border border-[#536BFF]/30 text-[#8DA2FF] text-xs font-mono uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5" />
          Step 2 of 4 — Verification
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-wide">
          Review Team Registration
        </h2>
        <p className="text-white/60 text-xs sm:text-sm font-sans max-w-lg mx-auto">
          Please verify all team member details before proceeding to checkout.
        </p>
      </div>

      {/* Team Summary Card */}
      <div className="bg-[#07091C]/80 border border-white/12 rounded-[24px] p-6 sm:p-8 backdrop-blur-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.8)] space-y-6">
        
        {/* Team Meta Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block">Team Name</span>
            <h3 className="text-xl font-space font-bold text-white mt-0.5">{state.teamName}</h3>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-full">
            <Users className="w-4 h-4 text-[#8DA2FF]" />
            <span className="text-xs font-mono font-bold text-white">{memberCount} Registered Members</span>
            <span className="text-xs font-mono text-[#8DA2FF] font-bold">₹{totalAmount}</span>
          </div>
        </div>

        {/* Member Grid Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.members.map((m, idx) => {
            const isFilled = m.name.trim() !== '';
            if (!isFilled) {
              return (
                <div key={m.id} className="p-5 rounded-[20px] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-mono text-white/40">
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-xs font-space font-bold text-white/40">{m.role}</span>
                      <p className="text-[11px] font-sans text-white/30">Not Added (Optional Member)</p>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className="p-5 rounded-[20px] bg-white/[0.04] border border-white/12 space-y-4 hover:border-white/20 transition-all shadow-lg">
                
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#536BFF]/20 text-[#8DA2FF] font-mono font-bold text-xs flex items-center justify-center border border-[#536BFF]/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-space font-bold text-[#8DA2FF]">{m.role}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    Verified Member
                  </span>
                </div>

                {/* Main Member Details */}
                <div className="space-y-2">
                  <h4 className="text-white font-space font-bold text-base tracking-wide flex items-center gap-2">
                    {m.name}
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono text-white/70 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Reg Number</span>
                      <strong className="text-white font-mono text-xs">{m.registerNumber}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Mobile No</span>
                      <strong className="text-[#8DA2FF] font-mono text-xs">{m.phone || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Year & Dept</span>
                      <strong className="text-white font-mono text-xs">{m.year} • {m.department}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Section</span>
                      <strong className="text-emerald-400 font-mono text-xs">{m.section || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Residence Breakdown (Full Information) */}
                <div className="p-3 rounded-xl bg-[#536BFF]/10 border border-[#536BFF]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-white/90">
                      <Home className="w-4 h-4 text-[#8DA2FF]" />
                      <span className="font-bold">{m.residenceType}</span>
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                      m.residenceType === 'Hosteller'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {m.residenceType}
                    </span>
                  </div>

                  {m.residenceType === 'Hosteller' ? (
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px] font-mono text-white/70">
                      <div>
                        <span className="text-white/40 text-[9px] uppercase block">Hostel Name</span>
                        <span className="text-white font-semibold">{m.hostelName || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-white/40 text-[9px] uppercase block">Room No</span>
                        <span className="text-white font-semibold">{m.roomNumber || 'N/A'}</span>
                      </div>
                      {m.wardenName && (
                        <div>
                          <span className="text-white/40 text-[9px] uppercase block">Warden Name</span>
                          <span className="text-white/90">{m.wardenName}</span>
                        </div>
                      )}
                      {m.wardenPhone && (
                        <div>
                          <span className="text-white/40 text-[9px] uppercase block">Warden Phone</span>
                          <span className="text-[#8DA2FF]">{m.wardenPhone}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] font-sans text-white/60 pt-1 border-t border-white/10">
                      College Day Scholar (Daily Commuter / Bus / Private Residence)
                    </p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Pricing Invoice Strip */}
        <div className="p-5 rounded-[20px] bg-gradient-to-r from-[#536BFF]/15 via-[#4256F6]/10 to-[#07091C] border border-[#536BFF]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-[#8DA2FF] uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Team Size Requirement Satisfied ({memberCount} Members)</span>
            </div>
            <p className="text-xs text-white/60 font-sans">
              ₹350 per member × {memberCount} members = Total ₹{totalAmount}
            </p>
          </div>

          <div className="text-center sm:text-right">
            <span className="text-[10px] font-mono uppercase text-white/50 block">Amount Payable</span>
            <span className="text-3xl font-space font-bold text-white">₹{totalAmount}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto h-[46px] px-6 rounded-full border border-white/14 bg-white/5 text-white font-space text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white/70" />
            <span>Edit Team Details</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto h-[48px] px-8 rounded-full bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white font-space font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_24px_rgba(83,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Checkout →</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0c102b] border border-[#536BFF]/50 rounded-[24px] p-6 sm:p-8 shadow-[0_32px_80px_rgba(0,0,0,0.9)] space-y-5 text-center overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-space font-bold text-white">Confirm Team Details</h3>
                <p className="text-xs text-white/70 font-sans leading-relaxed">
                  Please verify your details carefully. After completing payment, editing team information will no longer be allowed.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-left space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/50">Team Name:</span>
                  <span className="text-white font-bold">{state.teamName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Members:</span>
                  <span className="text-white font-bold">{memberCount} Persons</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Total Amount:</span>
                  <span className="text-[#8DA2FF] font-bold">₹{totalAmount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="h-[44px] rounded-full border border-white/10 bg-white/5 text-white/80 font-space text-xs font-semibold hover:bg-white/10 cursor-pointer"
                >
                  Edit Details
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmModal(false);
                    onConfirm();
                  }}
                  className="h-[44px] rounded-full bg-[#536BFF] text-white font-space text-xs font-semibold hover:bg-[#4256F6] shadow-[0_0_16px_rgba(83,107,255,0.4)] cursor-pointer"
                >
                  Confirm & Pay →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
