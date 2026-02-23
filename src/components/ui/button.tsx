import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]',
      outline: 'border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-500 hover:scale-[1.02] active:scale-[0.98] transition-all',
      secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-500 hover:scale-[1.02] active:scale-[0.98]',
      ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 hover:scale-[1.02] active:scale-[0.98]',
      link: 'text-blue-600 underline-offset-4 hover:underline focus:ring-blue-500',
      gradient: 'bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 focus:ring-blue-500 shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]'
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-sm',
      lg: 'h-12 rounded-lg px-8 text-base',
      icon: 'h-10 w-10'
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
          'relative overflow-hidden group',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {props.children}
        </span>
        {variant === 'default' || variant === 'gradient' || variant === 'destructive' ? (
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };