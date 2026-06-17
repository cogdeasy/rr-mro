import axios from 'axios';
import type {
  VarianceRequest,
  VarianceRequestSummary,
  DashboardStats,
  TriageResult,
  VarianceDocument,
  PagedResult,
  Comment,
} from '../models/variance-request.model';

const baseUrl = 'http://localhost:5062/api';

export const apiService = {
  getRequests(params?: {
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
    const cleaned: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleaned[key] = String(value);
        }
      });
    }
    return axios
      .get<PagedResult<VarianceRequestSummary>>(`${baseUrl}/variancerequests`, { params: cleaned })
      .then((r) => r.data);
  },

  getRequest(id: string): Promise<VarianceRequest> {
    return axios.get<VarianceRequest>(`${baseUrl}/variancerequests/${id}`).then((r) => r.data);
  },

  createRequest(data: Record<string, unknown>): Promise<VarianceRequest> {
    return axios.post<VarianceRequest>(`${baseUrl}/variancerequests`, data).then((r) => r.data);
  },

  updateStatus(id: string, status: string, actor: string): Promise<VarianceRequest> {
    return axios
      .patch<VarianceRequest>(`${baseUrl}/variancerequests/${id}/status`, { status, actor })
      .then((r) => r.data);
  },

  addComment(
    id: string,
    data: { content: string; author: string; authorRole: string; isInternal: boolean },
  ): Promise<Comment> {
    return axios
      .post<Comment>(`${baseUrl}/variancerequests/${id}/comments`, data)
      .then((r) => r.data);
  },

  getStats(): Promise<DashboardStats> {
    return axios.get<DashboardStats>(`${baseUrl}/variancerequests/stats`).then((r) => r.data);
  },

  triageRequest(requestId: string): Promise<TriageResult> {
    return axios.post<TriageResult>(`${baseUrl}/triage/${requestId}`, {}).then((r) => r.data);
  },

  generateDocument(requestId: string, authoredBy: string): Promise<VarianceDocument> {
    return axios
      .post<VarianceDocument>(`${baseUrl}/documents/generate`, { requestId, authoredBy })
      .then((r) => r.data);
  },

  getDocument(requestId: string): Promise<VarianceDocument> {
    return axios.get<VarianceDocument>(`${baseUrl}/documents/${requestId}`).then((r) => r.data);
  },

  getEngineTypes(): Promise<string[]> {
    return axios.get<string[]>(`${baseUrl}/variancerequests/engine-types`).then((r) => r.data);
  },

  getMroOrganisations(): Promise<string[]> {
    return axios
      .get<string[]>(`${baseUrl}/variancerequests/mro-organisations`)
      .then((r) => r.data);
  },

  getAnomalyTypes(): Promise<string[]> {
    return axios.get<string[]>(`${baseUrl}/variancerequests/anomaly-types`).then((r) => r.data);
  },
};
