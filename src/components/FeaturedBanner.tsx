import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, HardDrive, Cpu, Wifi, ArrowRight } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  ram: string;
  storage: string;
  cpu: string;
  bandwidth: string;
  redirect_url: string;
  image_url?: string;
}

interface BannerSettings {
  featured_banner_title: string;
  featured_banner_subtitle: string;
  featured_banner_image_url: string;
}

export const FeaturedBanner = () => {
  const [popularPlan, setPopularPlan] = useState<Plan | null>(null);
  const [settings, setSettings] = useState<BannerSettings>({
    featured_banner_title: "UPDATE AVAILABLE",
    featured_banner_subtitle: "Featured Server",
    featured_banner_image_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch popular plan
      const { data: planData } = await supabase
        .from("hosting_plans")
        .select("*")
        .eq("popular", true)
        .eq("enabled", true)
        .limit(1)
        .single();

      if (planData) {
        setPopularPlan(planData);
      }

      // Fetch banner settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*");

      if (settingsData) {
        const settingsMap: Record<string, string> = {};
        settingsData.forEach((item: { setting_key: string; setting_value: string | null }) => {
          settingsMap[item.setting_key] = item.setting_value || "";
        });
        setSettings((prev) => ({ ...prev, ...settingsMap }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !popularPlan) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden group">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 bg-[length:200%_200%] animate-gradient-shift" />
          
          {/* Floating orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl animate-float-slow" />
          
          <div className="relative p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            {/* Left - Banner Image */}
            <div className="relative flex justify-center">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] animate-pulse-glow" />
              
              {settings.featured_banner_image_url ? (
                <img 
                  src={settings.featured_banner_image_url} 
                  alt="Featured" 
                  className="max-h-64 object-contain relative z-10 animate-float drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform duration-500 hover:scale-105"
                />
              ) : popularPlan.image_url ? (
                <img 
                  src={popularPlan.image_url} 
                  alt={popularPlan.name} 
                  className="max-h-64 object-contain relative z-10 animate-float drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-48 h-48 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-glow relative z-10">
                  <Sparkles className="w-16 h-16 text-primary animate-bounce-soft" />
                </div>
              )}
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 animate-glow-pulse">
                <Sparkles className="w-4 h-4 text-primary animate-wiggle" />
                <span className="text-sm font-medium text-primary">{settings.featured_banner_title}</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold">{settings.featured_banner_subtitle}</h2>

              {/* Plan Card */}
              <div className="rounded-xl border border-border/50 bg-background/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {popularPlan.image_url ? (
                      <img src={popularPlan.image_url} alt={popularPlan.name} className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <HardDrive className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{popularPlan.name}</h3>
                      <p className="text-sm text-primary">{popularPlan.ram} RAM</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${popularPlan.price}</p>
                    <p className="text-sm text-muted-foreground">/month</p>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-primary" />
                    {popularPlan.storage} storage
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-primary" />
                    {popularPlan.cpu}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-primary" />
                    {popularPlan.bandwidth}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={popularPlan.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary justify-center group"
                >
                  Order Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* More Packages Link */}
              <Link 
                to="/game-servers" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                More Server Packages
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
