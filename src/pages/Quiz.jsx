import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { modules } from './Modules';
import { useAuth } from '../context/AuthContext';
import {
  getPointValues,
  loadModuleMastery,
  saveModuleMastery,
  scoreToMastery,
  MASTERY_THRESHOLD,
} from '../utils/masteryUtils';

function Quiz() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const moduleId = parseInt(id, 10) || 1;

  const moduleMeta = modules.find((m) => m.id === moduleId) || modules[0];

  const [questions, setQuestions]               = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading]                   = useState(true);
  const [selectedIndex, setSelectedIndex]       = useState(null);
  const [submitted, setSubmitted]               = useState(false);
  const [hasBeenWrong, setHasBeenWrong]         = useState(false);

  const [rawScore, setRawScore]                 = useState(0);
  const [baseRawScore, setBaseRawScore]         = useState(0);
  const [masteryPct, setMasteryPct]             = useState(0);
  const [pointValues, setPointValues]           = useState({ perCorrect: 10, perMiss: -2 });
  const [masteryLoaded, setMasteryLoaded]       = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function fetchData() {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'questions'),
          where('module', '==', moduleMeta.title)
        );
        const querySnapshot = await getDocs(q);
        const questionsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        questionsData.sort(() => Math.random() - 0.5);
        setQuestions(questionsData);

        const qCount = questionsData.length || 12;
        setPointValues(getPointValues(qCount));

        if (user) {
          const existing = await loadModuleMastery(user.uid, moduleId);
          if (existing) {
            setBaseRawScore(existing.rawScore || 0);
            setMasteryPct(existing.mastery || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load quiz data:', err);
      } finally {
        setMasteryLoaded(true);
        setLoading(false);
      }
    }

    fetchData();
  }, [authLoading, moduleId, moduleMeta.title, user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!masteryLoaded || questions.length === 0) return;
    const combined = baseRawScore + rawScore;
    const newMastery = scoreToMastery(combined);
    setMasteryPct(newMastery);

    if (user) {
      saveModuleMastery(user.uid, moduleId, combined, questions.length).catch(console.error);
    }
  }, [rawScore]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(index) {
    if (!submitted) setSelectedIndex(index);
  }

  function handleSubmit() {
    if (selectedIndex === null) return;
    const isNowCorrect = currentQuestion.answers[selectedIndex]?.correct;
    if (isNowCorrect) {
      setRawScore((prev) => prev + pointValues.perCorrect);
    } else {
      setHasBeenWrong(true);
      setRawScore((prev) => Math.max(prev + pointValues.perMiss, -baseRawScore));
    }
    setSubmitted(true);
  }

  function handleNext() {
    setSelectedIndex(null);
    setSubmitted(false);
    setHasBeenWrong(false);
    // Loop back to the first question instead of showing a completion screen
    setCurrentQuestionIndex((prev) =>
      prev + 1 >= questions.length ? 0 : prev + 1
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-vh-100 bg-gradient-light py-5 d-flex align-items-center justify-content-center">
        <p className="fs-4 text-deep-plum">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-vh-100 bg-gradient-light py-5 d-flex flex-column align-items-center justify-content-center gap-3">
        <p className="fs-4 text-deep-plum">No questions found for "{moduleMeta.title}".</p>
        <Link to={`/module/${moduleId}`} className="btn btn-outline-secondary rounded-pill px-4">
          ← Back to Module
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer  = selectedIndex !== null ? currentQuestion.answers[selectedIndex] : null;
  const isCorrect       = submitted && selectedAnswer?.correct;
  const isIncorrect     = submitted && !selectedAnswer?.correct;

  function getButtonStyle(index) {
    if (!submitted) {
      return selectedIndex === index
        ? 'bg-blush border-deep-plum text-deep-plum'
        : 'bg-white border-blush text-deep-plum';
    }
    if (isCorrect) {
      if (currentQuestion.answers[index].correct) return 'bg-success border-success text-white';
      return 'bg-white border-blush text-deep-plum opacity-50';
    }
    if (index === selectedIndex) return 'bg-danger border-danger text-white';
    return 'bg-white border-blush text-deep-plum';
  }

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>

        {/* Mastery progress bar */}
        <div className="mb-4 bg-white rounded-4 p-3 shadow-sm border border-blush d-flex align-items-center gap-3">
          <span className="text-deep-plum fw-semibold small" style={{ whiteSpace: 'nowrap' }}>
            Mastery
          </span>
          <div className="progress rounded-pill flex-grow-1" style={{ height: 10 }}>
            <div
              className="progress-bar bg-deep-plum"
              style={{ width: `${masteryPct}%`, transition: 'width 0.4s ease' }}
            />
          </div>
          <span className="fw-bold text-deep-plum small" style={{ whiteSpace: 'nowrap' }}>
            {masteryPct}%
          </span>
          {masteryPct >= MASTERY_THRESHOLD && (
            <span className="badge rounded-pill text-bg-success ms-1">Mastered 🏆</span>
          )}
        </div>

        <div className="row g-4 justify-content-center align-items-stretch">

          {/* Question card — no counter */}
          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end">
            <div
              className="bg-gradient-pink text-white rounded-4 p-4 d-flex flex-column justify-content-between shadow w-100"
              style={{ maxWidth: '400px', minHeight: '400px' }}
            >
              <div>
                <p className="fs-4 fw-bold mb-0">{currentQuestion.question}</p>
              </div>

              {hasBeenWrong && currentQuestion.feedback && (
                <div
                  className="mt-4 rounded-3 p-3"
                  style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
                >
                  <p className="mb-0 fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>
                    💡 {currentQuestion.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Answers */}
          <div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-start">
            <div
              className="d-flex flex-column w-100"
              style={{ maxWidth: '500px', minHeight: '400px' }}
            >
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {currentQuestion.answers.map((answer, index) => (
                  <button
                    key={index}
                    className={`rounded-4 p-3 text-center border border-2 shadow-sm w-100 transition ${getButtonStyle(index)}`}
                    style={{ cursor: isCorrect ? 'default' : 'pointer' }}
                    onClick={() => {
                      if (isCorrect) return;
                      if (isIncorrect) {
                        setSubmitted(false);
                        setSelectedIndex(index);
                      } else {
                        handleSelect(index);
                      }
                    }}
                  >
                    {answer.text}
                  </button>
                ))}
              </div>

              <div className="d-flex align-items-center gap-3 mt-3">
                {submitted && (
                  <span
                    className="fw-semibold d-flex align-items-center gap-1"
                    style={{
                      fontSize: '0.95rem',
                      color: isCorrect ? '#198754' : '#dc3545',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isCorrect ? `✅ Correct!` : `❌ Incorrect!`}
                  </span>
                )}

                {!submitted && <div className="flex-grow-1" />}

                {!isCorrect ? (
                  <button
                    className="btn btn-primary rounded-pill px-4 py-2 ms-auto"
                    onClick={handleSubmit}
                    disabled={selectedIndex === null || submitted}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="btn btn-primary rounded-pill px-4 py-2 ms-auto"
                    onClick={handleNext}
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Quiz;