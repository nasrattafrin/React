import { useState } from 'react';
import { Link } from 'react-router';

function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/* Dashboard */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="typcn typcn-device-desktop menu-icon"></i>
            <span className="menu-title">Dashboard</span>
            <div className="badge badge-danger">new</div>
          </Link>
        </li>

        {/* Roles */}
        <li className="nav-item">
          <Link className="nav-link" to="/roles">
            <i className="typcn typcn-group menu-icon"></i>
            <span className="menu-title">Roles</span>
          </Link>
        </li>

        {/* Branches */}
        <li className="nav-item">
          <Link className="nav-link" to="/branches">
            <i className="typcn typcn-location menu-icon"></i>
            <span className="menu-title">Branches</span>
          </Link>
        </li>
          {/* Parcels */}
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('parcels');
            }}
          >
            <i className="typcn typcn-shopping-cart menu-icon"></i>
            <span className="menu-title">Parcels</span>
            <i className="menu-arrow"></i>
          </a>
          <div
            className={`collapse ${openMenu === 'parcels' ? 'show' : ''}`}
            id="parcels"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/parcels">
                  <i className="typcn typcn-th-list menu-icon"></i>
                  All Parcels
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/parcels/create">
                  <i className="typcn typcn-plus menu-icon"></i>
                  Create Parcel
                </Link>
              </li>
               <li className="nav-item">
                <Link className="nav-link" to="/deliverymen">
                  <i className="typcn typcn-user menu-icon"></i>
                  Deliverymen
                </Link>
              </li>
              <li className="nav-item">
              <Link className="nav-link" to="/pricing">  
              <i className="typcn typcn-tag menu-icon"></i> Pricing
              </Link>
            </li>
              <li className="nav-item">
                <Link className="nav-link" to="/track">
                  <i className="typcn typcn-location-arrow menu-icon"></i>
                  Track Parcel
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('finance');
            }}
          >
            <i className="typcn typcn-credit-card menu-icon"></i>
            <span className="menu-title">Finance</span>
            <i className="menu-arrow"></i>
          </a>
          <div
            className={`collapse ${openMenu === 'finance' ? 'show' : ''}`}
            id="finance"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/payments">
                  <i className="typcn typcn-credit-card menu-icon"></i>
                  Payments
                </Link>
              </li>
               <li className="nav-item">
                 <Link className="nav-link" to="/cod-settlements">
                   <i className="typcn typcn-clipboard menu-icon"></i>
                    COD Settlements
                  </Link>
                </li>
            </ul>
          </div>
        </li>
        {/* ===== END Finance ===== */}


        {/* Charts */}
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('charts');
            }}
          >
            <i className="typcn typcn-chart-pie-outline menu-icon"></i>
            <span className="menu-title">Charts</span>
            <i className="menu-arrow"></i>
          </a>

          <div
            className={`collapse ${openMenu === 'charts' ? 'show' : ''}`}
            id="charts"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/charts/chartjs">ChartJs</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Tables */}
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('tables');
            }}
          >
            <i className="typcn typcn-th-small-outline menu-icon"></i>
            <span className="menu-title">Tables</span>
            <i className="menu-arrow"></i>
          </a>

          <div
            className={`collapse ${openMenu === 'tables' ? 'show' : ''}`}
            id="tables"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/tables/basic">Basic table</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* Icons */}
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('icons');
            }}
          >
            <i className="typcn typcn-compass menu-icon"></i>
            <span className="menu-title">Icons</span>
            <i className="menu-arrow"></i>
          </a>

          <div
            className={`collapse ${openMenu === 'icons' ? 'show' : ''}`}
            id="icons"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/icons/mdi">Mdi icons</Link>
              </li>
            </ul>
          </div>
        </li>

        {/* User Pages */}
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('auth');
            }}
          >
            <i className="typcn typcn-user-add-outline menu-icon"></i>
            <span className="menu-title">User Pages</span>
            <i className="menu-arrow"></i>
          </a>

          <div
            className={`collapse ${openMenu === 'auth' ? 'show' : ''}`}
            id="auth"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/addresses">Address</Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;