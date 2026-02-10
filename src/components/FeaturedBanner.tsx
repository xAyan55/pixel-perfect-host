import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HardDrive, Cpu, Database, ArrowRight, Server, Sparkles, ChevronRight } from "lucide-react";

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
  const navigate = useNavigate();
  const [popularPlan, setPopularPlan] = useState<Plan | null>(null);
  const [settings, setSettings] = useState<BannerSettings>({
    featured_banner_title: "UPDATE AVAILABLE",
    featured_banner_subtitle: "Mounts of Mayhem",
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
    <div className="flex flex-col gap-4">
      {/* Top Banner - UPDATE AVAILABLE Section with Background Image */}
      <div className="relative group rounded-2xl overflow-hidden min-h-[180px] md:min-h-[200px]">
        {/* Background Image */}
        {bannerImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        )}
        
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-card/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl border border-primary/20 group-hover:border-primary/40 transition-colors duration-300" />
        
        <div className="relative p-6 md:p-8 flex flex-col justify-center h-full min-h-[180px] md:min-h-[200px]">
          {/* Content */}
          <div className="text-left z-10 max-w-[60%]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/30 backdrop-blur-sm border border-primary/40 mb-3 shadow-lg shadow-primary/10">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                {settings.featured_banner_title || "UPDATE AVAILABLE"}
              </span>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground drop-shadow-lg">
              {settings.featured_banner_subtitle || "Mounts of Mayhem"}
            </h3>
          </div>
        </div>
      </div>

      {/* Plan Card */}
      <div className="relative group rounded-xl overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300">
        <div className="p-5 md:p-6">
          {/* Top Row - Plan Name + Price */}
          <div className="flex items-center justify-between gap-4 mb-5">
            {/* Plan Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-foreground text-base md:text-lg">{popularPlan.name}</h4>
                <p className="text-sm text-primary font-medium">{popularPlan.ram} RAM</p>
              </div>
            </div>
            
            {/* Price */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold text-foreground">${popularPlan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 mb-5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{popularPlan.storage} storage</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{popularPlan.cpu} CPU Power</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">{popularPlan.bandwidth}</span>
            </div>
          </div>

          {/* Order Button */}
          <button
            onClick={() => navigate(`/checkout?plan=${popularPlan.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Order Now
          </button>
        </div>
      </div>

      {/* More Server Packages Link */}
      <Link 
        to="/game-servers" 
        className="flex items-center justify-between p-4 rounded-xl bg-card/60 backdrop-blur border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 group"
      >
        <span className="font-semibold text-foreground">More Server Packages</span>
        <div className="flex items-center gap-2">
          {/* Mini icons representing game types */}
          <div className="hidden sm:flex items-center gap-1">
            <div className="w-6 h-6 rounded bg-yellow-500/20 border border-yellow-500/30" />
            <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30" />
          </div>
          <span className="text-sm text-primary font-medium">+20</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </div>
  );
};
