import React, { useState } from 'react';
import { Mail, Lock, User, Fingerprint, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (e: React.FormEvent) => void;
  isSimulating: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, isSimulating }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fin, setFin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        disabled={isSimulating}
        className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
      >
        {isSimulating ? (
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
  );
};
