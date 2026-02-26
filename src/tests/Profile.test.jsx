import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Profile from '../pages/Profile';

vi.mock('../firebase',        () => ({ db: {} }));
vi.mock('../firebase/firestore', () => ({ collection: vi.fn(), getDocs: vi.fn(() => Promise.resolve({ docs: [] })) }));
vi.mock('../components/AuthModal', () => ({ default: () => null }));

vi.mock('../utils/masteryUtils', () => ({
  loadAllMastery:    vi.fn(() => Promise.resolve({})),
  MASTERY_THRESHOLD: 80,
}));

vi.mock('../utils/dailyPromptProgress', () => ({
  loadDailyPromptProgress: vi.fn(() => Promise.resolve({ streak: 0 })),
}));

afterEach(() => cleanup());

// ─── Guest ────────────────────────────────────────────────────────────────────

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user:             null,
    loading:          false,
    signInWithGoogle: vi.fn(),
  }),
}));

const renderProfile = () =>
  render(<MemoryRouter><Profile /></MemoryRouter>);

describe('Profile page — guest', () => {

  it('renders without crashing', () => {
    renderProfile();
    expect(screen.getByText('Learning anonymously')).toBeTruthy();
  });

  it('shows sign in button in header', () => {
    renderProfile();
    expect(screen.getByText('Sign in to save progress')).toBeTruthy();
  });

  it('shows guest prompt', () => {
    renderProfile();
    expect(screen.getByText(/You can explore any module freely/i)).toBeTruthy();
  });

  it('renders all 3 stat cards', () => {
    renderProfile();
    expect(screen.getByText('Mastered')).toBeTruthy();
    expect(screen.getByText('Avg Mastery')).toBeTruthy();
    expect(screen.getByText('Day Streak')).toBeTruthy();
  });

  it('renders Overall Mastery and Module Mastery sections', () => {
    renderProfile();
    expect(screen.getByText('Overall Mastery')).toBeTruthy();
    expect(screen.getByText('Module Mastery')).toBeTruthy();
  });

  it('renders all 6 module titles', async () => {
    renderProfile();
    await waitFor(() => {
      expect(screen.getByText('Sexual Anatomy and Hygiene')).toBeTruthy();
      expect(screen.getByText('STIs and STDs')).toBeTruthy();
      expect(screen.getByText('Digital Safety and Media Literacy')).toBeTruthy();
      expect(screen.getByText('Contraception and Pregnancy Prevention')).toBeTruthy();
      expect(screen.getByText('Consent & Healthy Relationships')).toBeTruthy();
      expect(screen.getByText('Gender and Sexual Orientation')).toBeTruthy();
    });
  });

});