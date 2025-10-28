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
  const postIndex = posts.findIndex((p) => p.id === postId && !p.deleted)
  if (postIndex === -1) return <p>게시물을 찾을 수 없습니다.</p>

  const [post, setPost] = useState<Post>(posts[postIndex])
  const [postComments, setPostComments] = useState<Comment[]>(
    comments.filter((c) => c.postId === postId && !c.deleted)
  )

  // 게시글 수정 상태
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

  /* ---------- 게시글 수정 시작 (비밀번호 확인) ---------- */
  const handleStartEditPost = () => {
    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== post.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }
    setEditingPost(true)
  }

  /* ---------- 게시글 수정 저장 ---------- */
  const handleSavePost = () => {
    if (!isValidTitle(title)) return alert("제목은 1~20자 이내로 입력해주세요.")
    if (!isValidContent(content, 3000)) return alert("내용은 1~3000자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    const updated: Post = {
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
    const inputPw = window.prompt("게시글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== post.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    posts[postIndex] = { ...posts[postIndex], deleted: true, updatedAt: new Date().toISOString() }
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
      postId,
      content,
      nickname: nick,
      password: pw,
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

    const inputPw = window.prompt("댓글 비밀번호(4자리)를 입력하세요.") ?? ""
    if (!isValidPassword(inputPw) || inputPw !== comments[idx].password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    comments[idx] = { ...comments[idx], deleted: true, updatedAt: new Date().toISOString() }
    setPostComments((prev) => prev.filter((c) => c.id !== id))
  }

  /* ---------- 댓글 수정 ---------- */
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

  const handleSaveEditComment = (id: number) => {
    const content = editingCommentContent.trim()
    const nick = editingCommentNickname.trim()

    if (!isValidContent(content, 200)) return alert("댓글 내용은 1~200자 이내로 입력해주세요.")
    if (!isValidNickname(nick)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return

    comments[idx] = { ...comments[idx], content, nickname: nick, updatedAt: new Date().toISOString() }
    setPostComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content, nickname: nick, updatedAt: new Date().toISOString() } : c
      )
    )
    setEditingCommentId(null)
    setEditingCommentContent("")
    setEditingCommentNickname("")
  }

  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditingCommentContent("")
    setEditingCommentNickname("")
  }

  return (
    <div className="p-4">
      {/* ---------- 게시글 영역 ---------- */}
      {editingPost ? (
        <div className="p-2 mb-4 border rounded">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-1 mb-2 border rounded"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full p-1 mb-2 border rounded"
          />
          <div>
            <button
              onClick={handleSavePost}
              className="px-3 py-1 mr-2 text-white bg-green-500 rounded"
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
          <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
          <p className="mb-2 whitespace-pre-wrap">{post.content}</p>
          <p className="mb-3 text-sm text-gray-500">
            작성자: {post.nickname} / 작성일: {new Date(post.createdAt).toLocaleString()}
          </p>
          <div className="mb-4">
            <button
              onClick={handleStartEditPost}
              className="px-2 py-1 mr-2 text-white bg-blue-500 rounded"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-2 py-1 text-white bg-red-500 rounded"
            >
              삭제
            </button>
          </div>
        </>
      )}

      {/* ---------- 댓글 영역 ---------- */}
      <div className="mt-4">
        <h3 className="mb-2 font-semibold">댓글</h3>

        {postComments.length === 0 ? (
          <p className="mb-2">댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="flex items-start justify-between mb-2 ml-2">
                <div className="flex-1">
                  {editingCommentId === c.id ? (
                    <div>
                      <input
                        value={editingCommentNickname}
                        onChange={(e) => setEditingCommentNickname(e.target.value)}
                        className="w-full p-1 mb-1 border rounded"
                      />
                      <input
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="w-full p-1 mb-1 border rounded"
                      />
                      <div>
                        <button
                          onClick={() => handleSaveEditComment(c.id)}
                          className="px-2 py-1 mr-2 text-white bg-green-500 rounded"
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
                    <div>
                      <div className="text-sm text-gray-600">
                        {c.nickname} • {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-1">{c.content}</div>
                    </div>
                  )}
                </div>

                {editingCommentId !== c.id && (
                  <div className="flex flex-col gap-1 ml-4">
                    <button
                      onClick={() => handleStartEditComment(c)}
                      className="text-blue-500"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* ---------- 댓글 작성 폼 ---------- */}
        <div className="p-3 mt-3 border rounded">
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
          <div>
            <button
              onClick={handleAddComment}
              className="px-3 py-1 text-white bg-blue-500 rounded"
            >
              작성
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
