import { Board, Comment } from "@/types/types.js"

export const boards: Board[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `샘플 게시글 ${i + 1}`,
  content: `이것은 샘플 게시글 ${i + 1}의 내용입니다.`,
  nickname: `사용자${i + 1}`,
  password: "1234",
  createdAt: new Date(Date.now() - i * 60000).toISOString(),
  deleted: false,
}))

export const comments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  boardId: 1,
  content: `샘플 댓글 ${i + 1}`,
  nickname: `댓글러${i + 1}`,
  password: "1234",
  createdAt: new Date(Date.now() - i * 10000).toISOString(),
  deleted: false,
}))
