import { Link } from 'react-router';

function Quiz() {
  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 justify-content-center">
          {/* Question Section - Left Side */}
          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end">
            <div className="bg-gradient-pink text-white rounded-4 p-4 d-flex flex-column justify-content-center shadow w-100" style={{ maxWidth: '400px', minHeight: '400px' }}>
              <h2 className="fs-5 mb-3 opacity-75">Question 1</h2>
              <p className="fs-4 fw-bold mb-0">
                This is a placeholder question text. What is the correct answer to this sample quiz question?
              </p>
            </div>
          </div>

          {/* Answers Section - Right Side */}
          <div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-start">
            <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: '500px' }}>
              <button className="btn btn-light border border-4 border-blush rounded-4 p-4 fs-5 fw-semibold text-deep-plum text-start border-purple">
                Answer 1
              </button>
              <button className="btn btn-light border border-4 border-blush rounded-4 p-4 fs-5 fw-semibold text-deep-plum text-start border-purple">
                Answer 2
              </button>
              <button className="btn btn-light border border-4 border-blush rounded-4 p-4 fs-5 fw-semibold text-deep-plum text-start border-purple">
                Answer 3
              </button>
              <button className="btn btn-light border border-4 border-blush rounded-4 p-4 fs-5 fw-semibold text-deep-plum text-start border-purple">
                Answer 4
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
