import { useState } from "react";
import type { Note } from "../types/Note";

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

  const [category, setCategory] =
    useState(note.category ?? "");

  const [subject, setSubject] =
    useState(note.subject ?? "");

  const [lectureNo, setLectureNo] =
    useState(note.lectureNo ?? 1);

  const [content, setContent] =
    useState(note.content);

  const [important, setImportant] =
    useState(note.important ?? false);

  const [files, setFiles] =
    useState(note.files ?? []);

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

  const save = async () => {
    await updateNote({
      ...note,
      title,
      category,
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
      <h1>ノート編集</h1>

      <label>タイトル</label>

      <input
        type="text"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

<div className="editor-row">
  <div className="editor-field">
    <label>カテゴリー</label>

    <select
      value={category}
      onChange={(e) =>
        setCategory(e.target.value)
      }
    >
      <option value="">
        カテゴリーを選択
      </option>
      <option value="数学・理系">数学・理系</option>
      <option value="言語">言語</option>
      <option value="社会・人文">社会・人文</option>
      <option value="情報・IT">情報・IT</option>
      <option value="資格・試験">資格・試験</option>
      <option value="研修・仕事">研修・仕事</option>
      <option value="その他">その他</option>
    </select>
  </div>

  <div className="editor-field">
    <label>授業・分野名</label>

    <input
      type="text"
      value={subject}
      placeholder="例：数学、データベース、新人研修"
      onChange={(e) =>
        setSubject(e.target.value)
      }
    />
  </div>
</div>

      <label>講義回</label>

      <select
        value={lectureNo}
        onChange={(e) =>
          setLectureNo(Number(e.target.value))
        }
      >
        {Array.from(
          { length: 15 },
          (_, index) => index + 1
        ).map((number) => (
          <option
            key={number}
            value={number}
          >
            第{number}回
          </option>
        ))}
      </select>

      <label>本文</label>

      <textarea
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      <h3>授業資料</h3>

      <input
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
      />

      <h3>アップロード済み資料</h3>

      <ul>
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`}>
            <button
              type="button"
              onClick={() => {
                const fileUrl =
                  URL.createObjectURL(
                    file.data
                  );

                window.open(
                  fileUrl,
                  "_blank",
                  "noopener,noreferrer"
                );

                window.setTimeout(() => {
                  URL.revokeObjectURL(
                    fileUrl
                  );
                }, 60000);
              }}
            >
              {file.name}
            </button>
          </li>
        ))}
      </ul>

      <label
  className={`important-box ${
    important ? "important-box-checked" : ""
  }`}
>
  <input
    type="checkbox"
    checked={important}
    onChange={(e) =>
      setImportant(e.target.checked)
    }
  />

  <div>
    <strong>重要な資料</strong>
    <p>
      復習や試験前に確認したい資料として登録します
    </p>
  </div>
</label>

<button
  type="button"
  className="save-button"
  onClick={save}
>
  保存
</button>
    </main>
  );
}