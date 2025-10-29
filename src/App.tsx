import React from "react"
import { Router } from "@/router/Router.js"

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm mb-4">
        <div className="max-w-3xl mx-auto p-4 text-center font-bold text-xl">
          📝 게시판
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4">
        <Router />
      </main>
    </div>
  )
}
