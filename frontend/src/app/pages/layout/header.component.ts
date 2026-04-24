import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="gradient-rr" style="border-bottom: 1px solid rgba(255,255,255,0.1)">
      <div class="container">
        <div style="display:flex;align-items:center;justify-content:space-between;height:64px">
          <a routerLink="/" style="display:flex;align-items:center;gap:12px">
            <span style="font-size:14px;font-weight:700;letter-spacing:0.15em;color:#fff">ROLLS-ROYCE</span>
          </a>
          <nav style="display:flex;align-items:center;gap:2rem">
            <a routerLink="/submit" style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.7);transition:color 0.2s">Submit Request</a>
            <a routerLink="/track" style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.7);transition:color 0.2s">Track Requests</a>
            <a routerLink="/dashboard" class="btn-primary" style="padding:0.5rem 1rem;font-size:13px">Internal Dashboard</a>
          </nav>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {}
