"use client"

import { useState, useEffect } from "react"
import { Check, Zap, Crown, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out our AI image generator",
    icon: Zap,
    features: ["10 images per day", "Standard quality", "Basic templates", "Community support"],
    buttonText: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "Ideal for content creators and professionals",
    icon: Crown,
    features: [
      "500 images per day",
      "High quality & HD resolution",
      "Premium templates",
      "Priority support",
      "Commercial license",
      "Advanced editing tools",
    ],
    buttonText: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "per month",
    description: "For teams and businesses with high volume needs",
    icon: Rocket,
    features: [
      "Unlimited images",
      "Ultra HD quality",
      "Custom templates",
      "24/7 dedicated support",
      "Team collaboration",
      "API access",
      "Custom integrations",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
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

    const section = document.getElementById("pricing")
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="pricing" className="py-20 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 dark-pattern"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our core AI generation features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <div
                key={plan.name}
                className={`relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? "border-purple-500 shadow-2xl shadow-purple-500/20"
                    : "border-gray-800 hover:border-gray-700"
                } ${isVisible ? `animate-fade-in-up delay-${index * 100 + 200}` : "opacity-0"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      plan.popular ? "bg-purple-600" : "bg-gray-800"
                    }`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth" className="block">
                  <Button
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
                        : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
