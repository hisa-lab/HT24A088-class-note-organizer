import { useState } from "react";
import type { Note } from "../types/Note";

type Props = {
  notes: Note[];
  selectNote: (note: Note) => void;
  addNote: () => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
};

export default function Dashboard({
  notes,
  selectNote,
  addNote,
  deleteNote,
}: Props) {
  const [searchText, setSearchText] =
    useState("");

  const keyword =
    searchText.toLowerCase().trim();

  const filteredNotes = notes.filter(
    (note) => {
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
        fileMatch
      );
    }
  );

  const importantNotes =
    filteredNotes.filter(
      (note) => note.important
    );

  const recentNotes = [...filteredNotes]
    .sort(
      (a, b) =>
        (b.createdAt ?? b.id) -
        (a.createdAt ?? a.id)
    )
    .slice(0, 6);

  const handleDelete = (
    note: Note
  ) => {
    const result = window.confirm(
      `「${note.title}」を削除しますか？`
    );

    if (result) {
      void deleteNote(note.id);
    }
  };

  return (
    <main className="home">

      {/* 上部 */}
      <div className="home-header">
        <div>
          <p className="home-label">
            Note Organizer
          </p>

          <h1>ホーム</h1>

          <p className="home-description">
            ノートや授業資料をまとめて確認できます。
          </p>
        </div>

        <button
          type="button"
          className="new-note-button"
          onClick={() => void addNote()}
        >
          ＋ 新しいノート
        </button>
      </div>


      {/* 検索 */}
      <div className="home-search">
        <span>⌕</span>

        <input
          type="text"
          placeholder="ノート・資料を検索"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />
      </div>


      {/* 重要な資料 */}
      {importantNotes.length > 0 && (
        <section className="home-section">

          <div className="section-title">
            <h2>重要な資料</h2>
          </div>

          <div className="document-list">

            {importantNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                className="document-row important-row"
                onClick={() =>
                  selectNote(note)
                }
              >
                <div className="document-main">

                  <span className="important-mark">
                    ★
                  </span>

                  <div>
                    <strong>
                      {note.title}
                    </strong>

                    <p>
                      {note.subject
                        ? `${note.subject} ・ `
                        : ""}

                      第{note.lectureNo}回
                    </p>
                  </div>

                </div>

              </button>
            ))}

          </div>
        </section>
      )}


      {/* 最近のノート */}
      <section className="home-section">

        <div className="section-title">

          <h2>
            {searchText
              ? "検索結果"
              : "最近のノート"}
          </h2>

          <span className="note-count">
            {filteredNotes.length}件
          </span>

        </div>


        {recentNotes.length === 0 ? (

          <div className="empty-card">

            <p>
              {searchText
                ? "該当するノートがありません。"
                : "まだノートがありません。"}
            </p>

            {!searchText && (
              <button
                type="button"
                onClick={() =>
                  void addNote()
                }
              >
                最初のノートを作成
              </button>
            )}

          </div>

        ) : (

          <div className="document-list">

            {recentNotes.map((note) => (

              <div
                key={note.id}
                className="document-row"
              >

                {/* ノートを開く部分 */}
                <button
                  type="button"
                  className="document-open"
                  onClick={() =>
                    selectNote(note)
                  }
                >

                  <div>
                    <strong>
                      {note.title}
                    </strong>

                    <p>
                      {note.subject
                        ? `${note.subject} ・ `
                        : ""}

                      第{note.lectureNo}回

                      {" ・ "}

                      添付
                      {note.files?.length ?? 0}件
                    </p>
                  </div>

                </button>


                {/* 右側の操作 */}
                <div className="document-actions">

                  <button
                    type="button"
                    className="note-delete-button"
                    onClick={() =>
                      handleDelete(note)
                    }
                  >
                    削除
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}