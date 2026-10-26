import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

export default function WalletsList() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const roleId = Number(localStorage.getItem('role_id'));
  const isMerchant = roleId === 2;
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
              <h4 className="card-title mb-4">
                {isMerchant ? 'My Wallet Balance' : 'Merchant Wallets'}
              </h4>
              
              {loading ? (
                <p>Loading...</p>
              ) : wallets.length === 0 ? (
                <p>No wallet found for this account.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        {!isMerchant && <th>Merchant Name</th>}
                        {!isMerchant && <th>Contact</th>}
                        <th>Current Balance</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map(w => (
                        <tr key={w.id}>
                          {!isMerchant && <td>{w.merchant_name}</td>}
                          {!isMerchant && <td>{w.contact_no || '—'}</td>}
                          <td className="text-success font-weight-bold h5">
                            ৳{w.balance}
                          </td>
                          <td className="text-center">
                            <Link to={`/wallets/${w.id}/transactions`} className="btn btn-sm btn-info">
                              <i className="typcn typcn-document-text"></i> Statement
                            </Link>
                            
                            {isMerchant && (
                              <Link to="/withdraw-requests" className="btn btn-sm btn-primary ml-2">
                                <i className="typcn typcn-export"></i> Withdraw
                              </Link>
                            )}
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