
import { useEffect, useState } from "react";
import type { Note } from "../types/Note";
import {
  getLectureCount,
  changeLectureCount,
} from "../utils/subjectSetting";

type Props = {
  notes: Note[];
  selectNote: (note: Note) => void;
  goHome: () => void;
};

function LectureManager({
  notes,
  selectNote,
  goHome,
}: Props) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLecture, setSelectedLecture] =
    useState<number | null>(null);

  // 授業ごとの講義回数
  const [lectureCount, setLectureCount] = useState(15);
  const [loading, setLoading] = useState(false);

  // ノートに登録されている授業名を取得
  const subjects = Array.from(
    new Set(
      notes
        .map((note) => (note.subject ?? "").trim())
        .filter((subject) => subject !== "")
    )
  ).sort();

  // 選択した授業の講義回数を取得
  useEffect(() => {
    let cancelled = false;

    if (!selectedSubject) {
      return;
    }

    setLoading(true);

    getLectureCount(selectedSubject)
      .then((count) => {
        if (!cancelled) {
          setLectureCount(count);
        }
      })
      .catch((error) => {
        console.error(
          "講義回数の取得に失敗しました:",
          error
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSubject, notes]);

  // 講義回数を増減する
  const handleChangeLectureCount = async (
    difference: number
  ) => {
    if (!selectedSubject || loading) return;

    const newCount = lectureCount + difference;

    if (newCount < 1) return;

    setLoading(true);

    try {
      const success = await changeLectureCount(
        selectedSubject,
        newCount
      );

      if (!success) {
        window.alert(
          "ノートが登録されている講義回は削除できません。"
        );
        return;
      }

      setLectureCount(newCount);

      if (
        selectedLecture !== null &&
        selectedLecture > newCount
      ) {
        setSelectedLecture(null);
      }
    } catch (error) {
      console.error(
        "講義回数の変更に失敗しました:",
        error
      );

      window.alert(
        "講義回数の変更に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  // 選択した授業・講義回のノート
  const lectureNotes = notes.filter(
    (note) =>
      note.subject?.trim() === selectedSubject &&
      note.lectureNo === selectedLecture
  );

  return (
    <main className="lecture-manager">
      <button
        type="button"
        className="lecture-back-button"
        onClick={goHome}
      >
        ← ホームに戻る
      </button>

      <h1>講義ごとの資料管理</h1>

      <p>
        授業名と講義回からノートや資料を確認できます。
      </p>

      <h2>授業名</h2>

      <div className="subject-list">
        {subjects.length === 0 && (
          <p>登録された授業がありません。</p>
        )}

        {subjects.map((subject) => (
          <button
            key={subject}
            type="button"
            onClick={() => {
              setSelectedSubject(subject);
              setSelectedLecture(null);
            }}
            className={
              selectedSubject === subject
                ? "selected"
                : ""
            }
          >
            {subject}
          </button>
        ))}
      </div>

      {selectedSubject && (
        <>
          <div className="lecture-count-header">
            <h2>
              {selectedSubject} の講義一覧
            </h2>

            <div className="lecture-count-controls">
              <span>全{lectureCount}回</span>

              <button
                type="button"
                disabled={loading || lectureCount <= 1}
                onClick={() =>
                  void handleChangeLectureCount(-1)
                }
                title="講義回を1回減らす"
              >
                －
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  void handleChangeLectureCount(1)
                }
                title="講義回を1回増やす"
              >
                ＋
              </button>
            </div>
          </div>

          <div className="lecture-grid">
            {Array.from(
              { length: lectureCount },
              (_, i) => i + 1
            ).map((lectureNo) => {
              const count = notes.filter(
                (note) =>
                  note.subject?.trim() === selectedSubject &&
                  note.lectureNo === lectureNo
              ).length;

              return (
                <button
                  key={lectureNo}
                  type="button"
                  className={
                    selectedLecture === lectureNo
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSelectedLecture(lectureNo)
                  }
                >
                  <div className="lecture-card-header">
                    <strong>
                      第{lectureNo}回
                    </strong>

                    {count > 0 && (
                      <span className="lecture-saved-mark">
                        ●
                      </span>
                    )}
                  </div>

                  <span>
                    {count > 0
                      ? `${count}件のノート`
                      : "未登録"}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {selectedSubject &&
        selectedLecture !== null && (
          <section className="lecture-notes">
            <h2>
              {selectedSubject}・第{selectedLecture}回
            </h2>

            {lectureNotes.length === 0 ? (
              <p>
                この講義回にはノートが登録されていません。
              </p>
            ) : (
              lectureNotes.map((note) => (
                <div
                  key={note.id}
                  className="lecture-note-card"
                >
                  <button
                    type="button"
                    onClick={() => selectNote(note)}
                    className="lecture-note-item"
                  >
                    <strong>{note.title}</strong>

                    <span>
                      添付資料：
                      {note.files?.length ?? 0}件
                    </span>
                  </button>

                  {note.files &&
                    note.files.length > 0 && (
                      <div className="lecture-file-list">
                        {note.files.map(
                          (file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="lecture-file-item"
                            >
                              📎 {file.name}
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              ))
            )}
          </section>
        )}
    </main>
  );
}

export default LectureManager;
