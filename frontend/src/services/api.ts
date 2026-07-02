import {
  VarianceRequest,
  VarianceRequestSummary,
  DashboardStats,
  TriageResult,
  VarianceDocument,
  PagedResult,
  Comment,
} from '../models/variance-request';

const BASE_URL = 'http://localhost:5062/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

function buildParams(params?: Record<string, string | number | undefined>): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sp.set(key, String(value));
    }
  });
  const str = sp.toString();
  return str ? `?${str}` : '';
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
  const res = await fetch(`${BASE_URL}/variancerequests${buildParams(params)}`);
  return handleResponse<PagedResult<VarianceRequestSummary>>(res);
}

export async function getRequest(id: string): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests/${id}`);
  return handleResponse<VarianceRequest>(res);
}

export async function createRequest(data: Record<string, unknown>): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<VarianceRequest>(res);
}

export async function updateStatus(id: string, status: string, actor: string): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, actor }),
  });
  return handleResponse<VarianceRequest>(res);
}

export async function addComment(
  id: string,
  data: { content: string; author: string; authorRole: string; isInternal: boolean }
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/variancerequests/${id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Comment>(res);
}

export async function getStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/variancerequests/stats`);
  return handleResponse<DashboardStats>(res);
}

export async function triageRequest(requestId: string): Promise<TriageResult> {
  const res = await fetch(`${BASE_URL}/triage/${requestId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return handleResponse<TriageResult>(res);
}

export async function generateDocument(requestId: string, authoredBy: string): Promise<VarianceDocument> {
  const res = await fetch(`${BASE_URL}/documents/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, authoredBy }),
  });
  return handleResponse<VarianceDocument>(res);
}

export async function getDocument(requestId: string): Promise<VarianceDocument> {
  const res = await fetch(`${BASE_URL}/documents/${requestId}`);
  return handleResponse<VarianceDocument>(res);
}

export async function getEngineTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/engine-types`);
  return handleResponse<string[]>(res);
}

export async function getMroOrganisations(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/mro-organisations`);
  return handleResponse<string[]>(res);
}

export async function getAnomalyTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/anomaly-types`);
  return handleResponse<string[]>(res);
}
