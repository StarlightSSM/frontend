import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// ✅ 유효성 검사 함수
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 3000
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

export const BoardCreatePage: React.FC = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ 글자수 제한: 입력 단계에서 초과 방지
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 20) setTitle(value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= 3000) setContent(value)
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= 10) setNickname(value)
  }

  // ✅ 게시글 등록
  const handleAddBoard = async () => {
    if (isSubmitting) return

    // 유효성 검사 (버튼 비활성화는 하지 않음)
    if (!isValidTitle(title)) return alert("제목은 1~20자 이내로 입력해주세요.")
    if (!isValidContent(content)) return alert("내용은 1~3000자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
    if (!isValidPassword(password)) return alert("비밀번호는 4자리 숫자만 입력 가능합니다.")

    // 모든 유효성 통과 시 요청 시작
    setIsSubmitting(true)

    try {
      const res = await axios.post("http://localhost:8085/boards", {
        title,
        content,
        nickname,
        password,
      })

      console.log("게시글 등록 성공 ✅", res.data)
      alert("게시글이 등록되었습니다.")
      navigate("/boards")
    } catch (err) {
      console.error("게시글 등록 실패 ❌", err)
      alert("게시글 등록 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-center sm:text-left">게시글 작성</h1>
      <div className="p-4 bg-white border rounded shadow-sm">

        {/* 제목 */}
        <input
          type="text"
          placeholder="제목 (1~20자)"
          value={title}
          onChange={handleTitleChange}
          className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400">{title.length}/20</p>

        {/* 내용 */}
        <textarea
          placeholder="내용 (1~3000자)"
          value={content}
          onChange={handleContentChange}
          className="w-full h-40 p-2 mb-2 border rounded resize-none focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400">{content.length}/3000</p>

        {/* 닉네임 */}
        <input
          type="text"
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          value={nickname}
          onChange={handleNicknameChange}
          className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400">{nickname.length}/10</p>

        {/* 비밀번호 */}
        <input
          type="password"
          placeholder="비밀번호 (4자리 숫자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-blue-300"
        />

        {/* 버튼 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleAddBoard}
            className={`text-white px-4 py-2 rounded transition-colors duration-200 ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "작성 중..." : "작성 완료"}
          </button>

          <button
            onClick={() => navigate("/boards")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
