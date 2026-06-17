import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRequests } from '../hooks/useRequests';
import { STATUS_LABELS, STATUS_CSS } from '../models/variance-request.model';
import { apiService } from '../services/api.service';

export default function Requests() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [engineFilter, setEngineFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [engineTypes, setEngineTypes] = useState<string[]>([]);

  useEffect(() => {
    apiService.getEngineTypes().then(setEngineTypes);
  }, []);

  const { data } = useRequests({
    page,
    pageSize,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    engineType: engineFilter || undefined,
    search: search || undefined,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const requests = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
  const getStatusLabel = (s: string) => STATUS_LABELS[s] || s;
  const getStatusCss = (s: string) => STATUS_CSS[s] || '';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const onFilter = () => setPage(1);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Variance Requests</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>{totalCount} requests across the MRO network</p>
        </div>
        <Link to="/dashboard/submit" className="btn-navy">New Request</Link>
      </div>

      <div className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); onFilter(); }} placeholder="Search requests..."
            style={{ flex: 1, minWidth: 200, padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }} />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); onFilter(); }}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Statuses</option>
            {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); onFilter(); }}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Priorities</option>
            {['Critical', 'High', 'Medium', 'Low'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={engineFilter} onChange={(e) => { setEngineFilter(e.target.value); onFilter(); }}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Engines</option>
            {engineTypes.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--rr-platinum)' }}>
              {['Reference', 'Title', 'Anomaly', 'Engine', 'MRO', 'Status', 'Priority', 'Date'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '0.625rem 0.75rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} onClick={() => navigate(`/dashboard/requests/${r.id}`)}
                style={{ borderTop: '1px solid var(--rr-border)', cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500 }}>{r.referenceNumber}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{r.anomalyType}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{r.engineType}</td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.mroOrganisation}</td>
                <td style={{ padding: '0.625rem 0.75rem' }}><span className={`badge ${getStatusCss(r.status)}`}>{getStatusLabel(r.status)}</span></td>
                <td style={{ padding: '0.625rem 0.75rem' }}><span className={`badge ${r.priority.toLowerCase()}`}>{r.priority}</span></td>
                <td style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn-outline" onClick={() => setPage(page - 1)} disabled={page <= 1} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Prev</button>
          <span style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{page} / {totalPages}</span>
          <button className="btn-outline" onClick={() => setPage(page + 1)} disabled={page >= totalPages} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Next</button>
        </div>
      )}
    </div>
  );
}
