import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[96px] w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-ring disabled:cursor-not-allowed disabled:bg-ink-50',
        invalid ? 'border-red-400' : 'border-ink-200 hover:border-ink-300',
        className,
      )}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
});
