import type {
  VarianceRequest,
  VarianceRequestSummary,
  DashboardStats,
  TriageResult,
  VarianceDocument,
  PagedResult,
  Comment,
} from '../models/variance-request.model';

const BASE_URL = 'http://localhost:5062/api';

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return qs ? `?${qs}` : '';
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export function getRequests(params?: {
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
  return request(`${BASE_URL}/variancerequests${buildQuery(params as Record<string, string | number | undefined>)}`);
}

export function getRequest(id: string): Promise<VarianceRequest> {
  return request(`${BASE_URL}/variancerequests/${id}`);
}

export function createRequest(data: Record<string, unknown>): Promise<VarianceRequest> {
  return request(`${BASE_URL}/variancerequests`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateStatus(id: string, status: string, actor: string): Promise<VarianceRequest> {
  return request(`${BASE_URL}/variancerequests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, actor }),
  });
}

export function addComment(
  id: string,
  data: { content: string; author: string; authorRole: string; isInternal: boolean },
): Promise<Comment> {
  return request(`${BASE_URL}/variancerequests/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getStats(): Promise<DashboardStats> {
  return request(`${BASE_URL}/variancerequests/stats`);
}

export function triageRequest(requestId: string): Promise<TriageResult> {
  return request(`${BASE_URL}/triage/${requestId}`, { method: 'POST', body: '{}' });
}

export function generateDocument(requestId: string, authoredBy: string): Promise<VarianceDocument> {
  return request(`${BASE_URL}/documents/generate`, {
    method: 'POST',
    body: JSON.stringify({ requestId, authoredBy }),
  });
}

export function getDocument(requestId: string): Promise<VarianceDocument> {
  return request(`${BASE_URL}/documents/${requestId}`);
}

export function getEngineTypes(): Promise<string[]> {
  return request(`${BASE_URL}/variancerequests/engine-types`);
}

export function getMroOrganisations(): Promise<string[]> {
  return request(`${BASE_URL}/variancerequests/mro-organisations`);
}

export function getAnomalyTypes(): Promise<string[]> {
  return request(`${BASE_URL}/variancerequests/anomaly-types`);
}
