import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card.js"
import { Button } from "@/components/ui/button.js"
import axios from "axios"

interface Comment {
  id: number
  nickname: string
  content: string
  createdAt: string
}

interface Board {
  id: number
  title: string
  content: string
  nickname: string
  createdAt: string
  comments: Comment[]
}

const ITEMS_PER_PAGE = 10

export const BoardList: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  // ✅ 게시글 목록 불러오기
  const fetchBoards = async () => {
    setLoading(true)
    try {
      const res = await axios.get<{ data: Board[]; message: string }>(
        "http://localhost:8080/boards"
      )
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

  // ✅ 페이지네이션 계산
  const sortedBoards = [...boards].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const paginated = sortedBoards.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalPages = Math.ceil(sortedBoards.length / ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">📋 게시판</h2>
        <Link to="/create">
          <Button>글 작성하기</Button>
        </Link>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : paginated.length === 0 ? (
        <p className="text-gray-500">게시글이 없습니다.</p>
      ) : (
        paginated.map((board) => (
          <Card
            key={board.id}
            className="p-4 transition-colors bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
          >
            <Link to={`/boards/${board.id}`}>
              <h3 className="text-lg font-semibold">{board.title}</h3>
              <p className="text-sm text-gray-500">{board.nickname}</p>
              <p className="text-xs text-gray-400">
                {new Date(board.createdAt).toLocaleString()}
              </p>
            </Link>
          </Card>
        ))
      )}

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

export default BoardList
