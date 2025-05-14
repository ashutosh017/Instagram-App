import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNavigation from "@/components/bottom-navigation"

import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
const inter = Inter({ subsets: ["latin"] })


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession();
  if(!session){
    redirect("/signup")
  }


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange >
          <main className="min-h-screen max-w-md mx-auto border-x">
            {children}
            <BottomNavigation />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
