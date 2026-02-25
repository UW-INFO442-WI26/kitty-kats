import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { defaultDailyPrompts } from '../data/defaultDailyPrompts';

const DAILY_PROMPT_STORAGE_KEY = 'dailyPromptProgress.v1';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function DailyQuestion() {
  const [answering, setAnswering] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState('');
  const [streak, setStreak] = useState(0);
  const [lastAnsweredDate, setLastAnsweredDate] = useState(null);
  const [answersByDate, setAnswersByDate] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [prompts, setPrompts] = useState(defaultDailyPrompts);
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const todayKey = getDateKey(new Date());
  const yesterdayKey = getDateKey(new Date(Date.now() - DAY_IN_MS));
  const answeredToday = Boolean(answersByDate[todayKey]);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(DAILY_PROMPT_STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setStreak(Number(parsed?.streak) || 0);
        setLastAnsweredDate(parsed?.lastAnsweredDate || null);
        setAnswersByDate(parsed?.answersByDate || {});
      }
    } catch (error) {
      console.error('Failed to load daily prompt progress from localStorage:', error);
    } finally {
      setProgressLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      localStorage.setItem(
        DAILY_PROMPT_STORAGE_KEY,
        JSON.stringify({
          streak,
          lastAnsweredDate,
          answersByDate,
        })
      );
    } catch (error) {
      console.error('Failed to save daily prompt progress to localStorage:', error);
    }
  }, [progressLoaded, streak, lastAnsweredDate, answersByDate]);

  useEffect(() => {
    const todayAnswer = answersByDate[todayKey] ?? '';
    setSubmittedAnswer(todayAnswer);
    setAnswered(Boolean(todayAnswer));
  }, [answersByDate, todayKey]);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const promptQuery = query(collection(db, 'dailyPrompts'), orderBy('order', 'asc'));
        const snapshot = await getDocs(promptQuery);
        const firestorePrompts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (firestorePrompts.length > 0) {
          setPrompts(firestorePrompts);
        }
      } catch (error) {
        console.error('Failed to load daily prompts from Firestore:', error);
      } finally {
        setLoadingPrompt(false);
      }
    }

    loadPrompts();
  }, []);

  const dailyPrompt = useMemo(() => {
    if (!prompts.length) return null;
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dayIndex = Math.floor(startOfDay.getTime() / 86400000);
    return prompts[dayIndex % prompts.length];
  }, [prompts]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const trimmedAnswer = answer.trim();
    const nextAnswers = { ...answersByDate, [todayKey]: trimmedAnswer };

    if (!answeredToday) {
      const nextStreak = lastAnsweredDate === yesterdayKey ? streak + 1 : 1;
      setStreak(nextStreak);
      setLastAnsweredDate(todayKey);
    }

    setAnswersByDate(nextAnswers);
    setSubmittedAnswer(trimmedAnswer);
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
            <h3 className="fs-6 fw-bold mb-0">Daily Prompt</h3>
          </div>
          {dailyPrompt?.category && (
            <p className="mb-1 text-white-50 text-start small fw-semibold">{dailyPrompt.category}</p>
          )}
          <p className="mb-3 text-start">
            {loadingPrompt ? 'Loading daily prompt...' : dailyPrompt?.prompt ?? 'No daily prompt found.'}
          </p>
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
          <span className="fs-4 fw-bold mt-2">
            {streak > 0 ? `You're on a ${streak} day streak!` : 'Start your streak today!'}
          </span>
          {answeredToday && <span className="text-white-50 mb-3">Come back tomorrow to grow it</span>}
          <button
            className="btn btn-outline-secondary rounded-pill px-4 py-2 mt-3"
            onClick={answeredToday ? handleView : () => setAnswering(true)}
          >
            {answeredToday ? 'View answer' : 'Complete Daily Prompt'}
          </button>
        </div>
      )}
    </>
  );
}

export default DailyQuestion;
