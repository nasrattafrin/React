import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function RolesIndex() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await API.get('roles/index.php');

      if (res.data.status === true || res.data.status === 'true') {
        setRoles(res.data.data || []);
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
    fetchRoles();
  }, []);

  /*
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete role "${name}"?`)) return;
    try {
      const res = await API.get(`roles/delete.php?id=${id}`);
      if (res.data.status === true || res.data.status === 'true') {
        fetchRoles();
      } else {
        alert(res.data.message || 'Delete failed');
      }
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };
  */

  const filtered = roles.filter((r) =>
    r.role_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Roles</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline mr-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Roles
                </li>
              </ol>
            </nav>
          </div>

          {/* Card */}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-round">

                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="card-title mb-0">ROLES</h4>

                    {/* <Link
                      to="/roles/create"
                      className="btn btn-primary btn-round"
                    >
                      <i className="typcn typcn-plus mr-1"></i>
                      Add Role
                    </Link> */}
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <div className="input-icon">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search role..."
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
                        onClick={fetchRoles}
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
                    <p className="text-center py-4">Loading...</p> ) : filtered.length === 0 ? (
                    <p className="text-center text-muted py-4"> {roles.length === 0 ? 'No roles found.': 'No results match your search.'}
                    </p>) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th>Role Name</th>
                            <th>Created</th>
                            {/* <th style={{ width: '200px' }}>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((role, index) => (
                            <tr key={role.id}>
                              <td>{index + 1}</td>
                              <td>
                                <strong>{role.role_name}</strong>
                              </td>
                              <td>
                                <span className="text-muted small">
                                  {role.created_at || '—'}
                                </span>
                              </td>
                              {/* <td>
                                <div className="d-flex">
                                  <Link
                                    to={`/roles/edit/${role.id}`}
                                    className="btn btn-primary btn-sm mr-2"
                                  >
                                    <i className="typcn typcn-edit"></i> Edit
                                  </Link>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      handleDelete(role.id, role.role_name)
                                    }
                                  >
                                    <i className="typcn typcn-delete-outline"></i> Delete
                                  </button>
                                </div>
                              </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {!loading && filtered.length > 0 && (
                    <p className="text-muted mt-3 mb-0 small">
                      Showing {filtered.length} of {roles.length} roles
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

export default RolesIndex;