import { useQuery } from '@tanstack/react-query';
import { assessmentApi } from '../api/assessment.api';
import { QUERY_KEYS } from '@/constants';

export function useAssessment(assessmentId: string | undefined) {
  return useQuery({
    queryKey: assessmentId ? QUERY_KEYS.assessment(assessmentId) : ['assessments', 'none'],
    queryFn: () => assessmentApi.getById(assessmentId!),
    enabled: !!assessmentId,
  });
}
