import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

const STATUS = {
  0: { label: 'Collected', badge: 'bg-warning text-dark', icon: 'typcn-archive', step: 1 },
  1: { label: 'Received', badge: 'bg-info text-white', icon: 'typcn-tick', step: 2 },
  2: { label: 'Settled', badge: 'bg-success text-white', icon: 'typcn-tick-outline', step: 3 },
};
export default function CodSettlementsList() {
  const [settlements, setSettlements] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    deliveryman_id: '',
    status: '',
    search: '',
  });
  const load = () => {
    setLoading(true);
    const params = {};
    if (filters.deliveryman_id !== '') params.deliveryman_id = filters.deliveryman_id;
    if (filters.status !== '') params.status = filters.status;
    if (filters.search) params.search = filters.search;

    API.get('/cod_settlements/index.php', { params })
      .then(
        res=>{setSettlements(res.data.settlements || res.data.data || []); setTotals(res.data.totals || [])}
      )
      .catch(err=>alert(err.response?.data?.message || err.message))
      .finally(()=>setLoading(false));
  };

  useEffect(() => {
    load();
    API.get('/deliverymen/index.php')
      .then(res => setDeliverymen(res.data.deliverymen || res.data.data || []))
      .catch(() => {});
  }, [filters]);

  const updateStatus = async (id, newStatus) => {
    const labels = { 1: 'Received', 2: 'Settled' };
    if (!window.confirm(`Mark this as "${labels[newStatus]}"?`)) return;
    try {
      await API.put(
        '/cod_settlements/single.php',
        { id, status: newStatus },
        { headers: { 'Content-Type': 'application/json' } }
      );
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this settlement?')) return;
    try {
      await API.delete(`/cod_settlements/delete.php?id=${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

//   const totals = settlements.reduce(
//     (acc, s) => {
//       acc.cod += Number(s.cod_amount || 0);
//       acc.service += Number(s.service_charge || 0);
//       acc.net += Number(s.net_amount || 0);
//       if (Number(s.status) === 0) acc.collected += 1;
//       if (Number(s.status) === 1) acc.received += 1;
//       if (Number(s.status) === 2) acc.settled += 1;
//       return acc;
//     },
//     { cod: 0, service: 0, net: 0, collected: 0, received: 0, settled: 0 }
//   );

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="card-title mb-1">COD Settlements</h4>
                  <p className="text-muted small mb-0">
                    Track COD collected by deliverymen and settled to merchants
                  </p>
                </div>
              </div>

              {/* ===== STAT CARDS ===== */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card border-left border-warning h-100">
                    <div className="card-body py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted text-uppercase">Total COD</small>
                          <h3 className="mb-0 mt-1">৳{totals?.total_cod_amount}</h3>
                        </div>
                        <i className="typcn typcn-wallet text-warning" style={{ fontSize: 40 }}></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-left border-danger h-100">
                    <div className="card-body py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted text-uppercase">Service Charge</small>
                          <h3 className="mb-0 mt-1 text-danger">৳{totals?.total_delivery_charge}</h3>
                        </div>
                        <i className="typcn typcn-scissors text-danger" style={{ fontSize: 40 }}></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-left border-success h-100">
                    <div className="card-body py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted text-uppercase">Net (Merchant)</small>
                          <h3 className="mb-0 mt-1 text-success">৳{totals?.total_cod_amount - totals?.total_delivery_charge || 0}</h3>
                        </div>
                        <i className="typcn typcn-user text-success" style={{ fontSize: 40 }}></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-left border-primary h-100">
                    <div className="card-body py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted text-uppercase">Pending / Done</small>
                          <h3 className="mb-0 mt-1 text-primary">
                            {totals?.status_0 || 0} / {totals?.status_3 || 0}
                          </h3>
                        </div>
                        <i className="typcn typcn-chart-bar text-primary" style={{ fontSize: 40 }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card bg-light border-0 mb-4">
                <div className="card-body py-3">
                  <div className="row align-items-end">
                    <div className="col-md-3 mb-2 mb-md-0">
                      <label className="small text-muted mb-1">Deliveryman</label>
                      <select
                        className="form-control form-control-sm"
                        value={filters.deliveryman_id}
                        onChange={e => setFilters(f => ({ ...f, deliveryman_id: e.target.value }))}
                      >
                        <option value="">All deliverymen</option>
                        {deliverymen.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3 mb-2 mb-md-0">
                      <label className="small text-muted mb-1">Status</label>
                      <select
                        className="form-control form-control-sm"
                        value={filters.status}
                        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} >
                        <option value="">All status</option>
                        <option value="0">Collected</option>
                        <option value="1">Received</option>
                        <option value="2">Settled</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small text-muted mb-1">Search</label>
                      <input
                        className="form-control form-control-sm"
                        placeholder="Search tracking / name..."
                        value={filters.search}
                        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="text-muted mt-3 mb-0">Loading settlements...</p>
                </div>
              ) : settlements.length === 0 ? (
                <div className="text-center py-5">
                  <i className="typcn typcn-document text-muted" style={{ fontSize: 64 }}></i>
                  <p className="text-muted mt-3 mb-0">No COD settlements found.</p>
                </div>
              ) : (
                <div className="row">
                  {settlements.map(s => {
                    const st = Number(s.status);
                    const info = STATUS[st] || STATUS[0];
                    const isCollected = st === 0;
                    const isReceived = st === 1;
                    const isSettled = st === 2;
                    return (
                      <div key={s.id} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100 shadow-sm border-0">
                          {/* Card Header */}
                          <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <Link
                              to={`/parcels/${s.parcel_id}`}
                              className="font-monospace text-primary small"
                            >
                              {s.tracking_id}
                            </Link>
                            <span className={`badge ${info.badge}`}>
                              <i className={`typcn ${info.icon} mr-1`}></i>
                              {info.label}
                            </span>
                          </div>

                          {/* Card Body */}
                          <div className="card-body py-3">
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mr-2"
                                style={{ width: 36, height: 36, fontSize: 14, fontWeight: 600 }}
                              >
                                {s.deliveryman_name?.charAt(0) || '?'}
                              </div>
                              <div className="small">
                                <div className="font-weight-bold">{s.deliveryman_name}</div>
                                <div className="text-muted">Deliveryman</div>
                              </div>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mr-2"
                                style={{ width: 36, height: 36, fontSize: 14, fontWeight: 600 }}
                              >
                                {s.merchant_name?.charAt(0) || '?'}
                              </div>
                              <div className="small">
                                <div className="font-weight-bold">{s.merchant_name}</div>
                                <div className="text-muted">Merchant</div>
                              </div>
                            </div>

                            <hr className="my-2" />
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted">COD Amount</span>
                              <strong>৳{Number(s.cod_amount).toFixed(2)}</strong>
                            </div>
                            <div className="d-flex justify-content-between small mb-1">
                              <span className="text-muted">Service Charge</span>
                              <span className="text-danger">− ৳{Number(s.service_charge).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between small border-top pt-2 mt-2">
                              <span className="text-muted">Net Payout</span>
                              <strong className="text-success">৳{Number(s.net_amount).toFixed(2)}</strong>
                            </div>
                            <div className="mt-3">
                              <div className="d-flex justify-content-between small text-muted mb-1">
                                <span>Progress</span>
                                <span>{info.step}/3</span>
                              </div>
                              <div className="progress" style={{ height: 6 }}>
                                <div
                                  className={`progress-bar ${st === 0 ? 'bg-warning' : st === 1 ? 'bg-info' : 'bg-success'}`}
                                  style={{ width: `${(info.step / 3) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer — Actions */}
                          <div className="card-footer bg-white d-flex gap-2">
                            {isCollected && (
                              <button
                                className="btn btn-info btn-sm flex-fill"
                                onClick={() => updateStatus(s.id, 1)}
                              >
                                <i className="typcn typcn-tick mr-1"></i> Mark Received
                              </button>
                            )}
                            {isReceived && (
                              <button
                                className="btn btn-success btn-sm flex-fill"
                                onClick={() => updateStatus(s.id, 2)}
                              >
                                <i className="typcn typcn-tick-outline mr-1"></i> Settle
                              </button>
                            )}
                            {isSettled && (
                              <button className="btn btn-light btn-sm flex-fill" disabled>
                                <i className="typcn typcn-tick mr-1"></i> Completed
                              </button>
                            )}
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => remove(s.id)}
                              title="Delete"  >
                              <i className="typcn typcn-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}