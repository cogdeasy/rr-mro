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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

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
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
  }
  const qs = searchParams.toString();
  return request<PagedResult<VarianceRequestSummary>>(
    `${BASE_URL}/variancerequests${qs ? `?${qs}` : ''}`
  );
}

export async function getRequest(id: string): Promise<VarianceRequest> {
  return request<VarianceRequest>(`${BASE_URL}/variancerequests/${id}`);
}

export async function createRequest(data: Record<string, unknown>): Promise<VarianceRequest> {
  return request<VarianceRequest>(`${BASE_URL}/variancerequests`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateStatus(
  id: string,
  status: string,
  actor: string
): Promise<VarianceRequest> {
  return request<VarianceRequest>(`${BASE_URL}/variancerequests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, actor }),
  });
}

export async function addComment(
  id: string,
  data: { content: string; author: string; authorRole: string; isInternal: boolean }
): Promise<Comment> {
  return request<Comment>(`${BASE_URL}/variancerequests/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getStats(): Promise<DashboardStats> {
  return request<DashboardStats>(`${BASE_URL}/variancerequests/stats`);
}

export async function triageRequest(requestId: string): Promise<TriageResult> {
  return request<TriageResult>(`${BASE_URL}/triage/${requestId}`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function generateDocument(
  requestId: string,
  authoredBy: string
): Promise<VarianceDocument> {
  return request<VarianceDocument>(`${BASE_URL}/documents/generate`, {
    method: 'POST',
    body: JSON.stringify({ requestId, authoredBy }),
  });
}

export async function getDocument(requestId: string): Promise<VarianceDocument> {
  return request<VarianceDocument>(`${BASE_URL}/documents/${requestId}`);
}

export async function getEngineTypes(): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/variancerequests/engine-types`);
}

export async function getMroOrganisations(): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/variancerequests/mro-organisations`);
}

export async function getAnomalyTypes(): Promise<string[]> {
  return request<string[]>(`${BASE_URL}/variancerequests/anomaly-types`);
}
