import React, { useState } from "react";
import { Post } from "../types/types.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.js";

interface PostFormProps {
  mode: "create" | "edit";
  initial?: Partial<Post>;
  onSubmit: (data: { title: string; content: string; nickname: string; password: string }) => void;
}

export const PostForm: React.FC<PostFormProps> = ({ mode, initial = {}, onSubmit }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initial.title || "");
  const [content, setContent] = useState(initial.content || "");
  const [nickname, setNickname] = useState(initial.nickname || "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!title.trim() || title.trim().length > 20) return "제목은 1~20자여야 합니다.";
    if (!content.trim() || content.trim().length > 3000) return "내용은 1~3000자여야 합니다.";
    if (!nickname.trim() || !/^[A-Za-z0-9가-힣]{1,10}$/.test(nickname.trim()))
      return "닉네임은 1~10자의 영문/숫자/한글만 가능합니다.";
    if (!/^\d{4}$/.test(password)) return "비밀번호는 4자리 숫자여야 합니다.";
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const err = validate();
    if (err) return alert(err);

    setSubmitting(true);
    onSubmit({ title, content, nickname, password });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">{mode === "create" ? "게시글 작성" : "게시글 수정"}</h2>

      <div>
        <label className="block mb-1 font-semibold">제목</label>
        <input
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">내용</label>
        <textarea
          className="w-full p-2 border rounded"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={3000}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold">닉네임</label>
          <input
            className="w-full p-2 border rounded"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={10}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">비밀번호 (4자리)</label>
          <input
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={4}
            inputMode="numeric"
            pattern="\d*"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "제출중..." : "제출"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(-1)}>
          취소
        </Button>
      </div>
    </form>
  );
};
