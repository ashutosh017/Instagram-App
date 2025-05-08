"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User, Post, Story, Comment } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Sample data
const SAMPLE_USERS: User[] = [
  {
    id: "user1",
    username: "janedoe",
    fullName: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    profileImage: "/placeholder.svg?height=150&width=150",
    bio: "Travel enthusiast | Photographer",
    followers: 1243,
    following: 567,
    posts: 42,
  },
  {
    id: "user2",
    username: "traveler",
    fullName: "Alex Traveler",
    email: "alex@example.com",
    password: "password123",
    profileImage: "/placeholder.svg?height=150&width=150",
    bio: "Exploring the world one photo at a time ✈️",
    followers: 2567,
    following: 345,
    posts: 78,
  },
]

const SAMPLE_POSTS: Post[] = [
  {
    id: "post1",
    userId: "user1",
    username: "janedoe",
    userImage: "/placeholder.svg?height=150&width=150",
    location: "New York, NY",
    image: "/placeholder.svg?height=600&width=600",
    caption: "Enjoying the beautiful day in New York! #newyork #sunny #weekend",
    likes: [],
    comments: [
      {
        id: "comment1",
        userId: "user2",
        username: "traveler",
        text: "Looks amazing! 😍",
        createdAt: Date.now() - 3600000,
      },
    ],
    saved: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: "post2",
    userId: "user2",
    username: "traveler",
    userImage: "/placeholder.svg?height=150&width=150",
    location: "Paris, France",
    image: "/placeholder.svg?height=600&width=600",
    caption: "Finally made it to Paris! The Eiffel Tower is even more beautiful in person. #paris #travel #eiffeltower",
    likes: [],
    comments: [
      {
        id: "comment2",
        userId: "user1",
        username: "janedoe",
        text: "Paris is always a good idea! ❤️",
        createdAt: Date.now() - 1800000,
      },
    ],
    saved: [],
    createdAt: Date.now() - 18000000,
  },
]

const SAMPLE_STORIES: Story[] = [
  {
    id: "story1",
    userId: "user1",
    username: "janedoe",
    image: "/placeholder.svg?height=600&width=600",
    createdAt: Date.now() - 3600000,
    viewed: [],
    isExpired: false,
  },
  {
    id: "story2",
    userId: "user2",
    username: "traveler",
    image: "/placeholder.svg?height=600&width=600",
    createdAt: Date.now() - 7200000,
    viewed: [],
    isExpired: false,
  },
]

interface StoreContextType {
  currentUser: User | null
  users: User[]
  posts: Post[]
  stories: Story[]
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  signup: (user: Omit<User, "id" | "followers" | "following" | "posts" | "profileImage">) => boolean
  logout: () => void
  likePost: (postId: string) => void
  unlikePost: (postId: string) => void
  savePost: (postId: string) => void
  unsavePost: (postId: string) => void
  addComment: (postId: string, text: string) => void
  createPost: (
    post: Omit<Post, "id" | "userId" | "username" | "userImage" | "likes" | "comments" | "saved" | "createdAt">,
  ) => void
  viewStory: (storyId: string) => void
  getUserPosts: (userId: string) => Post[]
  getSavedPosts: () => Post[]
  getTimeAgo: (timestamp: number) => string
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize data from localStorage or use sample data
  useEffect(() => {
    const storedUsers = localStorage.getItem("instagram_users")
    const storedPosts = localStorage.getItem("instagram_posts")
    const storedStories = localStorage.getItem("instagram_stories")
    const storedCurrentUser = localStorage.getItem("instagram_current_user")

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      setUsers(SAMPLE_USERS)
      localStorage.setItem("instagram_users", JSON.stringify(SAMPLE_USERS))
    }

    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    } else {
      setPosts(SAMPLE_POSTS)
      localStorage.setItem("instagram_posts", JSON.stringify(SAMPLE_POSTS))
    }

    if (storedStories) {
      setStories(JSON.parse(storedStories))
    } else {
      setStories(SAMPLE_STORIES)
      localStorage.setItem("instagram_stories", JSON.stringify(SAMPLE_STORIES))
    }

