/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { posts, comments } from "@/data/posts.js"
import { Post, Comment } from "@/types/types.js"

// 유효성 검사 함수
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 200

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = Number(id)

  const postIndex = posts.findIndex((p) => p.id === postId && !p.deleted)
  if (postIndex === -1) return <p className="p-4">게시글을 찾을 수 없습니다.</p>

  const [post, setPost] = useState<Post>(posts[postIndex])
  const [postComments, setPostComments] = useState<Comment[]>(
    comments.filter((c) => c.postId === postId && !c.deleted)
  )

  const [editingPost, setEditingPost] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [nickname, setNickname] = useState(post.nickname)

  const [newCommentContent, setNewCommentContent] = useState("")
  const [newCommentNickname, setNewCommentNickname] = useState("")
  const [newCommentPassword, setNewCommentPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editNickname, setEditNickname] = useState("")

  /* ---------- 공용 비밀번호 확인 함수 ---------- */
  const handleCheckPassword = (correctPw: string): boolean => {
    const pw = prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw)) return alert("비밀번호는 4자리 숫자만 가능합니다."), false
    if (pw !== correctPw) return alert("비밀번호가 일치하지 않습니다."), false
    return true
  }

  /* ---------- 게시글 수정 ---------- */
  const handleEditPost = () => {
    if (!handleCheckPassword(post.password)) return
    setEditingPost(true)
  }

  const handleSavePost = () => {
    if (isSubmitting) return // 중복 클릭 방지
    setIsSubmitting(true)

    // 일정시간 후 게시글 수정 처리 (중복 제출 방지)
    setTimeout(() => {
      const updated = {
        ...post,
        title: title.trim(),
        content: content.trim(),
        nickname: nickname.trim(),
        updatedAt: new Date().toISOString(),
      }

      posts[postIndex] = updated
      setPost(updated)
      setEditingPost(false)
      alert("게시글이 수정되었습니다.")

      // 일정시간 후 버튼 다시 활성화
      setTimeout(() => setIsSubmitting(false), 700)
    }, 800)
  }

  /* ---------- 게시글 삭제 ---------- */
  const handleDeletePost = () => {
    if (!handleCheckPassword(post.password)) return
    posts[postIndex] = { ...post, deleted: true, updatedAt: new Date().toISOString() }
    alert("게시글이 삭제되었습니다.")
    navigate("/")
  }

  /* ---------- 댓글 추가 ---------- */
  const handleAddComment = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const content = newCommentContent.trim()
    const nickname = newCommentNickname.trim()
    const password = newCommentPassword.trim()

    if (!isValidContent(content)) {
      alert("댓글 내용은 1~200자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidPassword(password)) {
      alert("비밀번호는 4자리 숫자만 가능합니다.")
      return setIsSubmitting(false)
    }

    // 일정시간 후 댓글 반영 (중복 제출 방지)
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now(),
        postId,
        content,
        nickname,
        password,
        createdAt: new Date().toISOString(),
      }

      comments.push(comment)
      setPostComments((prev) => [...prev, comment])
      setNewCommentContent("")
      setNewCommentNickname("")
      setNewCommentPassword("")

      // 일정시간 후 버튼 다시 활성화
      setTimeout(() => setIsSubmitting(false), 700)
    }, 800)
  }

  /* ---------- 댓글 삭제 ---------- */
  const handleDeleteComment = (id: number) => {
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return
    const pw = prompt("댓글 비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw) || pw !== comments[idx].password)
      return alert("비밀번호가 일치하지 않습니다.")

    comments[idx] = { ...comments[idx], deleted: true }
    setPostComments((prev) => prev.filter((c) => c.id !== id))
  }

  /* ---------- 댓글 수정 ---------- */
  const handleStartEditComment = (c: Comment) => {
    const pw = prompt("댓글 비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw) || pw !== c.password)
      return alert("비밀번호가 일치하지 않습니다.")
    setEditingCommentId(c.id)
    setEditContent(c.content)
    setEditNickname(c.nickname)
  }

  const handleSaveEditComment = (id: number) => {
    if (isSubmitting) return // 중복 클릭 방지
    setIsSubmitting(true)

    const content = editContent.trim()
    const nickname = editNickname.trim()

    if (!isValidContent(content)) {
      alert("댓글 내용은 1~200자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return setIsSubmitting(false)
    }

    // 일정시간 후 수정 반영(중복 제출 방지)
    setTimeout(() => {
      const idx = comments.findIndex((c) => c.id === id)
      if (idx === -1) return

      comments[idx] = {
        ...comments[idx],
        content,
        nickname,
        updatedAt: new Date().toISOString(),
      }

      setPostComments((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, content, nickname, updatedAt: new Date().toISOString() }
            : c
        )
      )

      setEditingCommentId(null)
      setEditContent("")
      setEditNickname("")

      // 일정시간 후 버튼 다시 활성화
      setTimeout(() => setIsSubmitting(false), 700)
    }, 800)
  }


  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditContent("")
    setEditNickname("")
  }

  return (
    <div className="w-full max-w-3xl p-4 mx-auto sm:p-6 md:p-8">
      {/* ---------- 게시글 ---------- */}
      {editingPost ? (
        <div className="p-4 mb-4 bg-white border rounded shadow-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="제목 (1~20자)"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-2 mb-2 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="내용 (1~3000자)"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 mb-4 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="닉네임 (1~10자)"
          />
          <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <button
              onClick={handleSavePost}
              disabled={isSubmitting}
              className={`bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition ${
                isSubmitting
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isSubmitting ? "수정 중..." : "게시글 수정"}
            </button>
            <button
              onClick={() => setEditingPost(false)}
              className="px-3 py-1 transition bg-gray-300 rounded hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-2xl font-bold break-words">{post.title}</h2>
          <p className="mb-2 break-words whitespace-pre-wrap">{post.content}</p>
          <p className="mb-4 text-sm text-gray-500">
            작성자: {post.nickname} / 작성일: {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="flex flex-col mb-6 space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <button
              onClick={handleEditPost}
              className="px-3 py-1 text-white transition bg-blue-500 rounded hover:bg-blue-600"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-3 py-1 text-white transition bg-red-500 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* ---------- 댓글 ---------- */}
      <div className="pt-4 mt-4 border-t">
        <h3 className="mb-2 text-lg font-semibold">댓글</h3>
        {postComments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="py-2 border-b">
                {editingCommentId === c.id ? (
                  <div>
                    <input
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      placeholder="닉네임 (1~10자)"
                      aria-label="닉네임 입력"
                      className="w-full p-2 mb-2 transition border rounded focus:ring-2 focus:ring-blue-300"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="댓글 내용 (1~200자)"
                      aria-label="댓글 내용 입력"
                      className="w-full p-1 mb-2 transition border rounded focus:ring-2 focus:ring-blue-300"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSaveEditComment(c.id)}
                        disabled={isSubmitting}
                        className={`bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition ${
                          isSubmitting
                            ? "bg-green-300 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {isSubmitting ? "수정 중..." : "댓글 수정"}
                      </button>
                      <button
                        onClick={handleCancelEditComment}
                        className="px-2 py-1 transition bg-gray-300 rounded hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-600">
                        {c.nickname} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div className="break-words">{c.content}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <button
                        onClick={() => handleStartEditComment(c)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ---------- 댓글 작성 ---------- */}
        <div className="p-3 mt-4 border rounded shadow-sm bg-gray-50">
          <input
            value={newCommentNickname}
            onChange={(e) => setNewCommentNickname(e.target.value)}
            placeholder="닉네임 (1~10자)"
            className="w-full p-2 mb-2 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="댓글 내용 (1~200자)"
            className="w-full p-2 mb-2 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            value={newCommentPassword}
            onChange={(e) => setNewCommentPassword(e.target.value)}
            placeholder="비밀번호 (4자리 숫자)"
            className="w-full p-2 mb-2 transition border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddComment}
              disabled={isSubmitting}
              className={`text-white px-4 py-2 rounded transition ${
                isSubmitting
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
