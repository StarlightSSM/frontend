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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddPost = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    // ✅ 입력값 검증
    if (!isValidTitle(title)) {
      alert("제목은 1~20자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidContent(content)) {
      alert("내용은 1~3000자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidPassword(password)) {
      alert("비밀번호는 4자리 숫자만 입력 가능합니다.")
      return setIsSubmitting(false)
    }

    // ✅ 0.8초 후 게시글 추가 (작성 중... 표시 유지)
    setTimeout(() => {
      const newPost: Post = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        nickname: nickname.trim(),
        password,
        createdAt: new Date().toISOString(),
      }

      posts.unshift(newPost)
      alert("게시글이 등록되었습니다.")

      // ✅ 0.7초 뒤 버튼 다시 활성화
      setTimeout(() => setIsSubmitting(false), 700)

      navigate("/")
    }, 800)
  }

  return (
    <div className="max-w-2xl p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-center sm:text-left">게시글 작성</h1>
      <div className="p-4 border rounded shadow-sm bg-white">
        <input
          type="text"
          placeholder="제목 (1~20자)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <textarea
          placeholder="내용 (1~3000자)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-2 mb-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <input
          type="text"
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />
        <input
          type="password"
          placeholder="비밀번호 (4자리 숫자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
        />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleAddPost}
            disabled={isSubmitting}
            className={`text-white px-4 py-2 rounded transition ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "작성 중..." : "작성 완료"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
