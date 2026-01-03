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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
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
    </div>
  );
};

export default Index;
