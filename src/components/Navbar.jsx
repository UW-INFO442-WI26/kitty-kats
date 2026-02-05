import { Link } from 'react-router';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <Link to="/" className="navbar-brand fw-bold text-deep-plum">Kitty-Kats</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/profile" className="nav-link d-flex align-items-center gap-1" title="Profile">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                </svg>
                <span className="d-lg-none">Profile</span>
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <button className="btn btn-link nav-link" title="Search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>
            </li>
            
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            
            <li className="nav-item">
              <button className="btn btn-primary rounded-pill px-4">Login</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
