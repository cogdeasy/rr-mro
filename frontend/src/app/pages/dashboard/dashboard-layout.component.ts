import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../layout/sidebar.component';
import { HeaderComponent } from '../layout/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <app-header></app-header>
    <div style="display:flex;height:calc(100vh - 52px)">
      <app-sidebar></app-sidebar>
      <main style="flex:1;overflow-y:auto;background:#F5F5F7">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class DashboardLayoutComponent {}
