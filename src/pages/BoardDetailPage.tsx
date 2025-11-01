import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

interface Comment {
  id: number
  nickname: string
  content: string
  createdAt: string
  updatedAt?: string // ✅ 수정 시각 추가
}

interface Board {
  id: number
  title: string
  content: string
  nickname: string
  createdAt: string
  comments: Comment[]
}

export const BoardDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const boardId = Number(id)
  const navigate = useNavigate()

  const [board, setBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newComment, setNewComment] = useState({ nickname: "", content: "", password: "" })

  // 🔐 댓글 수정/삭제 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null)
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editNickname, setEditNickname] = useState("")

  // 🔐 게시글 삭제 모달 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")

  // 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // ✅ 게시글 상세 조회
  const fetchBoard = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await axios.get<{ data: Board; message: string }>(
        `http://localhost:8085/boards/${boardId}`
      )
      setBoard(res.data.data)
      setError("")
    } catch (err) {
      console.error(err)
      setError("게시글을 불러오는 중 오류가 발생했어요.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoard()
  }, [id])

  /* ---------------- 댓글 작성 ---------------- */
  const handleAddComment = async () => {
    if (!board) return
    const { nickname, content, password } = newComment

    // ✅ 유효성 검사
    const isValidNickname = nickname.trim().length > 0 && nickname.length <= 10
    const isValidContent = content.trim().length > 0 && content.length <= 200
    const isValidPassword = /^[0-9]{4}$/.test(password)

    if (!isValidNickname) return alert("닉네임은 1~10자 이내로 입력해주세요.")
    if (!isValidContent) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidPassword) return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      setIsSubmitting(true)
      await axios.post(`http://localhost:8085/boards/${board.id}/comments`, newComment)
      alert("댓글이 등록되었습니다 ✅")
      setNewComment({ nickname: "", content: "", password: "" })
      fetchBoard()
    } catch (err) {
      console.error(err)
      alert("댓글 등록 실패 ❌")
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ---------------- 게시글 수정 ---------------- */
  const handleEditPost = () => {
    navigate(`/boards/${boardId}/edit`)
  }

  /* ---------------- 게시글 삭제 (모달) ---------------- */
  const handleDeletePost = () => {
    setShowDeleteModal(true)
    setDeletePassword("")
  }

  const confirmDeletePost = async () => {
    if (!/^[0-9]{4}$/.test(deletePassword))
      return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      await axios.delete(`http://localhost:8085/boards/${boardId}`, {
        params: { password: deletePassword },
      })
      alert("게시글이 삭제되었습니다 🗑️")
      navigate("/boards")
    } catch (err) {
      console.error(err)
      alert("게시글 삭제 실패 ❌ (비밀번호 불일치 또는 서버 오류)")
    } finally {
      setShowDeleteModal(false)
    }
  }

  /* ---------------- 댓글 수정/삭제 모달 처리 ---------------- */
  const openPasswordModal = (commentId: number, type: "edit" | "delete") => {
    setTargetCommentId(commentId)
    setActionType(type)
    setPassword("")
    setShowPasswordModal(true)

    if (type === "edit") {
      const comment = board?.comments.find((c) => c.id === commentId)
      if (comment) {
        setEditNickname(comment.nickname)
        setEditContent(comment.content)
      }
    }
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setTargetCommentId(null)
    setActionType(null)
  }

  const handleConfirmPassword = async () => {
    if (!/^[0-9]{4}$/.test(password))
      return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      setIsUpdating(true)

      if (actionType === "delete") {
        await axios.delete(
          `http://localhost:8085/boards/comments/${targetCommentId}`,
          { params: { password } }
        )
        alert("댓글이 삭제되었습니다 🗑️")
      } else if (actionType === "edit") {
        const originalComment = board?.comments.find((c) => c.id === targetCommentId)
        if (!originalComment) return alert("댓글을 찾을 수 없습니다.")

        const trimmedNickname = editNickname.trim()
        const trimmedContent = editContent.trim()

        const isValidNickname =
          trimmedNickname.length > 0 && trimmedNickname.length <= 10
        const isValidContent =
          trimmedContent.length > 0 && trimmedContent.length <= 200

        // ✅ 동일 내용일 경우 수정 불가 처리
        const isSameContent =
          trimmedNickname === originalComment.nickname &&
          trimmedContent === originalComment.content

        if (!isValidNickname) return alert("닉네임은 1~10자 이내로 입력해주세요.")
        if (!isValidContent) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
        if (isSameContent) {
          alert("변경된 내용이 없습니다.")
          closePasswordModal()
          return
        }

        await axios.put(
          `http://localhost:8085/boards/comments/${targetCommentId}`,
          {
            content: trimmedContent,
            nickname: trimmedNickname,
            password,
          }
        )
        alert("댓글이 수정되었습니다 ✏️")
      }

      fetchBoard()
    } catch (err) {
      console.error(err)
      alert("비밀번호 불일치 또는 요청 실패 ❌")
    } finally {
      setIsUpdating(false)
      closePasswordModal()
    }
  }

  /* ---------------- 렌더링 ---------------- */
  if (loading) return <p className="p-4">불러오는 중...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!board) return <p className="p-4">게시글을 찾을 수 없습니다.</p>

  return (
    <div className="relative max-w-2xl p-4 mx-auto">
      <h2 className="mb-2 text-xl font-bold break-words">{board.title}</h2>
      <p className="mb-3 break-words whitespace-pre-wrap">{board.content}</p>
      <p className="mb-4 text-sm text-gray-500">
        작성자: {board.nickname} • {new Date(board.createdAt).toLocaleString()}
      </p>

      {/* ✅ 수정 / 삭제 / 목록 버튼 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleEditPost}
          className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
        >
          수정 ✏️
        </button>
        <button
          onClick={handleDeletePost}
          className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
        >
          삭제 🗑️
        </button>
        <button
          onClick={() => navigate("/boards")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          목록으로
        </button>
      </div>

      {/* ✅ 댓글 목록 */}
      <div className="mt-6">
        <h3 className="mb-2 font-semibold">댓글</h3>
        {board.comments && board.comments.length > 0 ? (
          board.comments.map((c) => (
            <div key={c.id} className="p-3 mb-2 bg-white border rounded shadow-sm">
              <div className="flex justify-between">
                <div>
                  <span className="font-semibold">{c.nickname}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openPasswordModal(c.id, "edit")}
                    className="px-2 py-1 text-sm border rounded hover:bg-blue-50"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => openPasswordModal(c.id, "delete")}
                    className="px-2 py-1 text-sm border rounded hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-800 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">댓글이 없습니다.</p>
        )}
      </div>

      {/* ✅ 댓글 작성 */}
      <div className="p-3 mt-4 border rounded bg-gray-50">
        <h3 className="mb-2 font-semibold">댓글 작성</h3>
        <input
          placeholder="닉네임 (1~10자)"
          value={newComment.nickname}
          onChange={(e) => {
            const value = e.target.value
            if (value.length <= 10)
              setNewComment({ ...newComment, nickname: value })
          }}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="댓글 내용 (1~200자)"
          value={newComment.content}
          onChange={(e) => {
            const value = e.target.value
            if (value.length <= 200)
              setNewComment({ ...newComment, content: value })
          }}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 (4자리 숫자)"
          value={newComment.password}
          onChange={(e) => {
            const value = e.target.value
            if (/^[0-9]{0,4}$/.test(value))
              setNewComment({ ...newComment, password: value })
          }}
          className="w-full p-2 mb-2 border rounded"
          inputMode="numeric"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isSubmitting ? "작성중..." : "댓글 작성"}
        </button>
      </div>

      {/* 🔐 댓글 수정/삭제 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-6 text-center bg-white rounded shadow-lg w-80">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              {actionType === "delete" ? "댓글 삭제" : "댓글 수정"}
            </h3>

            {actionType === "edit" && (
              <>
                <input
                  type="text"
                  value={editNickname}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 10) setEditNickname(value)
                  }}
                  placeholder="닉네임 (1~10자)"
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 200) setEditContent(value)
                  }}
                  placeholder="댓글 내용 (1~200자)"
                  className="w-full p-2 mb-3 border rounded resize-none"
                />
              </>
            )}

            <input
              type="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value
                if (/^[0-9]{0,4}$/.test(value)) setPassword(value)
              }}
              maxLength={4}
              placeholder="비밀번호 (4자리 숫자)"
              className="w-full p-2 mb-4 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex justify-center gap-3">
              <button
                onClick={handleConfirmPassword}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                {isUpdating
                  ? actionType === "edit"
                    ? "수정중..."
                    : "삭제중..."
                  : "확인"}
              </button>
              <button
                onClick={closePasswordModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔒 게시글 삭제 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-6 text-center bg-white rounded shadow-lg w-80">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">게시글 삭제</h3>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              maxLength={4}
              placeholder="비밀번호 (4자리 숫자)"
              className="w-full p-2 mb-4 text-center border rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmDeletePost}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                삭제
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
