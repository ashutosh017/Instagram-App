"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useStore } from "@/lib/store"
import { InstagramHeader } from "@/components/instagram-header"
import { InstagramBottomNav } from "@/components/instagram-bottom-nav"

export default function ExplorePage() {
  const { isAuthenticated, posts } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Shuffle posts for explore page
  const shuffledPosts = [...posts].sort(() => 0.5 - Math.random())

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <InstagramHeader />
      <div className="w-full max-w-md pb-20">
        <div className="p-4 sticky top-14 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search" className="pl-10" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {shuffledPosts.map((post) => (
            <div key={post.id} className="relative aspect-square cursor-pointer" onClick={() => router.push(`/feed`)}>
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.caption}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />
            </div>
          ))}
        </div>
      </div>
      <InstagramBottomNav />
    </main>
  )
}
