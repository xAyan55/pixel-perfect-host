import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Gamepad2, Shield, Zap, Cloud, Headphones, Package, ShieldCheck } from "lucide-react";
import gameHeroDefault from "@/assets/game-hero.png";

interface Plan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  features: string[];
  redirect_url: string;
  popular: boolean;
  image_url?: string | null;
}

const trustBadges = [
  { icon: <ShieldCheck className="w-4 h-4 text-primary" />, label: "72hr Self-Serve Refund" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Instant Setup" },
  { icon: <Cloud className="w-4 h-4 text-primary" />, label: "99.9% Uptime" },
  { icon: <Headphones className="w-4 h-4 text-primary" />, label: "24/7 Support" },
  { icon: <Package className="w-4 h-4 text-primary" />, label: "Easy Mod Support" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
];

export default function HytaleHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [heroImage, setHeroImage] = useState<string>(gameHeroDefault);

  useEffect(() => {
    const fetchData = async () => {
      const [plansResult, settingsResult] = await Promise.all([
        supabase
          .from("hosting_plans")
          .select("*")
          .eq("category", "game")
          .eq("game_type", "hytale")
          .eq("enabled", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_settings")
          .select("*")
          .eq("setting_key", "hytale_hero_image_url")
          .maybeSingle()
      ]);

      if (!plansResult.error && plansResult.data) {
        setPlans(plansResult.data as Plan[]);
      }

      if (!settingsResult.error && settingsResult.data?.setting_value) {
        setHeroImage(settingsResult.data.setting_value);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <HostingPageLayout
      badge={{ icon: <Gamepad2 className="w-8 h-8 text-primary" />, label: "Hytale Server Hosting" }}
      title="HYTALE"
      titleHighlight="SERVER HOSTING"
      description="Get ready for Hytale with KineticHost. Premium performance servers with instant setup, mod support, and 24/7 customer support!"
      descriptionHighlight="Premium performance servers"
      trustBadges={trustBadges}
      heroImage={heroImage}
    >
      <div className="flex justify-end mb-8">
        <BillingToggle value={billingCycle} onChange={setBillingCycle} />
      </div>

      {loading ? (
        <ThunderLoader />
      ) : plans.length === 0 ? (
        <p className="text-center text-muted-foreground">No plans available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <ShockbytePlanCard 
              key={plan.id} 
              plan={plan} 
              index={index} 
              billingCycle={billingCycle}
            />
          ))}
        </div>
      )}
    </HostingPageLayout>
  );
}
