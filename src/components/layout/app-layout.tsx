import { Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';

/** Layout for authenticated patient pages (assessments list, quiz, results). */
export function AppLayout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <div className="bg-auth min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Button variant="outline" size="sm" leftIcon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
