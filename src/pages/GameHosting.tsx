import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DynamicBackground } from "@/components/DynamicBackground";
import { GameCard } from "@/components/GameCard";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Gamepad2, Star, Shield, Zap, Cloud, Headphones } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import gameHeroDefault from "@/assets/game-hero.png";

interface GameType {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  href: string;
  popular?: boolean;
}

const defaultGames: GameType[] = [
  {
    id: "minecraft",
    name: "Minecraft",
    description: "Host your own Minecraft server with instant modpack installation and full customization.",
    imageUrl: gameHeroDefault,
    href: "/game-servers/minecraft",
    popular: true,
  },
  {
    id: "hytale",
    name: "Hytale",
    description: "Get ready for Hytale with high-performance servers designed for the next-gen adventure.",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60",
    href: "/game-servers/hytale",
  },
  {
    id: "terraria",
    name: "Terraria",
    description: "Explore, build, and battle with friends on reliable Terraria servers with TShock support.",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60",
    href: "/game-servers/terraria",
  },
];

const trustBadges = [
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Instant Setup" },
  { icon: <Cloud className="w-4 h-4 text-primary" />, label: "99.9% Uptime" },
  { icon: <Headphones className="w-4 h-4 text-primary" />, label: "24/7 Support" },
];

export default function GameHosting() {
  const [games, setGames] = useState<GameType[]>(defaultGames);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameImages = async () => {
      // Fetch custom hero images for each game from site_settings
      const keys = ["minecraft_hero_image_url", "hytale_hero_image_url", "terraria_hero_image_url"];
      
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .in("setting_key", keys);

      if (!error && data) {
        const updatedGames = [...defaultGames];
        
        data.forEach((setting) => {
          if (setting.setting_value) {
            if (setting.setting_key === "minecraft_hero_image_url") {
              updatedGames[0].imageUrl = setting.setting_value;
            } else if (setting.setting_key === "hytale_hero_image_url") {
              updatedGames[1].imageUrl = setting.setting_value;
            } else if (setting.setting_key === "terraria_hero_image_url") {
              updatedGames[2].imageUrl = setting.setting_value;
            }
          }
        });
        
        setGames(updatedGames);
      }
      
      setLoading(false);
    };

    fetchGameImages();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <DynamicBackground />
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Game Server Hosting</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
                <span className="text-foreground">CHOOSE YOUR</span>{" "}
                <span className="text-primary">GAME</span>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Select your game and start hosting with KineticHost. All servers come with{" "}
                <span className="text-foreground font-medium">instant setup, DDoS protection, and 24/7 support</span>.
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
        
        {/* Game Selection Grid */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading ? (
              <ThunderLoader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game, index) => (
                  <GameCard
                    key={game.id}
                    name={game.name}
                    description={game.description}
                    imageUrl={game.imageUrl}
                    href={game.href}
                    popular={game.popular}
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
