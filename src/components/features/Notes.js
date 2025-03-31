import React, { useState, useEffect } from 'react';
import '../../styles/Notes.css';

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [draggedNoteId, setDraggedNoteId] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date().toLocaleString()
    };

    setNotes(prev => [newNote, ...prev]);
    setTitle('');
    setContent('');
  };

  const handleDeleteClick = (id) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setNotes(prev => prev.filter(note => note.id !== noteToDelete));
    setIsDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const handleDragStart = (e, id) => {
    setDraggedNoteId(id);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragEnd = (e) => {
    setDraggedNoteId(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = '2px solid #4A90E2';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.borderTop = 'none';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    e.currentTarget.style.borderTop = 'none';
    
    if (draggedNoteId === targetId) return;

    setNotes(prevNotes => {
      const newNotes = [...prevNotes];
      const draggedIndex = newNotes.findIndex(note => note.id === draggedNoteId);
      const targetIndex = newNotes.findIndex(note => note.id === targetId);
      
      const [draggedNote] = newNotes.splice(draggedIndex, 1);
      newNotes.splice(targetIndex, 0, draggedNote);
      
      return newNotes;
    });
  };

  // Delete Dialog Component
  const DeleteDialog = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2d3748',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '90%',
        color: 'white'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Delete Note</h3>
        <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete this note?</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancelDelete}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4a5568',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="notes-container">
      {/* Left Column - Controls */}
      <div className="notes-card" style={{ height: 'fit-content' }}>
        <h2>Notes</h2>
        <p>Create and manage your notes. Each note has a title and content, with automatic timestamps.</p>
      </div>

      {/* Main Content - Center */}
      <div className="notes-card">
        <div className="notes-list">
          {notes.map((note, index) => (
            <div
              key={note.id}
              draggable
              onDragStart={(e) => handleDragStart(e, note.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, note.id)}
              className="note-item"
            >
              <div className="delete-button" onClick={() => handleDeleteClick(note.id)}>×</div>
              <h3>{note.title}</h3>
              <div className="note-content">{note.content}</div>
              <div className="note-timestamp">{note.timestamp}</div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="empty-notes">
              No notes yet. Create your first note!
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Input Form */}
      <div className="notes-card">
        <form onSubmit={handleSubmit} className="note-form">
          <div>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="title"
            />
          </div>
          <div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="note"
            />
          </div>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className={title.trim() && content.trim() ? 'submit-button' : 'submit-button disabled'}
          >
            Add Note
          </button>
        </form>
      </div>

      {isDeleteDialogOpen && <DeleteDialog />}
    </div>
  );
}

export default Notes; 