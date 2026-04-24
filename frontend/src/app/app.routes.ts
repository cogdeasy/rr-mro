import { Routes } from '@angular/router';
import { SubmitComponent } from './pages/submit/submit.component';
import { TrackComponent } from './pages/track/track.component';
import { DashboardLayoutComponent } from './pages/dashboard/dashboard-layout.component';
import { OverviewComponent } from './pages/dashboard/overview/overview.component';
import { RequestsComponent } from './pages/dashboard/requests/requests.component';
import { RequestDetailComponent } from './pages/dashboard/request-detail/request-detail.component';
import { AiAssistComponent } from './pages/dashboard/ai-assist/ai-assist.component';
import { DocumentsComponent } from './pages/dashboard/documents/documents.component';
import { TriageComponent } from './pages/dashboard/triage/triage.component';
import { SettingsComponent } from './pages/dashboard/settings/settings.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'requests/:id', component: RequestDetailComponent },
      { path: 'submit', component: SubmitComponent },
      { path: 'track', component: TrackComponent },
      { path: 'ai-assist', component: AiAssistComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'triage', component: TriageComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
