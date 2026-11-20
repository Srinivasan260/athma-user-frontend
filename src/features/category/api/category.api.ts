import { apiClient } from '@/lib/api-client';
import type { ApiEnvelope } from '@/types/api';
import type { Category, CategoryDetail } from '../types';

export const categoryApi = {
  /** GET /api/v1/categories — active categories with active-question counts. */
  list: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ApiEnvelope<Category[]> | Category[]>('/categories');
    // Handle both envelope `{ success, data: [...] }` and a bare array,
    // and guarantee the hook never resolves to undefined.
    if (Array.isArray(data)) return data;
    return data?.data ?? [];
  },

  /** GET /api/v1/categories/:id — single active category for the run sidebar. */
  getById: async (id: string): Promise<CategoryDetail> => {
    const { data } = await apiClient.get<ApiEnvelope<CategoryDetail>>(`/categories/${id}`);
    return data.data;
  },
};
