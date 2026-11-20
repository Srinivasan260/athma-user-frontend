import { apiClient } from '@/lib/api-client';
import type { ApiEnvelope } from '@/types/api';
import type {
  AnswerResult,
  AssessmentDetail,
  FinalizeAssessmentResult,
  StartAssessmentPayload,
  StartAssessmentResult,
  SubmitAnswerPayload,
} from '../types';

export const assessmentApi = {
  /** POST /categories/:categoryId/assessments — start a new assessment. */
  start: async ({ categoryId }: StartAssessmentPayload): Promise<StartAssessmentResult> => {
    const { data } = await apiClient.post<ApiEnvelope<StartAssessmentResult>>(
      `/categories/${categoryId}/assessments`,
    );
    return data.data;
  },

  /** POST /assessments/:id/answers — record (or replace) an answer. Idempotent per questionId. */
  submitAnswer: async (
    assessmentId: string,
    payload: SubmitAnswerPayload,
  ): Promise<AnswerResult> => {
    const { data } = await apiClient.post<ApiEnvelope<AnswerResult>>(
      `/assessments/${assessmentId}/answers`,
      payload,
    );
    return data.data;
  },

  /** POST /assessments/:id/submit — finalize and compute risk level. */
  finalize: async (assessmentId: string): Promise<FinalizeAssessmentResult> => {
    const { data } = await apiClient.post<ApiEnvelope<FinalizeAssessmentResult>>(
      `/assessments/${assessmentId}/submit`,
    );
    return data.data;
  },

  /** GET /assessments/:id — get own assessment detail with results. */
  getById: async (assessmentId: string): Promise<AssessmentDetail> => {
    const { data } = await apiClient.get<ApiEnvelope<AssessmentDetail>>(
      `/assessments/${assessmentId}`,
    );
    return data.data;
  },
};
