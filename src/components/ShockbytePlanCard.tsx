import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, ShoppingCart } from "lucide-react";
import { BillingCycle } from "./BillingToggle";
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
  image_url?: string | null;
}

interface ShockbytePlanCardProps {
  plan: Plan;
  index?: number;
  billingCycle?: BillingCycle;
}

export function ShockbytePlanCard({ plan, index = 0, billingCycle = "monthly" }: ShockbytePlanCardProps) {
  const navigate = useNavigate();
  // Calculate discounted price based on billing cycle
  const getDiscountMultiplier = () => {
    switch (billingCycle) {
      case "quarterly": return 0.9; // 10% off
      case "annually": return 0.7; // 30% off
      default: return 1;
    }
  };

  const discountMultiplier = getDiscountMultiplier();
  const originalPrice = plan.price;
  const discountedPrice = (originalPrice * discountMultiplier).toFixed(2);
  const hasDiscount = discountMultiplier < 1;

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${index * 60}ms`,
        opacity: 0,
        animation: `slide-up-fade 0.4s ease-out ${index * 60}ms forwards`,
      }}
    >
      {/* Blurred Background Image */}
      {plan.image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ backgroundImage: `url(${plan.image_url})` }}
        />
      )}
      {/* Card content */}
      <div className="relative h-full bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-card/80 flex flex-col z-10">
        {/* Plan Icon & Name */}
        <div className="flex flex-col items-center text-center mb-4">
          {plan.image_url ? (
            <img
              src={plan.image_url}
              alt={plan.name}
              className="w-10 h-10 mb-2 object-contain"
            />
          ) : (
            <div className="w-10 h-10 mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
              <Server className="w-5 h-5 text-primary" />
            </div>
          )}
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
            {plan.name}
          </h3>
        </div>

        {/* RAM - Prominent Display */}
        <div className="text-center mb-4">
          <span className="text-2xl md:text-3xl font-black text-foreground">
            {plan.ram}
          </span>
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="flex justify-center mb-3">
            <Badge className="bg-primary text-primary-foreground text-xs px-3 py-1">
              {billingCycle === "quarterly" ? "10%" : "30%"} OFF FIRST MONTH
            </Badge>
          </div>
        )}

        {/* Spacer to push price to bottom */}
        <div className="flex-1" />

        {/* Price */}
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-2">
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-foreground">
              ${discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground">
              /{billingCycle === "monthly" ? "monthly" : billingCycle === "quarterly" ? "quarter" : "year"}
            </span>
          </div>
        </div>

        {/* Buy Now Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20"
          onClick={() => navigate(`/checkout?plan=${plan.id}`)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Buy Now
        </Button>
      </div>
    </div>
  );
}
