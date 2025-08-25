"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SharePage({ params }) {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSharedImage()
  }, [])

  const fetchSharedImage = async () => {
    try {
      const response = await fetch(`/api/share/${params.shareableId}`)
      if (response.ok) {
        const data = await response.json()
        setImage(data)
      } else {
        toast({
          title: "Image not found",
          description: "This shared image could not be found.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load shared image.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-image-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: "The image is being downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading shared image...</p>
        </div>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-300 mb-4">Image Not Found</h1>
          <p className="text-gray-500 mb-6">This shared image could not be found or may have been removed.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button
                variant="outline"
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="bg-gray-900/50 border border-purple-500/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Shared AI Image
              </h1>
              <p className="text-gray-400">Generated with AI Image Generator</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.prompt}
                  className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-300 mb-2">Prompt:</h3>
                  <p className="text-gray-400 leading-relaxed">{image.prompt}</p>
                </div>

                {image.negativePrompt && (
                  <div>
                    <h3 className="font-medium text-gray-300 mb-2">Negative Prompt:</h3>
                    <p className="text-gray-400 leading-relaxed">{image.negativePrompt}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dimensions:</span>
                    <p className="text-gray-300">
                      {image.width} × {image.height}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Model:</span>
                    <p className="text-gray-300 capitalize">{image.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Created:</span>
                    <p className="text-gray-300">{new Date(image.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <p className="text-gray-300">{new Date(image.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center pt-4 border-t border-gray-700">
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Image
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  >
                    Create Your Own
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
