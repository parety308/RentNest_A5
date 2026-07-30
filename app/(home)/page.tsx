"use server"
import CTASection from "./_component/cta-section";
import FeaturedProperties from "./_component/featured-properties";
import FeaturesSection from "./_component/features-section";
import HeroSection from "./_component/hero-section";
import StatsSection from "./_component/stats-section";

export default async function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedProperties />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
