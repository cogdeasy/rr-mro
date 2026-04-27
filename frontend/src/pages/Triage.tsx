import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { getRequests } from '../api/apiService';
import { STATUS_LABELS, STATUS_CSS } from '../types/variance-request';
import type { VarianceRequestSummary } from '../types/variance-request';

export default function Triage() {
  const [awaitingTriage, setAwaitingTriage] = useState<VarianceRequestSummary[]>([]);
  const [inProgress, setInProgress] = useState<VarianceRequestSummary[]>([]);
  const [triaged, setTriaged] = useState<VarianceRequestSummary[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    getRequests({ page: 1, pageSize: 50 }).then(r => {
      setAwaitingTriage(r.items.filter(i => ['Submitted'].includes(i.status)));
      setInProgress(r.items.filter(i => ['UnderReview'].includes(i.status)));
      setTriaged(r.items.filter(i => !['Submitted', 'UnderReview'].includes(i.status)));
      setCriticalCount(r.items.filter(i => i.priority === 'Critical').length);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Triage Queue</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>Requests awaiting or completed AI-assisted triage</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '3px solid #3B82F6' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Awaiting Triage</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{awaitingTriage.length}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #F59E0B' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>In Progress</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{inProgress.length}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #10B981' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Triaged</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{triaged.length}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #DC2626' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Critical</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{criticalCount}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Awaiting Triage</h3>
          {awaitingTriage.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--rr-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={clsx('badge', r.priority.toLowerCase())}>{r.priority}</span>
                <Link to={`/dashboard/requests/${r.id}`} className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Triage</Link>
              </div>
            </div>
          ))}
          {awaitingTriage.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--rr-muted)', fontSize: '0.875rem' }}>No requests awaiting triage.</div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Recently Triaged</h3>
          {triaged.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--rr-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={clsx('badge', STATUS_CSS[r.status] || '')}>{STATUS_LABELS[r.status] || r.status}</span>
                <Link to={`/dashboard/requests/${r.id}`} className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>View</Link>
              </div>
            </div>
          ))}
          {triaged.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--rr-muted)', fontSize: '0.875rem' }}>No triaged requests yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
