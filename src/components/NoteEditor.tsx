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

  const [content, setContent] =
    useState(note.content);

    const handleFileUpload = async (
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
    
      await updateNote({
        ...note,
        title,
        content,
        files: [
          ...note.files,
          ...uploadedFiles,
        ],
      });
    
      event.target.value = "";
    };

    const save = async () => {
      await updateNote({
        ...note,
        title,
        content,
      });
    
      goBack();
    };

  return (
    <main className="editor">
      <h1>ノート編集</h1>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      <h3>授業資料アップロード</h3>

      <input
        type="file"
        multiple
        accept="
          .pdf,
          .doc,
          .docx,
          .ppt,
          .pptx,
          .jpg,
          .jpeg,
          .png
        "
        onChange={handleFileUpload}
      />

      <button onClick={save}>
        保存
      </button>

      <h3>
        アップロード済み資料
      </h3>

      <ul>
  {note.files.map((file, index) => (
    <li key={`${file.name}-${index}`}>
      <button
        type="button"
        onClick={() => {
          const fileUrl = URL.createObjectURL(
            file.data
          );

          window.open(
            fileUrl,
            "_blank",
            "noopener,noreferrer"
          );

          window.setTimeout(() => {
            URL.revokeObjectURL(fileUrl);
          }, 60000);
        }}
      >
        {file.name}
      </button>
    </li>
  ))}
</ul>
    </main>
  );
}