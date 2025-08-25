"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Header } from "@/components/header"
import { ImageGrid } from "@/components/image-gallery/image-grid"
import { useAuth } from "@/contexts/auth-context"

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchImages()
    }
  }, [user])

  const fetchImages = async () => {
  try {
    const response = await fetch(`/api/images/${user.id}`)
    if (response.ok) {
      const data = await response.json()
      if (Array.isArray(data.images)) {
        console.log(
          "[v0] Fetched images:",
          data.images.map((img) => ({
            id: img.id,
            imageUrlLength: img.imageUrl?.length,
            imageUrlStart: img.imageUrl?.substring(0, 50),
            isDataUrl: img.imageUrl?.startsWith("data:"),
          }))
        )
        setImages(data.images) // ✅ FIX: use data.images
      } else {
        console.error("[v0] API returned invalid data:", data)
        setImages([])
      }
    } else {
      const errorData = await response.text()
      console.error("[v0] API error response:", response.status, errorData)
      setImages([])
    }
  } catch (error) {
    console.error("Failed to fetch images:", error)
    setImages([])
  } finally {
    setLoading(false)
  }
}


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

        <Header />

        <main className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Your Gallery
            </h1>
            <p className="text-gray-400">{loading ? "Loading..." : `${images.length} images generated`}</p>
          </div>

          <ImageGrid images={images} loading={loading} />
        </main>
      </div>
    </ProtectedRoute>
  )
}
