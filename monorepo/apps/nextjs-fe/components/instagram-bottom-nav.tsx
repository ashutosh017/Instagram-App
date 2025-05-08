"use client"

import Link from "next/link"
import { Home, Search, PlusSquare, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "@/lib/store"

export function InstagramBottomNav() {
  const { currentUser } = useStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 bg-white border-t max-w-md mx-auto">
      <Link href="/feed" className="focus:outline-none p-2">
        <Home className="w-6 h-6" />
      </Link>
      <Link href="/explore" className="focus:outline-none p-2">
        <Search className="w-6 h-6" />
      </Link>
      <Link href="/create" className="focus:outline-none p-2">
        <PlusSquare className="w-6 h-6" />
      </Link>
      <button className="focus:outline-none p-2">
        <Heart className="w-6 h-6" />
      </button>
      <Link href="/profile" className="focus:outline-none p-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={currentUser?.profileImage || "/placeholder.svg"} alt="Profile" />
          <AvatarFallback>{currentUser?.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}
