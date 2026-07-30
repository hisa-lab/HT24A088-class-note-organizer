import type { Note } from "../types/Note";

type Props = {
  notes: Note[];
  selectNote: (note: Note) => void;
};

export default function Dashboard({
  notes,
  selectNote,
}: Props) {
  return (
    <main className="dashboard">
      <h1>ダッシュボード</h1>

      <div className="stats">
        <div className="card">
          <h2>{notes.length}</h2>
          <p>ファイル数</p>
        </div>
      </div>

      <h2>作成したノート</h2>

      {notes.map((note) => (
        <div
          key={note.id}
          className="note-card"
          onClick={() =>
            selectNote(note)
          }
        >
          <h3>{note.title}</h3>

          <p>{note.content}</p>

          <small>
            添付資料:
            {note.files.length}件
          </small>
        </div>
      ))}
    </main>
  );
}