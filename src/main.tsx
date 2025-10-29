import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App.js"
import "./index.css" // TailwindCSS 스타일 포함

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
