"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { GalleryPreview } from "@/components/landing/gallery-preview"
import { FeaturesSection } from "@/components/landing/features-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <GalleryPreview />
      <div id="features">
        <FeaturesSection />
      </div>
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
