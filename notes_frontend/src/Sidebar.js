import React from "react";
import "./Sidebar.css";
import { useNotes } from "./NotesContext";

// PUBLIC_INTERFACE
function Sidebar({ onCreate }) {
  const { notes, selectNote, selectedNoteId, loading } = useNotes();

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <h2>📝 Notes</h2>
        <button className="create-btn" onClick={onCreate} aria-label="Create New Note">
          ＋
        </button>
      </header>
      <nav>
        {loading && <div className="sidebar-loading">Loading...</div>}
        {notes.length === 0 && !loading && (
          <div className="sidebar-empty">No notes yet.</div>
        )}
        <ul className="note-list">
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={note.id === selectedNoteId ? "active" : ""}
              tabIndex={0}
            >
              <div className="note-title">{note.title || "(Untitled)"}</div>
              <div className="note-modified">
                {note.updated_at ? new Date(note.updated_at).toLocaleString() : ""}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
