import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

function initializeXsrfToken(http: HttpClient): () => Promise<void> {
  return () => firstValueFrom(
    http.get(`${environment.apiBaseUrl}/antiforgery/token`)
  ).then(() => {}).catch(() => {});
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeXsrfToken,
      deps: [HttpClient],
      multi: true
    }
  ]
};
