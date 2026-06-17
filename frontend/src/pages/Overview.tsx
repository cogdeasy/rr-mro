import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import { useRequests } from '../hooks/useRequests';
import './Overview.css';

export default function Overview() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const { data: stats, refetch: refetchStats } = useStats();
  const { data: recent, refetch: refetchRecent } = useRequests({
    page: 1,
    pageSize: 6,
    sortBy: 'date',
    sortDir: 'desc',
  });

  const refresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    refetchStats();
    refetchRecent();
  };

  const engineEntries = stats
    ? Object.entries(stats.byEngineType).sort((a, b) => b[1] - a[1])
    : [];
  const mroEntries = stats
    ? Object.entries(stats.byMroOrganisation).sort((a, b) => b[1] - a[1])
    : [];
  const priorityEntries = stats
    ? Object.entries(stats.byPriority).sort((a, b) => b[1] - a[1])
    : [];
  const workflowStages = stats
    ? [
        { name: 'Submitted', count: stats.submitted || 0, color: '#6b7280' },
        { name: 'Under Review', count: stats.underReview || 0, color: '#3B82F6' },
        { name: 'Triage Complete', count: stats.triageComplete || 0, color: '#8B5CF6' },
        { name: 'Specialist Opinion', count: stats.specialistOpinion || 0, color: '#F59E0B' },
        { name: 'Recommendation', count: stats.recommendationDrafted || 0, color: '#EC4899' },
        { name: 'Doc Authored', count: stats.documentAuthored || 0, color: '#10B981' },
        { name: 'Completed', count: stats.completed || 0, color: '#059669' },
      ]
    : [];

  const getBarWidth = (val: number) => {
    const max = Math.max(...engineEntries.map((e) => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  };
  const getMroBarWidth = (val: number) => {
    const max = Math.max(...mroEntries.map((e) => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  };
  const formatStatus = (status: string) => status.replace(/([A-Z])/g, ' $1').trim();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">MRO Variance Request analytics across the Rolls-Royce network</p>
        </div>
        <div className="header-actions">
          <span className="last-updated">Updated {lastUpdated}</span>
          <button className="btn-outline" onClick={refresh}>Refresh</button>
          <Link to="/dashboard/submit" className="btn-primary-sm">+ New Request</Link>
        </div>
      </div>

      {stats && (
        <>
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-label">Total Requests</span><span className="kpi-trend up">+18%</span></div>
              <div className="kpi-value">{stats.totalRequests}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '100%', background: '#3B82F6' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-label">Active Requests</span><span className="kpi-badge active">In Progress</span></div>
              <div className="kpi-value">{stats.totalRequests - stats.completed}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${((stats.totalRequests - stats.completed) / stats.totalRequests) * 100}%`, background: '#F59E0B' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-label">Completed</span><span className="kpi-trend up">+25%</span></div>
              <div className="kpi-value">{stats.completed}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${(stats.completed / stats.totalRequests) * 100}%`, background: '#10B981' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-label">Avg Resolution</span><span className="kpi-trend down">-12%</span></div>
              <div className="kpi-value">{stats.avgResolutionDays.toFixed(1)}<span className="kpi-unit">days</span></div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '60%', background: '#8B5CF6' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header"><span className="kpi-label">AI Contribution</span><span className="kpi-badge ai">Agent Active</span></div>
              <div className="kpi-value">65<span className="kpi-unit">%</span></div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '65%', background: '#B8860B' }} /></div>
            </div>
          </div>

          <div className="card pipeline-card">
            <div className="card-header"><h2>Variance Workflow Pipeline</h2><span className="card-subtitle">Current status of all requests across workflow stages</span></div>
            <div className="pipeline">
              {workflowStages.map((stage, i) => (
                <div className="pipeline-stage" key={stage.name}>
                  <div className="stage-box" style={{ borderColor: stage.color }}>
                    <span className="stage-count" style={{ color: stage.color }}>{stage.count}</span>
                    <span className="stage-name">{stage.name}</span>
                  </div>
                  {i < workflowStages.length - 1 && <div className="stage-arrow">&rarr;</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="card-header"><h2>By Engine Programme</h2><Link to="/dashboard/requests" className="link">View all</Link></div>
              <div className="bar-chart">
                {engineEntries.map(([name, val]) => (
                  <div className="bar-row" key={name}>
                    <span className="bar-label">{name}</span>
                    <div className="bar-track"><div className="bar-fill navy" style={{ width: `${getBarWidth(val)}%` }} /></div>
                    <span className="bar-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h2>By MRO Organisation</h2><Link to="/dashboard/requests" className="link">View all</Link></div>
              <div className="bar-chart">
                {mroEntries.map(([name, val]) => (
                  <div className="bar-row" key={name}>
                    <span className="bar-label">{name}</span>
                    <div className="bar-track"><div className="bar-fill gold" style={{ width: `${getMroBarWidth(val)}%` }} /></div>
                    <span className="bar-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="card-header"><h2>By Priority</h2></div>
              <div className="priority-list">
                {priorityEntries.map(([name, count]) => (
                  <div className="priority-row" key={name}>
                    <div className="priority-info">
                      <span className={`priority-dot ${name.toLowerCase()}`} />
                      <span className="priority-name">{name}</span>
                    </div>
                    <span className="priority-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h2>Monthly Trend</h2></div>
              <div className="trend-list">
                {stats.monthlyTrend.map((m) => (
                  <div className="trend-row" key={m.month}>
                    <span className="trend-month">{m.month}</span>
                    <div className="trend-bars">
                      <div className="trend-bar submitted" style={{ width: m.submitted * 20 }} title={`Submitted: ${m.submitted}`} />
                      <div className="trend-bar resolved" style={{ width: m.resolved * 20 }} title={`Resolved: ${m.resolved}`} />
                    </div>
                    <div className="trend-nums">
                      <span className="t-sub">{m.submitted}</span>
                      <span className="t-res">{m.resolved}</span>
                    </div>
                  </div>
                ))}
                <div className="trend-legend">
                  <span className="legend-item"><span className="legend-dot sub" />Submitted</span>
                  <span className="legend-item"><span className="legend-dot res" />Resolved</span>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h2>AI Agents Status</h2></div>
              <div className="agent-list">
                {[
                  { name: 'Initiate Agent', desc: 'Validates submissions', runs: 42 },
                  { name: 'Scoping/Triage', desc: 'Risk classification', runs: 38 },
                  { name: 'Doc Authoring', desc: 'RAG over 15k+ variances', runs: 27 },
                ].map((a) => (
                  <div className="agent-row" key={a.name}>
                    <div className="agent-info">
                      <span className="agent-dot active" />
                      <div><div className="agent-name">{a.name}</div><div className="agent-desc">{a.desc}</div></div>
                    </div>
                    <span className="agent-stat">{a.runs} runs</span>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/ai-assist" className="link" style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.75rem' }}>Manage AI Agents &rarr;</Link>
            </div>
          </div>
        </>
      )}

      {recent && recent.items.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <Link to="/dashboard/requests" className="link">View all requests</Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th><th>Title</th><th>Engine</th><th>MRO</th><th>Priority</th><th>Status</th><th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recent.items.slice(0, 6).map((r) => (
                <tr key={r.id} className="clickable-row" onClick={() => navigate(`/dashboard/requests/${r.id}`)}>
                  <td className="ref-cell">{r.referenceNumber}</td>
                  <td className="title-cell">{r.title}</td>
                  <td>{r.engineType}</td>
                  <td>{r.mroOrganisation}</td>
                  <td><span className={`priority-badge ${r.priority?.toLowerCase()}`}>{r.priority}</span></td>
                  <td><span className={`status-badge ${r.status}`}>{formatStatus(r.status)}</span></td>
                  <td className="date-cell">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
