import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createRequest, getEngineTypes, getMroOrganisations, getAnomalyTypes } from '../api/apiService';

export default function Submit() {
  const [engineTypes, setEngineTypes] = useState<string[]>([]);
  const [mroOrganisations, setMroOrganisations] = useState<string[]>([]);
  const [anomalyTypes, setAnomalyTypes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    anomalyType: '',
    engineType: '',
    engineSerialNumber: '',
    partNumber: '',
    aircraftRegistration: '',
    priority: 'Medium',
    mroOrganisation: '',
    mroSiteLocation: '',
    shopVisitReference: '',
    submittedBy: '',
  });

  useEffect(() => {
    getEngineTypes().then(setEngineTypes);
    getMroOrganisations().then(setMroOrganisations);
    getAnomalyTypes().then(setAnomalyTypes);
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await createRequest(form as Record<string, unknown>);
      setSubmitted(true);
      setSubmittedRef(r.referenceNumber);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="gradient-rr" style={{ padding: '3rem 0 2rem' }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            <div className="line" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>MRO Portal</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Submit Variance Request</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>Submit a new non-conformance technical variance for review</p>
        </div>
      </section>

      <section style={{ padding: '2rem 0 4rem', background: 'var(--rr-platinum)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={onSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Request Title *</label>
                  <input type="text" name="title" value={form.title} onChange={onChange} placeholder="e.g. HPT Blade Tip Liberation — Trent XWB SN-7842" required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description *</label>
                  <textarea name="description" value={form.description} onChange={onChange} rows={4}
                    placeholder="Describe the non-conformance in detail including inspection findings, measurements, and deviations from AMM limits" />
                </div>
                <div className="form-group">
                  <label>Anomaly Type *</label>
                  <select name="anomalyType" value={form.anomalyType} onChange={onChange} required>
                    <option value="">Select anomaly type</option>
                    {anomalyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Engine Type *</label>
                  <select name="engineType" value={form.engineType} onChange={onChange} required>
                    <option value="">Select engine type</option>
                    {engineTypes.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Engine Serial Number *</label>
                  <input type="text" name="engineSerialNumber" value={form.engineSerialNumber} onChange={onChange} placeholder="e.g. SN-7842" required />
                </div>
                <div className="form-group">
                  <label>Part Number</label>
                  <input type="text" name="partNumber" value={form.partNumber} onChange={onChange} placeholder="e.g. RB211-9278" />
                </div>
                <div className="form-group">
                  <label>Aircraft Registration</label>
                  <input type="text" name="aircraftRegistration" value={form.aircraftRegistration} onChange={onChange} placeholder="e.g. G-XWBA" />
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select name="priority" value={form.priority} onChange={onChange} required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>MRO Organisation *</label>
                  <select name="mroOrganisation" value={form.mroOrganisation} onChange={onChange} required>
                    <option value="">Select MRO partner</option>
                    {mroOrganisations.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>MRO Site Location</label>
                  <input type="text" name="mroSiteLocation" value={form.mroSiteLocation} onChange={onChange} placeholder="e.g. Hamburg, Germany" />
                </div>
                <div className="form-group">
                  <label>Shop Visit Reference</label>
                  <input type="text" name="shopVisitReference" value={form.shopVisitReference} onChange={onChange} placeholder="e.g. SV-2025-LHT-0042" />
                </div>
                <div className="form-group">
                  <label>Submitted By *</label>
                  <input type="text" name="submittedBy" value={form.submittedBy} onChange={onChange} placeholder="e.g. M. Weber" required />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rr-border)' }}>
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '0.375rem', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                    <span style={{ fontSize: '18px' }}>{'\u{1F916}'}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>AI Initiate Agent</p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--rr-muted)' }}>
                        Upon submission, the AI Initiate Agent will analyse your request and may
                        generate additional RFI questions to ensure completeness before triage.
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <Link to="/" className="btn-outline">Cancel</Link>
                  <button type="submit" className="btn-navy" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </div>
            </form>

            {submitted && (
              <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '0.375rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.25rem' }}>Request Submitted Successfully</p>
                <p style={{ fontSize: '0.8125rem', color: '#15803D' }}>
                  Reference: {submittedRef} — Your request has been submitted and will be triaged shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
