import { apiClient } from '@/lib/api-client';
import type { ApiEnvelope } from '@/types/api';
import type { PatientQuestion } from '../types';

export const questionApi = {
  /** GET /api/v1/categories/:categoryId/questions — active questions for the patient. */
  listByCategory: async (categoryId: string): Promise<PatientQuestion[]> => {
    const { data } = await apiClient.get<ApiEnvelope<PatientQuestion[]> | PatientQuestion[]>(
      `/categories/${categoryId}/questions`,
    );
    if (Array.isArray(data)) return data;
    return data?.data ?? [];
  },
};
