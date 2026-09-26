import React from 'react';
import { Trash2 } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'Yesterday';

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

export default function NoteItem({ note, isActive, onSelect, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${note.title || 'Untitled Note'}"?`)) {
      onDelete(note._id);
    }
  };

  // Strip markdown characters from snippet preview for clean display
  const snippet = (note.content || 'No additional text')
    .replace(/[#*`_~[\]()>-]/g, '')
    .trim();

  return (
    <div
      className={`note-item ${isActive ? 'active' : ''}`}
      onClick={() => onSelect(note._id)}
    >
      <div className="note-item-header">
        <h4 className="note-item-title">{note.title || 'Untitled Note'}</h4>
        <button
          type="button"
          className="note-delete-btn"
          title="Delete note"
          onClick={handleDelete}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <p className="note-item-snippet">{snippet}</p>

      <div className="note-item-date">
        {formatDate(note.updatedAt || note.createdAt)}
      </div>
    </div>
  );
}
