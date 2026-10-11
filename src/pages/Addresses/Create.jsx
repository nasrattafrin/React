import React, { useState } from 'react';
import Layout from "../Layout.jsx";
import { Link, useNavigate } from 'react-router';
import API from '../../Lib/axios.js';
function AddressCreate() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');

    const formData = new FormData(e.target);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      const res = await API.post('addresses/create.php', formData);
      const data = res.data;

      if (data.status === true) {
        navigate('/addresses');
      } else {
        setMessage(data.message || 'Failed to add address');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error: ' + error.message);
      setMessageType('error');
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className="page-inner">

          {/* Page Header */}
          <div className="page-header">
            <h3 className="fw-bold mb-3">Add New Address</h3>
            <ul className="breadcrumbs mb-3">
              <li className="nav-home">
                <a href="#">
                  <i className="icon-home"></i>
                </a>
              </li>
              <li className="separator">
                <i className="icon-arrow-right"></i>
              </li>
              <li className="nav-item">
                <Link to="/addresses">Addresses</Link>
              </li>
              <li className="separator">
                <i className="icon-arrow-right"></i>
              </li>
              <li className="nav-item">
                <a href="#">Add New</a>
              </li>
            </ul>
          </div>

          {message && (
            <div
              className={`alert ${
                messageType === 'success' ? 'alert-success' : 'alert-danger'
              } mb-3`}
            >
              {message}
            </div>
          )}
          <div className="row">
            <div className="col-md-12">
              <div className="card card-round">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>

                    <div className="form-group">
                      <label htmlFor="type">Type</label>
                      <select
                        name="type"
                        className="form-control"
                        id="type"
                        defaultValue="0"
                      >
                        <option value="0">Sender</option>
                        <option value="1">Receiver</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        id="name"
                        placeholder="Enter name"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="phone">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        id="phone"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <textarea
                        name="address"
                        className="form-control"
                        id="address"
                        placeholder="Enter full address"
                        rows="3"
                        required
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        name="image"
                        className="form-control"
                        id="image"
                        accept="image/*"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                      Add Address
                    </button>
                    <Link to="/addresses" className="btn btn-secondary mt-3 ml-2">
                      Cancel
                    </Link>
                  </form>
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