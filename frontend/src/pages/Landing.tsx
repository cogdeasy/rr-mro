import { Link } from 'react-router-dom';
import './Landing.scss';

const workflowSteps = [
  { name: 'Submit', description: 'MRO submits variance request', color: '#3B82F6' },
  { name: 'Triage', description: 'AI classifies & routes', color: '#F59E0B' },
  { name: 'Specialist', description: 'Expert opinion gathered', color: '#8B5CF6' },
  { name: 'Draft', description: 'AI-assisted document authoring', color: '#0EA5E9' },
  { name: 'Review', description: 'Human-in-the-loop validation', color: '#10B981' },
  { name: 'Approve', description: 'Digital signature & release', color: '#16A34A' },
];

const engines = ['Trent 1000', 'Trent XWB', 'Trent 7000', 'Trent 900', 'Trent 500', 'BR725'];

export default function Landing() {
  return (
    <>
      <section className="gradient-hero" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><circle cx=%22200%22 cy=%22200%22 r=%22180%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.03)%22 stroke-width=%221%22/><circle cx=%22200%22 cy=%22200%22 r=%22140%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.02)%22 stroke-width=%221%22/><circle cx=%22200%22 cy=%22200%22 r=%22100%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.02)%22 stroke-width=%221%22/></svg>') center center / 400px repeat" }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: '720px' }}>
            <div className="section-label" style={{ marginBottom: '2rem' }}>
              <div className="line" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>MRO Variance Platform</span>
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Non-Conformance<br />Variance Management
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '600px' }}>
              Digitising the technical variance process for the Rolls-Royce MRO network.
              AI-assisted triage, document authoring, and end-to-end workflow management
              across all engine programmes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/submit" className="btn-primary" style={{ fontSize: '15px', padding: '0.875rem 2rem' }}>Submit Variance Request</Link>
              <Link to="/track" className="btn-secondary" style={{ fontSize: '15px', padding: '0.875rem 2rem' }}>Track Requests</Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0', background: 'var(--rr-platinum)' }}>
        <div className="container">
          <div className="section-label">
            <div className="line" />
            <span>Platform Capabilities</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '3rem' }}>End-to-End Variance Lifecycle</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
            {[
              { icon: '\u{1F4CB}', title: 'Digital Request Submission', desc: 'MRO partners submit variance requests digitally with structured anomaly data, borescope imagery, and engineering drawings. AI Initiate Agent front-loads RFI questions to ensure completeness.' },
              { icon: '\u{1F916}', title: 'AI-Assisted Triage', desc: 'Scoping and Triaging Agent classifies anomaly severity, matches against 15,000+ prior variances via RAG, and routes to the appropriate specialist engineer automatically.' },
              { icon: '\u{1F4C4}', title: 'Document Authoring Agent', desc: 'RAG-powered Document Authoring Agent generates the 27-page regulated variance package with 60-70% effort reduction. Human-in-the-loop review ensures regulatory compliance.' },
            ].map(item => (
              <div className="card" key={item.title}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--rr-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-label">
            <div className="line" />
            <span>Workflow</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '3rem' }}>Variance Request Lifecycle</h2>
          <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', overflowX: 'auto', paddingBottom: '1rem' }}>
            {workflowSteps.map((step, i) => (
              <div className="workflow-step" key={step.name}>
                <div className="step-dot" style={{ background: step.color }} />
                <div className="step-content">
                  <h4>{step.name}</h4>
                  <p>{step.description}</p>
                </div>
                {i < workflowSteps.length - 1 && <div className="step-arrow">&rarr;</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gradient-rr" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Engine Programmes Supported</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem' }}>Covering the full Rolls-Royce civil aerospace fleet</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {engines.map(engine => (
              <div className="engine-card" key={engine}>
                <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>{engine}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
