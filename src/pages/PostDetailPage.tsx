import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Post } from "../types/types.js";

export const PostDetailPage: React.FC = () => {
  const { id } = useParams();
  const [post] = useState<Post>({
    id: Number(id),
    title: `샘플 게시글 ${id}`,
    content: "이것은 상세 내용입니다.",
    nickname: "작성자",
    createdAt: new Date().toISOString(),
  });

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        작성자: {post.nickname} · {new Date(post.createdAt).toLocaleString()}
      </div>
      <p className="whitespace-pre-wrap">{post.content}</p>
    </div>
  );
};
