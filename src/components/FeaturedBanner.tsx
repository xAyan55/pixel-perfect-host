import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HardDrive, Cpu, Database, ArrowRight, Server, Sparkles, Zap } from "lucide-react";

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
    featured_banner_title: "FEATURED SERVER",
    featured_banner_subtitle: "Perfect for your gaming community with reliable performance.",
    featured_banner_image_url: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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

  const bannerImage = settings.featured_banner_image_url || popularPlan.image_url;

  return (
    <div className="relative group rounded-2xl overflow-hidden">
      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-purple-500 rounded-2xl opacity-30 group-hover:opacity-50 blur-sm transition-opacity duration-500" />
      
      {/* Main card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-card/90 via-card/80 to-primary/5 backdrop-blur-xl border border-white/[0.05] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          {/* Left - Image */}
          <div className="flex-shrink-0">
            {bannerImage ? (
              <div className="relative group/image">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/20 blur-2xl rounded-full scale-110 group-hover/image:scale-125 transition-transform duration-500" />
                <img 
                  src={bannerImage} 
                  alt={popularPlan.name} 
                  className="relative w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center">
                  <Server className="w-14 h-14 text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Center - Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-bounce-subtle" />
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                {settings.featured_banner_title || "FEATURED SERVER"}
              </span>
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {popularPlan.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md leading-relaxed">
              {settings.featured_banner_subtitle || "Perfect for your gaming community with reliable performance."}
            </p>
            
            {/* Specs Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {[
                { icon: Database, value: popularPlan.ram },
                { icon: Cpu, value: popularPlan.cpu },
                { icon: HardDrive, value: popularPlan.storage },
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <spec.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Price & CTA */}
          <div className="flex flex-col items-center gap-4 min-w-[160px]">
            <div className="text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Starting at</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold gradient-text">${popularPlan.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </div>
            
            <a
              href={popularPlan.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-[0_0_25px_hsl(217_91%_60%/0.4)] hover:shadow-[0_0_35px_hsl(217_91%_60%/0.6)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4" />
              Order Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </a>
            
            <Link 
              to="/game-servers" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
            >
              View all packages
              <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
