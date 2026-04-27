import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getRequests } from '../api/apiService';
import type { DashboardStats, VarianceRequestSummary } from '../types/variance-request';
import clsx from 'clsx';
import './Overview.scss';

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [engineEntries, setEngineEntries] = useState<[string, number][]>([]);
  const [mroEntries, setMroEntries] = useState<[string, number][]>([]);
  const [priorityEntries, setPriorityEntries] = useState<[string, number][]>([]);
  const [recentRequests, setRecentRequests] = useState<VarianceRequestSummary[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [workflowStages, setWorkflowStages] = useState<{ name: string; count: number; color: string }[]>([]);

  function loadData() {
    getStats().then(s => {
      setStats(s);
      setEngineEntries(Object.entries(s.byEngineType).sort((a, b) => b[1] - a[1]));
      setMroEntries(Object.entries(s.byMroOrganisation).sort((a, b) => b[1] - a[1]));
      setPriorityEntries(Object.entries(s.byPriority).sort((a, b) => b[1] - a[1]));
      setWorkflowStages([
        { name: 'Submitted', count: s.submitted || 0, color: '#6b7280' },
        { name: 'Under Review', count: s.underReview || 0, color: '#3B82F6' },
        { name: 'Triage Complete', count: s.triageComplete || 0, color: '#8B5CF6' },
        { name: 'Specialist Opinion', count: s.specialistOpinion || 0, color: '#F59E0B' },
        { name: 'Recommendation', count: s.recommendationDrafted || 0, color: '#EC4899' },
        { name: 'Doc Authored', count: s.documentAuthored || 0, color: '#10B981' },
        { name: 'Completed', count: s.completed || 0, color: '#059669' },
      ]);
    });
    getRequests({ page: 1, pageSize: 6, sortBy: 'date', sortDir: 'desc' }).then(r => setRecentRequests(r.items));
  }

  useEffect(() => { loadData(); }, []);

  function refresh() {
    setLastUpdated(new Date().toLocaleTimeString());
    loadData();
  }

  function formatStatus(status: string): string {
    return status.replace(/([A-Z])/g, ' $1').trim();
  }

  function getBarWidth(val: number): number {
    const max = Math.max(...engineEntries.map(e => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  }

  function getMroBarWidth(val: number): number {
    const max = Math.max(...mroEntries.map(e => e[1]));
    return max > 0 ? (val / max) * 100 : 0;
  }

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
          {/* KPI Row */}
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Total Requests</span>
                <span className="kpi-trend up">+18%</span>
              </div>
              <div className="kpi-value">{stats.totalRequests}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '100%', background: '#3B82F6' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Active Requests</span>
                <span className="kpi-badge active">In Progress</span>
              </div>
              <div className="kpi-value">{stats.totalRequests - stats.completed}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${((stats.totalRequests - stats.completed) / stats.totalRequests) * 100}%`, background: '#F59E0B' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Completed</span>
                <span className="kpi-trend up">+25%</span>
              </div>
              <div className="kpi-value">{stats.completed}</div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${(stats.completed / stats.totalRequests) * 100}%`, background: '#10B981' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Avg Resolution</span>
                <span className="kpi-trend down">-12%</span>
              </div>
              <div className="kpi-value">{stats.avgResolutionDays.toFixed(1)}<span className="kpi-unit">days</span></div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '60%', background: '#8B5CF6' }} /></div>
            </div>
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">AI Contribution</span>
                <span className="kpi-badge ai">Agent Active</span>
              </div>
              <div className="kpi-value">65<span className="kpi-unit">%</span></div>
              <div className="kpi-bar"><div className="kpi-fill" style={{ width: '65%', background: '#B8860B' }} /></div>
            </div>
          </div>

          {/* Workflow Pipeline */}
          <div className="card pipeline-card">
            <div className="card-header">
              <h2>Variance Workflow Pipeline</h2>
              <span className="card-subtitle">Current status of all requests across workflow stages</span>
            </div>
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

          {/* Engine Types + MRO */}
          <div className="grid-2">
            <div className="card">
              <div className="card-header">
                <h2>By Engine Programme</h2>
                <Link to="/dashboard/requests" className="link">View all</Link>
              </div>
              <div className="bar-chart">
                {engineEntries.map(item => (
                  <div className="bar-row" key={item[0]}>
                    <span className="bar-label">{item[0]}</span>
                    <div className="bar-track"><div className="bar-fill navy" style={{ width: `${getBarWidth(item[1])}%` }} /></div>
                    <span className="bar-val">{item[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h2>By MRO Organisation</h2>
                <Link to="/dashboard/requests" className="link">View all</Link>
              </div>
              <div className="bar-chart">
                {mroEntries.map(item => (
                  <div className="bar-row" key={item[0]}>
                    <span className="bar-label">{item[0]}</span>
                    <div className="bar-track"><div className="bar-fill gold" style={{ width: `${getMroBarWidth(item[1])}%` }} /></div>
                    <span className="bar-val">{item[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority, Monthly Trend, AI Agents */}
          <div className="grid-3">
            <div className="card">
              <div className="card-header"><h2>By Priority</h2></div>
              <div className="priority-list">
                {priorityEntries.map(item => (
                  <div className="priority-row" key={item[0]}>
                    <div className="priority-info">
                      <span className={clsx('priority-dot', item[0].toLowerCase())} />
                      <span className="priority-name">{item[0]}</span>
                    </div>
                    <span className="priority-count">{item[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h2>Monthly Trend</h2></div>
              <div className="trend-list">
                {stats.monthlyTrend.map(m => (
                  <div className="trend-row" key={m.month}>
                    <span className="trend-month">{m.month}</span>
                    <div className="trend-bars">
                      <div className="trend-bar submitted" style={{ width: `${m.submitted * 20}px` }} title={`Submitted: ${m.submitted}`} />
                      <div className="trend-bar resolved" style={{ width: `${m.resolved * 20}px` }} title={`Resolved: ${m.resolved}`} />
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
                <div className="agent-row">
                  <div className="agent-info">
                    <span className="agent-dot active" />
                    <div><div className="agent-name">Initiate Agent</div><div className="agent-desc">Validates submissions</div></div>
                  </div>
                  <span className="agent-stat">42 runs</span>
                </div>
                <div className="agent-row">
                  <div className="agent-info">
                    <span className="agent-dot active" />
                    <div><div className="agent-name">Scoping/Triage</div><div className="agent-desc">Risk classification</div></div>
                  </div>
                  <span className="agent-stat">38 runs</span>
                </div>
                <div className="agent-row">
                  <div className="agent-info">
                    <span className="agent-dot active" />
                    <div><div className="agent-name">Doc Authoring</div><div className="agent-desc">RAG over 15k+ variances</div></div>
                  </div>
                  <span className="agent-stat">27 runs</span>
                </div>
              </div>
              <Link to="/dashboard/ai-assist" className="link" style={{ display: 'block', marginTop: '0.75rem', fontSize: '0.75rem' }}>Manage AI Agents &rarr;</Link>
            </div>
          </div>

          {/* Recent Activity */}
          {recentRequests.length > 0 && (
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
                  {recentRequests.slice(0, 6).map(r => (
                    <tr key={r.id} className="clickable-row" onClick={() => { window.location.href = `/dashboard/requests/${r.id}`; }}>
                      <td className="ref-cell">{r.referenceNumber}</td>
                      <td className="title-cell">{r.title}</td>
                      <td>{r.engineType}</td>
                      <td>{r.mroOrganisation}</td>
                      <td><span className={clsx('priority-badge', r.priority?.toLowerCase())}>{r.priority}</span></td>
                      <td><span className={clsx('status-badge', r.status)}>{formatStatus(r.status)}</span></td>
                      <td className="date-cell">{new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
