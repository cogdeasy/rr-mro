# Angular 17 → React Migration Prompt

> **Purpose**: Comprehensive instruction set for migrating the Rolls-Royce MRO Variance Platform frontend from Angular 17 to React 18. A developer or AI agent can follow this document end-to-end to execute the migration.

---

## 1. Project Context

- **Repository**: `cogdeasy/rr-mro`
- **Current stack**: Angular 17.3.x (standalone components, inline templates, no NgModules)
- **Frontend directory**: `frontend/`
- **Key files**:
  - `frontend/package.json` — dependencies (Angular 17.3.0, TypeScript ~5.4.2, RxJS ~7.8.0, zone.js ~0.14.3, Karma test runner)
  - `frontend/angular.json` — uses `@angular-devkit/build-angular:application` builder
  - `frontend/src/app/app.routes.ts` — 10 routes nested under `/dashboard` layout
  - `frontend/src/app/shared/services/api.service.ts` — single centralized API service with 10 methods (`getRequests`, `getRequest`, `createRequest`, `updateStatus`, `addComment`, `getStats`, `triageRequest`, `generateDocument`, `getDocument`, `getEngineTypes`, `getMroOrganisations`, `getAnomalyTypes`), base URL `http://localhost:5062/api`
  - `frontend/src/styles.scss` — global styles with CSS custom properties (`--rr-navy`, `--rr-silver`, `--rr-platinum`, `--rr-gold`, etc.), utility classes (`.btn-primary`, `.btn-secondary`, `.btn-navy`, `.btn-outline`, `.card`, `.badge`, `.form-group`)
  - `frontend/src/app/pages/dashboard/dashboard-layout.component.ts` — layout shell (Header + Sidebar + router-outlet)

---

## 2. Application Inventory

### Components (15 total)

| Component | File | Role |
|-----------|------|------|
| `AppComponent` | `app.component.ts` | Root, standalone, imports `RouterOutlet` |
| `DashboardLayoutComponent` | `dashboard-layout.component.ts` | Layout shell with Header, Sidebar, `router-outlet` |
| `SidebarComponent` | `sidebar.component.ts` | Navigation sidebar with `routerLink` / `routerLinkActive` |
| `HeaderComponent` | `header.component.ts` | Top header bar |
| `OverviewComponent` | `overview.component.ts` | Dashboard overview with stats, KPIs, charts, recent requests |
| `RequestsComponent` | `requests.component.ts` | Filtered/paginated request list with search, status/priority/engine filters |
| `RequestDetailComponent` | `request-detail.component.ts` | Single request detail view using `ActivatedRoute` params |
| `SubmitComponent` | `submit.component.ts` | Form with ~12 fields using template-driven forms (`FormsModule` / `ngModel`) |
| `TrackComponent` | `track.component.ts` | Request tracking page |
| `TriageComponent` | `triage.component.ts` | AI triage page |
| `DocumentsComponent` | `documents.component.ts` | Documents listing with `*ngFor` |
| `AiAssistComponent` | `ai-assist.component.ts` | AI assistance page |
| `SettingsComponent` | `settings.component.ts` | Settings page |

### Services

- **`ApiService`** — `@Injectable({ providedIn: 'root' })`, uses `HttpClient`, returns `Observable<T>` for all methods

### Models

- **`variance-request.model.ts`** — TypeScript interfaces for `VarianceRequest`, related types

### Not Present

- No guards, interceptors, pipes, directives, or state management libraries
- No NgModules
- No complex RxJS pipe chains
- No third-party Angular UI libraries

---

## 3. Target Stack

| Concern | Technology |
|---------|-----------|
| UI Library | React 18+ with TypeScript |
| Build Tooling | Vite |
| Routing | React Router v6 (with `<Outlet />` for nested layouts) |
| Data Fetching | TanStack Query (React Query) or plain `fetch` + `useEffect` |
| Forms | React Hook Form or controlled components |
| Testing | Vitest + React Testing Library |
| Styling | Same SCSS / CSS custom properties (reuse `styles.scss` as-is) |

---

## 4. Migration Phases

### Phase 1: Scaffold React Project

1. Create a new `frontend-react/` directory alongside the existing `frontend/`
2. Initialize with Vite + React + TypeScript template:
   ```bash
   npm create vite@latest frontend-react -- --template react-ts
   ```
3. Set up SCSS support:
   ```bash
   cd frontend-react && npm install -D sass
   ```
4. Copy `frontend/src/styles.scss` into `frontend-react/src/styles.scss` verbatim
5. Import it in `main.tsx`:
   ```tsx
   import './styles.scss';
   ```
