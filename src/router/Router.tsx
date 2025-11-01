import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { BoardListPage } from "@/pages/BoardListPage"
import { BoardCreatePage } from "@/pages/BoardCreatePage"
import { BoardDetailPage } from "@/pages/BoardDetailPage"
import { BoardEditPage } from "@/pages/BoardEditPage"
import { TestBoardPage } from "@/pages/TestBoardPage"


export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 게시글 목록 */}
        <Route path="/boards" element={<BoardListPage />} />

        {/* 게시글 작성 */}
        <Route path="/create" element={<BoardCreatePage />} />

        {/* 게시글 상세 */}
        <Route path="/boards/:id" element={<BoardDetailPage />} />

        {/* 게시글 수정 */}
        <Route path="/boards/:id/edit" element={<BoardEditPage />} />

        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<p className="p-6 text-center">페이지를 찾을 수 없습니다 😢</p>} />

        {/* 테스트 페이지 */}
        <Route path="/test" element={<TestBoardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
