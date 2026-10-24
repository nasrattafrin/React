import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import API from '../Lib/axios.js';
import Layout from "./Layout.jsx";
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get('/dashboard/stats.php')
      .then(res => {
        if (res.data.status) {
          setData(res.data.data);
        }
      })
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Layout><p className="text-muted p-5">Loading Dashboard...</p></Layout>;
  if (!data) return <Layout><p className="text-danger p-5">Failed to load data.</p></Layout>;

  const { kpi, chart_data, recent_parcels, revenue_trend, top_deliverymen } = data;
  return (
    <Layout>
      <div className="row">
        <div className="col-12 mb-4">
          <h4 className="card-title mb-1">Dashboard Overview</h4>
          <p className="text-muted small mb-0">Welcome back! Here is what's happening today.</p>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card border-left border-primary">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase">Total Parcels</p>
                  <h3 className="mb-0">{kpi.total_parcels}</h3>
                </div>
                <i className="typcn typcn-box text-primary" style={{ fontSize: 40 }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card border-left border-success">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase">Total Revenue</p>
                  <h3 className="mb-0">৳{Number(kpi.total_revenue).toFixed(0)}</h3>
                </div>
                <i className="typcn typcn-chart-line text-success" style={{ fontSize: 40 }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card border-left border-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase">Pending Deliveries</p>
                  <h3 className="mb-0">{kpi.pending_parcels}</h3>
                </div>
                <i className="typcn typcn-time text-warning" style={{ fontSize: 40 }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card border-left border-info">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small text-uppercase">Total Merchants</p>
                  <h3 className="mb-0">{kpi.total_merchants}</h3>
                </div>
                <i className="typcn typcn-user text-info" style={{ fontSize: 40 }}></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Revenue Trend (Last 7 Days)</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={revenue_trend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `৳${value}`} />
                    <Line type="monotone" dataKey="amount" stroke="#28a745" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Parcel Status Overview</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chart_data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {chart_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Top Deliverymen</h4>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={top_deliverymen} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="total_delivered" fill="#17a2b8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title mb-0">Recent Parcels</h4>
                <Link to="/parcels" className="text-primary small">View All</Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th>Tracking ID</th>
                      <th>Receiver</th>
                      <th>Zone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent_parcels.map(p => (
                      <tr key={p.id}>
                        <td>
                          <Link to={`/parcels/${p.id}`} className="text-primary font-monospace">
                            {p.tracking_id}
                          </Link>
                        </td>
                        <td>{p.receiver_name}</td>
                        <td>{p.zone_name}</td>
                        <td><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                    {recent_parcels.length === 0 && (
                      <tr><td colSpan="4" className="text-center text-muted py-3">No recent parcels</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}