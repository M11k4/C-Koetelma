import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders logo and site name', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Cursor Koetelma')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Game')).toBeInTheDocument();
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  test('renders correct page title for each route', () => {
    const { rerender } = renderWithRouter(<Navbar />);
    
    // Check default title (Home)
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // Simulate navigation to different routes
    rerender(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    // Check if titles update correctly
    expect(screen.getByText('MasterFruit')).toBeInTheDocument();
    expect(screen.getByText('Weather')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Navbar />);
    
    const gameLink = screen.getByText('Game').closest('a');
    const weatherLink = screen.getByText('Weather').closest('a');
    const notesLink = screen.getByText('Notes').closest('a');
    
    expect(gameLink).toHaveAttribute('href', '/game');
    expect(weatherLink).toHaveAttribute('href', '/weather');
    expect(notesLink).toHaveAttribute('href', '/notes');
  });
}); 