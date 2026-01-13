import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Zap, Cloud, Headphones, Package, ShieldCheck } from "lucide-react";

interface TrustBadge {
  icon: ReactNode;
  label: string;
}

interface HostingPageLayoutProps {
  children: ReactNode;
  badge: {
    icon: ReactNode;
    label: string;
  };
  title: string;
  titleHighlight: string;
  titleSuffix?: string;
  description: string;
  descriptionHighlight?: string;
  trustBadges?: TrustBadge[];
  heroImage?: string;
}

const defaultTrustBadges: TrustBadge[] = [
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Instant Setup" },
  { icon: <Cloud className="w-4 h-4 text-primary" />, label: "99.9% Uptime" },
  { icon: <Headphones className="w-4 h-4 text-primary" />, label: "24/7 Support" },
  { icon: <Package className="w-4 h-4 text-primary" />, label: "Instant Modpack Installer" },
  { icon: <ShieldCheck className="w-4 h-4 text-primary" />, label: "72hr Refund" },
];

export function HostingPageLayout({
  children,
  badge,
  title,
  titleHighlight,
  titleSuffix = "",
  description,
  descriptionHighlight,
  trustBadges = defaultTrustBadges,
  heroImage,
}: HostingPageLayoutProps) {
  const scrollToPlans = () => {
    const plansSection = document.getElementById("plans-section");
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Hero Section - Shockbyte Style */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="order-2 lg:order-1">
                {/* Trustpilot-style rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-6 h-6 ${i < 4 ? "bg-green-500" : "bg-green-500/50"} flex items-center justify-center`}>
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    4 out of 5 based on <span className="font-semibold text-foreground">1000+</span> reviews
                  </span>
                  <span className="text-sm font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Trustpilot
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight uppercase">
                  {title}
                  <br />
                  <span className="gradient-text">{titleHighlight}</span>
                  {titleSuffix && <> {titleSuffix}</>}
                </h1>

                {/* Description */}
                <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-lg leading-relaxed">
                  {descriptionHighlight ? (
                    <>
                      {description.split(descriptionHighlight)[0]}
                      <span className="font-semibold text-foreground">{descriptionHighlight}</span>
                      {description.split(descriptionHighlight)[1]}
                    </>
                  ) : (
                    description
                  )}
                </p>

                {/* Trust Badges Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-8">
                  {trustBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={scrollToPlans}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 shadow-lg shadow-primary/25"
                >
                  View All Plans
                </Button>
              </div>

              {/* Right - Hero Image */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt="Hero"
                    className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="w-full max-w-md lg:max-w-lg aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                    {badge.icon}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans-section" className="py-16">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
