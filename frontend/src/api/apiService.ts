import axios from 'axios';
import type {
  VarianceRequest,
  VarianceRequestSummary,
  DashboardStats,
  TriageResult,
  VarianceDocument,
  PagedResult,
  Comment,
} from '../types/variance-request';

const api = axios.create({ baseURL: '/api' });

export async function getRequests(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  engineType?: string;
  mroOrganisation?: string;
  search?: string;
  sortBy?: string;
  sortDir?: string;
}): Promise<PagedResult<VarianceRequestSummary>> {
  const { data } = await api.get<PagedResult<VarianceRequestSummary>>(
    '/variancerequests',
    { params },
  );
  return data;
}

export async function getRequest(id: string): Promise<VarianceRequest> {
  const { data } = await api.get<VarianceRequest>(`/variancerequests/${id}`);
  return data;
}

export async function createRequest(
  body: Record<string, unknown>,
): Promise<VarianceRequest> {
  const { data } = await api.post<VarianceRequest>('/variancerequests', body);
  return data;
}

export async function updateStatus(
  id: string,
  status: string,
  actor: string,
): Promise<VarianceRequest> {
  const { data } = await api.patch<VarianceRequest>(
    `/variancerequests/${id}/status`,
    { status, actor },
  );
  return data;
}

export async function addComment(
  id: string,
  body: {
    content: string;
    author: string;
    authorRole: string;
    isInternal: boolean;
  },
): Promise<Comment> {
  const { data } = await api.post<Comment>(
    `/variancerequests/${id}/comments`,
    body,
  );
  return data;
}

export async function getStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/variancerequests/stats');
  return data;
}

export async function triageRequest(
  requestId: string,
): Promise<TriageResult> {
  const { data } = await api.post<TriageResult>(`/triage/${requestId}`, {});
  return data;
}

export async function generateDocument(
  requestId: string,
  authoredBy: string,
): Promise<VarianceDocument> {
  const { data } = await api.post<VarianceDocument>('/documents/generate', {
    requestId,
    authoredBy,
  });
  return data;
}

export async function getDocument(
  requestId: string,
): Promise<VarianceDocument> {
  const { data } = await api.get<VarianceDocument>(
    `/documents/${requestId}`,
  );
  return data;
}

export async function getEngineTypes(): Promise<string[]> {
  const { data } = await api.get<string[]>('/variancerequests/engine-types');
  return data;
}

export async function getMroOrganisations(): Promise<string[]> {
  const { data } = await api.get<string[]>(
    '/variancerequests/mro-organisations',
  );
  return data;
}

export async function getAnomalyTypes(): Promise<string[]> {
  const { data } = await api.get<string[]>('/variancerequests/anomaly-types');
  return data;
}
