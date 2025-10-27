import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { posts } from "@/data/posts.js"
import { Post } from "@/types/types.js"

export const PostListPage: React.FC = () => {
  const navigate = useNavigate()
  const [postList, setPostList] = useState<Post[]>(posts)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">게시물 목록</h1>

      {/* 게시글 리스트 */}
      <ul>
        {postList.map((post) => (
          <li key={post.id} className="mb-2">
            <Link className="text-blue-600" to={`/posts/${post.id}`}>
              {post.title} - {post.nickname}
            </Link>
          </li>
        ))}
      </ul>

      {/* 게시글 작성 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => navigate("/posts/create")}
          className="bg-green-500 text-white px-4 py-2"
        >
          게시글 작성
        </button>
      </div>
    </div>
  )
}
