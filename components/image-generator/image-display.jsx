"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageDisplay({ image, onRegenerate, loading }) {
  const [imageLoading, setImageLoading] = useState(true)
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch image")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-image-${image.id || Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: "Your image is being downloaded.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
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

  const handleRegenerate = () => {
    onRegenerate({
      prompt: image.prompt,
      negativePrompt: image.negativePrompt,
      width: image.width,
      height: image.height,
      model: image.model,
    })
  }

  if (!image) {
    return (
      <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center text-gray-400">
            <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-gray-800/50 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded"></div>
            </div>
            <p>Your generated image will appear here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-800/50 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.prompt}
            className="w-full rounded-lg shadow-lg"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </div>

        <div className="mt-4 space-y-3">
          <div className="text-sm text-gray-400">
            <p className="font-medium text-gray-300">Prompt:</p>
            <p>{image.prompt}</p>
            {image.negativePrompt && (
              <>
                <p className="font-medium text-gray-300 mt-2">Negative Prompt:</p>
                <p>{image.negativePrompt}</p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
