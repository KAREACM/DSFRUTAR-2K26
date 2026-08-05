import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

interface QuickRejectModalProps {
  teamName: string;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
}

const REJECT_REASONS = [
  'Duplicate Transaction ID',
  'Incorrect Payment Amount (Minimum fee required)',
  'Invalid Screenshot (Unclear receipt or wrong image)',
  'Payment Not Received in Bank Account',
  'Other Reason'
];

export const QuickRejectModal: React.FC<QuickRejectModalProps> = ({
  teamName,
  onClose,
  onConfirmReject
}) => {
  const [selectedReason, setSelectedReason] = useState(REJECT_REASONS[0]);
  const [customText, setCustomText] = useState('');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Other Reason' 
      ? (customText.trim() || 'Payment details verification failed.')
      : selectedReason;
    onConfirmReject(finalReason);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl font-sans"
    >
      <div className="w-full max-w-md bg-[#07091C]/95 border border-red-500/40 rounded-3xl p-6 shadow-2xl relative space-y-5 backdrop-blur-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
          title="Close Modal (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-space text-white">Reject Registration</h3>
            <p className="text-xs font-mono text-white/60">Team: <span className="text-white font-bold">{teamName}</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[11px] font-mono font-bold text-white/70 uppercase tracking-wider">
              Select Rejection Reason *
            </label>
            <div className="space-y-2">
              {REJECT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    selectedReason === reason
                      ? 'bg-red-500/15 border-red-500/50 text-white'
                      : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-red-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-sans font-medium">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other Reason' && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-white/70 uppercase tracking-wider">
                Specify Reason
              </label>
              <textarea
                required
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Describe why this payment was rejected..."
                rows={3}
                className="w-full p-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-red-500 text-xs text-white placeholder-white/25 outline-none font-sans"
              />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-[44px] rounded-full border border-white/15 text-white/70 hover:text-white font-space text-xs font-bold hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-[44px] rounded-full bg-red-600 hover:bg-red-500 text-white font-space text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm Reject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
