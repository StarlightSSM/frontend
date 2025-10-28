import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { posts } from "@/data/posts.js"
import { Button } from "@/components/ui/button.js"

export const PostListPage: React.FC = () => {
  const navigate = useNavigate()

  // 삭제되지 않은 게시글만 필터링 후 최신순 정렬
  const visiblePosts = posts
    .filter((p) => !p.deleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10
  const totalPages = Math.ceil(visiblePosts.length / postsPerPage)

  // 현재 페이지에 표시할 게시글
  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage
  const currentPosts = visiblePosts.slice(indexOfFirst, indexOfLast)

  // 페이지 이동 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">게시판 목록</h1>

      {currentPosts.length === 0 ? (
        <p className="text-gray-600">게시글이 없습니다.</p>
      ) : (
        <ul className="divide-y">
          {currentPosts.map((post) => (
            <li key={post.id} className="py-3">
              <Link to={`/posts/${post.id}`} className="text-blue-600 hover:underline text-lg">
                {post.title}
              </Link>
              <div className="text-sm text-gray-500 mt-1">
                작성자: {post.nickname} / {new Date(post.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 페이지네이션 버튼 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 게시글 작성 버튼 */}
      <div className="flex justify-end mt-8">
        <Button onClick={() => navigate("/posts/create")}>게시글 작성</Button>
      </div>
    </div>
  )
}
