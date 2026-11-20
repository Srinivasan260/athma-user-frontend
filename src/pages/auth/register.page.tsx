import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/features/auth/components/register-form';
import type { RegisterFormValues } from '@/features/auth/schemas/register.schema';
import { friendlyRegisterError, useRegister } from '@/features/auth/hooks/use-register';
import type { RegisterRequest } from '@/features/auth/types';
import { ROUTES } from '@/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useRegister();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const handleSubmit = (values: RegisterFormValues) => {
    // RegisterFormValues already matches the backend shape 1:1 (after Phase 2 schema fixes).
    register.mutate(values as RegisterRequest, {
      onSuccess: (data) => setRegisteredEmail(data.email),
    });
  };

  if (registeredEmail) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-navy-800">
            You&apos;re all set
          </h1>
          <p className="mt-3 text-ink-500">
            We&apos;ve created your account for <span className="font-semibold text-ink-700">{registeredEmail}</span>.
            Sign in with the password you just created to continue.
          </p>
          <Button className="mt-8" size="lg" onClick={() => navigate(ROUTES.login)}>
            Go to login
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-800 sm:text-4xl">
          Let&apos;s get you registered
        </h1>
        <p className="text-ink-500">
          Takes about a minute. Matches you to the right care package.
        </p>
      </div>

      {register.isError && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{friendlyRegisterError(register.error)}</span>
        </div>
      )}

      <RegisterForm onSubmit={handleSubmit} isSubmitting={register.isPending} />

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </PublicLayout>
  );
}
