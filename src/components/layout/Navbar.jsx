import { useState } from 'react';
import { Link } from 'react-router';

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex justify-content-center">
          <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">
            <Link className="navbar-brand brand-logo" to="/">
              <img src="/assets/images/logo.svg" alt="logo" />
            </Link>
            <Link className="navbar-brand brand-logo-mini" to="/">
              <img src="/assets/images/logo-mini.svg" alt="logo-mini" />
            </Link>
            <button
              className="navbar-toggler navbar-toggler align-self-center"
              type="button"
            >
            <span className="typcn typcn-th-menu"></span>
            </button>
          </div>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item nav-profile dropdown">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setProfileOpen(!profileOpen);
                }}
              >
                <img src="/assets/images/faces/face5.jpg" alt="profile" />
                <span className="nav-profile-name">Nasrat Tafrin</span>
              </a>

              {profileOpen && (
                <div className="dropdown-menu dropdown-menu-right navbar-dropdown show">
                  <a className="dropdown-item">
                    <i className="typcn typcn-cog-outline text-primary"></i> Settings
                  </a>
                  <a className="dropdown-item">
                    <i className="typcn typcn-eject text-primary"></i> Logout
                  </a>
                </div>
              )}
            </li>

            <li className="nav-item nav-user-status dropdown">
              <p className="mb-0">Last login was 23 hours ago.</p>
            </li>
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
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  aria-label="search"
                />
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