"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User, Zap, Images, Home, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const [credits, setCredits] = useState(null)
  const pathname = usePathname()

  useEffect(() => {
    if (user) {
      fetchCredits()
    }
  }, [user])

  const fetchCredits = async () => {
    try {
      const response = await fetch(`/api/credits/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setCredits(data)
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error)
    }
  }

  return (
    <header className="border-b border-purple-500/20 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI Image Generator
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={
                  pathname === "/"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }
              >
                <Home className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                variant={pathname === "/gallery" ? "default" : "ghost"}
                size="sm"
                className={
                  pathname === "/gallery"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }
              >
                <Images className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </Link>
            {user?.isAdmin && (
              <Link href="/admin">
                <Button
                  variant={pathname === "/admin" ? "default" : "ghost"}
                  size="sm"
                  className={
                    pathname === "/admin"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {credits && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full border border-purple-500/20">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-300">
                {credits.remaining}/{credits.total} credits
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-300">
            <User className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">{user?.email}</span>
          </div>

          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
