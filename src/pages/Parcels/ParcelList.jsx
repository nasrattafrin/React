import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

import StatusBadge from '../../components/StatusBadge';

export default function ParcelList() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status !== '') params.status = filters.status;

    API.get('/parcel/parcels.php', { params })
      .then(res => setParcels(res.data.parcels || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title mb-0">Parcels</h4>
                <Link to="/parcels/create" className="btn btn-primary btn-sm">
                  + New Parcel
                </Link>
              </div>

              <div className="row mb-3">
                <div className="col-md-8">
                  <input
                    className="form-control"
                    placeholder="Search tracking / phone / name"
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-control"
                    value={filters.status}
                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="">All status</option>
                    <option value="0">Pending</option>
                    <option value="1">Picked</option>
                    <option value="2">In Transit</option>
                    <option value="3">Delivered</option>
                    <option value="4">Cancelled</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <p className="text-muted">Loading...</p>
              ) : parcels.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">No parcels found.</p>
                  <Link to="/parcels/create" className="btn btn-primary btn-sm">
                    Create your first parcel
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tracking</th>
                        <th>Receiver</th>
                        <th>Zone</th>
                        <th>Charge</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcels.map(p => (
                        <tr key={p.id}>
                          <td>
                            <Link to={`/parcels/${p.id}`} className="text-primary font-monospace">
                              {p.tracking_id}
                            </Link>
                          </td>
                          <td>
                            <div>{p.receiver_name}</div>
                            <small className="text-muted">{p.receiver_phone}</small>
                          </td>
                          <td>{p.zone_name}</td>
                          <td>৳{p.delivery_charge}</td>
                          <td><StatusBadge status={p.status} /></td>
                          <td>
                            <small className="text-muted">
                              {new Date(p.created_at).toLocaleDateString()}
                            </small>
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
    </Layout>
  );
}