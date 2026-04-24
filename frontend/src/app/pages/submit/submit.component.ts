import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-submit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="gradient-rr" style="padding:3rem 0 2rem">
      <div class="container">
        <div class="section-label" style="margin-bottom:1rem">
          <div class="line" style="background:rgba(255,255,255,0.3)"></div>
          <span style="color:rgba(255,255,255,0.6)">MRO Portal</span>
        </div>
        <h1 style="font-size:2rem;font-weight:700;color:#fff;margin-bottom:0.5rem">Submit Variance Request</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:0.875rem">Submit a new non-conformance technical variance for review</p>
      </div>
    </section>

    <section style="padding:2rem 0 4rem;background:var(--rr-platinum)">
      <div class="container" style="max-width:900px">
        <div class="card" style="padding:2rem">
          <form (ngSubmit)="onSubmit()">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem">
              <div class="form-group" style="grid-column:span 2">
                <label>Request Title *</label>
                <input type="text" [(ngModel)]="form.title" name="title" placeholder="e.g. HPT Blade Tip Liberation — Trent XWB SN-7842" required>
              </div>
              <div class="form-group" style="grid-column:span 2">
                <label>Description *</label>
                <textarea [(ngModel)]="form.description" name="description" rows="4"
                  placeholder="Describe the non-conformance in detail including inspection findings, measurements, and deviations from AMM limits"></textarea>
              </div>

              <div class="form-group">
                <label>Anomaly Type *</label>
                <select [(ngModel)]="form.anomalyType" name="anomalyType" required>
                  <option value="">Select anomaly type</option>
                  <option *ngFor="let t of anomalyTypes" [value]="t">{{ t }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Engine Type *</label>
                <select [(ngModel)]="form.engineType" name="engineType" required>
                  <option value="">Select engine type</option>
                  <option *ngFor="let e of engineTypes" [value]="e">{{ e }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Engine Serial Number *</label>
                <input type="text" [(ngModel)]="form.engineSerialNumber" name="engineSerialNumber" placeholder="e.g. SN-7842" required>
              </div>
              <div class="form-group">
                <label>Part Number</label>
                <input type="text" [(ngModel)]="form.partNumber" name="partNumber" placeholder="e.g. RB211-9278">
              </div>

              <div class="form-group">
                <label>Aircraft Registration</label>
                <input type="text" [(ngModel)]="form.aircraftRegistration" name="aircraftRegistration" placeholder="e.g. G-XWBA">
              </div>
              <div class="form-group">
                <label>Priority *</label>
                <select [(ngModel)]="form.priority" name="priority" required>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div class="form-group">
                <label>MRO Organisation *</label>
                <select [(ngModel)]="form.mroOrganisation" name="mroOrganisation" required>
                  <option value="">Select MRO partner</option>
                  <option *ngFor="let m of mroOrganisations" [value]="m">{{ m }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>MRO Site Location</label>
                <input type="text" [(ngModel)]="form.mroSiteLocation" name="mroSiteLocation" placeholder="e.g. Hamburg, Germany">
              </div>

              <div class="form-group">
                <label>Shop Visit Reference</label>
                <input type="text" [(ngModel)]="form.shopVisitReference" name="shopVisitReference" placeholder="e.g. SV-2025-LHT-0042">
              </div>
              <div class="form-group">
                <label>Submitted By *</label>
                <input type="text" [(ngModel)]="form.submittedBy" name="submittedBy" placeholder="e.g. M. Weber" required>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:1rem;margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--rr-border)">
              <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:0.375rem;padding:1rem">
                <div style="display:flex;align-items:start;gap:0.75rem">
                  <span style="font-size:18px">\u{1F916}</span>
                  <div>
                    <p style="font-size:0.875rem;font-weight:600;margin-bottom:0.25rem">AI Initiate Agent</p>
                    <p style="font-size:0.8125rem;color:var(--rr-muted)">
                      Upon submission, the AI Initiate Agent will analyse your request and may
                      generate additional RFI questions to ensure completeness before triage.
                    </p>
                  </div>
                </div>
              </div>

              <div style="display:flex;justify-content:flex-end;gap:1rem">
                <a routerLink="/" class="btn-outline">Cancel</a>
                <button type="submit" class="btn-navy" [disabled]="submitting">
                  {{ submitting ? 'Submitting...' : 'Submit Request' }}
                </button>
              </div>
            </div>
          </form>

          <div *ngIf="submitted" style="margin-top:1.5rem;padding:1.25rem;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:0.375rem">
            <p style="font-size:0.875rem;font-weight:600;color:#166534;margin-bottom:0.25rem">Request Submitted Successfully</p>
            <p style="font-size:0.8125rem;color:#15803D">
              Reference: {{ submittedRef }} — Your request has been submitted and will be triaged shortly.
            </p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class SubmitComponent implements OnInit {
  engineTypes: string[] = [];
  mroOrganisations: string[] = [];
  anomalyTypes: string[] = [];
  submitting = false;
  submitted = false;
  submittedRef = '';

  form = {
    title: '',
    description: '',
    anomalyType: '',
    engineType: '',
    engineSerialNumber: '',
    partNumber: '',
    aircraftRegistration: '',
    priority: 'Medium',
    mroOrganisation: '',
    mroSiteLocation: '',
    shopVisitReference: '',
    submittedBy: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getEngineTypes().subscribe(d => this.engineTypes = d);
    this.api.getMroOrganisations().subscribe(d => this.mroOrganisations = d);
    this.api.getAnomalyTypes().subscribe(d => this.anomalyTypes = d);
  }

  onSubmit(): void {
    this.submitting = true;
    this.api.createRequest(this.form as Record<string, unknown>).subscribe({
      next: (r) => {
        this.submitted = true;
        this.submitting = false;
        this.submittedRef = r.referenceNumber;
      },
      error: () => { this.submitting = false; }
    });
  }
}
