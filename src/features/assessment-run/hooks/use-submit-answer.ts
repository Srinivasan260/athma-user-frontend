import { useMutation } from '@tanstack/react-query';
import { assessmentApi } from '../api/assessment.api';
import type { SubmitAnswerPayload } from '../types';

export function useSubmitAnswer(assessmentId: string | undefined) {
  return useMutation({
    mutationFn: (payload: SubmitAnswerPayload) => {
      if (!assessmentId) throw new Error('No assessment in progress');
      return assessmentApi.submitAnswer(assessmentId, payload);
    },
  });
}
