import type { Note } from "../types/Note";

type Props = {
  notes: Note[];
  selectNote: (note: Note) => void;
  addNote: () => Promise<void>;
  selectedNote: Note | null;
  goHome: () => void;
};

export default function Sidebar({
  notes,
  selectNote,
  addNote,
  selectedNote,
  goHome,
}: Props) {
  const sortedNotes = [...notes].sort(
    (a, b) =>
      (b.createdAt ?? b.id) -
      (a.createdAt ?? a.id)
  );

  return (
    <aside className="sidebar">
      <div
        className="sidebar-logo"
        onClick={goHome}
      >
        <h2>Note Organizer</h2>

        <p>
          授業資料をシンプルに整理
        </p>
      </div>

      <button
        type="button"
        className="sidebar-create-button"
        onClick={() => void addNote()}
      >
        ＋ 新しいノート
      </button>

      <div className="sidebar-notes">
        <div className="sidebar-section-title">
          ノート
        </div>

        {sortedNotes.length === 0 ? (
          <p className="sidebar-empty">
            ノートはありません
          </p>
        ) : (
          <div className="sidebar-note-list">
            {sortedNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className={`sidebar-note ${
                  selectedNote?.id === note.id
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  selectNote(note)
                }
                title={note.title}
              >
                {note.important && (
                  <span className="sidebar-star">
                    ★
                  </span>
                )}

                <span className="sidebar-note-title">
                  {note.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}