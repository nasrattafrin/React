import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

const METHODS = { 0: 'bKash', 1: 'Nagad', 2: 'Bank' };
const STATUS = {
  0: { label: 'Pending', badge: 'bg-warning text-dark' },
  1: { label: 'Approved', badge: 'bg-info text-white' },
  2: { label: 'Paid', badge: 'bg-success text-white' },
  3: { label: 'Rejected', badge: 'bg-danger text-white' },
};

export default function WithdrawList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get('/withdraw_requests/index.php')
      .then(res => setRequests(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

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

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Withdraw Requests</h4>
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
                        // Type conversion (String theke Number e convert kora holo)
                        const currentStatus = Number(r.status);
                        const statusInfo = STATUS[currentStatus] || STATUS[0];

                        return (
                          <tr key={r.id}>
                            <td>{new Date(r.requested_at).toLocaleString()}</td>
                            <td>{r.merchant_name}</td>
                            <td className="font-weight-bold">৳{r.amount}</td>
                            <td>{METHODS[r.method] || 'bKash'} <br/><small>{r.account_number}</small></td>
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
    </Layout>
  );
}