"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Palette, Download, Share2, Sparkles, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Fast AI Generation",
      description:
        "Generate high-quality images in seconds with our optimized AI models. No waiting around – see your ideas come to life instantly.",
    },
    {
      icon: Palette,
      title: "Neon-Themed Modern UI",
      description:
        "Experience a sleek, futuristic interface designed for creators. Dark themes, neon accents, and smooth animations enhance your workflow.",
    },
    {
      icon: Download,
      title: "Download & Share Instantly",
      description:
        "Download your creations in high resolution or share them with unique links. Your art, your way, ready to use anywhere.",
    },
    {
      icon: Sparkles,
      title: "Multiple AI Models",
      description:
        "Choose between Flash for speed or Pro for maximum quality. Different models for different needs, all at your fingertips.",
    },
    {
      icon: Share2,
      title: "Gallery & History",
      description:
        "Keep track of all your creations in a beautiful gallery. Revisit, download, or regenerate any image from your history.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your creations are yours alone. We prioritize privacy and security, ensuring your artistic journey remains protected.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Powerful Features for Creators
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to bring your imagination to life with AI-powered image generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card
                key={index}
                className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-center">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
