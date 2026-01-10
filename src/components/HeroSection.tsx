import { ArrowRight, ChevronRight, Gift, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import heroCharacter from "@/assets/hero-character.png";
import { FloatingParticles } from "./FloatingParticles";
import { AnimatedGrid } from "./AnimatedGrid";

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
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatedGrid />
        <FloatingParticles count={20} />
        
        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="opacity-0 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Next-Gen Game Hosting</span>
              </div>
            </div>

            <div className="space-y-5 opacity-0 animate-fade-in animation-delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Your goto host
                <br />
                <span className="gradient-text">with pure performance</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Welcome to your ultimate destination for instantly deployable game servers. 
                Experience fast, secure, and reliable hosting designed to make server 
                management effortless and enjoyable.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 opacity-0 animate-fade-in animation-delay-200">
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<50ms", label: "Latency" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 opacity-0 animate-fade-in animation-delay-300">
              <Link to="/game-servers" className="btn-primary group">
                <Zap className="w-4 h-4" />
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className="btn-outline group">
                <span>Learn More</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Free Server Button */}
            {settings.free_server_enabled === "true" && (
              <div className="opacity-0 animate-fade-in animation-delay-400">
                <a
                  href={settings.free_server_url}
                  className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl glass-card border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-emerald-400">Claim Free Server</p>
                    <p className="text-sm text-muted-foreground">Limited time offer - No credit card required!</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            )}
          </div>

          {/* Right Content - Minecraft Character */}
          <div className="relative flex justify-center lg:justify-end opacity-0 animate-slide-in-right animation-delay-400">
            <div className="relative group">
              {/* Glow behind character */}
              <div className="absolute inset-0 bg-primary/20 blur-[80px] scale-75" />
              
              <img
                src={heroCharacter}
                alt="Minecraft Character"
                className="relative z-10 w-full max-w-lg drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          {[
            {
              title: "Free Game Servers",
              description: "Completely free game servers with no strings attached - just reliable hosting.",
              icon: "🎮"
            },
            {
              title: "Free Web Hosting",
              description: "Direct Admin web hosting for your communities and web needs included.",
              icon: "🌐"
            },
            {
              title: "DDoS Protection",
              description: "Protected behind 4+ TB PATH.Net protection with advanced game filtering.",
              icon: "🛡️"
            },
            {
              title: "Ryzen 9 7950x",
              description: "Top-tier AMD processors delivering blazing fast performance.",
              icon: "⚡"
            },
            {
              title: "Industry Standard",
              description: "Leading systems that premium hosts use, without breaking the bank.",
              icon: "🏆"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl p-5 bg-card/40 backdrop-blur-xl border border-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 opacity-0 animate-fade-in"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="relative z-10">
                <span className="text-2xl mb-3 block">{feature.icon}</span>
                <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
