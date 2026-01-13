import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Gamepad2, Shield, Zap, Cloud, Headphones, Package, ShieldCheck } from "lucide-react";
import heroCharacter from "@/assets/hero-character.png";

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
  { icon: <Package className="w-4 h-4 text-primary" />, label: "Instant Modpack & Plugin Installer" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
];

export default function GameHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("hosting_plans")
        .select("*")
        .eq("category", "game")
        .eq("enabled", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setPlans(data as Plan[]);
      }
      setLoading(false);
    };

    fetchPlans();
  }, []);

  return (
    <HostingPageLayout
      badge={{ icon: <Gamepad2 className="w-8 h-8 text-primary" />, label: "Game Server Hosting" }}
      title="MINECRAFT"
      titleHighlight="SERVER HOSTING"
      description="Easily host your very own Minecraft server with KineticHost. Enjoy reliable, fully customizable and quick to set up servers, perfect for playing with friends or starting a community!"
      descriptionHighlight="reliable, fully customizable and quick to set up servers,"
      trustBadges={trustBadges}
      heroImage={heroCharacter}
    >
      {/* Billing Toggle */}
      <div className="flex justify-end mb-8">
        <BillingToggle value={billingCycle} onChange={setBillingCycle} />
      </div>

      {/* Plans Grid */}
      {loading ? (
        <ThunderLoader />
      ) : plans.length === 0 ? (
        <p className="text-center text-muted-foreground">No plans available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
