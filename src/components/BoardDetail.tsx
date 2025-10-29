/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"
import { Board, Comment } from "@/types/types.js"
import { boards, comments } from "@/data/boards.js"
import { useNavigate } from "react-router-dom"

/* --- Validation helpers --- */
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string, max = 3000) => s.trim().length > 0 && s.trim().length <= max
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

interface Props {
  boardId: number
}

export const BoardDetail: React.FC<Props> = ({ boardId }) => {
  const navigate = useNavigate()
  const boardIndex = boards.findIndex((b) => b.id === boardId && !b.deleted)
  if (boardIndex === -1) return <p>게시물을 찾을 수 없습니다.</p>

  const [board, setBoard] = useState<Board>(boards[boardIndex])
  const [boardComments, setBoardComments] = useState<Comment[]>(
    comments.filter((c) => c.boardId === boardId && !c.deleted)
  )

  // 게시글 수정 상태
  const [editingBoard, setEditingBoard] = useState(false)
  const [title, setTitle] = useState(board.title)
  const [content, setContent] = useState(board.content)
  const [nickname, setNickname] = useState(board.nickname)
  const [isBoardSubmitting, setIsBoardSubmitting] = useState(false)

  // 댓글 상태
  const [newCommentContent, setNewCommentContent] = useState("")
  const [newCommentNickname, setNewCommentNickname] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")
  const [editingCommentNickname, setEditingCommentNickname] = useState("")
  const [isEditingCommentSubmitting, setIsEditingCommentSubmitting] = useState(false)

  /* ---------- 게시글 수정 ---------- */
  const handleStartEditBoard = () => {
    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== board.password)
      return alert("비밀번호가 일치하지 않습니다.")
    setEditingBoard(true)
  }

  const handleSaveBoard = () => {
    if (isBoardSubmitting) return
    setIsBoardSubmitting(true)

    if (!isValidTitle(title)) {
      alert("제목은 1~20자 이내로 입력해주세요.")
      return setIsBoardSubmitting(false)
    }
    if (!isValidContent(content, 3000)) {
      alert("내용은 1~3000자 이내로 입력해주세요.")
      return setIsBoardSubmitting(false)
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return setIsBoardSubmitting(false)
    }

    // 0.8초 지연 후 저장
    setTimeout(() => {
      const updated: Board = {
        ...board,
        title: title.trim(),
        content: content.trim(),
        nickname: nickname.trim(),
        updatedAt: new Date().toISOString(),
      }

      boards[boardIndex] = updated
      setBoard(updated)
      setEditingBoard(false)
      alert("게시글이 수정되었습니다.")
      setTimeout(() => setIsBoardSubmitting(false), 700)
    }, 800)
  }

  /* ---------- 게시글 삭제 ---------- */
  const handleDeleteBoard = () => {
    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== board.password)
      return alert("비밀번호가 일치하지 않습니다.")
    boards[boardIndex] = { ...boards[boardIndex], deleted: true, updatedAt: new Date().toISOString() }
    alert("게시글이 삭제되었습니다.")
    navigate("/")
  }

  /* ---------- 댓글 추가 ---------- */
  const handleAddComment = () => {
    const content = newCommentContent.trim()
    const nick = newCommentNickname.trim()
    if (!isValidContent(content, 200)) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidNickname(nick)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    const pw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(pw)) return alert("비밀번호는 4자리 숫자만 가능합니다.")

    const comment: Comment = {
      id: Date.now(),
      boardId,
      content,
      nickname: nick,
      password: pw,
      createdAt: new Date().toISOString(),
    }

    comments.push(comment)
    setBoardComments((prev) => [...prev, comment])
    setNewCommentContent("")
    setNewCommentNickname("")
  }

  /* ---------- 댓글 삭제 ---------- */
  const handleDeleteComment = (id: number) => {
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return

    const inputPw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== comments[idx].password)
      return alert("비밀번호가 일치하지 않습니다.")

    comments[idx] = { ...comments[idx], deleted: true, updatedAt: new Date().toISOString() }
    setBoardComments((prev) => prev.filter((c) => c.id !== id))
  }

  /* ---------- 댓글 수정 ---------- */
  const handleStartEditComment = (c: Comment) => {
    const inputPw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== c.password)
      return alert("비밀번호가 일치하지 않습니다.")
    setEditingCommentId(c.id)
    setEditingCommentContent(c.content)
    setEditingCommentNickname(c.nickname)
  }

  const handleSaveEditComment = (id: number) => {
    if (isEditingCommentSubmitting) return
    setIsEditingCommentSubmitting(true)

    const content = editingCommentContent.trim()
    const nick = editingCommentNickname.trim()

    if (!isValidContent(content, 200)) {
      alert("댓글 내용은 1~200자 이내로 입력해주세요.")
      return setIsEditingCommentSubmitting(false)
    }
    if (!isValidNickname(nick)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return setIsEditingCommentSubmitting(false)
    }

    setTimeout(() => {
      const idx = comments.findIndex((c) => c.id === id)
      if (idx === -1) return

      comments[idx] = { ...comments[idx], content, nickname: nick, updatedAt: new Date().toISOString() }
      setBoardComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content, nickname: nick, updatedAt: new Date().toISOString() } : c))
      )

      setEditingCommentId(null)
      setEditingCommentContent("")
      setEditingCommentNickname("")
      setTimeout(() => setIsEditingCommentSubmitting(false), 700)
    }, 800)
  }

  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditingCommentContent("")
    setEditingCommentNickname("")
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* ---------- 게시글 ---------- */}
      {editingBoard ? (
        <div className="p-2 mb-4 border rounded bg-gray-50">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요 (1~20자)"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요 (1~3000자)"
            className="w-full h-32 p-2 mb-2 border rounded"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요 (1~10자)"
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSaveBoard}
              disabled={isBoardSubmitting}
              className={`px-3 py-1 text-white rounded ${
                isBoardSubmitting ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isBoardSubmitting ? "처리 중..." : "저장"}
            </button>
            <button onClick={() => setEditingBoard(false)} className="px-3 py-1 bg-gray-300 rounded">
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-xl font-bold break-words">{board.title}</h2>
          <p className="mb-2 whitespace-pre-wrap break-words">{board.content}</p>
          <p className="text-sm text-gray-500 mb-4">
            작성자: {board.nickname} • 작성일: {new Date(board.createdAt).toLocaleString()}
          </p>
          <div className="flex gap-2">
            <button onClick={handleStartEditBoard} className="px-2 py-1 bg-blue-500 text-white rounded">
              수정
            </button>
            <button onClick={handleDeleteBoard} className="px-2 py-1 bg-red-500 text-white rounded">
              삭제
            </button>
          </div>
        </>
      )}

      {/* ---------- 댓글 ---------- */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">댓글</h3>
        {boardComments.length === 0 ? (
          <p className="text-gray-500">댓글이 없습니다.</p>
        ) : (
          boardComments.map((c) => (
            <div key={c.id} className="p-2 mb-2 border-b">
              {editingCommentId === c.id ? (
                <>
                  <input
                    value={editingCommentNickname}
                    onChange={(e) => setEditingCommentNickname(e.target.value)}
                    placeholder="닉네임 (1~10자)"
                    title="닉네임 입력"
                    className="w-full p-1 mb-1 border rounded"
                  />
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    placeholder="댓글 내용 (1~200자)"
                    title="댓글 내용 입력"
                    className="w-full p-1 mb-1 border rounded"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSaveEditComment(c.id)}
                      disabled={isEditingCommentSubmitting}
                      className={`px-2 py-1 text-white rounded ${
                        isEditingCommentSubmitting ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {isEditingCommentSubmitting ? "처리 중..." : "저장"}
                    </button>
                    <button onClick={handleCancelEditComment} className="px-2 py-1 bg-gray-300 rounded">
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-600">
                    {c.nickname} • {new Date(c.createdAt).toLocaleString()}
                  </div>
                  <p className="mt-1">{c.content}</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleStartEditComment(c)} className="text-blue-500 text-sm">
                      수정
                    </button>
                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-500 text-sm">
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}

        {/* 댓글 작성 */}
        <div className="p-3 border rounded mt-4 bg-gray-50">
          <input
            placeholder="닉네임(1~10자)"
            value={newCommentNickname}
            onChange={(e) => setNewCommentNickname(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
          />
          <textarea
            placeholder="댓글 내용을 입력하세요 (1~200자)"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
          />
          <button onClick={handleAddComment} className="px-3 py-1 bg-blue-500 text-white rounded">
            작성
          </button>
        </div>
      </div>
    </div>
  )
}
