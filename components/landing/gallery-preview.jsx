"use client"

import { Card } from "@/components/ui/card"

export function GalleryPreview() {
  const sampleImages = [
    {
      id: 1,
      url: "/futuristic-cityscape-sunset.png",
      prompt: "Futuristic cityscape at sunset with neon lights",
    },
    {
      id: 2,
      url: "/magical-forest-with-glowing-mushrooms-and-fairy-li.png",
      prompt: "Magical forest with glowing mushrooms",
    },
    {
      id: 3,
      url: "/abstract-digital-art-with-flowing-colors-and-geome.png",
      prompt: "Abstract digital art with flowing colors",
    },
    {
      id: 4,
      url: "/steampunk-robot-in-victorian-setting-with-brass-ge.png",
      prompt: "Steampunk robot in Victorian setting",
    },
    {
      id: 5,
      url: "/underwater-scene-with-bioluminescent-creatures-and.png",
      prompt: "Underwater scene with bioluminescent creatures",
    },
    {
      id: 6,
      url: "/space-station-orbiting-alien-planet-with-multiple-.png",
      prompt: "Space station orbiting alien planet",
    },
  ]

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            See What's Possible
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore stunning AI-generated images created by our community. Each image started with just a simple text
            description.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleImages.map((image, index) => (
            <Card
              key={image.id}
              className="group overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.prompt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white text-sm font-medium">{image.prompt}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
