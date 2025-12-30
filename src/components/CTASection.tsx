import { Check, MessageCircle, Users } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="cta" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Ready to get started with your service?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              So are you ready to get started? Greatness is just a few clicks away!
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
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
            <div className="flex flex-wrap justify-center gap-4">
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
