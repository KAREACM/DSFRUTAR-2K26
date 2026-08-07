import { useState, useEffect } from 'react';
import { BootExperience } from './components/BootExperience';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { FaqSection } from './components/FaqSection';
import { MentorsSection } from './components/MentorsSection';
import { PrizesSection } from './components/PrizesSection';
import { Navbar } from './components/Navbar';
import { Footer } from './components/ui/footer-section';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationFlow } from './components/registration/RegistrationFlow';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

export default function App() {
  const [preloaderState, setPreloaderState] = useState<'playing' | 'fading' | 'completed'>('playing');
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'registration' | 'admin' | 'admin_dashboard'>('home');
  const [adminEmail, setAdminEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Listen for browser path changes (e.g. /admin)
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === '/admin') {
        setCurrentPage('admin');
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const handlePreloaderComplete = () => {
    setPreloaderState('fading');
    setTimeout(() => {
      setPreloaderState('completed');
    }, 500);
  };

  useEffect(() => {
    if (preloaderState === 'completed') {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.add('overflow-x-hidden', 'overflow-y-auto');
    } else {
      document.body.classList.add('overflow-hidden');
    }
  }, [preloaderState]);

  // Reset scroll position on page transition
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPage]);

  const handleGoToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setCurrentPage('admin');
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
  };

  return (
    <div className="relative w-full min-h-screen bg-[#050814] text-white">
      
      {/* Fixed Sticky Navigation Bar */}
      {preloaderState !== 'playing' && currentPage === 'home' && (
        <Navbar 
          isVisible={preloaderState === 'fading' || preloaderState === 'completed'} 
          onRegisterClick={() => setCurrentPage('login')}
          onHomeClick={handleBackToHome}
        />
      )}

      {/* Main Content Pages */}
      {preloaderState !== 'playing' && (
        currentPage === 'home' ? (
          <>
            <HeroSection 
              isVisible={preloaderState === 'fading' || preloaderState === 'completed'} 
              onRegisterClick={() => setCurrentPage('login')}
            />
            <AboutSection />
            <MentorsSection />
            <PrizesSection />
            <FaqSection />
            <Footer />
          </>
        ) : currentPage === 'login' ? (
          <LoginScreen 
            onBack={handleBackToHome} 
            onSuccessLogin={(email) => {
              if (email) setUserEmail(email);
              setCurrentPage('registration');
            }}
            onAdminSuccessLogin={(email) => {
              setAdminEmail(email);
              setCurrentPage('admin_dashboard');
            }}
            onGoToAdmin={handleGoToAdmin}
          />
        ) : currentPage === 'registration' ? (
          <RegistrationFlow 
            onBackToPortal={handleBackToHome}
            userEmail={userEmail}
          />
        ) : currentPage === 'admin' ? (
          <AdminLogin
            onBack={handleBackToHome}
            onSuccessLogin={(email) => {
              setAdminEmail(email);
              setCurrentPage('admin_dashboard');
            }}
          />
        ) : (
          adminEmail === 'disfrutar2k26@klu.ac.in' ? (
            <AdminDashboard
              adminEmail={adminEmail}
              onLogout={() => {
                setAdminEmail('');
                handleBackToHome();
              }}
            />
          ) : (
            <LoginScreen 
              onBack={handleBackToHome} 
              onSuccessLogin={(email) => {
                if (email) setUserEmail(email);
                setCurrentPage('registration');
              }}
              onAdminSuccessLogin={(email) => {
                setAdminEmail(email);
                setCurrentPage('admin_dashboard');
              }}
              onGoToAdmin={handleGoToAdmin}
            />
          )
        )
      )}

      {/* Preloader overlay with smooth opacity transition */}
      {preloaderState !== 'completed' && (
        <div 
          className={`fixed inset-0 z-50 transition-opacity duration-500 ease-out ${
            preloaderState === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <BootExperience onComplete={handlePreloaderComplete} />
        </div>
      )}
    </div>
  );
}
