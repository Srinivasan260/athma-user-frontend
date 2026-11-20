import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';
import { QUERY_KEYS } from '@/constants';

export function useCategory(categoryId: string | undefined) {
  return useQuery({
    queryKey: categoryId ? QUERY_KEYS.category(categoryId) : ['categories', 'none'],
    queryFn: () => categoryApi.getById(categoryId!),
    enabled: !!categoryId,
  });
}
