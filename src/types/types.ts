export interface Comment {
  id: number
  postId: number
  content: string
  nickname: string
  password: string
  createdAt: string
  deleted?: boolean
  updatedAt?: string
}

export interface Post {
  id: number
  title: string
  content: string
  nickname: string
  password: string
  createdAt: string
  updatedAt?: string
  deleted?: boolean
  comments?: Comment[]
}
