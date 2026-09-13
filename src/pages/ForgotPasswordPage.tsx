import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail, Fingerprint, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AuthFloatingOrbsBackground } from '../components/auth/AuthFloatingOrbsBackground';
import { authApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [finOrEmail, setFinOrEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: any;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus first OTP input when step 2 opens
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!finOrEmail.trim()) {
      setErrorMsg('Zəhmət olmasa FİN kod və ya e-poçt daxil edin.');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(finOrEmail.trim());
      setStep(2);
      setResendTimer(45);
    } catch (err: any) {
      console.warn('Forgot password request error:', err);
      setErrorMsg(err.message || 'OTP kod göndərilərkən xəta baş verdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setErrorMsg('Zəhmət olmasa 6 rəqəmli OTP təsdiqləmə kodunu tam daxil edin.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authApi.checkOtp(finOrEmail.trim(), fullOtp);
      if (res && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
      } else {
        throw new Error('Reset token verilmədi.');
      }
    } catch (err: any) {
      console.warn('Check OTP error:', err);
      setErrorMsg(err.message || 'OTP kod yanlışdır və ya müddəti bitib.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (newPassword.length < 6) {
      setErrorMsg('Şifrə minimum 6 simvoldan ibarət olmalıdır.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Daxil edilən şifrələr üst-üstə düşmür.');
      return;
    }
    setIsSubmitting(true);
    try {
      await authApi.changePassword(finOrEmail.trim(), newPassword, resetToken);
      
      // Auto login user with newly set password immediately!
      try {
        await login({ finCode: finOrEmail.trim(), password: newPassword });
        navigate('/');
        return;
      } catch (loginErr) {
        console.warn('Auto login after password reset failed, showing success step:', loginErr);
        setStep(4);
      }
    } catch (err: any) {
      console.warn('Change password error:', err);
      setErrorMsg(err.message || 'Şifrəni yeniləmək mümkün olmadı.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setErrorMsg(null);
    try {
      await authApi.resendOtp(finOrEmail.trim());
      setResendTimer(45);
      setOtp(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err: any) {
      console.warn('Resend OTP error:', err);
      setErrorMsg(err.message || 'Kodu təkrar göndərmək mümkün olmadı.');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-10 px-4 relative">
      <AuthFloatingOrbsBackground />

      <div className="w-full max-w-md space-y-6 relative z-10 my-auto transition-all duration-500 ease-out">
        {/* Glass Card Container matching LoginPage */}
        <Card
          padding="lg"
          className="border-outline-variant/80 shadow-2xl bg-surface-container-lowest/85 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500 ease-in-out"
        >
          {/* Top Navigation Back Link */}
          {step < 4 && (
            <button
              type="button"
              onClick={() => {
                if (step === 1) navigate('/login');
                else setStep((prev) => (prev - 1) as 1 | 2 | 3);
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-brand-blue transition-colors mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{step === 1 ? t('backToLogin') : t('previousStep')}</span>
            </button>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: ENTER FIN / EMAIL */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5 animate-in fade-in duration-400">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-on-surface font-sans">
                  {t('restorePasswordTitle')}
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  {t('enterFinOrEmailPrompt')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  {t('finOrEmailLabel')}
                </label>
                <div className="relative">
                  <Fingerprint className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue" />
                  <input
                    type="text"
                    required
                    value={finOrEmail}
                    onChange={(e) => setFinOrEmail(e.target.value)}
                    placeholder="7AB1234 və ya email@domain.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-semibold"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all text-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('sending')}
                  </span>
                ) : (
                  <span>{t('sendOtpBtn')}</span>
                )}
              </Button>
            </form>
          )}

          {/* STEP 2: 6-DIGIT OTP CODE INPUT */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in duration-400">
              <div className="text-center space-y-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-on-surface font-sans">
                  {t('otpCodeTitle')}
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  <strong className="text-on-surface font-bold">{finOrEmail}</strong> {t('otpInstruction')}
                </p>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider text-center">
                  {t('otpLabel')}
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpInputsRef.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-2xl bg-surface-container border transition-all shadow-2xs font-mono ${
                        digit
                          ? 'border-brand-blue bg-blue-50/40 text-brand-blue ring-2 ring-blue-100'
                          : 'border-outline-variant/80 text-on-surface focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend Code Timer */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className="text-xs text-on-surface-variant font-medium">
                    {t('resendCode')}: <strong className="font-mono text-brand-blue font-bold">00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('resendCode')}</span>
                  </button>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || otp.join('').length !== 6}
                className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all text-center justify-center cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('verifying')}
                  </span>
                ) : (
                  <span>{t('confirmCodeBtn')}</span>
                )}
              </Button>
            </form>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-in fade-in duration-400">
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-on-surface font-sans">
                  {t('setNewPasswordTitle')}
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  {t('newPasswordPrompt')}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  {t('newPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                  {t('confirmNewPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all text-center justify-center cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('updating')}
                  </span>
                ) : (
                  <span>{t('updatePasswordBtn')}</span>
                )}
              </Button>
            </form>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center space-y-6 py-4 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md border border-emerald-200 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-on-surface font-sans">
                  {t('passwordUpdatedSuccess')}
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs mx-auto">
                  {t('passwordSuccessDesc')}
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all text-center justify-center cursor-pointer"
              >
                {t('goToLoginBtn')}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
