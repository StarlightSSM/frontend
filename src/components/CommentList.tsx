import React, { useState } from "react";
import { Comment } from "../types/types.js";

interface Props {
  comments: Comment[];
  onUpdate: (commentId: number, content: string, nickname: string) => void;
  onDelete: (commentId: number) => void;
}

export const CommentList: React.FC<Props> = ({ comments, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editNickname, setEditNickname] = useState("");

  const handleStartEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditContent(c.content);
    setEditNickname(c.nickname);
  };

  const handleSave = (id: number) => {
    if (!editContent.trim() || editContent.length > 200) return alert("댓글은 1~200자여야 합니다.");
    if (!/^[A-Za-z0-9가-힣]{1,10}$/.test(editNickname.trim()))
      return alert("닉네임은 1~10자 영문/숫자/한글만 가능합니다.");

    onUpdate(id, editContent.trim(), editNickname.trim());
    setEditingId(null);
    setEditContent("");
    setEditNickname("");
  };

  return (
    <div className="space-y-3">
      {comments.length === 0 && <div className="text-gray-500">댓글이 없습니다.</div>}

      {comments.map((c) => (
        <div key={c.id} className="border p-3 rounded bg-white shadow-sm">
          {editingId === c.id ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2 mb-2">
                <input
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  maxLength={10}
                  placeholder="닉네임 (1~10자)"
                  title="닉네임 입력란"
                  className="p-2 border rounded flex-1 focus:ring-2 focus:ring-blue-300"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  maxLength={200}
                  placeholder="댓글 내용 (1~200자)"
                  title="댓글 수정 입력란"
                  className="p-2 border rounded flex-1 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleSave(c.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{c.nickname}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEdit(c)}
                    className="px-2 py-1 text-sm border rounded hover:bg-blue-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(c.id)}
                    className="px-2 py-1 text-sm border rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div className="mt-2 text-gray-800 whitespace-pre-wrap">{c.content}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
