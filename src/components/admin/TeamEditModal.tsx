import React, { useState } from 'react';
import { X, Save, Building2, Phone, User, Edit3 } from 'lucide-react';
import { TeamRecord } from '../../lib/adminStore';
import { MemberData } from '../../types/registration';

interface TeamEditModalProps {
  team: TeamRecord;
  onClose: () => void;
  onSave: (updatedTeam: TeamRecord) => void;
}

export const TeamEditModal: React.FC<TeamEditModalProps> = ({ team, onClose, onSave }) => {
  const [teamName, setTeamName] = useState(team.teamName);
  const [transactionId, setTransactionId] = useState(team.transactionId);
  const [amount, setAmount] = useState(team.amount);
  const [paymentStatus, setPaymentStatus] = useState(team.paymentStatus);
  const [members, setMembers] = useState<MemberData[]>(JSON.parse(JSON.stringify(team.members)));

  const handleMemberChange = (idx: number, field: keyof MemberData, val: any) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: val };
    setMembers(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTeam: TeamRecord = {
      ...team,
      teamName: teamName.trim() || team.teamName,
      transactionId: transactionId.trim() || team.transactionId,
      amount: Number(amount) || team.amount,
      paymentStatus: paymentStatus,
      memberCount: members.length,
      members: members
    };
    onSave(updatedTeam);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0a0f28] border border-[#536BFF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-y-auto my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-space text-white">Edit Team Registration</h3>
            <p className="text-xs font-mono text-white/50">Team ID: {team.id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* General Team Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-bold text-white/60 uppercase">Team Name</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white outline-none focus:border-[#536BFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-bold text-white/60 uppercase">Transaction ID</label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white outline-none focus:border-[#536BFF]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono font-bold text-white/60 uppercase">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full h-[40px] px-3 rounded-xl bg-[#07091C] border border-white/15 text-xs text-white outline-none focus:border-[#536BFF]"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8DA2FF]">
              Team Members ({members.length})
            </h4>

            {members.map((m, idx) => (
              <div key={m.id || idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#8DA2FF] uppercase">{m.role}</span>
                  <span className="text-[10px] font-mono text-white/40">{m.residenceType}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Reg Number</label>
                    <input
                      type="text"
                      value={m.registerNumber}
                      onChange={(e) => handleMemberChange(idx, 'registerNumber', e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Mobile Phone</label>
                    <input
                      type="text"
                      value={m.phone}
                      onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Year</label>
                    <input
                      type="text"
                      value={m.year}
                      onChange={(e) => handleMemberChange(idx, 'year', e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Department</label>
                    <input
                      type="text"
                      value={m.department}
                      onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/50 mb-1">Section</label>
                    <input
                      type="text"
                      value={m.section || ''}
                      onChange={(e) => handleMemberChange(idx, 'section', e.target.value)}
                      placeholder="24S01"
                      className="w-full h-[36px] px-3 rounded-lg bg-white/[0.05] border border-white/10 text-xs text-white uppercase outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="h-[42px] px-6 rounded-full border border-white/20 text-white/70 hover:text-white font-space text-xs font-bold hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[42px] px-6 rounded-full bg-[#536BFF] hover:bg-[#4258e6] text-white font-space text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#536BFF]/30 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
