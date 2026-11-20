import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, checked, ...rest },
  ref,
) {
  return (
    <span className="relative inline-flex h-5 w-5 shrink-0">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          'peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-ink-300 bg-white transition-colors checked:border-brand-500 checked:bg-brand-500 focus-ring',
          className,
        )}
        {...rest}
      />
      <Check
        className="pointer-events-none absolute left-0 top-0 h-5 w-5 scale-0 text-white peer-checked:scale-100 transition-transform"
        strokeWidth={3}
        aria-hidden
      />
    </span>
  );
});
