import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  showLabel?: boolean;
  tone?: 'brand' | 'teal';
}

const FILL_TONES: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  brand: 'bg-gradient-to-r from-brand-400 to-brand-600',
  teal: 'bg-gradient-to-r from-teal-400 to-teal-600',
};

export function ProgressBar({
  value,
  max = 100,
  className,
  trackClassName,
  showLabel,
  tone = 'brand',
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn('h-1.5 w-full overflow-hidden rounded-full bg-ink-100', trackClassName)}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', FILL_TONES[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 text-xs font-medium text-ink-500">{Math.round(pct)}%</div>
      )}
    </div>
  );
}

interface StepsProgressProps {
  current: number;
  total: number;
  className?: string;
}

/** Discrete step bar used on the register screen. */
export function StepsProgress({ current, total, className }: StepsProgressProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-colors',
            i < current ? 'bg-brand-500' : 'bg-ink-100',
          )}
        />
      ))}
    </div>
  );
}
