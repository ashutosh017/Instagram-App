"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, Smile } from "lucide-react"
import { useStore } from "@/lib/store"
import type { Post } from "@/lib/types"

interface InstagramPostProps {
  post: Post
}

export function InstagramPost({ post }: InstagramPostProps) {
  const { currentUser, likePost, unlikePost, savePost, unsavePost, addComment, getTimeAgo } = useStore()
  const [comment, setComment] = useState("")
  const [showAllComments, setShowAllComments] = useState(false)

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false
  const isSaved = currentUser ? post.saved.includes(currentUser.id) : false

  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id)
    } else {
      likePost(post.id)
    }
  }

  const handleSave = () => {
    if (isSaved) {
      unsavePost(post.id)
    } else {
      savePost(post.id)
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      addComment(post.id, comment)
      setComment("")
    }
  }

  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2)
  const timeAgo = getTimeAgo(post.createdAt)

  return (
    <div className="border-b pb-4 mb-4">
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.userImage || "/placeholder.svg"} alt={post.username} />
            <AvatarFallback>{post.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold">{post.username}</div>
            {post.location && <div className="text-xs text-gray-500">{post.location}</div>}
          </div>
        </div>
        <button className="focus:outline-none">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post image */}
      <div className="relative aspect-square w-full">
        <Image src={post.image || "/placeholder.svg"} alt="Post" fill className="object-cover" sizes="100vw" />
      </div>

      {/* Post actions */}
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center space-x-4">
          <button className="focus:outline-none" onClick={handleLike}>
            <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <button className="focus:outline-none">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="focus:outline-none">
            <Send className="w-6 h-6" />
          </button>
        </div>
        <button className="focus:outline-none" onClick={handleSave}>
          <Bookmark className={`w-6 h-6 ${isSaved ? "fill-black" : ""}`} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4 pt-2">
        <p className="text-sm font-semibold">{post.likes.length} likes</p>
      </div>

      {/* Caption */}
      <div className="px-4 pt-1">
        <p className="text-sm">
          <span className="font-semibold">{post.username}</span> {post.caption}
        </p>
      </div>

      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-4 pt-1">
          {post.comments.length > 2 && !showAllComments && (
            <button className="text-sm text-gray-500 focus:outline-none" onClick={() => setShowAllComments(true)}>
              View all {post.comments.length} comments
            </button>
          )}
          {displayedComments.map((comment, index) => (
            <p key={comment.id} className="text-sm">
              <span className="font-semibold">{comment.username}</span> {comment.text}
            </p>
          ))}
        </div>
      )}

      {/* Time */}
      <div className="px-4 pt-1">
        <p className="text-xs text-gray-500">{timeAgo}</p>
      </div>

      {/* Add comment */}
      <form onSubmit={handleAddComment} className="flex items-center px-4 pt-2 mt-1 border-t">
        <button type="button" className="focus:outline-none mr-2">
          <Smile className="w-6 h-6" />
        </button>
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 text-sm border-none focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          className={`text-sm font-semibold ${
            comment.length > 0 ? "text-blue-500" : "text-blue-200"
          } focus:outline-none`}
          disabled={comment.length === 0}
        >
          Post
        </button>
      </form>
    </div>
  )
}
