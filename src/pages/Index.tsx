import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FAQSection } from "@/components/FAQSection";
import { HeroBannerSection } from "@/components/HeroBannerSection";
import { TrustpilotSection } from "@/components/TrustpilotSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { AdminButton } from "@/components/AdminButton";
import { DynamicBackground } from "@/components/DynamicBackground";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Dynamic animated background */}
      <DynamicBackground />
      
      <Navbar />
      <main className="relative z-10 pb-20 md:pb-0">
        <HeroSection />
        <FAQSection />
        <HeroBannerSection />
        <TrustpilotSection />
        <FeaturesSection />
        <SolutionsSection />
        <CTASection />
      </main>
      <Footer />
      <AdminButton />
      
      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Index;
