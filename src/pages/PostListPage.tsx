// src/pages/PostListPage.tsx
import React from "react"
import { Link } from "react-router-dom"
import { posts } from "@/data/posts.js"

export const PostListPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">게시물 목록</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            <Link className="text-blue-600" to={`/posts/${post.id}`}>
              {post.title} - {post.nickname}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
