import { apiClient } from '@/lib/api-client';
import type { ApiEnvelope } from '@/types/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types';

export const authApi = {
  register: async (payload: RegisterRequest): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<RegisterResponse>>(
      '/auth/register',
      payload,
    );
    return data.data;
  },

  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>('/auth/login', payload);
    return data.data;
  },
};
