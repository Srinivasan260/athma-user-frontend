import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';

function friendlyLoginError(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) return "We couldn't reach the server. Check your connection and try again.";
    if (err.response.status === 401) return 'Invalid email or password.';
    if (err.response.status === 403) {
      return 'This account cannot sign in here. Please use the admin portal.';
    }
    if (err.response.status >= 500) return 'Something went wrong on our end. Please try again.';
  }
  return 'Login failed. Please try again.';
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      queryClient.invalidateQueries();
      navigate(ROUTES.assessments);
    },
  });
}

export { friendlyLoginError };
