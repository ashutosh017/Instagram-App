"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Info, Phone, Send, Video } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const params = useParams()
  const userId = params.userId as string
  const [message, setMessage] = useState("")

  // Mock messages data
  const messages = [
    { id: 1, text: "Hey, how are you?", sent: false, time: "10:30 AM" },
    { id: 2, text: "I'm good! Just checking out this new app.", sent: true, time: "10:32 AM" },
    { id: 3, text: "It looks just like Instagram!", sent: false, time: "10:33 AM" },
    { id: 4, text: "Yeah, it's pretty cool. Have you seen the new features?", sent: true, time: "10:35 AM" },
    { id: 5, text: "Not yet, what's new?", sent: false, time: "10:36 AM" },
    { id: 6, text: "They added a chat feature and some other stuff.", sent: true, time: "10:38 AM" },
    { id: 7, text: "That's awesome! I'll check it out.", sent: false, time: "10:40 AM" },
  ]

  const handleSend = () => {
    if (message.trim()) {
      // In a real app, you would send the message to the server
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="flex flex-col h-screen pb-16">
      <header className="border-b p-4 sticky top-0 bg-background z-10 flex items-center">
        <Link href="/messages" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=User${userId}`} alt={`User ${userId}`} />
          <AvatarFallback>{`U${userId}`}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="font-semibold">user{userId}</h1>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                msg.sent ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend()
            }}
          />
          <Button size="icon" className="rounded-full" onClick={handleSend} disabled={!message.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
