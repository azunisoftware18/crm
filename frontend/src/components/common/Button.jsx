import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const VARIANTS = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'border border-slate-400 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-brand-500',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-brand-500',
  danger: 'bg-red-700 text-white shadow-sm hover:bg-red-800 focus-visible:ring-red-600',
  success: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 focus-visible:ring-emerald-600',
};
const SIZES = { sm: 'h-8 gap-1.5 px-3 text-xs', md: 'h-9 gap-2 px-4 text-sm', lg: 'h-11 gap-2 px-5 text-sm' };

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', icon: Icon, loading = false, disabled, className, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors sm:min-h-0',
        'cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant], SIZES[size], className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
});

export default Button;


