import React from 'react';
import { Link } from 'react-router';
import Layout from "../Layout.jsx";
function Addresses() {

  const [addresses, setAddresses] = React.useState([]);

  function fetchAddresses() {
    fetch('http://localhost/courier_api/addresses/index.php')
      .then(response => response.json())
      .then(data => setAddresses(data.data))
      .catch(error => console.error('Error fetching address:', error));
  }

  React.useEffect(() => {
    fetchAddresses();
  }
, [addresses]);

function handleDelete(id) {
  if (window.confirm("Are you sure you want to delete this category?")) {
    fetch(`http://localhost/courier_api/addresses/delete.php?id=${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 'true') {
          fetchAddresses();
        }
      })
      .catch(error => console.error('Error deleting category:', error));
  }
}

  return (
    <Layout>
    <div className="container">
      <div className="page-inner">

        {/* Page Header */}
        <div className="page-header">
          <h3 className="fw-bold mb-3">Address</h3>

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
              <a href="#">Address</a>
            </li>
          </ul>
        </div>

        {/* Table Card */}
        <div className="row">
          <div className="col-md-12">

            <div className="card card-round">

              <div className="card-header">
                <div className="d-flex align-items-center">

                  <h4 className="card-title">
                    ADDRESSES
                  </h4>

                  <Link to="/addresses/create" className="btn btn-primary btn-round ms-auto">
                    <i className="fa fa-plus"></i>
                    &nbsp; Add Address
                  </Link>

                </div>
              </div>

              <div className="card-body">

                {/* Search */}
                <div className="row mb-3">
                  <div className="col-md-4">

                    <div className="input-icon">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ADDRESS..."
                      />

                      <span className="input-icon-addon">
                        <i className="fa fa-search"></i>
                      </span>
                    </div>

                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive">

                  <table className="table table-hover">

                    <thead>
                      <tr>
                        <th>#</th>
                        <th> Name</th>
                        <th>PHONE</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {addresses.map((address, index) => (

                        <tr key={address.id}>

                          <td>{index + 1}</td>

                          <td>
                            <strong>{address.name}</strong>
                          </td>

                          <td>{address.phone}</td>
                          <td>
                            <div className="form-button-action">
                                <Link to={`/addresses/edit/${address.id}`} className="btn btn-primary">
                                Edit
                                </Link>
                                <button className="btn btn-danger" onClick={() => handleDelete(address.id)}>
                                Delete
                                </button>
                            </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default Addresses;