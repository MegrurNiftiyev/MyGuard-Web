import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNavigation = () => {
    if (isAuthenticated) {
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
      <Card padding="lg" className="max-w-lg w-full text-center space-y-6 shadow-2xl border border-outline-variant/80 bg-surface-container-lowest/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-error-container/30 border border-error/30 text-error flex items-center justify-center shadow-lg relative">
            <ShieldAlert className="w-10 h-10 text-error animate-pulse" />
          </div>

          <span className="px-3 py-1 rounded-full text-label-sm font-extrabold bg-error/10 text-error border border-error/20 uppercase tracking-widest">
            404 — Səhifə Tapılmadı
          </span>

          <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">
            Axtarılan resurs mövcud deyil
          </h1>

          <p className="text-body-md text-on-surface-variant max-w-sm leading-relaxed">
            Daxil olduğunuz səhifə ünvanı səhvdir, silinib və ya başqa ünvana köçürülüb. Zəhmət olmasa daxil olma statusunuzu yoxlayın.
          </p>
        </div>

        <div className="pt-4 border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleNavigation}
            icon={isAuthenticated ? <Home className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold shadow-md cursor-pointer"
          >
            {isAuthenticated ? 'Əsas Panellərə Keç' : 'Daxil Ol'}
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl font-bold cursor-pointer"
          >
            Geri Qayıt
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
