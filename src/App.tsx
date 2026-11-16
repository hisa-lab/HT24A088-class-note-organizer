
import { useEffect, useState } from "react";
import { db } from "./db/db";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import NoteEditor from "./components/NoteEditor";
import LectureManager from "./components/LectureManager";

import type { Note } from "./types/Note";

type Page = "home" | "lectures";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

  // 現在表示している画面
  const [page, setPage] = useState<Page>("home");

  useEffect(() => {
    const loadNotes = async () => {
      const savedNotes = await db.notes.toArray();
      setNotes(savedNotes);
    };

    void loadNotes();
  }, []);

  const addNote = async () => {
    const now = Date.now();

    const newNote: Note = {
      id: now,
      title: "新しいノート",
      content: "",
      subject: "",
      lectureNo: 1,
      important: false,
      files: [],
      createdAt: now,
    };

    await db.notes.add(newNote);

    setNotes((currentNotes) => [
      ...currentNotes,
      newNote,
    ]);

    setSelectedNote(newNote);
  };

  const updateNote = async (
    updatedNote: Note
  ): Promise<void> => {
    await db.notes.put(updatedNote);

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id
          ? updatedNote
          : note
      )
    );

    setSelectedNote(updatedNote);
  };

  const deleteNote = async (
    id: number
  ): Promise<void> => {
    await db.notes.delete(id);

    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== id
      )
    );

    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const goHome = () => {
    setSelectedNote(null);
    setPage("home");
  };

  const goLectures = () => {
    setSelectedNote(null);
    setPage("lectures");
  };

  return (
    <div className="app">
      <Sidebar
        notes={notes}
        selectNote={setSelectedNote}
        addNote={addNote}
        selectedNote={selectedNote}
        goHome={goHome}
        goLectures={goLectures}
      />

      {selectedNote ? (
        <NoteEditor
          key={selectedNote.id}
          note={selectedNote}
          updateNote={updateNote}
          goBack={() => setSelectedNote(null)}
        />
      ) : page === "lectures" ? (
        <LectureManager
          notes={notes}
          selectNote={setSelectedNote}
          goHome={goHome}
        />
      ) : (
        <Dashboard
          notes={notes}
          selectNote={setSelectedNote}
          addNote={addNote}
          deleteNote={deleteNote}
        />
      )}
    </div>
  );
}

export default App;
