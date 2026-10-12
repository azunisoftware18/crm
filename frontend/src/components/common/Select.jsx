import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { fieldBase } from './Input';

/** options: array of strings or { value, label } */
const Select = forwardRef(function Select({ options = [], placeholder, error, className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={!!error}
        className={cn(fieldBase, 'h-10 min-h-11 appearance-none pl-3 pr-9 sm:min-h-0', error ? 'border-red-400' : 'border-slate-300', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
});

export default Select;


