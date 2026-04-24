# Agent Instructions — RR MRO Variance Platform

## Project Context

This is the **Rolls-Royce MRO Variance Platform** — the primary application for digitising the Non-Conformance Technical Variance (NCTV) process for civil aerospace engines.

Currently, variation requests, processing by internal engineering teams, and communication of final decisions are done through emails, manual updates to Word documents, manual search of similar deviations, and Kanban board tracking. The Infosys Team is building this application to digitise these manual processes, exploit AI to optimise them, and manage end-to-end workflow.

The MRO portal was partly developed by another team and is being transitioned to Infosys for complete development, including integration with AI Assist.

## Tech Stack

- **Frontend**: Angular 17 (standalone components, SCSS, TypeScript) — Micro Front End (MFE) architecture
- **Backend**: ASP.NET Core 8 Web API (C#)
- **AI/ML**: Azure OpenAI GPT-4, RAG over 15,000+ historical variances, customised instructions
- **Infrastructure**: Azure App Service, Azure SQL, Blob Storage, Databricks
- Frontend served on `http://localhost:4200`
- Backend API on `http://localhost:5062`
- Swagger UI at `http://localhost:5062/swagger`

## Branding

- Primary colour (RR Navy): `#001233`
- Platinum background: `#F5F5F7`
- Silver accents: `#C0C0C0`
- Gold highlights: `#B8860B`
- All gradients use `gradient-rr` / `gradient-hero` CSS classes
- Logo: ROLLS-ROYCE wordmark in header component

## Frontend Conventions

- All components are standalone (no NgModules)
- Inline templates and styles in component `.ts` files
- Pages in `src/app/pages/`
- Shared models in `src/app/shared/models/`
- API service in `src/app/shared/services/api.service.ts`
- Layout components (header, footer, sidebar) in `src/app/pages/layout/`

## Backend Conventions

- Controllers in `Controllers/`
- Domain models in `Models/`
- DTOs in `DTOs/`
- Services in `Services/`
- Seed data in `Data/SeedData.cs` (12 realistic variance requests)
- In-memory data store (no database required)

## Domain Language

- **Variation Request (VR)**: Formal regulated request when an MRO encounters a non-standard issue during engine maintenance
- **NCTV**: Non-Conformance Technical Variance — the formal process this platform digitises
- **Anomaly**: The engineering defect or non-conformance discovered during MRO work
- **Disposition**: The final decision on how to handle a variance (approve, reject, conditional)
- **RFI**: Request for Information — follow-up queries between RR and MROs to clarify submission details
- **MRO**: Maintenance, Repair & Overhaul organisation (external partners submitting variance requests)
- **Triage**: AI-assisted classification of anomaly severity and routing to specialist
- **Document Authoring**: AI-assisted generation of regulated variance documentation packages
- **AI Assist**: OpenAI GPT + RAG tool used at submission, triage, and document authoring stages
- **Digital Signature**: Authorised signatory approval captured electronically for audit trail
- **Shop Visit Reference**: Unique ID for a specific engine maintenance event at an MRO facility
- **AOG**: Aircraft On Ground — indicates highest severity/criticality level
- **Micro Front End (MFE)**: Architecture pattern for the platform's modular UI components
- **Human in the Loop**: AI-generated content is always reviewed and updated by human experts before final signoff

## AI Assist Stages

1. **Initial Request Submission** — Validates MRO submissions for completeness and correctness, reducing RFI cycles
2. **Specialist Recommendation Drafting** — Classifies anomaly severity, searches historical records, parses drawings and reference publications
3. **Document Authoring** — RAG-powered generation of regulated documentation including applicable safety regulations (60-70% effort reduction)

## Engine Programmes

Trent 1000, Trent XWB, Trent 7000, Trent 900, Trent 500, BR725

## MRO Network

Lufthansa Technik, SIA Engineering, Delta TechOps, AFI KLM E&M, ST Aerospace, HAECO, Turkish Technic, Rolls-Royce Total Care
