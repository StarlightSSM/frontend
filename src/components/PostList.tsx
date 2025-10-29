import React, { useState } from "react"
import { Link } from "react-router-dom"
import { posts as initialPosts } from "../data/posts.js"
import { Card } from "components/ui/card.js"
import { Button } from "@/components/ui/button.js"

const ITEMS_PER_PAGE = 10

export const PostList: React.FC = () => {
  const [page, setPage] = useState(1)
  const sortedPosts = [...initialPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const paginated = sortedPosts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📋 게시판</h2>
        <Link to="/create">
          <Button>글 작성하기</Button>
        </Link>
      </div>

      {paginated.map((post) => (
        <Card
          key={post.id}
          className="p-4 transition-colors bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
        >
          <Link to={`/post/${post.id}`}>
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-gray-500">{post.nickname}</p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </Link>
        </Card>

      ))}

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  )
}
