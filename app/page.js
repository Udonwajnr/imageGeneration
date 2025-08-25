"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { GeneratorForm } from "@/components/image-generator/generator-form"
import { ImageDisplay } from "@/components/image-generator/image-display"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/landing")
    }
  }, [user, authLoading, router])

  const handleImageGenerated = (image) => {
    setCurrentImage(image)
  }

  const handleRegenerate = (formData) => {
    console.log("Regenerating with:", formData)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <GeneratorForm onImageGenerated={handleImageGenerated} loading={loading} setLoading={setLoading} />
            </div>

            <div>
              <ImageDisplay image={currentImage} onRegenerate={handleRegenerate} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
