import { render, screen, fireEvent } from '@testing-library/react';
import Notes from './Notes';

describe('Notes Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders notes component', () => {
    render(<Notes />);
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  test('can add a new note', () => {
    render(<Notes />);
    
    // Get the input and add button
    const input = screen.getByPlaceholderText('Add a new note...');
    const addButton = screen.getByText('Add Note');
    
    // Add a note
    fireEvent.change(input, { target: { value: 'Test note' } });
    fireEvent.click(addButton);
    
    // Check if note was added
    expect(screen.getByText('Test note')).toBeInTheDocument();
  });

  test('can delete a note', () => {
    render(<Notes />);
    
    // Add a note first
    const input = screen.getByPlaceholderText('Add a new note...');
    const addButton = screen.getByText('Add Note');
    fireEvent.change(input, { target: { value: 'Test note' } });
    fireEvent.click(addButton);
    
    // Delete the note
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    // Check if note was deleted
    expect(screen.queryByText('Test note')).not.toBeInTheDocument();
  });

  test('loads saved notes from localStorage', () => {
    // Save some notes to localStorage
    const savedNotes = ['Note 1', 'Note 2', 'Note 3'];
    localStorage.setItem('notes', JSON.stringify(savedNotes));
    
    render(<Notes />);
    
    // Check if all saved notes are displayed
    savedNotes.forEach(note => {
      expect(screen.getByText(note)).toBeInTheDocument();
    });
  });

  test('saves notes to localStorage', () => {
    render(<Notes />);
    
    // Add a note
    const input = screen.getByPlaceholderText('Add a new note...');
    const addButton = screen.getByText('Add Note');
    fireEvent.change(input, { target: { value: 'Test note' } });
    fireEvent.click(addButton);
    
    // Check localStorage
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    expect(savedNotes).toContain('Test note');
  });

  test('cannot add empty notes', () => {
    render(<Notes />);
    
    // Try to add an empty note
    const addButton = screen.getByText('Add Note');
    fireEvent.click(addButton);
    
    // Check that no empty note was added
    expect(screen.queryByText('')).not.toBeInTheDocument();
  });
}); 