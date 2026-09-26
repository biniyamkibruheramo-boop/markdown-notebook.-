import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-container">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search title or content..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={onClear}
          title="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
