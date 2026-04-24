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
    <div style="padding:2rem">
      <div style="margin-bottom:2rem">
        <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">Dashboard Overview</h1>
        <p style="font-size:0.875rem;color:var(--rr-muted)">Real-time variance request analytics across the MRO network</p>
      </div>

      <div *ngIf="stats" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem">
        <div class="card" style="border-left:3px solid #3B82F6">
          <p style="font-size:0.75rem;color:var(--rr-muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Total Requests</p>
          <p style="font-size:2rem;font-weight:700">{{ stats.totalRequests }}</p>
        </div>
        <div class="card" style="border-left:3px solid #F59E0B">
          <p style="font-size:0.75rem;color:var(--rr-muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Under Review</p>
          <p style="font-size:2rem;font-weight:700">{{ stats.underReview }}</p>
        </div>
        <div class="card" style="border-left:3px solid #8B5CF6">
          <p style="font-size:0.75rem;color:var(--rr-muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Specialist Opinion</p>
          <p style="font-size:2rem;font-weight:700">{{ stats.specialistOpinion }}</p>
        </div>
        <div class="card" style="border-left:3px solid #10B981">
          <p style="font-size:0.75rem;color:var(--rr-muted);font-weight:500;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Completed</p>
          <p style="font-size:2rem;font-weight:700">{{ stats.completed }}</p>
        </div>
      </div>

      <div *ngIf="stats" style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:2rem">
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">By Engine Type</h3>
          <div *ngFor="let item of engineEntries" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--rr-border)">
            <span style="font-size:0.8125rem;font-weight:500">{{ item[0] }}</span>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <div style="width:120px;height:6px;background:var(--rr-platinum);border-radius:3px;overflow:hidden">
                <div [style.width.%]="getBarWidth(item[1])" style="height:100%;background:var(--rr-navy);border-radius:3px"></div>
              </div>
              <span style="font-size:0.8125rem;font-weight:600;min-width:24px;text-align:right">{{ item[1] }}</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">By MRO Organisation</h3>
          <div *ngFor="let item of mroEntries" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--rr-border)">
            <span style="font-size:0.8125rem;font-weight:500">{{ item[0] }}</span>
            <div style="display:flex;align-items:center;gap:0.75rem">
              <div style="width:120px;height:6px;background:var(--rr-platinum);border-radius:3px;overflow:hidden">
                <div [style.width.%]="getMroBarWidth(item[1])" style="height:100%;background:var(--rr-gold);border-radius:3px"></div>
              </div>
              <span style="font-size:0.8125rem;font-weight:600;min-width:24px;text-align:right">{{ item[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="stats" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.5rem">
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">By Priority</h3>
          <div *ngFor="let item of priorityEntries" style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0">
            <span class="badge" [ngClass]="item[0].toLowerCase()">{{ item[0] }}</span>
            <span style="font-size:1.25rem;font-weight:700">{{ item[1] }}</span>
          </div>
        </div>
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Average Resolution</h3>
          <p style="font-size:3rem;font-weight:700;color:var(--rr-navy)">{{ stats.avgResolutionDays | number:'1.1-1' }}</p>
          <p style="font-size:0.875rem;color:var(--rr-muted)">days average</p>
        </div>
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Monthly Trend</h3>
          <div *ngFor="let m of stats.monthlyTrend" style="display:flex;align-items:center;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem">
            <span style="color:var(--rr-muted)">{{ m.month }}</span>
            <div style="display:flex;gap:1rem">
              <span style="color:#3B82F6;font-weight:500">{{ m.submitted }} submitted</span>
              <span style="color:#10B981;font-weight:500">{{ m.resolved }} resolved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OverviewComponent implements OnInit {
  stats: DashboardStats | null = null;
  engineEntries: [string, number][] = [];
  mroEntries: [string, number][] = [];
  priorityEntries: [string, number][] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getStats().subscribe(s => {
      this.stats = s;
      this.engineEntries = Object.entries(s.byEngineType).sort((a, b) => b[1] - a[1]);
      this.mroEntries = Object.entries(s.byMroOrganisation).sort((a, b) => b[1] - a[1]);
      this.priorityEntries = Object.entries(s.byPriority).sort((a, b) => b[1] - a[1]);
    });
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
