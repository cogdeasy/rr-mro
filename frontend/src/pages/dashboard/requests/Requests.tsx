import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../../../shared/services/api';
import { VarianceRequestSummary, STATUS_LABELS, STATUS_CSS } from '../../../shared/models/variance-request.model';
import './Requests.scss';

function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<VarianceRequestSummary[]>([]);
  const [engineTypes, setEngineTypes] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [engineFilter, setEngineFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));

  const loadRequests = (p = page, s = search, st = statusFilter, pr = priorityFilter, eng = engineFilter) => {
    api.getRequests({
      page: p, pageSize,
      status: st || undefined,
      priority: pr || undefined,
      engineType: eng || undefined,
      search: s || undefined,
      sortBy: 'createdAt', sortDir: 'desc',
    }).then(r => {
      setRequests(r.items);
      setTotalCount(r.totalCount);
    });
  };

  useEffect(() => {
    api.getEngineTypes().then(setEngineTypes);
    loadRequests();
  }, []);

  const onFilter = (field: string, value: string) => {
    const ns = field === 'search' ? value : search;
    const nst = field === 'status' ? value : statusFilter;
    const npr = field === 'priority' ? value : priorityFilter;
    const ne = field === 'engine' ? value : engineFilter;
    if (field === 'search') setSearch(value);
    if (field === 'status') setStatusFilter(value);
    if (field === 'priority') setPriorityFilter(value);
    if (field === 'engine') setEngineFilter(value);
    setPage(1);
    loadRequests(1, ns, nst, npr, ne);
  };

  const changePage = (p: number) => { setPage(p); loadRequests(p); };

  const getStatusLabel = (s: string) => STATUS_LABELS[s] || s;
  const getStatusCss = (s: string) => STATUS_CSS[s] || '';
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

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
          <input type="text" value={search} onChange={e => onFilter('search', e.target.value)} placeholder="Search requests..."
            style={{ flex: 1, minWidth: '200px', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }} />
          <select value={statusFilter} onChange={e => onFilter('status', e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => onFilter('priority', e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={engineFilter} onChange={e => onFilter('engine', e.target.value)} style={{ padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }}>
            <option value="">All Engines</option>
            {engineTypes.map(e => <option key={e} value={e}>{e}</option>)}
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
              <tr key={r.id} onClick={() => navigate(`/dashboard/requests/${r.id}`)} className="table-row">
                <td className="td" style={{ fontWeight: 500 }}>{r.referenceNumber}</td>
                <td className="td" style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                <td className="td muted">{r.anomalyType}</td>
                <td className="td muted">{r.engineType}</td>
                <td className="td muted" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.mroOrganisation}</td>
                <td className="td"><span className={`badge ${getStatusCss(r.status)}`}>{getStatusLabel(r.status)}</span></td>
                <td className="td"><span className={`badge ${r.priority.toLowerCase()}`}>{r.priority}</span></td>
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

export default Requests;
