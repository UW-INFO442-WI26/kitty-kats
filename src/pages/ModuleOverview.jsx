import { Link, useParams } from 'react-router';
import { modules } from './Modules';

const modulesData = {
  1: {
    image: '/img/module-1-anatomy.png',
    questions: 12,
    progress: 0,
    description: 'This module covers sexual anatomy, hygiene, and bodily health.',
  },
  2: {
    image: '/img/module-2-STDs.jpg',
    questions: 12,
    progress: 0,
    description: 'This module covers sexually transmitted infections and diseases, their prevention, and treatment.',
  },
  3: {
    image: '/img/module-3-literacy.jpg',
    questions: 12,
    progress: 0,
    description: 'This module covers digital safety, media literacy, and navigating online spaces responsibly.',
  },
  4: {
    image: '/img/module-4-contraception.png',
    questions: 12,
    progress: 0,
    description: 'This module covers contraception methods, pregnancy prevention, and reproductive choices.',
  },
  5: {
    image: '/img/module-5-consent.jpg',
    questions: 12,
    progress: 0,
    description: 'This module covers consent, healthy relationships, and communicating boundaries.',
  },
  6: {
    image: '/img/module-6-orientation.jpg',
    questions: 12,
    progress: 0,
    description: 'This module covers gender identity, sexual orientation, and the spectrum of human diversity.',
  },
};

function ModuleOverview() {
  const { id } = useParams();
  const moduleId = parseInt(id, 10) || 1;

  const moduleMeta = modules.find((m) => m.id === moduleId) || modules[0];
  const moduleExtra = modulesData[moduleId] || modulesData[1];

  const module = {
    ...moduleMeta,
    ...moduleExtra,
  };

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
          {/* Pass moduleId as a URL param so Quiz knows which module to load */}
          <Link
            to={`/quiz/${moduleId}`}
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