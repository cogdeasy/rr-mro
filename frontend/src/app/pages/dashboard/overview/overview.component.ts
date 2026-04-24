import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { DashboardStats } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">MRO Variance Request analytics across the Rolls-Royce network</p>
        </div>
        <div class="header-actions">
          <span class="last-updated">Updated {{ lastUpdated }}</span>
          <button class="btn-outline" (click)="refresh()">Refresh</button>
          <a routerLink="/dashboard/submit" class="btn-primary-sm">+ New Request</a>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="kpi-row" *ngIf="stats">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Total Requests</span>
            <span class="kpi-trend up">+18%</span>
          </div>
          <div class="kpi-value">{{ stats.totalRequests }}</div>
          <div class="kpi-bar"><div class="kpi-fill" style="width:100%;background:#3B82F6"></div></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Active Requests</span>
            <span class="kpi-badge active">In Progress</span>
          </div>
          <div class="kpi-value">{{ stats.totalRequests - stats.completed }}</div>
          <div class="kpi-bar"><div class="kpi-fill" [style.width.%]="((stats.totalRequests - stats.completed) / stats.totalRequests) * 100" style="background:#F59E0B"></div></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Completed</span>
            <span class="kpi-trend up">+25%</span>
          </div>
          <div class="kpi-value">{{ stats.completed }}</div>
          <div class="kpi-bar"><div class="kpi-fill" [style.width.%]="(stats.completed / stats.totalRequests) * 100" style="background:#10B981"></div></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">Avg Resolution</span>
            <span class="kpi-trend down">-12%</span>
          </div>
          <div class="kpi-value">{{ stats.avgResolutionDays | number:'1.1-1' }}<span class="kpi-unit">days</span></div>
          <div class="kpi-bar"><div class="kpi-fill" style="width:60%;background:#8B5CF6"></div></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-label">AI Contribution</span>
            <span class="kpi-badge ai">Agent Active</span>
          </div>
          <div class="kpi-value">65<span class="kpi-unit">%</span></div>
          <div class="kpi-bar"><div class="kpi-fill" style="width:65%;background:#B8860B"></div></div>
        </div>
      </div>

      <!-- Workflow Pipeline -->
      <div class="card pipeline-card" *ngIf="stats">
        <div class="card-header">
          <h2>Variance Workflow Pipeline</h2>
          <span class="card-subtitle">Current status of all requests across workflow stages</span>
        </div>
        <div class="pipeline">
          <div class="pipeline-stage" *ngFor="let stage of workflowStages; let last = last">
            <div class="stage-box" [style.borderColor]="stage.color">
              <span class="stage-count" [style.color]="stage.color">{{ stage.count }}</span>
              <span class="stage-name">{{ stage.name }}</span>
            </div>
            <div class="stage-arrow" *ngIf="!last">&#8594;</div>
          </div>
        </div>
      </div>

      <!-- Two Column: Engine Types + MRO Organisations -->
      <div class="grid-2" *ngIf="stats">
        <div class="card">
          <div class="card-header">
            <h2>By Engine Programme</h2>
            <a routerLink="/dashboard/requests" class="link">View all</a>
          </div>
          <div class="bar-chart">
            <div class="bar-row" *ngFor="let item of engineEntries">
              <span class="bar-label">{{ item[0] }}</span>
              <div class="bar-track">
                <div class="bar-fill navy" [style.width.%]="getBarWidth(item[1])"></div>
              </div>
              <span class="bar-val">{{ item[1] }}</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            <h2>By MRO Organisation</h2>
            <a routerLink="/dashboard/requests" class="link">View all</a>
          </div>
          <div class="bar-chart">
            <div class="bar-row" *ngFor="let item of mroEntries">
              <span class="bar-label">{{ item[0] }}</span>
              <div class="bar-track">
                <div class="bar-fill gold" [style.width.%]="getMroBarWidth(item[1])"></div>
              </div>
              <span class="bar-val">{{ item[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Three Column: Priority, Monthly Trend, AI Agents -->
      <div class="grid-3" *ngIf="stats">
        <div class="card">
          <div class="card-header"><h2>By Priority</h2></div>
          <div class="priority-list">
            <div class="priority-row" *ngFor="let item of priorityEntries">
              <div class="priority-info">
                <span class="priority-dot" [ngClass]="item[0].toLowerCase()"></span>
                <span class="priority-name">{{ item[0] }}</span>
              </div>
              <span class="priority-count">{{ item[1] }}</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>Monthly Trend</h2></div>
          <div class="trend-list">
            <div class="trend-row" *ngFor="let m of stats.monthlyTrend">
              <span class="trend-month">{{ m.month }}</span>
              <div class="trend-bars">
                <div class="trend-bar submitted" [style.width.px]="m.submitted * 20" title="Submitted: {{m.submitted}}"></div>
                <div class="trend-bar resolved" [style.width.px]="m.resolved * 20" title="Resolved: {{m.resolved}}"></div>
              </div>
              <div class="trend-nums">
                <span class="t-sub">{{ m.submitted }}</span>
                <span class="t-res">{{ m.resolved }}</span>
              </div>
            </div>
            <div class="trend-legend">
              <span class="legend-item"><span class="legend-dot sub"></span>Submitted</span>
              <span class="legend-item"><span class="legend-dot res"></span>Resolved</span>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h2>AI Agents Status</h2></div>
          <div class="agent-list">
            <div class="agent-row">
              <div class="agent-info">
                <span class="agent-dot active"></span>
                <div><div class="agent-name">Initiate Agent</div><div class="agent-desc">Validates submissions</div></div>
              </div>
              <span class="agent-stat">42 runs</span>
            </div>
            <div class="agent-row">
              <div class="agent-info">
                <span class="agent-dot active"></span>
                <div><div class="agent-name">Scoping/Triage</div><div class="agent-desc">Risk classification</div></div>
              </div>
              <span class="agent-stat">38 runs</span>
            </div>
            <div class="agent-row">
              <div class="agent-info">
                <span class="agent-dot active"></span>
                <div><div class="agent-name">Doc Authoring</div><div class="agent-desc">RAG over 15k+ variances</div></div>
              </div>
              <span class="agent-stat">27 runs</span>
            </div>
          </div>
          <a routerLink="/dashboard/ai-assist" class="link" style="display:block;margin-top:0.75rem;font-size:0.75rem">Manage AI Agents &rarr;</a>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card" *ngIf="recentRequests.length">
        <div class="card-header">
          <h2>Recent Activity</h2>
          <a routerLink="/dashboard/requests" class="link">View all requests</a>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Title</th>
              <th>Engine</th>
              <th>MRO</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of recentRequests.slice(0, 6)" class="clickable-row" [routerLink]="'/dashboard/requests/' + r.id">
              <td class="ref-cell">{{ r.referenceNumber }}</td>
              <td class="title-cell">{{ r.title }}</td>
              <td>{{ r.engineType }}</td>
              <td>{{ r.mroOrganisation }}</td>
              <td><span class="priority-badge" [ngClass]="r.priority?.toLowerCase()">{{ r.priority }}</span></td>
              <td><span class="status-badge" [ngClass]="r.status">{{ formatStatus(r.status) }}</span></td>
              <td class="date-cell">{{ r.createdAt | date:'dd MMM yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 1.5rem; max-width: 1280px; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .page-header h1 { font-size: 1.35rem; font-weight: 700; color: #001233; margin-bottom: 0.15rem; }
    .subtitle { font-size: 0.8rem; color: #8e8ea0; }
    .header-actions { display: flex; align-items: center; gap: 0.75rem; }
    .last-updated { font-size: 0.7rem; color: #8e8ea0; }
    .btn-outline {
      padding: 0.35rem 0.75rem; border: 1px solid #d1d5db; border-radius: 6px;
      background: #fff; font-size: 0.75rem; font-weight: 500; color: #3a3a52; cursor: pointer;
    }
    .btn-outline:hover { border-color: #001233; color: #001233; }
    .btn-primary-sm {
      padding: 0.35rem 0.85rem; border-radius: 6px; background: #001233; color: #fff;
      font-size: 0.75rem; font-weight: 500; text-decoration: none; cursor: pointer;
    }
    .btn-primary-sm:hover { background: #002456; }
    .card { background: #fff; border-radius: 8px; padding: 1rem 1.25rem; border: 1px solid #e5e7eb; margin-bottom: 1rem; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .card-header h2 { font-size: 0.85rem; font-weight: 600; color: #001233; }
    .card-subtitle { font-size: 0.7rem; color: #8e8ea0; }
    .link { font-size: 0.75rem; color: #B8860B; font-weight: 500; text-decoration: none; }
    .link:hover { text-decoration: underline; }

    .kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.75rem; margin-bottom: 1rem; }
    .kpi-card { background: #fff; border-radius: 8px; padding: 0.875rem 1rem; border: 1px solid #e5e7eb; }
    .kpi-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.375rem; }
    .kpi-label { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8e8ea0; }
    .kpi-value { font-size: 1.75rem; font-weight: 700; color: #001233; line-height: 1.2; }
    .kpi-unit { font-size: 0.8rem; font-weight: 500; color: #8e8ea0; margin-left: 0.15rem; }
    .kpi-bar { height: 3px; background: #f0f0f5; border-radius: 2px; margin-top: 0.5rem; overflow: hidden; }
    .kpi-fill { height: 100%; border-radius: 2px; }
    .kpi-trend { font-size: 0.65rem; font-weight: 600; padding: 0.1rem 0.35rem; border-radius: 3px; }
    .kpi-trend.up { background: #ecfdf5; color: #059669; }
    .kpi-trend.down { background: #ecfdf5; color: #059669; }
    .kpi-badge { font-size: 0.55rem; font-weight: 600; padding: 0.1rem 0.35rem; border-radius: 3px; }
    .kpi-badge.active { background: #fef3c7; color: #92400e; }
    .kpi-badge.ai { background: #f5f0e6; color: #B8860B; }

    .pipeline-card { margin-bottom: 1rem; }
    .pipeline { display: flex; align-items: center; justify-content: space-between; gap: 0; overflow-x: auto; }
    .pipeline-stage { display: flex; align-items: center; gap: 0.5rem; }
    .stage-box { display: flex; flex-direction: column; align-items: center; padding: 0.625rem 0.75rem; border-radius: 6px; border: 2px solid; background: #fff; min-width: 90px; }
    .stage-count { font-size: 1.25rem; font-weight: 700; }
    .stage-name { font-size: 0.6rem; font-weight: 500; color: #4a4a6a; text-align: center; white-space: nowrap; }
    .stage-arrow { font-size: 1rem; color: #d1d5db; flex-shrink: 0; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
    .bar-chart { display: flex; flex-direction: column; gap: 0.5rem; }
    .bar-row { display: flex; align-items: center; gap: 0.5rem; }
    .bar-label { font-size: 0.75rem; font-weight: 500; color: #3a3a52; min-width: 120px; }
    .bar-track { flex: 1; height: 8px; background: #f0f0f5; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .bar-fill.navy { background: #001233; }
    .bar-fill.gold { background: #B8860B; }
    .bar-val { font-size: 0.75rem; font-weight: 700; color: #001233; min-width: 20px; text-align: right; }

    .priority-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .priority-row { display: flex; justify-content: space-between; align-items: center; }
    .priority-info { display: flex; align-items: center; gap: 0.5rem; }
    .priority-dot { width: 10px; height: 10px; border-radius: 50%; }
    .priority-dot.critical { background: #ef4444; }
    .priority-dot.high { background: #f59e0b; }
    .priority-dot.medium { background: #3b82f6; }
    .priority-dot.low { background: #10b981; }
    .priority-name { font-size: 0.8rem; font-weight: 500; color: #3a3a52; }
    .priority-count { font-size: 1.1rem; font-weight: 700; color: #001233; }

    .trend-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .trend-row { display: flex; align-items: center; gap: 0.5rem; }
    .trend-month { font-size: 0.7rem; color: #8e8ea0; min-width: 32px; }
    .trend-bars { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .trend-bar { height: 6px; border-radius: 3px; min-width: 4px; }
    .trend-bar.submitted { background: #3b82f6; }
    .trend-bar.resolved { background: #10b981; }
    .trend-nums { display: flex; gap: 0.375rem; font-size: 0.65rem; font-weight: 600; min-width: 48px; }
    .t-sub { color: #3b82f6; }
    .t-res { color: #10b981; }
    .trend-legend { display: flex; gap: 1rem; margin-top: 0.5rem; }
    .legend-item { font-size: 0.65rem; color: #8e8ea0; display: flex; align-items: center; gap: 0.25rem; }
    .legend-dot { width: 8px; height: 8px; border-radius: 2px; }
    .legend-dot.sub { background: #3b82f6; }
    .legend-dot.res { background: #10b981; }

    .agent-list { display: flex; flex-direction: column; gap: 0.625rem; }
    .agent-row { display: flex; justify-content: space-between; align-items: center; }
    .agent-info { display: flex; align-items: center; gap: 0.5rem; }
    .agent-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .agent-dot.active { background: #10b981; }
    .agent-name { font-size: 0.8rem; font-weight: 500; color: #001233; }
    .agent-desc { font-size: 0.65rem; color: #8e8ea0; }
    .agent-stat { font-size: 0.7rem; font-weight: 600; color: #3a3a52; }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #8e8ea0; text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #e5e7eb; }
    .data-table td { font-size: 0.8rem; padding: 0.625rem 0.75rem; border-bottom: 1px solid #f3f4f6; color: #3a3a52; }
    .clickable-row { cursor: pointer; transition: background 0.1s; }
    .clickable-row:hover { background: #f9fafb; }
    .ref-cell { font-weight: 600; color: #001233; font-size: 0.75rem; }
    .title-cell { font-weight: 500; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .date-cell { font-size: 0.75rem; color: #8e8ea0; }
    .priority-badge { font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.4rem; border-radius: 3px; }
    .priority-badge.critical { background: #fee2e2; color: #991b1b; }
    .priority-badge.high { background: #fef3c7; color: #92400e; }
    .priority-badge.medium { background: #dbeafe; color: #1e40af; }
    .priority-badge.low { background: #ecfdf5; color: #065f46; }
    .status-badge { font-size: 0.65rem; font-weight: 500; padding: 0.15rem 0.4rem; border-radius: 3px; }
    .status-badge.Submitted { background: #e5e7eb; color: #374151; }
    .status-badge.UnderReview { background: #dbeafe; color: #1e40af; }
    .status-badge.TriageComplete { background: #ede9fe; color: #5b21b6; }
    .status-badge.SpecialistOpinion { background: #fef3c7; color: #92400e; }
    .status-badge.RecommendationDrafted { background: #fce7f3; color: #9d174d; }
    .status-badge.DocumentAuthored { background: #ecfdf5; color: #065f46; }
    .status-badge.Completed { background: #d1fae5; color: #047857; }
  `]
})
export class OverviewComponent implements OnInit {
  stats: DashboardStats | null = null;
  engineEntries: [string, number][] = [];
  mroEntries: [string, number][] = [];
  priorityEntries: [string, number][] = [];
  recentRequests: any[] = [];
  lastUpdated = new Date().toLocaleTimeString();
  workflowStages: {name: string; count: number; color: string}[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.api.getStats().subscribe(s => {
      this.stats = s;
      this.engineEntries = Object.entries(s.byEngineType).sort((a, b) => b[1] - a[1]);
      this.mroEntries = Object.entries(s.byMroOrganisation).sort((a, b) => b[1] - a[1]);
      this.priorityEntries = Object.entries(s.byPriority).sort((a, b) => b[1] - a[1]);
      this.workflowStages = [
        { name: 'Submitted', count: s.submitted || 0, color: '#6b7280' },
        { name: 'Under Review', count: s.underReview || 0, color: '#3B82F6' },
        { name: 'Triage Complete', count: s.triageComplete || 0, color: '#8B5CF6' },
        { name: 'Specialist Opinion', count: s.specialistOpinion || 0, color: '#F59E0B' },
        { name: 'Recommendation', count: s.recommendationDrafted || 0, color: '#EC4899' },
        { name: 'Doc Authored', count: s.documentAuthored || 0, color: '#10B981' },
        { name: 'Completed', count: s.completed || 0, color: '#059669' },
      ];
    });
    this.api.getRequests({ page: 1, pageSize: 6, sortBy: 'date', sortDir: 'desc' }).subscribe(r => this.recentRequests = r.items);
  }

  refresh(): void {
    this.lastUpdated = new Date().toLocaleTimeString();
    this.loadData();
  }

  formatStatus(status: string): string {
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  getBarWidth(val: number): number {
    const max = Math.max(...this.engineEntries.map(e => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  }

  getMroBarWidth(val: number): number {
    const max = Math.max(...this.mroEntries.map(e => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  }
}