6. Install additional dependencies:
   ```bash
   npm install react-router-dom @tanstack/react-query react-hook-form
   ```

### Phase 2: Shared Layer — Models + API

1. **Models**: Copy TypeScript interfaces from `variance-request.model.ts` directly — they are framework-agnostic and require no changes.

2. **API Service**: Convert `ApiService` from an Angular `@Injectable` class with `HttpClient` / `Observable` to plain async functions using `fetch`.

   **Angular (before)**:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class ApiService {
     private baseUrl = 'http://localhost:5062/api';
     constructor(private http: HttpClient) {}
     getRequests(): Observable<VarianceRequest[]> {
       return this.http.get<VarianceRequest[]>(`${this.baseUrl}/variance`);
     }
   }
   ```

   **React (after)**:
   ```typescript
   const BASE_URL = 'http://localhost:5062/api';

   export async function getRequests(): Promise<VarianceRequest[]> {
     const res = await fetch(`${BASE_URL}/variance`);
     if (!res.ok) throw new Error(`Failed to fetch requests: ${res.status}`);
     return res.json();
   }
   ```

3. All 10 API methods are straightforward `GET` / `POST` / `PATCH` calls with no complex RxJS operators — direct translation to `async` / `await`.
4. Base URL: `http://localhost:5062/api` (unchanged).

### Phase 3: Layout Shell + Routing

1. Create `DashboardLayout` component with Header, Sidebar, and `<Outlet />`:
   ```tsx
   import { Outlet } from 'react-router-dom';
   import { Header } from './Header';
   import { Sidebar } from './Sidebar';

   export function DashboardLayout() {
     return (
       <div className="dashboard-layout">
         <Header />
         <Sidebar />
         <main className="main-content">
           <Outlet />
         </main>
       </div>
     );
   }
   ```

2. Set up React Router v6 routes matching the Angular route config:
   ```tsx
   import { createBrowserRouter, Navigate } from 'react-router-dom';

   const router = createBrowserRouter([
     { path: '/', element: <Navigate to="/dashboard" replace /> },
     {
       path: '/dashboard',
       element: <DashboardLayout />,
       children: [
         { index: true, element: <Overview /> },
         { path: 'requests', element: <Requests /> },
         { path: 'requests/:id', element: <RequestDetail /> },
         { path: 'submit', element: <Submit /> },
         { path: 'track', element: <Track /> },
         { path: 'ai-assist', element: <AiAssist /> },
         { path: 'documents', element: <Documents /> },
         { path: 'triage', element: <Triage /> },
         { path: 'settings', element: <Settings /> },
       ],
     },
     { path: '*', element: <Navigate to="/dashboard" replace /> },
   ]);
   ```

3. Convert Sidebar's `routerLink` / `routerLinkActive` to React Router's `<NavLink>` with active `className` callback:
   ```tsx
   <NavLink
     to="/dashboard/requests"
     className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
   >
     Requests
   </NavLink>
   ```

### Phase 4: Page Components

Migrate each component following these patterns:

#### Data-Fetching Pages (Overview, Requests, Triage, Documents, AI Assist)

**Angular pattern**:
```typescript
ngOnInit() {
  this.apiService.getRequests().subscribe(data => this.requests = data);
}
```

**React pattern (useEffect + useState)**:
```tsx
const [requests, setRequests] = useState<VarianceRequest[]>([]);

useEffect(() => {
  getRequests().then(setRequests);
}, []);
```

**React pattern (TanStack Query)**:
```tsx
const { data: requests = [] } = useQuery({
  queryKey: ['requests'],
  queryFn: getRequests,
});
```

#### Form Pages (Submit)

**Angular pattern**: `[(ngModel)]` on ~12 fields with template-driven forms.

**React pattern (controlled inputs)**:
```tsx
const [form, setForm] = useState({ title: '', description: '', ... });

<input
  value={form.title}
  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
/>
```

**React pattern (React Hook Form)**:
```tsx
const { register, handleSubmit } = useForm<CreateRequestDto>();

<input {...register('title', { required: true })} />
```

#### Detail Page (RequestDetail)

**Angular**: `ActivatedRoute.snapshot.paramMap.get('id')`

**React**: `useParams()`
```tsx
const { id } = useParams<{ id: string }>();

useEffect(() => {
  getRequest(id!).then(setRequest);
}, [id]);
```

#### Filtered List (Requests)

**Angular**: `ngModel` filters + manual reload

