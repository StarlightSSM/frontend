import { Post } from "../types/types"

export const posts: Post[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: `샘플 게시글 ${i + 1}`,
  content: `이것은 샘플 게시글 ${i + 1}의 내용입니다.`,
  nickname: `작성자${i + 1}`,
  password: "1234",
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
}))
