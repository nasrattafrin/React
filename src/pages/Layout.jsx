import React from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';

 
function Layout({children}) {
  

  return (
      <div className="container-scroller">
        <Navbar />
    
        <div className="container-fluid page-body-wrapper">
          <Sidebar />

        
          <div className="main-panel">
            <div className="content-wrapper">

              {children}

            </div>

            <Footer />

          </div>
  

        </div>
    

      </div>
  );
}

export default Layout