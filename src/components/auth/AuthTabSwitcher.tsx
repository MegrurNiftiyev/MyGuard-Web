import React from 'react';

export interface AuthTabSwitcherProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export const AuthTabSwitcher: React.FC<AuthTabSwitcherProps> = ({ mode, onModeChange }) => {
  return (
    <div className="relative flex items-center bg-surface-container-low p-1 rounded-2xl mb-6 border border-outline-variant/50">
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-blue rounded-xl shadow-xs transition-transform duration-300 ease-out ${
          mode === 'login' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'
        }`}
      />
      <button
        type="button"
        onClick={() => onModeChange('login')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer text-center ${
          mode === 'login' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Daxil ol
      </button>
      <button
        type="button"
        onClick={() => onModeChange('register')}
        className={`relative z-10 flex-1 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer text-center ${
          mode === 'register' ? 'text-white' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        Qeydiyyat
      </button>
    </div>
  );
};
