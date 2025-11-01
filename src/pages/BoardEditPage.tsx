import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { Board } from "@/types/types"

// 유효성 검사 함수
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 3000
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

export const BoardEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [board, setBoard] = useState<Board | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")
  const [showPwInput, setShowPwInput] = useState(false)
  const [inputPw, setInputPw] = useState("")
  const [pwError, setPwError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState<Board | null>(null) // ✅ 원본 상태 저장

  // ✅ 게시글 상세 불러오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get<{ data: Board }>(
          `http://localhost:8085/boards/${id}`
        )
        const data = res.data.data
        setBoard(data)
        setOriginalData(data) // ✅ 원본 저장
        setTitle(data.title)
        setContent(data.content)
        setNickname(data.nickname)
      } catch (err) {
        console.error(err)
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다 ❌")
      }
    }

    if (id) fetchBoard()
  }, [id])

  if (!board) return <div className="p-4">게시글을 찾을 수 없습니다.</div>

  // ✅ 입력 제한 (글자수 초과 방지)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) setTitle(e.target.value)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 3000) setContent(e.target.value)
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) setNickname(e.target.value)
  }

  // ✅ 수정 시작
  const handleStartUpdate = () => {
    // ✅ 변경된 부분이 없는지 확인
    if (
      originalData &&
      title.trim() === originalData.title &&
      content.trim() === originalData.content &&
      nickname.trim() === originalData.nickname
    ) {
      alert("변경 사항이 없습니다.")
      navigate(`/boards/${board.id}`) // Detail로 돌아가기
      return
    }

    setShowPwInput(true)
    setInputPw("")
    setPwError("")
  }

  // ✅ 비밀번호 확인 및 수정 요청
  const handleConfirmPassword = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    if (!isValidPassword(inputPw)) {
      setPwError("비밀번호는 4자리 숫자여야 합니다.")
      return setIsSubmitting(false)
    }

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

    try {
      await axios.put(`http://localhost:8085/boards/${board.id}`, {
        title: title.trim(),
        content: content.trim(),
        nickname: nickname.trim(),
        password: inputPw.trim(),
      })
      alert("게시글이 수정되었습니다 ✅")
      navigate(`/boards/${board.id}`)
    } catch (err) {
      console.error(err)
      setPwError("비밀번호가 일치하지 않거나 수정 실패 ❌")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl p-4 mx-auto sm:p-6 md:p-8">
      <h1 className="mb-4 text-2xl font-bold text-center sm:text-left">게시글 수정</h1>
      <div className="p-4 bg-white border rounded shadow-sm">

        {/* 제목 */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="제목 (1~20자)"
          className="w-full p-2 mb-1 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400 mb-2">{title.length}/20</p>

        {/* 내용 */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="내용 (1~3000자)"
          className="w-full h-40 p-2 mb-1 border rounded resize-none focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400 mb-2">{content.length}/3000</p>

        {/* 닉네임 */}
        <input
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          className="w-full p-2 mb-1 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <p className="text-right text-sm text-gray-400 mb-4">{nickname.length}/10</p>

        {/* 비밀번호 입력창 */}
        {showPwInput && (
          <div className="p-3 mb-4 border rounded bg-gray-50">
            <p className="mb-2 font-semibold text-gray-700">비밀번호 확인</p>
            <input
              type="password"
              value={inputPw}
              onChange={(e) => setInputPw(e.target.value)}
              placeholder="비밀번호 4자리 입력"
              maxLength={4}
              className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-300"
            />
            {pwError && <p className="mb-2 text-sm text-red-500">{pwError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleConfirmPassword}
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded ${
                  isSubmitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "처리 중..." : "확인"}
              </button>
              <button
                onClick={() => setShowPwInput(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 기본 버튼 */}
        {!showPwInput && (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleStartUpdate}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              수정 완료
            </button>
            <button
              onClick={() => navigate(`/boards/${board.id}`)}
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
