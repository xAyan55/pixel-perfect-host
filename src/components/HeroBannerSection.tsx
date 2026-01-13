import { FeaturedBanner } from "./FeaturedBanner";
import { RamCalculator } from "./RamCalculator";

export const HeroBannerSection = () => {
  return (
    <section className="py-8 md:py-12 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Not sure which one to pick?
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
            Use our RAM calculator to find the perfect server package for your needs.
          </p>
        </div>

        {/* Two Column Layout on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured Banner */}
          <FeaturedBanner />
          
          {/* RAM Calculator */}
          <RamCalculator />
        </div>
      </div>
    </section>
  );
};
