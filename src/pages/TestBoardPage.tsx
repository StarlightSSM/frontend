import React, { useEffect, useState } from "react"
import { boardAPI } from "@/components/lib/board.js"
import axios from "axios"

interface Comment {
  id: number
  nickname: string
  content: string
  password?: string
  createdAt?: string
  deleted?: boolean
}

interface Board {
  id: number
  title: string
  content: string
  nickname: string
  password?: string
  createdAt?: string
  deleted?: boolean
  comments?: Comment[]
}

export const TestBoardPage: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [loading, setLoading] = useState(false)

  const [newBoard, setNewBoard] = useState({
    title: "",
    content: "",
    nickname: "",
    password: "",
  })

  const [newComment, setNewComment] = useState({
    nickname: "",
    content: "",
    password: "",
  })

  /** ✅ 게시글 목록 불러오기 */
  const fetchBoards = async () => {
    setLoading(true)
    try {
      const res = await boardAPI.getAll()
      console.log(res)
      setBoards(res.data.data)
    } catch (err) {
      console.error(err)
      alert("게시글 목록 불러오기 실패 ❌")
    } finally {
      setLoading(false)
    }
  }

  /** ✅ 게시글 상세 조회 */
  const fetchBoardDetail = async (id) => {
    try {
        const res = await axios.get(`http://localhost:8080/boards/${id}`)
        setSelectedBoard(res.data.data)
    } catch (err) {
        console.error(err)
        alert("게시글 불러오기 실패 ❌")
    }
}

  /** ✅ 게시글 생성 */
  const handleCreateBoard = async () => {
    if (!newBoard.title.trim() || !newBoard.content.trim())
      return alert("제목과 내용을 입력하세요.")
    try {
      await boardAPI.create(newBoard)
      alert("게시글 생성 성공 ✅")
      setNewBoard({ title: "", content: "", nickname: "", password: "" })
      fetchBoards()
    } catch (err) {
      console.error(err)
      alert("게시글 생성 실패 ❌")
    }
  }

  /** ✅ 댓글 작성 */
  const handleAddComment = async () => {
    if (!selectedBoard) return alert("게시글을 먼저 선택하세요.")
    if (!newComment.content.trim() || !newComment.password.trim())
      return alert("내용과 비밀번호를 입력하세요.")
    try {
      await boardAPI.addComment(selectedBoard.id, newComment)
      alert("댓글 작성 성공 ✅")
      setNewComment({ nickname: "", content: "", password: "" })
      fetchBoardDetail(selectedBoard.id)
    } catch (err) {
      console.error(err)
      alert("댓글 작성 실패 ❌")
    }
  }

  /** ✅ 댓글 수정 */
  const handleEditComment = async (commentId: number) => {
    const nickname = prompt("새 닉네임을 입력하세요") ?? ""
    const content = prompt("새 내용을 입력하세요") ?? ""
    if (!nickname || !content) return
    try {
      await boardAPI.updateComment(selectedBoard!.id, commentId, { nickname, content })
      alert("댓글 수정 완료 ✅")
      fetchBoardDetail(selectedBoard!.id)
    } catch (err) {
      console.error(err)
      alert("댓글 수정 실패 ❌")
    }
  }

  /** ✅ 댓글 삭제 */
  const handleDeleteComment = async (commentId: number) => {
    const pw = prompt("댓글 비밀번호를 입력하세요") ?? ""
    if (!pw) return
    try {
      await boardAPI.deleteComment(selectedBoard!.id, commentId, pw)
      alert("댓글 삭제 성공 ✅")
      fetchBoardDetail(selectedBoard!.id)
    } catch (err) {
      console.error(err)
      alert("댓글 삭제 실패 ❌")
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">🧪 Board API 연동 테스트 (H2 DB)</h1>

      {/* ✅ 게시글 작성 폼 */}
      <section className="p-4 mb-6 border rounded bg-gray-50">
        <h2 className="mb-2 font-semibold">게시글 작성</h2>
        <input
          placeholder="제목"
          value={newBoard.title}
          onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          placeholder="내용"
          value={newBoard.content}
          onChange={(e) => setNewBoard({ ...newBoard, content: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          placeholder="닉네임"
          value={newBoard.nickname}
          onChange={(e) => setNewBoard({ ...newBoard, nickname: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 (4자리)"
          value={newBoard.password}
          onChange={(e) => setNewBoard({ ...newBoard, password: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreateBoard}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          게시글 생성
        </button>
      </section>

      {/* ✅ 게시글 목록 */}
      <section className="p-4 mb-6 bg-white border rounded">
        <h2 className="mb-2 font-semibold">게시글 목록</h2>
        {loading ? (
          <p>불러오는 중...</p>
        ) : boards.length === 0 ? (
          <p className="text-gray-500">게시글이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {boards.map((b) => (
              <li
                key={b.id}
                onClick={() => fetchBoardDetail(b.id)}
                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${
                  selectedBoard?.id === b.id ? "bg-blue-50 border-blue-300" : ""
                }`}
              >
                <strong>{b.title}</strong> — {b.nickname}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ✅ 게시글 상세 + 댓글 */}
      {selectedBoard && (
        <section className="p-4 border rounded bg-gray-50">
          <h2 className="mb-2 font-semibold">게시글 상세</h2>
          <p className="text-lg font-bold">{selectedBoard.title}</p>
          <p className="mb-2 whitespace-pre-wrap">{selectedBoard.content}</p>
          <p className="mb-4 text-sm text-gray-600">
            작성자: {selectedBoard.nickname} /{" "}
            {new Date(selectedBoard.createdAt!).toLocaleString()}
          </p>

          <h3 className="mb-2 font-semibold">댓글</h3>
          {selectedBoard.comments && selectedBoard.comments.length > 0 ? (
            selectedBoard.comments.map((c) => (
              <div key={c.id} className="py-2 border-b">
                <p className="text-sm text-gray-700">{c.nickname}</p>
                <p>{c.content}</p>
                <div className="flex gap-2 mt-1 text-sm">
                  <button
                    onClick={() => handleEditComment(c.id)}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-red-500 hover:underline"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">댓글이 없습니다.</p>
          )}

          {/* ✅ 댓글 작성 */}
          <div className="mt-3">
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
              type="password"
              placeholder="비밀번호"
              value={newComment.password}
              onChange={(e) => setNewComment({ ...newComment, password: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              댓글 작성
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
export default TestBoardPage