import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Mail } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

export function LoginForm({ onSubmit, isSubmitting, errorMessage }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          invalid={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message}>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          invalid={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
        {isSubmitting ? 'Please wait…' : 'Log in'}
      </Button>
    </form>
  );
}
