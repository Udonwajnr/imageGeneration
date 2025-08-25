"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Image Generator</h1>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <a href="#gallery" className="text-gray-300 hover:text-purple-400 transition-colors">
              Examples
            </a>
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
              Features
            </a>
          </nav>

          <Link href="/auth">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold border border-purple-500/50">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
