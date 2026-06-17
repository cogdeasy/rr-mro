# Rolls-Royce MRO Variance Platform

Enterprise platform for managing Non-Conformance Technical Variance requests across the Rolls-Royce civil aerospace engine MRO network.

## Overview

When an engine undergoing Maintenance, Repair & Overhaul (MRO) encounters an issue outside the standard manual, every non-standard action requires a formal regulated variance. This platform digitises the entire variance lifecycle:

1. **Request Submission** — MRO partners submit structured variance requests with anomaly details, photographs, and engineering drawings
2. **AI-Assisted Triage** — Automated scoping and classification of requests using historical variance data
3. **Document Authoring** — RAG-powered generation of 27-page regulated documentation packages
4. **Workflow Management** — End-to-end tracking from submission through specialist review to final disposition
5. **Audit Trail** — Complete regulatory compliance trail with digital signatures

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   MRO Portal                         │
│  (External MRO partners submit & track requests)     │
├─────────────────────────────────────────────────────┤
│                 Internal Dashboard                    │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐   │
│  │ Triage   │ │ Document │ │ Workflow Engine    │   │
│  │ Agent    │ │ Authoring│ │ (Status, Reviews,  │   │
│  │ (AI)     │ │ Agent    │ │  Approvals)        │   │
│  └────┬─────┘ └────┬─────┘ └────────┬──────────┘   │
│       │             │                │               │
│  ┌────┴─────────────┴────────────────┴──────────┐   │
│  │           Variance Data Store                 │   │
│  │  (Requests, Documents, Attachments, Audit)    │   │
│  └───────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│              Azure Infrastructure                    │
│  App Service · Azure SQL · Blob Storage · OpenAI     │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: React 19 (Vite, TypeScript, React Router v7, TanStack Query, SCSS)
- **Backend**: ASP.NET Core 8 Web API (C#)
- **AI/ML**: Azure OpenAI GPT-4, RAG over historical variances (Databricks)
- **Infrastructure**: Azure App Service, Azure SQL, Azure Blob Storage
- **Auth**: Azure AD B2C (MRO partners) + Azure AD (internal)

## Getting Started

### Backend (.NET 8)

```bash
cd backend
dotnet restore
dotnet run
# API at http://localhost:5062
# Swagger at http://localhost:5062/swagger
```

### Frontend (React 19 + Vite)

```bash
cd frontend
npm install
npm run dev
# App at http://localhost:5173
```

## Project Structure

```
backend/
├── Controllers/           # API endpoints
│   ├── VarianceRequestsController.cs
│   ├── TriageController.cs
│   └── DocumentsController.cs
├── Models/                # Domain entities
├── DTOs/                  # Data transfer objects
├── Services/              # Business logic & AI agents
├── Data/                  # Seed data (12 realistic requests)
└── Program.cs             # App configuration

frontend/
└── src/
    ├── components/        # Header, Sidebar, Footer
    ├── hooks/             # TanStack Query hooks
    ├── layouts/           # DashboardLayout
    ├── models/            # TypeScript interfaces
    ├── pages/             # All page components
    │   ├── Overview.tsx   # KPI dashboard
    │   ├── Requests.tsx   # Request management
    │   ├── RequestDetail.tsx  # Full request view
    │   ├── AiAssist.tsx   # AI agent runner
    │   ├── Documents.tsx  # Document management
    │   ├── Triage.tsx     # AI triage queue
    │   ├── Settings.tsx   # Platform config
    │   ├── Landing.tsx    # Home page
    │   ├── Submit.tsx     # Variance request submission
    │   └── Track.tsx      # Request tracking
    ├── services/          # API service (axios)
    └── router.tsx         # React Router v7 config
```

## Key Workflows

### Variance Request Lifecycle

```
Submitted → Under Review → Specialist Opinion → Recommendation Drafted → Approved → Completed
                                                                      ↘ Rejected
```

### AI Agents

- **Initiate Agent**: Front-loads questions at submission to reduce RFI cycles
- **Scoping/Triage Agent**: Classifies anomaly type, severity, and routes to appropriate specialist
- **Document Authoring Agent**: RAG over 15,000+ prior variances for 60-70% effort reduction in documentation

## Environment Variables

```env
DATABASE_URL=           # Azure SQL connection string
AZURE_OPENAI_KEY=       # Azure OpenAI API key
AZURE_OPENAI_ENDPOINT=  # Azure OpenAI endpoint
AZURE_STORAGE_CONN=     # Azure Blob Storage connection
AZURE_AD_CLIENT_ID=     # Azure AD app registration
AZURE_AD_TENANT_ID=     # Azure AD tenant
```

## License

Proprietary - Rolls-Royce plc. All rights reserved.
