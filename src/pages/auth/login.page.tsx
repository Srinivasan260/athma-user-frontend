import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from '@/components/layout/split-layout';
import { LoginForm } from '@/features/auth/components/login-form';
import type { LoginFormValues } from '@/features/auth/schemas/login.schema';
import { friendlyLoginError, useLogin } from '@/features/auth/hooks/use-login';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = (values: LoginFormValues) => {
    login.mutate(values);
  };

  return (
    <SplitLayout
      heroTitle="Good to see you again"
      heroSubtitle="Pick up right where you left off, at your own pace."
    >
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-6 flex items-center justify-end text-sm">
          <span className="text-ink-500">New here?&nbsp;</span>
          <Link to={ROUTES.register} className="font-semibold text-brand-600 hover:text-brand-700">
            Create account
          </Link>
        </div>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-navy-800">Welcome back</h1>
          <p className="text-ink-500">Log in with your registered email and password.</p>
        </div>

        <LoginForm
          onSubmit={handleSubmit}
          isSubmitting={login.isPending}
          errorMessage={login.isError ? friendlyLoginError(login.error) : undefined}
        />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink-100" />
          <span className="text-xs uppercase tracking-wider text-ink-400">or</span>
          <div className="h-px flex-1 bg-ink-100" />
        </div>

        <Button variant="outline" fullWidth size="lg" onClick={() => navigate(ROUTES.register)}>
          Create a new account
        </Button>
      </div>
    </SplitLayout>
  );
}
