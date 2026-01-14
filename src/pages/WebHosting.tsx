import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Globe, Shield, Zap, Lock, Mail, Database, Cpu } from "lucide-react";

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
  { icon: <Lock className="w-4 h-4 text-primary" />, label: "Free SSL Certificate" },
  { icon: <Zap className="w-4 h-4 text-primary" />, label: "One-Click WordPress" },
  { icon: <Mail className="w-4 h-4 text-primary" />, label: "Unlimited Email Accounts" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "Daily Backups" },
  { icon: <Database className="w-4 h-4 text-primary" />, label: "MySQL Databases" },
  { icon: <Cpu className="w-4 h-4 text-primary" />, label: "99.9% Uptime" },
];

export default function WebHosting() {
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
          .eq("category", "web")
          .eq("enabled", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("site_settings")
          .select("*")
          .eq("setting_key", "web_hero_image_url")
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
      badge={{ icon: <Globe className="w-8 h-8 text-primary" />, label: "Web Hosting" }}
      title="FAST & RELIABLE"
      titleHighlight="WEB HOSTING"
      description="Host your websites with blazing-fast speeds, free SSL certificates, and unlimited email accounts. Perfect for blogs, portfolios, e-commerce, and business websites."
      descriptionHighlight="blazing-fast speeds, free SSL certificates,"
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