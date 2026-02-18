import { Link } from 'react-router';

function Resources() {
  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="d-flex justify-content-start mb-4">
          <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 py-2">
            ← Back to Home
          </Link>
        </div>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-deep-plum">Resources</h1>
          <p className="fs-5 text-muted">Explore additional tools and information to support your learning journey.</p>
        </div>
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="bg-white rounded-4 p-4 shadow-sm border border-blush h-100">
              <h3 className="fw-bold text-deep-plum mb-3">Why Resources Matter</h3>
              <p className="text-muted lh-lg">
                Sexual health education is an ongoing process. These carefully selected resources provide reliable information, support networks, and tools to help you navigate questions and challenges. Remember, seeking knowledge is a sign of strength and responsibility.
              </p>
              <p className="text-muted lh-lg">
                Whether you're looking for more in-depth articles, community support, or professional guidance, these links connect you to trusted sources that align with our commitment to accurate, inclusive, and stigma-free education.
              </p>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-4">
              <div className="bg-white rounded-4 p-4 shadow-sm border border-blush text-decoration-none hover-card">
                <h4 className="fw-bold text-deep-plum mb-2">Planned Parenthood</h4>
                <p className="text-muted mb-3">Comprehensive sexual health information, including contraception, STD testing, and reproductive rights.</p>
                <a href="https://www.plannedparenthood.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-3 py-1">Visit Site</a>
              </div>
              <div className="bg-white rounded-4 p-4 shadow-sm border border-blush text-decoration-none hover-card">
                <h4 className="fw-bold text-deep-plum mb-2">Scarleteen</h4>
                <p className="text-muted mb-3">Sex education and support for teens and young adults, focusing on relationships, bodies, and sexuality.</p>
                <a href="https://www.scarleteen.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-3 py-1">Visit Site</a>
              </div>
              <div className="bg-white rounded-4 p-4 shadow-sm border border-blush text-decoration-none hover-card">
                <h4 className="fw-bold text-deep-plum mb-2">CDC Sexual Health</h4>
                <p className="text-muted mb-3">Official government resources on sexual health, STD prevention, and healthy relationships.</p>
                <a href="https://www.cdc.gov/sexualhealth/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-3 py-1">Visit Site</a>
              </div>
              <div className="bg-white rounded-4 p-4 shadow-sm border border-blush text-decoration-none hover-card">
                <h4 className="fw-bold text-deep-plum mb-2">The Trevor Project</h4>
                <p className="text-muted mb-3">Crisis intervention and suicide prevention for LGBTQ youth, including 24/7 support.</p>
                <a href="https://www.thetrevorproject.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-pill px-3 py-1">Visit Site</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;

