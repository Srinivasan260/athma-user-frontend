import { useQuery } from '@tanstack/react-query';
import { questionApi } from '../api/question.api';
import { QUERY_KEYS } from '@/constants';

export function useCategoryQuestions(categoryId: string | undefined) {
  return useQuery({
    queryKey: categoryId ? QUERY_KEYS.categoryQuestions(categoryId) : ['categories', 'none', 'questions'],
    queryFn: () => questionApi.listByCategory(categoryId!),
    enabled: !!categoryId,
  });
}
