import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  VarianceRequest,
  VarianceRequestSummary,
  DashboardStats,
  TriageResult,
  VarianceDocument,
  PagedResult,
  Comment
} from '../models/variance-request.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5062/api';

  constructor(private http: HttpClient) {}

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
  }): Observable<PagedResult<VarianceRequestSummary>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<PagedResult<VarianceRequestSummary>>(
      `${this.baseUrl}/variancerequests`, { params: httpParams }
    );
  }

  getRequest(id: string): Observable<VarianceRequest> {
    return this.http.get<VarianceRequest>(`${this.baseUrl}/variancerequests/${id}`);
  }

  createRequest(data: Record<string, unknown>): Observable<VarianceRequest> {
    return this.http.post<VarianceRequest>(`${this.baseUrl}/variancerequests`, data);
  }

  updateStatus(id: string, status: string, actor: string): Observable<VarianceRequest> {
    return this.http.patch<VarianceRequest>(
      `${this.baseUrl}/variancerequests/${id}/status`,
      { status, actor }
    );
  }

  addComment(id: string, data: { content: string; author: string; authorRole: string; isInternal: boolean }): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/variancerequests/${id}/comments`, data);
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/variancerequests/stats`);
  }

  triageRequest(requestId: string): Observable<TriageResult> {
    return this.http.post<TriageResult>(`${this.baseUrl}/triage/${requestId}`, {});
  }

  generateDocument(requestId: string, authoredBy: string): Observable<VarianceDocument> {
    return this.http.post<VarianceDocument>(`${this.baseUrl}/documents/generate`, { requestId, authoredBy });
  }

  getDocument(requestId: string): Observable<VarianceDocument> {
    return this.http.get<VarianceDocument>(`${this.baseUrl}/documents/${requestId}`);
  }

  getEngineTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/variancerequests/engine-types`);
  }

  getMroOrganisations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/variancerequests/mro-organisations`);
  }

  getAnomalyTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/variancerequests/anomaly-types`);
  }
}
