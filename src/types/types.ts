export interface Comment {
  id: number
  boardId: number
  content: string
  nickname: string
  password: string
  createdAt: string
  updatedAt?: string
  deleted?: boolean
}

export interface Board {
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
