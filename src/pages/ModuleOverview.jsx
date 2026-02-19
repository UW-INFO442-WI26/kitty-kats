import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { modules } from './Modules';
import { useAuth } from '../context/AuthContext';
import { loadModuleMastery, MASTERY_THRESHOLD } from '../utils/masteryUtils';
import ProgressBar from '../components/ProgressBar';

const modulesData = {
  1: {
    image: '/img/module-1-anatomy.png',
    description: 'This module covers sexual anatomy, hygiene, and bodily health.',
  },
  2: {
    image: '/img/module-2-STDs.jpg',
    description: 'This module covers sexually transmitted infections and diseases, their prevention, and treatment.',
  },
  3: {
    image: '/img/module-3-literacy.jpg',
    description: 'This module covers digital safety, media literacy, and navigating online spaces responsibly.',
  },
  4: {
    image: '/img/module-4-contraception.png',
    description: 'This module covers contraception methods, pregnancy prevention, and reproductive choices.',
  },
  5: {
    image: '/img/module-5-consent.jpg',
    description: 'This module covers consent, healthy relationships, and communicating boundaries.',
  },
  6: {
    image: '/img/module-6-orientation.jpg',
    description: 'This module covers gender identity, sexual orientation, and the spectrum of human diversity.',
  },
};

function ModuleOverview() {
  const { id }   = useParams();
  const { user } = useAuth();
  const moduleId = parseInt(id, 10) || 1;

  const moduleMeta  = modules.find((m) => m.id === moduleId) || modules[0];
  const moduleExtra = modulesData[moduleId] || modulesData[1];
  const module      = { ...moduleMeta, ...moduleExtra };

  const [mastery, setMastery]   = useState(null);   // null = loading
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    async function fetchMastery() {
      if (!user) { setLoading(false); return; }
      const data = await loadModuleMastery(user.uid, moduleId);
      setMastery(data ? data.mastery : 0);
      setLoading(false);
    }
    fetchMastery();
  }, [user, moduleId]);

  const masteryPct = mastery ?? 0;
  const isMastered = masteryPct >= MASTERY_THRESHOLD;

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '900px' }}>

        <Link to="/modules" className="btn btn-outline-secondary rounded-pill px-3 py-2 mb-4">
          ← Back to Modules
        </Link>

        <div className="mb-4 rounded-4 overflow-hidden shadow-sm" style={{ width: '100%', height: '350px' }}>
          <img
            src={module.image}
            alt={module.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="row g-4 mb-4 align-items-center">
          <div className="col-12 col-md-7">
            <h1 className="text-deep-plum fw-bold mb-0" style={{ fontSize: '1.75rem' }}>
              {module.title}
            </h1>
          </div>

          {/* Mastery badge (replaces the old questions/progress stats) */}
          <div className="col-12 col-md-5 d-flex justify-content-md-end">
            {loading ? (
              <span className="text-muted small">Loading mastery…</span>
            ) : (
              <div className="text-center">
                {isMastered ? (
                  <span className="badge rounded-pill fs-6 px-4 py-2 text-bg-success">
                    🏆 Mastered
                  </span>
                ) : (
                  <span
                    className="badge rounded-pill fs-6 px-4 py-2"
                    style={{ background: 'var(--blush, #f4c2c2)', color: 'var(--deep-plum, #4a0e2e)' }}
                  >
                    {masteryPct}% mastery
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mastery progress bar */}
        {!loading && (
          <div className="mb-4">
            <ProgressBar value={masteryPct} showLabel={false} />
            {isMastered && (
              <p className="text-success small mt-1 mb-0">Module mastered — keep reviewing to stay sharp!</p>
            )}
          </div>
        )}

        <div className="mb-5">
          <p className="fs-5 text-muted lh-lg">{module.description}</p>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Link
            to={`/quiz/${moduleId}`}
            className="btn btn-primary rounded-pill px-5 py-3"
            style={{ fontSize: '1.1rem' }}
          >
            {masteryPct > 0 ? 'Continue Quiz' : 'Start Quiz'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ModuleOverview;