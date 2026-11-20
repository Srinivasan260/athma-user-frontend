import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { assessmentApi } from '../api/assessment.api';

function friendlyStartError(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) return "We couldn't reach the server. Check your connection and try again.";
    if (err.response.status === 404) return 'This assessment is no longer available.';
    if (err.response.status === 409) {
      return 'You already have this assessment in progress. Please finish it from your history before starting a new one.';
    }
    if (err.response.status >= 500) return 'Something went wrong on our end. Please try again.';
  }
  return "We couldn't start this assessment. Please try again.";
}

export function useStartAssessment() {
  return useMutation({
    mutationFn: assessmentApi.start,
  });
}

export { friendlyStartError };
