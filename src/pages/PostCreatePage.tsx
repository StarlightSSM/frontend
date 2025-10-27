import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { posts } from "@/data/posts.js"
import { Post } from "@/types/types.js"

export const PostCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleAddPost = () => {
    if (!title.trim() || !content.trim()) return
    const newPost: Post = {
      id: Date.now(),
      title,
      content,
      nickname: "익명",
      password: "1234",
      createdAt: new Date().toISOString(),
    }
    posts.unshift(newPost) // 기존 데이터 앞에 추가
    navigate("/") // 메인 페이지로 이동
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>
      <div className="border p-4">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-1 w-full mb-2"
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-1 w-full mb-2"
        />
        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-3 py-1"
        >
          작성 완료
        </button>
      </div>
    </div>
  )
}
