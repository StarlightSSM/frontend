import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

interface Comment {
  id: number
  nickname: string
  content: string
  createdAt: string
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

  // ✅ 게시글 상세 조회
  const fetchBoard = async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await axios.get<{ data: Board; message: string }>(
        `http://localhost:8080/boards/${boardId}`
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

    if (!nickname.trim() || nickname.length > 10)
      return alert("닉네임은 1~10자 이내로 입력해주세요.")
    if (!content.trim() || content.length > 200)
      return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!/^[0-9]{4}$/.test(password))
      return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      await axios.post(`http://localhost:8080/boards/${board.id}/comments`, newComment)
      alert("댓글이 등록되었습니다 ✅")
      setNewComment({ nickname: "", content: "", password: "" })
      fetchBoard()
    } catch (err) {
      console.error(err)
      alert("댓글 등록 실패 ❌")
    }
  }

  /* ---------------- 게시글 수정 ---------------- */
  const handleEditPost = () => {
    navigate(`/boards/${boardId}/edit`)
  }

  /* ---------------- 게시글 삭제 ---------------- */
  const handleDeletePost = async () => {
    const password = prompt("게시글 비밀번호(4자리 숫자)를 입력하세요.")
    if (!password) return
    if (!/^[0-9]{4}$/.test(password)) return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      await axios.delete(`http://localhost:8080/boards/${boardId}`, {
        params: { password },
      })
      alert("게시글이 삭제되었습니다 🗑️")
      navigate("/boards")
    } catch (err) {
      console.error(err)
      alert("게시글 삭제 실패 ❌ (비밀번호 불일치 또는 서버 오류)")
    }
  }

  /* ---------------- 렌더링 ---------------- */
  if (loading) return <p className="p-4">불러오는 중...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!board) return <p className="p-4">게시글을 찾을 수 없습니다.</p>

  return (
    <div className="max-w-2xl p-4 mx-auto">
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
          onClick={() => navigate("/")}
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
            <div key={c.id} className="py-2 border-b">
              <div className="text-sm text-gray-600">
                {c.nickname} • {new Date(c.createdAt).toLocaleString()}
              </div>
              <p>{c.content}</p>
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
          placeholder="닉네임"
          value={newComment.nickname}
          onChange={(e) => setNewComment({ ...newComment, nickname: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="댓글 내용"
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          placeholder="비밀번호 (4자리)"
          value={newComment.password}
          onChange={(e) => setNewComment({ ...newComment, password: e.target.value })}
          maxLength={4}
          inputMode="numeric"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          댓글 작성
        </button>
      </div>
    </div>
  )
}
