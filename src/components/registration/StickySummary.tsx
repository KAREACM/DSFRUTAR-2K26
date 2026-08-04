import React from 'react';
import { Users, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, CreditCard } from 'lucide-react';
import { MemberData } from '../../types/registration';

interface StickySummaryProps {
  teamName: string;
  members: MemberData[];
}

export const StickySummary: React.FC<StickySummaryProps> = ({
  teamName,
  members,
}) => {
  // Calculate completed count
  const requiredMembers = members.slice(0, 4);
  const optionalMember = members[4];

  const isMemberComplete = (m: MemberData) => {
    if (!m) return false;
    const basic = m.name.trim() !== '' && m.registerNumber.trim() !== '' && m.year !== '' && m.department !== '';
    const hostel = m.residenceType === 'Day Scholar' || (m.hostelName?.trim() !== '' && m.roomNumber?.trim() !== '');
    return basic && hostel;
  };

  const completedRequired = requiredMembers.filter(isMemberComplete).length;
  const isOptionalAdded = isMemberComplete(optionalMember);
  const isOptionalTouched = Boolean(
    optionalMember.name?.trim() || 
    optionalMember.registerNumber?.trim() || 
    optionalMember.phone?.trim()
  );
  const isOptionalMemberValid = !isOptionalTouched || isOptionalAdded;
  
  const totalMemberCount = completedRequired + (isOptionalAdded ? 1 : 0);
  const feePerPerson = 350;
  const totalFee = totalMemberCount * feePerPerson;

  const isTeamNameValid = teamName.trim().length >= 2;
  const isValidTeam = isTeamNameValid && completedRequired === 4 && isOptionalMemberValid;

  return (
    <div className="w-full bg-[#07091C]/90 border border-white/12 rounded-[22px] p-5 sm:p-6 backdrop-blur-[24px] shadow-[0_16px_48px_rgba(0,0,0,0.6)] space-y-5">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 flex items-center justify-center text-[#8DA2FF]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-space font-bold text-sm text-white">Live Registration Summary</h3>
            <p className="text-[11px] font-sans text-white/50">{teamName ? `Team: ${teamName}` : 'Enter your team name'}</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border ${
          isValidTeam 
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
        }`}>
          {isValidTeam ? 'Ready' : 'Incomplete'}
        </span>
      </div>

      {/* Member Readiness Breakdown */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-white/60">
          <span>Required Team Size</span>
          <span className="font-bold text-white">{completedRequired} / 4 Verified</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {members.map((m, idx) => {
            const complete = isMemberComplete(m);
            return (
              <div
                key={m.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  complete 
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                    : idx === 4 
                    ? 'bg-white/10' 
                    : 'bg-amber-500/40'
                }`}
                title={`${m.role}: ${complete ? 'Complete' : 'Pending'}`}
              />
            );
          })}
        </div>

        <p className="text-[11px] text-white/40 font-sans italic pt-1">
          * Minimum 4 members required. Member 5 is optional (₹350 extra).
        </p>
      </div>

      {/* Fee Calculation Card */}
      <div className="p-4 rounded-[16px] bg-gradient-to-br from-[#0e1333] to-[#080a1e] border border-white/10 space-y-3">
        <div className="flex justify-between items-center text-xs font-mono text-white/70">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#8DA2FF]" />
            Active Members ({totalMemberCount})
          </span>
          <span>₹350 × {totalMemberCount}</span>
        </div>

        <div className="border-t border-white/10 pt-2.5 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block">Total Payable</span>
            <span className="text-2xl font-space font-bold text-white tracking-tight">
              ₹{totalFee}
            </span>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Zero Gateway Fee
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
