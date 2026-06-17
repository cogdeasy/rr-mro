import { Link } from 'react-router-dom';
import { useRequests } from '../hooks/useRequests';
import { STATUS_LABELS, STATUS_CSS } from '../models/variance-request.model';

export default function Triage() {
  const { data } = useRequests({ page: 1, pageSize: 50 });
  const items = data?.items ?? [];

  const awaitingTriage = items.filter((i) => i.status === 'Submitted');
  const inProgress = items.filter((i) => i.status === 'UnderReview');
  const triaged = items.filter((i) => !['Submitted', 'UnderReview'].includes(i.status));
  const criticalCount = items.filter((i) => i.priority === 'Critical').length;

  const getStatusLabel = (s: string) => STATUS_LABELS[s] || s;
  const getStatusCss = (s: string) => STATUS_CSS[s] || '';

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Triage Queue</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>Requests awaiting or completed AI-assisted triage</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Awaiting Triage', count: awaitingTriage.length, color: '#3B82F6' },
          { label: 'In Progress', count: inProgress.length, color: '#F59E0B' },
          { label: 'Triaged', count: triaged.length, color: '#10B981' },
          { label: 'Critical', count: criticalCount, color: '#DC2626' },
        ].map((stat) => (
          <div key={stat.label} className="card" style={{ borderLeft: `3px solid ${stat.color}` }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stat.count}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Awaiting Triage</h3>
          {awaitingTriage.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--rr-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${r.priority.toLowerCase()}`}>{r.priority}</span>
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
          {triaged.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--rr-border)' }}>
              <div>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${getStatusCss(r.status)}`}>{getStatusLabel(r.status)}</span>
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
