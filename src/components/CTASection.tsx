import { Check, MessageCircle, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FloatingParticles } from "./FloatingParticles";

export const CTASection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section id="cta" className="py-24 relative overflow-hidden" ref={ref}>
      {/* Section floating particles */}
      <FloatingParticles count={10} />
      
      <div className="container mx-auto px-6">
        <div className={`glass-card p-12 md:p-16 text-center relative overflow-hidden scroll-animate-scale ${isVisible ? "visible" : ""}`}>
          {/* Background glow with animation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[60px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
          
          <div className="relative z-10">
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 scroll-animate ${isVisible ? "visible" : ""}`}>
              Ready to get started with your service?
            </h2>
            <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto scroll-animate stagger-1 ${isVisible ? "visible" : ""}`}>
              So are you ready to get started? Greatness is just a few clicks away!
            </p>

            {/* Benefits */}
            <div className={`flex flex-wrap justify-center gap-6 mb-10 scroll-animate stagger-2 ${isVisible ? "visible" : ""}`}>
              {[
                "3-Day money back Guarantee",
                "Instant setup",
                "24/7 Support"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap justify-center gap-4 scroll-animate stagger-3 ${isVisible ? "visible" : ""}`}>
              <a href="#" className="btn-outline group">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </a>
              <a href="#" className="btn-primary group">
                <Users className="w-4 h-4" />
                Join Our Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
