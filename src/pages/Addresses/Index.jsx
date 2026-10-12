import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function Addresses() {
  
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError('');
      let res = await API.get('addresses/index.php');
      console.log('API Response:', res.data);
      if (res.data.status === true || res.data.status === 'true') {
        setAddresses(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAddresses();
  }, []);

 
  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;

    try {
      let res = await API.delete(`addresses/delete.php?id=${id}`);

      if (res.data.status === true || res.data.status === 'true') {
        fetchAddresses();
      } else {
        alert(res.data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err?.response?.data?.message || err.message);
    }
  }


  const filtered = addresses.filter((a) => {
    const s = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(s) ||
      a.phone?.includes(search) ||
      a.address?.toLowerCase().includes(s)
    );
  });

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Addresses</h3>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline mr-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Addresses
                </li>
              </ol>
            </nav>
          </div>

          {/* Table Card */}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-round">

                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="card-title mb-0">ADDRESSES</h4>

                    <Link
                      to="/addresses/create"
                      className="btn btn-primary btn-round"
                    >
                      <i className="typcn typcn-plus mr-1"></i>
                      Add Address
                    </Link>
                  </div>
                </div>

                <div className="card-body">

                  {/* Search */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="input-icon">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name, phone, address..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="input-icon-addon">
                          <i className="typcn typcn-zoom"></i>
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 text-right">
                      <button
                        className="btn btn-light border"
                        onClick={fetchAddresses}
                        disabled={loading}
                      >
                        <i className="typcn typcn-refresh mr-1"></i>
                        {loading ? 'Loading...' : 'Reload'}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && <div className="alert alert-danger">{error}</div>}

                  {/* Table */}
                  {loading ? (
                    <p className="text-center py-4">Loading...</p>
                  ) : filtered.length === 0 ? (
                    <p className="text-center text-muted py-4">
                      {addresses.length === 0
                        ? 'No addresses yet. Click "Add Address" to create one.'
                        : 'No results match your search.'}
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Image</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filtered.map((address, index) => (
                            <tr key={address.id}>
                              <td>{index + 1}</td>

                              <td>
                                <strong>{address.name}</strong>
                              </td>

                              <td>{address.phone}</td>

                              <td>
                                {address.image ? (
                                  <img
                                    src={`${import.meta.env.VITE_API_URL}${address.image}`}
                                    alt={address.name}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      objectFit: 'cover',
                                      borderRadius: '6px',
                                      border: '1px solid #e4e4f4',
                                    }}
                                  />
                                ) : (
                                  <span className="text-muted small">No image</span>
                                )}
                              </td>

                              <td>
                                <div className="d-flex">
                                  <Link
                                    to={`/addresses/edit/${address.id}`}
                                    className="btn btn-primary btn-sm mr-2"
                                  >
                                    <i className="typcn typcn-edit"></i> Edit
                                  </Link>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(address.id, address.name)}
                                  >
                                    <i className="typcn typcn-delete-outline"></i> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Counter */}
                  {!loading && filtered.length > 0 && (
                    <p className="text-muted mt-3 mb-0 small">
                      Showing {filtered.length} of {addresses.length} addresses
                    </p>
                  )}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default Addresses;