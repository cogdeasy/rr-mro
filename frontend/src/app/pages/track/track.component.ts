import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { VarianceRequestSummary, STATUS_LABELS, STATUS_CSS, PagedResult } from '../../shared/models/variance-request.model';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="gradient-rr" style="padding:3rem 0 2rem">
      <div class="container">
        <div class="section-label" style="margin-bottom:1rem">
          <div class="line" style="background:rgba(255,255,255,0.3)"></div>
          <span style="color:rgba(255,255,255,0.6)">MRO Portal</span>
        </div>
        <h1 style="font-size:2rem;font-weight:700;color:#fff;margin-bottom:0.5rem">Track Variance Requests</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:0.875rem">View and track the status of your submitted variance requests</p>
      </div>
    </section>

    <section style="padding:2rem 0 4rem;background:var(--rr-platinum)">
      <div class="container">
        <div class="card" style="margin-bottom:1.5rem">
          <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
            <div class="form-group" style="margin-bottom:0;flex:1;min-width:200px">
              <label>Search</label>
              <input type="text" [(ngModel)]="search" (ngModelChange)="onFilter()" placeholder="Search by reference, title, or description">
            </div>
            <div class="form-group" style="margin-bottom:0;width:160px">
              <label>Status</label>
              <select [(ngModel)]="statusFilter" (ngModelChange)="onFilter()">
                <option value="">All Statuses</option>
                <option *ngFor="let s of statusOptions" [value]="s.value">{{ s.label }}</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:0;width:160px">
              <label>Priority</label>
              <select [(ngModel)]="priorityFilter" (ngModelChange)="onFilter()">
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div class="card" style="padding:0;overflow:hidden">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--rr-platinum)">
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Reference</th>
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Title</th>
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Engine</th>
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Status</th>
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Priority</th>
                <th style="text-align:left;padding:0.75rem 1rem;font-size:0.75rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em">Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of requests"
                  [routerLink]="['/dashboard/requests', r.id]"
                  style="border-top:1px solid var(--rr-border);cursor:pointer;transition:background 0.1s"
                  onmouseenter="this.style.background='#F9FAFB'"
                  onmouseleave="this.style.background='transparent'">
                <td style="padding:0.75rem 1rem;font-size:0.8125rem;font-weight:500;color:var(--rr-navy)">{{ r.referenceNumber }}</td>
                <td style="padding:0.75rem 1rem;font-size:0.8125rem;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.title }}</td>
                <td style="padding:0.75rem 1rem;font-size:0.8125rem;color:var(--rr-muted)">{{ r.engineType }}</td>
                <td style="padding:0.75rem 1rem"><span class="badge" [ngClass]="getStatusCss(r.status)">{{ getStatusLabel(r.status) }}</span></td>
                <td style="padding:0.75rem 1rem"><span class="badge" [ngClass]="r.priority.toLowerCase()">{{ r.priority }}</span></td>
                <td style="padding:0.75rem 1rem;font-size:0.8125rem;color:var(--rr-muted)">{{ formatDate(r.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="requests.length === 0" style="padding:3rem;text-align:center;color:var(--rr-muted);font-size:0.875rem">
            No variance requests found matching your criteria.
          </div>
        </div>

        <div *ngIf="totalCount > pageSize" style="display:flex;justify-content:center;gap:0.5rem;margin-top:1.5rem">
          <button class="btn-outline" (click)="changePage(page - 1)" [disabled]="page <= 1">Previous</button>
          <span style="padding:0.625rem 1rem;font-size:0.875rem;color:var(--rr-muted)">Page {{ page }} of {{ totalPages }}</span>
          <button class="btn-outline" (click)="changePage(page + 1)" [disabled]="page >= totalPages">Next</button>
        </div>
      </div>
    </section>
  `
})
export class TrackComponent implements OnInit {
  requests: VarianceRequestSummary[] = [];
  search = '';
  statusFilter = '';
  priorityFilter = '';
  page = 1;
  pageSize = 20;
  totalCount = 0;
  totalPages = 1;

  statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadRequests(); }

  onFilter(): void {
    this.page = 1;
    this.loadRequests();
  }

  changePage(p: number): void {
    this.page = p;
    this.loadRequests();
  }

  loadRequests(): void {
    this.api.getRequests({
      page: this.page,
      pageSize: this.pageSize,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      search: this.search || undefined,
      sortBy: 'createdAt',
      sortDir: 'desc'
    }).subscribe(result => {
      this.requests = result.items;
      this.totalCount = result.totalCount;
      this.totalPages = Math.ceil(result.totalCount / this.pageSize);
    });
  }

  getStatusLabel(status: string): string { return STATUS_LABELS[status] || status; }
  getStatusCss(status: string): string { return STATUS_CSS[status] || ''; }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
}
