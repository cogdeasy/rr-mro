import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="gradient-hero" style="min-height:80vh;display:flex;align-items:center;position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><circle cx=%22200%22 cy=%22200%22 r=%22180%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.03)%22 stroke-width=%221%22/><circle cx=%22200%22 cy=%22200%22 r=%22140%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.02)%22 stroke-width=%221%22/><circle cx=%22200%22 cy=%22200%22 r=%22100%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.02)%22 stroke-width=%221%22/></svg>') center center / 400px repeat"></div>
      <div class="container" style="position:relative;z-index:1;width:100%">
        <div style="max-width:720px">
          <div class="section-label" style="margin-bottom:2rem">
            <div class="line" style="background:rgba(255,255,255,0.3)"></div>
            <span style="color:rgba(255,255,255,0.6)">MRO Variance Platform</span>
          </div>
          <h1 style="font-size:3.5rem;font-weight:700;color:#fff;line-height:1.1;margin-bottom:1.5rem">
            Non-Conformance<br>Variance Management
          </h1>
          <p style="font-size:1.125rem;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:2.5rem;max-width:600px">
            Digitising the technical variance process for the Rolls-Royce MRO network.
            AI-assisted triage, document authoring, and end-to-end workflow management
            across all engine programmes.
          </p>
          <div style="display:flex;gap:1rem;flex-wrap:wrap">
            <a routerLink="/submit" class="btn-primary" style="font-size:15px;padding:0.875rem 2rem">
              Submit Variance Request
            </a>
            <a routerLink="/track" class="btn-secondary" style="font-size:15px;padding:0.875rem 2rem">
              Track Requests
            </a>
          </div>
        </div>
      </div>
    </section>

    <section style="padding:5rem 0;background:var(--rr-platinum)">
      <div class="container">
        <div class="section-label">
          <div class="line"></div>
          <span>Platform Capabilities</span>
        </div>
        <h2 style="font-size:2rem;font-weight:700;margin-bottom:3rem">End-to-End Variance Lifecycle</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem">
          <div class="card">
            <div style="width:40px;height:40px;border-radius:8px;background:var(--rr-navy);display:flex;align-items:center;justify-content:center;margin-bottom:1rem">
              <span style="font-size:20px">\u{1F4CB}</span>
            </div>
            <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Digital Request Submission</h3>
            <p style="font-size:0.875rem;color:var(--rr-muted);line-height:1.6">
              MRO partners submit variance requests digitally with structured anomaly data,
              borescope imagery, and engineering drawings. AI Initiate Agent front-loads
              RFI questions to ensure completeness.
            </p>
          </div>
          <div class="card">
            <div style="width:40px;height:40px;border-radius:8px;background:var(--rr-navy);display:flex;align-items:center;justify-content:center;margin-bottom:1rem">
              <span style="font-size:20px">\u{1F916}</span>
            </div>
            <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">AI-Assisted Triage</h3>
            <p style="font-size:0.875rem;color:var(--rr-muted);line-height:1.6">
              Scoping and Triaging Agent classifies anomaly severity, matches against
              15,000+ prior variances via RAG, and routes to the appropriate specialist
              engineer automatically.
            </p>
          </div>
          <div class="card">
            <div style="width:40px;height:40px;border-radius:8px;background:var(--rr-navy);display:flex;align-items:center;justify-content:center;margin-bottom:1rem">
              <span style="font-size:20px">\u{1F4C4}</span>
            </div>
            <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem">Document Authoring Agent</h3>
            <p style="font-size:0.875rem;color:var(--rr-muted);line-height:1.6">
              RAG-powered Document Authoring Agent generates the 27-page regulated
              variance package with 60-70% effort reduction. Human-in-the-loop review
              ensures regulatory compliance.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section style="padding:5rem 0">
      <div class="container">
        <div class="section-label">
          <div class="line"></div>
          <span>Workflow</span>
        </div>
        <h2 style="font-size:2rem;font-weight:700;margin-bottom:3rem">Variance Request Lifecycle</h2>
        <div style="display:flex;gap:0;align-items:stretch;overflow-x:auto;padding-bottom:1rem">
          <div class="workflow-step" *ngFor="let step of workflowSteps; let last = last">
            <div class="step-dot" [style.background]="step.color"></div>
            <div class="step-content">
              <h4>{{ step.name }}</h4>
              <p>{{ step.description }}</p>
            </div>
            <div class="step-arrow" *ngIf="!last">&#8594;</div>
          </div>
        </div>
      </div>
    </section>

    <section class="gradient-rr" style="padding:4rem 0">
      <div class="container" style="text-align:center">
        <h2 style="font-size:2rem;font-weight:700;color:#fff;margin-bottom:1rem">Engine Programmes Supported</h2>
        <p style="color:rgba(255,255,255,0.6);margin-bottom:2.5rem">Covering the full Rolls-Royce civil aerospace fleet</p>
        <div style="display:flex;justify-content:center;gap:2rem;flex-wrap:wrap">
          <div class="engine-card" *ngFor="let engine of engines">
            <span style="font-size:15px;font-weight:600;color:#fff">{{ engine }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .workflow-step {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      min-width: 180px;
    }
    .step-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .step-content h4 {
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .step-content p {
      font-size: 0.75rem;
      color: var(--rr-muted);
      line-height: 1.4;
    }
    .step-arrow {
      color: var(--rr-silver-dark);
      font-size: 1.25rem;
      padding: 0 0.5rem;
      flex-shrink: 0;
    }
    .engine-card {
      padding: 1rem 1.5rem;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 0.5rem;
      transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.15); }
    }
  `]
})
export class LandingComponent {
  workflowSteps = [
    { name: 'Submit', description: 'MRO submits variance request', color: '#3B82F6' },
    { name: 'Triage', description: 'AI classifies & routes', color: '#F59E0B' },
    { name: 'Specialist', description: 'Expert opinion gathered', color: '#8B5CF6' },
    { name: 'Draft', description: 'AI-assisted document authoring', color: '#0EA5E9' },
    { name: 'Review', description: 'Human-in-the-loop validation', color: '#10B981' },
    { name: 'Approve', description: 'Digital signature & release', color: '#16A34A' },
  ];

  engines = ['Trent 1000', 'Trent XWB', 'Trent 7000', 'Trent 900', 'Trent 500', 'BR725'];
}
