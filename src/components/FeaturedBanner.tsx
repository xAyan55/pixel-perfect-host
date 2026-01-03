import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, HardDrive, Cpu, Database, ArrowRight } from "lucide-react";

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
          {/* Top Card - Update Available */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm p-5 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
            
            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-2">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400 tracking-wide uppercase">
                    {settings.featured_banner_title}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-white">
                  {settings.featured_banner_subtitle}
                </h3>
              </div>
              
              {/* Banner Image */}
              {settings.featured_banner_image_url && (
                <img 
                  src={settings.featured_banner_image_url} 
                  alt="Featured" 
                  className="w-24 h-24 object-contain"
                />
              )}
            </div>
          </div>

          {/* Plan Card */}
          <div className="rounded-2xl border border-border/50 bg-slate-900/95 backdrop-blur-sm p-5">
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                {popularPlan.image_url ? (
                  <img 
                    src={popularPlan.image_url} 
                    alt={popularPlan.name} 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <HardDrive className="w-6 h-6 text-green-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-lg text-cyan-400">{popularPlan.name}</h4>
                  <p className="text-sm">
                    <span className="font-semibold text-cyan-400">{popularPlan.ram}</span>
                    <span className="text-muted-foreground"> RAM</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-bold text-white">${popularPlan.price}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
            </div>

            {/* Specs Row */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>{popularPlan.storage} storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>{popularPlan.cpu}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>{popularPlan.bandwidth}</span>
              </div>
            </div>

            {/* Order Button */}
            <a
              href={popularPlan.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
            >
              Order Now
            </a>
          </div>

          {/* More Packages Link */}
          <Link 
            to="/game-servers" 
            className="rounded-2xl border border-border/50 bg-slate-900/80 backdrop-blur-sm px-5 py-4 flex items-center justify-between hover:border-cyan-500/30 transition-colors group"
          >
            <span className="font-semibold text-white">More Server Packages</span>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded bg-yellow-500/80" />
                <div className="w-6 h-6 rounded bg-stone-600/80" />
                <div className="w-6 h-6 rounded bg-green-600/80" />
              </div>
              <span className="text-cyan-400 font-semibold">+20</span>
            </div>
          </Link>
    </div>
  );
};
