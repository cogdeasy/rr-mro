import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Settings from '../pages/Settings';
import Landing from '../pages/Landing';

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Settings page', () => {
  it('renders heading', () => {
    render(<Settings />, { wrapper });
    expect(screen.getByText('Platform Settings')).toBeInTheDocument();
  });

  it('renders engine programmes', () => {
    render(<Settings />, { wrapper });
    expect(screen.getByText('Trent XWB')).toBeInTheDocument();
    expect(screen.getByText('BR725')).toBeInTheDocument();
  });

  it('renders regulatory compliance', () => {
    render(<Settings />, { wrapper });
    expect(screen.getByText('EASA Part-145')).toBeInTheDocument();
    expect(screen.getByText('FAA AC 43.13')).toBeInTheDocument();
  });

  it('renders AI agent configuration', () => {
    render(<Settings />, { wrapper });
    expect(screen.getByText('Initiate Agent')).toBeInTheDocument();
    expect(screen.getByText('Document Authoring Agent')).toBeInTheDocument();
  });
});

describe('Landing page', () => {
  it('renders hero section', () => {
    render(<Landing />, { wrapper });
    expect(screen.getByText(/Non-Conformance/)).toBeInTheDocument();
    expect(screen.getByText(/Variance Management/)).toBeInTheDocument();
  });

  it('renders platform capabilities', () => {
    render(<Landing />, { wrapper });
    expect(screen.getByText('Digital Request Submission')).toBeInTheDocument();
    expect(screen.getByText('AI-Assisted Triage')).toBeInTheDocument();
  });

  it('renders engine programmes', () => {
    render(<Landing />, { wrapper });
    expect(screen.getByText('Trent 1000')).toBeInTheDocument();
    expect(screen.getByText('Trent XWB')).toBeInTheDocument();
  });

  it('renders workflow steps', () => {
    render(<Landing />, { wrapper });
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Triage')).toBeInTheDocument();
    expect(screen.getByText('Approve')).toBeInTheDocument();
  });
});
