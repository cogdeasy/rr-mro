import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api.service';

export function useTriageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => apiService.triageRequest(requestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['request'] });
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useGenerateDocumentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, authoredBy }: { requestId: string; authoredBy: string }) =>
      apiService.generateDocument(requestId, authoredBy),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['request'] });
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useCreateRequestMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => apiService.createRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useUpdateStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, actor }: { id: string; status: string; actor: string }) =>
      apiService.updateStatus(id, status, actor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['request'] });
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

export function useAddCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { content: string; author: string; authorRole: string; isInternal: boolean };
    }) => apiService.addComment(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['request'] });
    },
  });
}
