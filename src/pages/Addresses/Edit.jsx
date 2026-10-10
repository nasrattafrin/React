import React from 'react';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import Layout from "../Layout.jsx";
function AddressEdit() {

  let { id } = useParams();

  const [addresses, setAddresses] = React.useState([]);
  
    function fetchAddresses() {
      fetch('http://localhost/courier_api/addresses/single.php?id=' + id)
        .then(response => response.json())
        .then(data => setAddresses(data.data[0]))
        .catch(error => console.error('Error fetching addresses:', error));
    }
  
    React.useEffect(() => {
      fetchAddresses();
    }
  , []);

 function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
   
    fetch('http://localhost/courier_api/addresses/update.php?id=' +addresses.id, {
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
              <Link to="/addresses">ADDRESSES</Link>
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
                    
                    <label htmlFor="name"> Name</label>
                    <input type="text" onChange={(e) => setAddresses({...addresses, name: e.target.value})} value={addresses.name || ''} name="name" className="form-control" id="name" placeholder="Enter  name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="text" onChange={(e) =>setAddresses({...addresses, phone: e.target.value})} value={addresses.phone || ''} name="phone" className="form-control" id="phone" placeholder="Enter phone no" />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">Update Category</button>
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

export default AddressEdit;