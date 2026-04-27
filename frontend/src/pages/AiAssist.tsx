import { useEffect, useState } from 'react';
import { getRequests, triageRequest, generateDocument } from '../api/apiService';
import type { VarianceRequestSummary } from '../types/variance-request';

export default function AiAssist() {
  const [requests, setRequests] = useState<VarianceRequestSummary[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('triage');
  const [running, setRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<object | null>(null);
  const [initiateCount, setInitiateCount] = useState(0);
  const [triageCount, setTriageCount] = useState(0);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    getRequests({ page: 1, pageSize: 50 }).then(r => {
      setRequests(r.items);
      setTriageCount(r.items.filter(i =>
        ['TriageComplete', 'SpecialistOpinion', 'RecommendationDrafted', 'DocumentAuthored', 'Approved', 'Completed'].includes(i.status)
      ).length);
      setDocCount(r.items.filter(i =>
        ['DocumentAuthored', 'Approved', 'Completed'].includes(i.status)
      ).length);
      setInitiateCount(r.totalCount);
    });
  }, []);

  async function runAgent() {
    if (!selectedRequestId) return;
    setRunning(true);
    setAgentResult(null);
    try {
      if (selectedAgent === 'triage') {
        const result = await triageRequest(selectedRequestId);
        setAgentResult(result);
      } else {
        const result = await generateDocument(selectedRequestId, 'Dr. J. Richardson');
        setAgentResult(result);
      }
    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>AI Assist</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>AI-powered document authoring and triage assistance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '3px solid #8B5CF6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '24px' }}>{'\u{1F916}'}</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Initiate Agent</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Front-loads RFI questions to ensure complete submissions. Analyses request data
            and identifies missing information before triage.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--rr-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>Requests processed</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{initiateCount}</span>
          </div>
        </div>
        <div className="card" style={{ borderLeft: '3px solid #F59E0B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '24px' }}>{'\u{1F50D}'}</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Scoping / Triage Agent</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            Classifies anomaly severity using RAG over 15,000+ prior variances.
            Routes to appropriate specialist engineer and generates severity assessment.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--rr-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>Triages completed</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{triageCount}</span>
          </div>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--rr-gold)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '24px' }}>{'\u{1F4C4}'}</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Document Authoring Agent</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
            RAG-powered generation of 27-page regulated variance packages.
            60-70% effort reduction with human-in-the-loop review.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--rr-border)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>Documents generated</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{docCount}</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Run AI Agent</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Select Request</label>
            <select value={selectedRequestId} onChange={e => setSelectedRequestId(e.target.value)}>
              <option value="">Choose a request...</option>
              {requests.map(r => <option key={r.id} value={r.id}>{r.referenceNumber} — {r.title}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ width: '200px', marginBottom: 0 }}>
            <label>Agent</label>
            <select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
              <option value="triage">Scoping / Triage</option>
              <option value="document">Document Authoring</option>
            </select>
          </div>
          <button className="btn-navy" onClick={runAgent} disabled={!selectedRequestId || running} style={{ whiteSpace: 'nowrap' }}>
            {running ? 'Processing...' : 'Run Agent'}
          </button>
        </div>
      </div>

      {agentResult && (
        <div className="card" style={{ borderLeft: '3px solid #10B981' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '18px' }}>{'\u2728'}</span>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Agent Result</h3>
          </div>
          <pre style={{ fontSize: '0.8125rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--rr-muted)', background: 'var(--rr-platinum)', padding: '1rem', borderRadius: '0.375rem' }}>
            {JSON.stringify(agentResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem', background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
          <span style={{ fontSize: '24px' }}>{'\u{1F4A1}'}</span>
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>AI Architecture</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)', lineHeight: 1.6 }}>
              The AI Assist platform uses <strong>Azure OpenAI GPT-4</strong> with <strong>Retrieval Augmented Generation (RAG)</strong> on <strong>Databricks</strong>. The knowledge base includes 15,000+ historical variance resolutions, technical publications, AMM references, and regulatory guidance (EASA Part-145, FAA AC 43.13). All AI-generated content requires human-in-the-loop review before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
