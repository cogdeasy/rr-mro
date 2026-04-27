const engines = ['Trent 1000', 'Trent XWB', 'Trent 7000', 'Trent 900', 'Trent 500', 'BR725'];
const regulations = [
  { name: 'EASA Part-145', description: 'Approved maintenance organisation regulation' },
  { name: 'EASA Part-21', description: 'Certification of aircraft and related products' },
  { name: 'FAA AC 43.13', description: 'Acceptable methods, techniques, and practices' },
  { name: 'ICAO Annex 8', description: 'Airworthiness of aircraft standards' },
  { name: 'UK CAA CAP 562', description: 'Civil aircraft airworthiness information and procedures' },
];

export default function Settings() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Platform Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--rr-muted)' }}>Configure MRO Variance Platform settings and integrations</p>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>AI Agent Configuration</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { title: 'Initiate Agent', desc: 'Front-load RFI questions on submission' },
              { title: 'Scoping / Triage Agent', desc: 'Severity classification and specialist routing' },
              { title: 'Document Authoring Agent', desc: 'RAG-powered variance document generation' },
            ].map(agent => (
              <div key={agent.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--rr-platinum)', borderRadius: '0.375rem' }}>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{agent.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>{agent.desc}</p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#16A34A', background: '#F0FDF4', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Azure Integration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'AI Model', value: 'Azure OpenAI GPT-4' },
              { label: 'RAG Platform', value: 'Databricks' },
              { label: 'Knowledge Base', value: '15,000+ variances' },
              { label: 'Region', value: 'UK South' },
            ].map(item => (
              <div key={item.label} style={{ padding: '0.75rem', background: 'var(--rr-platinum)', borderRadius: '0.375rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Regulatory Compliance</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {regulations.map(reg => (
              <div key={reg.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--rr-border)' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--rr-navy)' }} />
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{reg.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--rr-muted)' }}>{reg.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Engine Programmes</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {engines.map(e => (
              <span key={e} style={{ padding: '0.375rem 0.75rem', background: 'var(--rr-navy)', color: '#fff', borderRadius: '0.375rem', fontSize: '0.8125rem', fontWeight: 500 }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
