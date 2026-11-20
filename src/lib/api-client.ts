import axios, { AxiosError, type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import { AUTH_TOKEN_KEY, ROUTES } from '@/constants';
import type { ApiErrorBody } from '@/types/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${env.apiUrl}${env.apiPrefix}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    // 401 on login endpoint is bad credentials — keep user on the form.
    // 401 anywhere else means expired/invalid session — drop token, bounce to login.
    const url = error.config?.url ?? '';
    const isLoginRequest = url.endsWith('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      if (window.location.pathname !== ROUTES.login) {
        window.location.href = ROUTES.login;
      }
    }

    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      error.message = serverMessage;
    }
    return Promise.reject(error);
  },
);
