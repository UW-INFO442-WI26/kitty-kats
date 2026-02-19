import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import Modules from '../pages/Modules';

// Wrap in MemoryRouter because Modules uses <Link>
const renderModules = () => render(<MemoryRouter><Modules /></MemoryRouter>);

describe('Modules page', () => {

  // Check the page title shows up
  it('renders the Modules heading', () => {
    renderModules();
    expect(screen.getByText('Modules')).toBeTruthy();
  });

  // Check all 6 module titles are on screen
  it('renders all 6 module titles', () => {
    renderModules();
    expect(screen.getByText('Sexual Anatomy and Hygiene')).toBeTruthy();
    expect(screen.getByText('STIs and STDs')).toBeTruthy();
    expect(screen.getByText('Digital Safety and Media Literacy')).toBeTruthy();
    expect(screen.getByText('Contraception and Pregnancy Prevention')).toBeTruthy();
    expect(screen.getByText('Consent & Healthy Relationships')).toBeTruthy();
    expect(screen.getByText('Gender and Sexual Orientation')).toBeTruthy();
  });

  // All modules have paths so there should be 6 clickable links
  it('renders 6 links to module pages', () => {
    renderModules();
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(6);
  });

  // Check module 1 links to the right path
  it('module 1 links to /module/1', () => {
    renderModules();
    const link = screen.getByText('Sexual Anatomy and Hygiene').closest('a');
    expect(link.getAttribute('href')).toBe('/module/1');
  });

  // Check module 6 links to the right path
  it('module 6 links to /module/6', () => {
    renderModules();
    const link = screen.getByText('Gender and Sexual Orientation').closest('a');
    expect(link.getAttribute('href')).toBe('/module/6');
  });

});