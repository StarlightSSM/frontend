import React, { useState } from "react"

interface Props {
  onSubmit: (content: string, nickname: string, password: string) => Promise<void> | void
}

export const CommentForm: React.FC<Props> = ({ onSubmit }) => {
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    if (!content.trim() || content.length > 200)
      return "댓글은 1~200자 이내로 입력해주세요."
    if (!/^[A-Za-z0-9가-힣]{1,10}$/.test(nickname.trim()))
      return "닉네임은 1~10자의 영문/숫자/한글만 가능합니다."
    if (!/^[0-9]{4}$/.test(password))
      return "비밀번호는 4자리 숫자여야 합니다."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    const err = validate()
    if (err) return alert(err)

    setSubmitting(true)
    try {
      await onSubmit(content.trim(), nickname.trim(), password.trim())
      setContent("")
      setNickname("")
      setPassword("")
    } finally {
      // ✅ 일정 시간(예: 1.5초) 뒤에 다시 활성화
      setTimeout(() => {
        setSubmitting(false)
      }, 1500)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded shadow-sm mt-4 space-y-2"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={200}
        placeholder="댓글을 입력하세요 (최대 200자)"
        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={10}
          className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="닉네임 (1~10자)"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={4}
          inputMode="numeric"
          pattern="\d*"
          className="p-2 border rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="비밀번호 (4자리)"
        />
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 text-white rounded transition flex-shrink-0 ${
            submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {submitting ? "등록 중..." : "댓글 작성"}
        </button>
      </div>
    </form>
  )
}
