import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
import StatusBadge from '../../components/StatusBadge';
import ParcelTimeline from '../../components/ParcelTimeline';

const NEXT_STATUS = { 0: [1, 4], 1: [2, 4], 2: [3, 4] };
const LABELS = { 0: 'Pending', 1: 'Picked', 2: 'In Transit', 3: 'Delivered', 4: 'Cancelled' };

export default function ParcelDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [parcel, setParcel] = useState(null);
  const [logs, setLogs] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    receiver_name: '',
    receiver_phone: '',
    pickup_address: '',
    delivery_address: '',
    cod_amount: 0,
  });

  const load = () => {
    setLoading(true);
    API.get(`/parcel/parcels.php?id=${id}`)
      .then(res => {
        setParcel(res.data.parcel);
        setLogs(res.data.logs || []);
      })
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    API.get('/deliverymen/index.php')
      .then(res => setDeliverymen(res.data.deliverymen || res.data.data || []))
      .catch(() => {});
  }, [id]);

  // Auto-open edit if ?edit=1
  useEffect(() => {
    if (searchParams.get('edit') === '1' && parcel) {
      openEdit();
    }
  }, [parcel, searchParams]);

  const openEdit = () => {
    setEditForm({
      receiver_name: parcel.receiver_name || '',
      receiver_phone: parcel.receiver_phone || '',
      pickup_address: parcel.pickup_address || '',
      delivery_address: parcel.delivery_address || '',
      cod_amount: parcel.cod_amount ?? 0,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const setEdit = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  const saveEdit = async () => {
    if (!editForm.receiver_name.trim()) return alert('Receiver name is required');
    if (!editForm.receiver_phone.trim()) return alert('Receiver phone is required');
    if (!editForm.delivery_address.trim()) return alert('Delivery address is required');
    if (Number(editForm.cod_amount) < 0) return alert('COD cannot be negative');

    setSaving(true);
    try {
      await API.patch(
        '/parcel/parcels.php',
        {
          id: Number(id),
          receiver_name: editForm.receiver_name,
          receiver_phone: editForm.receiver_phone,
          pickup_address: editForm.pickup_address,
          delivery_address: editForm.delivery_address,
          cod_amount: Number(editForm.cod_amount),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setIsEditing(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (newStatus) => {
    try {
      await API.patch(
        '/parcel/parcels.php',
        { id: Number(id), status: newStatus, note },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNote('');
      load();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  const assign = async (deliverymanId) => {
    try {
      await API.patch(
        '/parcel/parcels.php',
        {
          id: Number(id),
          assigned_to: deliverymanId ? Number(deliverymanId) : null,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      load();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this parcel? This cannot be undone.')) return;
    try {
      await API.patch(
        '/parcel/parcels.php',
        { id: Number(id), status: 4, note: 'Cancelled from detail' },
        { headers: { 'Content-Type': 'application/json' } }
      );
      load();
    } catch (err) { alert(err.response?.data?.message || err.message); }
  };

  if (loading) return <Layout><p className="text-muted">Loading...</p></Layout>;
  if (!parcel) return <Layout><p className="text-danger">Parcel not found.</p></Layout>;

  const current = Number(parcel.status);
  const nexts = NEXT_STATUS[current] || [];
  const finalised = current === 3 || current === 4;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Link to="/parcels" className="text-muted small">← Back to parcels</Link>
          <h4 className="mb-1 mt-1 font-monospace">{parcel.tracking_id}</h4>
          <small className="text-muted">
            Created {new Date(parcel.created_at).toLocaleString()}
          </small>
        </div>
        <StatusBadge status={current} />
      </div>

      <div className="row">
        <div className="col-lg-8 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Parcel Info</h4>
                {!finalised && !isEditing && (
                  <button className="btn btn-primary btn-sm" onClick={openEdit}>
                    <i className="typcn typcn-pencil mr-1"></i> Edit
                  </button>
                )}
              </div>

              {/* ===== EDIT MODE ===== */}
              {isEditing ? (
                <div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Receiver Name *</label>
                      <input
                        className="form-control"
                        value={editForm.receiver_name}
                        onChange={e => setEdit('receiver_name', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>Receiver Phone *</label>
                      <input
                        className="form-control"
                        value={editForm.receiver_phone}
                        onChange={e => setEdit('receiver_phone', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>COD Amount (৳)</label>
                      <input
                        className="form-control"
                        type="number"
                        min="0"
                        value={editForm.cod_amount}
                        onChange={e => setEdit('cod_amount', e.target.value)}
                      />
                    </div>
                    <div className="col-12 form-group">
                      <label>Pickup Address</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        value={editForm.pickup_address}
                        onChange={e => setEdit('pickup_address', e.target.value)}
                      />
                    </div>
                    <div className="col-12 form-group">
                      <label>Delivery Address *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editForm.delivery_address}
                        onChange={e => setEdit('delivery_address', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="text-muted small mb-3">
                    <i className="typcn typcn-info-large"></i>{' '}
                    Weight,zone and tracking ID cannot be changed.If you need to change
                    these, cancel this parcel and create a new one.
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={saveEdit}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      className="btn btn-light"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ===== VIEW MODE ===== */
                <div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Sender</small>
                      <p className="mb-0">{parcel.sender_name}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Receiver</small>
                      <p className="mb-0">{parcel.receiver_name}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Phone</small>
                      <p className="mb-0">{parcel.receiver_phone}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Zone</small>
                      <p className="mb-0">{parcel.zone_name}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Weight</small>
                      <p className="mb-0">{parcel.weight} kg</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Charge</small>
                      <p className="mb-0">৳{parcel.delivery_charge}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">COD</small>
                      <p className="mb-0">৳{parcel.cod_amount}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Assigned</small>
                      <p className="mb-0">{parcel.deliveryman_name || '—'}</p>
                    </div>
                    <div className="col-12 mt-2">
                      <small className="text-muted">Pickup</small>
                      <p className="mb-1">{parcel.pickup_address}</p>
                      <small className="text-muted">Delivery</small>
                      <p className="mb-0">{parcel.delivery_address}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assign (only when not editing) */}
              {!finalised && !isEditing && (
                <div className="mt-4">
                  <h5 className="mb-2">Assign Deliveryman</h5>
                  <select
                    className="form-control"
                    value={parcel.assigned_to || ''}
                    onChange={e => assign(e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {deliverymen.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.contact_no || '—'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Status update (only when not editing) */}
              {!finalised && !isEditing && nexts.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-2">Update Status</h5>
                  <input
                    className="form-control mb-3"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                  <div className="d-flex flex-wrap gap-2">
                    {nexts.filter(s => s !== 4).map(s => (
                      <button
                        key={s}
                        onClick={() => changeStatus(s)}
                        className="btn btn-primary btn-sm mr-2"
                      >
                        Mark as {LABELS[s]}
                      </button>
                    ))}
                    {nexts.includes(4) && (
                      <button
                        onClick={handleCancel}
                        className="btn btn-warning btn-sm"
                      >
                        Cancel Parcel
                      </button>
                    )}
                  </div>
                </div>
              )}

              {finalised && (
                <div className="alert alert-secondary mt-4 mb-0">
                  This parcel is finalised ({LABELS[current]}). No further actions available.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Timeline</h4>
              <ParcelTimeline logs={logs} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}