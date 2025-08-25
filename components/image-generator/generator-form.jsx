"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export function GeneratorForm({ onImageGenerated, loading, setLoading }) {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [width, setWidth] = useState("1024")
  const [height, setHeight] = useState("1024")
  const [model, setModel] = useState("flash")
  const { user } = useAuth()
  const { toast } = useToast()

  console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await axios.post("/api/generate", {
        prompt: prompt.trim(),
        negativePrompt: negativePrompt.trim() || undefined,
        width: Number.parseInt(width),
        height: Number.parseInt(height),
        model,
        userId: user.id,
      })

      onImageGenerated(response.data)

      console.log(response)
      toast({
        title: "Image generated!",
        description: "Your AI image has been created successfully.",
      })
    } catch (error) {
      console.error("Generation error:", error)

      // Axios error handling
      let message = "Generation failed"
      if (error.response) {
        // Server responded with a status code outside 2xx
        message = error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response
        message = "No response from server"
      } else {
        // Something else happened
        message = error.message
      }

      toast({
        title: "Generation failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Generate AI Image
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-gray-300">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="negativePrompt" className="text-gray-300">
              Negative Prompt (Optional)
            </Label>
            <Textarea
              id="negativePrompt"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What you don't want in the image..."
              className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-gray-300">
                Width
              </Label>
              <Select value={width} onValueChange={setWidth}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="768">768px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1280">1280px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-gray-300">
                Height
              </Label>
              <Select value={height} onValueChange={setHeight}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="512">512px</SelectItem>
                  <SelectItem value="768">768px</SelectItem>
                  <SelectItem value="1024">1024px</SelectItem>
                  <SelectItem value="1280">1280px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-300">
              Model
            </Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white focus:border-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="flash">Flash (Fast)</SelectItem>
                <SelectItem value="pro">Pro (High Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </div>
            ) : (
              "Generate Image"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
