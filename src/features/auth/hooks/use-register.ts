import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { authApi } from '../api/auth.api';

function friendlyRegisterError(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) return "We couldn't reach the server. Check your connection and try again.";
    if (err.response.status === 409) return 'An account with this email already exists.';
    if (err.response.status === 422) {
      return err.response.data?.message ?? 'Some fields need attention. Please review the form.';
    }
    if (err.response.status >= 500) return 'Something went wrong on our end. Please try again.';
  }
  return 'Registration failed. Please try again.';
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export { friendlyRegisterError };
