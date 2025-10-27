import React from "react";
import { Comment } from "../types/types.js";

interface Props {
  comments: Comment[];
  onUpdate: (commentId: number, content: string, nickname: string) => void;
  onDelete: (commentId: number) => void;
}

export const CommentList: React.FC<Props> = ({ comments, onUpdate, onDelete }) => {
  return (
    <div className="space-y-3">
      {comments.length === 0 && <div className="text-gray-500">댓글이 없습니다.</div>}
      {comments.map((c) => (
        <div key={c.id} className="border p-3 rounded">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{c.nickname}</div>
              <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newContent = prompt("수정할 내용을 입력하세요", c.content) || "";
                  const newNick = prompt("닉네임 변경(비워두면 기존 유지)", c.nickname) || c.nickname;
                  if (!newContent) return;
                  onUpdate(c.id, newContent, newNick);
                }}
                className="px-2 py-1 border rounded"
              >
                수정
              </button>
              <button onClick={() => onDelete(c.id)} className="px-2 py-1 border rounded">
                삭제
              </button>
            </div>
          </div>
          <div className="mt-2">{c.content}</div>
        </div>
      ))}
    </div>
  );
};
