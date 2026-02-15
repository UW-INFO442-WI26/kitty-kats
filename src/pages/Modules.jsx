import { Link } from 'react-router';

function Modules() {
  const modules = [
    { id: 1, title: 'Module 1', path: '/module/1' },
    { id: 2, title: 'Module 2', path: null },
    { id: 3, title: 'Module 3', path: null },
    { id: 4, title: 'Module 4', path: null },
    { id: 5, title: 'Module 5', path: null },
    { id: 6, title: 'Module 6', path: null },
  ];

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 className="text-center text-deep-plum fw-bold mb-5">Modules</h1>
        <div className="row g-4">
          {modules.map((module) => (
            <div key={module.id} className="col-6">
              {module.path ? (
                <Link
                  to={module.path}
                  className="d-block bg-white rounded-4 p-4 text-center text-decoration-none border border-3 border-blush shadow-sm w-100"
                  style={{ minHeight: '150px', transition: 'all 0.3s ease' }}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <span style={{ fontSize: '2.5rem' }}>📚</span>
                    <h2 className="fs-4 fw-bold text-deep-plum mt-2 mb-0">{module.title}</h2>
                  </div>
                </Link>
              ) : (
                <div
                  className="d-block bg-white rounded-4 p-4 text-center border border-3 border-blush shadow-sm w-100 opacity-50"
                  style={{ minHeight: '150px', cursor: 'not-allowed' }}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <span style={{ fontSize: '2.5rem' }}>🔒</span>
                    <h2 className="fs-4 fw-bold text-deep-plum mt-2 mb-0">{module.title}</h2>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modules;
