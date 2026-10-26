import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";
export default function WalletTransactions() {
  const { id } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get(`/wallets/transactions.php?wallet_id=${id}`)
      .then(res => setTransactions(res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);
  return (
    <Layout>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <Link to="/wallets" className="btn btn-light btn-sm mr-3">
                  <i className="typcn typcn-arrow-left"></i> Back
                </Link>
                <h4 className="card-title mb-0">Wallet Statement (History)</h4>
              </div>
              {loading ? <p>Loading...</p> : transactions.length === 0 ? <p>No transactions found.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Reference</th>
                        <th>Description</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id}>
                          <td>{new Date(t.created_at).toLocaleString()}</td>
                          <td>
                            {Number(t.type) === 0 ? (
                              <span className="badge bg-success text-white">Credit (In)</span>
                            ) : (
                              <span className="badge bg-danger text-white">Debit (Out)</span>
                            )}
                          </td>
                          <td><small className="font-monospace">{t.reference}</small></td>
                          <td>{t.description}</td>
                          <td className={`font-weight-bold ${Number(t.type) === 0 ? 'text-success' : 'text-danger'}`}>
                            {Number(t.type) === 0 ? '+' : '-'} ৳{t.amount}
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