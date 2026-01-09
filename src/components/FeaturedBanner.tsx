import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HardDrive, Cpu, Database, ArrowRight, Server } from "lucide-react";

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
    <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-card/80 via-card/60 to-primary/5 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-6 p-5">
        {/* Left - Image */}
        <div className="flex-shrink-0">
          {bannerImage ? (
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <img 
                src={bannerImage} 
                alt={popularPlan.name} 
                className="relative w-24 h-24 md:w-28 md:h-28 object-contain"
              />
            </div>
          ) : (
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-primary/10 flex items-center justify-center">
              <Server className="w-12 h-12 text-primary" />
            </div>
          )}
        </div>

        {/* Center - Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider mb-2">
            {settings.featured_banner_title || "FEATURED SERVER"}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
            {popularPlan.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 max-w-md">
            {settings.featured_banner_subtitle || "Perfect for your gaming community with reliable performance."}
          </p>
          
          {/* Specs Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>{popularPlan.ram}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>{popularPlan.cpu}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-primary" />
              <span>{popularPlan.storage}</span>
            </div>
          </div>
        </div>

        {/* Right - Price & CTA */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Starting at</p>
            <p className="text-2xl font-bold text-foreground">
              ${popularPlan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>
          </div>
          <a
            href={popularPlan.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200"
          >
            Order Now
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link 
            to="/game-servers" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View all packages →
          </Link>
        </div>
      </div>
    </div>
  );
};
