export interface User {
  id: string
  username: string
  fullName: string
  email: string
  password: string
  profileImage: string
  bio?: string
  followers: number
  following: number
  posts: number
}

export interface Post {
  id: string
  userId: string
  username: string
  userImage: string
  location?: string
  image: string
  caption: string
  likes: string[] // Array of user IDs who liked the post
  comments: Comment[]
  saved: string[] // Array of user IDs who saved the post
  createdAt: number
}

export interface Comment {
  id: string
  userId: string
  username: string
  text: string
  createdAt: number
}

export interface Story {
  id: string
  userId: string
  username: string
  image: string
  createdAt: number
  viewed: string[] // Array of user IDs who viewed the story
  isExpired: boolean
}
