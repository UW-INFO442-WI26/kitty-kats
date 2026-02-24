import { useState } from 'react';

const DAILY_QUESTIONS = [
  "What is one thing you learned today that surprised you about sexual health?",
  "How would you explain consent to a friend in your own words?",
  "What's a stigma around sexual education that you'd like to break?",
  "What's one question about sexual health you've always wanted to ask?"
];

function DailyQuestion() {
  const [answering, setAnswering] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState('');

  const getDailyQuestion = () => {
    const today = new Date().toDateString();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return DAILY_QUESTIONS[hash % DAILY_QUESTIONS.length];
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    setSubmittedAnswer(answer);
    setAnswer('');
    setAnswering(false);
    setAnswered(true);
  };

  const handleView = () => setAnswering(true);

  const handleEdit = () => {
    setAnswer(submittedAnswer);
    setAnswered(false);
  };

  const handleBack = () => {
    setAnswering(false);
    setAnswer('');
  };

  return (
    <>
      {answering ? (
        <div className="w-100 d-flex flex-column" style={{ minHeight: '160px' }}>
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-link p-0 me-2"
              onClick={handleBack}
              style={{ fontSize: '1.5rem', color: 'white' }}
              title="Back"
            >
              ←
            </button>
            <h3 className="fs-6 fw-bold mb-0">Daily Question</h3>
          </div>
          <p className="mb-3 text-start">{getDailyQuestion()}</p>
          <textarea
            className="form-control mb-3"
            rows="3"
            placeholder="Type your answer here..."
            value={answered ? submittedAnswer : answer}
            onChange={(e) => setAnswer(e.target.value)}
            readOnly={answered}
            style={{ backgroundColor: 'white', color: '#000' }}
          />
          <div className="d-flex justify-content-center gap-2">
            {!answered ? (
              <button
                className={`btn btn-outline-secondary rounded-pill px-4 py-2${!answer.trim() ? ' btn-disabled-visible' : ''}`}
                onClick={handleSubmit}
                disabled={!answer.trim()}
              >
                Submit
              </button>
            ) : (
              <>
                <button
                  className="btn btn-outline-secondary rounded-pill px-4 py-2"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center justify-content-center h-100">
          <span style={{ fontSize: '3.5rem' }}>🔥</span>
          <span className="fs-4 fw-bold mt-2">You're on a 1 day streak!</span>
          {answered && <span className="text-white-50 mb-3">Come back tomorrow to grow it</span>}
          <button
            className="btn btn-outline-secondary rounded-pill px-4 py-2 mt-3"
            onClick={answered ? handleView : () => setAnswering(true)}
          >
            {answered ? 'View answer' : 'Complete Daily Question'}
          </button>
        </div>
      )}
    </>
  );
}

export default DailyQuestion;
