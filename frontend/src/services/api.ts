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
  return res.json();
}

export async function getRequest(id: string): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests/${id}`);
  return res.json();
}

export async function createRequest(data: Record<string, unknown>): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateStatus(id: string, status: string, actor: string): Promise<VarianceRequest> {
  const res = await fetch(`${BASE_URL}/variancerequests/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, actor }),
  });
  return res.json();
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
  return res.json();
}

export async function getStats(): Promise<DashboardStats> {
  const res = await fetch(`${BASE_URL}/variancerequests/stats`);
  return res.json();
}

export async function triageRequest(requestId: string): Promise<TriageResult> {
  const res = await fetch(`${BASE_URL}/triage/${requestId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  return res.json();
}

export async function generateDocument(requestId: string, authoredBy: string): Promise<VarianceDocument> {
  const res = await fetch(`${BASE_URL}/documents/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId, authoredBy }),
  });
  return res.json();
}

export async function getDocument(requestId: string): Promise<VarianceDocument> {
  const res = await fetch(`${BASE_URL}/documents/${requestId}`);
  return res.json();
}

export async function getEngineTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/engine-types`);
  return res.json();
}

export async function getMroOrganisations(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/mro-organisations`);
  return res.json();
}

export async function getAnomalyTypes(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/variancerequests/anomaly-types`);
  return res.json();
}
