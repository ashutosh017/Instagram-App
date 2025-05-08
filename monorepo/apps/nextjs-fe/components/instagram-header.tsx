"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MessageCircle, PlusSquare } from "lucide-react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function InstagramHeader() {
  const { logout } = useStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between   w-full px-4 py-2 bg-white border-b">
     <div className="relative w-[175px] h-[51px] overflow-hidden ">
              <Image
                src="https://static.cdninstagram.com/rsrc.php/v4/yB/r/E7m8ZCMOFDS.png"
                alt="Instagram"
                width={175}
                height={255} // The full height or enough to show vertical positioning
                className="absolute top-[-51px] left-0"
              />
            </div>
      <div className="flex items-center space-x-4">
        <Link href="/create" className="focus:outline-none">
          <PlusSquare className="w-6 h-6" />
        </Link>
        <button className="focus:outline-none">
          <Heart className="w-6 h-6" />
        </button>
        <button className="focus:outline-none">
          <MessageCircle className="w-6 h-6" />
        </button>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-sm">
          Logout
        </Button>
      </div>
    </header>
  )
}
