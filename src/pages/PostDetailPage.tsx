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

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editNickname, setEditNickname] = useState("")

  /* ---------- 게시글 수정 ---------- */
  const handleSavePost = () => {
    const pw = prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw) || pw !== post.password) return alert("비밀번호가 일치하지 않습니다.")

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
    const pw = prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw) || pw !== post.password) return alert("비밀번호가 일치하지 않습니다.")

    posts[postIndex] = { ...post, deleted: true, updatedAt: new Date().toISOString() }
    alert("게시글이 삭제되었습니다.")
    navigate("/")
  }

  /* ---------- 댓글 추가 ---------- */
  const handleAddComment = () => {
    const content = newCommentContent.trim()
    const nickname = newCommentNickname.trim()

    if (!isValidContent(content)) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    const password = prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
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

  /* ---------- 댓글 수정 취소 ---------- */
  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditContent("")
    setEditNickname("")
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* ---------- 게시글 ---------- */}
      {editingPost ? (
        <div className="border p-4 mb-4 rounded">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
            placeholder="제목 (1~20자)"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 w-full mb-2 rounded h-40"
            placeholder="내용 (1~3000자)"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="border p-2 w-full mb-4 rounded"
            placeholder="닉네임 (1~10자)"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSavePost}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              저장
            </button>
            <button
              onClick={() => setEditingPost(false)}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="whitespace-pre-wrap mb-2">{post.content}</p>
          <p className="text-sm text-gray-500 mb-4">
            작성자: {post.nickname} / 작성일:{" "}
            {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setEditingPost(true)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* ---------- 댓글 ---------- */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">댓글</h3>
        {postComments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="border-b py-2">
                {editingCommentId === c.id ? (
                  <div>
                    <input
                      value={editNickname}
                      onChange={(e) => setEditNickname(e.target.value)}
                      className="border p-1 w-full mb-2 rounded"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="border p-1 w-full mb-2 rounded"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSaveEditComment(c.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleCancelEditComment}
                        className="bg-gray-300 px-2 py-1 rounded"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-600">
                        {c.nickname} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div>{c.content}</div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <button
                        onClick={() => handleStartEditComment(c)}
                        className="text-blue-500 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-500 text-sm"
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

        {/* 댓글 작성 */}
        <div className="mt-4 border p-3 rounded">
          <input
            value={newCommentNickname}
            onChange={(e) => setNewCommentNickname(e.target.value)}
            placeholder="닉네임 (1~10자, 특수문자 제외)"
            className="border p-2 w-full mb-2 rounded"
          />
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="댓글 내용 (1~200자)"
            className="border p-2 w-full mb-2 rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
