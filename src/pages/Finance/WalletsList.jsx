import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
export default function WalletsList() {
  const [wallets, setWallets] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ merchant_id: '', amount: '' });
  const load = () => {
    setLoading(true);
    API.get('/wallets/index.php')
      .then(res => setWallets(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    API.get('/users/merchants.php')
      .then(res => setMerchants(res.data.merchants || [])) 
      .catch(() => {});
  }, []);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await API.post('/wallets/add_balance.php', {
        merchant_id: Number(form.merchant_id),
        amount: Number(form.amount)
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setShowModal(false);
      setForm({ merchant_id: '', amount: '' });
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
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Merchant Wallets</h4>
                <button className="btn btn-success btn-sm" onClick={() => setShowModal(true)}>
                  + Add Balance
                </button>
              </div>
              {loading ? <p>Loading...</p> : wallets.length === 0 ? <p>No wallets found.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Merchant Name</th>
                        <th>Contact</th>
                        <th>Current Balance</th>
                        <th>Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map(w => (
                        <tr key={w.id}>
                          <td>{w.merchant_name}</td>
                          <td>{w.contact_no || '—'}</td>
                          <td className="text-success font-weight-bold">৳{w.balance}</td>
                          <td>{new Date(w.updated_at || w.created_at).toLocaleString()}</td>
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
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Wallet Balance</h5>
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
                    <div className="form-group mb-0">
                      <label>Amount (৳) *</label>
                      <input className="form-control" type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                      {submitting ? 'Adding...' : 'Add Balance'}
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