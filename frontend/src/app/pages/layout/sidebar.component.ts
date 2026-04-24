import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar gradient-rr" [class.collapsed]="collapsed">
      <div class="sidebar-header">
        <span class="logo" *ngIf="!collapsed">ROLLS-ROYCE</span>
        <button class="toggle-btn" (click)="collapsed = !collapsed">
          {{ collapsed ? '&#9654;' : '&#9664;' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <a *ngFor="let item of navItems"
           [routerLink]="item.path"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: !!item.exact}"
           class="nav-item"
           [title]="collapsed ? item.name : ''">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!collapsed">{{ item.name }}</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="user-avatar">JR</div>
        <div class="user-info" *ngIf="!collapsed">
          <p class="user-name">Dr. J. Richardson</p>
          <p class="user-role">Lead Engineer</p>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 260px;
      color: #fff;
      transition: width 0.3s ease;
      &.collapsed { width: 68px; }
    }
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.15em;
    }
    .toggle-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.6);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 4px;
      font-size: 12px;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
    }
    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: all 0.2s;
      &:hover { background: rgba(255,255,255,0.1); color: #fff; }
      &.active { background: rgba(255,255,255,0.15); color: #fff; }
    }
    .nav-icon { font-size: 18px; width: 20px; text-align: center; }
    .sidebar-footer {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .user-name { font-size: 14px; font-weight: 500; }
    .user-role { font-size: 12px; color: rgba(255,255,255,0.5); }
  `]
})
export class SidebarComponent {
  collapsed = false;
  navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: '\u{1F4CA}', exact: true },
    { name: 'Requests', path: '/dashboard/requests', icon: '\u{1F4CB}' },
    { name: 'AI Triage', path: '/dashboard/triage', icon: '\u{1F916}' },
    { name: 'Documents', path: '/dashboard/documents', icon: '\u{1F4C4}' },
    { name: 'AI Assist', path: '/dashboard/ai-assist', icon: '\u2728' },
    { name: 'Settings', path: '/dashboard/settings', icon: '\u2699\uFE0F' },
  ];
}
