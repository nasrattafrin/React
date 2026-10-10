import React from 'react';
import Layout from "../Layout.jsx";
import { Link } from 'react-router';

function AddressCreate() {

  function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    fetch('http://localhost/courier_api/addresses/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Optionally, you can redirect the user to another page or show a success message here
        window.location.href = '/addresses';
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
              <Link to="/addresses">Adresses</Link>
            </li>
            <li className="separator">
              <i className="icon-arrow-right"></i>
            </li>
            <li className="nav-item">
              <a href="#">Add New</a>
            </li>
          </ul>
        </div>

        {/* Card */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-round">

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" className="form-control" id="name" placeholder="Enter name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">PHONE</label>
                    <input type="text" name="phone" className="form-control" id="phone" placeholder="Enter phone number" />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Add Address</button>
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