import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, HardDrive, Cpu, Wifi, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

interface HostingPlanCardProps {
  plan: Plan;
  index?: number;
}

export function HostingPlanCard({ plan, index = 0 }: HostingPlanCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        plan.popular ? "z-10" : ""
      }`}
      style={{ 
        animationDelay: `${index * 80}ms`,
        opacity: 0,
        animation: `slide-up-fade 0.5s ease-out ${index * 80}ms forwards`
      }}
    >
      {/* Animated border gradient for popular */}
      {plan.popular && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-shift rounded-2xl opacity-70" />
      )}
      
      {/* Card content */}
      <div className={`relative h-full bg-card/80 backdrop-blur-sm p-6 rounded-2xl border ${
        plan.popular ? "border-transparent" : "border-border/50"
      } transition-all duration-300 group-hover:border-primary/30 group-hover:bg-card/90`}>
        
        {/* Popular badge */}
        {plan.popular && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground rounded-t-none rounded-b-lg px-4 py-1 text-xs font-medium">
              <Zap className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className={`text-center ${plan.popular ? "pt-4" : "pt-0"}`}>
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-primary">${plan.price}</span>
            <span className="text-muted-foreground text-sm">/{plan.billing_cycle}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Specs */}
        <div className="space-y-3 mb-5">
          {[
            { icon: HardDrive, label: "RAM", value: plan.ram },
            { icon: Cpu, label: "CPU", value: plan.cpu },
            { icon: HardDrive, label: "Storage", value: plan.storage },
            { icon: Wifi, label: "Bandwidth", value: plan.bandwidth },
          ].map((spec, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 text-sm group/spec transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors duration-200 group-hover/spec:bg-primary/20">
                <spec.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="ml-auto font-medium">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {plan.features.slice(0, 4).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-primary" />
              </div>
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-muted-foreground/70 pl-6">
              +{plan.features.length - 4} more features
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full transition-all duration-300 ${
            plan.popular
              ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
              : "bg-card hover:bg-primary/10 border border-border/50 hover:border-primary/30"
          }`}
          variant={plan.popular ? "default" : "outline"}
          onClick={() => navigate(`/checkout?plan=${plan.id}`)}
        >
          Get Started
        </Button>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
