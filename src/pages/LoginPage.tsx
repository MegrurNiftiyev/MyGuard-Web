import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { 
  AuthTabSwitcher, 
  AuthForm, 
  NationalAuthProviders, 
  DigitalAuthModal 
} from '../components/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeModal, setActiveModal] = useState<'sima' | 'mygov' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      navigate('/');
    }, 1200);
  };

  const handleDigitalAuthSuccess = () => {
    setActiveModal(null);
    navigate('/');
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] flex items-center justify-center py-6 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md space-y-6">
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
        <Card padding="lg" className="border-outline-variant/80 shadow-xl bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <AuthTabSwitcher mode={mode} onModeChange={setMode} />
          
          <AuthForm mode={mode} onSubmit={handleSubmit} isSimulating={isSimulating} />

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60" />
            </div>
            <span className="relative bg-surface-container-lowest px-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              və ya milli rəqəmsal kimliklə
            </span>
          </div>

          <NationalAuthProviders onSelectProvider={setActiveModal} />
        </Card>

        <p className="text-center text-xs text-on-surface-variant/70">
          Giriş etməklə təhlükəsizlik qaydalarını qəbul etmiş olursunuz.
        </p>
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
