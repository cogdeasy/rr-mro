import { Link } from 'react-router-dom';
import { useRequests } from '../hooks/useRequests';
import { STATUS_LABELS, STATUS_CSS } from '../models/variance-request.model';

const documentSections = [
  'Problem Statement', 'Technical Analysis', 'Safety Assessment', 'Proposed Disposition',
  'Specialist Recommendation', 'Applicable Regulations', 'Regulatory References', 'Digital Signatures',
];

export default function Documents() {
  const { data } = useRequests({ page: 1, pageSize: 50 });
  const items = data?.items ?? [];

  const documentedRequests = items.filter((i) =>
    ['DocumentAuthored', 'Approved', 'Completed'].includes(i.status),
  );
  const approvedCount = items.filter((i) =>
    ['Approved', 'Completed'].includes(i.status),
  ).length;

  const getStatusCss = (s: string) => STATUS_CSS[s] || s.toLowerCase();
  const getStatusLabel = (s: string) => STATUS_LABELS[s] || s;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Variance Documents</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>AI-generated 27-page regulated variance packages</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '3px solid var(--rr-gold)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Total Documents</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{documentedRequests.length}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #10B981' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Approved</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{approvedCount}</p>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #3B82F6' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Avg AI Contribution</p>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>65%</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--rr-platinum)' }}>
              {['Reference', 'Title', 'Engine', 'MRO', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documentedRequests.map((r) => (
              <tr key={r.id} style={{ borderTop: '1px solid var(--rr-border)' }}>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{r.engineType}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{r.mroOrganisation}</td>
                <td style={{ padding: '0.625rem 0.75rem' }}><span className={`badge ${getStatusCss(r.status)}`}>{getStatusLabel(r.status)}</span></td>
                <td style={{ padding: '0.625rem 0.75rem' }}>
                  <Link to={`/dashboard/requests/${r.id}`} style={{ fontSize: '0.8125rem', color: 'var(--rr-navy)', fontWeight: 500 }}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documentedRequests.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--rr-muted)' }}>No variance documents generated yet.</div>
        )}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #001233 0%, #001845 100%)', color: '#fff' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Document Authoring Agent</h3>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
          The Document Authoring Agent uses RAG over 15,000+ prior variances to generate comprehensive 27-page regulated variance packages. Each document includes:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {documentSections.map((section) => (
            <div key={section} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rr-gold)' }} />
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)' }}>{section}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
