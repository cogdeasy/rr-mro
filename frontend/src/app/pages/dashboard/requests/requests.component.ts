import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { VarianceRequestSummary, STATUS_LABELS, STATUS_CSS } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="padding:2rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
        <div>
          <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">Variance Requests</h1>
          <p style="font-size:0.875rem;color:var(--rr-muted)">{{ totalCount }} requests across the MRO network</p>
        </div>
        <a routerLink="/submit" class="btn-navy">New Request</a>
      </div>

      <div class="card" style="margin-bottom:1rem;padding:1rem">
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
          <input type="text" [(ngModel)]="search" (ngModelChange)="onFilter()" placeholder="Search requests..."
            style="flex:1;min-width:200px;padding:0.5rem 0.75rem;font-size:0.8125rem;border:1px solid var(--rr-border);border-radius:0.375rem">
          <select [(ngModel)]="statusFilter" (ngModelChange)="onFilter()" style="padding:0.5rem 0.75rem;font-size:0.8125rem;border:1px solid var(--rr-border);border-radius:0.375rem">
            <option value="">All Statuses</option>
            <option *ngFor="let s of statusOptions" [value]="s.value">{{ s.label }}</option>
          </select>
          <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilter()" style="padding:0.5rem 0.75rem;font-size:0.8125rem;border:1px solid var(--rr-border);border-radius:0.375rem">
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select [(ngModel)]="engineFilter" (ngModelChange)="onFilter()" style="padding:0.5rem 0.75rem;font-size:0.8125rem;border:1px solid var(--rr-border);border-radius:0.375rem">
            <option value="">All Engines</option>
            <option *ngFor="let e of engineTypes" [value]="e">{{ e }}</option>
          </select>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--rr-platinum)">
              <th class="th">Reference</th>
              <th class="th">Title</th>
              <th class="th">Anomaly</th>
              <th class="th">Engine</th>
              <th class="th">MRO</th>
              <th class="th">Status</th>
              <th class="th">Priority</th>
              <th class="th">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of requests"
                [routerLink]="['/dashboard/requests', r.id]"
                class="table-row">
              <td class="td" style="font-weight:500">{{ r.referenceNumber }}</td>
              <td class="td" style="max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.title }}</td>
              <td class="td muted">{{ r.anomalyType }}</td>
              <td class="td muted">{{ r.engineType }}</td>
              <td class="td muted" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.mroOrganisation }}</td>
              <td class="td"><span class="badge" [ngClass]="getStatusCss(r.status)">{{ getStatusLabel(r.status) }}</span></td>
              <td class="td"><span class="badge" [ngClass]="r.priority.toLowerCase()">{{ r.priority }}</span></td>
              <td class="td muted">{{ formatDate(r.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="totalCount > pageSize" style="display:flex;justify-content:center;gap:0.5rem;margin-top:1rem">
        <button class="btn-outline" (click)="changePage(page - 1)" [disabled]="page <= 1" style="padding:0.375rem 0.75rem;font-size:0.8125rem">Prev</button>
        <span style="padding:0.375rem 0.75rem;font-size:0.8125rem;color:var(--rr-muted)">{{ page }} / {{ totalPages }}</span>
        <button class="btn-outline" (click)="changePage(page + 1)" [disabled]="page >= totalPages" style="padding:0.375rem 0.75rem;font-size:0.8125rem">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .th { text-align:left;padding:0.625rem 0.75rem;font-size:0.6875rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em; }
    .td { padding:0.625rem 0.75rem;font-size:0.8125rem; }
    .muted { color: var(--rr-muted); }
    .table-row { border-top:1px solid var(--rr-border);cursor:pointer;transition:background 0.1s; }
    .table-row:hover { background: #F9FAFB; }
  `]
})
export class RequestsComponent implements OnInit {
  requests: VarianceRequestSummary[] = [];
  engineTypes: string[] = [];
  search = '';
  statusFilter = '';
  priorityFilter = '';
  engineFilter = '';
  page = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;
  statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getEngineTypes().subscribe(d => this.engineTypes = d);
    this.loadRequests();
  }

  onFilter(): void { this.page = 1; this.loadRequests(); }
  changePage(p: number): void { this.page = p; this.loadRequests(); }

  loadRequests(): void {
    this.api.getRequests({
      page: this.page, pageSize: this.pageSize,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      engineType: this.engineFilter || undefined,
      search: this.search || undefined,
      sortBy: 'createdAt', sortDir: 'desc'
    }).subscribe(r => {
      this.requests = r.items;
      this.totalCount = r.totalCount;
      this.totalPages = Math.ceil(r.totalCount / this.pageSize);
    });
  }

  getStatusLabel(s: string): string { return STATUS_LABELS[s] || s; }
  getStatusCss(s: string): string { return STATUS_CSS[s] || ''; }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
}
