import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: readonly SelectOption[];
  placeholder?: string;
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder = 'Select', invalid, className, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-12 w-full appearance-none rounded-xl border bg-white pl-4 pr-10 text-sm text-ink-900 transition-colors focus-ring disabled:cursor-not-allowed disabled:bg-ink-50',
          invalid ? 'border-red-400' : 'border-ink-200 hover:border-ink-300',
          !rest.value && 'text-ink-400',
          className,
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden
      />
    </div>
  );
});
