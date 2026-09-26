import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../components/NoteEditor';
import EmptyState from '../components/EmptyState';
import AuthPage from '../components/AuthPage';
import { useAuth } from '../context/AuthContext';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from '../services/noteService';

export default function NotesPage() {
  const { currentUser, loading: authLoading, getIdToken } = useAuth();

  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [toastMessage, setToastMessage] = useState('');

  const saveTimerRef = useRef(null);
  const searchTimerRef = useRef(null);

  // Helper to show temporary toast messages
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2800);
  }, []);

  // Fetch initial notes when user is authenticated or changes
  useEffect(() => {
    if (!currentUser) {
      setNotes([]);
      setActiveNoteId(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchInitialNotes() {
      setIsLoading(true);
      try {
        const token = await getIdToken();
        const data = await getNotes('', token);
        if (isMounted) {
          setNotes(data || []);
          if (data && data.length > 0) {
            setActiveNoteId(data[0]._id);
          } else {
            setActiveNoteId(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load notes:', err);
          showToast('Failed to load notes from server');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialNotes();

    return () => {
      isMounted = false;
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [currentUser, getIdToken, showToast]);

  // Live search with debounce using noteService.getNotes
  const handleSearchChange = (query) => {
    setSearchQuery(query);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(async () => {
      try {
        const token = await getIdToken();
        const results = await getNotes(query, token);
        setNotes(results || []);
        if (results && results.length > 0 && !results.some((n) => n._id === activeNoteId)) {
          setActiveNoteId(results[0]._id);
        }
      } catch (err) {
        console.error('Search error:', err);
        showToast('Error searching notes');
      }
    }, 250);
  };

  // Clear search input and restore full list
  const handleClearSearch = async () => {
    setSearchQuery('');
    try {
      const token = await getIdToken();
      const allNotes = await getNotes('', token);
      setNotes(allNotes || []);
      if (allNotes && allNotes.length > 0 && !allNotes.some((n) => n._id === activeNoteId)) {
        setActiveNoteId(allNotes[0]._id);
      }
    } catch (err) {
      console.error('Failed to restore notes:', err);
    }
  };

  // Create a note via noteService.createNote
  const handleCreateNote = async () => {
    try {
      const token = await getIdToken();
      const newNote = await createNote(
        {
          title: 'Untitled Note',
          content: '# Untitled Note\n\nStart writing in markdown...'
        },
        token
      );

      // Keep UI state synchronized
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      setActiveNoteId(newNote._id);
      setSaveStatus('saved');
      showToast('Created new note');
    } catch (err) {
      console.error('Failed to create note:', err);
      showToast('Failed to create note');
    }
  };

  // Live optimistic update + debounced auto-save via noteService.updateNote
  const handleUpdateNote = (id, updatedFields) => {
    // 1. Immediate optimistic state update for silky smooth UI typing
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id
          ? { ...note, ...updatedFields, updatedAt: new Date().toISOString() }
          : note
      )
    );

    setSaveStatus('unsaved');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // 2. Debounced backend persistence to keep database synchronized
    saveTimerRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const token = await getIdToken();
        const savedNote = await updateNote(id, updatedFields, token);
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note._id === id ? savedNote : note))
        );
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save note:', err);
        setSaveStatus('unsaved');
        showToast('Failed to save changes');
      }
    }, 500);
  };

  // Delete note via noteService.deleteNote
  const handleDeleteNote = async (id) => {
    try {
      const token = await getIdToken();
      await deleteNote(id, token);

      // Remove from state
      const remainingNotes = notes.filter((note) => note._id !== id);
      setNotes(remainingNotes);

      // Select next available note if the deleted one was active
      if (activeNoteId === id) {
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0]._id : null);
      }

      showToast('Note deleted');
    } catch (err) {
      console.error('Failed to delete note:', err);
      showToast('Failed to delete note');
    }
  };

  // If Firebase auth is still initializing, show a clean notebook loader
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-spinner"></div>
        <span className="auth-loading-text">Opening your notebook...</span>
      </div>
    );
  }

  // If user is not authenticated, render the minimalist notebook-inspired AuthPage
  if (!currentUser) {
    return <AuthPage />;
  }

  // Locate the currently active note object
  const activeNote = notes.find((note) => note._id === activeNoteId);

  return (
    <div className="app-container">
      {/* Sidebar with Search and Note List */}
      <Sidebar
        notes={notes}
        activeNoteId={activeNoteId}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onSelectNote={setActiveNoteId}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          saveStatus={saveStatus}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
        />
      ) : (
        <EmptyState onCreateNote={handleCreateNote} />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
