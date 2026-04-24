# Agent Instructions — RR MRO Variance Platform

## Project Context
This is the Rolls-Royce MRO (Maintenance, Repair & Overhaul) Variance Platform. It digitises the Non-Conformance Technical Variance process for civil aerospace engines.

## Tech Stack
- Next.js 15 with App Router
- React 19, TypeScript strict mode
- Tailwind CSS v4 (PostCSS plugin, NOT tailwind.config.js)
- Lucide React for icons

## Branding
- Primary colour: `rr-navy` (#001233)
- Platinum background: `rr-platinum` (#F5F5F7)
- Silver accents: `rr-silver` (#C0C0C0)
- Gold highlights: `rr-gold` (#B8860B)
- All gradients use the `gradient-rr` / `gradient-hero` utility classes
- Logo: ROLLS-ROYCE wordmark via `RRLogo` component

## Conventions
- Use `@/` path alias for all imports
- Layout components in `src/components/layout/`
- Shared UI in `src/components/ui/`
- Types in `src/types/index.ts`
- Seed/mock data in `src/lib/seed-data.ts`
- `cn()` utility for conditional classnames

## Domain Language
- **Variance Request**: A formal regulated request when an MRO hits a non-standard issue
- **Anomaly**: The engineering defect or non-conformance discovered
- **Disposition**: The final decision on how to handle a variance
- **RFI**: Request for Information — follow-up questions between parties
- **MRO**: Maintenance, Repair & Overhaul organisation
