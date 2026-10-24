import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const activeStyles = disabled ? '' : 'active:scale-[0.98]';

  const getVariantStyles = () => {
    if (disabled) {
      switch (variant) {
        case 'primary':
          return 'bg-primary-200 text-white/90 cursor-not-allowed shadow-md shadow-primary-200/30';
        case 'secondary':
          return 'bg-surface-100 text-gray-400 border border-surface-200 cursor-not-allowed';
        case 'danger':
          return 'bg-red-200 text-white/90 cursor-not-allowed shadow-md shadow-red-200/30';
        case 'ghost':
          return 'text-gray-300 cursor-not-allowed';
        default:
          return '';
      }
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 active:bg-primary-700';
      case 'secondary':
        return 'bg-white text-gray-700 border border-surface-200 hover:bg-surface-50 focus:ring-surface-300 shadow-sm';
      case 'ghost':
        return 'bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-200';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300 shadow-lg shadow-red-500/30 active:bg-red-700';
      default:
        return '';
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${activeStyles} ${getVariantStyles()} ${sizes[size]} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
