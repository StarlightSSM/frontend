import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { posts } from "@/data/posts.js"
import { Post } from "@/types/types.js"

// ✅ 유효성 검사 함수
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 3000
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

export const PostCreatePage: React.FC = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")

  const handleAddPost = () => {
    // ✅ 입력값 검증
    if (!isValidTitle(title)) {
      alert("제목은 1~20자 이내로 입력해주세요.")
      return
    }
    if (!isValidContent(content)) {
      alert("내용은 1~3000자 이내로 입력해주세요.")
      return
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return
    }
    if (!isValidPassword(password)) {
      alert("비밀번호는 4자리 숫자만 입력 가능합니다.")
      return
    }

    // ✅ 새 게시글 생성
    const newPost: Post = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      password,
      createdAt: new Date().toISOString(),
    }

    posts.unshift(newPost) // 최신글을 맨 위로
    alert("게시글이 등록되었습니다.")
    navigate("/") // 메인 페이지로 이동
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 작성</h1>
      <div className="border p-4 rounded-md shadow-sm">
        <input
          type="text"
          placeholder="제목 (1~20자)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          placeholder="내용 (1~3000자)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full mb-2 rounded h-40 resize-none"
        />
        <input
          type="text"
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 (4자리 숫자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAddPost}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  )
}
