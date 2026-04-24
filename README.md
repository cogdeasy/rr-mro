# Rolls-Royce MRO Variance Platform

Enterprise platform for managing Non-Conformance Technical Variance (NCTV) requests across the Rolls-Royce civil aerospace engine MRO network.

## Business Context

Currently, the process of sending variation requests, processing by internal engineering teams, and communication of final decisions are done through emails, manual updates to a Word file, manual search of similar deviations resolved earlier, review of drawings, technical publications and other documents relevant to each case. Workflow is managed through a Kanban board application.

The Infosys Team on this project is building the application to **digitise these manual processes**, **exploit AI to optimise them**, and **manage the end-to-end workflow**.

### Key Objectives

1. **Digital MRO Portal** — A platform accessed by MRO organisations to submit Variation Resolution requests (anomaly details, engineering drawings, photographs). This was partly developed by another team and is being transitioned to Infosys for complete development, including integration with AI Assist to ensure initial requests are submitted with correct and complete information.

2. **Internal Workflow Digitisation** — Extend the platform as a Micro Front End (MFE) application to digitise the internal process end-to-end: different actors review the request, decide on resolution path, secure specialist opinion and final recommendation, and prepare/author a final document for the MRO. Includes workflow management, statuses, notifications, collaboration, audit trail, and digital signatures of authorised signatories.

3. **AI Assist Integration** — At multiple stages (initial request submission, document authoring, specialist recommendation drafting), AI Assist (using OpenAI GPT, RAG, and customised instructions) reduces submission errors, parses through relevant past requests, submitted drawings, reference publications and historical data to generate content — including applicable safety regulations — which is then reviewed and updated by the human in the loop.

### Manual Process Being Digitised

| Before (Manual)                        | After (Digital Platform)                         |
|----------------------------------------|--------------------------------------------------|
| Email-based request submission         | Structured digital intake with AI validation     |
| Word document updates                  | Versioned document authoring with digital signatures |
| Manual search of past deviations       | AI-powered RAG over 15,000+ historical records   |
| Kanban board workflow tracking         | End-to-end workflow with status, notifications, audit trail |
| Physical signature collection          | Digital signatures of authorised signatories     |
| Manual review of drawings/publications | AI-parsed drawings, reference publications, historical data |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   MRO Portal (MFE)                       │
│  (External MRO partners submit & track requests)         │
├─────────────────────────────────────────────────────────┤
│                 Internal Dashboard (MFE)                  │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │ AI Assist    │ │ Document     │ │ Workflow Engine  │  │
│  │ (Initiate +  │ │ Authoring    │ │ (Status, Reviews │  │
│  │  Triage +    │ │ Agent (RAG)  │ │  Approvals,      │  │
│  │  Recommend)  │ │              │ │  Digital Sigs)   │  │
│  └──────┬───────┘ └──────┬───────┘ └────────┬────────┘  │
│         │                │                   │           │
│  ┌──────┴────────────────┴───────────────────┴────────┐  │
│  │              Variance Data Store                    │  │
│  │  (Requests, Documents, Attachments, Audit Trail)    │  │
│  └─────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│               Azure Infrastructure + Databricks          │
│  App Service · Azure SQL · Blob Storage · OpenAI · RAG   │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: Angular 17 (standalone components, SCSS, TypeScript) — Micro Front End architecture
- **Backend**: ASP.NET Core 8 Web API (C#)
- **AI/ML**: Azure OpenAI GPT-4, RAG over 15,000+ historical variances, customised instructions (Databricks)
- **Infrastructure**: Azure App Service, Azure SQL, Azure Blob Storage, Databricks
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

### Frontend (Angular 17)

```bash
cd frontend
npm install
ng serve
# App at http://localhost:4200
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
└── src/app/
    ├── pages/
    │   ├── landing/       # Home page
    │   ├── submit/        # Variance request submission
    │   ├── track/         # Request tracking
    │   └── dashboard/     # Internal dashboard
    │       ├── overview/  # KPI dashboard
    │       ├── requests/  # Request management
    │       ├── request-detail/  # Full request view
    │       ├── ai-assist/ # AI agent runner
    │       ├── documents/ # Document management
    │       ├── triage/    # AI triage queue
    │       └── settings/  # Platform config
    └── shared/
        ├── models/        # TypeScript interfaces
        └── services/      # API service
```

## Key Workflows

### Variance Request Lifecycle

```
Submitted → Under Review → Triage Complete → Specialist Opinion → Recommendation Drafted → Document Authored → Approved → Completed
                                                                                                              ↘ Rejected
```

### AI Assist Stages

AI Assist (OpenAI GPT, RAG, customised instructions) is integrated at multiple stages:

1. **Initial Request Submission (Initiate Agent)** — Validates MRO submissions for completeness and correctness, reducing RFI cycles. Ensures all required fields, drawings, and photographs are provided.
2. **Specialist Recommendation Drafting (Triage Agent)** — Classifies anomaly type and severity, searches 15,000+ historical records, parses relevant drawings and reference publications, routes to appropriate specialist.
3. **Document Authoring (Authoring Agent)** — RAG-powered generation of regulated documentation including applicable safety regulations, achieving 60-70% effort reduction. Content reviewed and updated by human in the loop.

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
