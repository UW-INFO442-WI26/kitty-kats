import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';


function Profile() {
    const { user } = useAuth();

    let displayName = 'Anonymous Learner';
    if (user && user.displayName) {
        displayName = user.displayName;
    }

    let email = null;
    if (user && user.email) {
    email = user.email;
    }

    let photoURL = null;
    if (user && user.photoURL) {
    photoURL = user.photoURL;
    }

    let isAnonymous = true;
    if (user && !user.isAnonymous) {
    isAnonymous = false;
    }

    //hardcode now, change with firestore dabatabase
    const moduleProgress = [
        { id: 1, title: 'Module 1', progress: 100, score: 92,  badge: '🏆' },
        { id: 2, title: 'Module 2', progress: 60,  score: null, badge: '📚' },
        { id: 3, title: 'Module 3', progress: 0,   score: null, badge: '🔒' },
        { id: 4, title: 'Module 4', progress: 0,   score: null, badge: '🔒' },
        { id: 5, title: 'Module 5', progress: 0,   score: null, badge: '🔒' },
        { id: 6, title: 'Module 6', progress: 0,   score: null, badge: '🔒' },
    ];
    let completedCount = 0;
    for (let i = 0; i < moduleProgress.length; i++) {
        if (moduleProgress[i].progress === 100) {
        completedCount = completedCount + 1;
        }
    }
    let totalProgress = 0;
    for (let i = 0; i < moduleProgress.length; i++) {
        totalProgress = totalProgress + moduleProgress[i].progress;
    }
    const overallProgress = Math.round(totalProgress / moduleProgress.length);

    return (
        <div className="min-vh-100 bg-gradient-light py-5">
            <div className="container" style={{ maxWidth: '900px' }}>
            <div className="bg-deep-plum rounded-4 p-4 mb-4 shadow-sm d-flex align-items-center gap-4 flex-wrap">
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 overflow-hidden"
                    style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', fontSize: '2.5rem' }}
                >
                    {photoURL ? (
                        <img src={photoURL} alt="profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                    ) : (
                        '🐱'
                    )}
            </div>
            <div className="row g-3 mb-4">
                <div className="col-4">
                    <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
                        <div style={{ fontSize: '2rem' }}>📘</div>
                        <div className="fs-4 fw-bold text-deep-plum">{completedCount} / {moduleProgress.length}</div>
                        <div className="text-muted small">Modules Done</div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
                        <div style={{ fontSize: '2rem' }}>📊</div>
                        <div className="fs-4 fw-bold text-deep-plum">{overallProgress}%</div>
                        <div className="text-muted small">Overall Progress</div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="bg-white rounded-4 p-3 text-center shadow-sm border border-blush h-100">
                        <div style={{ fontSize: '2rem' }}>🔥</div>
                        <div className="fs-4 fw-bold text-deep-plum">1</div>
                        <div className="text-muted small">Day Streak</div>
                </div>
            </div>
            {/* Progress bar */}
            <div className="bg-white rounded-4 p-4 mb-4 shadow-sm border border-blush">
                <h2 className="text-deep-plum fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Overall Progress</h2>
                <ProgressBar value={overallProgress} showLabel={false} />
                <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>{completedCount} of {moduleProgress.length} modules completed</span>
                    <span>{overallProgress}%</span>
                </div>
            </div>
            <div className="flex-grow-1">
                <h1 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
                    {displayName}
                </h1>
                {email ? (
                    <p className="text-blush mb-0 small">{email}</p>
                ) : (
                    <p className="text-blush mb-0 small opacity-75">Learning anonymously</p>
                )}
            </div>

            {isAnonymous && (
                <Link to="/login" className="btn btn-outline-light rounded-pill px-3 py-2 small flex-shrink-0">
                    Sign in to save progress
                </Link>
            )}

        </div>
        </div>
    </div>

    );
  }
  
  export default Profile;