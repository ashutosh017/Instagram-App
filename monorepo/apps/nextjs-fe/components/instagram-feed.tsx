"use client"

import { InstagramStories } from "./instagram-stories"
import { InstagramPost } from "./instagram-post"
import { useStore } from "@/lib/store"

export function InstagramFeed() {
  const { posts, stories } = useStore()

  // Sort posts by creation date (newest first)
  const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="flex flex-col w-full max-w-md mx-auto pb-16">
      <InstagramStories stories={stories} />
      <div className="pb-16">
        {sortedPosts.map((post) => (
          <InstagramPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
