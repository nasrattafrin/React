import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to logout?')) return;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('userdata');
    navigate('/login');
  };

  const getUserName = () => {
    try {
      const userData = sessionStorage.getItem('userdata');
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || 'User';
      }
    } catch (err) {
      console.error(err);
    }
    return 'User';
  };

  return (
    <>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">

        {/* ========== BRAND / LOGO ========== */}
        <div className="navbar-brand-wrapper d-flex justify-content-center">
          <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">

            {/* ✅ Full Logo — Big & Beautiful */}
            <Link
              className="navbar-brand brand-logo"
              to="/"
              style={{ textDecoration: 'none' }}
            >
              <svg
                width="200"
                height="50"
                viewBox="0 0 220 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(4, 10)">
                  <line x1="-8" y1="8" x2="-2" y2="8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                  <line x1="-10" y1="14" x2="-2" y2="14" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                  <line x1="-6" y1="20" x2="-2" y2="20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
                  <rect x="0" y="4" width="24" height="18" rx="3" fill="#ffffff" />
                  <rect x="25" y="9" width="12" height="13" rx="2" fill="#ffffff" />
                  <rect x="27" y="11" width="7" height="5" rx="1" fill="#844fc1" opacity="0.5" />
                  <circle cx="7" cy="24" r="4" fill="#2c1a4d" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="7" cy="24" r="1.5" fill="#ffffff" />
                  <circle cx="19" cy="24" r="4" fill="#2c1a4d" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="19" cy="24" r="1.5" fill="#ffffff" />
                  <circle cx="32" cy="24" r="4" fill="#2c1a4d" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="32" cy="24" r="1.5" fill="#ffffff" />
                </g>
                <text x="55" y="26" fontFamily="Poppins, Montserrat, sans-serif" fontSize="22" fontWeight="800" fill="#ffffff" letterSpacing="1">
                  SHIP
                </text>
                <text x="118" y="26" fontFamily="Poppins, Montserrat, sans-serif" fontSize="22" fontWeight="300" fontStyle="italic" fill="#e0c8f5" letterSpacing="1">
                  EASE
                </text>
                <rect x="55" y="32" width="120" height="2" rx="1" fill="#e0c8f5" opacity="0.6" />
              </svg>
            </Link>

            {/* ✅ Mini Logo — Small Screen */}
            <Link
              className="navbar-brand brand-logo-mini"
              to="/"
              style={{ textDecoration: 'none' }}
            >
              <svg
                width="45"
                height="45"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(8, 12)">
                  <rect x="0" y="4" width="20" height="14" rx="2" fill="#ffffff" />
                  <rect x="21" y="8" width="10" height="10" rx="1.5" fill="#ffffff" />
                  <rect x="23" y="10" width="6" height="4" rx="0.5" fill="#844fc1" opacity="0.5" />
                  <circle cx="6" cy="19" r="3" fill="#2c1a4d" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="6" cy="19" r="1" fill="#ffffff" />
                  <circle cx="15" cy="19" r="3" fill="#2c1a4d" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="15" cy="19" r="1" fill="#ffffff" />
                  <circle cx="26" cy="19" r="3" fill="#2c1a4d" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="26" cy="19" r="1" fill="#ffffff" />
                </g>
              </svg>
            </Link>

            <button
              className="navbar-toggler navbar-toggler align-self-center"
              type="button"
            >
              <span className="typcn typcn-th-menu"></span>
            </button>
          </div>
        </div>

        {/* ========== MENU ========== */}
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">

            <li className="nav-item nav-profile dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setProfileOpen(!profileOpen);
                }}
              >
                <img src="/assets/images/faces/face5.jpg" alt="profile" />
                <span className="nav-profile-name">{getUserName()}</span>
              </a>

              {profileOpen && (
                <div
                  className="dropdown-menu dropdown-menu-right navbar-dropdown show"
                  style={{
                    display: 'block',
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    zIndex: 9999,
                  }}
                >
                  <Link to="/profile" className="dropdown-item">
                    <i className="typcn typcn-cog-outline text-primary"></i> Settings
                  </Link>
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    <i className="typcn typcn-eject text-primary"></i> Logout
                  </a>
                </div>
              )}
            </li>
            {/*/<li className="nav-item nav-user-status dropdown">
              <p className="mb-0">Last login was 23 hours ago.</p>
            </li>*/}
          </ul>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-date dropdown">
              <a
                className="nav-link d-flex justify-content-center align-items-center"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                <h6 className="date mb-0">Today : Mar 23</h6>
                <i className="typcn typcn-calendar"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <nav className="navbar-breadcrumb col-xl-12 col-12 d-flex flex-row p-0">
        <div className="navbar-links-wrapper d-flex align-items-stretch">
          <div className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="typcn typcn-calendar-outline"></i>
            </a>
          </div>
          <div className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="typcn typcn-mail"></i>
            </a>
          </div>
          <div className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="typcn typcn-folder"></i>
            </a>
          </div>
          <div className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <i className="typcn typcn-document-text"></i>
            </a>
          </div>
        </div>

        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item ml-0">
              <h4 className="mb-0">Dashboard</h4>
            </li>
            <li className="nav-item">
              <div className="d-flex align-items-baseline">
                <p className="mb-0">Home</p>
                <i className="typcn typcn-chevron-right"></i>
                <p className="mb-0">Main Dashboard</p>
              </div>
            </li>
          </ul>

          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-search d-none d-md-block mr-0">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Search..." />
                <div className="input-group-prepend">
                  <span className="input-group-text" id="search">
                    <i className="typcn typcn-zoom"></i>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}