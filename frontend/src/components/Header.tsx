const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 1.25rem', height: 52, background: '#001233', color: '#fff',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

export default function Header() {
  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: 2, color: '#B8860B' }}>ROLLS-ROYCE</span>
        <span style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 500, opacity: 0.85 }}>MRO Variance Platform</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 2rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '0 0.75rem', width: '100%', maxWidth: 420,
        }}>
          <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>&#x1F50D;</span>
          <input
            type="text"
            placeholder="Search requests, documents, engines..."
            style={{
              background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem',
              padding: '0.45rem 0', width: '100%', outline: 'none',
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{
          padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.65rem', fontWeight: 600,
          background: 'rgba(16,185,129,0.2)', color: '#10b981', letterSpacing: '0.05em',
        }}>PROD</span>
        <div style={{ position: 'relative', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }} title="Notifications">
          <span>&#x1F514;</span>
          <span style={{
            position: 'absolute', top: -2, right: -4, width: 7, height: 7,
            background: '#ef4444', borderRadius: '50%', border: '1.5px solid #001233',
          }} />
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: '#B8860B', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
        }} title="Dr. J. Richardson">JR</div>
      </div>
    </header>
  );
}
