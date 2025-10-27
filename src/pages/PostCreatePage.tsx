import React from "react";
import { PostForm } from "../components/PostForm.js";
import { useNavigate } from "react-router-dom";

export const PostCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: { title: string; content: string; nickname: string; password: string }) => {
    console.log("새 글 데이터:", data);
    // 여기서 새 글 생성 로직 수행
    alert("글 생성 완료!");
    navigate("/");
  };

  return <PostForm mode="create" onSubmit={handleSubmit} />;
};
