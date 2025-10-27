import React, { useEffect, useState } from "react";
import { PostForm } from "../components/PostForm.js";
import { Post } from "../types/types.js";
import { useNavigate, useParams } from "react-router-dom";

export const PostEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<Partial<Post> | null>(null);

  useEffect(() => {
    // 실제로는 API 호출
    setInitial({
      id: Number(id),
      title: "기존 제목",
      content: "기존 내용",
      nickname: "작성자",
    });
  }, [id]);

  if (!initial) return <div className="p-4">로딩중...</div>;

  const handleSubmit = (data: { title: string; content: string; nickname: string; password: string }) => {
    console.log("수정 데이터:", data);
    alert("글 수정 완료!");
    navigate(`/posts/${id}`);
  };

  return <PostForm mode="edit" initial={initial} onSubmit={handleSubmit} />;
};
