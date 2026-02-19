import { Link, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { modules } from './Modules';

function Quiz() {
  const { id } = useParams();
  const moduleId = parseInt(id, 10) || 1;

  const moduleMeta = modules.find((m) => m.id === moduleId) || modules[0];

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [hasBeenWrong, setHasBeenWrong] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
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
      setLoading(false);
    }
    fetchQuestions();
  }, [moduleId, moduleMeta.title]);

  function handleSelect(index) {
    if (!submitted) setSelectedIndex(index);
  }

  function handleSubmit() {
    if (selectedIndex === null) return;
    const isNowCorrect = currentQuestion.answers[selectedIndex]?.correct;
    if (!isNowCorrect) setHasBeenWrong(true);
    setSubmitted(true);
  }

  function handleNext() {
    setSelectedIndex(null);
    setSubmitted(false);
    setHasBeenWrong(false);
    setCurrentQuestionIndex((prev) => prev + 1);
  }

  if (loading) {
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

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="min-vh-100 bg-gradient-light py-5 d-flex flex-column align-items-center justify-content-center gap-4">
        <h2 className="text-deep-plum fw-bold fs-2">Quiz Complete! 🎉</h2>
        <p className="text-muted fs-5">You've answered all {questions.length} questions.</p>
        <Link to={`/module/${moduleId}`} className="btn btn-primary rounded-pill px-5 py-3">
          ← Back to Module
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedIndex !== null ? currentQuestion.answers[selectedIndex] : null;
  const isCorrect = submitted && selectedAnswer?.correct;
  const isIncorrect = submitted && !selectedAnswer?.correct;

  function getButtonStyle(index) {
    if (!submitted) {
      return selectedIndex === index
        ? 'bg-blush border-deep-plum text-deep-plum'
        : 'bg-white border-blush text-deep-plum';
    }
    // On correct: green the right answer, gray everything else
    if (isCorrect) {
      if (currentQuestion.answers[index].correct) return 'bg-success border-success text-white';
      return 'bg-white border-blush text-deep-plum opacity-50';
    }
    // On incorrect: only red the selected pick, leave everything else normal
    if (index === selectedIndex) return 'bg-danger border-danger text-white';
    return 'bg-white border-blush text-deep-plum';
  }

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 justify-content-center align-items-stretch">

          {/* Question Section */}
          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end">
            <div
              className="bg-gradient-pink text-white rounded-4 p-4 d-flex flex-column justify-content-between shadow w-100"
              style={{ maxWidth: '400px', minHeight: '400px' }}
            >
              <div>
                <h2 className="fs-5 mb-3 opacity-75">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </h2>
                <p className="fs-4 fw-bold mb-0">{currentQuestion.question}</p>
              </div>

              {/* Persistent feedback — shows once wrong and stays */}
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

          {/* Answers + Submit Section */}
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
                      // After a wrong guess, clicking resets submitted and selects
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
                    {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                  </span>
                )}

                {!submitted && <div className="flex-grow-1" />}

                {/* Always show Submit until correct, then switch to Next */}
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
                    {currentQuestionIndex < questions.length - 1 ? 'Next →' : 'Finish Quiz'}
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