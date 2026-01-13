import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HostingPageLayout } from "@/components/HostingPageLayout";
import { ShockbytePlanCard } from "@/components/ShockbytePlanCard";
import { BillingToggle, BillingCycle } from "@/components/BillingToggle";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Bot, Clock, Code, Database, RefreshCw, Shield } from "lucide-react";

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
  { icon: <Clock className="w-4 h-4 text-primary" />, label: "24/7 Uptime Guaranteed" },
  { icon: <Code className="w-4 h-4 text-primary" />, label: "Node.js, Python, Java" },
  { icon: <Database className="w-4 h-4 text-primary" />, label: "MongoDB & MySQL" },
  { icon: <RefreshCw className="w-4 h-4 text-primary" />, label: "Auto-Restart on Crash" },
  { icon: <Shield className="w-4 h-4 text-primary" />, label: "DDoS Protection" },
  { icon: <Bot className="w-4 h-4 text-primary" />, label: "Discord & Telegram Ready" },
];

export default function BotHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("hosting_plans")
        .select("*")
        .eq("category", "bot")
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
      badge={{ icon: <Bot className="w-8 h-8 text-primary" />, label: "Bot Hosting" }}
      title="RELIABLE"
      titleHighlight="BOT HOSTING"
      titleSuffix="PLATFORM"
      description="Host your Discord bots, Telegram bots, and custom applications with 24/7 uptime, automatic crash recovery, and full language support. Never worry about downtime again."
      descriptionHighlight="24/7 uptime, automatic crash recovery,"
      trustBadges={trustBadges}
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
