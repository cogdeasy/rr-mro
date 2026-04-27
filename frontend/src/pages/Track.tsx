import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getRequests } from '../api/apiService';
import { STATUS_LABELS, STATUS_CSS } from '../types/variance-request';
import type { VarianceRequestSummary } from '../types/variance-request';

export default function Track() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VarianceRequestSummary[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  const loadRequests = useCallback((p: number) => {
    getRequests({
      page: p, pageSize,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      search: search || undefined,
      sortBy: 'createdAt', sortDir: 'desc',
    }).then(result => {
      setRequests(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    });
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    setPage(1);
    loadRequests(1);
  }, [loadRequests]);

  function changePage(p: number) { setPage(p); loadRequests(p); }
  function formatDate(d: string) { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }

  return (
    <>
      <section className="gradient-rr" style={{ padding: '3rem 0 2rem' }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            <div className="line" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>MRO Portal</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Track Variance Requests</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>View and track the status of your submitted variance requests</p>
        </div>
      </section>

      <section style={{ padding: '2rem 0 4rem', background: 'var(--rr-platinum)' }}>
        <div className="container">
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
                <label>Search</label>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by reference, title, or description" />
              </div>
              <div className="form-group" style={{ marginBottom: 0, width: '160px' }}>
                <label>Status</label>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="">All Statuses</option>
                  {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0, width: '160px' }}>
                <label>Priority</label>
                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--rr-platinum)' }}>
                  {['Reference', 'Title', 'Engine', 'Status', 'Priority', 'Submitted'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--rr-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id} onClick={() => navigate(`/dashboard/requests/${r.id}`)}
                    style={{ borderTop: '1px solid var(--rr-border)', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--rr-navy)' }}>{r.referenceNumber}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{r.engineType}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className={clsx('badge', STATUS_CSS[r.status] || '')}>{STATUS_LABELS[r.status] || r.status}</span></td>
                    <td style={{ padding: '0.75rem 1rem' }}><span className={clsx('badge', r.priority.toLowerCase())}>{r.priority}</span></td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{formatDate(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--rr-muted)', fontSize: '0.875rem' }}>No variance requests found matching your criteria.</div>
            )}
          </div>

          {totalCount > pageSize && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn-outline" onClick={() => changePage(page - 1)} disabled={page <= 1}>Previous</button>
              <span style={{ padding: '0.625rem 1rem', fontSize: '0.875rem', color: 'var(--rr-muted)' }}>Page {page} of {totalPages}</span>
              <button className="btn-outline" onClick={() => changePage(page + 1)} disabled={page >= totalPages}>Next</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
