// src/pages/PostDetailPage.tsx
import React from "react"
import { useParams } from "react-router-dom"
import { PostDetail } from "@/components/PostDetail.js"
import { posts, comments } from "@/data/posts.js"

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const postId = Number(id)
  const post = posts.find((p) => p.id === postId)
  const postComments = comments.filter((c) => c.postId === postId)

  if (!post) return <p>게시물을 찾을 수 없습니다.</p>

  return <PostDetail post={post} comments={postComments} />
}
