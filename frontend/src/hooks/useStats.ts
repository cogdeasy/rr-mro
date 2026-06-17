import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiService.getStats(),
  });
}
