import { useState } from 'react';
import { Link } from 'react-router';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

const modules = [
  { id: 1, title: 'Sexual Anatomy and Hygiene', path: '/module/1', icon: '📘' },
  { id: 2, title: 'STIs and STDs', path: '/module/2', icon: '🧬' },
  { id: 3, title: 'Digital Safety and Media Literacy', path: '/module/3', icon: '💻' },
  { id: 4, title: 'Contraception and Pregnancy Prevention', path: '/module/4', icon: '💊' },
  { id: 5, title: 'Consent & Healthy Relationships', path: '/module/5', icon: '🤝' },
  { id: 6, title: 'Gender and Sexual Orientation', path: '/module/6', icon: '🌈' },
];

export { modules };

const cardStyle = {
  minHeight: '150px',
  height: '100%',
  transition: 'all 0.3s ease',
};

function Modules() {
  const { user, signInWithGoogle } = useAuth();
  const isLoggedIn = user && !user.isAnonymous;
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

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="text-center text-deep-plum fw-bold mb-2">Modules</h1>

        {!isLoggedIn ? (
          <p className="text-center text-muted mb-4 small">
            You can explore any module freely.{' '}
            <button
              type="button"
              className="btn btn-link p-0 text-deep-plum fw-semibold"
              style={{ verticalAlign: 'baseline' }}
              onClick={() => setAuthOpen(true)}
            >
              Sign in
            </button>{' '}
            to save your progress and track mastery.
          </p>
        ) : (
          <p className="text-center text-muted mb-4 small">
          Track your learning with Mastery points! Mastery will go up if you answer questions correctly, and down if you answer incorrectly.
          </p>
        )}

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onGoogle={handleSignIn}
          busy={busy}
        />

        <div className="row g-4 align-items-stretch">
          {modules.map((module) => (
            <div key={module.id} className="col-6 d-flex">
              <Link
                to={module.path}
                className="d-flex bg-white rounded-4 p-4 text-center text-decoration-none border border-3 border-blush shadow-sm border-purple w-100 module-card playful-card"
                style={cardStyle}
              >
                <div className="d-flex flex-column align-items-center justify-content-center w-100">
                  <span style={{ fontSize: '2.5rem' }}>{module.icon}</span>
                  <h2 className="fs-4 fw-bold text-deep-plum mt-2 mb-0">{module.title}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modules;
