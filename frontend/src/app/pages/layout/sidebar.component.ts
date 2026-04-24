import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="section-label">Overview</div>
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
          Dashboard
        </a>
        <a routerLink="/dashboard/requests" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/></svg>
          All Requests
          <span class="nav-count">12</span>
        </a>
      </div>

      <div class="sidebar-section">
        <div class="section-label">Workflow</div>
        <a routerLink="/dashboard/submit" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          New Request
        </a>
        <a routerLink="/dashboard/track" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
          Track Status
        </a>
        <a routerLink="/dashboard/triage" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/></svg>
          AI Triage
          <span class="nav-count warn">2</span>
        </a>
      </div>

      <div class="sidebar-section">
        <div class="section-label">AI & Documents</div>
        <a routerLink="/dashboard/documents" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
          Documents
          <span class="nav-count">4</span>
        </a>
        <a routerLink="/dashboard/ai-assist" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7H7v6h6V7z"/><path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/></svg>
          AI Agents
        </a>
      </div>

      <div class="sidebar-section">
        <div class="section-label">Configuration</div>
        <a routerLink="/dashboard/settings" routerLinkActive="active" class="nav-item">
          <svg class="nav-svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
          Settings
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="quick-stats">
          <div class="qs-item">
            <span class="qs-value">2</span>
            <span class="qs-label">Awaiting Triage</span>
          </div>
          <div class="qs-item">
            <span class="qs-value">3</span>
            <span class="qs-label">Critical</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 230px; min-height: 100%; background: #fff; border-right: 1px solid #e2e2ea;
      display: flex; flex-direction: column; overflow-y: auto;
    }
    .sidebar-section { padding: 0.75rem 0.75rem 0.25rem; }
    .section-label {
      font-size: 0.6rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;
      color: #8e8ea0; padding: 0 0.625rem; margin-bottom: 0.375rem;
    }
    .nav-item {
      display: flex; align-items: center; gap: 0.625rem; padding: 0.5rem 0.625rem;
      border-radius: 6px; font-size: 0.8rem; font-weight: 500; color: #3a3a52;
      text-decoration: none; transition: all 0.15s; cursor: pointer;
    }
    .nav-item:hover { background: #f0f0f5; color: #001233; }
    .nav-item.active { background: #001233; color: #fff; }
    .nav-item.active .nav-svg { color: #B8860B; }
    .nav-item.active .nav-count { background: rgba(255,255,255,0.2); color: #fff; }
    .nav-svg { width: 16px; height: 16px; flex-shrink: 0; color: #8e8ea0; }
    .nav-item:hover .nav-svg { color: #001233; }
    .nav-count {
      margin-left: auto; font-size: 0.65rem; font-weight: 600; padding: 0.1rem 0.4rem;
      border-radius: 10px; background: #e5e7eb; color: #4a4a6a;
    }
    .nav-count.warn { background: #fef3c7; color: #92400e; }
    .sidebar-footer {
      margin-top: auto; padding: 0.75rem; border-top: 1px solid #e2e2ea;
    }
    .quick-stats { display: flex; gap: 0.75rem; padding: 0.375rem; }
    .qs-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
    .qs-value { font-size: 1.1rem; font-weight: 700; color: #001233; }
    .qs-label { font-size: 0.6rem; color: #8e8ea0; text-align: center; }
  `]
})
export class SidebarComponent {}
