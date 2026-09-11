import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Fingerprint, Eye, EyeOff, Smartphone, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';

export const DEPARTMENTS = [
  'İnformasiya Texnologiyaları və Kibertəhlükəsizlik',
  'Maliyyə və İqtisadiyyat',
  'Hüquq və Komplaens',
  'İnsan Resursları (HR)',
  'Əməliyyatlar və Logistika',
  'Strateji İnkişaf və Layihələr',
  'Ümumi Şöbə və Dəftərxana'
] as const;

export interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmitData?: (data: {
    finCode: string;
    password: string;
    fullName?: string;
    email?: string;
    phone?: string;
    department?: string;
    rememberMe?: boolean;
  }) => void;
  isSubmitting?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmitData, isSubmitting = false }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fin, setFin] = useState('');
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitData) {
      onSubmitData({
        finCode: fin || '7AB1234',
        password,
        fullName: name,
        email,
        phone,
        department,
        rememberMe,
      });
    }
  };

  return (
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
              Departament Seçin
            </label>
            <div className="relative">
              <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-purple" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm font-semibold text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all appearance-none cursor-pointer"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Mobil Nömrə
            </label>
            <div className="relative">
              <Smartphone className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+994 (50) 123-45-67"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-mono"
              />
            </div>
          </div>
        </>
      )}

      {/* FIN Kod Field (Primary Login Field) */}
      <div>
        <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
          FİN Kod (Şəxsiyyət Vəsiqəsi)
        </label>
        <div className="relative">
          <Fingerprint className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-blue" />
          <input
            type="text"
            required
            maxLength={7}
            value={fin}
            onChange={(e) => setFin(e.target.value.toUpperCase())}
            placeholder="7AB1234"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container border border-outline-variant/80 text-sm text-on-surface font-mono uppercase tracking-widest focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all font-bold"
          />
        </div>
      </div>

      {mode === 'register' && (
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
            E-poçt Adresi
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
      )}

      {/* Password Field */}
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
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="font-bold text-brand-blue hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            Şifrəni unutmusunuz?
          </button>
        </div>
      )}

      {/* Clean Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-2xl font-bold text-sm shadow-md !bg-brand-blue hover:!bg-brand-blue-hover transition-all text-center justify-center mt-2 cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Yoxlanılır...
          </span>
        ) : (
          <span>{mode === 'login' ? 'Daxil ol' : 'Hesab Yarat'}</span>
        )}
      </Button>
    </form>
  );
};
