import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';
const METHODS = { 0: 'bKash', 1: 'Nagad', 2: 'Bank' };
const STATUS = {
  0: { label: 'Pending', badge: 'bg-warning text-dark' },
  1: { label: 'Approved', badge: 'bg-info text-white' },
  2: { label: 'Paid', badge: 'bg-success text-white' },
  3: { label: 'Rejected', badge: 'bg-danger text-white' },
};
export default function WithdrawList() {
  const [requests, setRequests] = useState([]);
  const [merchants, setMerchants] = useState([]); // Form er jonno
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    merchant_id: '', amount: '', method: 0, account_number: ''
  });
  const load = () => {
    setLoading(true);
    API.get('/withdraw_requests/index.php')
      .then(res => setRequests(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { 
    load(); 
    API.get('/users/merchants.php')
      .then(res => setMerchants(res.data.merchants || []))
      .catch(() => {});
  }, []);
  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark this request as ${STATUS[status].label}?`)) return;
    try {
      await API.put('/withdraw_requests/single.php', { id, status }, {
        headers: { 'Content-Type': 'application/json' }
      });
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await API.post('/withdraw_requests/create.php', {
        ...form,
        merchant_id: Number(form.merchant_id),
        amount: Number(form.amount),
        method: Number(form.method)
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setShowModal(false);
      setForm({ merchant_id: '', amount: '', method: 0, account_number: '' });
      load();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              {/* ===== HEADER SECTION ===== */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                  <Link to="/wallets" className="btn btn-light btn-sm mr-3" title="Back to Wallets">
                    <i className="typcn typcn-arrow-left"></i> Back
                  </Link>
                  <h4 className="card-title mb-0">Withdraw Requests</h4>
                </div>
                
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                  + Create Request
                </button>
              </div>
              {loading ? <p>Loading...</p> : requests.length === 0 ? <p>No requests found.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Method & Account</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map(r => {
                        const currentStatus = Number(r.status);
                        const statusInfo = STATUS[currentStatus] || STATUS[0];
                        return (
                          <tr key={r.id}>
                            <td>{new Date(r.requested_at).toLocaleString()}</td>
                            <td>{r.merchant_name}</td>
                            <td className="font-weight-bold">৳{r.amount}</td>
                            <td>{METHODS[r.method]} <br/><small>{r.account_number}</small></td>
                            <td>
                              <span className={`badge ${statusInfo.badge}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td>
                              {currentStatus === 0 && (
                                <>
                                  <button className="btn btn-sm btn-success mr-2" onClick={() => updateStatus(r.id, 1)}>Approve</button>
                                  <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r.id, 3)}>Reject</button>
                                </>
                              )}
                              {currentStatus === 1 && (
                                <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r.id, 2)}>Mark Paid</button>
                              )}
                              {(currentStatus === 2 || currentStatus === 3) && <span className="text-muted small">—</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== CREATE WITHDRAW MODAL ===== */}
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Withdraw Request</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <form onSubmit={submit}>
                  <div className="modal-body">
                    {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
                    <div className="form-group">
                      <label>Select Merchant *</label>
                      <select className="form-control" value={form.merchant_id} onChange={e => set('merchant_id', e.target.value)} required>
                        <option value="">-- Select Merchant --</option>
                        {merchants.map(m => (
                          <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (৳) *</label>
                      <input className="form-control" type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Method *</label>
                      <select className="form-control" value={form.method} onChange={e => set('method', e.target.value)} required>
                        <option value={0}>bKash</option>
                        <option value={1}>Nagad</option>
                        <option value={2}>Bank</option>
                      </select>
                    </div>
                    <div className="form-group mb-0">
                      <label>Account Number *</label>
                      <input className="form-control" value={form.account_number} onChange={e => set('account_number', e.target.value)} required placeholder="e.g. 01711111111" />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Submit Request'}
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