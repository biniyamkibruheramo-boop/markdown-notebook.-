import React from 'react';
import SearchBar from './SearchBar';
import NoteList from './NoteList';
import { Plus, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  notes,
  activeNoteId,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isLoading
}) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const getInitials = () => {
    if (!currentUser) return '?';
    if (currentUser.displayName) {
      return currentUser.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-area">
          <div className="logo-icon">
            <BookOpen size={18} />
          </div>
          <h1 className="app-title">Markdown Notes</h1>
        </div>
        <span className="note-badge">{notes.length}</span>
      </div>

      <div className="sidebar-actions">
        <button
          type="button"
          className="new-note-btn"
          onClick={onCreateNote}
        >
          <Plus size={18} />
          <span>New Note</span>
        </button>

        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onClearSearch}
        />
      </div>

      <NoteList
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={onSelectNote}
        onDeleteNote={onDeleteNote}
        isSearching={Boolean(searchQuery.trim())}
        isLoading={isLoading}
      />

      {currentUser && (
        <div className="sidebar-user-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-name">
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
              </span>
              <span className="sidebar-user-email">{currentUser.email}</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
}
