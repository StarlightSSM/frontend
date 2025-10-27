import React, { useState } from "react";

interface Props {
  onSubmit: (content: string, nickname: string, password: string) => void;
}

export const CommentForm: React.FC<Props> = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!content.trim() || content.length > 200) return alert("댓글은 1~200자여야 합니다.");
    if (!/^[A-Za-z0-9가-힣]{1,10}$/.test(nickname)) return alert("닉네임은 1~10자 영문/숫자/한글만 가능합니다.");
    if (!/^\d{4}$/.test(password)) return alert("비밀번호는 4자리 숫자여야 합니다.");

    setSubmitting(true);
    onSubmit(content, nickname, password);
    setContent("");
    setNickname("");
    setPassword("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={200}
        className="w-full p-2 border rounded mb-2"
        placeholder="댓글을 입력하세요 (200자)"
      />
      <div className="grid grid-cols-3 gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={10}
          className="p-2 border rounded"
          placeholder="닉네임"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={4}
          inputMode="numeric"
          pattern="\d*"
          className="p-2 border rounded"
          placeholder="비밀번호(4자리)"
        />
        <button type="submit" disabled={submitting} className="px-3 py-2 bg-blue-600 text-white rounded">
          {submitting ? "작성중..." : "댓글 작성"}
        </button>
      </div>
    </form>
  );
};
