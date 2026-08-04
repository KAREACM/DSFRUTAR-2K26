import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building2, 
  Home, 
  Phone, 
  School,
  Hash
} from 'lucide-react';
import { MemberData, ResidenceType } from '../../types/registration';

interface MemberCardProps {
  member: MemberData;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updatedMember: MemberData) => void;
}

const DEPARTMENTS = [
  'CSE', 'IT', 'AI & DS', 'AI & ML', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Biotechnology', 'BCA / MCA', 'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'PG / Other'];

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  isExpanded,
  onToggleExpand,
  onChange,
}) => {
  // Check completion
  const isBasicFilled = 
    Boolean(member.name?.trim()) &&
    Boolean(member.registerNumber?.trim()) &&
    Boolean(member.phone?.trim()) &&
    Boolean(member.year?.trim()) &&
    Boolean(member.department?.trim()) &&
    Boolean(member.section?.trim());

  const isHostelFilled = 
    member.residenceType === 'Day Scholar' ||
    (Boolean(member.hostelName?.trim()) &&
     Boolean(member.roomNumber?.trim()) &&
     Boolean(member.wardenName?.trim()) &&
     Boolean(member.wardenPhone?.trim()));

  const isComplete = isBasicFilled && isHostelFilled;
  const isEmptyOptional = member.isOptional && member.name.trim() === '' && member.registerNumber.trim() === '';

  const handleInputChange = (field: keyof MemberData, value: any) => {
    onChange({
      ...member,
      [field]: value
    });
  };

  return (
    <div className={`rounded-[18px] border transition-all duration-300 overflow-hidden ${
      isExpanded 
        ? 'border-[#536BFF]/60 bg-[#07091C]/90 shadow-[0_8px_32px_rgba(83,107,255,0.15)]' 
        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
    }`}>
      
      {/* Header Bar */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-space font-bold text-xs ${
            isComplete 
              ? 'bg-[#536BFF]/20 text-[#8DA2FF] border border-[#536BFF]/40' 
              : isEmptyOptional 
              ? 'bg-white/5 text-white/40 border border-white/10'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            <User className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-space font-bold text-sm text-white">
                {member.role}
              </span>
              {member.isOptional && (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
                  Optional
                </span>
              )}
            </div>

            <p className="text-xs text-white/50 font-sans mt-0.5">
              {member.name ? (
                <span className="text-white/80 font-medium">{member.name} ({member.registerNumber || 'No Reg No'})</span>
              ) : (
                <span className="italic">Click to enter member details</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          {isComplete ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : isEmptyOptional ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[11px] font-mono">
              Not Added
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              Incomplete
            </span>
          )}

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/40"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* Row 1: Name & Register Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Full Name {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g. Sai Kumar"
                      className="w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-200 text-sm text-white placeholder-white/25 outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Register Number {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={member.registerNumber}
                      onChange={(e) => handleInputChange('registerNumber', e.target.value.toUpperCase())}
                      placeholder="e.g. 9921004123"
                      className="w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-200 text-sm text-white placeholder-white/25 outline-none font-sans uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Mobile Number & Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Mobile Number {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="tel"
                      value={member.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-200 text-sm text-white placeholder-white/25 outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Section {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={member.section || ''}
                      onChange={(e) => handleInputChange('section', e.target.value.toUpperCase())}
                      placeholder="e.g. 24S01"
                      className="w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-200 text-sm text-white placeholder-white/25 outline-none font-sans uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Year & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Academic Year {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
                    <select
                      value={member.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full h-[44px] pl-11 pr-10 rounded-full bg-[#0a0f28] border border-white/14 hover:border-white/25 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/40 transition-all duration-200 text-sm text-white outline-none font-sans appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="" disabled className="bg-[#07091C] text-white/40 font-sans">Select Academic Year</option>
                      {YEARS.map(y => (
                        <option key={y} value={y} className="bg-[#0b0e26] text-white font-sans py-1.5">{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                    Department {member.isOptional ? '' : '*'}
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none z-10" />
                    <select
                      value={member.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full h-[44px] pl-11 pr-10 rounded-full bg-[#0a0f28] border border-white/14 hover:border-white/25 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/40 transition-all duration-200 text-sm text-white outline-none font-sans appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="" disabled className="bg-[#07091C] text-white/40 font-sans">Select Department</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d} value={d} className="bg-[#0b0e26] text-white font-sans py-1.5">{d}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: Residence Type Selector */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
                  Residence Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Day Scholar', 'Hosteller'] as ResidenceType[]).map((type) => {
                    const isSelected = member.residenceType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleInputChange('residenceType', type)}
                        className={`h-[42px] px-4 rounded-full font-space text-xs font-semibold flex items-center justify-center gap-2 border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#536BFF]/20 border-[#536BFF] text-white shadow-[0_0_12px_rgba(83,107,255,0.3)]'
                            : 'bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>{type}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Hostel Fields with Framer Motion expansion */}
              <AnimatePresence initial={false}>
                {member.residenceType === 'Hosteller' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden pt-2"
                  >
                    <div className="p-4 rounded-[16px] bg-[#536BFF]/10 border border-[#536BFF]/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8DA2FF] uppercase tracking-wider">
                          <Home className="w-4 h-4" />
                          <span>Hostel Stay Information</span>
                        </div>
                        {!isHostelFilled && (
                          <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            Incomplete Details
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-white/50 pl-2 uppercase">Hostel Name *</label>
                          <input
                            type="text"
                            value={member.hostelName || ''}
                            onChange={(e) => handleInputChange('hostelName', e.target.value)}
                            placeholder="e.g. MH-1 / Ladies Hostel B"
                            className="w-full h-[40px] px-4 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-[#536BFF]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-white/50 pl-2 uppercase">Room Number *</label>
                          <input
                            type="text"
                            value={member.roomNumber || ''}
                            onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                            placeholder="e.g. 304"
                            className="w-full h-[40px] px-4 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-[#536BFF]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-white/50 pl-2 uppercase">Warden Name *</label>
                          <input
                            type="text"
                            value={member.wardenName || ''}
                            onChange={(e) => handleInputChange('wardenName', e.target.value)}
                            placeholder="e.g. Dr. Ramesh"
                            className="w-full h-[40px] px-4 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-[#536BFF]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-white/50 pl-2 uppercase">Warden Phone *</label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                            <input
                              type="tel"
                              value={member.wardenPhone || ''}
                              onChange={(e) => handleInputChange('wardenPhone', e.target.value)}
                              placeholder="+91 9876543210"
                              className="w-full h-[40px] pl-10 pr-4 rounded-full bg-white/[0.05] border border-white/10 text-xs text-white placeholder-white/20 outline-none focus:border-[#536BFF]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
