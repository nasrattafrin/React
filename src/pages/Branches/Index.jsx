import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function BranchesIndex() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('branches/index.php');

      if (res.data.status === true || res.data.status === 'true') {
        setBranches(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to load');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete branch "${name}"?`)) return;

    try {
      const res = await API.get(`branches/delete.php?id=${id}`);
      if (res.data.status === true || res.data.status === 'true') {
        fetchBranches();
      } else {
        alert(res.data.message || 'Delete failed');
      }
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };
  const filtered = branches.filter((b) => {
    const s = search.toLowerCase();
    return (
      b.branch_name?.toLowerCase().includes(s) ||
      b.address?.toLowerCase().includes(s) ||
      b.phone?.includes(search)
    );
  });

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">
          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Branches</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline mr-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Branches
                </li>
              </ol>
            </nav>
          </div>
          {/* Stats Cards Row */}
          <div className="row mb-4">
            {/* Total Branches */}
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card bg-gradient-primary text-white">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-white mb-1">Total Branches</p>
                      <h2 className="text-white mb-0">{branches.length}</h2>
                    </div>
                    <i
                      className="typcn typcn-office text-white" style={{ fontSize: '48px', opacity: 0.7 }} ></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Info */}
            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Active</p>
                      <h2 className="text-primary mb-0">
                        {filtered.length}
                      </h2>
                    </div>
                    <i
                      className="typcn typcn-tick text-primary" style={{ fontSize: '48px', opacity: 0.7 }}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1">Locations</p>
                      <h2 className="text-info mb-0">
                        {new Set(branches.map((b) => b.address?.split(',').pop()?.trim())).size}
                      </h2>
                    </div>
                    <i
                      className="typcn typcn-location-outline text-info"
                      style={{ fontSize: '48px', opacity: 0.7 }}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Main Card */}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-round">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="card-title mb-0">
                      <i className="typcn typcn-office text-primary mr-2"></i>
                      BRANCHES
                    </h4>
                    <Link to="/branches/create" className="btn btn-primary btn-round" >
                      <i className="typcn typcn-plus mr-1"></i>
                      Add Branch
                    </Link>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="input-icon">
                        <input  className="form-control" placeholder="Search by name, address, phone..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <span className="input-icon-addon">
                          <i className="typcn typcn-zoom"></i>
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6 text-right">
                      <button className="btn btn-light border" onClick={fetchBranches}  disabled={loading}>
                        <i className="typcn typcn-refresh mr-1"></i>
                        {loading ? 'Loading...' : 'Reload'}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && <div className="alert alert-danger">{error}</div>}

                  {/* Table */}
                  {loading ? (
                    <p className="text-center py-4">
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Loading branches...
                    </p>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-5">
                      <i
                        className="typcn typcn-office text-muted"
                        style={{ fontSize: '64px', opacity: 0.3 }}
                      ></i>
                      <p className="text-muted mt-3">
                        {branches.length === 0
                          ? 'No branches yet. Click "Add Branch" to create one.'
                          : 'No results match your search.'}
                      </p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th style={{ width: '200px' }}>Branch</th>
                            <th>Address</th>
                            <th style={{ width: '150px' }}>Phone</th>
                            <th style={{ width: '200px' }}>Actions</th>
                          </tr>
                        </thead>

                       <tbody>
                        {filtered.map((branch, index) => (
                            <tr key={branch.id}>
                            <td>
                                <span className="text-muted">
                                {String(index + 1).padStart(2, '0')}
                                </span>
                            </td>

                            <td>
                                <div className="d-flex align-items-start">
                                <i
                                    className="typcn typcn-location text-primary mr-2 mt-0.12"
                                    style={{ fontSize: '18px', flexShrink: 0 }}
                                ></i>
                                <div>
                                    <strong className="d-block">{branch.branch_name}</strong>
                                
                                </div>
                                </div>
                            </td>

                            <td>
                                <span className="d-flex align-items-center">
                                <i className="typcn typcn-location-outline text-muted mr-1"></i>
                                {branch.address || '—'}
                                </span>
                            </td>

                            <td>
                                <span className="d-flex align-items-center">
                                <i className="typcn typcn-phone text-muted mr-1"></i>
                                {branch.phone || '—'}
                                </span>
                            </td>

                            <td>
                                <div className="d-flex">
                                <Link
                                    to={`/branches/edit/${branch.id}`} className="btn btn-primary btn-sm mr-2" >
                                    <i className="typcn typcn-edit"></i> Edit
                                </Link>
                                <button  className="btn btn-danger btn-sm" onClick={() => handleDelete(branch.id, branch.branch_name)}>
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
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <p className="text-muted mb-0 small">
                        Showing <strong>{filtered.length}</strong> of{' '}
                        <strong>{branches.length}</strong> branches
                      </p>
                      <p className="text-muted mb-0 small">
                        <i className="typcn typcn-time mr-1"></i>
                        Last updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
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

export default BranchesIndex;