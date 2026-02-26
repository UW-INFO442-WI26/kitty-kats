import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Quiz from '../pages/Quiz';

// Fake a logged-in non-anonymous user
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', isAnonymous: false } }),
}));

// Mock useNavigate so the redirect useEffect is a no-op in tests
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => vi.fn() };
});

// Mock Firebase db object
vi.mock('../firebase', () => ({ db: {} }));

// Mock masteryUtils so it doesn't try to reach Firestore
vi.mock('../utils/masteryUtils', () => ({
  getPointValues:    () => ({ perCorrect: 10, perMiss: -3 }),
  loadModuleMastery: vi.fn(() => Promise.resolve(null)),
  saveModuleMastery: vi.fn(() => Promise.resolve()),
  scoreToMastery:    (n) => Math.min(100, Math.max(0, Math.round(n))),
  MASTERY_THRESHOLD: 100,
}));

// Mock Firestore with 2 fake questions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query:      vi.fn(),
  where:      vi.fn(),
  getDocs:    vi.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: '1',
          data: () => ({
            question: 'What is the most common STI?',
            module:   'STIs and STDs',
            answers: [
              { text: 'Chlamydia',  correct: true  },
              { text: 'HIV',        correct: false },
              { text: 'Gonorrhea',  correct: false },
            ],
          }),
        },
        {
          id: '2',
          data: () => ({
            question: 'How is chlamydia transmitted?',
            module:   'STIs and STDs',
            answers: [
              { text: 'Sexual contact',      correct: true  },
              { text: 'Touching a doorknob', correct: false },
              { text: 'Sharing food',        correct: false },
            ],
          }),
        },
      ],
    })
  ),
}));

const renderQuiz = () =>
  render(
    <MemoryRouter initialEntries={['/quiz/2']}>
      <Routes>
        <Route path="/quiz/:id" element={<Quiz />} />
      </Routes>
    </MemoryRouter>
  );

describe('Quiz page', () => {

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    cleanup();              // unmount rendered components so DOM is fresh each test
    vi.restoreAllMocks();  // restores Math.random spy; does not touch vi.mock() factories
  });

  it('shows loading state initially', () => {
    renderQuiz();
    expect(screen.getByText('Loading questions...')).toBeTruthy();
  });

  it('renders a question after loading', async () => {
    renderQuiz();
    await waitFor(() =>
      expect(screen.getByText('What is the most common STI?')).toBeTruthy()
    );
  });

  it('renders answer buttons', async () => {
    renderQuiz();
    await waitFor(() => expect(screen.getByText('Chlamydia')).toBeTruthy());
    expect(screen.getByText('HIV')).toBeTruthy();
    expect(screen.getByText('Gonorrhea')).toBeTruthy();
  });

  it('advances to next question on correct answer + submit', async () => {
    renderQuiz();
    await waitFor(() => screen.getByText('Chlamydia'));
    fireEvent.click(screen.getByText('Chlamydia'));
    await waitFor(() => screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    await waitFor(() =>
      expect(screen.getByText('How is chlamydia transmitted?')).toBeTruthy()
    );
  });

  it('shows Incorrect when wrong answer is submitted', async () => {
    renderQuiz();
    await waitFor(() => screen.getByText('HIV'));
    fireEvent.click(screen.getByText('HIV'));
    await waitFor(() => screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() =>
      expect(screen.getByText('❌ Incorrect!')).toBeTruthy()
    );
  });

});