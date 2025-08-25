"use client"

import { useState, useEffect } from "react"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Digital Artist",
    avatar: "/professional-woman-artist.png",
    content:
      "This AI image generator has revolutionized my creative workflow. The quality is incredible and it saves me hours of work!",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    avatar: "/professional-man-marketing.png",
    content:
      "We use this for all our campaign visuals now. The speed and quality are unmatched. Our engagement rates have increased by 40%!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Content Creator",
    avatar: "/professional-woman-content-creator.png",
    content:
      "As a content creator, I need fresh visuals daily. This tool delivers exactly what I envision, every single time.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Startup Founder",
    avatar: "/startup-founder.png",
    content: "Perfect for our startup's visual needs. Cost-effective and produces professional-grade images instantly.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("testimonials")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 dark-pattern"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of creators who trust our AI to bring their visions to life
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`relative ${isVisible ? "animate-fade-in-up delay-200" : "opacity-0"}`}>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-800 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-200 text-center mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500/50"
                />
                <div className="text-center">
                  <div className="font-semibold text-white text-lg">{testimonials[currentIndex].name}</div>
                  <div className="text-gray-400">{testimonials[currentIndex].role}</div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/80 border-gray-700 hover:bg-gray-800 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-purple-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
