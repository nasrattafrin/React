import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function WalletsList() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/wallets/index.php')
      .then(res => setWallets(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Merchant Wallets</h4>
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
    </Layout>
  );
}