    if (storedCurrentUser) {
      const user = JSON.parse(storedCurrentUser)
      setCurrentUser(user)
      setIsAuthenticated(true)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("instagram_users", JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (posts.length > 0) {
      localStorage.setItem("instagram_posts", JSON.stringify(posts))
    }
  }, [posts])

  useEffect(() => {
    if (stories.length > 0) {
      localStorage.setItem("instagram_stories", JSON.stringify(stories))
    }
  }, [stories])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("instagram_current_user", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("instagram_current_user")
    }
  }, [currentUser])

  const login = (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      setCurrentUser(user)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const signup = (userData: Omit<User, "id" | "followers" | "following" | "posts" | "profileImage">) => {
    // Check if username or email already exists
    const userExists = users.some((u) => u.username === userData.username || u.email === userData.email)

    if (userExists) {
      return false
    }

    const newUser: User = {
      id: uuidv4(),
      ...userData,
      profileImage: "/placeholder.svg?height=150&width=150",
      followers: 0,
      following: 0,
      posts: 0,
    }

    setUsers((prev) => [...prev, newUser])
    setCurrentUser(newUser)
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const likePost = (postId: string) => {
    if (!currentUser) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && !post.likes.includes(currentUser.id)) {
          return {
            ...post,
            likes: [...post.likes, currentUser.id],
          }
        }
        return post
      }),
    )
  }

  const unlikePost = (postId: string) => {
    if (!currentUser) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes.filter((id) => id !== currentUser.id),
          }
        }
        return post
      }),
    )
  }

  const savePost = (postId: string) => {
    if (!currentUser) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && !post.saved.includes(currentUser.id)) {
          return {
            ...post,
            saved: [...post.saved, currentUser.id],
          }
        }
        return post
      }),
    )
  }

  const unsavePost = (postId: string) => {
    if (!currentUser) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            saved: post.saved.filter((id) => id !== currentUser.id),
          }
        }
        return post
      }),
    )
  }

  const addComment = (postId: string, text: string) => {
    if (!currentUser || !text.trim()) return

    const newComment: Comment = {
      id: uuidv4(),
      userId: currentUser.id,
      username: currentUser.username,
      text,
      createdAt: Date.now(),
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )
  }

  const createPost = (
    postData: Omit<Post, "id" | "userId" | "username" | "userImage" | "likes" | "comments" | "saved" | "createdAt">,
  ) => {
    if (!currentUser) return

    const newPost: Post = {
      id: uuidv4(),
      userId: currentUser.id,
      username: currentUser.username,
      userImage: currentUser.profileImage,
      ...postData,
      likes: [],
      comments: [],
      saved: [],
      createdAt: Date.now(),
    }

    setPosts((prev) => [newPost, ...prev])

    // Update user's post count
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            posts: user.posts + 1,
          }
        }
        return user
      }),
    )

    // Update current user
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        posts: currentUser.posts + 1,
      })
    }
  }

  const viewStory = (storyId: string) => {
    if (!currentUser) return

    setStories((prev) =>
      prev.map((story) => {
        if (story.id === storyId && !story.viewed.includes(currentUser.id)) {
          return {
            ...story,
            viewed: [...story.viewed, currentUser.id],
          }
        }
        return story
      }),
    )
  }

  const getUserPosts = (userId: string) => {
    return posts.filter((post) => post.userId === userId).sort((a, b) => b.createdAt - a.createdAt)
  }

  const getSavedPosts = () => {
    if (!currentUser) return []
    return posts.filter((post) => post.saved.includes(currentUser.id)).sort((a, b) => b.createdAt - a.createdAt)
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) {
      return interval === 1 ? "1 year ago" : `${interval} years ago`
    }

    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) {
      return interval === 1 ? "1 month ago" : `${interval} months ago`
    }

    interval = Math.floor(seconds / 86400)
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`
    }

    interval = Math.floor(seconds / 3600)
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`
    }

    interval = Math.floor(seconds / 60)
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`
    }

    return seconds < 10 ? "just now" : `${seconds} seconds ago`
  }

  const value = {
    currentUser,
    users,
    posts,
    stories,
    isAuthenticated,
    login,
    signup,
    logout,
    likePost,
    unlikePost,
    savePost,
    unsavePost,
    addComment,
    createPost,
    viewStory,
    getUserPosts,
    getSavedPosts,
    getTimeAgo,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
