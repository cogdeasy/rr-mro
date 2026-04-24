import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { VarianceRequestSummary, STATUS_LABELS, STATUS_CSS } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-triage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:2rem">
      <div style="margin-bottom:2rem">
        <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">AI Triage Queue</h1>
        <p style="font-size:0.875rem;color:var(--rr-muted)">Requests awaiting or completed AI-assisted triage</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem">
        <div class="card" style="border-left:3px solid #3B82F6">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Awaiting Triage</p>
          <p style="font-size:2rem;font-weight:700">{{ awaitingTriage.length }}</p>
        </div>
        <div class="card" style="border-left:3px solid #F59E0B">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">In Progress</p>
          <p style="font-size:2rem;font-weight:700">{{ inProgress.length }}</p>
        </div>
        <div class="card" style="border-left:3px solid #10B981">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Triaged</p>
          <p style="font-size:2rem;font-weight:700">{{ triaged.length }}</p>
        </div>
        <div class="card" style="border-left:3px solid #DC2626">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Critical</p>
          <p style="font-size:2rem;font-weight:700">{{ criticalCount }}</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Awaiting Triage</h3>
          <div *ngFor="let r of awaitingTriage" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--rr-border)">
            <div>
              <p style="font-size:0.8125rem;font-weight:500">{{ r.referenceNumber }}</p>
              <p style="font-size:0.75rem;color:var(--rr-muted);max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.title }}</p>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span class="badge" [ngClass]="r.priority.toLowerCase()">{{ r.priority }}</span>
              <a [routerLink]="['/dashboard/requests', r.id]" class="btn-outline" style="padding:0.25rem 0.5rem;font-size:0.75rem">Triage</a>
            </div>
          </div>
          <div *ngIf="awaitingTriage.length === 0" style="padding:2rem;text-align:center;color:var(--rr-muted);font-size:0.875rem">
            No requests awaiting triage.
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Recently Triaged</h3>
          <div *ngFor="let r of triaged" style="display:flex;align-items:center;justify-content:space-between;padding:0.75rem 0;border-bottom:1px solid var(--rr-border)">
            <div>
              <p style="font-size:0.8125rem;font-weight:500">{{ r.referenceNumber }}</p>
              <p style="font-size:0.75rem;color:var(--rr-muted);max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.title }}</p>
            </div>
            <div style="display:flex;align-items:center;gap:0.5rem">
              <span class="badge" [ngClass]="getStatusCss(r.status)">{{ getStatusLabel(r.status) }}</span>
              <a [routerLink]="['/dashboard/requests', r.id]" class="btn-outline" style="padding:0.25rem 0.5rem;font-size:0.75rem">View</a>
            </div>
          </div>
          <div *ngIf="triaged.length === 0" style="padding:2rem;text-align:center;color:var(--rr-muted);font-size:0.875rem">
            No triaged requests yet.
          </div>
        </div>
      </div>
    </div>
  `
})
export class TriageComponent implements OnInit {
  awaitingTriage: VarianceRequestSummary[] = [];
  inProgress: VarianceRequestSummary[] = [];
  triaged: VarianceRequestSummary[] = [];
  criticalCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getRequests({ page: 1, pageSize: 50 }).subscribe(r => {
      this.awaitingTriage = r.items.filter(i => ['Submitted'].includes(i.status));
      this.inProgress = r.items.filter(i => ['UnderReview'].includes(i.status));
      this.triaged = r.items.filter(i => !['Submitted', 'UnderReview'].includes(i.status));
      this.criticalCount = r.items.filter(i => i.priority === 'Critical').length;
    });
  }

  getStatusLabel(s: string): string { return STATUS_LABELS[s] || s; }
  getStatusCss(s: string): string { return STATUS_CSS[s] || ''; }
}
