export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="gradient-rr" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.15em', color: '#fff' }}>ROLLS-ROYCE</span>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>MRO Variance Platform</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Trusted to deliver excellence</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>&copy; {year} Rolls-Royce plc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
