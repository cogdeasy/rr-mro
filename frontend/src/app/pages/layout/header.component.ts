import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-left">
        <span class="logo-rr">RR</span>
        <span class="logo-divider"></span>
        <span class="logo-text">MRO Variance Platform</span>
      </div>
      <div class="header-center">
        <div class="search-box">
          <span class="search-icon">&#x1F50D;</span>
          <input type="text" placeholder="Search requests, documents, engines..." class="search-input" />
        </div>
      </div>
      <div class="header-right">
        <span class="env-badge">PROD</span>
        <div class="notif-icon" title="Notifications">
          <span>&#x1F514;</span>
          <span class="notif-dot"></span>
        </div>
        <div class="user-avatar" title="Dr. J. Richardson">JR</div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 1.25rem; height: 52px; background: #001233; color: #fff;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .header-left { display: flex; align-items: center; gap: 0.75rem; }
    .logo-rr { font-size: 1.1rem; font-weight: 700; letter-spacing: 2px; color: #B8860B; }
    .logo-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.2); }
    .logo-text { font-size: 0.85rem; font-weight: 500; opacity: 0.85; }
    .header-center { flex: 1; display: flex; justify-content: center; padding: 0 2rem; }
    .search-box {
      display: flex; align-items: center; gap: 0.5rem;
      background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 8px; padding: 0 0.75rem; width: 100%; max-width: 420px;
    }
    .search-icon { font-size: 0.8rem; opacity: 0.5; }
    .search-input {
      background: none; border: none; color: #fff; font-size: 0.8rem;
      padding: 0.45rem 0; width: 100%; outline: none;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.4); }
    .header-right { display: flex; align-items: center; gap: 0.75rem; }
    .env-badge {
      padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-weight: 600;
      background: rgba(16,185,129,0.2); color: #10b981; letter-spacing: 0.05em;
    }
    .notif-icon {
      position: relative; cursor: pointer; font-size: 1rem; opacity: 0.7;
      transition: opacity 0.2s;
    }
    .notif-icon:hover { opacity: 1; }
    .notif-dot {
      position: absolute; top: -2px; right: -4px; width: 7px; height: 7px;
      background: #ef4444; border-radius: 50%; border: 1.5px solid #001233;
    }
    .user-avatar {
      width: 30px; height: 30px; border-radius: 50%; background: #B8860B; color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 600; cursor: pointer;
    }
  `]
})
export class HeaderComponent {}
