import { FeaturedBanner } from "./FeaturedBanner";
import { RamCalculator } from "./RamCalculator";

export const HeroBannerSection = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Not sure which one to pick?
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Use our RAM calculator to find the perfect server package for your needs.
          </p>
        </div>

        {/* Two Row Layout - Featured on Top */}
        <div className="flex flex-col gap-6">
          {/* Top - Featured Banner */}
          <FeaturedBanner />
          
          {/* Bottom - RAM Calculator */}
          <RamCalculator />
        </div>
      </div>
    </section>
  );
};
