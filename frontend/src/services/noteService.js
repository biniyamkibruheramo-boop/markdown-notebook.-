import { auth } from '../config/firebase';

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/notes';

/**
 * Build request headers, automatically retrieving the Firebase ID token if available
 */
async function getHeaders(customToken = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  let token = customToken;
  if (!token && auth && auth.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (e) {
      console.warn('Could not auto-retrieve Firebase token:', e.message);
    }
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle API responses and extract JSON data or throw meaningful error
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage = data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Fetch all notes, or search notes by keyword
 * @param {string} search - Optional search query for title/content
 * @param {string} token - Optional explicit Firebase ID token
 * @returns {Promise<Array>} Array of note objects
 */
export const getNotes = async (search = '', token = null) => {
  const query = search ? `?search=${encodeURIComponent(search.trim())}` : '';
  const headers = await getHeaders(token);
  const response = await fetch(`${API_URL}${query}`, {
    headers,
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Fetch a single note by its ID
 * @param {string} id - The MongoDB _id of the note
 * @param {string} token - Optional explicit Firebase ID token
 * @returns {Promise<Object>} The note object
 */
export const getNoteById = async (id, token = null) => {
  const headers = await getHeaders(token);
  const response = await fetch(`${API_URL}/${id}`, {
    headers,
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Create a new note
 * @param {Object} noteData - { title, content }
 * @param {string} token - Optional explicit Firebase ID token
 * @returns {Promise<Object>} The newly created note object
 */
export const createNote = async (noteData, token = null) => {
  const headers = await getHeaders(token);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(noteData),
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Update an existing note by ID
 * @param {string} id - The MongoDB _id of the note
 * @param {Object} noteData - { title, content }
 * @param {string} token - Optional explicit Firebase ID token
 * @returns {Promise<Object>} The updated note object
 */
export const updateNote = async (id, noteData, token = null) => {
  const headers = await getHeaders(token);
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(noteData),
  });
  const result = await handleResponse(response);
  return result.data;
};

/**
 * Delete a note by ID
 * @param {string} id - The MongoDB _id of the note
 * @param {string} token - Optional explicit Firebase ID token
 * @returns {Promise<Object>} Response confirmation
 */
export const deleteNote = async (id, token = null) => {
  const headers = await getHeaders(token);
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });
  const result = await handleResponse(response);
  return result;
};

const noteService = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};

export default noteService;
