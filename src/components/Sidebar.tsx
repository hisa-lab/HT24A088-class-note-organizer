import { useState } from "react";

type Props = {
  addNote: (
    title: string,
    content: string
  ) => Promise<void>;
};

export default function Sidebar({
  addNote,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const createNote = async () => {
    if (!title.trim()) return;
  
    await addNote(title, content);
  
    setTitle("");
    setContent("");
  };

  return (
    <aside className="sidebar">
      <h2>Note Organizer</h2>

      <h3>ファイル作成</h3>

      <input
        type="text"
        placeholder="タイトル"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <textarea
        placeholder="内容"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
      />

      <button onClick={createNote}>
        作成
      </button>
    </aside>
  );
}