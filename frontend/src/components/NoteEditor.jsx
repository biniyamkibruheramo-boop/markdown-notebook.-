import React, { useRef } from 'react';
import MarkdownToolbar from './MarkdownToolbar';
import MarkdownPreview from './MarkdownPreview';
import { Columns, Edit3, Eye, Trash2 } from 'lucide-react';

export default function NoteEditor({
  note,
  onUpdateNote,
  onDeleteNote,
  saveStatus, // 'saved' | 'saving' | 'unsaved'
  viewMode, // 'split' | 'edit' | 'preview'
  onChangeViewMode
}) {
  const textareaRef = useRef(null);

  if (!note) return null;

  // Insert markdown syntax at cursor or around current selection
  const handleInsertMarkdown = (prefix, suffix, defaultText) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = note.content || '';
    const selectedText = currentText.substring(start, end) || defaultText;

    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);

    onUpdateNote(note._id, { content: newText });

    // Restore focus and cursor position after React re-renders
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  // Handle Tab key in textarea for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = note.content || '';

      const newText =
        currentText.substring(0, start) + '  ' + currentText.substring(end);

      onUpdateNote(note._id, { content: newText });

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const wordsCount = (note.content || '').trim() ? (note.content || '').trim().split(/\s+/).length : 0;
  const charsCount = (note.content || '').length;

  return (
    <div className="main-content">
      {/* Top Bar */}
      <div className="editor-top-bar">
        <input
          type="text"
          className="note-title-input"
          placeholder="Untitled Note"
          value={note.title || ''}
          onChange={(e) => onUpdateNote(note._id, { title: e.target.value })}
        />

        <div className="editor-actions">
          {/* Save Status Indicator */}
          <div className="save-status">
            <span className={`status-dot ${saveStatus}`} />
            <span>
              {saveStatus === 'saving'
                ? 'Saving...'
                : saveStatus === 'unsaved'
                ? 'Unsaved changes'
                : 'All changes saved'}
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="view-mode-toggle">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('split')}
              title="Split View"
            >
              <Columns size={15} />
              <span>Split</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('edit')}
              title="Edit View"
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => onChangeViewMode('preview')}
              title="Preview View"
            >
              <Eye size={15} />
              <span>Preview</span>
            </button>
          </div>

          {/* Delete Action */}
          <button
            type="button"
            className="toolbar-btn"
            title="Delete this note"
            onClick={() => {
              if (window.confirm(`Delete "${note.title || 'Untitled Note'}"?`)) {
                onDeleteNote(note._id);
              }
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (shown when editor is active) */}
      {viewMode !== 'preview' && (
        <MarkdownToolbar onInsert={handleInsertMarkdown} />
      )}

      {/* Workspace (Editor & Preview) */}
      <div className={`editor-workspace mode-${viewMode}`}>
        {/* Editor Pane */}
        <div className="editor-pane">
          <textarea
            ref={textareaRef}
            className="markdown-textarea"
            placeholder="Type your markdown here... You can use headings, lists, bold, italics, code blocks, etc."
            value={note.content || ''}
            onChange={(e) => onUpdateNote(note._id, { content: e.target.value })}
            onKeyDown={handleKeyDown}
          />
          <div className="editor-footer">
            <span>Markdown supported</span>
            <span>{wordsCount} words &middot; {charsCount} characters</span>
          </div>
        </div>

        {/* Markdown Live Preview */}
        <MarkdownPreview content={note.content} title="" />
      </div>
    </div>
  );
}
