import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export function useRequest(id: string | undefined) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => apiService.getRequest(id!),
    enabled: !!id,
  });
}
