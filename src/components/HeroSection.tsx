import { ArrowRight, ChevronRight, Gift, Sparkles, Zap, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroCharacter from "@/assets/hero-character.png";
import { FloatingParticles } from "./FloatingParticles";

interface SiteSettings {
  free_server_url: string;
  free_server_enabled: string;
  logo_url: string;
  panel_preview_url: string;
}

export const HeroSection = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    free_server_url: "#",
    free_server_enabled: "true",
    logo_url: "",
    panel_preview_url: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item: { setting_key: string; setting_value: string }) => {
          settingsMap[item.setting_key] = item.setting_value || "";
        });
        setSettings((prev) => ({ ...prev, ...settingsMap }));
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative min-h-screen pt-20 md:pt-24 pb-24 md:pb-16 overflow-hidden">
      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingParticles count={15} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse-soft" />
                <span className="text-sm font-medium text-primary">Next-Gen Game Hosting</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-5 opacity-0 animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Your goto host
                <br />
                <span className="gradient-text animate-gradient-shift">with pure performance</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to your ultimate destination for instantly deployable game servers. 
                Experience fast, secure, and reliable hosting.
              </p>
            </div>

            {/* Stats row - horizontal scroll on mobile */}
            <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-center lg:justify-start gap-6 md:gap-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { value: "99.9%", label: "Uptime", color: "text-emerald-400" },
                  { value: "<50ms", label: "Latency", color: "text-primary" },
                  { value: "24/7", label: "Support", color: "text-accent" },
                ].map((stat, i) => (
                  <div key={i} className="flex-shrink-0 text-center group">
                    <p className={`text-2xl md:text-3xl font-bold ${stat.color} transition-transform group-hover:scale-110`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start opacity-0 animate-slide-in-bottom" style={{ animationDelay: '400ms' }}>
              <Link to="/game-servers" className="btn-primary group w-full sm:w-auto justify-center">
                <Zap className="w-4 h-4" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className="btn-outline group w-full sm:w-auto justify-center">
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Free Server Button */}
            {settings.free_server_enabled === "true" && (
              <div className="opacity-0 animate-slide-in-bottom" style={{ animationDelay: '500ms' }}>
                <a
                  href={settings.free_server_url}
                  className="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl glass-card-enhanced border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 group w-full sm:w-auto"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse-soft">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-emerald-400 text-sm sm:text-base">Claim Free Server</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Limited time - No credit card!</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            )}
          </div>

          {/* Right Content - Minecraft Character */}
          <div className="relative flex justify-center order-1 lg:order-2 opacity-0 animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
            <div className="relative group">
              {/* Animated glow rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/20 animate-pulse-soft" />
                <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-primary/10 animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
              </div>
              
              {/* Glow behind character */}
              <div className="absolute inset-0 bg-primary/20 blur-[100px] scale-75 animate-pulse-soft" />
              
              <img
                src={heroCharacter}
                alt="Minecraft Character"
                className="relative z-10 w-48 sm:w-64 md:w-80 lg:w-full max-w-lg drop-shadow-2xl transition-all duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards - Improved mobile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-8 md:mt-12">
          {[
            { title: "Free Game Servers", description: "Completely free game servers with no strings attached.", icon: "🎮" },
            { title: "Free Web Hosting", description: "Direct Admin web hosting for your communities.", icon: "🌐" },
            { title: "DDoS Protection", description: "4+ TB PATH.Net protection with game filtering.", icon: "🛡️" },
            { title: "Ryzen 9 7950x", description: "Top-tier AMD processors for blazing speed.", icon: "⚡" },
            { title: "Industry Standard", description: "Premium systems without the premium price.", icon: "🏆" }
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-5 glass-card-enhanced transition-all duration-500 hover:-translate-y-1 opacity-0 animate-slide-in-bottom"
              style={{ animationDelay: `${600 + index * 80}ms` }}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <span className="text-xl md:text-2xl mb-2 md:mb-3 block group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </span>
                <h3 className="text-sm md:text-base font-semibold mb-1 md:mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
