"use client"

import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { GalleryPreview } from "@/components/landing/gallery-preview"
import { FeaturesSection } from "@/components/landing/features-section"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <GalleryPreview />
      <div id="features">
        <FeaturesSection />
      </div>
    </div>
  )
}
