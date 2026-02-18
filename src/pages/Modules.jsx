import { Link } from 'react-router';

const modules = [
  { id: 1, title: 'Sexual Anatomy and Hygiene', path: '/module/1' },
  { id: 2, title: 'STIs and STDs', path: '/module/2' },
  { id: 3, title: 'Digital Safety and Media Literacy', path: '/module/3' },
  { id: 4, title: 'Contraception and Pregnancy Prevention', path: '/module/4' },
  { id: 5, title: 'Consent & Healthy Relationships', path: '/module/5' },
  { id: 6, title: 'Gender and Sexual Orientation', path: '/module/6' },
];

export { modules };

function Modules() {
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