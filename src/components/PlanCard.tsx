import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, HardDrive, Cpu, Wifi } from "lucide-react";
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

interface PlanCardProps {
  plan: Plan;
  index?: number;
}

export function PlanCard({ plan, index = 0 }: PlanCardProps) {
  const navigate = useNavigate();
  return (
    <Card
      className={`relative bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 group ${
        plan.popular ? "border-primary/50 shadow-lg shadow-primary/10" : ""
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {plan.popular && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-bold text-primary">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.billing_cycle}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Specs */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">RAM:</span>
            <span className="ml-auto font-medium">{plan.ram}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">CPU:</span>
            <span className="ml-auto font-medium">{plan.cpu}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">Storage:</span>
            <span className="ml-auto font-medium">{plan.storage}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground">Bandwidth:</span>
            <span className="ml-auto font-medium">{plan.bandwidth}</span>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 pt-4 border-t border-border/50">
          {plan.features.slice(0, 4).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-muted-foreground/70">
              +{plan.features.length - 4} more features
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          className={`w-full ${
            plan.popular
              ? "bg-primary hover:bg-primary/90"
              : "bg-card hover:bg-primary/10 border border-border/50"
          }`}
          variant={plan.popular ? "default" : "outline"}
          onClick={() => navigate(`/checkout?plan=${plan.id}`)}
        >
          Get Started
        </Button>
      </CardContent>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>
    </Card>
  );
}
