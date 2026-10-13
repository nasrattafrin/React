import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function BranchesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [branch, setBranch] = useState({
    branch_name: '',
    address: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        setLoading(true);
        const res = await API.get(`branches/single.php?id=${id}`);

        if (res.data.status === true && res.data.data?.length > 0) {
          setBranch(res.data.data[0]);
        } else {
          setMessage('Branch not found');
          setMessageType('error');
        }
      } catch (err) {
        setMessage('Failed to load branch');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBranch();
  }, [id]);

  const handleChange = (e) => {
    setBranch({ ...branch, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    const formData = new FormData(e.target);
    try {
      const res = await API.post(`branches/update.php?id=${id}`, formData);

      if (res.data.status === true) {
        setMessage('Branch updated successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/branches'), 1200);
      } else {
        setMessage(res.data.message || 'Update failed');
        setMessageType('error');
      }
    } catch (error) {
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
            <p className="text-center py-5">
              <span className="spinner-border spinner-border-sm mr-2"></span>
              Loading branch...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Edit Branch</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline mr-1"></i>
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/branches">Branches</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit
                </li>
              </ol>
            </nav>
          </div>
          {/* Message */}
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
          )}
          <div className="row">
            <div className="col-md-8">
              <div className="card card-round">
                <div className="card-body">
                  {/* Card Header */}
                  <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                    <div
                      className="d-flex align-items-center justify-content-center mr-3"
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '10px',
                        background:'linear-gradient(135deg, #844fc1 0%, #a86dd9 100%)', color: '#fff',}}  >
                      <i className="typcn typcn-edit" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Update Branch Information</h5>
                      <small className="text-muted">
                        Editing branch ID: #{branch.id}
                      </small>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>

                    {/* Branch Name */}
                    <div className="form-group">
                      <label htmlFor="branch_name" className="fw-bold">
                        Branch Name <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="typcn typcn-office text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"  name="branch_name"  className="form-control"  id="branch_name"  value={branch.branch_name || ''} onChange={handleChange}
                          placeholder="Enter branch name"
                          required/>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-group">
                      <label htmlFor="address" className="fw-bold">
                        Address
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="typcn typcn-location text-primary"></i>
                          </span>
                        </div>
                        <textarea
                          name="address"  className="form-control" id="address"value={branch.address || ''} onChange={handleChange} placeholder="Enter full address"
                          rows="3" >
                          </textarea>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="phone" className="fw-bold">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <i className="typcn typcn-phone text-primary"></i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          id="phone"
                          value={branch.phone || ''}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>

                    {/* Buttons */}
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
                            Update Branch
                          </>
                        )}
                      </button>

                      <Link to="/branches" className="btn btn-light border">
                        <i className="typcn typcn-arrow-left mr-1"></i>
                        Cancel
                      </Link>
                    </div>

                  </form>

                </div>
              </div>
            </div>

            {/* Side Info Card */}
            <div className="col-md-4">
              <div className="card card-round mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="typcn typcn-info-large-outline text-primary mr-2"></i>
                    Branch Info
                  </h6>

                  <div className="mb-3 pb-3 border-bottom">
                    <small className="text-muted d-block mb-1">ID</small>
                    <strong>#{branch.id}</strong>
                  </div>

                  <div className="mb-3 pb-3 border-bottom">
                    <small className="text-muted d-block mb-1">
                      Created At
                    </small>
                    <strong>
                      {branch.created_at
                        ? new Date(branch.created_at).toLocaleDateString()
                        : '—'}
                    </strong>
                  </div>

                  {branch.updated_at && (
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">
                        Last Updated
                      </small>
                      <strong>
                        {new Date(branch.updated_at).toLocaleDateString()}
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div
                className="card card-round text-white"
                style={{
                  background: 'linear-gradient(135deg, #844fc1 0%, #a86dd9 100%)',
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i
                      className="typcn typcn-office text-white mr-3"
                      style={{ fontSize: '36px' }}
                    ></i>
                    <div>
                      <small className="text-white d-block">Status</small>
                      <h5 className="text-white mb-0">Active</h5>
                    </div>
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

export default BranchesEdit;