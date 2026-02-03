import { Link } from 'react-router';

function Home() {
  return (
    <div className="home-container">
      {/* Left Column */}
      <div className="left-column">
        {/* Streak Section - Top Left */}
        <div className="streak-section">
          <span className="streak-icon">🔥</span>
          <span className="streak-text">You're on a 1 day streak!</span>
        </div>

        {/* Resources Section - Bottom Left */}
        <div className="resources-section">
          <h2 className="resources-title">Resources</h2>
          <p className="resources-subtitle">Trusted information & support</p>
          <div className="resources-icons">
            <span>📖</span>
            <span>🔗</span>
            <span>💬</span>
          </div>
        </div>
      </div>

      {/* Modules Section - Right Side */}
      <Link to="/quiz" className="modules-section">
        <div className="modules-content">
          <span className="modules-icon">📚</span>
          <h1 className="section-title">Modules</h1>
          <p className="section-subtitle">Start your learning journey</p>
          <span className="modules-arrow">→</span>
        </div>
      </Link>
    </div>
  );
}

export default Home;