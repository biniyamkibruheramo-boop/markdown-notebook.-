import React from 'react';
import NoteItem from './NoteItem';
import { FileText, SearchX } from 'lucide-react';

export default function NoteList({
  notes,
  activeNoteId,
  onSelectNote,
  onDeleteNote,
  isSearching,
  isLoading
}) {
  if (isLoading) {
    return (
      <div className="empty-list">
        <span>Loading notes...</span>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="empty-list">
        {isSearching ? (
          <>
            <SearchX size={32} />
            <p>No matching notes found</p>
          </>
        ) : (
          <>
            <FileText size={32} />
            <p>No notes yet. Create your first note!</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="note-list-container">
      {notes.map((note) => (
        <NoteItem
          key={note._id}
          note={note}
          isActive={note._id === activeNoteId}
          onSelect={onSelectNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
}
