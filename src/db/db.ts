
import Dexie, { type Table } from "dexie";
import type { Note } from "../types/Note";

export type Subject = {
  id?: number;
  name: string;
  lectureCount: number;
};

class NoteDatabase extends Dexie {
  notes!: Table<Note, number>;
  subjects!: Table<Subject, number>;

  constructor() {
    super("NoteOrganizerDatabase");

    this.version(1).stores({
      notes: "id, title",
    });

    this.version(2).stores({
      notes: "id, title",
      subjects: "++id, &name",
    });
  }
}

export const db = new NoteDatabase();
