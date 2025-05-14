'use client'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid, Bookmark, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import axios from "axios"
import { useEffect, useState } from "react"
import { getToken } from "@/lib/auth"
import { useUserStore } from "@/app/store"
export default  function ProfilePage() {
  const {user, setUser} = useUserStore();
  // const [user, setUser] = useState<{
  //   name: string;
  //   username: string; 
  //   followersCount: number;
  //   followingCount: number;
  //   description: string;
  //   postsCount: number;
  //   profilePic: string;
  // } | null>(null);
 
  const getUser = async (token: string) => {
    const user = await axios.get("http://localhost:3001/api/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("user: ", user);
    return user;
  };
 useEffect(()=>{
  (async()=>{
    const token = await getToken();
    if(!token){
      return <div>
        <h1>User not found</h1>
      </div>
    }
    const user = await getUser(token);
    if(!user || !user.data){
      return <div>
        <h1>User not found</h1>
      </div>
    }
    setUser(user.data.data);
  })()
 },[])
  // console.log("user: ", user);
  return (
    <div className="pb-16">
      <header className="border-b p-4 sticky top-0 bg-background z-10 flex items-center">
        <h1 className="text-xl font-semibold flex-1 text-center">{user?.username ?? "username"}</h1>
        <Link href="/settings" className="absolute right-4">
          <Settings className="h-5 w-5" />
        </Link>
      </header>

      {/* Profile Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.profilePic ?? "/placeholder.svg?height=80&width=80&text=User"} alt="Profile" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>

          <div className="flex gap-4 text-center">
            <Link href="#" className="block">
              <div className="font-semibold">{user?.postsCount}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </Link>
            <Link href="/profile/followers" className="block">
              <div className="font-semibold">{user?.followersCount}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </Link>
            <Link href="/profile/following" className="block">
              <div className="font-semibold">{user?.followingCount}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </Link>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-sm mt-1">
           {user?.description}
          </p>
          {/* <Link href="#" className="text-sm text-blue-600 hover:underline">
            website.com
          </Link> */}
        </div>

        <div className="mt-4 flex gap-2">
          <EditProfileDialog />
          <Button variant="outline" className="flex-1">
            Share Profile
          </Button>
        </div>

        {/* Story Highlights */}
        <div className="mt-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="rounded-full border p-0.5">
                  <Avatar className="h-14 w-14">
                    <AvatarImage
                      src={`/placeholder.svg?height=56&width=56&text=H${i + 1}`}
                      alt={`Highlight ${i + 1}`}
                    />
                    <AvatarFallback>{`H${i + 1}`}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs">Highlight {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="posts" className="py-3">
            <Grid className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="saved" className="py-3">
            <Bookmark className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square relative">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=${i + 1}`}
                  alt={`Post ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square relative">
                <Image
                  src={`/placeholder.svg?height=150&width=150&text=S${i + 1}`}
                  alt={`Saved post ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
