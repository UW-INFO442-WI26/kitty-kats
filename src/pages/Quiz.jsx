import { Link } from 'react-router';

function Quiz() {
  return (
    <div className="quiz-container">
      {/* Question Section - Left Side */}
      <div className="quiz-question-section">
        <h2 className="quiz-question-title">Question 1</h2>
        <p className="quiz-question-text">
          This is a placeholder question text. What is the correct answer to this sample quiz question?
        </p>
      </div>

      {/* Answers Section - Right Side */}
      <div className="quiz-answers-section">
        <button className="quiz-answer-btn">Answer 1</button>
        <button className="quiz-answer-btn">Answer 2</button>
        <button className="quiz-answer-btn">Answer 3</button>
        <button className="quiz-answer-btn">Answer 4</button>
      </div>
    </div>
  );
}

export default Quiz;
