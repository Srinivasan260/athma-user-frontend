import { type ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface PublicLayoutProps {
  children: ReactNode;
  footerNote?: string;
}

/** Centered card layout with Athma logo on top — used by the register page. */
export function PublicLayout({
  children,
  footerNote = 'Your details are shared only with your assigned doctor.',
}: PublicLayoutProps) {
  return (
    <div className="bg-auth min-h-screen">
      <header className="flex justify-center pt-10">
        <Logo />
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-ink-100 bg-white/90 p-6 shadow-lift backdrop-blur sm:p-10">
          {children}
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          {footerNote}
        </p>
      </main>
    </div>
  );
}
