import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HostingPlanCard } from "@/components/HostingPlanCard";
import { ThunderLoader } from "@/components/ThunderLoader";
import { Badge } from "@/components/ui/badge";
import { Cloud, Shield, Zap, Server, Lock } from "lucide-react";

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

export default function VPSHosting() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data, error } = await supabase
        .from("hosting_plans")
        .select("*")
        .eq("category", "vps")
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
    { icon: <Server className="w-5 h-5" />, title: "Full Root Access", desc: "Complete control" },
    { icon: <Zap className="w-5 h-5" />, title: "NVMe Storage", desc: "Ultra-fast SSD" },
    { icon: <Shield className="w-5 h-5" />, title: "DDoS Protection", desc: "Always-on security" },
    { icon: <Lock className="w-5 h-5" />, title: "99.99% Uptime", desc: "Enterprise reliability" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-6 border-primary/40 text-primary bg-primary/5 px-4 py-1.5">
                <Cloud className="w-3.5 h-3.5 mr-1.5" />
                Cloud VPS
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Powerful{" "}
                <span className="gradient-text">
                  Cloud VPS
                </span>{" "}
                Servers
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Deploy virtual private servers with full root access, choice of OS, 
                and enterprise-grade infrastructure. Scale on demand.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div 
                  key={i} 
                  className="text-center p-5 rounded-xl bg-card/30 border border-border/30 transition-all duration-300 hover:border-primary/20 hover:bg-card/50"
                  style={{
                    opacity: 0,
                    animation: `slide-up-fade 0.4s ease-out ${i * 60}ms forwards`
                  }}
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your VPS Plan</h2>
              <p className="text-muted-foreground">
                All plans include root access and automated backups
              </p>
            </div>

            {loading ? (
              <ThunderLoader />
            ) : plans.length === 0 ? (
              <p className="text-center text-muted-foreground">No plans available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <HostingPlanCard key={plan.id} plan={plan} index={index} />
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
