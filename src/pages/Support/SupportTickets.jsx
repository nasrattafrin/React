import { useEffect, useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

const STATUS = {
  0: { label: 'Open', badge: 'bg-danger text-white' },
  1: { label: 'In Progress', badge: 'bg-warning text-dark' },
  2: { label: 'Closed', badge: 'bg-success text-white' },
};
export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const roleId = Number(localStorage.getItem('role_id'));
  const isMerchant = roleId === 2;
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [status, setStatus] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const load = () => {
    setLoading(true);
    API.get('/support_tickets/index.php')
      .then(res => setTickets(res.data.tickets || res.data.data || []))
      .catch(err => alert(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openReplyModal = (ticket) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.admin_reply || '');
    setStatus(Number(ticket.status));
    setShowModal(true);
  };
  const submitReply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/support_tickets/single.php', {
        id: selectedTicket.id,
        admin_reply: replyText,
        status: status
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
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
                <h4 className="card-title mb-0">
                  {isMerchant ? 'My Support Tickets' : 'All Support Tickets'}
                </h4>
                {isMerchant && (
                  <a href="/support/create" className="btn btn-primary btn-sm">
                    + Raise New Ticket
                  </a>
                )}
              </div>

              {loading ? <p>Loading...</p> : tickets.length === 0 ? <p>No tickets found.</p> : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        {!isMerchant && <th>Merchant</th>}
                        <th>Subject</th>
                        <th>Parcel</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(t => {
                        const currentStatus = Number(t.status);
                        const statusInfo = STATUS[currentStatus] || STATUS[0];

                        return (
                          <tr key={t.id}>
                            <td>{new Date(t.created_at).toLocaleString()}</td>
                            {!isMerchant && <td>{t.merchant_name}</td>}
                            <td>{t.subject}</td>
                            <td>{t.tracking_id || '—'}</td>
                            <td><span className={`badge ${statusInfo.badge}`}>{statusInfo.label}</span></td>
                            <td>
                              {isMerchant ? (
                                <span className="text-muted small">View Only</span>
                              ) : (
                                <button className="btn btn-sm btn-info" onClick={() => openReplyModal(t)}>
                                  Reply / View
                                </button>
                              )}
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

      {/* Admin Reply Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop show" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block" style={{ zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Ticket: {selectedTicket.subject}</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>
                    <span>&times;</span>
                  </button>
                </div>
                <form onSubmit={submitReply}>
                  <div className="modal-body">
                    <div className="bg-light p-3 rounded mb-3">
                      <strong>Message:</strong>
                      <p className="mb-0 mt-1">{selectedTicket.message}</p>
                    </div>
                    
                    <div className="form-group">
                      <label>Reply Message</label>
                      <textarea className="form-control" rows="4" value={replyText} onChange={e => setReplyText(e.target.value)} required></textarea>
                    </div>
                    <div className="form-group mb-0">
                      <label>Status</label>
                      <select className="form-control" value={status} onChange={e => setStatus(e.target.value)}>
                        <option value={0}>Open</option>
                        <option value={1}>In Progress</option>
                        <option value={2}>Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Close</button>
                    <button type="submit" className="btn btn-success" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Submit Reply'}
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