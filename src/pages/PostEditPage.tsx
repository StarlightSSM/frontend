import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Post } from "@/types/types.js"
import { posts } from "@/data/posts.js"

// ✅ 유효성 검사 함수
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 3000
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

export const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = Number(id)

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")

  // ✅ 비밀번호 입력 UI 상태
  const [showPwInput, setShowPwInput] = useState(false)
  const [inputPw, setInputPw] = useState("")
  const [pwError, setPwError] = useState("")

  useEffect(() => {
    const target = posts.find((p) => p.id === postId && !p.deleted)
    if (target) {
      setPost(target)
      setTitle(target.title)
      setContent(target.content)
      setNickname(target.nickname)
    }
  }, [postId])

  if (!post) return <div className="p-4">게시글을 찾을 수 없습니다.</div>

  /* ✅ 수정 버튼 클릭 → 비밀번호 입력창 표시 */
  const handleStartUpdate = () => {
    setShowPwInput(true)
    setInputPw("")
    setPwError("")
  }

  /* ✅ 비밀번호 확인 후 수정 반영 */
  const handleConfirmPassword = () => {
    if (!isValidPassword(inputPw)) {
      setPwError("비밀번호는 4자리 숫자여야 합니다.")
      return
    }
    if (inputPw !== post.password) {
      setPwError("비밀번호가 일치하지 않습니다.")
      return
    }

    // ✅ 유효성 검사
    if (!isValidTitle(title)) return alert("제목은 1~20자 이내로 입력해주세요.")
    if (!isValidContent(content)) return alert("내용은 1~3000자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    // ✅ 수정 반영
    const updated: Post = {
      ...post,
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      updatedAt: new Date().toISOString(),
    }

    const idx = posts.findIndex((p) => p.id === postId)
    if (idx !== -1) posts[idx] = updated
    setPost(updated)

    alert("게시글이 수정되었습니다.")
    navigate(`/posts/${postId}`)
  }

  return (
    <div className="max-w-2xl p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">게시글 수정</h1>
      <div className="p-4 border rounded shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 (1~20자)"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용 (1~3000자)"
          className="w-full h-40 p-2 mb-2 border rounded resize-none"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          className="w-full p-2 mb-4 border rounded"
        />

        {/* ✅ 비밀번호 입력 UI */}
        {showPwInput && (
          <div className="p-3 mb-4 border rounded bg-gray-50">
            <p className="mb-2 font-semibold">비밀번호 확인</p>
            <input
              type="password"
              value={inputPw}
              onChange={(e) => setInputPw(e.target.value)}
              placeholder="비밀번호 4자리 입력"
              className="w-full p-2 mb-2 border rounded"
            />
            {pwError && <p className="mb-2 text-sm text-red-500">{pwError}</p>}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleConfirmPassword}
                className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                확인
              </button>
              <button
                onClick={() => setShowPwInput(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* ✅ 기본 버튼 */}
        {!showPwInput && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleStartUpdate}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              수정 완료
            </button>
            <button
              onClick={() => navigate(`/posts/${postId}`)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
