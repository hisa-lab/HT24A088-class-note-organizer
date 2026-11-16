import { useEffect, useState } from "react";
import type { Note } from "../types/Note";
import { getLectureCount } from "../utils/subjectSetting";

type Props = {
  note: Note;
  updateNote: (note: Note) => Promise<void>;
  goBack: () => void;
};

export default function NoteEditor({
  note,
  updateNote,
  goBack,
}: Props) {
  const [title, setTitle] =
    useState(note.title);

  const [subject, setSubject] =
    useState(note.subject ?? "");

  const [lectureNo, setLectureNo] =
    useState(note.lectureNo ?? 1);

    const [lectureCount, setLectureCount] = useState(15);

  const [content, setContent] =
    useState(note.content);

  const [important, setImportant] =
    useState(note.important ?? false);

  const [files, setFiles] =
    useState(note.files ?? []);

    useEffect(() => {
      let cancelled = false;
    
      getLectureCount(subject)
        .then((count) => {
          if (!cancelled) {
            setLectureCount(count);
          }
        })
        .catch((error) => {
          console.error("講義回数の取得に失敗しました:", error);
        });
    
      return () => {
        cancelled = true;
      };
    }, [subject]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    const uploadedFiles = selectedFiles.map(
      (file) => ({
        name: file.name,
        type: file.type,
        data: file,
      })
    );

    setFiles((currentFiles) => [
      ...currentFiles,
      ...uploadedFiles,
    ]);

    event.target.value = "";
  };

  const openFile = (
    file: (typeof files)[number]
  ) => {
    const fileUrl =
      URL.createObjectURL(file.data);

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );

    window.setTimeout(() => {
      URL.revokeObjectURL(fileUrl);
    }, 60000);
  };

  // 添付資料の個別削除
  const handleDeleteFile = (index: number) => {
    const confirmed = window.confirm(
      "この添付資料を削除しますか？"
    );

    if (!confirmed) return;

    setFiles((currentFiles) =>
      currentFiles.filter((_, i) => i !== index)
    );
  };

  const save = async () => {
    await updateNote({
      ...note,
      title,
      subject,
      lectureNo,
      content,
      important,
      files,
    });

    goBack();
  };

  return (
    <main className="editor">
      <div className="editor-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={goBack}
          >
            ← ホームに戻る
          </button>

          <h1>ノート編集</h1>
        </div>

        <button
          type="button"
          className="save-button"
          onClick={() => void save()}
        >
          保存
        </button>
      </div>

      <div className="editor-form">
        <div className="editor-field">
          <label>タイトル</label>

          <input
            type="text"
            value={title}
            placeholder="ノートのタイトル"
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="editor-row">
          <div className="editor-field">
            <label>授業名</label>

            <input
              type="text"
              value={subject}
              placeholder="例：データベース,プログラミング演習など"
              onChange={(e) =>
                setSubject(e.target.value)
              }
            />
          </div>

          <div className="editor-field lecture-field">
            <label>講義回</label>

            <select
              value={lectureNo}
              onChange={(e) =>
                setLectureNo(
                  Number(e.target.value)
                )
              }
            >
              {Array.from(
                { length: Math.max(lectureCount, lectureNo) },
                (_, index) => index + 1
                ).map((number) => (
                <option key={number} value={number}>
                  第{number}回
                  </option>
                  ))}
            </select>
          </div>
        </div>

        <div className="editor-field">
          <label>本文</label>

          <textarea
            value={content}
            placeholder="授業内容やメモを入力"
            onChange={(e) =>
              setContent(e.target.value)
            }
          />
        </div>

        <div className="material-section">
          <div className="material-header">
            <div>
              <h2>授業資料</h2>

              <p>
                PDFや画像などをノートと一緒に保存できます。
              </p>
            </div>

            <label className="upload-button">
              ＋ 資料を追加

              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {files.length === 0 ? (
            <div className="empty-files">
              まだ資料はありません。
            </div>
          ) : (
            <div className="file-list">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="file-item"
                >
                  <button
                    type="button"
                    className="file-open-button"
                    onClick={() => openFile(file)}
                  >
                    <div>
                      <strong>{file.name}</strong>
                      <p>クリックして資料を開く</p>
                    </div>
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    className="note-delete-button"
                    onClick={() => handleDeleteFile(index)}
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label
          className={`important-box ${
            important
              ? "important-box-checked"
              : ""
          }`}
        >
          <input
            type="checkbox"
            checked={important}
            onChange={(e) =>
              setImportant(
                e.target.checked
              )
            }
          />

          <div>
            <strong>
              重要な資料
            </strong>

            <p>
              復習や試験前に確認したい資料として登録します。
            </p>
          </div>
        </label>
      </div>
    </main>
  );
}