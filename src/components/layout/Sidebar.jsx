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
              {/*{<li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>}*/}
              <li className="nav-item">
                <Link className="nav-link" to="/addresses">Adress</Link>
              </li>
              {/*<li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>*/}
            </ul>
          </div>
        </li>
        {/*<li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleMenu('error');
            }}
          >
            <i className="typcn typcn-globe-outline menu-icon"></i>
            <span className="menu-title">Error pages</span>
            <i className="menu-arrow"></i>
          </a>

          <div
            className={`collapse ${openMenu === 'error' ? 'show' : ''}`}
            id="error"
          >
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <Link className="nav-link" to="/404">404</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/500">500</Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            <i className="typcn typcn-mortar-board menu-icon"></i>
            <span className="menu-title">Documentation</span>
          </a>
        </li>*/}

      </ul>
    </nav>
  );
}
export default Sidebar