**React**: `useState` for filters + `useEffect` with dependencies
```tsx
const [statusFilter, setStatusFilter] = useState('');
const [searchTerm, setSearchTerm] = useState('');

const filtered = useMemo(() =>
  requests
    .filter(r => !statusFilter || r.status === statusFilter)
    .filter(r => !searchTerm || r.title.toLowerCase().includes(searchTerm.toLowerCase())),
  [requests, statusFilter, searchTerm]
);
```

#### Template Syntax Translation Reference

| Angular | React |
|---------|-------|
| `*ngFor="let r of items"` | `{items.map(r => ...)}` |
| `*ngIf="stats"` | `{stats && ...}` |
| `[ngClass]="{ active: isActive }"` | `className={isActive ? 'active' : ''}` |
| `(click)="fn()"` | `onClick={() => fn()}` |
| `[(ngModel)]="form.x"` | `value={form.x} onChange={...}` |
| `{{ date \| date:'short' }}` | `new Date(date).toLocaleDateString()` |
| `{{ num \| number:'1.1-1' }}` | `num.toFixed(1)` |
| `[routerLink]="['/path']"` | `<Link to="/path">` |
| `routerLinkActive="active"` | `<NavLink className={({ isActive }) => ...}>` |
| `<router-outlet></router-outlet>` | `<Outlet />` |

### Phase 5: Styling

1. **Global SCSS** (`styles.scss`) with CSS custom properties and utility classes (`.card`, `.badge`, `.btn-navy`, `.form-group`, etc.) — reuse directly with zero changes.
2. **Component-scoped inline styles** → CSS Modules (`.module.scss`) or regular CSS classes.
3. Preserve all branding:
   - Primary: Navy `#001233`
   - Platinum background: `#F5F5F7`
   - Silver accents: `#C0C0C0`
   - Gold highlights: `#B8860B`
   - Gradients: `gradient-rr` / `gradient-hero` CSS classes

### Phase 6: Testing

1. Replace Karma / Jasmine with Vitest + React Testing Library.
2. Configure in `vite.config.ts`:
   ```typescript
   /// <reference types="vitest" />
   export default defineConfig({
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test-setup.ts',
     },
   });
   ```
3. Install test dependencies:
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
   ```
4. Write component tests for key pages (Overview, Requests, Submit, RequestDetail).

### Phase 7: Cutover

1. Verify all pages render correctly and match Angular behaviour.
2. Verify all API calls work against the .NET backend at `http://localhost:5062/api`.
3. Update any build/deploy scripts to point to `frontend-react/`.
4. Swap build output to the React app.
5. Remove the Angular `frontend/` directory (or archive it).

---

## 5. Key Notes

- **App size**: ~15 components, ~2,500 lines of component code — a clean rewrite is more practical than an incremental strangler-fig approach.
- **No third-party Angular UI libraries** to replace.
- **No complex Angular-specific patterns**: no NgModules, no RxJS pipe chains, no custom directives/pipes, no DI hierarchy.
- **All templates are inline** — no separate `.html` files to port.
- **Backend is unchanged**: the ASP.NET Core 8 API at `http://localhost:5062/api` remains as-is; only the frontend is being rewritten.
- **In-memory data store**: the backend uses `Data/SeedData.cs` with 12 realistic variance requests — no database setup required for development.

---

## 6. File Structure (Target)

```
frontend-react/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles.scss                  ← copied from Angular, unchanged
│   ├── api/
│   │   └── api.ts                   ← async fetch functions (replaces ApiService)
│   ├── models/
│   │   └── variance-request.ts      ← copied from Angular, unchanged
│   ├── components/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── shared/                  ← any reusable UI components
│   ├── pages/
│   │   ├── Overview.tsx
│   │   ├── Requests.tsx
│   │   ├── RequestDetail.tsx
│   │   ├── Submit.tsx
│   │   ├── Track.tsx
│   │   ├── Triage.tsx
│   │   ├── Documents.tsx
│   │   ├── AiAssist.tsx
│   │   └── Settings.tsx
│   └── test-setup.ts
└── ...
```

---

## 7. Validation Checklist

After migration, verify:

- [ ] All 10 routes render without errors
- [ ] Dashboard overview loads stats and KPIs from API
- [ ] Request list supports search, status, priority, and engine filters
- [ ] Request detail page loads by ID from URL params
- [ ] Submit form captures all ~12 fields and POSTs to API
- [ ] AI Triage page calls triage endpoint
- [ ] Documents page lists and generates documents
- [ ] Sidebar navigation highlights active route
- [ ] All CSS custom properties and utility classes render correctly
- [ ] Branding colours and gradients match the Angular version
- [ ] Vitest test suite passes
- [ ] Production build (`npm run build`) completes without errors
