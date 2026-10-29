import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ subject: '', message: '', parcel_id: '' });
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    // Merchant er nijer parcel list load koro
    API.get('/parcel/parcels.php')
      .then(res => setParcels(res.data.parcels || []))
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/support_tickets/create.php', {
        ...form,
        parcel_id: form.parcel_id ? Number(form.parcel_id) : null
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert("Ticket submitted successfully!");
      navigate('/support');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-lg-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <Link to="/support" className="btn btn-light btn-sm mr-3">
                  <i className="typcn typcn-arrow-left"></i> Back
                </Link>
                <h4 className="card-title mb-0">Raise a Support Ticket</h4>
              </div>

              <form onSubmit={submit}>
                <div className="form-group">
                  <label>Subject *</label>
                  <input className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)} required placeholder="e.g. Parcel is damaged" />
                </div>
                
                <div className="form-group">
                  <label>Related Parcel (Optional)</label>
                  <select className="form-control" value={form.parcel_id} onChange={e => set('parcel_id', e.target.value)}>
                    <option value="">-- No specific parcel --</option>
                    {parcels.map(p => (
                      <option key={p.id} value={p.id}>{p.tracking_id} (To: {p.receiver_name})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea className="form-control" rows="5" value={form.message} onChange={e => set('message', e.target.value)} required placeholder="Describe your issue in detail..."></textarea>
                </div>

                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}