'use client'
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getSession } from "@/lib/auth"

export default function HomePage() {
  // const router = useRouter()
  // useEffect(()=>{
  //   (async()=>{
  //     const isAuthenticated = await getSession();
  //     if(!isAuthenticated){
  //       router.push("/signup")
  //     }
  //   })()
  // },[])


  return (
    <div className="pb-16">
      <header className="border-b p-4 sticky top-0 bg-background z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Instagram</h1>
        <Link href="/messages">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
        </Link>
      </header>

      {/* Stories */}
      <div className="px-4 py-4 border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div className="rounded-full ring-2 ring-pink-500 p-0.5">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64&text=User${i + 1}`} alt={`User ${i + 1}`} />
                    <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs">user{i + 1}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Feed */}
      <div className="space-y-4 pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="border-x-0 rounded-none shadow-none">
            <CardHeader className="flex flex-row items-center p-4">
              <Link href="/profile" className="flex items-center gap-2 text-sm font-semibold">
                <Avatar className="w-8 h-8 border">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=User${i + 1}`} alt={`User ${i + 1}`} />
                  <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                </Avatar>
                user{i + 1}
              </Link>
              <Button variant="ghost" size="icon" className="w-8 h-8 ml-auto rounded-full">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Image
                src={`/placeholder.svg?height=400&width=400&text=Post${i + 1}`}
                width={400}
                height={400}
                alt={`Post ${i + 1}`}
                className="object-cover aspect-square w-full"
              />
            </CardContent>
            <CardFooter className="grid gap-2 p-4">
              <div className="flex items-center w-full">
                <Button variant="ghost" size="icon">
                  <Heart className="w-6 h-6" />
                  <span className="sr-only">Like</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="w-6 h-6" />
                  <span className="sr-only">Comment</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Send className="w-6 h-6" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <Bookmark className="w-6 h-6" />
                  <span className="sr-only">Save</span>
                </Button>
              </div>
              <div className="text-sm font-semibold">123 likes</div>
              <div className="text-sm">
                <Link href="/profile" className="font-semibold">
                  user{i + 1}
                </Link>{" "}
                This is a caption for the post with some text that might be longer and describe what's in the image.
              </div>
              <div className="text-sm text-muted-foreground">View all 24 comments</div>
              <div className="text-xs text-muted-foreground">2 HOURS AGO</div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

