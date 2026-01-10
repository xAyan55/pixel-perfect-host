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
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 mesh-gradient opacity-60" />
        
        {/* Animated Grid */}
        <AnimatedGrid />
        
        {/* Floating Particles */}
        <FloatingParticles count={30} />
        
        {/* Ambient glow orbs - enhanced */}
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-glow-breathe" />
        <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px] animate-glow-breathe animation-delay-200" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-[100px] animate-glow-breathe animation-delay-400" />
        
        {/* Rotating decorative rings */}
        <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] border border-primary/5 rounded-full animate-rotate-slow opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] border border-accent/5 rounded-full animate-rotate-slow opacity-25" style={{ animationDirection: 'reverse', animationDuration: '35s' }} />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] border border-purple-500/5 rounded-full animate-rotate-slow opacity-20" style={{ animationDuration: '45s' }} />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary animate-bounce-subtle" />
                <span className="text-sm font-medium text-primary">Next-Gen Game Hosting</span>
              </div>
            </div>

            <div className="space-y-5 animate-slide-up animation-delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Your goto host
                <br />
                <span className="gradient-text-shine">with pure performance</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Welcome to your ultimate destination for instantly deployable game servers. 
                Experience fast, secure, and reliable hosting designed to make server 
                management effortless and enjoyable.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 animate-slide-up animation-delay-200">
              {[
                { value: "99.9%", label: "Uptime" },
                { value: "<50ms", label: "Latency" },
                { value: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 animate-slide-up animation-delay-300">
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
              <div className="animate-slide-up animation-delay-400">
                <a
                  href={settings.free_server_url}
                  className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl glass-card-glow border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-500 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md animate-pulse-ring" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Gift className="w-6 h-6 text-white" />
                    </div>
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
          <div className="relative flex justify-center lg:justify-end animate-slide-up animation-delay-500">
            <div className="relative group">
              {/* Enhanced animated rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[110%] h-[110%] border-2 border-primary/20 rounded-full animate-pulse-ring" style={{ animationDuration: '3s' }} />
                <div className="absolute w-[130%] h-[130%] border border-accent/15 rounded-full animate-pulse-ring" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
                <div className="absolute w-[150%] h-[150%] border border-purple-500/10 rounded-full animate-pulse-ring" style={{ animationDelay: '1s', animationDuration: '3s' }} />
              </div>
              
              {/* Glow behind character */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/15 to-purple-500/10 blur-[100px] scale-75 animate-glow-breathe" />
              
              {/* Floating sparkles */}
              <div className="absolute -top-6 right-1/4 w-3 h-3 bg-primary rounded-full animate-bounce-subtle shadow-[0_0_10px_hsl(217_91%_60%)]" />
              <div className="absolute top-1/4 -right-6 w-4 h-4 bg-accent rounded-full animate-bounce-subtle shadow-[0_0_15px_hsl(190_90%_50%)]" style={{ animationDelay: '0.3s' }} />
              <div className="absolute bottom-1/3 -left-8 w-3 h-3 bg-purple-400 rounded-full animate-bounce-subtle shadow-[0_0_10px_hsl(280_80%_60%)]" style={{ animationDelay: '0.6s' }} />
              <div className="absolute top-1/2 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-bounce-subtle shadow-[0_0_8px_hsl(145_80%_50%)]" style={{ animationDelay: '0.9s' }} />
              
              <img
                src={heroCharacter}
                alt="Minecraft Character"
                className="relative z-10 w-full max-w-lg drop-shadow-[0_0_60px_rgba(59,130,246,0.25)] transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_80px_rgba(59,130,246,0.35)]"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards - Enhanced */}
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
              className="group relative overflow-hidden rounded-2xl p-5 bg-card/30 backdrop-blur-xl border border-white/[0.05] transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 animate-slide-up"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              
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
