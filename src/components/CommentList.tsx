import React, { useState } from "react"
import axios from "axios"
import { Comment } from "../types/types.js"

interface Props {
  boardId: number
  comments: Comment[]
  onRefresh: () => void // 부모 컴포넌트에서 fetchBoard() 호출
}

export const CommentList: React.FC<Props> = ({ boardId, comments, onRefresh }) => {
  // 📝 작성용
  const [newComment, setNewComment] = useState({
    nickname: "",
    content: "",
    password: "",
  })

  // ✏️ 수정/삭제용
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editNickname, setEditNickname] = useState("")

  // 🔐 비밀번호 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [targetCommentId, setTargetCommentId] = useState<number | null>(null)
  const [actionType, setActionType] = useState<"edit" | "delete" | null>(null)

  /* ------------------------ 댓글 작성 ------------------------ */
  const handleAddComment = async () => {
    const { nickname, content, password } = newComment

    if (!nickname.trim() || !/^[A-Za-z0-9가-힣]{1,10}$/.test(nickname))
      return alert("닉네임은 1~10자 영문/숫자/한글만 가능합니다.")
    if (!content.trim() || content.length > 200)
      return alert("댓글은 1~200자 이내여야 합니다.")
    if (!/^[0-9]{4}$/.test(password)) return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      await axios.post(`http://localhost:8080/boards/${boardId}/comments`, {
        nickname,
        content,
        password,
      })
      alert("댓글이 등록되었습니다 ✅")
      setNewComment({ nickname: "", content: "", password: "" })
      onRefresh()
    } catch (err) {
      console.error(err)
      alert("댓글 등록 실패 ❌")
    }
  }

  /* ------------------------ 수정 시작 ------------------------ */
  const handleStartEdit = (c: Comment) => {
    setEditingId(c.id)
    setEditContent(c.content)
    setEditNickname(c.nickname)
  }

  /* ------------------------ 수정 저장 ------------------------ */
  const handleSaveClick = (id: number) => {
    if (!editContent.trim() || editContent.length > 200)
      return alert("댓글은 1~200자여야 합니다.")
    if (!/^[A-Za-z0-9가-힣]{1,10}$/.test(editNickname.trim()))
      return alert("닉네임은 1~10자 영문/숫자/한글만 가능합니다.")
    openPasswordModal(id, "edit")
  }

  /* ------------------------ 삭제 ------------------------ */
  const handleDeleteClick = (id: number) => openPasswordModal(id, "delete")

  /* ------------------------ 모달 관련 ------------------------ */
  const openPasswordModal = (id: number, type: "edit" | "delete") => {
    setTargetCommentId(id)
    setActionType(type)
    setPassword("")
    setShowPasswordModal(true)
  }

  const closePasswordModal = () => {
    setShowPasswordModal(false)
    setTargetCommentId(null)
    setActionType(null)
  }

  const handleConfirmPassword = async () => {
    if (!targetCommentId || !/^[0-9]{4}$/.test(password))
      return alert("비밀번호는 4자리 숫자여야 합니다.")

    try {
      if (actionType === "delete") {
        await axios.delete(
          `http://localhost:8080/boards/comments/${targetCommentId}`,
          { params: { password } }
        )
        alert("댓글이 삭제되었습니다 🗑️")
      } else if (actionType === "edit") {
        console.log(typeof targetCommentId)
        console.log(targetCommentId)
        await axios.put(
          `http://localhost:8080/boards/comments/${targetCommentId}`,
          { content: editContent.trim(), nickname: editNickname.trim(), password }
        )
        alert("댓글이 수정되었습니다 ✏️")
        setEditingId(null)
        setEditContent("")
        setEditNickname("")
      }
      onRefresh()
    } catch (err) {
      console.error(err)
      alert("비밀번호가 일치하지 않거나 요청 실패 ❌")
    } finally {
      closePasswordModal()
    }
  }

  /* ------------------------ 렌더링 ------------------------ */
  return (
    <div className="space-y-4">
      {/* ✅ 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-gray-500">댓글이 없습니다.</div>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="p-3 bg-white border rounded shadow-sm">
            {editingId === c.id ? (
              <>
                <div className="flex flex-col gap-2 mb-2 sm:flex-row">
                  <input
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    maxLength={10}
                    placeholder="닉네임 (1~10자)"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-300"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={200}
                    placeholder="댓글 내용 (1~200자)"
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleSaveClick(c.id)}
                    className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{c.nickname}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(c)}
                      className="px-2 py-1 text-sm border rounded hover:bg-blue-50"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteClick(c.id)}
                      className="px-2 py-1 text-sm border rounded hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-gray-800 whitespace-pre-wrap">{c.content}</div>
              </>
            )}
          </div>
        ))
      )}

      {/* ✅ 댓글 작성 영역 */}
      <div className="p-4 border rounded shadow-sm bg-gray-50">
        <h3 className="mb-2 font-semibold">댓글 작성</h3>
        <input
          value={newComment.nickname}
          onChange={(e) => setNewComment({ ...newComment, nickname: e.target.value })}
          placeholder="닉네임 (1~10자)"
          maxLength={10}
          className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <textarea
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          placeholder="댓글 내용 (1~200자)"
          maxLength={200}
          className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <input
          type="password"
          value={newComment.password}
          onChange={(e) => setNewComment({ ...newComment, password: e.target.value })}
          placeholder="비밀번호 (4자리 숫자)"
          maxLength={4}
          className="w-full p-2 mb-3 border rounded focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          댓글 등록
        </button>
      </div>

      {/* 🔐 비밀번호 입력 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-6 text-center bg-white rounded shadow-lg w-80">
            <h3 className="mb-3 font-semibold">비밀번호 확인</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={4}
              placeholder="비밀번호 (4자리)"
              className="w-full p-2 mb-3 text-center border rounded"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={handleConfirmPassword}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                확인
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
    </div>
  )
}
