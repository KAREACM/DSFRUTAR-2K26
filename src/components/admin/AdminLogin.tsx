import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
  onBack: () => void;
  onSuccessLogin: (adminEmail: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onSuccessLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickFill = () => {
    setEmail('99240041356@klu.ac.in');
    setPassword('disfrutar24k6');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail === '99240041356@klu.ac.in' && password === 'disfrutar24k6') {
        setIsLoading(false);
        onSuccessLogin(cleanEmail);
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials. Please verify your email and password.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#050814] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#536BFF]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-mono"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portal</span>
      </button>

      <div className="w-full max-w-md bg-[#07091C]/90 border border-[#536BFF]/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#536BFF]/20 border border-[#536BFF]/40 text-[#8DA2FF] mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-space text-white tracking-wide">
            DISFRUTAR 2K26
          </h1>
          <p className="text-xs font-mono text-[#8DA2FF] uppercase tracking-widest">
            Admin Portal Access
          </p>
        </div>

        {/* Quick Credentials Info Box */}
        <div className="p-3.5 rounded-2xl bg-[#536BFF]/10 border border-[#536BFF]/25 flex items-center justify-between gap-3 text-xs font-mono text-white/80">
          <div className="space-y-0.5">
            <div className="text-[10px] text-white/50 uppercase font-bold">Organizer Credentials</div>
            <div>Email: <span className="text-[#8DA2FF]">99240041356@klu.ac.in</span></div>
            <div>Pass: <span className="text-[#8DA2FF]">disfrutar24k6</span></div>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-3 py-1.5 rounded-xl bg-[#536BFF] hover:bg-[#4258e6] text-white text-[11px] font-bold transition-all shadow-md flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <KeyRound className="w-3 h-3" />
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono text-center animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
              Admin Email ID
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="99240041356@klu.ac.in"
                className="w-full h-[46px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/40 transition-all text-sm text-white placeholder-white/25 outline-none font-sans"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/60 pl-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-[46px] pl-11 pr-4 rounded-full bg-white/[0.04] border border-white/12 hover:border-white/20 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/40 transition-all text-sm text-white placeholder-white/25 outline-none font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[48px] mt-2 rounded-full bg-gradient-to-r from-[#536BFF] to-[#3B50DF] text-white font-space font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#536BFF]/25 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Login to Command Center</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
          KARE ACM DISFRUTAR 2K26 Security Enclave • Authorized Personnel Only
        </div>
      </div>
    </div>
  );
};
