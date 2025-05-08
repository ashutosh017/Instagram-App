"use client"

import Image from "next/image"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store"
import type { Story } from "@/lib/types"

interface InstagramStoriesProps {
  stories: Story[]
}

export function InstagramStories({ stories }: InstagramStoriesProps) {
  const { currentUser, viewStory } = useStore()

  const handleStoryClick = (storyId: string) => {
    viewStory(storyId)
    // In a real app, this would open a story viewer
    alert("Story viewed! In a real app, this would open a full-screen story viewer.")
  }

  const isStoryViewed = (story: Story) => {
    return currentUser ? story.viewed.includes(currentUser.id) : false
  }

  return (
    <div className="py-3 border-b">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex px-4 space-x-4">
          {currentUser && (
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-16 h-16 rounded-full p-[2px] bg-gray-200">
                <div className="relative w-full h-full bg-white rounded-full p-[2px]">
                  <Image
                    src={currentUser.profileImage || "/placeholder.svg"}
                    alt="Your Story"
                    className="rounded-full object-cover"
                    fill
                    sizes="64px"
                  />
                  <div className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full border-2 border-white">
                    <span className="text-xs text-white font-bold">+</span>
                  </div>
                </div>
              </div>
              <span className="text-xs truncate max-w-[64px]">Your Story</span>
            </div>
          )}

          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <button
                onClick={() => handleStoryClick(story.id)}
                className={`relative w-16 h-16 rounded-full p-[2px] ${
                  isStoryViewed(story) ? "bg-gray-300" : "bg-gradient-to-tr from-yellow-400 to-pink-600"
                }`}
              >
                <div className="relative w-full h-full bg-white rounded-full p-[2px]">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.username}
                    className="rounded-full object-cover"
                    fill
                    sizes="64px"
                  />
                </div>
              </button>
              <span className="text-xs truncate max-w-[64px]">{story.username}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-0" />
      </ScrollArea>
    </div>
  )
}
