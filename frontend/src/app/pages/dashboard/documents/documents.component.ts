import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { VarianceRequestSummary } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:2rem">
      <div style="margin-bottom:2rem">
        <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">Variance Documents</h1>
        <p style="font-size:0.875rem;color:var(--rr-muted)">AI-generated 27-page regulated variance packages</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem">
        <div class="card" style="border-left:3px solid var(--rr-gold)">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Total Documents</p>
          <p style="font-size:2rem;font-weight:700">{{ documentedRequests.length }}</p>
        </div>
        <div class="card" style="border-left:3px solid #10B981">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Approved</p>
          <p style="font-size:2rem;font-weight:700">{{ approvedCount }}</p>
        </div>
        <div class="card" style="border-left:3px solid #3B82F6">
          <p style="font-size:0.75rem;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem">Avg AI Contribution</p>
          <p style="font-size:2rem;font-weight:700">65%</p>
        </div>
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <table style="width:100%;border-collapse:collapse">
          <thead>
            <tr style="background:var(--rr-platinum)">
              <th class="th">Reference</th>
              <th class="th">Title</th>
              <th class="th">Engine</th>
              <th class="th">MRO</th>
              <th class="th">Status</th>
              <th class="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of documentedRequests" style="border-top:1px solid var(--rr-border)">
              <td class="td" style="font-weight:500">{{ r.referenceNumber }}</td>
              <td class="td" style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ r.title }}</td>
              <td class="td muted">{{ r.engineType }}</td>
              <td class="td muted">{{ r.mroOrganisation }}</td>
              <td class="td"><span class="badge" [ngClass]="r.status.toLowerCase()">{{ r.status }}</span></td>
              <td class="td">
                <a [routerLink]="['/dashboard/requests', r.id]" style="font-size:0.8125rem;color:var(--rr-navy);font-weight:500">View</a>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="documentedRequests.length === 0" style="padding:3rem;text-align:center;color:var(--rr-muted)">
          No variance documents generated yet.
        </div>
      </div>

      <div class="card" style="margin-top:2rem;background:linear-gradient(135deg,#001233 0%,#001845 100%);color:#fff">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:0.75rem">Document Authoring Agent</h3>
        <p style="font-size:0.875rem;line-height:1.6;color:rgba(255,255,255,0.7);margin-bottom:1rem">
          The Document Authoring Agent uses RAG over 15,000+ prior variances to generate
          comprehensive 27-page regulated variance packages. Each document includes:
        </p>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.75rem">
          <div *ngFor="let section of documentSections" style="display:flex;align-items:center;gap:0.5rem">
            <div style="width:6px;height:6px;border-radius:50%;background:var(--rr-gold)"></div>
            <span style="font-size:0.8125rem;color:rgba(255,255,255,0.8)">{{ section }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .th { text-align:left;padding:0.625rem 0.75rem;font-size:0.6875rem;font-weight:600;color:var(--rr-muted);text-transform:uppercase;letter-spacing:0.05em; }
    .td { padding:0.625rem 0.75rem;font-size:0.8125rem; }
    .muted { color: var(--rr-muted); }
  `]
})
export class DocumentsComponent implements OnInit {
  documentedRequests: VarianceRequestSummary[] = [];
  approvedCount = 0;

  documentSections = [
    'Problem Statement',
    'Technical Analysis',
    'Safety Assessment',
    'Proposed Disposition',
    'Regulatory References',
    'Specialist Recommendation',
    'Applicable Regulations',
    'Digital Signatures'
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getRequests({ page: 1, pageSize: 50 }).subscribe(r => {
      this.documentedRequests = r.items.filter(i =>
        ['DocumentAuthored', 'Approved', 'Completed'].includes(i.status)
      );
      this.approvedCount = r.items.filter(i =>
        ['Approved', 'Completed'].includes(i.status)
      ).length;
    });
  }
}
