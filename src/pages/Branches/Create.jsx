import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function BranchesCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const formData = new FormData(e.target);

    try {
      const res = await API.post('branches/create.php', formData);

      if (res.data.status === true) {
        setMessage('Branch added successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/branches'), 1200);
      } else {
        setMessage(res.data.message || 'Failed to add branch');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || error.message);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Add New Branch</h3>

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
                  Add New
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

          {/* Card */}
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
                        background:
                          'linear-gradient(135deg, #612b9e 0%, #a86dd9 100%)',
                        color: '#fff',
                      }}
                    >
                      <i
                        className="typcn typcn-office"
                        style={{ fontSize: '24px' }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Branch Information</h5>
                      <small className="text-muted">
                        Fields marked with <span className="text-danger">*</span> are required
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
                          type="text"
                          name="branch_name"
                          className="form-control"
                          id="branch_name"
                          placeholder="e.g. Dhaka Main, Chittagong, Sylhet"
                          required
                        />
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
                          name="address"
                          className="form-control"
                          id="address"
                          placeholder="House, Road, Area, City"
                          rows="3"
                        ></textarea>
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
                          placeholder="01XXXXXXXXX"
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="typcn typcn-plus mr-1"></i>
                            Add Branch
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

            {/* Side Tips Card */}
            <div className="col-md-4">
              <div
                className="card card-round text-white mb-3"
                style={{
                  background: 'linear-gradient(135deg, #844fc1 0%, #a86dd9 100%)',
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i
                      className="typcn typcn-lightbulb text-white mr-2"
                      style={{ fontSize: '24px' }}
                    ></i>
                    <h5 className="mb-0 text-white fw-bold">Quick Tips</h5>
                  </div>

                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Use a unique branch name
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Include city in the address
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Phone must be 11 digits
                      </span>
                    </li>
                    <li className="d-flex align-items-start">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Each branch can have one contact person
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Info Card */}
              <div className="card card-round">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="typcn typcn-info-large-outline text-primary mr-2"></i>
                    About Branches
                  </h6>
                  <p className="text-muted small mb-0">
                    Branches represent your physical offices. Each parcel is
                    assigned to a branch for pickup and delivery purposes.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

export default BranchesCreate;