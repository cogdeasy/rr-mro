import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getRequests, getEngineTypes } from '../api/apiService';
import { STATUS_LABELS, STATUS_CSS } from '../types/variance-request';
import type { VarianceRequestSummary } from '../types/variance-request';
import './Requests.scss';

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VarianceRequestSummary[]>([]);
  const [engineTypesList, setEngineTypesList] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [engineFilter, setEngineFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  function loadRequests(p = page) {
    getRequests({
      page: p, pageSize,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      engineType: engineFilter || undefined,
      search: search || undefined,
      sortBy: 'createdAt', sortDir: 'desc',
    }).then(r => {
      setRequests(r.items);
      setTotalCount(r.totalCount);
      setTotalPages(Math.ceil(r.totalCount / pageSize));
    });
  }

  useEffect(() => {
    getEngineTypes().then(setEngineTypesList);
    loadRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function onFilter() { setPage(1); loadRequests(1); }
  function changePage(p: number) { setPage(p); loadRequests(p); }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

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
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); onFilter(); }} placeholder="Search requests..."
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }} />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); onFilter(); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => { setPriorityFilter(e.target.value); onFilter(); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={engineFilter} onChange={e => { setEngineFilter(e.target.value); onFilter(); }} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Engines</option>
            {engineTypesList.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--rr-platinum)' }}>
              <th className="th">Reference</th>
              <th className="th">Title</th>
              <th className="th">Anomaly</th>
              <th className="th">Engine</th>
              <th className="th">MRO</th>
              <th className="th">Status</th>
              <th className="th">Priority</th>
              <th className="th">Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="table-row" onClick={() => navigate(`/dashboard/requests/${r.id}`)} style={{ cursor: 'pointer' }}>
                <td className="td" style={{ fontWeight: 500 }}>{r.referenceNumber}</td>
                <td className="td" style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                <td className="td muted">{r.anomalyType}</td>
                <td className="td muted">{r.engineType}</td>
                <td className="td muted" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.mroOrganisation}</td>
                <td className="td"><span className={clsx('badge', STATUS_CSS[r.status] || '')}>{STATUS_LABELS[r.status] || r.status}</span></td>
                <td className="td"><span className={clsx('badge', r.priority.toLowerCase())}>{r.priority}</span></td>
                <td className="td muted">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalCount > pageSize && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn-outline" onClick={() => changePage(page - 1)} disabled={page <= 1} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Prev</button>
          <span style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>{page} / {totalPages}</span>
          <button className="btn-outline" onClick={() => changePage(page + 1)} disabled={page >= totalPages} style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>Next</button>
        </div>
      )}
    </div>
  );
}
