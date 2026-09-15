import { useEffect, useState } from "react";
import { db } from "./db/db";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import NoteEditor from "./components/NoteEditor";
import type { Note } from "./types/Note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] =
    useState<Note | null>(null);

    useEffect(() => {
      const loadNotes = async () => {
        const savedNotes = await db.notes.toArray();
        setNotes(savedNotes);
      };
    
      void loadNotes();
    }, []);

  const addNote = async (
  title: string,
  content: string
) => {
  const newNote: Note = {
    id: Date.now(),
    title,
    content,
    category: "",
    subject: "",
    lectureNo: 1,
    important: false,
    files: [],
  };

  await db.notes.add(newNote);

  setNotes((currentNotes) => [
    ...currentNotes,
    newNote,
  ]);
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

  setNotes((prevNotes) =>
    prevNotes.filter((note) => note.id !== id)
  );
};

  return (
    <div className="app">
      <Sidebar addNote={addNote} />

      {selectedNote ? (
        <NoteEditor
          note={selectedNote}
          updateNote={updateNote}
          goBack={() => setSelectedNote(null)}
        />
      ) : (
        <Dashboard
          notes={notes}
          selectNote={setSelectedNote}
          deleteNote={deleteNote}
        />
      )}
    </div>
  );
}

export default App;