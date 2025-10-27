import { Comment } from "../types/types.js"

export const comments: Comment[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  postId: 1,
  nickname: `댓글러${i + 1}`,
  content: `이것은 샘플 댓글 ${i + 1}입니다.`,
  password: "1234",
  createdAt: new Date(Date.now() - i * 5000).toISOString(),
}))

