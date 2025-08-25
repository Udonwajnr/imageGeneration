"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 dark-pattern"></div>

      <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl float-animation"></div>
      <div
        className="absolute bottom-32 right-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-xl float-animation"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl float-animation"
        style={{ animationDelay: "4s" }}
      ></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Create Stunning AI Images in <span className="text-purple-400">Seconds</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into breathtaking visuals with our cutting-edge AI image generator. No design skills
            required – just describe what you want to see.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border border-purple-500/50"
              >
                Generate Your First Image
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link href="#gallery">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent hover:border-gray-500"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                View Examples
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>10,000+ Images Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Fast Generation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>High Quality Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
