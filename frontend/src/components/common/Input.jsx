import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

export const fieldBase =
  'block w-full rounded-lg border bg-white text-base text-slate-900 placeholder:text-slate-400 transition-colors sm:text-sm ' +
  'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500';

const Input = forwardRef(function Input({ icon: Icon, error, className, ...props }, ref) {
  return (
    <div className="relative">
      {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
      <input
        ref={ref}
        aria-invalid={!!error}
        className={cn(fieldBase, 'h-10 min-h-11 sm:min-h-0', Icon ? 'pl-9 pr-3' : 'px-3', error ? 'border-red-400' : 'border-slate-300', className)}
        {...props}
      />
    </div>
  );
});

export default Input;


