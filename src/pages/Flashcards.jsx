import { Link } from 'react-router';
import { FlashcardArray } from "react-quizlet-flashcard";
import "react-quizlet-flashcard/dist/index.css";

const flashcards = [
  {
    id: 1,
    front: {
      html: (
        <div className="d-flex align-items-center justify-content-center h-100 text-center fs-4 fw-bold text-deep-plum">
          What is a period?
        </div>
      ),
    },
    back: {
      html: (
        <div className="d-flex align-items-center justify-content-center h-100 text-center fs-5 text-muted">
          A period is when someone bleeds.
        </div>
      ),
    },
  },
  {
    id: 2,
    front: {
      html: (
        <div className="d-flex align-items-center justify-content-center h-100 text-center fs-4 fw-bold text-deep-plum">
          What is a pad?
        </div>
      ),
    },
    back: {
      html: (
        <div className="d-flex align-items-center justify-content-center h-100 text-center fs-5 text-muted">
          A pad is something.
        </div>
      ),
    },
  },
];

function Flashcards() {
  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="d-flex justify-content-start mb-4">
          <Link to="/Home" className="btn btn-outline-secondary rounded-pill px-4 py-2">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-deep-plum">Flashcards</h1>
          <p className="fs-5 text-muted">
            Test your knowledge by flipping through these quick review cards.
          </p>
        </div>

        <div className="bg-white rounded-4 p-4 shadow-sm border border-blush">
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: 420 }}
        >
            <FlashcardArray deck={flashcards} />
        </div>
        </div>

      </div>
    </div>
  );
}

export default Flashcards;
