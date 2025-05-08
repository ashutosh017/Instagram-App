"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { InstagramFeed } from "@/components/instagram-feed"
import { InstagramHeader } from "@/components/instagram-header"
import { InstagramBottomNav } from "@/components/instagram-bottom-nav"
import { useStore } from "@/lib/store"

export default function FeedPage() {
  // const { isAuthenticated } = useStore()
  const router = useRouter()

  useEffect(() => {
  const isAuthenticated = localStorage.getItem("token")

    if (!isAuthenticated) {
      router.push("/")
    }
  }, [router])

  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <InstagramHeader />
      <InstagramFeed />
      <InstagramBottomNav />
    </main>
  )
}
