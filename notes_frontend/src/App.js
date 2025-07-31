import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import NoteEditor from "./NoteEditor";
import { NotesProvider, useNotes } from "./NotesContext";

// PUBLIC_INTERFACE
function AppContent() {
  const { selectedNoteId, loading, error, getSelectedNote } = useNotes();
  const [editorMode, setEditorMode] = useState("edit"); // "edit" or "new"

  // Whenever note is selected, always use edit mode.
  useEffect(() => {
    if (selectedNoteId) setEditorMode("edit");
  }, [selectedNoteId]);

  function handleCreateNote() {
    setEditorMode("new");
  }

  return (
    <div className="main-layout">
      <Sidebar onCreate={handleCreateNote} />
      <main className="main-content">
        <header className="main-header">
          <span className="app-brand">
            <strong style={{ color: "var(--primary)" }}>Notes Manager</strong>
            <span className="brand-dot" style={{ color: "var(--accent)" }}> • </span>
            <span style={{ color: "var(--secondary)", fontWeight: 400, fontSize: "0.93em" }}>
              Simple, Modern &amp; Responsive.
            </span>
          </span>
        </header>
        {error && <div className="app-error">{error}</div>}
        <NoteEditor mode={editorMode} />
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Set light theme as default; allow toggling if dark mode is ever needed.
  const [theme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;
