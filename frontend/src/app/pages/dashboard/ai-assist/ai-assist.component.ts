import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../shared/services/api.service';
import { VarianceRequestSummary, STATUS_LABELS } from '../../../shared/models/variance-request.model';

@Component({
  selector: 'app-ai-assist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:2rem">
      <div style="margin-bottom:2rem">
        <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">AI Assist</h1>
        <p style="font-size:0.875rem;color:var(--rr-muted)">AI-powered document authoring and triage assistance</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-bottom:2rem">
        <div class="card" style="border-left:3px solid #8B5CF6">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
            <span style="font-size:24px">\u{1F916}</span>
            <h3 style="font-size:0.875rem;font-weight:600">Initiate Agent</h3>
          </div>
          <p style="font-size:0.8125rem;color:var(--rr-muted);line-height:1.5;margin-bottom:1rem">
            Front-loads RFI questions to ensure complete submissions. Analyses request data
            and identifies missing information before triage.
          </p>
          <div style="display:flex;justify-content:space-between;padding-top:0.75rem;border-top:1px solid var(--rr-border)">
            <span style="font-size:0.75rem;color:var(--rr-muted)">Requests processed</span>
            <span style="font-size:0.875rem;font-weight:600">{{ initiateCount }}</span>
          </div>
        </div>

        <div class="card" style="border-left:3px solid #F59E0B">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
            <span style="font-size:24px">\u{1F50D}</span>
            <h3 style="font-size:0.875rem;font-weight:600">Scoping / Triage Agent</h3>
          </div>
          <p style="font-size:0.8125rem;color:var(--rr-muted);line-height:1.5;margin-bottom:1rem">
            Classifies anomaly severity using RAG over 15,000+ prior variances.
            Routes to appropriate specialist engineer and generates severity assessment.
          </p>
          <div style="display:flex;justify-content:space-between;padding-top:0.75rem;border-top:1px solid var(--rr-border)">
            <span style="font-size:0.75rem;color:var(--rr-muted)">Triages completed</span>
            <span style="font-size:0.875rem;font-weight:600">{{ triageCount }}</span>
          </div>
        </div>

        <div class="card" style="border-left:3px solid var(--rr-gold)">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
            <span style="font-size:24px">\u{1F4C4}</span>
            <h3 style="font-size:0.875rem;font-weight:600">Document Authoring Agent</h3>
          </div>
          <p style="font-size:0.8125rem;color:var(--rr-muted);line-height:1.5;margin-bottom:1rem">
            RAG-powered generation of 27-page regulated variance packages.
            60-70% effort reduction with human-in-the-loop review.
          </p>
          <div style="display:flex;justify-content:space-between;padding-top:0.75rem;border-top:1px solid var(--rr-border)">
            <span style="font-size:0.75rem;color:var(--rr-muted)">Documents generated</span>
            <span style="font-size:0.875rem;font-weight:600">{{ docCount }}</span>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:2rem">
        <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Run AI Agent</h3>
        <div style="display:flex;gap:1rem;align-items:end">
          <div class="form-group" style="flex:1;margin-bottom:0">
            <label>Select Request</label>
            <select [(ngModel)]="selectedRequestId">
              <option value="">Choose a request...</option>
              <option *ngFor="let r of requests" [value]="r.id">{{ r.referenceNumber }} — {{ r.title }}</option>
            </select>
          </div>
          <div class="form-group" style="width:200px;margin-bottom:0">
            <label>Agent</label>
            <select [(ngModel)]="selectedAgent">
              <option value="triage">Scoping / Triage</option>
              <option value="document">Document Authoring</option>
            </select>
          </div>
          <button class="btn-navy" (click)="runAgent()" [disabled]="!selectedRequestId || running" style="white-space:nowrap">
            {{ running ? 'Processing...' : 'Run Agent' }}
          </button>
        </div>
      </div>

      <div *ngIf="agentResult" class="card" style="border-left:3px solid #10B981">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
          <span style="font-size:18px">\u2728</span>
          <h3 style="font-size:0.875rem;font-weight:600">Agent Result</h3>
        </div>
        <pre style="font-size:0.8125rem;line-height:1.6;white-space:pre-wrap;color:var(--rr-muted);background:var(--rr-platinum);padding:1rem;border-radius:0.375rem">{{ agentResult | json }}</pre>
      </div>

      <div class="card" style="margin-top:2rem;background:#F0F9FF;border:1px solid #BAE6FD">
        <div style="display:flex;align-items:start;gap:0.75rem">
          <span style="font-size:24px">\u{1F4A1}</span>
          <div>
            <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:0.5rem">AI Architecture</h3>
            <p style="font-size:0.8125rem;color:var(--rr-muted);line-height:1.6">
              The AI Assist platform uses <strong>Azure OpenAI GPT-4</strong> with <strong>Retrieval Augmented Generation (RAG)</strong>
              on <strong>Databricks</strong>. The knowledge base includes 15,000+ historical variance resolutions,
              technical publications, AMM references, and regulatory guidance (EASA Part-145, FAA AC 43.13).
              All AI-generated content requires human-in-the-loop review before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AiAssistComponent implements OnInit {
  requests: VarianceRequestSummary[] = [];
  selectedRequestId = '';
  selectedAgent = 'triage';
  running = false;
  agentResult: unknown = null;
  initiateCount = 0;
  triageCount = 0;
  docCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getRequests({ page: 1, pageSize: 50 }).subscribe(r => {
      this.requests = r.items;
      this.triageCount = r.items.filter(i =>
        ['TriageComplete', 'SpecialistOpinion', 'RecommendationDrafted', 'DocumentAuthored', 'Approved', 'Completed'].includes(i.status)
      ).length;
      this.docCount = r.items.filter(i =>
        ['DocumentAuthored', 'Approved', 'Completed'].includes(i.status)
      ).length;
      this.initiateCount = r.totalCount;
    });
  }

  runAgent(): void {
    if (!this.selectedRequestId) return;
    this.running = true;
    this.agentResult = null;

    if (this.selectedAgent === 'triage') {
      this.api.triageRequest(this.selectedRequestId).subscribe({
        next: r => { this.agentResult = r; this.running = false; },
        error: () => { this.running = false; }
      });
    } else {
      this.api.generateDocument(this.selectedRequestId, 'Dr. J. Richardson').subscribe({
        next: r => { this.agentResult = r; this.running = false; },
        error: () => { this.running = false; }
      });
    }
  }
}
