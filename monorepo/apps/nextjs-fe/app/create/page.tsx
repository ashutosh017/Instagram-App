"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { InstagramHeader } from "@/components/instagram-header"
import { InstagramBottomNav } from "@/components/instagram-bottom-nav"

export default function CreatePostPage() {
  const { isAuthenticated, createPost } = useStore()
  const router = useRouter()
  const [caption, setCaption] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, we would handle file uploads
  // For this demo, we'll use a placeholder image
  const placeholderImage = "/placeholder.svg?height=600&width=600"

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      createPost({
        image: placeholderImage,
        caption,
        location: location || undefined,
      })

      setIsLoading(false)
      router.push("/feed")
    }, 1000)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <InstagramHeader />
      <div className="w-full max-w-md p-4 pb-20">
        <h1 className="text-xl font-bold mb-4">Create New Post</h1>

        <div className="mb-4 relative aspect-square w-full bg-gray-100 flex items-center justify-center">
          <Image
            src={placeholderImage || "/placeholder.svg"}
            alt="Post preview"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            <p className="text-center p-4">
              In a real app, you would be able to upload an image here.
              <br />
              <br />
              For this demo, we&apos;re using a placeholder image.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium mb-1">
              Caption
            </label>
            <Textarea
              id="caption"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location (optional)
            </label>
            <Input
              id="location"
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={!caption.trim() || isLoading}
          >
            {isLoading ? "Posting..." : "Share"}
          </Button>
        </form>
      </div>
      <InstagramBottomNav />
    </main>
  )
}
