import React, { useState } from "react"
import { Post, Comment } from "@/types/types.js"
import { useNavigate } from "react-router-dom"
import { posts, comments } from "@/data/posts.js"

interface PostDetailProps {
  postId: number
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const navigate = useNavigate()
  const postIndex = posts.findIndex((p) => p.id === postId)
  const [post, setPost] = useState<Post>(posts[postIndex])
  const [postComments, setPostComments] = useState(
    comments.filter((c) => c.postId === postId)
  )

  // 수정 상태
  const [editingPost, setEditingPost] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  // 댓글 상태
  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  // 게시글 수정
  const handleSavePost = () => {
    const updated = { ...post, title, content, updatedAt: new Date().toISOString() }
    setPost(updated)
    posts[postIndex] = updated
    setEditingPost(false)
  }

  // 게시글 삭제
  const handleDeletePost = () => {
    posts.splice(postIndex, 1)
    navigate("/")
  }

  // 댓글 작성
  const handleAddComment = () => {
    if (!newComment.trim()) return
    const comment: Comment = {
      id: Date.now(),
      postId,
      content: newComment,
      nickname: "익명",
      password: "1234",
      createdAt: new Date().toISOString(),
    }
    setPostComments((prev) => [...prev, comment])
    comments.push(comment)
    setNewComment("")
  }

  // 댓글 삭제
  const handleDeleteComment = (id: number) => {
    setPostComments((prev) => prev.filter((c) => c.id !== id))
  }

  // 댓글 수정
  const handleStartEdit = (id: number, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }
  const handleSaveEdit = (id: number) => {
    setPostComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: editContent, updatedAt: new Date().toISOString() } : c))
    )
    setEditingId(null)
  }
  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="p-4">
      {/* 게시글 수정/삭제 */}
      {editingPost ? (
        <div className="mb-4 border p-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="border p-1 w-full mb-2"/>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="border p-1 w-full mb-2"/>
          <button onClick={handleSavePost} className="bg-green-500 text-white px-3 py-1 mr-2">저장</button>
          <button onClick={() => setEditingPost(false)} className="bg-gray-300 px-3 py-1">취소</button>
        </div>
      ) : (
        <>
          <h2 className="font-bold text-lg">{post.title}</h2>
          <p>{post.content}</p>
          <p className="text-sm text-gray-500 mb-2">
            작성자: {post.nickname} / 작성일: {new Date(post.createdAt).toLocaleString()}
          </p>
          <button onClick={() => setEditingPost(true)} className="bg-blue-500 text-white px-2 py-1 mr-2">수정</button>
          <button onClick={handleDeletePost} className="bg-red-500 text-white px-2 py-1">삭제</button>
        </>
      )}

      {/* 댓글 */}
      <div className="mt-4">
        <h3 className="font-semibold">댓글</h3>
        {postComments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="ml-2 flex justify-between items-center mb-1">
                {editingId === c.id ? (
                  <div className="flex-1 flex items-center">
                    <input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="border p-1 flex-1 mr-2"/>
                    <button onClick={() => handleSaveEdit(c.id)} className="bg-green-500 text-white px-2 mr-1">저장</button>
                    <button onClick={handleCancelEdit} className="bg-gray-300 px-2">취소</button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">{c.nickname}: {c.content}</span>
                    <div>
                      <button onClick={() => handleStartEdit(c.id, c.content)} className="text-blue-500 mr-2">수정</button>
                      <button onClick={() => handleDeleteComment(c.id)} className="text-red-500">삭제</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* 댓글 작성 */}
        <div className="mt-2 flex">
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" className="border p-1 flex-1"/>
          <button onClick={handleAddComment} className="bg-blue-500 text-white px-3 ml-2">작성</button>
        </div>
      </div>
    </div>
  )
}
