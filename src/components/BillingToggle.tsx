import { Badge } from "@/components/ui/badge";

export type BillingCycle = "monthly" | "quarterly" | "annually";

interface BillingToggleProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  const options: { id: BillingCycle; label: string; discount?: string }[] = [
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly", discount: "10% OFF" },
    { id: "annually", label: "Annually", discount: "30% OFF" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm rounded-xl p-1.5 border border-border/50">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`relative flex flex-col items-center px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            value === option.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {option.discount && (
            <Badge 
              className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 ${
                value === option.id 
                  ? "bg-green-500 text-white" 
                  : "bg-green-500/80 text-white"
              }`}
            >
              {option.discount}
            </Badge>
          )}
          <span className={option.discount ? "mt-1" : ""}>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
