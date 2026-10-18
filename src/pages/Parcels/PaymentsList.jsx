import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
const METHODS = [
  { value: '', label: 'All methods' },
  { value: 0, label: 'bKash' },
  { value: 1, label: 'Nagad' },
  { value: 2, label: 'Card' },
  { value: 3, label: 'COD' },
];
const STATUSES = [
  { value: '', label: 'All status' },
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Success' },
  { value: 2, label: 'Failed' },
];
const METHOD_BADGE = { 0: 'bg-info', 1: 'bg-warning text-dark', 2: 'bg-primary', 3: 'bg-secondary' };
const STATUS_BADGE = { 0: 'bg-warning text-dark', 1: 'bg-success', 2: 'bg-danger' };
export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ method: '', status: '', search: '' });
  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.method !== '') params.method = filters.method;
    if (filters.status !== '') params.status = filters.status;
    if (filters.search) params.search = filters.search;
    API.get('/payments/index.php', { params })
      .then(res => setPayments(res.data.payments || res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, [filters]);
  const totals = payments.reduce(
    (acc, p) => {
      if (Number(p.status) === 1) acc.success += Number(p.amount);
      if (Number(p.status) === 0) acc.pending += Number(p.amount);
      if (Number(p.status) === 2) acc.failed += Number(p.amount);
      return acc;
    },
    { success: 0, pending: 0, failed: 0 }
  );
  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Payments</h4>
              <div className="row mb-4">
                <div className="col-md-4 mb-2">
                  <div className="bg-success text-white p-3 rounded">
                    <small className="d-block">Success</small>
                    <strong className="h4 mb-0">৳{totals.success.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="bg-warning text-dark p-3 rounded">
                    <small className="d-block">Pending</small>
                    <strong className="h4 mb-0">৳{totals.pending.toFixed(2)}</strong>
                  </div>
                </div>
                <div className="col-md-4 mb-2">
                  <div className="bg-danger text-white p-3 rounded">
                    <small className="d-block">Failed</small>
                    <strong className="h4 mb-0">৳{totals.failed.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3">
                  <select className="form-control" value={filters.method}
                    onChange={e => setFilters(f => ({ ...f, method: e.target.value }))}>
                    {METHODS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>))}
                  </select>
                </div>
                <div className="col-md-3">
                  <select className="form-control" value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                    {STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>))}
                  </select>
                </div>
                <div className="col-md-6">
                  <input className="form-control" placeholder="Search tracking / trx ID"
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
                </div>
              </div>
              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : payments.length === 0 ? (
                <p className="text-muted text-center py-4">No payments found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Tracking</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Trx ID</th>
                        <th>Status</th>
                        <th>Recorded by</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map(p => (
                        <tr key={p.id}>
                          <td>
                            <small>{new Date(p.created_at).toLocaleString()}</small>
                          </td>
                          <td>
                            <Link to={`/parcels/${p.parcel_id}`} className="text-primary font-monospace">
                              {p.tracking_id}
                            </Link>
                          </td>
                          <td>৳{p.amount}</td>
                          <td>
                            <span className={`badge ${METHOD_BADGE[Number(p.method)] || 'bg-secondary'}`}>
                              {p.method_label}
                            </span>
                          </td>
                          <td><small className="font-monospace">{p.transaction_id || '—'}</small></td>
                          <td>
                            <span className={`badge ${STATUS_BADGE[Number(p.status)] || 'bg-secondary'}`}>
                              {p.status_label}
                            </span>
                          </td>
                          <td><small className="text-muted">{p.created_by_name || '—'}</small></td>
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
    </Layout>
  );
}