import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Account",
      items: [
        { name: "Personal Information", link: "#" },
        { name: "Saved", link: "#" },
        { name: "Close Friends", link: "#" },
        { name: "Language", link: "#" },
      ],
    },
    {
      title: "Privacy",
      items: [
        { name: "Account Privacy", link: "#" },
        { name: "Blocked Accounts", link: "#" },
        { name: "Muted Accounts", link: "#" },
        { name: "Hidden Words", link: "#" },
      ],
    },
    {
      title: "Notifications",
      items: [
        { name: "Posts, Stories and Comments", link: "#" },
        { name: "Following and Followers", link: "#" },
        { name: "Messages", link: "#" },
      ],
    },
    {
      title: "Help",
      items: [
        { name: "Report a Problem", link: "#" },
        { name: "Help Center", link: "#" },
        { name: "Privacy and Security Help", link: "#" },
      ],
    },
    {
      title: "About",
      items: [
        { name: "Terms of Use", link: "#" },
        { name: "Privacy Policy", link: "#" },
        { name: "Cookies Policy", link: "#" },
      ],
    },
  ]

  return (
    <div className="pb-16">
      <header className="border-b p-4 sticky top-0 bg-background z-10 flex items-center">
        <Link href="/profile" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-semibold flex-1">Settings</h1>
      </header>

      <div className="divide-y">
        {settingsSections.map((section) => (
          <div key={section.title} className="py-2">
            <h2 className="px-4 py-2 font-semibold text-lg">{section.title}</h2>
            <div className="divide-y">
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/50"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 mt-4">
        <Button variant="outline" className="w-full text-blue-500 hover:text-blue-600">
          Log Out
        </Button>
      </div>
    </div>
  )
}
