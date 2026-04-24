import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/layout/header.component';
import { FooterComponent } from './pages/layout/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
    <app-footer *ngIf="showFooter"></app-footer>
  `,
  styles: []
})
export class AppComponent {
  title = 'RR MRO Variance Platform';
  showFooter = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      this.showFooter = !e.urlAfterRedirects.startsWith('/dashboard');
    });
  }
}
