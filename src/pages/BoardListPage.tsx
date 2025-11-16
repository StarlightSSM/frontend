import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { boardAPI } from "@/components/lib/board"

// ✅ 백엔드 데이터 구조에 맞춘 타입 정의
interface Board {
  id: number
  title: string
  content: string
  nickname: string
  createdAt: string
  deleted?: boolean // ✅ optional
}

export const BoardListPage: React.FC = () => {
  const navigate = useNavigate()
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const boardsPerPage = 10

  // ✅ 게시글 목록 API 불러오기
  const fetchBoards = async () => {
    setLoading(true)
    try {
      const res = await boardAPI.getAll()
      setBoards(res.data.data)
    } catch (err) {
      console.error("게시글 목록 불러오기 실패 ❌", err)
      alert("게시글 목록 불러오기 실패 ❌")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBoards()
  }, [])

  // ✅ 삭제되지 않은 글만 필터링 + 최신순 정렬
  const visiblePosts = boards
    .filter((p) => !p.deleted)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const totalPages = Math.ceil(visiblePosts.length / boardsPerPage)
  const indexOfLast = currentPage * boardsPerPage
  const indexOfFirst = indexOfLast - boardsPerPage
  const currentBoards = visiblePosts.slice(indexOfFirst, indexOfLast)

  // ✅ 페이지 이동 공통 함수 (범위 강제: 1 ~ totalPages)
  const goToPage = (page: number) => {
    if (totalPages === 0) return
    const clamped = Math.max(1, Math.min(totalPages, page))
    setCurrentPage(clamped)
  }

  // ✅ <<  : 5페이지 앞으로 (예: 7 → 2, 3 → 1)
  const handleFirstBlock = () => {
    goToPage(currentPage - 5)
  }

  // ✅ <  : 1페이지 앞으로
  const handlePrev = () => {
    goToPage(currentPage - 1)
  }

  // ✅ >  : 1페이지 뒤로
  const handleNext = () => {
    goToPage(currentPage + 1)
  }

  // ✅ >> : 5페이지 뒤로 (예: 2 → 7, 단 최대 totalPages까지)
  const handleLastBlock = () => {
    goToPage(currentPage + 5)
  }

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">게시판 목록</h1>

      {loading ? (
        <p>불러오는 중...</p>
      ) : currentBoards.length === 0 ? (
        <p className="text-gray-600">게시글이 없습니다.</p>
      ) : (
        <ul className="divide-y">
          {currentBoards.map((board) => (
            <li key={board.id} className="py-3">
              <Link
                to={`/boards/${board.id}`}
                className="text-lg text-blue-600 hover:underline"
              >
                {board.title}
              </Link>
              <div className="mt-1 text-sm text-gray-500">
                작성자: {board.nickname} /{" "}
                {new Date(board.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {/* << : 5페이지 앞으로 */}
          <button
            type="button"
            onClick={handleFirstBlock}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {"<<"}
          </button>

          {/* < : 1페이지 앞으로 */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {"<"}
          </button>

          {/* 페이지 번호들 */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              type="button"
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* > : 1페이지 뒤로 */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {">"}
          </button>

          {/* >> : 5페이지 뒤로 */}
          <button
            type="button"
            onClick={handleLastBlock}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {">>"}
          </button>
        </div>
      )}

      {/* ✅ 게시글 작성 버튼 */}
      <div className="flex justify-end mt-8">
        <Button onClick={() => navigate("/create")}>게시글 작성</Button>
      </div>
    </div>
  )
}

export default BoardListPage
