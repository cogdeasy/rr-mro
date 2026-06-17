import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRequest } from '../hooks/useRequest';
import { useTriageMutation, useGenerateDocumentMutation, useUpdateStatusMutation, useAddCommentMutation } from '../hooks/useMutations';
import { STATUS_LABELS, STATUS_CSS } from '../models/variance-request.model';

const statusFlow: Record<string, { status: string; label: string }[]> = {
  Submitted: [{ status: 'UnderReview', label: 'Begin Review' }],
  UnderReview: [{ status: 'TriageComplete', label: 'Complete Triage' }, { status: 'Rejected', label: 'Reject' }],
  TriageComplete: [{ status: 'SpecialistOpinion', label: 'Request Specialist' }],
  SpecialistOpinion: [{ status: 'RecommendationDrafted', label: 'Draft Recommendation' }],
  RecommendationDrafted: [{ status: 'DocumentAuthored', label: 'Author Document' }],
  DocumentAuthored: [{ status: 'Approved', label: 'Approve' }, { status: 'Rejected', label: 'Reject' }],
  Approved: [{ status: 'Completed', label: 'Mark Complete' }],
};

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: request, refetch } = useRequest(id);
  const triageMutation = useTriageMutation();
  const generateDocMutation = useGenerateDocumentMutation();
  const updateStatusMutation = useUpdateStatusMutation();
  const addCommentMutation = useAddCommentMutation();
  const [newComment, setNewComment] = useState('');

  if (!request) return <div style={{ padding: '2rem' }}>Loading...</div>;

  const availableActions = statusFlow[request.status] || [];
  const getStatusLabel = (s: string) => STATUS_LABELS[s] || s;
  const getStatusCss = (s: string) => STATUS_CSS[s] || '';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const runTriage = () => triageMutation.mutate(request.id, { onSuccess: () => refetch() });
  const generateDoc = () => generateDocMutation.mutate({ requestId: request.id, authoredBy: 'Dr. J. Richardson' }, { onSuccess: () => refetch() });
  const updateStatus = (status: string) => updateStatusMutation.mutate({ id: request.id, status, actor: 'Dr. J. Richardson' }, { onSuccess: () => refetch() });
  const addComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate({ id: request.id, data: { content: newComment, author: 'Dr. J. Richardson', authorRole: 'Lead Engineer', isInternal: true } }, {
      onSuccess: () => { setNewComment(''); refetch(); },
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <Link to="/dashboard/requests" style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>&larr; Back to Requests</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--rr-muted)' }}>{request.referenceNumber}</span>
            <span className={`badge ${getStatusCss(request.status)}`}>{getStatusLabel(request.status)}</span>
            <span className={`badge ${request.priority.toLowerCase()}`}>{request.priority}</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{request.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!request.triageResult && (
            <button className="btn-navy" onClick={runTriage} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Run AI Triage</button>
          )}
          {!request.generatedDocument && (
            <button className="btn-navy" onClick={generateDoc} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Generate Document</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--rr-muted)' }}>{request.description}</p>
          </div>

          {request.triageResult && (
            <div className="card" style={{ borderLeft: '3px solid #8B5CF6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: 18 }}>{'\u{1F916}'}</span>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>AI Triage Result</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--rr-muted)' }}>Confidence: {(request.triageResult.confidenceScore * 100).toFixed(0)}%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>Severity</p><p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{request.triageResult.severityClassification}</p></div>
                <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>Specialist</p><p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{request.triageResult.suggestedSpecialist}</p></div>
                <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>Similar Variances</p><p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{request.triageResult.similarVariancesFound} found</p></div>
                <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>AI Model</p><p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{request.triageResult.aiModelVersion}</p></div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>Recommended Action</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{request.triageResult.recommendedAction}</p>
              </div>
              {request.triageResult.suggestedRfiQuestions.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.5rem' }}>Suggested RFI Questions</p>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', lineHeight: 1.8, color: 'var(--rr-muted)' }}>
                    {request.triageResult.suggestedRfiQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {request.generatedDocument && (
            <div className="card" style={{ borderLeft: '3px solid var(--rr-gold)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: 18 }}>{'\u{1F4C4}'}</span>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>Generated Variance Document</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--rr-gold)', fontWeight: 500 }}>{request.generatedDocument.aiGeneratedPercentage.toFixed(0)}% AI-assisted</span>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {request.generatedDocument.problemStatement && (
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Problem Statement</p><p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{request.generatedDocument.problemStatement}</p></div>
                )}
                {request.generatedDocument.technicalAnalysis && (
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Technical Analysis</p><p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{request.generatedDocument.technicalAnalysis}</p></div>
                )}
                {request.generatedDocument.safetyAssessment && (
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Safety Assessment</p><p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{request.generatedDocument.safetyAssessment}</p></div>
                )}
                {request.generatedDocument.proposedDisposition && (
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Proposed Disposition</p><p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{request.generatedDocument.proposedDisposition}</p></div>
                )}
                {request.generatedDocument.regulatoryReferences && (
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>Regulatory References</p><p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>{request.generatedDocument.regulatoryReferences}</p></div>
                )}
              </div>
            </div>
          )}

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Comments ({request.comments.length})</h3>
            {request.comments.map((c) => (
              <div key={c.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--rr-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{c.author}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>{formatDate(c.createdAt)}</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)', lineHeight: 1.5 }}>{c.content}</p>
              </div>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..."
                style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.8125rem', border: '1px solid var(--rr-border)', borderRadius: '0.375rem' }} />
              <button className="btn-navy" onClick={addComment} style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>Post</button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Audit Trail</h3>
            {request.auditTrail.map((a) => (
              <div key={a.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--rr-border)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rr-navy)', marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{a.action}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>{a.details}</p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--rr-silver-dark)' }}>{a.actor} &middot; {formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--rr-muted)', marginBottom: '1rem' }}>Details</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Anomaly Type</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.anomalyType}</p></div>
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Engine Type</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.engineType}</p></div>
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Serial Number</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.engineSerialNumber}</p></div>
              {request.partNumber && <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Part Number</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.partNumber}</p></div>}
              {request.aircraftRegistration && <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Aircraft</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.aircraftRegistration}</p></div>}
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>MRO Organisation</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.mroOrganisation}</p></div>
              {request.mroSiteLocation && <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Site</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.mroSiteLocation}</p></div>}
              {request.shopVisitReference && <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Shop Visit</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.shopVisitReference}</p></div>}
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Submitted By</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.submittedBy}</p></div>
              {request.assignedTo && <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Assigned To</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{request.assignedTo}</p></div>}
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Created</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{formatDate(request.createdAt)}</p></div>
              <div><p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)', marginBottom: '0.125rem' }}>Last Updated</p><p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{formatDate(request.updatedAt)}</p></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--rr-muted)', marginBottom: '1rem' }}>Workflow Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {availableActions.map((action) => (
                <button key={action.status} className="btn-outline" style={{ justifyContent: 'center', fontSize: '0.8125rem' }} onClick={() => updateStatus(action.status)}>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {request.attachments.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--rr-muted)', marginBottom: '1rem' }}>Attachments ({request.attachments.length})</h3>
              {request.attachments.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--rr-border)' }}>
                  <span style={{ fontSize: 16 }}>{'\u{1F4CE}'}</span>
                  <div>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{a.fileName}</p>
                    <p style={{ fontSize: '0.6875rem', color: 'var(--rr-muted)' }}>{a.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
