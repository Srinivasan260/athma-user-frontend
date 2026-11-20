import { cn } from '@/lib/utils';
import { BRAND } from '@/constants';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-lift"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 3c-4 0-6 3-6 6 0 3 2 5 4 6-1 0-3 1-4 3M12 3c4 0 6 3 6 6 0 3-2 5-4 6 1 0 3 1 4 3" strokeLinecap="round" />
          </svg>
        </span>
        <div className="leading-tight">
          <div className="text-lg font-extrabold tracking-tight text-navy-800">
            {BRAND.hospitalName.split(' ')[0]}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
            Mind Care Hospital
          </div>
          <div className="text-[9px] italic text-brand-500">— {BRAND.tagline} —</div>
        </div>
      </div>
    </div>
  );
}
