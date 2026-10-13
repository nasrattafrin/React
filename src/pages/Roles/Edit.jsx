{/*import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function RolesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState({ role_name: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ========== Load Single Role ==========
  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const res = await API.get(`roles/single.php?id=${id}`);
        console.log('Single Response:', res.data);

        if (res.data.status === true && res.data.data?.length > 0) {
          setRole(res.data.data[0]);
        } else {
          setMessage('Role not found');
          setMessageType('error');
        }
      } catch (err) {
        console.error(err);
        setMessage('Failed to load role');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRole();
  }, [id]);

  // ========== Handle Change ==========
  const handleChange = (e) => {
    setRole({ ...role, role_name: e.target.value });
  };

  // ========== Handle Submit ==========
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const formData = new FormData(e.target);

    try {
      const res = await API.post(`roles/update.php?id=${id}`, formData);
      console.log('Update Response:', res.data);

      if (res.data.status === true) {
        setMessage('Role updated successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/roles'), 1200);
      } else {
        setMessage(res.data.message || 'Update failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      setMessage(error?.response?.data?.message || error.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="page-inner">
            <p className="text-center py-5">Loading role...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">*/}

          {/* Page Header 
          <div className="page-header">
            <h3 className="fw-bold mb-3">Edit Role</h3>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline mr-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/roles">Roles</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit
                </li>
              </ol>
            </nav>
          </div>*/}

          {/* Message 
          {message && (
            <div
              className={`alert ${
                messageType === 'success' ? 'alert-success' : 'alert-danger'
              } alert-dismissible fade show`}
              role="alert"
            >
              <i
                className={`typcn ${
                  messageType === 'success'
                    ? 'typcn-tick'
                    : 'typcn-warning-outline'
                } mr-2`}
              ></i>
              {message}
            </div>
          )}*/}

          {/* Card 
          <div className="row">
            <div className="col-md-8">
              <div className="card card-round">
                <div className="card-body">

                  <h5 className="fw-bold mb-3">Update Role Information</h5>
                  <hr />

                  <form onSubmit={handleSubmit}>*/}

                    {/* Role Name 
                    <div className="form-group">
                      <label htmlFor="role_name" className="fw-bold">
                        Role Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="role_name"
                        className="form-control"
                        id="role_name"
                        value={role.role_name || ''}
                        onChange={handleChange}
                        placeholder="Enter role name"
                        required
                      />
                    </div>*/}

                    {/* Buttons 
                    <div className="mt-4 pt-3 border-top">
                      <button
                        type="submit"
                        className="btn btn-primary mr-2"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="typcn typcn-edit mr-1"></i>
                            Update Role
                          </>
                        )}
                      </button>

                      <Link to="/roles" className="btn btn-light border">
                        <i className="typcn typcn-arrow-left mr-1"></i>
                        Cancel
                      </Link>
                    </div>

                  </form>

                </div>
              </div>
            </div>*/}

            {/* Side Info 
            <div className="col-md-4">
              <div className="card card-round">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="typcn typcn-info-large-outline text-primary mr-2"></i>
                    Role Info
                  </h6>

                  <div className="mb-2">
                    <small className="text-muted d-block">ID</small>
                    <strong>#{role.id}</strong>
                  </div>

                  <div className="mb-2">
                    <small className="text-muted d-block">Created</small>
                    <strong>{role.created_at || '—'}</strong>
                  </div>

                  <div className="mb-0">
                    <small className="text-muted d-block">Updated</small>
                    <strong>{role.updated_at || '—'}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

export default RolesEdit;*/}