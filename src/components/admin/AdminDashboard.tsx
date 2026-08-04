import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, LogOut, Search, Filter, Download, CheckCircle2, XCircle, 
  Clock, Users, Home, Building2, RefreshCw, ArrowRight, 
  CheckSquare, Square, FileText, Settings, ShieldCheck, UserCheck, LayoutDashboard,
  LayoutGrid, List, Eye
} from 'lucide-react';
import { 
  TeamRecord, 
  getStoredTeams, saveStoredTeams
} from '../../lib/adminStore';
import { exportTeamsToCSV, openPrintablePDF } from '../../lib/exportUtils';
import { TeamDetailModal } from './TeamDetailModal';
import { TeamEditModal } from './TeamEditModal';
import { QuickRejectModal } from './QuickRejectModal';

interface AdminDashboardProps {
  adminEmail: string;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminEmail, onLogout }) => {
  const [teams, setTeams] = useState<TeamRecord[]>([]);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teams' | 'payments' | 'reports' | 'settings'>('dashboard');

  // View mode for roster
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [residenceFilter, setResidenceFilter] = useState<'all' | 'hosteller' | 'day_scholar'>('all');
  const [membersFilter, setMembersFilter] = useState<'all' | '4' | '5'>('all');

  // Selected teams for bulk action
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  // Modals state
  const [selectedDetailTeam, setSelectedDetailTeam] = useState<TeamRecord | null>(null);
  const [selectedEditTeam, setSelectedEditTeam] = useState<TeamRecord | null>(null);
  const [quickRejectTeam, setQuickRejectTeam] = useState<TeamRecord | null>(null);

  // Load initial store data
  useEffect(() => {
    setTeams(getStoredTeams());
  }, []);

  // Save changes to localStorage whenever store updates
  const updateTeams = (newTeams: TeamRecord[]) => {
    setTeams(newTeams);
    saveStoredTeams(newTeams);
  };

  // Metrics
  const totalTeamsCount = teams.length;
  const totalParticipantsCount = teams.reduce((acc, t) => acc + t.memberCount, 0);
  const pendingPaymentsCount = teams.filter(t => t.paymentStatus === 'pending').length;
  const approvedCount = teams.filter(t => t.paymentStatus === 'approved').length;
  const rejectedCount = teams.filter(t => t.paymentStatus === 'rejected').length;

  const totalHostellersCount = teams.reduce((acc, t) => {
    return acc + t.members.filter(m => m.residenceType === 'Hosteller').length;
  }, 0);

  const totalDayScholarsCount = teams.reduce((acc, t) => {
    return acc + t.members.filter(m => m.residenceType === 'Day Scholar').length;
  }, 0);

  // Filtered Teams Logic
  const filteredTeams = teams.filter(t => {
    const query = searchQuery.toLowerCase().trim();
    const leader = t.members[0] || {};
    const matchesSearch = !query || 
      t.teamName.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.transactionId.toLowerCase().includes(query) ||
      (leader.name && leader.name.toLowerCase().includes(query)) ||
      (leader.registerNumber && leader.registerNumber.toLowerCase().includes(query)) ||
      (leader.phone && leader.phone.toLowerCase().includes(query));

    const matchesPayment = paymentFilter === 'all' || t.paymentStatus === paymentFilter;

    const hasHosteller = t.members.some(m => m.residenceType === 'Hosteller');
    const hasDayScholar = t.members.some(m => m.residenceType === 'Day Scholar');
    const matchesResidence = residenceFilter === 'all' ||
      (residenceFilter === 'hosteller' && hasHosteller) ||
      (residenceFilter === 'day_scholar' && hasDayScholar);

    const matchesMembers = membersFilter === 'all' || String(t.memberCount) === membersFilter;

    return matchesSearch && matchesPayment && matchesResidence && matchesMembers;
  });

  // Action Handlers
  const handleApprovePayment = (teamId: string) => {
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          paymentStatus: 'approved' as const,
          approvedBy: 'Dr. P. Venkat Sai (Admin)',
          approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeline: t.timeline.map(step => {
            if (step.title === 'Approved') return { ...step, timestamp: 'Just now', completed: true };
            if (step.title === 'Confirmation Sent') return { ...step, timestamp: 'Just now', completed: true };
            return step;
          })
        };
      }
      return t;
    });

    updateTeams(updated);
    if (selectedDetailTeam?.id === teamId) {
      setSelectedDetailTeam(updated.find(t => t.id === teamId) || null);
    }
  };

  const handleRejectPayment = (teamId: string, reason: string) => {
    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          paymentStatus: 'rejected' as const,
          rejectReason: reason,
          approvedBy: 'Dr. P. Venkat Sai (Admin)',
          approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeline: t.timeline.map(step => {
            if (step.title === 'Approved') return { title: 'Rejected', timestamp: 'Just now', completed: true };
            return step;
          })
        };
      }
      return t;
    });

    updateTeams(updated);
    setQuickRejectTeam(null);
    if (selectedDetailTeam?.id === teamId) {
      setSelectedDetailTeam(updated.find(t => t.id === teamId) || null);
    }
  };

  const handleSaveEditTeam = (updatedTeam: TeamRecord) => {
    const updated = teams.map(t => t.id === updatedTeam.id ? updatedTeam : t);
    updateTeams(updated);
    setSelectedEditTeam(null);
    if (selectedDetailTeam?.id === updatedTeam.id) {
      setSelectedDetailTeam(updatedTeam);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    const updated = teams.filter(t => t.id !== teamId);
    updateTeams(updated);
    setSelectedDetailTeam(null);
  };

  const handleBulkApprove = () => {
    if (selectedTeamIds.length === 0) return;
    const updated = teams.map(t => {
      if (selectedTeamIds.includes(t.id)) {
        return {
          ...t,
          paymentStatus: 'approved' as const,
          approvedBy: 'Dr. P. Venkat Sai (Admin)',
          approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return t;
    });

    updateTeams(updated);
    setSelectedTeamIds([]);
  };

  const toggleSelectTeam = (id: string) => {
    if (selectedTeamIds.includes(id)) {
      setSelectedTeamIds(selectedTeamIds.filter(i => i !== id));
    } else {
      setSelectedTeamIds([...selectedTeamIds, id]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050814] text-white font-sans relative overflow-x-hidden pb-16">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#07091C]/95 border-b border-[#536BFF]/25 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#8DA2FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-space text-white tracking-wide">DISFRUTAR 2K26</h1>
              <span className="text-[10px] font-mono font-bold bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/50">KARE ACM Command Center</p>
          </div>
        </div>

        {/* Right side admin info & controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white font-space">Dr. P. Venkat Sai</div>
              <div className="text-[10px] font-mono text-emerald-400">Admin Lead ({adminEmail})</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all text-xs font-mono font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <nav className="flex items-center gap-2 bg-white/[0.03] p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-[#536BFF] text-white shadow-lg shadow-[#536BFF]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => { setActiveTab('teams'); setPaymentFilter('all'); }}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'teams'
                  ? 'bg-[#536BFF] text-white shadow-lg shadow-[#536BFF]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teams Roster ({teams.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('payments'); setPaymentFilter('pending'); }}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'payments'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Payments Verification</span>
              {pendingPaymentsCount > 0 && (
                <span className="bg-black/30 text-amber-100 text-[10px] px-2 py-0.5 rounded-full font-bold ml-1">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reports'
                  ? 'bg-[#536BFF] text-white shadow-lg shadow-[#536BFF]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Reports</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-[#536BFF] text-white shadow-lg shadow-[#536BFF]/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="text-xs font-mono text-white/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Real-time Sync Active</span>
          </div>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#536BFF]/40 transition-all space-y-1">
            <span className="text-[10px] font-mono text-white/50 uppercase block font-bold">Total Teams</span>
            <div className="text-2xl font-bold font-space text-white">{totalTeamsCount}</div>
            <div className="text-[10px] font-mono text-[#8DA2FF]">Active Registered</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#536BFF]/40 transition-all space-y-1">
            <span className="text-[10px] font-mono text-white/50 uppercase block font-bold">Participants</span>
            <div className="text-2xl font-bold font-space text-white">{totalParticipantsCount}</div>
            <div className="text-[10px] font-mono text-[#8DA2FF]">Students Enrolled</div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 transition-all space-y-1">
            <span className="text-[10px] font-mono text-amber-300 uppercase block font-bold">Pending Payments</span>
            <div className="text-2xl font-bold font-space text-amber-400">{pendingPaymentsCount}</div>
            <div className="text-[10px] font-mono text-amber-300/70">Needs Verification</div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50 transition-all space-y-1">
            <span className="text-[10px] font-mono text-emerald-300 uppercase block font-bold">Approved</span>
            <div className="text-2xl font-bold font-space text-emerald-400">{approvedCount}</div>
            <div className="text-[10px] font-mono text-emerald-300/70">Verified Teams</div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 transition-all space-y-1">
            <span className="text-[10px] font-mono text-blue-300 uppercase block font-bold">Hostellers</span>
            <div className="text-2xl font-bold font-space text-blue-400">{totalHostellersCount}</div>
            <div className="text-[10px] font-mono text-blue-300/70">Hostel Residents</div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 transition-all space-y-1">
            <span className="text-[10px] font-mono text-purple-300 uppercase block font-bold">Day Scholars</span>
            <div className="text-2xl font-bold font-space text-purple-400">{totalDayScholarsCount}</div>
            <div className="text-[10px] font-mono text-purple-300/70">Local Commuters</div>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-5 rounded-2xl bg-[#07091C] border border-white/10 space-y-4 shadow-lg">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by team name, leader name, reg number, phone, or transaction ID..."
                className="w-full h-[44px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 focus:border-[#536BFF] text-xs text-white placeholder-white/30 outline-none transition-all"
              />
            </div>

            {/* Filters dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <Filter className="w-3.5 h-3.5 text-[#8DA2FF]" />
                <span>Payment:</span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="h-[38px] px-3 rounded-full bg-[#0d122b] border border-white/15 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending ({pendingPaymentsCount})</option>
                  <option value="approved">Approved ({approvedCount})</option>
                  <option value="rejected">Rejected ({rejectedCount})</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <span>Residence:</span>
                <select
                  value={residenceFilter}
                  onChange={(e) => setResidenceFilter(e.target.value as any)}
                  className="h-[38px] px-3 rounded-full bg-[#0d122b] border border-white/15 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="all">All Residence</option>
                  <option value="hosteller">Hostellers</option>
                  <option value="day_scholar">Day Scholars</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                <span>Members:</span>
                <select
                  value={membersFilter}
                  onChange={(e) => setMembersFilter(e.target.value as any)}
                  className="h-[38px] px-3 rounded-full bg-[#0d122b] border border-white/15 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="all">All Counts</option>
                  <option value="4">4 Members</option>
                  <option value="5">5 Members</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono">
            <div className="text-white/60">
              Showing <span className="text-white font-bold">{filteredTeams.length}</span> of {teams.length} Teams
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportTeamsToCSV(filteredTeams)}
                className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-400 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>

              <button
                onClick={() => openPrintablePDF(filteredTeams, 'DISFRUTAR 2K26 Registration Report')}
                className="px-3.5 py-1.5 rounded-full bg-[#536BFF]/20 border border-[#536BFF]/40 hover:bg-[#536BFF]/30 text-[#8DA2FF] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Overall PDF</span>
              </button>

              <button
                onClick={() => {
                  const hostellerTeams = teams.filter(t => t.members.some(m => m.residenceType === 'Hosteller'));
                  openPrintablePDF(hostellerTeams, 'Hostellers Allocation Report', 'Only Hostel Resident Teams');
                }}
                className="px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 hover:bg-blue-500/25 text-blue-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Hostellers PDF</span>
              </button>

              <button
                onClick={() => {
                  const dayScholarTeams = teams.filter(t => t.members.some(m => m.residenceType === 'Day Scholar'));
                  openPrintablePDF(dayScholarTeams, 'Day Scholars Report', 'Only Local Commuter Teams');
                }}
                className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 text-purple-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Day Scholars PDF</span>
              </button>

              <button
                onClick={() => {
                  const pendingTeams = teams.filter(t => t.paymentStatus === 'pending');
                  openPrintablePDF(pendingTeams, 'Pending Payments Audit Report', 'Teams awaiting UPI manual verification');
                }}
                className="px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Payments PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* BULK ACTION BAR */}
        {selectedTeamIds.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#536BFF]/15 border border-[#536BFF]/40 flex items-center justify-between gap-4 animate-fade-in">
            <div className="text-xs font-mono text-white font-bold flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#8DA2FF]" />
              <span>{selectedTeamIds.length} Teams Selected for Bulk Verification</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTeamIds([])}
                className="text-xs font-mono text-white/60 hover:text-white"
              >
                Deselect All
              </button>
              <button
                onClick={handleBulkApprove}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-space text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Bulk Approve Selected</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB SPECIFIC CONTENT */}
        {activeTab === 'reports' ? (
          <div className="p-8 rounded-3xl bg-[#07091C] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold font-space text-white">Event Operational Reports & PDF Export</h3>
            <p className="text-xs font-mono text-white/60">
              Download clean, standardized ACM DISFRUTAR 2K26 reports for organizing committees and venue check-in counters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold font-space text-white">Complete Master Team Roster (CSV)</h4>
                <p className="text-xs font-mono text-white/50">Includes all team leader contacts, member lists, residence details, hostel rooms, and payment status.</p>
                <button
                  onClick={() => exportTeamsToCSV(teams)}
                  className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Master CSV</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <h4 className="text-sm font-bold font-space text-white">Pending Verification Audit List (PDF)</h4>
                <p className="text-xs font-mono text-white/50">Generates a dedicated verification sheet listing pending UPI transaction IDs and amounts.</p>
                <button
                  onClick={() => {
                    const pendingTeams = teams.filter(t => t.paymentStatus === 'pending');
                    openPrintablePDF(pendingTeams, 'Pending Payments Audit Report', 'Teams awaiting UPI manual verification');
                  }}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Pending Audit PDF</span>
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="p-8 rounded-3xl bg-[#07091C] border border-white/10 space-y-6">
            <h3 className="text-xl font-bold font-space text-white">Admin Command Center Settings</h3>
            
            <div className="space-y-4 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-[#8DA2FF] font-bold uppercase">Administrator Credentials</div>
                <div>Primary Email: <span className="text-white font-bold">99240041356@klu.ac.in</span></div>
                <div>Access Password: <span className="text-white font-bold">disfrutar24k6</span></div>
                <div className="text-white/40 pt-1">Session state is retained locally during organizer operations.</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="text-[#8DA2FF] font-bold uppercase">Database Sync Engine</div>
                <div className="text-emerald-400">Direct Frontend Reactive Storage Engine</div>
                <div className="text-white/50">Synchronized across client registration sessions.</div>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN CLEAN UNCLUTTERED ROSTER TABLE / GRID */
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold font-space text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#8DA2FF]" />
                  Registered Teams Roster ({filteredTeams.length})
                </h3>
                
                {/* View Mode Switcher */}
                <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'table' ? 'bg-[#536BFF] text-white font-bold' : 'text-white/50 hover:text-white'
                    }`}
                    title="Table View"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Table</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-md text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'cards' ? 'bg-[#536BFF] text-white font-bold' : 'text-white/50 hover:text-white'
                    }`}
                    title="Cards View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Cards</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  const allFilteredIds = filteredTeams.map(t => t.id);
                  if (selectedTeamIds.length === allFilteredIds.length) {
                    setSelectedTeamIds([]);
                  } else {
                    setSelectedTeamIds(allFilteredIds);
                  }
                }}
                className="text-xs font-mono text-[#8DA2FF] hover:underline cursor-pointer"
              >
                {selectedTeamIds.length === filteredTeams.length ? 'Deselect All' : 'Select All Filtered'}
              </button>
            </div>

            {filteredTeams.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#07091C] border border-white/10 space-y-3">
                <Search className="w-8 h-8 text-white/30 mx-auto" />
                <div className="text-sm font-bold text-white font-space">No teams match your search or filters</div>
                <p className="text-xs font-mono text-white/50">Try clearing your search query or choosing "All Payments".</p>
              </div>
            ) : viewMode === 'table' ? (
              /* CLEAN DENSE TABLE VIEW */
              <div className="rounded-2xl border border-white/10 bg-[#07091C] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/[0.03] border-b border-white/10 text-white/50 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedTeamIds.length === filteredTeams.length && filteredTeams.length > 0}
                            onChange={() => {
                              if (selectedTeamIds.length === filteredTeams.length) {
                                setSelectedTeamIds([]);
                              } else {
                                setSelectedTeamIds(filteredTeams.map(t => t.id));
                              }
                            }}
                            className="rounded accent-[#536BFF] cursor-pointer"
                          />
                        </th>
                        <th className="p-3.5">Team ID</th>
                        <th className="p-3.5">Team Name</th>
                        <th className="p-3.5">Leader Details</th>
                        <th className="p-3.5">Members</th>
                        <th className="p-3.5">Txn ID & Fee</th>
                        <th className="p-3.5">Payment Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-white/80">
                      {filteredTeams.map((team) => {
                        const leader = team.members[0] || {};
                        const isSelected = selectedTeamIds.includes(team.id);

                        return (
                          <tr 
                            key={team.id}
                            className={`hover:bg-white/[0.02] transition-colors ${
                              isSelected ? 'bg-[#536BFF]/10' : ''
                            }`}
                          >
                            <td className="p-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectTeam(team.id)}
                                className="rounded accent-[#536BFF] cursor-pointer"
                              />
                            </td>
                            <td className="p-3.5 font-bold text-white font-space whitespace-nowrap">
                              {team.id}
                            </td>
                            <td className="p-3.5 font-bold text-white font-space">
                              {team.teamName}
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white">{leader.name || 'N/A'}</div>
                              <div className="text-[10px] text-white/50">{leader.registerNumber} • {leader.phone}</div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-bold">
                                {team.memberCount} Members
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="text-emerald-400 font-bold">₹{team.amount}</div>
                              <div className="text-[10px] text-[#8DA2FF] font-mono truncate max-w-[120px]">{team.transactionId}</div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                                team.paymentStatus === 'approved'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : team.paymentStatus === 'rejected'
                                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              }`}>
                                {team.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                {team.paymentStatus === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprovePayment(team.id)}
                                      className="p-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white cursor-pointer transition-all"
                                      title="Approve Payment"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setQuickRejectTeam(team)}
                                      className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white cursor-pointer transition-all"
                                      title="Reject Payment"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => setSelectedDetailTeam(team)}
                                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#536BFF] hover:text-white text-white/80 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* GRID CARDS VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => {
                  const leader = team.members[0] || {};
                  const isSelected = selectedTeamIds.includes(team.id);

                  return (
                    <div
                      key={team.id}
                      className={`p-5 rounded-2xl border transition-all duration-200 space-y-3 flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#536BFF]/10 border-[#536BFF]' 
                          : 'bg-[#07091C] border-white/10 hover:border-[#536BFF]/50'
                      }`}
                    >
                      {/* Top row ID & status badge */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleSelectTeam(team.id)}
                          className="flex items-center gap-2 text-xs font-mono text-white/70 hover:text-white cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#536BFF]" />
                          ) : (
                            <Square className="w-4 h-4 text-white/30" />
                          )}
                          <span className="font-bold text-white/90">{team.id}</span>
                        </button>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                          team.paymentStatus === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : team.paymentStatus === 'rejected'
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}>
                          {team.paymentStatus}
                        </span>
                      </div>

                      {/* Team Title & Leader Info */}
                      <div>
                        <h4 className="text-lg font-bold font-space text-white group-hover:text-[#8DA2FF] transition-colors leading-snug">
                          {team.teamName}
                        </h4>
                        <p className="text-xs font-mono text-white/60 mt-1">
                          Leader: <strong className="text-white">{leader.name || 'N/A'}</strong> ({leader.registerNumber || 'Reg N/A'})
                        </p>
                        <p className="text-[11px] font-mono text-white/40 mt-0.5">
                          Phone: {leader.phone || 'N/A'}
                        </p>
                      </div>

                      {/* Details meta */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono">
                        <div>
                          <span className="text-white/40 block">Members</span>
                          <strong className="text-white">{team.memberCount} Members</strong>
                        </div>
                        <div>
                          <span className="text-white/40 block">Txn Fee</span>
                          <strong className="text-emerald-400">₹{team.amount}</strong>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-white/5 text-[10px] text-white/50 truncate">
                          Txn ID: <span className="text-[#8DA2FF] font-bold">{team.transactionId}</span>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {team.paymentStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprovePayment(team.id)}
                                className="px-3 py-1.5 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                title="Approve Payment"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => setQuickRejectTeam(team)}
                                className="px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                                title="Reject Payment"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedDetailTeam(team)}
                          className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#536BFF] hover:text-white text-white/80 text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ml-auto"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODALS */}
      {selectedDetailTeam && (
        <TeamDetailModal
          team={selectedDetailTeam}
          onClose={() => setSelectedDetailTeam(null)}
          onApprove={handleApprovePayment}
          onReject={handleRejectPayment}
          onEdit={(t) => {
            setSelectedDetailTeam(null);
            setSelectedEditTeam(t);
          }}
          onDelete={handleDeleteTeam}
        />
      )}

      {selectedEditTeam && (
        <TeamEditModal
          team={selectedEditTeam}
          onClose={() => setSelectedEditTeam(null)}
          onSave={handleSaveEditTeam}
        />
      )}

      {quickRejectTeam && (
        <QuickRejectModal
          teamName={quickRejectTeam.teamName}
          onClose={() => setQuickRejectTeam(null)}
          onConfirmReject={(reason) => handleRejectPayment(quickRejectTeam.id, reason)}
        />
      )}

    </div>
  );
};
