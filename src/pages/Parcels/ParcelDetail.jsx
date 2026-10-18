import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
import StatusBadge from '../../components/StatusBadge';
import ParcelTimeline from '../../components/ParcelTimeline';
const NEXT_STATUS = { 0: [1, 4], 1: [2, 4], 2: [3, 4] };
const LABELS = { 0: 'Pending', 1: 'Picked', 2: 'In Transit', 3: 'Delivered', 4: 'Cancelled' };
const PAYMENT_METHODS = [
  { value: 0, label: 'bKash' },
  { value: 1, label: 'Nagad' },
  { value: 2, label: 'Card' },
  { value: 3, label: 'COD' },
];
const PAYMENT_STATUSES = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Success' },
  { value: 2, label: 'Failed' },
];

const METHOD_BADGE = { 0: 'bg-info', 1: 'bg-warning text-dark', 2: 'bg-primary', 3: 'bg-secondary' };
const STATUS_BADGE = { 0: 'bg-warning text-dark', 1: 'bg-success', 2: 'bg-danger' };

export default function ParcelDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [parcel, setParcel] = useState(null);
  const [logs, setLogs] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [payments, setPayments] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    receiver_name: '',
    receiver_phone: '',
    pickup_address: '',
    delivery_address: '',
    cod_amount: 0,
  });
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySaving, setPaySaving] = useState(false);
  const [payError, setPayError] = useState('');
  const [payForm, setPayForm] = useState({
    amount: '',
    method: 0,
    transaction_id: '',
    status: 1,
  });
  const loadParcel = () => {
    setLoading(true);
    API.get(`/parcel/parcels.php?id=${id}`)
      .then(res => {
    setParcel(res.data.parcel);
    setLogs(res.data.logs || []);
  })
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  const loadPayments = () => {
    API.get('payments/single_i.php?id=' + id)
      .then(res => {
      setPayments(res.data.payments || res.data.data || []);
      console.log('Payments data:', res.data.payments || res.data.data || []);
    })
      .catch(() => {});
  };
  useEffect(() => {
    loadParcel();
    loadPayments();
    API.get('/deliverymen/index.php')
      .then(res => setDeliverymen(res.data.deliverymen || res.data.data || []))
      .catch(() => {});
  }, [id]);
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
  const openPayModal = () => {
    const due = Number(parcel?.total_due || 0);
    const paid = Number(parcel?.total_paid || 0);
    const remaining = Math.max(0, due - paid);
    setPayForm({
      amount: remaining || '',
      method: 0,
      transaction_id: '',
      status: 1,
    });
    setPayError('');
    setShowPayModal(true);
  };
  const closePayModal = () => {
    setShowPayModal(false);
    setPayError('');
  };
  const setPay = (k, v) => setPayForm(f => ({ ...f, [k]: v }));
  const savePayment = async (e) => {
    e.preventDefault();
    setPayError('');
    const amt = Number(payForm.amount);
    if (!amt || amt <= 0) return setPayError('Amount must be greater than 0');
    if (Number(payForm.method) === 3 && amt > Number(parcel.cod_amount || 0)) {
      return setPayError('COD amount cannot exceed parcel COD.');
    }
    setPaySaving(true);
    try {
      await API.post(
        '/payments/create.php',
        {
          parcel_id: Number(id),
          amount: amt,
          method: Number(payForm.method),
          transaction_id: payForm.transaction_id.trim(),
          status: Number(payForm.status),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      closePayModal();
      loadPayments();
      load();
    } catch (err) {
      setPayError(err.response?.data?.message || err.message);
    } finally {
      setPaySaving(false);
    }
  };
  const deletePayment = async (pid) => {
    if (!window.confirm('Delete this payment?')) return;
    try {
      await API.delete(`/payments/delete.php?id=${pid}`);
      loadPayments();
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
  if (loading) return <Layout><p className="text-muted">Loading...</p></Layout>;
  if (!parcel) return <Layout><p className="text-danger">Parcel not found.</p></Layout>;
  const current = Number(parcel.status);
  const nexts = NEXT_STATUS[current] || [];
  const finalised = current === 3 || current === 4;
  const due = Number(parcel.total_due || 0);
  const paid = Number(parcel.amount || 0);
  const remaining = Math.max(0, due - paid);

  
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

              {isEditing ? (
                <div>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label>Receiver Name *</label>
                      <input className="form-control" value={editForm.receiver_name}
                        onChange={e => setEdit('receiver_name', e.target.value)} />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>Receiver Phone *</label>
                      <input className="form-control" value={editForm.receiver_phone}
                        onChange={e => setEdit('receiver_phone', e.target.value)} />
                    </div>
                    <div className="col-md-6 form-group">
                      <label>COD Amount (৳)</label>
                      <input className="form-control" type="number" min="0"
                        value={editForm.cod_amount}
                        onChange={e => setEdit('cod_amount', e.target.value)} />
                    </div>
                    <div className="col-12 form-group">
                      <label>Pickup Address</label>
                      <textarea className="form-control" rows={2} value={editForm.pickup_address}
                        onChange={e => setEdit('pickup_address', e.target.value)} />
                    </div>
                    <div className="col-12 form-group">
                      <label>Delivery Address *</label>
                      <textarea className="form-control" rows={3} value={editForm.delivery_address}
                        onChange={e => setEdit('delivery_address', e.target.value)} />
                    </div>
                  </div>

                  <div className="text-muted small mb-3">
                    <i className="typcn typcn-info-large"></i>{' '}
                    Weight, zone, and tracking ID cannot be changed. If you need to change
                    these, cancel this parcel and create a new one.
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={saveEdit} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="btn btn-light" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
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

              {!finalised && !isEditing && (
                <div className="mt-4">
                  <h5 className="mb-2">Assign Deliveryman</h5>
                  <select className="form-control" value={parcel.assigned_to || ''}
                    onChange={e => assign(e.target.value)}>
                    <option value="">-- Unassigned --</option>
                    {deliverymen.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.contact_no || '—'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {!finalised && !isEditing && nexts.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-2">Update Status</h5>
                  <input className="form-control mb-3" placeholder="Note (optional)"
                    value={note} onChange={e => setNote(e.target.value)} />
                  <div className="d-flex flex-wrap gap-2">
                    {nexts.filter(s => s !== 4).map(s => (
                      <button key={s} onClick={() => changeStatus(s)}
                        className="btn btn-primary btn-sm mr-2">
                        Mark as {LABELS[s]}
                      </button>
                    ))}
                    {nexts.includes(4) && (
                      <button onClick={handleCancel} className="btn btn-warning btn-sm">
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
      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">
                  <i className="typcn typcn-credit-card mr-1"></i> Payment
                </h4>
                <button className="btn btn-success btn-sm" onClick={openPayModal}>
                  <i className="typcn typcn-plus mr-1"></i> Record Payment
                </button>
              </div>
              <div className="row mb-3">

                <div className="col-md-4 mb-2">
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted d-block">Total Paid</small>
                    <strong className="h5 text-success">৳{payments[0]?.amount || 0}</strong>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className={`p-3 rounded ${remaining === 0 ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                    <small className="d-block">Remaining</small>
                    <strong className="h5 mb-0">৳{remaining}</strong>
                  </div>
                </div>
              </div>
              {payments.length === 0 ? (
                <p className="text-muted mb-0">No payments recorded yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Trx ID</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(pay => (
                        <tr key={pay.id}>
                          <td>
                            <small>{new Date(pay.created_at).toLocaleString()}</small>
                          </td>
                          <td>৳{pay.amount}</td>
                          <td>
                            <span className={`badge ${METHOD_BADGE[Number(pay.method)] || 'bg-secondary'}`}>
                              {pay.method_label || PAYMENT_METHODS.find(m => m.value === Number(pay.method))?.label}
                            </span>
                          </td>
                          <td>
                            <small className="font-monospace">{pay.transaction_id || '—'}</small>
                          </td>
                          <td>
                            <span className={`badge ${STATUS_BADGE[Number(pay.status)] || 'bg-secondary'}`}>
                              {pay.status_label || PAYMENT_STATUSES.find(s => s.value === Number(pay.status))?.label}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => deletePayment(pay.id)}
                            >
                              <i className="typcn typcn-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPayModal && (
        <>
          <div className="modal-backdrop show" style={{ background: 'rgba(0,0,0,0.5)' }}
            onClick={closePayModal}></div>
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Record Payment</h5>
                  <button type="button" className="close" onClick={closePayModal}>
                    <span>&times;</span>
                  </button>
                </div>
                <form onSubmit={savePayment}>
                  <div className="modal-body">
                    {payError && <div className="alert alert-danger py-2">{payError}</div>}

                    <div className="alert alert-info py-2 mb-3">
                      <small>
                        <strong>Parcel:</strong> {parcel.tracking_id}<br />
                        <strong>Remaining Due:</strong> ৳{remaining}
                      </small>
                    </div>
                    <div className="form-group">
                      <label>Amount (৳) *</label>
                      <input
                        className="form-control"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={payForm.amount}
                        onChange={e => setPay('amount', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Method *</label>
                      <select
                        className="form-control"
                        value={payForm.method}
                        onChange={e => setPay('method', e.target.value)}
                      >
                        {PAYMENT_METHODS.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        Transaction ID {Number(payForm.method) !== 3 && '(required for payment)'}
                      </label>
                      <input
                        className="form-control font-monospace"
                        value={payForm.transaction_id}
                        onChange={e => setPay('transaction_id', e.target.value)}
                        placeholder={Number(payForm.method) === 3 ? 'COD — leave blank' : 'e.g. BKASH-TRX-001'}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label>Status *</label>
                      <select
                        className="form-control"
                        value={payForm.status}
                        onChange={e => setPay('status', e.target.value)}
                      >
                        {PAYMENT_STATUSES.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={closePayModal}
                      disabled={paySaving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success" disabled={paySaving}>
                      {paySaving ? 'Saving...' : 'Save Payment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}