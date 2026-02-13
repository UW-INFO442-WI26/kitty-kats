import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestions() {
      // access collection 'questions' in firestore
      const querySnapshot = await getDocs(collection(db, "questions")); 
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      questionsData.sort(() => Math.random() - 0.5); // shuffle questions
      setQuestions(questionsData);
      setLoading(false);
    }
    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 bg-gradient-light py-5 d-flex align-items-center justify-content-center">
        <p className="fs-4 text-deep-plum">Loading questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-vh-100 bg-gradient-light py-5">
      <div className="container" style={{ maxWidth: '1100px' }}>
        <div className="row g-4 justify-content-center">
          {/* Question Section - Left Side */}
          <div className="col-12 col-md-5 d-flex justify-content-center justify-content-md-end">
            <div className="bg-gradient-pink text-white rounded-4 p-4 d-flex flex-column justify-content-center shadow w-100" style={{ maxWidth: '400px', minHeight: '400px' }}>
              <h2 className="fs-5 mb-3 opacity-75">Question {currentQuestionIndex + 1}</h2>
              <p className="fs-4 fw-bold mb-0">
                {currentQuestion.question}
              </p>
            </div>
          </div>

          {/* Answers Section - Right Side */}
          <div className="col-12 col-md-7 d-flex justify-content-center justify-content-md-start">
            <div className="d-flex flex-column gap-3 w-100" style={{ maxWidth: '500px' }}>
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  className="bg-white rounded-4 p-3 text-center text-deep-plum border border-2 border-blush shadow-sm hover-shadow-lg transition w-100"
                  onClick={() => {
                    if (answer.correct) {
                      console.log('Correct!');
                      // next question
                      if (currentQuestionIndex < questions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                      }
                    } else {
                      console.log('Incorrect!');
                    }
                  }}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
