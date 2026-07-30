import Dexie, { type Table } from "dexie";
import type { Note } from "../types/Note";

class NoteDatabase extends Dexie {
  notes!: Table<Note, number>;

  constructor() {
    super("NoteOrganizerDatabase");

    this.version(1).stores({
      notes: "id, title",
    });
  }
}

export const db = new NoteDatabase();