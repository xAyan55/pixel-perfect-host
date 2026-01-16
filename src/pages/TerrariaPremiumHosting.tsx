import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Gamepad2, Shield, Zap, Cloud, Headphones, Crown, ShieldCheck } from "lucide-react";

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
  { icon: <Headphones className="w-4 h-4 text-primary" />, label: "Priority Support" },
  { icon: <Crown className="w-4 h-4 text-primary" />, label: "Premium Hardware" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
];

export default function TerrariaPremiumHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [heroImage, setHeroImage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const [plansResult, settingsResult] = await Promise.all([
        supabase
          .from("hosting_plans")
          .select("*")
          .eq("category", "game")
          .eq("game_type", "terraria")
          .eq("game_subtype", "premium")
          .eq("enabled", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_settings")
          .select("*")
          .eq("setting_key", "terraria_hero_image_url")
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
      badge={{ icon: <Gamepad2 className="w-8 h-8 text-primary" />, label: "Terraria Premium Hosting" }}
      title="TERRARIA PREMIUM"
      titleHighlight="SERVER HOSTING"
      description="Premium Terraria server hosting with KineticHost! Maximum performance with priority support, premium hardware, and TShock pre-installed!"
      descriptionHighlight="Maximum performance with priority support"
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