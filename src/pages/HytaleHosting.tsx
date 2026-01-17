import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DynamicBackground } from "@/components/DynamicBackground";
import { GameSubtypeCard } from "@/components/GameSubtypeCard";
import { ThunderLoader } from "@/components/ThunderLoader";
import { SEOHead } from "@/components/SEOHead";
import { Gamepad2, Star, Shield, Zap, Cloud, Headphones, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface SubtypeOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  href: string;
  popular?: boolean;
  settingKey: string;
}

const defaultSubtypes: SubtypeOption[] = [
  {
    id: "budget",
    name: "Budget",
    description: "Affordable hosting perfect for small groups and casual play.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
    href: "/game-servers/hytale/budget",
    settingKey: "hytale_budget_card_image_url",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Maximum performance with priority support and premium hardware.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
    href: "/game-servers/hytale/premium",
    popular: true,
    settingKey: "hytale_premium_card_image_url",
  },
];

const trustBadges = [
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Instant Setup" },
  { icon: <Cloud className="w-4 h-4 text-primary" />, label: "99.9% Uptime" },
  { icon: <Headphones className="w-4 h-4 text-primary" />, label: "24/7 Support" },
];

export default function HytaleHosting() {
  const [subtypes, setSubtypes] = useState<SubtypeOption[]>(defaultSubtypes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const keys = [
        "hytale_budget_card_image_url",
        "hytale_premium_card_image_url",
        "hytale_hero_image_url",
      ];
      
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("setting_key", keys);

      if (!error && data) {
        const heroImage = data.find(s => s.setting_key === "hytale_hero_image_url")?.setting_value;
        
        setSubtypes(prev => prev.map(s => {
          const cardImage = data.find(d => d.setting_key === s.settingKey)?.setting_value;
          return {
            ...s,
            imageUrl: cardImage || heroImage || s.imageUrl,
          };
        }));
      }
      
      setLoading(false);
    };

    fetchImages();
  }, []);

  const seoJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Hytale Server Hosting",
    "description": "Premium Hytale server hosting with budget and premium tier options",
    "brand": { "@type": "Brand", "name": "KineticHost" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEOHead
        title="Hytale Server Hosting | Budget & Premium Plans - KineticHost"
        description="Get ready for Hytale with KineticHost. Choose between budget-friendly or premium performance servers with instant setup and 24/7 support."
        keywords="hytale server hosting, hytale game server, hytale hosting, hytale premium server"
        canonical="https://kinetichost.com/game-servers/hytale"
        jsonLd={seoJsonLd}
      />
      <DynamicBackground />
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Back Button */}
            <Link to="/game-servers" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Games</span>
            </Link>
            
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Hytale Server Hosting</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-foreground">CHOOSE YOUR</span>{" "}
                <span className="text-primary">PLAN TYPE</span>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Select your hosting tier and get ready for Hytale with KineticHost. Choose between{" "}
                <span className="text-foreground font-medium">budget-friendly or premium performance</span>.
              </p>
              
              {/* Trustpilot Rating */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-sm text-muted-foreground">Rated</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">4.9/5</span>
                <span className="text-sm text-muted-foreground">on Trustpilot</span>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {trustBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-card/50 border-border/50 text-muted-foreground px-3 py-1.5"
                  >
                    {badge.icon}
                    <span className="ml-2">{badge.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Subtype Selection Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            {loading ? (
              <ThunderLoader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subtypes.map((subtype, index) => (
                  <GameSubtypeCard
                    key={subtype.id}
                    name={subtype.name}
                    description={subtype.description}
                    imageUrl={subtype.imageUrl}
                    href={subtype.href}
                    popular={subtype.popular}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
