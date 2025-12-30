import { ArrowRight, ChevronRight, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroCharacter from "@/assets/hero-character.png";

interface SiteSettings {
  get_started_url: string;
  free_server_url: string;
  free_server_enabled: string;
  logo_url: string;
  panel_preview_url: string;
}

export const HeroSection = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    get_started_url: "#solutions",
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
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4 opacity-0 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Your goto host
                <br />
                <span className="gradient-text">with pure performance</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Welcome to your ultimate destination for instantly deployable game servers. 
                Experience fast, secure, and reliable hosting designed to make server 
                management effortless and enjoyable.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 opacity-0 animate-fade-in animation-delay-200">
              <a href={settings.get_started_url} className="btn-primary group">
                Let's Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#about" className="btn-secondary group">
                About Us
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Free Server Button */}
            {settings.free_server_enabled === "true" && (
              <div className="opacity-0 animate-fade-in animation-delay-400">
                <a
                  href={settings.free_server_url}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-primary/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-400">Claim Free Server</p>
                    <p className="text-xs text-muted-foreground">Limited time offer!</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            )}
          </div>

          {/* Right Content - Minecraft Character */}
          <div className="relative flex justify-center lg:justify-end opacity-0 animate-slide-in-right animation-delay-400">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-primary/20 blur-[100px] scale-75" />
              <img
                src={heroCharacter}
                alt="Minecraft Character"
                className="relative z-10 w-full max-w-lg animate-float"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-8 opacity-0 animate-fade-in-up animation-delay-600">
          {[
            {
              title: "Free Game Servers",
              description: "Sano's Game Servers provides completely free game servers with no strings attached--just reliable hosting."
            },
            {
              title: "Free Included Web Hosting",
              description: "We provide Direct Admin web hosting for your communities and web needs with industry leading services"
            },
            {
              title: "DDoS Protection",
              description: "All of our servers are protected behind 4+ TB PATH.Net protection with game filtering."
            },
            {
              title: "Ryzen 7950x Processors",
              description: "Sano's Game Servers run at extremely fast processing speeds with top of the line hardware."
            },
            {
              title: "Industry Standard Systems",
              description: "Sano's runs with the leading systems that many other PAID hosts use, without breaking the bank."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
