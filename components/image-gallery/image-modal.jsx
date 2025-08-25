"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ImageModal({ image, onClose }) {
  const { toast } = useToast()

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900/95 border-purple-500/20 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Generated Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <img
              src={image.imageUrl || "/placeholder.svg"}
              alt={image.prompt}
              className="w-full rounded-lg shadow-lg max-h-[60vh] object-contain mx-auto"
            />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-gray-300 mb-1">Prompt:</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{image.prompt}</p>
            </div>

            {image.negativePrompt && (
              <div>
                <h4 className="font-medium text-gray-300 mb-1">Negative Prompt:</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{image.negativePrompt}</p>
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

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
