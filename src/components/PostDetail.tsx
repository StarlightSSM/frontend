// src/components/PostDetail.tsx
import React from "react"
import { Post, Comment } from "@/types/types.js"

interface PostDetailProps {
  post: Post
  comments: Comment[]
}

export const PostDetail = ({ post, comments }: PostDetailProps) => {
  const postComments = comments.filter((c) => c.postId === post.id)

  return (
    <div className="p-4 border mb-4">
      <h2 className="font-bold text-lg">{post.title}</h2>
      <p>{post.content}</p>
      <p className="text-sm text-gray-500">
        작성자: {post.nickname} / 작성일: {new Date(post.createdAt).toLocaleString()}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold">댓글</h3>
        {postComments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          <ul>
            {postComments.map((c) => (
              <li key={c.id} className="ml-2">
                {c.nickname}: {c.content} ({new Date(c.createdAt).toLocaleTimeString()})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
