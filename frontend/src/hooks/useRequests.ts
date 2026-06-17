import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export function useRequests(params?: Parameters<typeof apiService.getRequests>[0]) {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => apiService.getRequests(params),
    placeholderData: keepPreviousData,
  });
}
