import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the NotesContext and Provider for consuming across components
const NotesContext = createContext();

/**
 * Utility function to get the API base URL from environment variables.
 * Ensures build-time configuration. Supports both .env and injected runtime variables.
 */
function getApiBaseUrl() {
  return (
    process.env.REACT_APP_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:5000/api"
  );
}

// PUBLIC_INTERFACE
export function useNotes() {
  return useContext(NotesContext);
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${getApiBaseUrl()}/notes`);
      if (!resp.ok) throw new Error("Failed to fetch notes");
      const data = await resp.json();
      setNotes(data);
    } catch (e) {
      setError("Could not load notes");
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function createNote(newNote) {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${getApiBaseUrl()}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
      if (!resp.ok) throw new Error("Failed to create note");
      const data = await resp.json();
      setNotes(prev =>
        [...prev, data].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
      setSelectedNoteId(data.id);
    } catch (e) {
      setError("Could not create note");
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function updateNote(id, updatedFields) {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${getApiBaseUrl()}/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!resp.ok) throw new Error("Failed to update note");
      const data = await resp.json();
      setNotes(prev =>
        prev.map(n => n.id === id ? data : n).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
    } catch (e) {
      setError("Could not update note");
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id) {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(`${getApiBaseUrl()}/notes/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Failed to delete note");
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNoteId === id) setSelectedNoteId(null);
    } catch (e) {
      setError("Could not delete note");
    } finally {
      setLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  function selectNote(id) {
    setSelectedNoteId(id);
  }

  // PUBLIC_INTERFACE
  function getSelectedNote() {
    return notes.find(n => n.id === selectedNoteId) || null;
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        selectedNoteId,
        selectNote,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        getSelectedNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
