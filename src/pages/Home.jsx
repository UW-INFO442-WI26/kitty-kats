import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';
import DailyQuestion from '../components/DailyQuestion';
import { useAuth } from '../context/AuthContext';
import { modules } from './Modules';
import { loadAllMastery, MASTERY_THRESHOLD } from '../utils/masteryUtils';

function Home() {
  const { user } = useAuth();
  const [masteryMap, setMasteryMap] = useState({});

  useEffect(() => {
    if (!user) return;
    const ids = modules.map((m) => m.id);
    loadAllMastery(user.uid, ids).then(setMasteryMap).catch(console.error);
  }, [user]);

  const masteredCount = modules.filter(
    (m) => (masteryMap[m.id]?.mastery ?? 0) >= MASTERY_THRESHOLD
  ).length;

  const overallMastery = Math.round(
    modules.reduce((sum, m) => sum + (masteryMap[m.id]?.mastery ?? 0), 0) / modules.length
  );

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-6">
            <div className="hero-card hero-card-playful h-100">
              <div className="d-flex flex-column gap-4">
                <div>
                  <span className="badge rounded-pill text-bg-light border border-blush text-deep-plum px-3 py-2">Safe, science-based, teen-friendly</span>
                </div>
                <div>
                  <h1 className="display-5 fw-bold text-deep-plum mb-3">Learning without stigma.</h1>
                  <p className="fs-5 text-muted mb-4">Accurate, inclusive, age-appropriate sexual education for teens ages 14 to 18. Build knowledge, confidence, and decision-making skills in a respectful space.</p>
                  <div className="d-flex flex-wrap gap-3">
                    <Link to="/modules" className="btn btn-primary rounded-pill px-4 py-2">Start Modules</Link>
                    <Link to="/about" className="btn btn-outline-secondary rounded-pill px-4 py-2">How it works</Link>
                  </div>
                </div>

                {/* Progress section — mirrors Profile's overall mastery block */}
                <div className="bg-white rounded-4 p-4 shadow-sm border border-blush">
                  <ProgressBar value={user ? overallMastery : 0} />
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>
                      {user
                        ? `${masteredCount} of ${modules.length} modules mastered`
                        : 'Sign in to track your progress'}
                    </span>
                    <span>{user ? `${overallMastery}%` : '—'}</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <span className="pill-chip">Age-appropriate</span>
                  <span className="pill-chip">Myth-busting</span>
                  <span className="pill-chip">Real-life skills</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-4 justify-content-center h-100"> 
              <div
                className="bg-gradient-pink text-white rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center shadow-sm playful-card"
                style={{ minHeight: '180px'}}
              >
                <DailyQuestion />
              </div>

              <Link
                to="/modules"
                className="d-block bg-white rounded-4 p-4 text-center text-decoration-none border border-4 border-blush shadow-sm border-purple w-100 module-card playful-card"
                style={{ minHeight: '240px' }}
              >
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <span style={{ fontSize: '4rem' }}>📚</span>
                  <h2 className="fw-bold text-deep-plum mt-3 mb-2">Modules</h2>
                  <p className="fs-6 text-pink mb-3">Level up your knowledge</p>
                  <span className="fs-2" style={{color: 'var(--deep-plum)' }}>→</span> 
                </div>
              </Link>

              <Link to="/resources" className="d-block bg-deep-plum rounded-4 p-4 text-center text-decoration-none border border-4 shadow-sm w-100 module-card resources-card playful-card" style={{ minHeight: '180px', borderColor: 'transparent' }}>
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <h2 className="text-white fw-bold mb-1">Resources</h2>
                  <p className="text-blush mb-3">Facts you can trust</p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">🧠</span>
                    <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">📖</span>
                    <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">💬</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;