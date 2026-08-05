import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { signInStudent, signInStudentWithGoogle, handleGoogleRedirectResult, signInAdminUser, isKluEmail, isAdminCredentials } from '../lib/firebaseAuth';

interface LoginScreenProps {
  onBack: () => void;
  onSuccessLogin?: (userEmail?: string) => void;
  onAdminSuccessLogin?: (email: string) => void;
  onGoToAdmin?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onBack, 
  onSuccessLogin,
  onAdminSuccessLogin,
  onGoToAdmin
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const googleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    handleGoogleRedirectResult()
      .then((user) => {
        if (user) {
          setIsSuccess(true);
          setTimeout(() => {
            const cleanEmail = user.email ? user.email.trim().toLowerCase() : '';
            if (cleanEmail === 'disfrutar2k26@klu.ac.in') {
              if (onAdminSuccessLogin) onAdminSuccessLogin(cleanEmail);
              else if (onSuccessLogin) onSuccessLogin(cleanEmail);
              else onBack();
            } else if (onSuccessLogin) {
              onSuccessLogin(cleanEmail);
            } else {
              onBack();
            }
          }, 1000);
        }
      })
      .catch((err) => {
        setErrorMessage(err.message || 'Google Authentication failed.');
      });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty('--mouse-x', `${x}px`);
    btn.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = (ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current;
    if (!btn) return;
    btn.style.setProperty('--mouse-x', '50%');
    btn.style.setProperty('--mouse-y', '50%');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await signInStudentWithGoogle();
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        const cleanEmail = user.email ? user.email.trim().toLowerCase() : '';
        // Only exact admin email enjoys Admin privileges
        if (cleanEmail === 'disfrutar2k26@klu.ac.in') {
          if (onAdminSuccessLogin) onAdminSuccessLogin(cleanEmail);
          else if (onSuccessLogin) onSuccessLogin(cleanEmail);
          else onBack();
        } else if (onSuccessLogin) {
          onSuccessLogin(cleanEmail);
        } else {
          onBack();
        }
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Google Authentication failed. Please verify your @klu.ac.in account.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all the authorization parameters.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    setIsLoading(true);
    setErrorMessage('');

    // Check if user entered exact Admin credentials (disfrutar2k26@klu.ac.in / disfrutar@2k26klu)
    if (isAdminCredentials(cleanEmail, cleanPass)) {
      try {
        await signInAdminUser(cleanEmail, cleanPass);
      } catch (e) {
        // Continue with session
      }
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onAdminSuccessLogin) {
          onAdminSuccessLogin(cleanEmail);
        } else if (onSuccessLogin) {
          onSuccessLogin(cleanEmail);
        } else {
          onBack();
        }
      }, 1000);
      return;
    }

    // Validate university email domain @klu.ac.in
    if (!isKluEmail(cleanEmail)) {
      setIsLoading(false);
      setErrorMessage('Please login using your University Email (@klu.ac.in)');
      return;
    }

    try {
      await signInStudent(cleanEmail, password);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccessLogin) {
          onSuccessLogin(cleanEmail);
        } else {
          onBack();
        }
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="relative min-h-screen w-full text-white flex flex-col items-center justify-center font-space overflow-y-auto select-none px-4 py-8 sm:py-12">
      
      {/* 1. Master Depth Background System matching DESIGN.md */}
      <div className="absolute inset-0 bg-[#06080B] z-0 pointer-events-none" />
      
      {/* Upper Ambient Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] opacity-25 blur-[120px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(100, 160, 255, 0.1) 0%, rgba(80, 167, 216, 0.03) 60%, transparent 100%)'
        }}
      />

      {/* Center Ambient Light behind the Login panel */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] h-[500px] opacity-35 blur-[100px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(80, 170, 255, 0.12) 0%, rgba(83, 107, 255, 0.04) 50%, transparent 100%)'
        }}
      />

      {/* Edge Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/80 pointer-events-none z-0" />

      {/* Background Engineering Grids */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      />
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(120, 180, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120, 180, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      {/* 2. Professional Back to Home button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 sm:absolute sm:top-6 sm:left-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/12 bg-white/[0.04] backdrop-blur-md text-white/80 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 text-xs sm:text-sm cursor-pointer z-20 group shrink-0"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Portal</span>
      </motion.button>

      {/* 3. Main Login Card Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#07091C]/80 border border-white/12 rounded-[24px] p-5 sm:p-8 backdrop-blur-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.85)] z-10 overflow-hidden my-auto"
      >
        {/* Glowing border accents */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#536BFF]/70 to-transparent blur-[0.5px]" />
        
        {/* Corner highlights inside login card */}
        <div className="absolute -top-[5px] -left-[5px] w-5 h-5 rounded-full bg-[#536BFF] opacity-20 blur-md" />
        <div className="absolute -bottom-[5px] -right-[5px] w-5 h-5 rounded-full bg-[#536BFF] opacity-20 blur-md" />

        {/* Custom loading / success screen overlay inside card */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#07091C]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
            <Loader2 className="w-10 h-10 text-[#536BFF] animate-spin mb-4" />
            <span className="text-[14px] font-mono tracking-[0.2em] uppercase text-white/90">
              Initializing Handshake
            </span>
            <span className="text-xs text-[#536BFF]/70 mt-2 font-mono">
              Verifying security credentials with KARE ACM...
            </span>
          </div>
        )}

        {isSuccess && (
          <div className="absolute inset-0 bg-[#07091C]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-[#536BFF] mb-4 animate-bounce" />
            <span className="text-[16px] font-bold tracking-[0.15em] text-white uppercase font-space">
              AUTHORIZED ACCESS
            </span>
            <span className="text-xs text-white/60 mt-2 font-mono">
              Welcome back to Disfrutar 2K26 system OS.
            </span>
          </div>
        )}

        {/* Card Header & Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src="/acm_logo.png" 
              alt="KARE ACM Logo" 
              className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(83,107,255,0.3)]"
              referrerPolicy="no-referrer"
            />
            <div className="h-4 w-px bg-white/20 mx-1" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#536BFF]">
              DISFRUTAR 2K26
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold font-space text-white tracking-[0.02em] leading-snug">
            Welcome Back
          </h2>
          <p className="text-white/50 text-[13px] mt-1 font-sans leading-relaxed">
            Verify credentials to enter the AI Hackathon Portal
          </p>
        </div>

        {/* Google Authentication Method */}
        <div className="space-y-4">
          <button
            ref={googleBtnRef}
            onMouseMove={(e) => handleMouseMove(e, googleBtnRef)}
            onMouseLeave={() => handleMouseLeave(googleBtnRef)}
            onClick={handleGoogleLogin}
            className="group relative w-full h-[46px] rounded-full text-white font-medium text-[13.5px] tracking-normal flex items-center justify-center gap-3 cursor-pointer overflow-hidden border border-white/10 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 60%), rgba(255, 255, 255, 0.04)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.1)'
            }}
          >
            {/* Customized premium Vector Google Icon */}
            <svg className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.13-1.19-.36-1.67-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="font-space font-medium text-white/90 group-hover:text-white">
              Continue with Google
            </span>
          </button>

          {/* Elegant Divider */}
          <div className="relative flex py-2 items-center justify-center">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-white/25 text-[11px] font-mono tracking-wider uppercase">
              Or authorize via key
            </span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Error Message banner */}
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-[12px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Email field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="block text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-white/50 pl-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="w-full h-[46px] pl-11 pr-5 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/18 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-300 text-sm placeholder-white/20 outline-none font-sans"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="block text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-white/50 pl-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-[46px] pl-11 pr-5 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/18 focus:border-[#536BFF] focus:ring-1 focus:ring-[#536BFF]/30 transition-all duration-300 text-sm placeholder-white/20 outline-none font-sans"
                  required
                />
              </div>
            </div>

            {/* Submit Button with matching background/radial pulse gradient */}
            <div className="pt-1.5">
              <button
                ref={submitBtnRef}
                onMouseMove={(e) => handleMouseMove(e, submitBtnRef)}
                onMouseLeave={() => handleMouseLeave(submitBtnRef)}
                type="submit"
                className="group relative w-full h-[48px] rounded-full text-white font-semibold text-[14px] sm:text-[15px] tracking-wide flex items-center justify-center gap-2 cursor-pointer overflow-hidden border border-white/14 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.18) 0%, transparent 60%), linear-gradient(180deg, #536BFF 0%, #4256F6 100%)',
                  boxShadow: '0 0 10px rgba(91,120,255,0.4), 0 0 24px rgba(91,120,255,0.25), inset 0 1px 1px rgba(255,255,255,0.18)'
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-white opacity-25 blur-[1px] pointer-events-none" />
                <span className="relative z-10 font-space">Login & Authenticate</span>
              </button>
            </div>

          </form>
        </div>

      </motion.div>

    </div>
  );
};
