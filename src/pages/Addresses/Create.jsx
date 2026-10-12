import React, { useState } from 'react';
import Layout from "../Layout.jsx";
import { Link, useNavigate } from 'react-router';
import API from '../../Lib/axios.js';
function AddressCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
   function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    const formData = new FormData(e.target);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      const res = await API.post('addresses/create.php', formData);
      console.log('Response:', res.data);
      if (res.data.status === true) {
        setMessage('Address added successfully!');
        setMessageType('success');
        setTimeout(() => navigate('/addresses'), 1000);
      } else {
        setMessage(res.data.message || 'Failed to add address');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Unknown error';
      setMessage(errorMsg);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  }
  return (
    <Layout>
      <div className="container">
        <div className="page-inner">
         {/* ========== Page Header ========== */}
          <div className="page-header">
            <h3 className="page-title mb-3">Add New Address</h3>

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="typcn typcn-home-outline"></i> Home
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/addresses">Addresses</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Add New
                </li>
              </ol>
            </nav>
          </div>

          {/* ========== Message Alert ========== */}
          {message && (
            <div
              className={`alert ${
                messageType === 'success' ? 'alert-success' : 'alert-danger'
              } alert-dismissible fade show d-flex align-items-center`}
              role="alert"
            >
              <i
                className={`typcn ${
                  messageType === 'success'
                    ? 'typcn-tick'
                    : 'typcn-warning-outline'
                } mr-2`}
                style={{ fontSize: '20px' }}
              ></i>
              <span>{message}</span>
            </div>
          )}

          {/* ========== Main Content ========== */}
          <div className="row">

            {/* --- FORM CARD (Left) --- */}
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
                        background: 'linear-gradient(135deg, #844fc1 0%, #a86dd9 100%)',
                        color: '#fff',
                      }}
                    >
                      <i className="typcn typcn-location-outline" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold">Address Information</h5>
                      <small className="text-muted">
                        Fields marked with <span className="text-danger">*</span> are required
                      </small>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>

                    {/* Type + Name in one row */}
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="type" className="fw-bold">
                            Type <span className="text-danger">*</span>
                          </label>
                          <select
                            name="type"
                            className="form-control"
                            id="type"
                            defaultValue="0"
                            required
                          >
                            <option value="0">📤 Sender</option>
                            <option value="1">📥 Receiver</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-8">
                        <div className="form-group">
                          <label htmlFor="name" className="fw-bold">
                            Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            id="name"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="phone" className="fw-bold">
                        Phone Number <span className="text-danger">*</span>
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

                    {/* Address */}
                    <div className="form-group">
                      <label htmlFor="address" className="fw-bold">
                        Full Address <span className="text-danger">*</span>
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
                          required
                        ></textarea>
                      </div>
                    </div>

                    {/* Image Upload with Preview */}
                    <div className="form-group">
                      <label htmlFor="image" className="fw-bold">
                        Profile Image
                      </label>

                      <div className="d-flex align-items-center">

                        {/* Preview box */}
                        <div
                          className="d-flex align-items-center justify-content-center mr-3"
                          style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '10px',
                            border: '2px dashed #e4e4f4',
                            background: '#fafbff',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <i
                              className="typcn typcn-image-outline text-muted"
                              style={{ fontSize: '32px' }}
                            ></i>
                          )}
                        </div>

                        {/* File input */}
                        <div className="flex-grow-1">
                          <div className="custom-file">
                            <input
                              type="file"
                              name="image"
                              className="custom-file-input"
                              id="image"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <label className="custom-file-label" htmlFor="image">
                              Choose image...
                            </label>
                          </div>
                          <small className="text-muted d-block mt-1">
                            Supported: JPG, PNG, GIF, WebP (Max 2MB)
                          </small>
                        </div>

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
                            Add Address
                          </>
                        )}
                      </button>

                      <Link
                        to="/addresses"
                        className="btn btn-light border"
                      >
                        <i className="typcn typcn-arrow-left mr-1"></i>
                        Cancel
                      </Link>
                    </div>

                  </form>
                </div>
              </div>
            </div>

            {/* --- SIDEBAR (Right) --- */}
            <div className="col-md-4">

              {/* Tips Card */}
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
                        Use full name (First + Last)
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Phone must be 11 digits
                      </span>
                    </li>
                    <li className="d-flex align-items-start mb-3">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Include House, Road, Area, City
                      </span>
                    </li>
                    <li className="d-flex align-items-start">
                      <i className="typcn typcn-tick text-white mr-2 mt-1"></i>
                      <span className="text-white">
                        Image is optional but helpful
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
                    About Addresses
                  </h6>
                  <p className="text-muted small mb-2">
                    <strong>Sender:</strong> Person sending the parcel
                  </p>
                  <p className="text-muted small mb-2">
                    <strong>Receiver:</strong> Person receiving the parcel
                  </p>
                  <p className="text-muted small mb-0">
                    You can manage all your saved addresses from the Addresses
                    page.
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

export default AddressCreate;