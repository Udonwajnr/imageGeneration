"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "How does the AI image generator work?",
    answer:
      "Our AI uses advanced machine learning models trained on millions of images to understand and create visuals from text descriptions. Simply describe what you want to see, and our AI will generate a unique image based on your prompt.",
  },
  {
    question: "What image formats and resolutions are supported?",
    answer:
      "We support multiple formats including PNG, JPEG, and WebP. Resolution options range from 512x512 for quick previews up to 2048x2048 for high-quality prints, depending on your subscription plan.",
  },
  {
    question: "Can I use the generated images commercially?",
    answer:
      "Yes! With our Pro and Enterprise plans, you get full commercial rights to use the generated images in your projects, marketing materials, and products. Free plan images are for personal use only.",
  },
  {
    question: "How long does it take to generate an image?",
    answer:
      "Most images are generated within 10-30 seconds, depending on complexity and current server load. Our Pro users get priority processing for even faster generation times.",
  },
  {
    question: "What if I'm not satisfied with the generated image?",
    answer:
      "You can regenerate images as many times as you want within your daily limits. Try adjusting your prompt, adding more details, or using negative prompts to get better results. Our AI learns from each generation.",
  },
  {
    question: "Is there an API available for developers?",
    answer:
      "Yes! Our Enterprise plan includes full API access, allowing you to integrate our AI image generation directly into your applications and workflows. Contact our sales team for API documentation and pricing.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
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

    const section = document.getElementById("faq")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 dark-pattern"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our AI image generator
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 ${isVisible ? `animate-fade-in-up delay-${index * 100 + 200}` : "opacity-0"}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 text-left hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>

                {openIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
