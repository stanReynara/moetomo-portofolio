import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import Navbar from './Navbar'; // Adjust this import path if needed

describe('Navbar Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders exactly three navigation links', () => {
    render(<Navbar />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(3);
  });

  it('renders the text links with correct text and href attributes', () => {
    render(<Navbar />);
    
    const homeLink = screen.getByText('HOME');
    const contactLink = screen.getByText('CONTACT US');
    const shopLink = screen.getByText('SHOP');
    
    expect(homeLink).toBeDefined();
    expect(contactLink).toBeDefined();
    expect(shopLink).toBeDefined();

    expect(homeLink.getAttribute('href')).toBe('/');
    expect(contactLink.getAttribute('href')).toBe('/contact');
    expect(shopLink.getAttribute('href')).toBe('/shop');
  });

});