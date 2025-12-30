import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlanCard } from "@/components/PlanCard";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Loader2, Shield, Zap, Server, Headphones } from "lucide-react";

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
}

export default function GameHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

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

  const features = [
    { icon: <Shield className="w-6 h-6" />, title: "DDoS Protection", desc: "Enterprise-grade protection against attacks" },
    { icon: <Zap className="w-6 h-6" />, title: "Instant Setup", desc: "Your server is ready in seconds" },
    { icon: <Server className="w-6 h-6" />, title: "NVMe Storage", desc: "Lightning-fast game performance" },
    { icon: <Headphones className="w-6 h-6" />, title: "24/7 Support", desc: "Expert help whenever you need it" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              <Gamepad2 className="w-3 h-3 mr-1" />
              Game Server Hosting
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium{" "}
              <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                Game Server
              </span>{" "}
              Hosting
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Minecraft, CS2, Rust, ARK, and more. Deploy your game server instantly with 
              enterprise-grade DDoS protection and 24/7 expert support.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-card/50 border border-border/50">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground">
                All plans include instant deployment and DDoS protection
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : plans.length === 0 ? (
              <p className="text-center text-muted-foreground">No plans available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <PlanCard key={plan.id} plan={plan} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
