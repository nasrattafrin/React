import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleId = Number(localStorage.getItem('role_id'));
  const isMerchant = roleId === 2;

  useEffect(() => {
  
    API.get('/notifications/index.php')
      .then(res => setNotifications(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
    API.post('/notifications/read.php', {}, {
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});

  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">
                {isMerchant ? 'My Notifications' : 'System Notifications Log'}
              </h4>

              {loading ? <p>Loading...</p> : notifications.length === 0 ? <p>No notifications found.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        {!isMerchant && <th>Receiver</th>}
                        <th>Type</th>
                        <th>Message</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map(n => (
                        <tr key={n.id}>
                          <td>{new Date(n.created_at).toLocaleString()}</td>
                          {!isMerchant && (
                            <td>
                              {n.user_name} <br/>
                              <small className="text-muted">{Number(n.role_id) === 2 ? 'Merchant' : 'User'}</small>
                            </td>
                          )}
                          <td>
                            {Number(n.type) === 0 
                              ? <span className="badge bg-info text-white">SMS</span> 
                              : <span className="badge bg-primary text-white">Email</span>}
                          </td>
                          <td>{n.message}</td>
                          <td>
                            {Number(n.status) === 0 
                              ? <span className="badge bg-success text-white">Sent</span> 
                              : <span className="badge bg-danger text-white">Failed</span>}
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