import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import Polaroid from './Polaroid'; 

const mockProps = {
  title: 'Jane Doe',
  description: 'Software Engineer & Photographer',
  imageSrc: '/profile-pic.jpg',
  socials: {
    twitter: 'https://twitter.com/janedoe',
    instagram: 'https://instagram.com/janedoe',
  },
};

describe('Polaroid Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the title and description correctly', () => {
    render(<Polaroid {...mockProps} />);
    
    expect(screen.getByText(mockProps.title)).toBeDefined();
    expect(screen.getByText(mockProps.description)).toBeDefined();
  });

  it('renders the image with the correct alt text', () => {
    render(<Polaroid {...mockProps} />);
    
    const image = screen.getByAltText(mockProps.title);
    expect(image).toBeDefined();
  });

  it('renders the correct social media links', () => {
    render(<Polaroid {...mockProps} />);
    
    const links = screen.getAllByRole('link');
    
    expect(links).toHaveLength(2);
    
    expect(links[0].getAttribute('href')).toBe(mockProps.socials.twitter);
    expect(links[1].getAttribute('href')).toBe(mockProps.socials.instagram);
  });
});