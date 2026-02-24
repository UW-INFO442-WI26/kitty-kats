import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import ProgressBar from '../components/ProgressBar';
import { modules } from './Modules';
import { loadAllMastery, MASTERY_THRESHOLD } from '../utils/masteryUtils';

const MODULE_BADGES = ['📘', '🧬', '💻', '💊', '🤝', '🌈'];

function Profile() {
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const displayName = user?.displayName || 'Anonymous Learner';
  const email       = user?.email       || null;
  const photoURL    = user?.photoURL    || null;
  const isLoggedIn  = user && !user.isAnonymous;

  const [authOpen, setAuthOpen] = useState(false);
  const [busy, setBusy]         = useState(false);

  const [masteryMap, setMasteryMap]           = useState({});
  const [loadingMastery, setLoadingMastery]   = useState(true);

  const handleSignIn = async () => {
    try {
      setBusy(true);
      await signInWithGoogle();
      setAuthOpen(false);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    async function fetchMastery() {
      if (!isLoggedIn) {
        setMasteryMap({});
        setLoadingMastery(false);
        return;
      }
      try {
        const ids  = modules.map((m) => m.id);
        const data = await loadAllMastery(user.uid, ids);
        setMasteryMap(data);
      } catch (err) {
        console.error('Failed to load mastery:', err);
      } finally {
        setLoadingMastery(false);
      }
    }

    fetchMastery();
  }, [authLoading, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const moduleProgress = modules.map((m, i) => ({
    id:      m.id,
    title:   m.title,
    mastery: masteryMap[m.id]?.mastery ?? 0,
    badge:   (masteryMap[m.id]?.mastery ?? 0) >= MASTERY_THRESHOLD
               ? '🏆'
               : MODULE_BADGES[i] || '📚',
  }));

  const completedCount  = moduleProgress.filter((m) => m.mastery >= MASTERY_THRESHOLD).length;
  const overallProgress = Math.round(
    moduleProgress.reduce((sum, m) => sum + m.mastery, 0) / modules.length
  );

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '900px' }}>

        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onGoogle={handleSignIn}
          busy={busy}
        />

        {/* Header */}
        <div className="bg-deep-plum rounded-4 p-4 mb-4 shadow-sm d-flex align-items-center gap-4 flex-wrap">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
            style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', fontSize: '2.5rem' }}
          >
            {photoURL
              ? <img src={photoURL} alt="profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
              : '🐱'}
          </div>

          <div className="flex-grow-1">
            <h1 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
              {authLoading ? '…' : displayName}
            </h1>
            {email
              ? <p className="text-blush mb-0 small">{email}</p>
              : <p className="text-blush mb-0 small opacity-75">
                  {authLoading ? '' : 'Learning anonymously'}
                </p>}
          </div>

          {!authLoading && !isLoggedIn && (
            <button
              className="btn btn-outline-light rounded-pill px-3 py-2 small flex-shrink-0"
              onClick={() => setAuthOpen(true)}
            >
              Sign in to save progress
            </button>
          )}
        </div>

        {/* Guest prompt */}
        {!authLoading && !isLoggedIn && (
          <p className="text-center text-muted mb-4 small">
            You can explore any module freely.{' '}
            <button
              className="btn btn-link p-0 text-deep-plum fw-semibold"
              style={{ verticalAlign: 'baseline' }}
              onClick={() => setAuthOpen(true)}
            >
              Sign in
            </button>{' '}
            to save your progress and track mastery.
          </p>
        )}

        {/* Stats row */}
        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
              <div style={{ fontSize: '2rem' }}>📘</div>
              <div className="fs-4 fw-bold text-deep-plum">
                {loadingMastery ? '—' : `${completedCount} / ${modules.length}`}
              </div>
              <div className="text-muted small">Mastered</div>
            </div>
          </div>

          <div className="col-4">
            <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
              <div style={{ fontSize: '2rem' }}>📊</div>
              <div className="fs-4 fw-bold text-deep-plum">
                {loadingMastery ? '—' : `${overallProgress}%`}
              </div>
              <div className="text-muted small">Avg Mastery</div>
            </div>
          </div>

          <div className="col-4">
            <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
              <div style={{ fontSize: '2rem' }}>🔥</div>
              <div className="fs-4 fw-bold text-deep-plum">1</div>
              <div className="text-muted small">Day Streak</div>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="bg-white rounded-4 p-4 mb-4 shadow-sm border border-blush">
          <h2 className="text-deep-plum fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Overall Mastery</h2>
          <ProgressBar value={loadingMastery ? 0 : overallProgress} showLabel={false} />
          <div className="d-flex justify-content-between text-muted small mt-2">
            <span>
              {loadingMastery
                ? 'Loading…'
                : `${completedCount} of ${modules.length} modules mastered`}
            </span>
            <span>{loadingMastery ? '—' : `${overallProgress}%`}</span>
          </div>
        </div>

        {/* Per-module progress */}
        <div className="bg-white rounded-4 p-4 shadow-sm border border-blush">
          <h2 className="text-deep-plum fw-bold mb-4" style={{ fontSize: '1.1rem' }}>Module Mastery</h2>
          <div className="d-flex flex-column gap-3">
            {loadingMastery ? (
              <p className="text-muted small">Loading mastery data…</p>
            ) : (
              moduleProgress.map((module) => (
                <div key={module.id}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span>{module.badge}</span>
                      <span className="fw-semibold text-deep-plum small">{module.title}</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      {module.mastery >= MASTERY_THRESHOLD && (
                        <span className="badge rounded-pill text-bg-success small">Mastered</span>
                      )}
                      <span className="text-muted small">{module.mastery}%</span>
                    </div>
                  </div>
                  <ProgressBar value={module.mastery} showLabel={false} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;