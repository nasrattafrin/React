import { useState } from 'react';
import API from '../../Lib/axios.js';
import Layout from "../Layout.jsx";

import ParcelTimeline from '../../components/ParcelTimeline';

export default function TrackParcel() {
  const [tracking, setTracking] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const search = async (e) => {
    e.preventDefault();
    setError(''); setData(null); setLoading(true);
    try {
      const res = await API.get(
        `/parcel/parcel_track.php?tracking_id=${encodeURIComponent(tracking.trim())}`
      );
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="row">
        <div className="col-lg-8 mx-auto grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Track Your Parcel</h4>

              <form onSubmit={search} className="d-flex mb-4">
                <input
                  className="form-control mr-2 font-monospace"
                  placeholder="Enter tracking ID (e.g. TRK-20261017-A3F9)"
                  value={tracking}
                  onChange={e => setTracking(e.target.value)} />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '...' : 'Track'}
                </button>
              </form>

              {error && <div className="alert alert-danger">{error}</div>}

              {data && (
                <div>
                  <div className="mb-3">
                    <small className="text-muted">Tracking ID</small>
                    <h5 className="font-monospace mb-0">{data.parcel.tracking_id}</h5>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">To</small>
                      <p className="mb-0">{data.parcel.receiver_name}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Zone</small>
                      <p className="mb-0">{data.parcel.zone_name}</p>
                    </div>
                    <div className="col-12 mb-2">
                      <small className="text-muted">Address</small>
                      <p className="mb-0">{data.parcel.delivery_address}</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Weight</small>
                      <p className="mb-0">{data.parcel.weight} kg</p>
                    </div>
                    <div className="col-md-6 mb-2">
                      <small className="text-muted">Charge</small>
                      <p className="mb-0">৳{data.parcel.delivery_charge}</p>
                    </div>
                  </div>
                  <hr />
                  <h5 className="mb-3">Timeline</h5>
                  <ParcelTimeline logs={data.logs} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}