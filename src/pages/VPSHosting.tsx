import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Server, Shield, Zap, Cloud, Cpu, HardDrive } from "lucide-react";

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
  { icon: <Server className="w-4 h-4 text-primary" />, label: "Full Root Access" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "Instant Deployment" },
  { icon: <Cloud className="w-4 h-4 text-primary" />, label: "99.99% Uptime" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
  { icon: <Cpu className="w-4 h-4 text-primary" />, label: "Latest AMD EPYC CPUs" },
  { icon: <HardDrive className="w-4 h-4 text-primary" />, label: "NVMe SSD Storage" },
];

export default function VPSHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [heroImage, setHeroImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const [plansResult, settingsResult] = await Promise.all([
        supabase
          .from("hosting_plans")
          .select("*")
          .eq("category", "vps")
          .eq("enabled", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_settings")
          .select("*")
          .eq("setting_key", "vps_hero_image_url")
          .single()
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
      badge={{ icon: <Server className="w-8 h-8 text-primary" />, label: "Cloud VPS" }}
      title="CLOUD VPS"
      titleHighlight="SERVER HOSTING"
      description="Deploy powerful virtual private servers with full root access, your choice of operating system, and enterprise-grade infrastructure. Scale on demand with reliable, high-performance hosting."
      descriptionHighlight="full root access, your choice of operating system,"
      trustBadges={trustBadges}
      heroImage={heroImage}
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