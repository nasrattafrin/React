import React from 'react';
import { Link } from 'react-router';
import { useParams } from 'react-router';
import Layout from "../Layout.jsx";
import API from '../../Lib/axios.js';
function AddressEdit() {

  let { id } = useParams();

  const [addresses, setAddresses] = React.useState([]);
  
    async function fetchAddresses() {
      let res = await API.get('/addresses/single.php?id=' + id)
        setAddresses(res.data.data[0]);
    }
  
    React.useEffect(() => {
      fetchAddresses();
    }
  , []);

 async function handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
   
     let res = await API.post('/addresses/update.php?id=' +addresses.id, formData)
       if(res.status === 200) {
        window.location.href = '/addresses';
      }
     
  }


 return (
  <Layout>
    <div className="container">
      <div className="page-inner">

        {/* Page Header */}
        <div className="page-header">
          <h3 className="fw-bold mb-3">Edit Address</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">
                  <i className="typcn typcn-home-outline mr-1"></i>
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/addresses">Addresses</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Edit
              </li>
            </ol>
          </nav>
        </div>

        {/* Card */}
        <div className="row">
          <div className="col-md-12">
            <div className="card card-round">

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      onChange={(e) => setAddresses({...addresses, name: e.target.value})}
                      value={addresses.name || ''}
                      name="name"
                      className="form-control"
                      id="name"
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      onChange={(e) => setAddresses({...addresses, phone: e.target.value})}
                      value={addresses.phone || ''}
                      name="phone"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone no"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary mt-3">
                    Update Address
                  </button>
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