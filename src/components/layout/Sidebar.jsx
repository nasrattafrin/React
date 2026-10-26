import { useState, useEffect } from 'react';
import { Link } from 'react-router';

function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    // Role ID ke Number hishebe set koro
    setRoleId(Number(localStorage.getItem('role_id')));
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const isMerchant = roleId === 2;

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {/* Dashboard */}
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <i className="typcn typcn-device-desktop menu-icon"></i>
            <span className="menu-title">{isMerchant ? 'My Dashboard' : 'Dashboard'}</span>
            {!isMerchant && <div className="badge badge-danger">new</div>}
          </Link>
        </li>

        {/* ADMIN ONLY MENU */}
        {!isMerchant && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/roles">
                <i className="typcn typcn-group menu-icon"></i>
                <span className="menu-title">Roles</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/branches">
                <i className="typcn typcn-location menu-icon"></i>
                <span className="menu-title">Branches</span>
              </Link>
            </li>
          </>
        )}

        {/* ===== PARCELS ===== */}
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
            <span className="menu-title">{isMerchant ? 'My Orders' : 'Parcels'}</span>
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
                  {isMerchant ? 'My Parcels' : 'All Parcels'}
                </Link>
              </li>
              
              {/* Create, Deliverymen & Pricing sudhu Admin dekhbe */}
              {!isMerchant && (
                <>
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
                </>
              )}
              
              <li className="nav-item">
                <Link className="nav-link" to="/track">
                  <i className="typcn typcn-location-arrow menu-icon"></i>
                  Track Parcel
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* ===== FINANCE ===== */}
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
              
              {/* Payments & COD Settlements shudhu Admin dekhbe */}
              {!isMerchant && (
                <>
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
                </>
              )}
              
              <li className="nav-item">
                <Link className="nav-link" to="/wallets">
                  <i className="typcn typcn-archive menu-icon"></i>
                  {isMerchant ? 'My Wallet' : 'Wallets'}
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/withdraw-requests">
                  <i className="typcn typcn-export menu-icon"></i>
                  {isMerchant ? 'My Withdraw' : 'Withdraw Requests'}
                </Link>
              </li>
            </ul>
          </div>
        </li>

        {/* User Pages (Shudhu Admin dekhbe) */}
        {!isMerchant && (
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
        )}

      </ul>
    </nav>
  );
}

export default Sidebar;