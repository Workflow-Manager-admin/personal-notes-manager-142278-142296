import React, { useState, useEffect } from "react";
import "./NoteEditor.css";
import { useNotes } from "./NotesContext";

// PUBLIC_INTERFACE
export default function NoteEditor({ mode }) {
  const {
    getSelectedNote,
    selectedNoteId,
    updateNote,
    createNote,
    deleteNote,
    selectNote,
    loading,
  } = useNotes();

  const selectedNote = getSelectedNote();

  const [title, setTitle] = useState(mode === "edit" && selectedNote ? selectedNote.title : "");
  const [content, setContent] = useState(mode === "edit" && selectedNote ? selectedNote.content : "");
  const [editMode, setEditMode] = useState(mode === "new" || (mode === "edit" && !selectedNote));

  useEffect(() => {
    if (selectedNote && mode === "edit") {
      setTitle(selectedNote.title || "");
      setContent(selectedNote.content || "");
      setEditMode(false);
    } else if (mode === "new") {
      setTitle("");
      setContent("");
      setEditMode(true);
    }
  }, [selectedNoteId, selectedNote, mode]);

  function handleSave() {
    if (mode === "new") {
      createNote({
        title: title.trim() || "(Untitled)",
        content,
      });
      setTitle("");
      setContent("");
    } else if (selectedNote) {
      updateNote(selectedNote.id, {
        title: title.trim() || "(Untitled)",
        content,
      });
    }
    setEditMode(false);
  }

  function handleDelete() {
    if (selectedNote && window.confirm("Really delete this note?")) {
      deleteNote(selectedNote.id);
    }
  }

  if (mode === "new") {
    return (
      <div className="editor-wrapper">
        <h2>New Note</h2>
        <NoteEditorForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          loading={loading}
          onSave={handleSave}
        />
      </div>
    );
  }

  if (!selectedNote) {
    return (
      <div className="editor-wrapper">
        <div className="editor-placeholder">Select a note to view or edit</div>
      </div>
    );
  }

  if (!editMode) {
    return (
      <div className="editor-wrapper">
        <header className="editor-header">
          <h2>{selectedNote.title || "(Untitled)"}</h2>
          <div>
            <button className="editor-btn" onClick={() => setEditMode(true)}>
              Edit
            </button>
            <button className="editor-btn danger-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </header>
        <div className="editor-content markdown-preview">
          {selectedNote.content}
        </div>
        <div className="editor-date">
          Last updated:{" "}
          {selectedNote.updated_at
            ? new Date(selectedNote.updated_at).toLocaleString()
            : ""}
        </div>
      </div>
    );
  }

  return (
    <div className="editor-wrapper">
      <NoteEditorForm
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        loading={loading}
        onSave={handleSave}
        onCancel={() => setEditMode(false)}
        isEditing={mode === "edit"}
      />
      {mode === "edit" && (
        <button className="editor-btn danger-btn" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function NoteEditorForm({
  title,
  setTitle,
  content,
  setContent,
  loading,
  onSave,
  onCancel,
  isEditing,
}) {
  return (
    <form
      className="editor-form"
      onSubmit={e => {
        e.preventDefault();
        onSave();
      }}
    >
      <input
        className="editor-title-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={128}
        disabled={loading}
        required
      />
      <textarea
        className="editor-content-input"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Note content..."
        rows={12}
        disabled={loading}
        required
      />
      <div className="editor-form-actions">
        <button className="editor-btn primary-btn" type="submit" disabled={loading}>
          Save
        </button>
        {onCancel && (
          <button className="editor-btn" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
