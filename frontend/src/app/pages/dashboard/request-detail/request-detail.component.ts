import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../shared/services/api.service';
import { VarianceRequest, STATUS_LABELS, STATUS_CSS } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="padding:2rem" *ngIf="request">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
        <a routerLink="/dashboard/requests" style="font-size:0.8125rem;color:var(--rr-muted)">&larr; Back to Requests</a>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:2rem">
        <div>
          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.5rem">
            <span style="font-size:0.875rem;font-weight:500;color:var(--rr-muted)">{{ request.referenceNumber }}</span>
            <span class="badge" [ngClass]="getStatusCss(request.status)">{{ getStatusLabel(request.status) }}</span>
            <span class="badge" [ngClass]="request.priority.toLowerCase()">{{ request.priority }}</span>
          </div>
          <h1 style="font-size:1.5rem;font-weight:700">{{ request.title }}</h1>
        </div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn-navy" (click)="runTriage()" *ngIf="!request.triageResult" style="font-size:0.8125rem;padding:0.5rem 1rem">
            Run AI Triage
          </button>
          <button class="btn-navy" (click)="generateDoc()" *ngIf="!request.generatedDocument" style="font-size:0.8125rem;padding:0.5rem 1rem">
            Generate Document
          </button>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:2fr 1fr;gap:1.5rem">
        <div style="display:flex;flex-direction:column;gap:1.5rem">
          <!-- Description -->
          <div class="card">
            <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:0.75rem">Description</h3>
            <p style="font-size:0.875rem;line-height:1.6;color:var(--rr-muted)">{{ request.description }}</p>
          </div>

          <!-- Triage Result -->
          <div class="card" *ngIf="request.triageResult" style="border-left:3px solid #8B5CF6">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
              <span style="font-size:18px">\u{1F916}</span>
              <h3 style="font-size:0.875rem;font-weight:600">AI Triage Result</h3>
              <span style="margin-left:auto;font-size:0.75rem;color:var(--rr-muted)">Confidence: {{ (request.triageResult.confidenceScore * 100).toFixed(0) }}%</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem">
              <div>
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Severity</p>
                <p style="font-size:0.875rem;font-weight:600">{{ request.triageResult.severityClassification }}</p>
              </div>
              <div>
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Specialist</p>
                <p style="font-size:0.875rem;font-weight:600">{{ request.triageResult.suggestedSpecialist }}</p>
              </div>
              <div>
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Similar Variances</p>
                <p style="font-size:0.875rem;font-weight:600">{{ request.triageResult.similarVariancesFound }} found</p>
              </div>
              <div>
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">AI Model</p>
                <p style="font-size:0.875rem;font-weight:600">{{ request.triageResult.aiModelVersion }}</p>
              </div>
            </div>
            <div style="margin-bottom:1rem">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Recommended Action</p>
              <p style="font-size:0.875rem;line-height:1.6">{{ request.triageResult.recommendedAction }}</p>
            </div>
            <div *ngIf="request.triageResult.suggestedRfiQuestions.length > 0">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.5rem">Suggested RFI Questions</p>
              <ul style="padding-left:1.25rem;font-size:0.8125rem;line-height:1.8;color:var(--rr-muted)">
                <li *ngFor="let q of request.triageResult.suggestedRfiQuestions">{{ q }}</li>
              </ul>
            </div>
          </div>

          <!-- Generated Document -->
          <div class="card" *ngIf="request.generatedDocument" style="border-left:3px solid var(--rr-gold)">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
              <span style="font-size:18px">\u{1F4C4}</span>
              <h3 style="font-size:0.875rem;font-weight:600">Generated Variance Document</h3>
              <span style="margin-left:auto;font-size:0.75rem;color:var(--rr-gold);font-weight:500">{{ request.generatedDocument.aiGeneratedPercentage.toFixed(0) }}% AI-assisted</span>
            </div>
            <div style="display:grid;gap:1rem">
              <div *ngIf="request.generatedDocument.problemStatement">
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem;font-weight:600">Problem Statement</p>
                <p style="font-size:0.8125rem;line-height:1.6">{{ request.generatedDocument.problemStatement }}</p>
              </div>
              <div *ngIf="request.generatedDocument.technicalAnalysis">
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem;font-weight:600">Technical Analysis</p>
                <p style="font-size:0.8125rem;line-height:1.6">{{ request.generatedDocument.technicalAnalysis }}</p>
              </div>
              <div *ngIf="request.generatedDocument.safetyAssessment">
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem;font-weight:600">Safety Assessment</p>
                <p style="font-size:0.8125rem;line-height:1.6">{{ request.generatedDocument.safetyAssessment }}</p>
              </div>
              <div *ngIf="request.generatedDocument.proposedDisposition">
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem;font-weight:600">Proposed Disposition</p>
                <p style="font-size:0.8125rem;line-height:1.6">{{ request.generatedDocument.proposedDisposition }}</p>
              </div>
              <div *ngIf="request.generatedDocument.regulatoryReferences">
                <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem;font-weight:600">Regulatory References</p>
                <p style="font-size:0.8125rem;line-height:1.6">{{ request.generatedDocument.regulatoryReferences }}</p>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div class="card">
            <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Comments ({{ request.comments.length }})</h3>
            <div *ngFor="let c of request.comments" style="padding:0.75rem 0;border-bottom:1px solid var(--rr-border)">
              <div style="display:flex;justify-content:space-between;margin-bottom:0.25rem">
                <span style="font-size:0.8125rem;font-weight:600">{{ c.author }}</span>
                <span style="font-size:0.75rem;color:var(--rr-muted)">{{ formatDate(c.createdAt) }}</span>
              </div>
              <p style="font-size:0.8125rem;color:var(--rr-muted);line-height:1.5">{{ c.content }}</p>
            </div>
            <div style="margin-top:1rem;display:flex;gap:0.5rem">
              <input type="text" [(ngModel)]="newComment" placeholder="Add a comment..."
                style="flex:1;padding:0.5rem 0.75rem;font-size:0.8125rem;border:1px solid var(--rr-border);border-radius:0.375rem">
              <button class="btn-navy" (click)="addComment()" style="font-size:0.8125rem;padding:0.5rem 1rem">Post</button>
            </div>
          </div>

          <!-- Audit Trail -->
          <div class="card">
            <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Audit Trail</h3>
            <div *ngFor="let a of request.auditTrail" style="display:flex;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--rr-border)">
              <div style="width:6px;height:6px;border-radius:50%;background:var(--rr-navy);margin-top:6px;flex-shrink:0"></div>
              <div style="flex:1">
                <p style="font-size:0.8125rem;font-weight:500">{{ a.action }}</p>
                <p style="font-size:0.75rem;color:var(--rr-muted)">{{ a.details }}</p>
                <p style="font-size:0.6875rem;color:var(--rr-silver-dark)">{{ a.actor }} &middot; {{ formatDate(a.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div class="card">
            <h3 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--rr-muted);margin-bottom:1rem">Details</h3>
            <div style="display:grid;gap:0.75rem">
              <div><p class="detail-label">Anomaly Type</p><p class="detail-value">{{ request.anomalyType }}</p></div>
              <div><p class="detail-label">Engine Type</p><p class="detail-value">{{ request.engineType }}</p></div>
              <div><p class="detail-label">Serial Number</p><p class="detail-value">{{ request.engineSerialNumber }}</p></div>
              <div *ngIf="request.partNumber"><p class="detail-label">Part Number</p><p class="detail-value">{{ request.partNumber }}</p></div>
              <div *ngIf="request.aircraftRegistration"><p class="detail-label">Aircraft</p><p class="detail-value">{{ request.aircraftRegistration }}</p></div>
              <div><p class="detail-label">MRO Organisation</p><p class="detail-value">{{ request.mroOrganisation }}</p></div>
              <div *ngIf="request.mroSiteLocation"><p class="detail-label">Site</p><p class="detail-value">{{ request.mroSiteLocation }}</p></div>
              <div *ngIf="request.shopVisitReference"><p class="detail-label">Shop Visit</p><p class="detail-value">{{ request.shopVisitReference }}</p></div>
              <div><p class="detail-label">Submitted By</p><p class="detail-value">{{ request.submittedBy }}</p></div>
              <div *ngIf="request.assignedTo"><p class="detail-label">Assigned To</p><p class="detail-value">{{ request.assignedTo }}</p></div>
              <div><p class="detail-label">Created</p><p class="detail-value">{{ formatDate(request.createdAt) }}</p></div>
              <div><p class="detail-label">Last Updated</p><p class="detail-value">{{ formatDate(request.updatedAt) }}</p></div>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--rr-muted);margin-bottom:1rem">Workflow Actions</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem">
              <button *ngFor="let action of availableActions"
                class="btn-outline" style="justify-content:center;font-size:0.8125rem"
                (click)="updateStatus(action.status)">
                {{ action.label }}
              </button>
            </div>
          </div>

          <div class="card" *ngIf="request.attachments.length > 0">
            <h3 style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--rr-muted);margin-bottom:1rem">Attachments ({{ request.attachments.length }})</h3>
            <div *ngFor="let a of request.attachments" style="display:flex;align-items:center;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid var(--rr-border)">
              <span style="font-size:16px">\u{1F4CE}</span>
              <div>
                <p style="font-size:0.8125rem;font-weight:500">{{ a.fileName }}</p>
                <p style="font-size:0.6875rem;color:var(--rr-muted)">{{ a.category }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-label { font-size:0.6875rem;color:var(--rr-muted);margin-bottom:0.125rem; }
    .detail-value { font-size:0.8125rem;font-weight:500; }
  `]
})
export class RequestDetailComponent implements OnInit {
  request: VarianceRequest | null = null;
  newComment = '';
  availableActions: { status: string; label: string }[] = [];

  private statusFlow: Record<string, { status: string; label: string }[]> = {
    Submitted: [{ status: 'UnderReview', label: 'Begin Review' }],
    UnderReview: [{ status: 'TriageComplete', label: 'Complete Triage' }, { status: 'Rejected', label: 'Reject' }],
    TriageComplete: [{ status: 'SpecialistOpinion', label: 'Request Specialist' }],
    SpecialistOpinion: [{ status: 'RecommendationDrafted', label: 'Draft Recommendation' }],
    RecommendationDrafted: [{ status: 'DocumentAuthored', label: 'Author Document' }],
    DocumentAuthored: [{ status: 'Approved', label: 'Approve' }, { status: 'Rejected', label: 'Reject' }],
    Approved: [{ status: 'Completed', label: 'Mark Complete' }],
  };

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadRequest(id);
  }

  loadRequest(id: string): void {
    this.api.getRequest(id).subscribe(r => {
      this.request = r;
      this.availableActions = this.statusFlow[r.status] || [];
    });
  }

  updateStatus(status: string): void {
    if (!this.request) return;
    this.api.updateStatus(this.request.id, status, 'Dr. J. Richardson').subscribe(r => {
      this.request = r;
      this.availableActions = this.statusFlow[r.status] || [];
    });
  }

  runTriage(): void {
    if (!this.request) return;
    this.api.triageRequest(this.request.id).subscribe(() => this.loadRequest(this.request!.id));
  }

  generateDoc(): void {
    if (!this.request) return;
    this.api.generateDocument(this.request.id, 'Dr. J. Richardson').subscribe(() => this.loadRequest(this.request!.id));
  }

  addComment(): void {
    if (!this.request || !this.newComment.trim()) return;
    this.api.addComment(this.request.id, {
      content: this.newComment,
      author: 'Dr. J. Richardson',
      authorRole: 'Lead Engineer',
      isInternal: true
    }).subscribe(() => {
      this.newComment = '';
      this.loadRequest(this.request!.id);
    });
  }

  getStatusLabel(s: string): string { return STATUS_LABELS[s] || s; }
  getStatusCss(s: string): string { return STATUS_CSS[s] || ''; }
  formatDate(d: string): string { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
}
