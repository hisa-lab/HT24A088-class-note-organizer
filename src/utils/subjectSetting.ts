
import { db } from "../db/db";

export const DEFAULT_LECTURE_COUNT = 15;

export async function getLectureCount(
  subjectName: string
): Promise<number> {
  const name = subjectName.trim();

  if (!name) return DEFAULT_LECTURE_COUNT;

  const subject = await db.subjects
    .where("name")
    .equals(name)
    .first();

  const notes = await db.notes.toArray();

  const maxUsedLecture = notes
    .filter((note) => note.subject?.trim() === name)
    .reduce(
      (max, note) => Math.max(max, note.lectureNo ?? 0),
      0
    );

  return Math.max(
    subject?.lectureCount ?? DEFAULT_LECTURE_COUNT,
    maxUsedLecture
  );
}

export async function changeLectureCount(
  subjectName: string,
  newCount: number
): Promise<boolean> {
  const name = subjectName.trim();

  if (!name || !Number.isInteger(newCount) || newCount < 1) {
    return false;
  }

  return db.transaction("rw", db.subjects, db.notes, async () => {
    const notes = await db.notes.toArray();

    const hasNotesBeyondLimit = notes.some(
      (note) =>
        note.subject?.trim() === name &&
        (note.lectureNo ?? 0) > newCount
    );

    if (hasNotesBeyondLimit) {
      return false;
    }

    await db.subjects.put({
      name,
      lectureCount: newCount,
      ...(await db.subjects
        .where("name")
        .equals(name)
        .first()
        .then((existing) =>
          existing?.id !== undefined
            ? { id: existing.id }
            : {}
        )),
    });

    return true;
  });
}
