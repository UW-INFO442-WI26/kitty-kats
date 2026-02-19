import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // <-- was missing entirely
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Quiz from '../pages/Quiz';

// Mock Firebase so we don't need a real connection
vi.mock('../firebase', () => ({ db: {} }));

// Mock Firestore with 2 fake questions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: '1',
          data: () => ({
            question: 'What is the most common STI?',
            module: 'STIs and STDs',
            answers: [
              { text: 'Chlamydia', correct: true },
              { text: 'HIV', correct: false },
              { text: 'Gonorrhea', correct: false },
            ],
          }),
        },
        {
          id: '2',
          data: () => ({
            question: 'How is chlamydia transmitted?',
            module: 'STIs and STDs',
            answers: [
              { text: 'Sexual contact', correct: true },
              { text: 'Touching a doorknob', correct: false },
              { text: 'Sharing food', correct: false },
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
    vi.clearAllMocks();
    // Pin Math.random so shuffle doesn't reorder questions
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // While Firestore is loading, a loading message should show
  it('shows loading state initially', () => {
    renderQuiz();
    expect(screen.getByText('Loading questions...')).toBeTruthy();
  });

  // After loading, the first question should appear on screen
  it('renders a question after loading', async () => {
    renderQuiz();
    await waitFor(() =>
      expect(screen.getByText('What is the most common STI?')).toBeTruthy()
    );
  });

  // After loading, the answer buttons should be visible
  it('renders answer buttons', async () => {
    renderQuiz();
    await waitFor(() => expect(screen.getByText('Chlamydia')).toBeTruthy());
    expect(screen.getByText('HIV')).toBeTruthy();
    expect(screen.getByText('Gonorrhea')).toBeTruthy();
  });

  // Select correct answer then click Submit → Next should appear, then advance
  it('advances to next question on correct answer + submit', async () => {
    renderQuiz();
    await waitFor(() => screen.getByText('Chlamydia'));
    fireEvent.click(screen.getByText('Chlamydia')); // select answer
    fireEvent.click(screen.getByText('Submit'));     // confirm it
    fireEvent.click(screen.getByText('Next →'));     // advance to next question
    await waitFor(() =>
      expect(screen.getByText('How is chlamydia transmitted?')).toBeTruthy()
    );
  });

  // Select wrong answer then Submit — UI should show '❌ Incorrect!' text
  // (Quiz no longer uses console.log; incorrect state is shown in the UI instead)
  it('shows Incorrect feedback when wrong answer is submitted', async () => {
    renderQuiz();
    await waitFor(() => screen.getByText('HIV'));
    fireEvent.click(screen.getByText('HIV'));        // select wrong answer
    fireEvent.click(screen.getByText('Submit'));     // confirm it
    await waitFor(() =>
      expect(screen.getByText('❌ Incorrect!')).toBeTruthy()
    );
  });

});