import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Flashcards from '../pages/Flashcards';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../firebase', () => ({ db: {} }));

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
            term:       'Consent',
            definition: 'A voluntary agreement to participate in an activity.',
            module:     'Consent & Healthy Relationships',
          }),
        },
        {
          id: '2',
          data: () => ({
            term:       'Contraception',
            definition: 'Methods used to prevent pregnancy.',
            module:     'Contraception and Pregnancy Prevention',
            link:       'https://example.com/contraception',
          }),
        },
      ],
    })
  ),
}));

const renderFlashcards = (path = '/flashcards') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/flashcards"     element={<Flashcards />} />
        <Route path="/flashcards/:id" element={<Flashcards />} />
      </Routes>
    </MemoryRouter>
  );

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Flashcards page — initial render', () => {

  it('shows loading state initially', () => {
    renderFlashcards();
    expect(screen.getByText('Loading flashcards...')).toBeTruthy();
  });

  it('renders the Flashcards heading after loading', async () => {
    renderFlashcards();
    await waitFor(() => expect(screen.getByText('Flashcards')).toBeTruthy());
  });

  it('renders the filter dropdown with All modules option', async () => {
    renderFlashcards();
    await waitFor(() =>
      expect(screen.getByText('All modules')).toBeTruthy()
    );
  });

  it('renders all 6 module options in the dropdown', async () => {
    renderFlashcards();
    await waitFor(() => {
      expect(screen.getByText('Sexual Anatomy and Hygiene')).toBeTruthy();
      expect(screen.getByText('STIs and STDs')).toBeTruthy();
      expect(screen.getByText('Digital Safety and Media Literacy')).toBeTruthy();
      expect(screen.getByText('Contraception and Pregnancy Prevention')).toBeTruthy();
      expect(screen.getByText('Consent & Healthy Relationships')).toBeTruthy();
      expect(screen.getByText('Gender and Sexual Orientation')).toBeTruthy();
    });
  });

  it('shows "Showing all flashcards" by default', async () => {
    renderFlashcards();
    await waitFor(() =>
      expect(screen.getByText('Showing all flashcards')).toBeTruthy()
    );
  });

  it('renders Back to Home link pointing to /', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('← Back to Home'));
    const link = screen.getByText('← Back to Home').closest('a');
    expect(link.getAttribute('href')).toBe('/');
  });

});

describe('Flashcards page — card display', () => {

  it('shows the first card front text after loading', async () => {
    renderFlashcards();
    await waitFor(() => expect(screen.getByText('Consent')).toBeTruthy());
  });

  it('shows card counter 1 / 2 after loading', async () => {
    renderFlashcards();
    await waitFor(() => expect(screen.getByText(/1\s*\/\s*2/)).toBeTruthy());
  });

  it('shows "Tap the card to flip" hint', async () => {
    renderFlashcards();
    await waitFor(() =>
      expect(screen.getByText('Tap the card to flip')).toBeTruthy()
    );
  });

  it('renders Prev and Next buttons', async () => {
    renderFlashcards();
    await waitFor(() => {
      expect(screen.getByText('← Prev')).toBeTruthy();
      expect(screen.getByText('Next →')).toBeTruthy();
    });
  });

  it('flips to show back text when the card button is clicked', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Consent'));
    // The flip button is the border-0 bg-transparent button wrapping the card
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton);
    await waitFor(() =>
      expect(
        screen.getByText('A voluntary agreement to participate in an activity.')
      ).toBeTruthy()
    );
  });

  it('flipping again returns to front face', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Consent'));
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton); // → back
    await waitFor(() =>
      screen.getByText('A voluntary agreement to participate in an activity.')
    );
    fireEvent.click(flipButton); // → front again
    await waitFor(() => expect(screen.getByText('Consent')).toBeTruthy());
  });

});

describe('Flashcards page — navigation', () => {

  it('advances to card 2 when Next is clicked', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    await waitFor(() => expect(screen.getByText('Contraception')).toBeTruthy());
  });

  it('counter updates to 2 / 2 after clicking Next', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    await waitFor(() => expect(screen.getByText(/2\s*\/\s*2/)).toBeTruthy());
  });

  it('wraps from last card back to first on Next', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →')); // → card 2
    await waitFor(() => screen.getByText('Contraception'));
    fireEvent.click(screen.getByText('Next →')); // → wraps to card 1
    await waitFor(() => expect(screen.getByText('Consent')).toBeTruthy());
  });

  it('goes back to card 1 after clicking Prev from card 2', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    await waitFor(() => screen.getByText('Contraception'));
    fireEvent.click(screen.getByText('← Prev'));
    await waitFor(() => expect(screen.getByText('Consent')).toBeTruthy());
  });

  it('wraps from first card to last on Prev', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('← Prev'));
    fireEvent.click(screen.getByText('← Prev')); // wraps to card 2
    await waitFor(() => expect(screen.getByText('Contraception')).toBeTruthy());
  });

  it('resets to front face when navigating to next card', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Consent'));
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton); // flip to back
    await waitFor(() =>
      screen.getByText('A voluntary agreement to participate in an activity.')
    );
    fireEvent.click(screen.getByText('Next →'));
    // Should show front of card 2
    await waitFor(() => expect(screen.getByText('Contraception')).toBeTruthy());
  });

});

describe('Flashcards page — More info link', () => {

  it('shows More info link on the back of a card that has a link', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →')); // go to Contraception (has link)
    await waitFor(() => screen.getByText('Contraception'));
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton);
    await waitFor(() =>
      expect(screen.getByText('More info →')).toBeTruthy()
    );
  });

  it('More info link points to the correct URL', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Next →'));
    fireEvent.click(screen.getByText('Next →'));
    await waitFor(() => screen.getByText('Contraception'));
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton);
    await waitFor(() => screen.getByText('More info →'));
    const link = screen.getByText('More info →').closest('a');
    expect(link.getAttribute('href')).toBe('https://example.com/contraception');
  });

  it('does not show More info link on a card without a link', async () => {
    renderFlashcards();
    await waitFor(() => screen.getByText('Consent'));
    const buttons = screen.getAllByRole('button');
    const flipButton = buttons.find((b) => b.querySelector('.text-deep-plum'));
    fireEvent.click(flipButton);
    await waitFor(() =>
      screen.getByText('A voluntary agreement to participate in an activity.')
    );
    expect(screen.queryByText('More info →')).toBeNull();
  });

});

describe('Flashcards page — empty state', () => {

  it('shows empty state message when no flashcards are returned', async () => {
    const { getDocs } = await import('firebase/firestore');
    getDocs.mockResolvedValueOnce({ docs: [] });
    renderFlashcards();
    await waitFor(() =>
      expect(screen.getByText('No flashcards found.')).toBeTruthy()
    );
  });

  it('shows Browse Modules link in empty state pointing to /modules', async () => {
    const { getDocs } = await import('firebase/firestore');
    getDocs.mockResolvedValueOnce({ docs: [] });
    renderFlashcards();
    await waitFor(() => screen.getByText('Browse Modules'));
    const link = screen.getByText('Browse Modules').closest('a');
    expect(link.getAttribute('href')).toBe('/modules');
  });

});