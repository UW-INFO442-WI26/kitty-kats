import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi } from 'vitest';
import Modules from '../pages/Modules';

// Fake a logged-in non-anonymous user so modules render as links, not locks
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test-uid', isAnonymous: false } }),
}));

const renderModules = () => render(<MemoryRouter><Modules /></MemoryRouter>);

describe('Modules page', () => {

  it('renders the Modules heading', () => {
    renderModules();
    expect(screen.getByText('Modules')).toBeTruthy();
  });

  it('renders all 6 module titles', () => {
    renderModules();
    expect(screen.getByText('Sexual Anatomy and Hygiene')).toBeTruthy();
    expect(screen.getByText('STIs and STDs')).toBeTruthy();
    expect(screen.getByText('Digital Safety and Media Literacy')).toBeTruthy();
    expect(screen.getByText('Contraception and Pregnancy Prevention')).toBeTruthy();
    expect(screen.getByText('Consent & Healthy Relationships')).toBeTruthy();
    expect(screen.getByText('Gender and Sexual Orientation')).toBeTruthy();
  });

  it('renders 6 links to module pages', () => {
    renderModules();
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);
  });

  it('module 1 links to /module/1', () => {
    renderModules();
    const link = screen.getByText('Sexual Anatomy and Hygiene').closest('a');
    expect(link.getAttribute('href')).toBe('/module/1');
  });

  it('module 6 links to /module/6', () => {
    renderModules();
    const link = screen.getByText('Gender and Sexual Orientation').closest('a');
    expect(link.getAttribute('href')).toBe('/module/6');
  });

});