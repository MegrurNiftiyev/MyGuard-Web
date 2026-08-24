import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Smartphone, 
  QrCode, 
  User, 
  Building2, 
  CheckCircle2, 
  Fingerprint,
  ExternalLink,
  X
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fin, setFin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Digital Identity Modal State (SİMA / Asan İmza / myGov)
  const [activeModal, setActiveModal] = useState<'asan' | 'sima' | 'mygov' | null>(null);
  const [asanPhone, setAsanPhone] = useState('');
  const [asanUserId, setAsanUserId] = useState('');
  const [isSimulatingAuth, setIsSimulatingAuth] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulatingAuth(true);
    setTimeout(() => {
      setIsSimulatingAuth(false);
      navigate('/');
    }, 1200);
  };

  const handleDigitalAuthSuccess = () => {
    setIsSimulatingAuth(true);
    setTimeout(() => {
      setIsSimulatingAuth(false);
      setActiveModal(null);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-180px)] flex items-center justify-center py-6 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Brand Logo */}
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

        {/* Auth Glass Card */}
        <Card padding="lg" className="border-outline-variant/80 shadow-xl bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          
          {/* Sliding Tab Switcher */}
          <div className="relative flex items-center bg-surface-container-low p-1 rounded-2xl mb-6 border border-outline-variant/50">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-blue rounded-xl shadow-xs transition-transform duration-300 ease-out ${
                mode === 'login' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
              }`}
            />
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer text-center ${
                mode === 'login' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Daxil ol
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer text-center ${
                mode === 'register' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Qeydiyyat
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    Ad, Soyad
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Samir Əliyev"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                    FİN Kod (Şəxsiyyət Vəsiqəsi)
                  </label>
                  <div className="relative">
                    <Fingerprint className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                    <input
                      type="text"
                      required
                      maxLength={7}
                      value={fin}
                      onChange={(e) => setFin(e.target.value.toUpperCase())}
                      placeholder="7AB1234"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface font-mono uppercase focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                E-poçt və ya FİN
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.mammadov@soc.gov.az"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                Şifrə
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-blue focus:ring-brand-blue/30 accent-brand-blue cursor-pointer"
                  />
                  <span>Məni xatırla</span>
                </label>
                <a href="#" className="font-bold text-brand-blue hover:underline">
                  Şifrəni unutmusunuz?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSimulatingAuth}
              className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isSimulatingAuth ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yoxlanılır...
                </span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Daxil ol' : 'Hesab Yarat'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60" />
            </div>
            <span className="relative bg-surface-container-lowest px-3 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              və ya milli rəqəmsal kimliklə
            </span>
          </div>

          {/* National Authentication Providers (myGov, SİMA, Asan İmza) */}
          <div className="space-y-2.5">
            {/* myGov Login Button */}
            <button
              type="button"
              onClick={() => setActiveModal('mygov')}
              className="w-full py-3 px-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  my
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-950 dark:text-blue-200">myGov Portal</p>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-400">Rəqəmsal Hökumət Girişi</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* SİMA İmza Button */}
            <button
              type="button"
              onClick={() => setActiveModal('sima')}
              className="w-full py-3 px-4 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/70 dark:bg-purple-950/40 hover:bg-purple-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-purple text-white flex items-center justify-center shadow-sm">
                  <Fingerprint className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-purple-950 dark:text-purple-200">SİMA İmza</p>
                  <p className="text-[11px] text-purple-700/80 dark:text-purple-400">Biometrik Rəqəmsal İmza</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-purple group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Asan İmza Button */}
            <button
              type="button"
              onClick={() => setActiveModal('asan')}
              className="w-full py-3 px-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/80 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Asan İmza</p>
                  <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">Mobil Elektron İmza</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-on-surface-variant/70">
          Giriş etməklə təhlükəsizlik qaydalarını qəbul etmiş olursunuz.
        </p>

      </div>

      {/* Interactive Modal Simulation for Digital Auth (Asan / SİMA / myGov) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModal === 'asan' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                  <h3 className="text-title-lg font-bold">Asan İmza ilə Giriş</h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Mobil nömrənizi və Asan İmza İdentifikasiya kodunuzu daxil edin.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Mobil Nömrə</label>
                    <input
                      type="text"
                      value={asanPhone}
                      onChange={(e) => setAsanPhone(e.target.value)}
                      placeholder="+994 50 123 45 67"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/80 bg-surface-container text-xs text-on-surface font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">İstifadəçi İD</label>
                    <input
                      type="text"
                      value={asanUserId}
                      onChange={(e) => setAsanUserId(e.target.value)}
                      placeholder="123456"
                      className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/80 bg-surface-container text-xs text-on-surface font-mono"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleDigitalAuthSuccess}
                  disabled={isSimulatingAuth}
                  className="w-full py-3 !bg-emerald-600 hover:!bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSimulatingAuth ? 'Sorğu göndərilir...' : 'Təsdiqlə və Daxil Ol'}
                </Button>
              </div>
            )}

            {activeModal === 'sima' && (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-brand-purple">
                  <Fingerprint className="w-7 h-7" />
                  <h3 className="text-title-lg font-bold">SİMA İmza QR Giriş</h3>
                </div>
                <p className="text-xs text-on-surface-variant">
                  SİMA mobil tətbiqi ilə aşağıdakı QR kodu skan edin və biometrik təsdiq verin.
                </p>

                <div className="w-44 h-44 mx-auto border-2 border-dashed border-brand-purple/40 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 flex items-center justify-center p-3">
                  <QrCode className="w-36 h-36 text-brand-purple animate-pulse" />
                </div>

                <Button
                  onClick={handleDigitalAuthSuccess}
                  disabled={isSimulatingAuth}
                  className="w-full py-3 !bg-brand-purple hover:!bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSimulatingAuth ? 'QR Təsdiqlənir...' : 'QR Skanını Təsdiqlə (Simulyasiya)'}
                </Button>
              </div>
            )}

            {activeModal === 'mygov' && (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-lg shadow-md">
                  my
                </div>
                <h3 className="text-title-lg font-bold text-on-surface">myGov Vahid Giriş Systemi</h3>
                <p className="text-xs text-on-surface-variant">
                  Vahid Rəqəmsal Hökumət Portalı vasitəsilə profiliniz təsdiqlənir.
                </p>

                <Button
                  onClick={handleDigitalAuthSuccess}
                  disabled={isSimulatingAuth}
                  className="w-full py-3 !bg-blue-600 hover:!bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSimulatingAuth ? 'myGov İdentifikasiyası...' : 'myGov Portalı İlə Daxil Ol'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
