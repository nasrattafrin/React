import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
const MAX_WEIGHT = 15;
export default function ParcelCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [zones, setZones] = useState([]);
  const [merchants, setMerchants] = useState([]); 
  const [charge, setCharge] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    sender_id: '', 
    receiver_name: '',
    receiver_phone: '',
    pickup_address: '',
    delivery_address: '',
    weight: '',
    zone_id: '',
    cod_amount: 0,
  });

  useEffect(() => {
    API.get('/parcel/zones.php')
      .then(res => setZones(res.data.zones || []))
      .catch(() => {});

    // Merchant list load koro
    API.get('/users/merchants.php')
      .then(res => setMerchants(res.data.merchants || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const w = Number(form.weight);
    if (form.zone_id && w > 0 && w <= MAX_WEIGHT) {
      API.post(
        '/parcel/parcel_charge.php',
        { zone_id: Number(form.zone_id), weight: w },
        { headers: { 'Content-Type': 'application/json' } }
      )
        .then(res => setCharge(res.data.charge || 0))
        .catch(() => setCharge(0));
    } else {
      setCharge(0);
    }
  }, [form.zone_id, form.weight]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    if (!form.sender_id) return alert('Please select a Merchant');
    if (!form.receiver_name.trim()) return alert('Receiver name required');
    if (!form.receiver_phone.trim()) return alert('Receiver phone required');
    if (!form.delivery_address.trim()) return alert('Delivery address required');
    setStep(2);
  };

  const validateStep2 = () => {
    const w = Number(form.weight);
    if (!w || w <= 0) return alert('Valid weight required');
    if (w > MAX_WEIGHT) return alert(`Weight cannot exceed ${MAX_WEIGHT} kg`);
    if (!form.zone_id) return alert('Select a zone');
    setStep(3);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await API.post(
        '/parcel/parcels.php',
        {
          ...form,
          weight: Number(form.weight),
          zone_id: Number(form.zone_id),
          cod_amount: Number(form.cod_amount) || 0,
          sender_id: Number(form.sender_id), // Sender ID pathano holo
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(`Created! Tracking: ${res.data.parcel.tracking_id}`);
      navigate(`/parcels/${res.data.parcel.id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const weightTooHigh = Number(form.weight) > MAX_WEIGHT;
  const selectedMerchant = merchants.find(m => String(m.id) === String(form.sender_id));
  return (
    <Layout>
      <div className="row">
        <div className="col-lg-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create New Parcel</h4>
              <div className="d-flex justify-content-between mb-4">
                {['Sender & Receiver', 'Parcel Details', 'Confirm'].map((label, i) => {
                  const n = i + 1;
                  const active = step >= n;
                  return (
                    <div key={label} className="text-center flex-fill">
                      <div
                        className={`mx-auto rounded-circle d-flex align-items-center justify-content-center ${
                          active ? 'bg-primary text-white' : 'bg-light text-muted'
                        }`}
                        style={{ width: 40, height: 40, fontWeight: 600 }}
                      >
                        {n}
                      </div>
                      <small className={active ? 'text-primary' : 'text-muted'}>{label}</small>
                    </div>
                  );
                })}
              </div>
              {step === 1 && (
                <div>
                  <h5 className="mb-3">Sender & Receiver Information</h5>
                  
                  <div className="form-group">
                    <label>Select Merchant (Sender) *</label>
                    <select className="form-control" value={form.sender_id}
                      onChange={e => set('sender_id', e.target.value)}>
                      <option value="">-- Select Merchant --</option>
                      {merchants.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Receiver name</label>
                    <input className="form-control" value={form.receiver_name}
                      onChange={e => set('receiver_name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Receiver phone</label>
                    <input className="form-control" value={form.receiver_phone}
                      onChange={e => set('receiver_phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Delivery address</label>
                    <textarea className="form-control" rows={3} value={form.delivery_address}
                      onChange={e => set('delivery_address', e.target.value)} />
                  </div>
                  <div className="text-right">
                    <button className="btn btn-primary" onClick={validateStep1}>Next →</button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h5 className="mb-3">Parcel Details</h5>
                  <div className="form-group">
                    <label>Pickup address</label>
                    <textarea className="form-control" rows={2} value={form.pickup_address}
                      onChange={e => set('pickup_address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg) <span className="text-muted small">(max {MAX_WEIGHT} kg)</span></label>
                    <input
                      className={`form-control ${weightTooHigh ? 'is-invalid' : ''}`}
                      type="number"
                      step="0.1"
                      min="0.1"
                      max={MAX_WEIGHT}
                      value={form.weight}
                      onChange={e => set('weight', e.target.value)}
                      placeholder={`Max ${MAX_WEIGHT} kg`}
                    />
                    {weightTooHigh && (
                      <small className="text-danger d-block mt-1">
                        ⚠️ Weight cannot exceed {MAX_WEIGHT} kg.
                      </small>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Zone</label>
                    <select className="form-control" value={form.zone_id}
                      onChange={e => set('zone_id', e.target.value)}>
                      <option value="">Select zone</option>
                      {zones.map(z => (
                        <option key={z.id} value={z.id}>{z.zone_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>COD amount (৳)</label>
                    <input className="form-control" type="number" value={form.cod_amount}
                      onChange={e => set('cod_amount', e.target.value)} />
                  </div>
                  <div className="alert alert-info">
                    <small className="d-block text-muted">Delivery charge (auto-calculated)</small>
                    <strong className="h4 mb-0">৳{charge}</strong>
                    {charge === 0 && form.zone_id && form.weight && !weightTooHigh && (
                      <p className="text-danger small mb-0 mt-1">
                        No pricing rule for this zone/weight.
                      </p>
                    )}
                    {weightTooHigh && (
                      <p className="text-danger small mb-0 mt-1">
                        Weight exceeds {MAX_WEIGHT} kg. Charge cannot be calculated.
                      </p>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-light" onClick={() => setStep(1)}>← Back</button>
                    <button className="btn btn-primary" onClick={validateStep2} disabled={weightTooHigh}>
                      Next →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h5 className="mb-3">Review & Confirm</h5>
                  <div className="bg-light p-3 rounded mb-3">
                    <p className="mb-1"><strong>Sender (Merchant):</strong> {selectedMerchant ? selectedMerchant.name : '—'}</p>
                    <p className="mb-1"><strong>To:</strong> {form.receiver_name} ({form.receiver_phone})</p>
                    <p className="mb-1"><strong>Delivery:</strong> {form.delivery_address}</p>
                    <p className="mb-1"><strong>Pickup:</strong> {form.pickup_address || '—'}</p>
                    <p className="mb-1"><strong>Weight:</strong> {form.weight} kg</p>
                    <p className="mb-1"><strong>Charge:</strong> ৳{charge}</p>
                    <p className="mb-0"><strong>COD:</strong> ৳{form.cod_amount || 0}</p>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-light" onClick={() => setStep(2)}>← Back</button>
                    <button className="btn btn-success" onClick={submit}
                      disabled={submitting || charge === 0 || weightTooHigh}>
                      {submitting ? 'Creating...' : 'Confirm & Create'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}