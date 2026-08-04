import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  UserCheck, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';
import { MemberData, TeamRegistrationState, RegistrationStep } from '../../types/registration';
import { MemberCard } from './MemberCard';
import { ReviewStep } from './ReviewStep';
import { PaymentStep } from './PaymentStep';
import { SubmittedStep } from './SubmittedStep';
import { WhatsAppStep } from './WhatsAppStep';

import { findRegistrationByUserEmail } from '../../lib/firebaseDb';

interface RegistrationFlowProps {
  onBackToPortal: () => void;
  userEmail?: string;
}

const INITIAL_MEMBERS: MemberData[] = [
  { id: '1', role: 'Leader', name: '', registerNumber: '', phone: '', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
  { id: '2', role: 'Member 1', name: '', registerNumber: '', phone: '', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
  { id: '3', role: 'Member 2', name: '', registerNumber: '', phone: '', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
  { id: '4', role: 'Member 3', name: '', registerNumber: '', phone: '', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
  { id: '5', role: 'Member 4 (Optional)', isOptional: true, name: '', registerNumber: '', phone: '', year: '3rd Year', department: 'CSE', section: '24S01', residenceType: 'Day Scholar' },
];

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  onBackToPortal,
  userEmail = '',
}) => {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('team_details');
  const [expandedMemberId, setExpandedMemberId] = useState<string>('1');
  const [isExistingRegistrationChecked, setIsExistingRegistrationChecked] = useState(false);

  // Registration Form State
  const [registrationState, setRegistrationState] = useState<TeamRegistrationState>(() => {
    // Try restoring from localStorage
    const saved = localStorage.getItem('disfrutar_registration_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          payment: { ...parsed.payment, screenshotFile: null, screenshotPreview: null }
        };
      } catch (e) {
        // ignore error
      }
    }
    return {
      teamName: '',
      members: INITIAL_MEMBERS,
      payment: {
        transactionId: '',
        screenshotFile: null,
        screenshotPreview: null,
      }
    };
  });

  // Check if user is already registered in database
  useEffect(() => {
    let isMounted = true;
    async function checkExistingRegistration() {
      if (!userEmail || isExistingRegistrationChecked) return;
      try {
        const existingTeam = await findRegistrationByUserEmail(userEmail);
        if (existingTeam && isMounted) {
          setRegistrationState(prev => ({
            ...prev,
            teamName: existingTeam.teamName,
            members: existingTeam.members.length > 0 ? existingTeam.members : prev.members,
            registrationId: existingTeam.id,
            payment: {
              transactionId: existingTeam.transactionId || '',
              screenshotFile: null,
              screenshotPreview: existingTeam.screenshotUrl || null,
            }
          }));
          setCurrentStep('submitted');
          setIsExistingRegistrationChecked(true);
        }
      } catch (e) {
        console.warn("Existing registration check notice:", e);
      }
    }

    checkExistingRegistration();

    return () => {
      isMounted = false;
    };
  }, [userEmail, isExistingRegistrationChecked]);

  // Autosave locally
  useEffect(() => {
    const toSave = {
      teamName: registrationState.teamName,
      members: registrationState.members,
      payment: { transactionId: registrationState.payment.transactionId },
      registrationId: registrationState.registrationId
    };
    localStorage.setItem('disfrutar_registration_state', JSON.stringify(toSave));
  }, [registrationState]);

  // Member update handler
  const handleMemberChange = (updatedMember: MemberData) => {
    setRegistrationState(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
  };

  // Check if member is complete (all required fields filled)
  const isMemberComplete = (m: MemberData) => {
    if (!m) return false;
    const basic = 
      Boolean(m.name?.trim()) && 
      Boolean(m.registerNumber?.trim()) && 
      Boolean(m.phone?.trim()) && 
      Boolean(m.year?.trim()) && 
      Boolean(m.department?.trim()) &&
      Boolean(m.section?.trim());
      
    const hostel = m.residenceType === 'Day Scholar' || 
      (Boolean(m.hostelName?.trim()) &&
       Boolean(m.roomNumber?.trim()) &&
       Boolean(m.wardenName?.trim()) &&
       Boolean(m.wardenPhone?.trim()));
    return basic && hostel;
  };

  const requiredMembers = registrationState.members.slice(0, 4);
  const optionalMember = registrationState.members[4];

  // 1. Leader + 3 members (4 members minimum) MUST all be completed
  const requiredMembersComplete = requiredMembers.every(isMemberComplete);

  // 2. Member 4 (Optional): If any input is started, it must be fully completed. If empty, it's valid.
  const isOptionalTouched = Boolean(
    optionalMember.name?.trim() || 
    optionalMember.registerNumber?.trim() || 
    optionalMember.phone?.trim()
  );
  const isOptionalMemberValid = !isOptionalTouched || isMemberComplete(optionalMember);

  // 3. Team Name must be at least 2 characters
  const isTeamNameValid = registrationState.teamName.trim().length >= 2;

  // 4. Overall Team Validity (Team size < 4 is rejected)
  const isTeamValid = isTeamNameValid && requiredMembersComplete && isOptionalMemberValid;

  // Steps definition for progress indicator
  const navSteps = [
    { id: 'account', title: 'Account', icon: UserCheck, status: 'completed' },
    { id: 'team_details', title: 'Team Details', icon: Users, status: currentStep === 'team_details' ? 'active' : ['review', 'checkout_payment', 'submitted', 'whatsapp'].includes(currentStep) ? 'completed' : 'pending' },
    { id: 'review', title: 'Review', icon: ShieldCheck, status: currentStep === 'review' ? 'active' : ['checkout_payment', 'submitted', 'whatsapp'].includes(currentStep) ? 'completed' : 'pending' },
    { id: 'payment', title: 'Payment', icon: CreditCard, status: currentStep === 'checkout_payment' ? 'active' : ['submitted', 'whatsapp'].includes(currentStep) ? 'completed' : 'pending' },
    { id: 'confirmation', title: 'Confirmation', icon: CheckCircle2, status: ['submitted', 'whatsapp'].includes(currentStep) ? 'active' : 'pending' },
  ];

  // Calculate step progress percentage
  const getStepIndex = (step: RegistrationStep) => {
    switch (step) {
      case 'team_details': return 1;
      case 'review': return 2;
      case 'checkout_payment': return 3;
      case 'submitted': return 4;
      case 'whatsapp': return 4;
      default: return 1;
    }
  };
  const activeStepIndex = getStepIndex(currentStep);
  const progressPercent = (activeStepIndex / (navSteps.length - 1)) * 100;

  const handleFinishPayment = (newRegId?: string) => {
    if (newRegId) {
      setRegistrationState(prev => ({
        ...prev,
        registrationId: newRegId
      }));
    } else if (!registrationState.registrationId) {
      const regId = `DFR2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setRegistrationState(prev => ({
        ...prev,
        registrationId: regId
      }));
    }
    setCurrentStep('submitted');
  };

  const isOptionalAdded = isMemberComplete(optionalMember);
  const totalMemberCount = registrationState.members.slice(0, 4).filter(isMemberComplete).length + (isOptionalAdded ? 1 : 0);
  const totalFee = totalMemberCount * 350;

  return (
    <div className="min-h-screen w-full bg-[#06080B] text-white font-space py-6 px-4 sm:px-6 lg:px-8 selection:bg-[#536BFF] selection:text-white overflow-x-hidden">
      
      {/* Top Navbar Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBackToPortal}
          className="h-[40px] px-4 rounded-full bg-white/[0.04] border border-white/12 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 text-xs font-space font-semibold text-white/80 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8DA2FF]" />
          <span>Back to Landing</span>
        </button>

        {/* Branding Emblem */}
        <div className="flex items-center gap-2.5">
          <img src="/acm_logo.png" alt="KARE ACM" className="h-7 w-auto object-contain" referrerPolicy="no-referrer" />
          <div className="h-4 w-px bg-white/20 hidden sm:block" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#8DA2FF] hidden sm:block uppercase">
            DISFRUTAR 2K26
          </span>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="relative flex items-center justify-between px-2">
          
          {/* Background Connector Line */}
          <div className="absolute left-6 right-6 top-[18px] sm:top-[20px] h-1 bg-white/10 z-0 rounded-full" />
          
          {/* Active Progress Connector Line */}
          <motion.div 
            className="absolute left-6 top-[18px] sm:top-[20px] h-1 bg-gradient-to-r from-[#536BFF] to-[#8DA2FF] z-0 rounded-full shadow-[0_0_12px_rgba(83,107,255,0.6)]"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />

          {navSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div 
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold text-xs ${
                    isCompleted 
                      ? 'bg-[#536BFF] text-white shadow-[0_0_16px_rgba(83,107,255,0.5)] border border-white/30' 
                      : isActive 
                      ? 'bg-[#07091C] border-2 border-[#536BFF] text-[#8DA2FF] shadow-[0_0_20px_rgba(83,107,255,0.4)]' 
                      : 'bg-[#07091C] border border-white/15 text-white/30'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>

                <span className={`text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-colors hidden xs:block ${
                  isActive || isCompleted ? 'text-white font-bold' : 'text-white/30'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* Student Verification Toast Banner */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="p-3.5 rounded-full bg-[#536BFF]/10 border border-[#536BFF]/30 flex items-center justify-between gap-3 px-5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono text-white/90">
              Student Verified • <strong className="text-white">KARE ACM Hackathon Portal</strong>
            </span>
          </div>

          <span className="text-[10px] font-mono uppercase text-[#8DA2FF] bg-[#536BFF]/20 px-2.5 py-0.5 rounded-full border border-[#536BFF]/40 hidden sm:inline-block">
            AUTHENTICATED SESSION
          </span>
        </div>
      </div>

      {/* Main Step Body Router */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* STEP 1: TEAM DETAILS */}
          {currentStep === 'team_details' && (
            <div className="max-w-3xl mx-auto space-y-6 pb-28">
              
              {/* Team Name Input Card */}
              <div className="bg-[#07091C]/80 border border-white/12 rounded-[24px] p-6 backdrop-blur-[24px] space-y-3">
                <label htmlFor="teamNameInput" className="block text-xs font-mono font-bold uppercase tracking-wider text-white/70 pl-2">
                  Team Name *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="teamNameInput"
                    type="text"
                    value={registrationState.teamName}
                    onChange={(e) => setRegistrationState(prev => ({ ...prev, teamName: e.target.value }))}
                    placeholder="e.g. Binary Builders"
                    className="w-full h-[48px] pl-11 pr-5 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all text-sm text-white placeholder-white/25 outline-none font-sans"
                  />
                </div>
              </div>

              {/* Team Members Accordion Stack */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white/70">
                    Team Members (4 Minimum, 5 Max)
                  </h3>
                  <span className="text-[11px] font-mono text-white/40">Collapsible Cards</span>
                </div>

                <div className="space-y-3">
                  {registrationState.members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      isExpanded={expandedMemberId === member.id}
                      onToggleExpand={() => setExpandedMemberId(prev => prev === member.id ? '' : member.id)}
                      onChange={handleMemberChange}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced Fixed Bottom Navigation Bar with Live Readiness Bars & Total Amount */}
              <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#07091C]/95 border-t border-white/15 backdrop-blur-2xl px-4 py-3.5 sm:py-4 shadow-[0_-12px_48px_rgba(0,0,0,0.9)]">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Readiness Progress Bars & Price Summary */}
                  <div className="w-full sm:w-auto space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-space font-bold text-sm text-white">
                        {registrationState.teamName ? registrationState.teamName : 'Team Name Required'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isTeamValid 
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {isTeamValid ? 'Ready' : 'Incomplete'}
                      </span>
                    </div>

                    {/* Member Readiness 5 Green Bars */}
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 py-0.5">
                      {registrationState.members.map((m, idx) => {
                        const complete = isMemberComplete(m);
                        return (
                          <div
                            key={m.id}
                            className={`h-2 w-8 sm:w-10 rounded-full transition-all duration-300 ${
                              complete 
                                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                                : idx === 4 
                                ? 'bg-white/10' 
                                : 'bg-amber-500/40'
                            }`}
                            title={`${m.role}: ${complete ? 'Verified' : 'Pending'}`}
                          />
                        );
                      })}
                      <span className="text-[11px] font-mono text-white/70 ml-2 font-bold">
                        {requiredMembers.filter(isMemberComplete).length}/4 Verified
                      </span>
                    </div>

                    <p className="text-[11px] font-mono text-white/50">
                      Total Payable: <strong className="text-base text-white font-space font-bold">₹{totalFee}</strong>
                      <span className="text-white/40 text-[10px] ml-1">(₹350 × {totalMemberCount})</span>
                    </p>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep('review')}
                    disabled={!isTeamValid}
                    className={`w-full sm:w-auto h-[48px] px-8 rounded-full font-space font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 border ${
                      isTeamValid
                        ? 'bg-gradient-to-r from-[#536BFF] to-[#4256F6] text-white border-white/20 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_24px_rgba(83,107,255,0.4)]'
                        : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Save & Continue to Review →</span>
                  </button>

                </div>
              </div>

            </div>
          )}

          {/* STEP 2: REVIEW DETAILS */}
          {currentStep === 'review' && (
            <ReviewStep
              state={registrationState}
              onBack={() => setCurrentStep('team_details')}
              onConfirm={() => setCurrentStep('checkout_payment')}
            />
          )}

          {/* STEP 3: CHECKOUT PAYMENT */}
          {currentStep === 'checkout_payment' && (
            <PaymentStep
              state={registrationState}
              onChange={setRegistrationState}
              onBack={() => setCurrentStep('review')}
              onSubmitPayment={handleFinishPayment}
            />
          )}

          {/* STEP 4: SUBMITTED */}
          {currentStep === 'submitted' && (
            <SubmittedStep
              state={registrationState}
              onNext={() => setCurrentStep('whatsapp')}
            />
          )}

          {/* STEP 5: WHATSAPP */}
          {currentStep === 'whatsapp' && (
            <WhatsAppStep
              onReturnToDashboard={onBackToPortal}
            />
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
