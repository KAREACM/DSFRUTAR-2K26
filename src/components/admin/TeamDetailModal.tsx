import React, { useState } from 'react';
import { 
  X, ArrowLeft, CheckCircle2, XCircle, AlertCircle, Clock, FileText, 
  Home, Phone, Building2, User, Download, Edit3, Trash2, ZoomIn, ShieldCheck, Calendar 
} from 'lucide-react';
import { TeamRecord } from '../../lib/adminStore';
import { openPrintablePDF } from '../../lib/exportUtils';

interface TeamDetailModalProps {
  team: TeamRecord;
  onClose: () => void;
  onApprove: (teamId: string) => void;
  onReject: (teamId: string, reason: string) => void;
  onEdit: (team: TeamRecord) => void;
  onDelete: (teamId: string) => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({
  team,
  onClose,
  onApprove,
  onReject,
  onEdit,
  onDelete,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isMemberComplete = (m: any) => {
    const basic = Boolean(m.name?.trim()) && Boolean(m.registerNumber?.trim()) && Boolean(m.phone?.trim()) && Boolean(m.year?.trim()) && Boolean(m.department?.trim()) && Boolean(m.section?.trim());
    const hostel = m.residenceType === 'Day Scholar' || 
      (Boolean(m.hostelName?.trim()) && Boolean(m.roomNumber?.trim()) && Boolean(m.wardenName?.trim()) && Boolean(m.wardenPhone?.trim()));
    return basic && hostel;
  };

  const handleDownloadPDF = () => {
    openPrintablePDF([team], `Team Registration - ${team.teamName}`, `Team ID: ${team.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg font-sans overflow-y-auto">
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#07091C] border border-[#536BFF]/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative space-y-6 overflow-y-auto my-auto text-white">
        
        {/* Top bar header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/12 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/12 hover:bg-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8DA2FF]" />
              <span>Download Team PDF</span>
            </button>
            <button
              onClick={() => onEdit(team)}
              className="px-3.5 py-1.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 hover:bg-[#536BFF]/30 text-[#8DA2FF] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Team</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 text-red-400 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Team Header Title Card */}
        <div className="bg-gradient-to-r from-[#0d1230] to-[#141b47] p-5 rounded-2xl border border-[#536BFF]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8DA2FF] px-2.5 py-0.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/30">
                ID: {team.id}
              </span>
              <span className="text-xs font-mono text-white/50">
                Created: {team.createdAt}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-space text-white">{team.teamName}</h2>
            <p className="text-xs font-mono text-white/70">
              {team.memberCount} Team Members • Fee: <span className="text-emerald-400 font-bold">₹{team.amount}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              team.paymentStatus === 'approved' 
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : team.paymentStatus === 'rejected'
                ? 'bg-red-500/15 text-red-400 border-red-500/40'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/40'
            }`}>
              {team.paymentStatus === 'approved' && '✓ Payment Verified'}
              {team.paymentStatus === 'rejected' && '✗ Payment Rejected'}
              {team.paymentStatus === 'pending' && '⏳ Pending Verification'}
            </span>
          </div>
        </div>

        {/* Payment Verification Card */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-mono text-[#8DA2FF] uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Payment & UPI Verification
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Registration Fee: ₹{team.amount}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5 text-xs font-mono">
              <div>
                <span className="text-white/40 block text-[10px] uppercase font-bold tracking-wider">Transaction ID / UPI Reference</span>
                <strong className="text-white text-base font-bold font-space bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 inline-block mt-1">
                  {team.transactionId}
                </strong>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-white/40 block text-[10px] uppercase">Submission Timestamp</span>
                  <span className="text-white/80 font-bold">{team.submittedAt}</span>
                </div>
                {team.approvedBy && (
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase">Verification Status</span>
                    <span className="text-emerald-400 font-bold">{team.approvedBy}</span>
                    <div className="text-[10px] text-white/50">{team.approvedAt}</div>
                  </div>
                )}
              </div>

              {team.rejectReason && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs space-y-1">
                  <span className="font-bold block uppercase text-[10px] text-red-400">Rejection Reason:</span>
                  <div>{team.rejectReason}</div>
                </div>
              )}

              {/* Action Approval/Rejection buttons */}
              <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                {team.paymentStatus !== 'approved' && (
                  <button
                    onClick={() => onApprove(team.id)}
                    className="flex-1 h-[42px] rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Payment</span>
                  </button>
                )}

                {team.paymentStatus !== 'rejected' && (
                  <button
                    onClick={() => setShowRejectInput(!showRejectInput)}
                    className="flex-1 h-[42px] rounded-full bg-red-600/80 hover:bg-red-600 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Payment</span>
                  </button>
                )}
              </div>

              {showRejectInput && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-2 animate-fade-in">
                  <label className="block text-[10px] font-mono font-bold text-red-300 uppercase">Specify Rejection Reason</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectReasonText}
                      onChange={(e) => setRejectReasonText(e.target.value)}
                      placeholder="e.g. Invalid Screenshot or Duplicate Txn ID"
                      className="flex-1 h-[38px] px-3 rounded-xl bg-black/40 border border-red-500/30 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => {
                        onReject(team.id, rejectReasonText || 'Payment details verification failed.');
                        setShowRejectInput(false);
                      }}
                      className="px-4 h-[38px] bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl cursor-pointer shrink-0"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Screenshot Preview Box */}
            <div className="space-y-2 flex flex-col">
              <span className="text-white/50 text-[10px] font-mono uppercase block font-bold tracking-wider">Payment Receipt Screenshot</span>
              <div 
                onClick={() => setIsZoomOpen(true)}
                className="relative group rounded-2xl overflow-hidden border border-white/15 bg-black/50 flex-1 min-h-[160px] max-h-[220px] flex items-center justify-center cursor-pointer hover:border-[#536BFF] transition-all"
              >
                {team.screenshotUrl ? (
                  <img 
                    src={team.screenshotUrl} 
                    alt="UPI Payment Screenshot" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="text-center p-4 text-white/40 text-xs font-mono">No image preview available</div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity text-xs font-mono font-bold text-white backdrop-blur-xs">
                  <ZoomIn className="w-6 h-6 text-[#8DA2FF]" />
                  <span>Click to Expand Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Cards Detailed Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold font-space text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#8DA2FF]" />
              Team Members ({team.members.length})
            </h3>
            <span className="text-xs font-mono text-white/50">
              Verified Data Check
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.members.map((m, idx) => {
              const complete = isMemberComplete(m);
              return (
                <div key={m.id || idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/30 text-[#8DA2FF] text-[10px] font-mono font-bold uppercase">
                        {m.role}
                      </span>
                      <h4 className="text-sm font-bold font-space text-white">{m.name || 'Unnamed Member'}</h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      complete ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {complete ? '✓ Completed' : '⚠ Missing Data'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Reg Number</span>
                      <strong className="text-white">{m.registerNumber || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Mobile Phone</span>
                      <strong className="text-[#8DA2FF]">{m.phone || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Year & Dept</span>
                      <strong className="text-white">{m.year} • {m.department}</strong>
                    </div>
                    <div>
                      <span className="text-white/40 text-[10px] block uppercase">Section</span>
                      <strong className="text-emerald-400">{m.section || 'N/A'}</strong>
                    </div>
                  </div>

                  {m.residenceType === 'Hosteller' ? (
                    <div className="p-3 rounded-xl bg-[#536BFF]/10 border border-[#536BFF]/25 space-y-1.5 text-xs font-mono">
                      <div className="text-[10px] text-[#8DA2FF] font-bold uppercase flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        <span>Hostel Stay Info ({m.hostelName || 'N/A'})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
                        <div>Room No: <strong className="text-white">{m.roomNumber || 'N/A'}</strong></div>
                        <div>Warden: <strong className="text-white">{m.wardenName || 'N/A'}</strong></div>
                        <div className="col-span-2 text-white/60">Warden Phone: <span className="text-[#8DA2FF]">{m.wardenPhone || 'N/A'}</span></div>
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-white/60">
                      Residence: <strong className="text-white">Day Scholar</strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="max-w-md w-full bg-[#0a0f28] border border-red-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-space text-white">Delete Registration?</h3>
              <p className="text-xs font-mono text-white/70">
                Are you sure you want to permanently delete team <strong className="text-white">{team.teamName}</strong> ({team.id})? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-[42px] rounded-full border border-white/20 text-white font-space text-xs font-bold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    onDelete(team.id);
                  }}
                  className="flex-1 h-[42px] rounded-full bg-red-600 hover:bg-red-500 text-white font-space text-xs font-bold"
                >
                  Delete Registration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Image Zoom Lightbox Modal */}
        {isZoomOpen && (
          <div 
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute -top-10 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={team.screenshotUrl} 
                alt="Payment Receipt Zoom" 
                className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
              />
              <div className="text-center font-mono text-xs text-white/70 mt-3">
                Transaction ID: {team.transactionId} • Fee Amount: ₹{team.amount}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
