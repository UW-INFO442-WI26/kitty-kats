import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import GlossarySearch from '../components/GlossarySearch';

function Navbar() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

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
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (!confirmed) return;
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

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={menuOpen ? 'true' : 'false'}
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="navbarNav">
            {/*
              Single ul with all items.
              - Desktop: profile sits far left (order-lg-first + me-lg-auto pushes the rest right)
              - Mobile: everything stacks and centers together (justify-content-center)
            */}
            <ul className="navbar-nav w-100 align-items-center gap-2 justify-content-center justify-content-lg-start">

              <li className="nav-item order-lg-first me-lg-auto">
                <Link
                  to="/profile"
                  className="nav-link d-flex align-items-center gap-1"
                  title="Profile"
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'relative', top: '2px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                  <span className="d-lg-none">Profile</span>
                </Link>
              </li>

              <li className="nav-item">
                <GlossarySearch />
              </li>

              <li className="nav-item">
                <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
              </li>

              <li
                className={`nav-item dropdown ${learnOpen ? 'show' : ''}`}
                onMouseEnter={() => { if (window.innerWidth >= 992) setLearnOpen(true); }}
                onMouseLeave={() => { if (window.innerWidth >= 992) setLearnOpen(false); }}
              >
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  aria-expanded={learnOpen ? 'true' : 'false'}
                  onClick={() => setLearnOpen((o) => !o)}
                >
                  Learn
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${learnOpen ? 'show' : ''}`}>
                  <li>
                    <Link
                      to="/modules"
                      className="dropdown-item"
                      onClick={() => { setMenuOpen(false); setLearnOpen(false); }}
                    >
                      Modules
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/flashcards"
                      className="dropdown-item"
                      onClick={() => { setMenuOpen(false); setLearnOpen(false); }}
                    >
                      Flashcards
                    </Link>
                  </li>
                </ul>
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
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => { setAuthOpen(true); setMenuOpen(false); }}>
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