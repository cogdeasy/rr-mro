import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:2rem">
      <div style="margin-bottom:2rem">
        <h1 style="font-size:1.5rem;font-weight:700;margin-bottom:0.25rem">Platform Settings</h1>
        <p style="font-size:0.875rem;color:var(--rr-muted)">Configure MRO Variance Platform settings and integrations</p>
      </div>

      <div style="display:grid;gap:1.5rem;max-width:800px">
        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">AI Agent Configuration</h3>
          <div style="display:grid;gap:1rem">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <div>
                <p style="font-size:0.8125rem;font-weight:500">Initiate Agent</p>
                <p style="font-size:0.75rem;color:var(--rr-muted)">Front-load RFI questions on submission</p>
              </div>
              <span style="font-size:0.75rem;font-weight:500;color:#16A34A;background:#F0FDF4;padding:0.25rem 0.5rem;border-radius:4px">Active</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <div>
                <p style="font-size:0.8125rem;font-weight:500">Scoping / Triage Agent</p>
                <p style="font-size:0.75rem;color:var(--rr-muted)">Severity classification and specialist routing</p>
              </div>
              <span style="font-size:0.75rem;font-weight:500;color:#16A34A;background:#F0FDF4;padding:0.25rem 0.5rem;border-radius:4px">Active</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <div>
                <p style="font-size:0.8125rem;font-weight:500">Document Authoring Agent</p>
                <p style="font-size:0.75rem;color:var(--rr-muted)">RAG-powered variance document generation</p>
              </div>
              <span style="font-size:0.75rem;font-weight:500;color:#16A34A;background:#F0FDF4;padding:0.25rem 0.5rem;border-radius:4px">Active</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Azure Integration</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div style="padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">AI Model</p>
              <p style="font-size:0.8125rem;font-weight:500">Azure OpenAI GPT-4</p>
            </div>
            <div style="padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">RAG Platform</p>
              <p style="font-size:0.8125rem;font-weight:500">Databricks</p>
            </div>
            <div style="padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Knowledge Base</p>
              <p style="font-size:0.8125rem;font-weight:500">15,000+ variances</p>
            </div>
            <div style="padding:0.75rem;background:var(--rr-platinum);border-radius:0.375rem">
              <p style="font-size:0.75rem;color:var(--rr-muted);margin-bottom:0.25rem">Region</p>
              <p style="font-size:0.8125rem;font-weight:500">UK South</p>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Regulatory Compliance</h3>
          <div style="display:grid;gap:0.75rem">
            <div *ngFor="let reg of regulations" style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--rr-border)">
              <div style="width:6px;height:6px;border-radius:50%;background:var(--rr-navy)"></div>
              <div>
                <p style="font-size:0.8125rem;font-weight:500">{{ reg.name }}</p>
                <p style="font-size:0.75rem;color:var(--rr-muted)">{{ reg.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:0.875rem;font-weight:600;margin-bottom:1rem">Engine Programmes</h3>
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
            <span *ngFor="let e of engines" style="padding:0.375rem 0.75rem;background:var(--rr-navy);color:#fff;border-radius:0.375rem;font-size:0.8125rem;font-weight:500">{{ e }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  engines = ['Trent 1000', 'Trent XWB', 'Trent 7000', 'Trent 900', 'Trent 500', 'BR725'];
  regulations = [
    { name: 'EASA Part-145', description: 'Approved maintenance organisation regulation' },
    { name: 'EASA Part-21', description: 'Certification of aircraft and related products' },
    { name: 'FAA AC 43.13', description: 'Acceptable methods, techniques, and practices' },
    { name: 'ICAO Annex 8', description: 'Airworthiness of aircraft standards' },
    { name: 'UK CAA CAP 562', description: 'Civil aircraft airworthiness information and procedures' },
  ];
}
