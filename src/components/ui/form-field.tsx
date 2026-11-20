import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  optional,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="flex items-center gap-1 text-sm font-semibold text-ink-800">
        {label}
        {required && <span className="text-brand-500">*</span>}
        {optional && <span className="text-xs font-normal text-ink-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

/** Thin uppercase divider used to separate form sections ("ABOUT YOU", "ACCOUNT SECURITY"). */
export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <div className={cn('flex items-center gap-3 pt-2', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-ink-100" />
    </div>
  );
}
