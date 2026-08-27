import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { 
  AuthTabSwitcher, 
  AuthForm, 
  NationalAuthProviders, 
  DigitalAuthModal,
  AuthFloatingOrbsBackground
} from '../components/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<'sima' | 'mygov' | null>(null);

  const handleFormSubmit = async (formData: {
    finCode: string;
    password: string;
    fullName?: string;
    email?: string;
    phone?: string;
    rememberMe?: boolean;
  }) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      if (mode === 'login') {
        await login({
          finCode: formData.finCode,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });
      } else {
        await register({
          fullName: formData.fullName || 'İstifadəçi',
          finCode: formData.finCode,
          email: formData.email || `${formData.finCode.toLowerCase()}@soc.gov.az`,
          phone: formData.phone,
          password: formData.password,
          department: 'İnformasiya Təhlükəsizliyi',
        });
      }
      navigate('/');
    } catch (err: any) {
      console.warn('Auth error:', err);
      setErrorMsg(err.message || 'Daxil olarkən xəta baş verdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSelect = async (provider: 'sima' | 'mygov' | 'guest') => {
    if (provider === 'guest') {
      await login({ finCode: 'GUEST01', password: 'guestpassword' });
      navigate('/');
    } else {
      setActiveModal(provider);
    }
  };

  const handleDigitalAuthSuccess = async () => {
    setActiveModal(null);
    await login({ finCode: 'DIGITAL', password: 'digitalpassword' });
    navigate('/');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-10 px-4 relative">
      {/* Floating 3D Diagonal Shooting Comet Spheres Full Viewport Background */}
      <AuthFloatingOrbsBackground />

      <div className="w-full max-w-md space-y-6 relative z-10 my-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white border border-outline-variant/80 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-8 h-8 text-brand-blue" />
          </div>
          <h1 className="text-headline-md font-bold text-on-surface tracking-tight">
            MyGuard Security
          </h1>
          <p className="text-body-md text-on-surface-variant max-w-xs">
            Dövlət və Korporativ AI Sənəd Təhlükəsizliyi Platforması
          </p>
        </div>

        {/* Auth Glass Container */}
        <Card padding="lg" className="border-outline-variant/80 shadow-2xl bg-surface-container-lowest/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <AuthTabSwitcher mode={mode} onModeChange={(newMode) => { setMode(newMode); setErrorMsg(null); }} />

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          <AuthForm mode={mode} onSubmitData={handleFormSubmit} isSubmitting={isSubmitting} />

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60" />
            </div>
            <span className="relative bg-surface-container-lowest px-3 text-xs font-semibold text-on-surface-variant tracking-wider">
              və ya
            </span>
          </div>

          <NationalAuthProviders onSelectProvider={handleProviderSelect} />
        </Card>
      </div>

      {activeModal && (
        <DigitalAuthModal
          provider={activeModal}
          onClose={() => setActiveModal(null)}
          onSuccess={handleDigitalAuthSuccess}
        />
      )}
    </div>
  );
};

export default LoginPage;
