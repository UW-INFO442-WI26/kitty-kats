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
    <>
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
                {loading ? (
                  <button className="btn btn-primary rounded-pill px-4" disabled>Loading...</button>
                ) : user ? (
                  <div className="d-flex align-items-center gap-2">
                    <div title={displayName}>
                      {avatarUrl ? (
                        <img className="rounded-circle" src={avatarUrl} alt={displayName} width="32" height="32" />
                      ) : (
                        <span className="badge bg-primary rounded-circle p-2">{displayName[0]}</span>
                      )}
                    </div>
                    <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={handleSignOut} disabled={busy}>
                      Sign out
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => setAuthOpen(true)}>
                    Sign in
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onGoogle={handleSignIn}
        busy={busy}
      />
    </>
  );
}

export default Navbar;
