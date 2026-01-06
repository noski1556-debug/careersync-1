import { AIMentorChat } from "@/components/AIMentorChat";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { PricingPreviewSection } from "@/components/landing/PricingPreviewSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <PricingPreviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <AIMentorChat />
    </div>
  );
}