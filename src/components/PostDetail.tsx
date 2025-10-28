/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react"
import { Post, Comment } from "@/types/types.js"
import { posts, comments } from "@/data/posts.js"
import { useNavigate } from "react-router-dom"

/* --- Validation helpers --- */
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string, max = 3000) => s.trim().length > 0 && s.trim().length <= max
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

interface Props {
  postId: number
}

export const PostDetail: React.FC<Props> = ({ postId }) => {
  const navigate = useNavigate()
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex === -1) return <p>게시물을 찾을 수 없습니다.</p>

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [post, setPost] = useState<Post>(posts[postIndex])
  const [postComments, setPostComments] = useState<Comment[]>(
    comments.filter((c) => c.postId === postId && !c.deleted)
  )

  // 게시글 편집 상태
  const [editingPost, setEditingPost] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [nickname, setNickname] = useState(post.nickname)

  // 댓글 상태
  const [newCommentContent, setNewCommentContent] = useState("")
  const [newCommentNickname, setNewCommentNickname] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState("")
  const [editingCommentNickname, setEditingCommentNickname] = useState("")

  /* ---------- 게시글 수정 저장 (비밀번호 확인 포함) ---------- */
  const handleSavePost = () => {
    // validation
    if (!isValidTitle(title)) {
      alert("제목은 1~20자 이내로 입력해주세요.")
      return
    }
    if (!isValidContent(content, 3000)) {
      alert("내용은 1~3000자 이내로 입력해주세요.")
      return
    }
    if (!isValidNickname(nickname)) {
      alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return
    }

    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== post.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    const updated: Post = {
      ...post,
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      updatedAt: new Date().toISOString(),
    }
    setPost(updated)
    posts[postIndex] = updated
    setEditingPost(false)
  }

  /* ---------- 게시글 삭제 (soft delete) ---------- */
  const handleDeletePost = () => {
    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== post.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    // soft delete
    posts[postIndex] = { ...posts[postIndex], deleted: true, updatedAt: new Date().toISOString() }
    // navigate to main
    navigate("/")
  }

  /* ---------- 댓글 생성 ---------- */
  const handleAddComment = () => {
    const content = newCommentContent.trim()
    const nick = newCommentNickname.trim()
    if (!isValidContent(content, 200)) {
      alert("댓글 내용은 1~200자 이내로 입력해주세요.")
      return
    }
    if (!isValidNickname(nick)) {
      alert("댓글 닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return
    }
    // password input
    const pw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(pw)) {
      alert("비밀번호는 4자리 숫자만 가능합니다.")
      return
    }

    const comment: Comment = {
      id: Date.now(),
      postId: postId,
      content,
      nickname: nick,
      password: pw,
      createdAt: new Date().toISOString(),
    }

    comments.push(comment) // global store
    setPostComments((prev) => [...prev, comment])
    setNewCommentContent("")
    setNewCommentNickname("")
  }

  /* ---------- 댓글 삭제 (soft) ---------- */
  const handleDeleteComment = (id: number) => {
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return
    const inputPw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== comments[idx].password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    comments[idx] = { ...comments[idx], deleted: true, updatedAt: new Date().toISOString() }
    setPostComments((prev) => prev.filter((c) => c.id !== id))
  }

  /* ---------- 댓글 수정 시작 ---------- */
  const handleStartEditComment = (c: Comment) => {
    const inputPw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== c.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    setEditingCommentId(c.id)
    setEditingCommentContent(c.content)
    setEditingCommentNickname(c.nickname)
  }

  /* ---------- 댓글 수정 저장 ---------- */
  const handleSaveEditComment = (id: number) => {
    const content = editingCommentContent.trim()
    const nick = editingCommentNickname.trim()
    if (!isValidContent(content, 200)) {
      alert("댓글 내용은 1~200자 이내로 입력해주세요.")
      return
    }
    if (!isValidNickname(nick)) {
      alert("댓글 닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")
      return
    }
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return
    comments[idx] = { ...comments[idx], content, nickname: nick, updatedAt: new Date().toISOString() }
    setPostComments((prev) => prev.map((c) => (c.id === id ? { ...c, content, nickname: nick, updatedAt: new Date().toISOString() } : c)))
    setEditingCommentId(null)
    setEditingCommentContent("")
    setEditingCommentNickname("")
  }

  /* ---------- 댓글 수정 취소 ---------- */
  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditingCommentContent("")
    setEditingCommentNickname("")
  }

  return (
    <div className="p-4">
      {/* 게시글 영역 */}
      {editingPost ? (
        <div className="mb-4 border p-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-1 w-full mb-2" />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border p-1 w-full mb-2" />
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="border p-1 w-full mb-2" />
          <div>
            <button onClick={handleSavePost} className="bg-green-500 text-white px-3 py-1 mr-2">저장</button>
            <button onClick={() => setEditingPost(false)} className="bg-gray-300 px-3 py-1">취소</button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-bold text-xl mb-2">{post.title}</h2>
          <p className="mb-2 whitespace-pre-wrap">{post.content}</p>
          <p className="text-sm text-gray-500 mb-3">작성자: {post.nickname} / 작성일: {new Date(post.createdAt).toLocaleString()}</p>
          <div className="mb-4">
            <button onClick={() => setEditingPost(true)} className="bg-blue-500 text-white px-2 py-1 mr-2">수정</button>
            <button onClick={handleDeletePost} className="bg-red-500 text-white px-2 py-1">삭제</button>
          </div>
        </>
      )}

      {/* 댓글 영역 */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">댓글</h3>

        {postComments.length === 0 ? (
          <p className="mb-2">댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="ml-2 flex justify-between items-start mb-2">
                <div className="flex-1">
                  {editingCommentId === c.id ? (
                    <div>
                      <input value={editingCommentNickname} onChange={(e) => setEditingCommentNickname(e.target.value)} className="border p-1 w-full mb-1"/>
                      <input value={editingCommentContent} onChange={(e) => setEditingCommentContent(e.target.value)} className="border p-1 w-full mb-1"/>
                      <div>
                        <button onClick={() => handleSaveEditComment(c.id)} className="bg-green-500 text-white px-2 py-1 mr-2">저장</button>
                        <button onClick={handleCancelEditComment} className="bg-gray-300 px-2 py-1">취소</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-600">{c.nickname} • {new Date(c.createdAt).toLocaleString()}</div>
                      <div className="mt-1">{c.content}</div>
                    </div>
                  )}
                </div>

                {editingCommentId !== c.id && (
                  <div className="ml-4 flex flex-col gap-1">
                    <button onClick={() => handleStartEditComment(c)} className="text-blue-500">수정</button>
                    <button onClick={() => handleDeleteComment(c.id)} className="text-red-500">삭제</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* 댓글 작성 폼 */}
        <div className="mt-3 border p-3">
          <input placeholder="닉네임(1~10자)" value={newCommentNickname} onChange={(e) => setNewCommentNickname(e.target.value)} className="border p-1 w-full mb-2"/>
          <textarea placeholder="댓글 내용을 입력하세요 (1~200자)" value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} className="border p-1 w-full mb-2"/>
          <div>
            <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 py-1">작성</button>
          </div>
        </div>
      </div>
    </div>
  )
}
