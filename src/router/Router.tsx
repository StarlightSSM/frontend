// src/components/Router.tsx
import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PostListPage } from "../pages/PostListPage.js"
import { PostCreatePage } from "../pages/PostCreatePage.js"
import { PostDetailPage } from "../pages/PostDetailPage.js"
import { PostEditPage } from "../pages/PostEditPage.js"

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostListPage />} />
        <Route path="/posts/create" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/posts/:id/edit" element={<PostEditPage />} />
      </Routes>
    </BrowserRouter>
  )
}
