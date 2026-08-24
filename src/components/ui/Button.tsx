import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ai' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-brand-blue text-white hover:bg-blue-600 focus:ring-brand-blue shadow-sm',
    ai: 'bg-brand-purple text-white hover:bg-purple-500 focus:ring-brand-purple shadow-sm',
    outline: 'border border-brand-blue text-brand-blue hover:bg-blue-50 focus:ring-brand-blue',
    ghost: 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface focus:ring-outline',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-error shadow-sm'
  };

  const sizeStyles = {
    sm: 'text-label-sm px-4 py-2 gap-1.5',
    md: 'text-label-md px-6 py-3 gap-2',
    lg: 'text-body-md font-semibold px-8 py-4 gap-2.5'
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
