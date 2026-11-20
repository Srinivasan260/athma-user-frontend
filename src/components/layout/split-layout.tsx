import { type ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface SplitLayoutProps {
  heroTitle: string;
  heroSubtitle: string;
  children: ReactNode;
}

/**
 * Split-screen layout used by the login page:
 * - Left panel: dark navy with logo + marketing + trust badge
 * - Right panel: white card with the actual form (passed as children)
 */
export function SplitLayout({ heroTitle, heroSubtitle, children }: SplitLayoutProps) {
  return (
    <div className="bg-auth min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
        <div className="grid w-full overflow-hidden rounded-2xl bg-white shadow-lift lg:grid-cols-2">
          {/* Hero panel */}
          <aside className="relative hidden flex-col justify-between bg-gradient-to-br from-navy-700 to-navy-900 p-10 text-white lg:flex">
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/5"
            />
            <div
              aria-hidden
              className="absolute -bottom-16 -left-10 h-72 w-72 rounded-full bg-white/5"
            />

            <div className="relative">
              <div className="inline-flex rounded-xl bg-white/10 p-3 backdrop-blur">
                <Logo />
              </div>
            </div>

            <div className="relative space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight">{heroTitle}</h1>
              <p className="max-w-sm text-white/70">{heroSubtitle}</p>
            </div>

            <div className="relative flex items-start gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="text-sm">
                <div className="font-semibold">Private and confidential</div>
                <div className="text-white/60">Your details are only used for your care.</div>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <section className="p-8 sm:p-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
