# Agent Instructions — RR MRO Variance Platform

## Project Context
This is the Rolls-Royce MRO (Maintenance, Repair & Overhaul) Variance Platform. It digitises the Non-Conformance Technical Variance process for civil aerospace engines.

## Tech Stack
- **Frontend**: React 19 (Vite, SCSS, TypeScript)
- **Backend**: ASP.NET Core 8 Web API (C#)
- Frontend served on `http://localhost:5173` (Vite dev server)
- Backend API on `http://localhost:5062`
- Swagger UI at `http://localhost:5062/swagger`

## Branding
- Primary colour: Navy (#001233)
- Platinum background: (#F5F5F7)
- Silver accents: (#C0C0C0)
- Gold highlights: (#B8860B)
- All gradients use `gradient-rr` / `gradient-hero` CSS classes
- Logo: ROLLS-ROYCE wordmark in header component

## Frontend Conventions
- React functional components with hooks
- Pages in `src/pages/`
- Shared types in `src/types/`
- API service in `src/api/apiService.ts` (async/await with axios)
- Layout components (Header, Footer, Sidebar, DashboardLayout) in `src/components/layout/`
- React Router v7 for routing (`src/App.tsx`)
- Global styles in `src/styles.scss`; component styles in co-located `.scss` files

## Backend Conventions
- Controllers in `Controllers/`
- Domain models in `Models/`
- DTOs in `DTOs/`
- Services in `Services/`
- Seed data in `Data/SeedData.cs` (12 realistic variance requests)
- In-memory data store (no database required)

## Domain Language
- **Variance Request**: A formal regulated request when an MRO hits a non-standard issue
- **Anomaly**: The engineering defect or non-conformance discovered
- **Disposition**: The final decision on how to handle a variance
- **RFI**: Request for Information — follow-up questions between parties
- **MRO**: Maintenance, Repair & Overhaul organisation
- **Triage**: AI-assisted classification of anomaly severity and routing to specialist
- **Document Authoring**: AI-assisted generation of 27-page regulated variance packages

## Engine Programmes
Trent 1000, Trent XWB, Trent 7000, Trent 900, Trent 500, BR725

## MRO Network
Lufthansa Technik, SIA Engineering, Delta TechOps, AFI KLM E&M, ST Aerospace, HAECO, Turkish Technic, Rolls-Royce Derby
