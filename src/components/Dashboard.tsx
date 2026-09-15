import { useState } from "react";
import type { Note } from "../types/Note";

type Props = {
  notes: Note[];
  selectNote: (note: Note) => void;
  deleteNote: (id: number) => Promise<void>;
};

export default function Dashboard({
  notes,
  selectNote,
  deleteNote,
}: Props) {
  // 検索欄に入力された文字
  const [searchText, setSearchText] =
    useState("");

  // 検索処理
  const filteredNotes = notes.filter((note) => {
    const keyword =
      searchText.toLowerCase().trim();

    // 何も入力されていない場合は全部表示
    if (keyword === "") {
      return true;
    }

    const titleMatch =
      note.title
        .toLowerCase()
        .includes(keyword);

    const contentMatch =
      note.content
        .toLowerCase()
        .includes(keyword);

    const subjectMatch =
      (note.subject ?? "")
        .toLowerCase()
        .includes(keyword);

    const categoryMatch =
      (note.category ?? "")
        .toLowerCase()
        .includes(keyword);

    const fileMatch =
      (note.files ?? []).some((file) =>
        file.name
          .toLowerCase()
          .includes(keyword)
      );

    return (
      titleMatch ||
      contentMatch ||
      subjectMatch ||
      categoryMatch ||
      fileMatch
    );
  });

  // 重要な資料を一番上に表示
  const sortedNotes = [...filteredNotes].sort(
    (a, b) =>
      Number(b.important) -
      Number(a.important)
  );

  return (
    <main className="dashboard">
      <h1>ダッシュボード</h1>

      {/* 検索 */}
      <input
        type="text"
        placeholder="ノート・資料を検索"
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
        className="search-input"
      />

      {/* ファイル数 */}
      <div className="stats">
        <div className="card">
          <h2>{notes.length}</h2>
          <p>ファイル数</p>
        </div>
      </div>

      <h2>作成したノート</h2>

      {/* 検索結果がない場合 */}
      {sortedNotes.length === 0 && (
        <p>検索結果がありません。</p>
      )}

      {/* ノート一覧 */}
      {sortedNotes.map((note) => (
        <div
          key={note.id}
          className={`note-card ${
            note.important
              ? "important-note"
              : ""
          }`}
        >
          <div
            className="note-content"
            onClick={() =>
              selectNote(note)
            }
          >
            {/* 重要資料 */}
            {note.important && (
              <span className="important-badge">
                ★ 重要
              </span>
            )}

            {/* タイトル */}
            <h3>{note.title}</h3>

            {/* カテゴリー */}
            {note.category && (
              <p>
                カテゴリー：
                {note.category}
              </p>
            )}

            {/* 授業・分野 */}
            {note.subject && (
              <p>
                授業・分野：
                {note.subject}
              </p>
            )}

            {/* 講義回 */}
            <p>
              講義回：第
              {note.lectureNo ?? 1}回
            </p>

            {/* 本文 */}
            <p>{note.content}</p>

            {/* 添付資料 */}
            <small>
              添付資料：
              {note.files?.length ?? 0}件
            </small>
          </div>

          {/* 削除 */}
          <button
            type="button"
            className="delete-button"
            onClick={() => {
              const result =
                window.confirm(
                  `「${note.title}」を削除しますか？`
                );

              if (result) {
                void deleteNote(note.id);
              }
            }}
          >
            削除
          </button>
        </div>
      ))}
    </main>
  );
}