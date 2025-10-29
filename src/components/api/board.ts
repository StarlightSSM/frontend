import axios from "axios"

const API_BASE = "http://localhost:8080"

export const boardAPI = {
  // 게시글 목록 조회
  getAll: () => axios.get(`${API_BASE}/boards`),

  // 게시글 상세 조회
  getOne: (id: number) => axios.get(`${API_BASE}/boards/${id}`),

  // 게시글 생성
  create: (data: { title: string; content: string; nickname: string; password: string }) =>
    axios.post(`${API_BASE}/boards`, data),

  // 게시글 수정
  update: (id: number, data: { title: string; content: string; nickname: string }) =>
    axios.put(`${API_BASE}/boards/${id}`, data),

  // 게시글 삭제
  delete: (id: number) => axios.delete(`${API_BASE}/boards/${id}`),

  // 댓글 생성
  addComment: (postId: number, data: { content: string; nickname: string; password: string }) =>
    axios.post(`${API_BASE}/boards/${postId}/comments`, data),

  // 댓글 수정
  updateComment: (postId: number, commentId: number, data: { content: string; nickname: string }) =>
    axios.put(`${API_BASE}/boards/${postId}/comments/${commentId}`, data),

  // 댓글 삭제
  deleteComment: (postId: number, commentId: number) =>
    axios.delete(`${API_BASE}/boards/${postId}/comments/${commentId}`),
}
