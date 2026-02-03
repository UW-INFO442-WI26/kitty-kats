import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

function Navbar() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    try {
      setBusy(true);
      await signInWithGoogle();
      setAuthOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setBusy(true);
      await signOutUser();
    } finally {
      setBusy(false);
    }
  };

  const displayName = user?.displayName || user?.email || 'Signed in';
  const avatarUrl = user?.photoURL || '';

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
          
          {loading ? (
            <button className="nav-btn-login" disabled>Loading...</button>
          ) : user ? (
            <div className="nav-user">
              <div className="nav-avatar" title={displayName}>
                {avatarUrl ? (
                  <img className="nav-avatar-img" src={avatarUrl} alt={displayName} />
                ) : (
                  <span className="nav-avatar-fallback">{displayName[0]}</span>
                )}
              </div>
              <button className="nav-btn-logout" onClick={handleSignOut} disabled={busy}>
                Sign out
              </button>
            </div>
          ) : (
            <button className="nav-btn-login" onClick={() => setAuthOpen(true)}>
              Sign in
            </button>
          )}
        </div>
      </div>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onGoogle={handleSignIn}
        busy={busy}
      />
    </nav>
  );
}

export default Navbar;
