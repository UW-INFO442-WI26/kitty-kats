import { Link } from 'react-router';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Left side - Logo and Profile */}
        <div className="navbar-left">
          <Link to="/" className="nav-link" style={{ fontWeight: 800, fontSize: '1.25rem' }}>Kitty-Kats</Link>
          <Link to="/profile" className="nav-icon-link" title="Profile">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </Link>
        </div>

        {/* Right side - Search, About, Login */}
        <div className="navbar-right">
          <button className="nav-icon-btn" title="Search">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          
          <Link to="/about" className="nav-link">About</Link>
          
          <button className="nav-btn-login">Login</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
