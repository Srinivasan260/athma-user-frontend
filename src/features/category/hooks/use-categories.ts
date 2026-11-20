import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';
import { QUERY_KEYS } from '@/constants';

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: categoryApi.list,
  });
}
