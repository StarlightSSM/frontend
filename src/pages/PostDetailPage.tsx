/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { posts, comments } from "@/data/posts.js"
import { Post, Comment } from "@/types/types.js"

// ✅ 유효성 검사 함수
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

  // 게시글 수정 상태
  const [editingPost, setEditingPost] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [nickname, setNickname] = useState(post.nickname)

  // 댓글 작성 상태
  const [newCommentContent, setNewCommentContent] = useState("")
  const [newCommentNickname, setNewCommentNickname] = useState("")
  const [newCommentPassword, setNewCommentPassword] = useState("")

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editNickname, setEditNickname] = useState("")

  /* ---------- 공용 비밀번호 확인 함수 ---------- */
  const handleCheckPassword = (correctPw: string): boolean => {
    const pw = prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw)) {
      alert("비밀번호는 4자리 숫자만 가능합니다.")
      return false
    }
    if (pw !== correctPw) {
      alert("비밀번호가 일치하지 않습니다.")
      return false
    }
    return true
  }

  /* ---------- 게시글 수정 ---------- */
  const handleEditPost = () => {
    if (!handleCheckPassword(post.password)) return
    setEditingPost(true)
  }

  const handleSavePost = () => {
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
    const content = newCommentContent.trim()
    const nickname = newCommentNickname.trim()
    const password = newCommentPassword.trim()

    if (!isValidContent(content)) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
    if (!isValidPassword(password)) return alert("비밀번호는 4자리 숫자만 가능합니다.")

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
    if (!isValidPassword(pw) || pw !== c.password) return alert("비밀번호가 일치하지 않습니다.")
    setEditingCommentId(c.id)
    setEditContent(c.content)
    setEditNickname(c.nickname)
  }

  const handleSaveEditComment = (id: number) => {
    const content = editContent.trim()
    const nickname = editNickname.trim()

    if (!isValidContent(content)) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return

    comments[idx] = { ...comments[idx], content, nickname, updatedAt: new Date().toISOString() }
    setPostComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content, nickname, updatedAt: new Date().toISOString() } : c
      )
    )
    setEditingCommentId(null)
    setEditContent("")
    setEditNickname("")
  }

  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditContent("")
    setEditNickname("")
  }

  return (
    <div className="max-w-3xl p-4 mx-auto">
      {/* ---------- 게시글 ---------- */}
      {editingPost ? (
        <div className="p-4 mb-4 border rounded">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
            placeholder="제목 (1~20자)"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-2 mb-2 border rounded"
            placeholder="내용 (1~3000자)"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            placeholder="닉네임 (1~10자)"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSavePost}
              className="px-3 py-1 text-white bg-green-500 rounded"
            >
              저장
            </button>
            <button
              onClick={() => setEditingPost(false)}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="mb-2 text-2xl font-bold">{post.title}</h2>
          <p className="mb-2 whitespace-pre-wrap">{post.content}</p>
          <p className="mb-4 text-sm text-gray-500">
            작성자: {post.nickname} / 작성일:{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="flex mb-6 space-x-2">
            <button
              onClick={handleEditPost}
              className="px-3 py-1 text-white bg-blue-500 rounded"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-3 py-1 text-white bg-red-500 rounded"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* ---------- 댓글 ---------- */}
      <div className="pt-4 border-t">
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
                      className="w-full p-1 mb-2 border rounded"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-1 mb-2 border rounded"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSaveEditComment(c.id)}
                        className="px-2 py-1 text-white bg-green-500 rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEditComment}
                        className="px-2 py-1 bg-gray-300 rounded"
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
                      <div>{c.content}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <button
                        onClick={() => handleStartEditComment(c)}
                        className="text-sm text-blue-500"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-sm text-red-500"
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
        <div className="p-3 mt-4 border rounded">
          <input
            value={newCommentNickname}
            onChange={(e) => setNewCommentNickname(e.target.value)}
            placeholder="닉네임 (1~10자, 특수문자 제외)"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="댓글 내용 (1~200자)"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="password"
            value={newCommentPassword}
            onChange={(e) => setNewCommentPassword(e.target.value)}
            placeholder="비밀번호 (4자리 숫자)"
            className="w-full p-2 mb-2 border rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddComment}
              className="px-3 py-1 text-white bg-blue-500 rounded"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
