import React from 'react';
import { Plus, Edit3 } from 'lucide-react';

export default function EmptyState({ onCreateNote }) {
  return (
    <div className="no-note-selected">
      <div className="no-note-icon">
        <Edit3 size={32} />
      </div>
      <h2 className="no-note-title">No Note Selected</h2>
      <p className="no-note-desc">
        Select a note from the sidebar to view and edit its markdown, or create a brand new one.
      </p>
      <button
        type="button"
        className="new-note-btn"
        style={{ width: 'auto', padding: '10px 22px' }}
        onClick={onCreateNote}
      >
        <Plus size={18} />
        <span>Create New Note</span>
      </button>
    </div>
  );
}
