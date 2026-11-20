import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightIcon, invalid, className, ...rest },
  ref,
) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'h-12 w-full rounded-xl border bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-ring disabled:cursor-not-allowed disabled:bg-ink-50',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          invalid ? 'border-red-400' : 'border-ink-200 hover:border-ink-300',
          className,
        )}
        aria-invalid={invalid || undefined}
        {...rest}
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-3 flex items-center text-ink-400">
          {rightIcon}
        </span>
      )}
    </div>
  );
});
