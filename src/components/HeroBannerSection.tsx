import { FeaturedBanner } from "./FeaturedBanner";
import { RamCalculator } from "./RamCalculator";

export const HeroBannerSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white italic mb-3">
            Not sure which one to pick?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Use our RAM calculator to find the perfect server package for your needs.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left - RAM Calculator */}
          <RamCalculator />
          
          {/* Right - Featured Banner */}
          <div className="w-full lg:w-auto lg:min-w-[380px]">
            <FeaturedBanner />
          </div>
        </div>
      </div>
    </section>
  );
};
