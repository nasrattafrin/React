{/*import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';

function RolesCreate() {
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
      const res = await API.post('roles/create.php', formData);
      console.log('Response:', res.data);

      if (res.data.status === true) {
        setMessage('Role added successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/roles'), 1200);
      } else {
        setMessage(res.data.message || 'Failed to add role');
        setMessageType('error');
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Unknown error';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">*/}

          {/* Page Header 
          <div className="page-header">
            <h3 className="fw-bold mb-3">Add New Role</h3>

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
                  Add New
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

                  <h5 className="fw-bold mb-3">Role Information</h5>
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
                        placeholder="e.g. Admin, Merchant, Deliveryman"
                        required
                      />
                      <small className="text-muted">
                        Unique name for this role
                      </small>
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="typcn typcn-plus mr-1"></i>
                            Add Role
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
              <div
                className="card card-round text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #844fc1 0%, #a86dd9 100%)',
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i
                      className="typcn typcn-info-large-outline text-white mr-2"
                      style={{ fontSize: '24px' }}
                    ></i>
                    <h5 className="mb-0 text-white fw-bold">About Roles</h5>
                  </div>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Roles define user permissions
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Admin has full access
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Merchant manages own parcels
                      </span>
                    </li>
                    <li className="d-flex align-items-start">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Deliveryman delivers parcels
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}

export default RolesCreate;
*/}