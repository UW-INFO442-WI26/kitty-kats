import { Link, useParams } from 'react-router';

function ModuleOverview() {
  const { id } = useParams();

  const modulesData = {
    1: {
      id: 1,
      title: 'Module 1',
      image: '/img/module-1-anatomy.png',
      questions: 12,
      progress: 0,
      description: 'This module covers...',
      quizPath: '/quiz'
    }
  };

  const module = modulesData[id] || modulesData[1];

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
          <div className="col-12 col-md-5 d-flex justify-content-end">
            <div className="d-flex gap-4 align-items-start">
              <div className="text-start">
                <p className="text-muted small mb-1">Questions</p>
                <p className="fs-4 fw-bold text-deep-plum mb-0">{module.questions}</p>
              </div>
              <div className="text-start">
                <p className="text-muted small mb-1">Progress</p>
                <div className="fs-4 fw-bold text-deep-plum mb-0">{module.progress}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="fs-5 text-muted lh-lg">
            {module.description}
          </p>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <Link
            to={module.quizPath}
            className="btn btn-primary rounded-pill px-5 py-3"
            style={{ fontSize: '1.1rem' }}
          >
            Start
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ModuleOverview;
