import { Link } from 'react-router';

function Home() {
  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 justify-content-center">
          {/* Left Column */}
          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end">
            <div className="d-flex flex-column gap-4 w-100" style={{ maxWidth: '400px' }}>
              {/* Streak Section */}
              <div className="bg-gradient-pink text-white rounded-4 p-4 text-center d-flex flex-column align-items-center justify-content-center shadow" style={{ minHeight: '180px' }}>
                <span style={{ fontSize: '3.5rem' }}>🔥</span>
                <span className="fs-4 fw-bold mt-2">You're on a 1 day streak!</span>
              </div>

              {/* Resources Section */}
              <div className="bg-deep-plum rounded-4 p-4 text-center shadow" style={{ minHeight: '180px' }}>
                <h2 className="text-white fw-bold mb-1">Resources</h2>
                <p className="text-blush mb-3">Trusted information & support</p>
                <div className="d-flex justify-content-center gap-3">
                  <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">📖</span>
                  <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">🔗</span>
                  <span className="fs-2 bg-white bg-opacity-10 p-2 rounded-3" role="button">💬</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modules Section - Right Side */}
          <div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-start">
            <Link 
              to="/quiz" 
              className="d-block bg-white rounded-4 p-5 text-center text-decoration-none border border-4 border-blush shadow-sm border-purple w-100"
              style={{ maxWidth: '500px', minHeight: '400px', transition: 'all 0.3s ease' }}
            >
              <div className="d-flex flex-column align-items-center justify-content-center h-100">
                <span style={{ fontSize: '5rem' }}>📚</span>
                <h1 className="display-4 fw-bold text-deep-plum mt-3 mb-2">Modules</h1>
                <p className="fs-5 text-pink mb-3">Start your learning journey</p>
                <span className="fs-1 text-primary">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;