import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Post } from "@/types/types.js"
import { posts } from "@/data/posts.js"

// ✅ 유효성 검사 함수
const isValidTitle = (s: string) => s.trim().length > 0 && s.trim().length <= 20
const isValidContent = (s: string) => s.trim().length > 0 && s.trim().length <= 3000
const isValidNickname = (s: string) => /^[A-Za-z가-힣0-9]{1,10}$/.test(s)
const isValidPassword = (s: string) => /^[0-9]{4}$/.test(s)

export const PostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = Number(id)

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [nickname, setNickname] = useState("")

  useEffect(() => {
    const target = posts.find((p) => p.id === postId && !p.deleted)
    if (target) {
      setPost(target)
      setTitle(target.title)
      setContent(target.content)
      setNickname(target.nickname)
    }
  }, [postId])

  if (!post) return <div className="p-4">게시글을 찾을 수 없습니다.</div>

  const handleUpdatePost = () => {
    // ✅ 비밀번호 확인
    const pw = window.prompt("비밀번호(4자리 숫자)를 입력하세요.") ?? ""
    if (!isValidPassword(pw) || pw !== post.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    // ✅ 유효성 검사
    if (!isValidTitle(title)) return alert("제목은 1~20자 이내로 입력해주세요.")
    if (!isValidContent(content)) return alert("내용은 1~3000자 이내로 입력해주세요.")
    if (!isValidNickname(nickname)) return alert("닉네임은 특수문자 없이 1~10자 이내로 입력해주세요.")

    // ✅ 수정 반영
    const updated: Post = {
      ...post,
      title: title.trim(),
      content: content.trim(),
      nickname: nickname.trim(),
      updatedAt: new Date().toISOString(),
    }

    const idx = posts.findIndex((p) => p.id === postId)
    if (idx !== -1) posts[idx] = updated
    setPost(updated)

    alert("게시글이 수정되었습니다.")
    navigate(`/posts/${postId}`)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시글 수정</h1>
      <div className="border p-4 rounded shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목 (1~20자)"
          className="border p-2 w-full mb-2 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용 (1~3000자)"
          className="border p-2 w-full mb-2 rounded h-40 resize-none"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (1~10자, 특수문자 제외)"
          className="border p-2 w-full mb-4 rounded"
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleUpdatePost}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            수정 완료
          </button>
          <button
            onClick={() => navigate(`/posts/${postId}`)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  )
}
