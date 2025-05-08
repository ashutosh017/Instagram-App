"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Settings, Bookmark } from "lucide-react"
import { useStore } from "@/lib/store"
import { InstagramHeader } from "@/components/instagram-header"
import { InstagramBottomNav } from "@/components/instagram-bottom-nav"

export default function ProfilePage() {
  const {  currentUser, getUserPosts, getSavedPosts } = useStore()
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token")
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [ router])

  if (!currentUser) {
    return null
  }

  const userPosts = getUserPosts(currentUser.id)
  const savedPosts = getSavedPosts()

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      <InstagramHeader />
      <div className="w-full max-w-md pb-20">
        {/* Profile header */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser.profileImage || "/placeholder.svg"} alt={currentUser.username} />
              <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="ml-8 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{currentUser.username}</h2>
                <Button variant="outline" size="sm" className="ml-4">
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" className="ml-2 p-2">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="font-semibold">{currentUser.posts}</div>
                  <div className="text-sm text-gray-500">posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{currentUser.followers}</div>
                  <div className="text-sm text-gray-500">followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{currentUser.following}</div>
                  <div className="text-sm text-gray-500">following</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="font-semibold">{currentUser.fullName}</h1>
            {currentUser.bio && <p className="text-sm mt-1">{currentUser.bio}</p>}
          </div>
        </div>

        {/* Posts tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="posts" className="py-3">
              <Grid className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="saved" className="py-3">
              <Bookmark className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div key={post.id} className="relative aspect-square">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center text-gray-500">
                  <p>No posts yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <div key={post.id} className="relative aspect-square">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-10 text-center text-gray-500">
                  <p>No saved posts</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <InstagramBottomNav />
    </main>
  )
}
