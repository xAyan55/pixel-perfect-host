import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HardDrive, Cpu, Database } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-3">
      {/* Plan Card - WiseHosting Style */}
      <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/95 backdrop-blur-sm overflow-hidden">
        {/* Popular Badge */}
        <div className="w-full py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold tracking-wider text-center">
          FEATURED SERVER
        </div>

        <div className="p-5">
          {/* Plan Header */}
          <div className="flex items-start gap-3 mb-4">
            {popularPlan.image_url ? (
              <img 
                src={popularPlan.image_url} 
                alt={popularPlan.name} 
                className="w-12 h-12 object-contain"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-green-400" />
              </div>
            )}
            <div>
              <h4 className="font-bold text-green-400">{popularPlan.name}</h4>
              <p className="text-lg font-bold text-white">
                {popularPlan.ram} <span className="text-muted-foreground font-normal text-xs">RAM</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {settings.featured_banner_subtitle || "Perfect for your gaming community with reliable performance."}
          </p>

          {/* Specs Box */}
          <div className="rounded-xl bg-slate-800/60 border border-border/30 p-3 mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-foreground">{popularPlan.storage} Storage</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-foreground">{popularPlan.cpu}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="text-foreground">{popularPlan.bandwidth}</span>
            </div>
          </div>

          {/* Price & Button Row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <p className="text-2xl font-bold text-white">
                ${popularPlan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <a
              href={popularPlan.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-lg border border-green-500 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition-all duration-200"
            >
              Buy Now
            </a>
          </div>
        </div>
      </div>

      {/* More Packages Link */}
      <Link 
        to="/game-servers" 
        className="rounded-2xl border border-border/50 bg-slate-900/80 backdrop-blur-sm px-5 py-3 flex items-center justify-between hover:border-cyan-500/30 transition-colors group"
      >
        <span className="font-semibold text-white text-sm">More Server Packages</span>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded bg-yellow-500/80" />
            <div className="w-5 h-5 rounded bg-stone-600/80" />
            <div className="w-5 h-5 rounded bg-green-600/80" />
          </div>
          <span className="text-cyan-400 font-semibold text-sm">+20</span>
        </div>
      </Link>
    </div>
  );
};
