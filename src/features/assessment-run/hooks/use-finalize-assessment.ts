import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assessmentApi } from '../api/assessment.api';
import { QUERY_KEYS } from '@/constants';

export function useFinalizeAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: string) => assessmentApi.finalize(assessmentId),
    // After resubmit, the cached detail (answers + stale results) is out of date.
    // Invalidate so the result page refetches fresh scored data.
    onSuccess: (_data, assessmentId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assessment(assessmentId) });
    },
  });
}
