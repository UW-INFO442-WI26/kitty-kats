import { Link, useParams, useLocation } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { modules } from './Modules';

function Flashcards() {
  const { id } = useParams();
  const location = useLocation();
  const highlightTerm = location.state?.highlightTerm ?? null;

  const initialModuleId = useMemo(() => {
    if (!id) return 'all';
    const parsedId = parseInt(id, 10);
    return Number.isNaN(parsedId) ? 'all' : String(parsedId);
  }, [id]);
  const [selectedModuleId, setSelectedModuleId] = useState(initialModuleId);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedModule = useMemo(() => {
    if (selectedModuleId === 'all') return null;
    const moduleId = parseInt(selectedModuleId, 10);
    return modules.find((m) => m.id === moduleId) || null;
  }, [selectedModuleId]);

  useEffect(() => {
    setSelectedModuleId(initialModuleId);
  }, [initialModuleId]);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
      const baseRef = collection(db, 'flashcards');
      const q = selectedModule
        ? query(baseRef, where('module', '==', selectedModule.title))
        : baseRef;
      const querySnapshot = await getDocs(q);
      const flashcardData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(flashcardData);
      setLoading(false);
    }
    fetchFlashcards();
  }, [selectedModule]);

  const deck = useMemo(
    () =>
      cards.map((card, index) => {
        const frontText = card.front ?? card.term ?? card.question ?? '';
        const backText = card.back ?? card.definition ?? card.answer ?? '';
        const link = card.link ?? null;
        return {
          id: card.id || index,
          frontText, // raw text used for seeking via highlightTerm
          front: {
            html: (
              <div className="d-flex align-items-center justify-content-center h-100 text-center fs-4 fw-bold text-deep-plum">
                {frontText}
              </div>
            ),
          },
          back: {
            html: (
              <div className="d-flex flex-column align-items-center h-100 text-center px-2" style={{ justifyContent: 'space-between', paddingTop: '28px', paddingBottom: '18px' }}>
                <div className="fs-5 text-muted d-flex align-items-center flex-grow-1">{backText}</div>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: '0.75rem',
                      color: '#0d6efd',
                      textDecoration: 'underline',
                    }}
                  >
                    More info!
                  </a>
                ) : (
                  <div style={{ height: '1rem' }} />
                )}
              </div>
            ),
          },
        };
      }),
    [cards]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (deck.length === 0) return;

    if (highlightTerm) {
      const idx = deck.findIndex(
        (card) => card.frontText.toLowerCase() === highlightTerm.toLowerCase()
      );
      setActiveIndex(idx !== -1 ? idx : 0);
    } else {
      setActiveIndex(0);
    }

    setFlipped(false);
  }, [deck, highlightTerm]);

  const activeCard = deck[activeIndex];

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="d-flex justify-content-start mb-4">
          <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 py-2">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-deep-plum">Flashcards</h1>
          <p className="fs-5 text-muted">
            Test your knowledge by flipping through these quick review cards.
          </p>
        </div>

        <div className="d-flex flex-column flex-md-row align-items-md-end gap-3 mb-4">
          <div className="flex-grow-1">
            <label className="form-label fw-semibold text-deep-plum">Filter by module</label>
            <select
              className="form-select rounded-pill px-4 py-2 border-2 border-blush"
              value={selectedModuleId}
              onChange={(event) => setSelectedModuleId(event.target.value)}
            >
              <option value="all">All modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
          <div className="text-muted">
            {selectedModule ? `Showing ${selectedModule.title}` : 'Showing all flashcards'}
          </div>
        </div>

        <div className="bg-white rounded-4 p-4 shadow-sm border border-blush">
          {loading ? (
            <div className="d-flex align-items-center justify-content-center" style={{ height: 420 }}>
              <p className="fs-4 text-deep-plum">Loading flashcards...</p>
            </div>
          ) : deck.length === 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center gap-2" style={{ height: 420 }}>
              <p className="fs-4 text-deep-plum mb-0">
                {selectedModule
                  ? `No flashcards found for "${selectedModule.title}".`
                  : 'No flashcards found.'}
              </p>
              <Link to="/modules" className="btn btn-outline-secondary rounded-pill px-4 py-2">
                Browse Modules
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center justify-content-center gap-4" style={{ height: 420 }}>
              <div className="w-100 d-flex align-items-center justify-content-between">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => {
                    setFlipped(false);
                    setActiveIndex((prev) => (prev === 0 ? deck.length - 1 : prev - 1));
                  }}
                >
                  ← Prev
                </button>
                <div className="text-muted">
                  {activeIndex + 1} / {deck.length}
                </div>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={() => {
                    setFlipped(false);
                    setActiveIndex((prev) => (prev === deck.length - 1 ? 0 : prev + 1));
                  }}
                >
                  Next →
                </button>
              </div>
              <button
                className="border-0 bg-transparent w-100 d-flex align-items-center justify-content-center"
                onClick={() => setFlipped((prev) => !prev)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="rounded-4 shadow-sm border border-blush w-100 d-flex align-items-center justify-content-center text-center px-4"
                  style={{ maxWidth: 640, height: 260, background: flipped ? '#fdecef' : '#ffffff' }}
                >
                  {flipped ? activeCard?.back?.html : activeCard?.front?.html}
                </div>
              </button>
              <div className="text-muted">Tap the card to flip</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Flashcards;