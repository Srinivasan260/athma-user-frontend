import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-lift hover:from-brand-600 hover:to-brand-700 disabled:from-brand-300 disabled:to-brand-300',
  secondary: 'bg-ink-800 text-white hover:bg-ink-900 disabled:bg-ink-400',
  outline: 'border border-ink-200 bg-white text-ink-800 hover:bg-ink-50 disabled:text-ink-400',
  ghost: 'text-ink-700 hover:bg-ink-50 disabled:text-ink-400',
  link: 'text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth,
    isLoading,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all focus-ring disabled:cursor-not-allowed',
        variantStyles[variant],
        variant !== 'link' && sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});
