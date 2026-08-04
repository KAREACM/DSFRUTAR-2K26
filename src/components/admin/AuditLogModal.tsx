import React from 'react';
import { X, History, Shield, CheckCircle2, XCircle, Edit3, Trash2 } from 'lucide-react';
import { AuditLog } from '../../lib/adminStore';

interface AuditLogModalProps {
  logs: AuditLog[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
      <div className="w-full max-w-2xl max-h-[85vh] bg-[#07091C] border border-[#536BFF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 overflow-y-auto my-auto text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-space text-white">Admin Audit Log</h3>
            <p className="text-xs font-mono text-white/50">Recorded Administrative Actions & Verification Trail</p>
          </div>
        </div>

        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-xs font-mono text-white/40">
              No recorded administrative actions yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  log.action.includes('Approve') ? 'bg-emerald-500/20 text-emerald-400' :
                  log.action.includes('Reject') ? 'bg-red-500/20 text-red-400' :
                  log.action.includes('Delete') ? 'bg-red-500/20 text-red-400' :
                  'bg-[#536BFF]/20 text-[#8DA2FF]'
                }`}>
                  {log.action.includes('Approve') ? <CheckCircle2 className="w-4 h-4" /> :
                   log.action.includes('Reject') ? <XCircle className="w-4 h-4" /> :
                   log.action.includes('Delete') ? <Trash2 className="w-4 h-4" /> :
                   <Edit3 className="w-4 h-4" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-white">{log.action} • {log.teamName}</span>
                    <span className="text-[10px] font-mono text-white/40">{log.timestamp}</span>
                  </div>
                  <div className="text-xs font-mono text-white/70">
                    {log.details || 'Action completed successfully.'}
                  </div>
                  <div className="text-[10px] font-mono text-[#8DA2FF]">
                    Executed by: {log.adminName}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
