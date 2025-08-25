"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ImageModal } from "./image-modal"

export function ImageGrid({ images, loading }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const { toast } = useToast()

  const handleDownload = async (image, e) => {
    e.stopPropagation()
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
        description: "Your image is being downloaded.",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download the image.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async (image, e) => {
    e.stopPropagation()
    const shareUrl = `${window.location.origin}/share/${image.shareableId}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: "Link copied!",
        description: "Shareable link has been copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to copy share link.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="aspect-square bg-gray-800/50 rounded-lg animate-pulse mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-800/50 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-800/50 rounded w-2/3 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-800/50 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No images yet</h3>
        <p className="text-gray-500">Start generating some amazing AI images!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card
            key={image.id}
            className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm hover:border-purple-400/40 transition-all duration-200 cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <CardContent className="p-4">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                <img
                  src={image.imageUrl || "/placeholder.svg"}
                  alt={image.prompt}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">{image.prompt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(image.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize">{image.model}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  onClick={(e) => handleDownload(image, e)}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white h-8"
                >
                  <Download className="w-3 h-3" />
                </Button>
                <Button
                  onClick={(e) => handleShare(image, e)}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white h-8"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  )
}
