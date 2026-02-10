import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Minus, Plus, Box, Cpu, Layers, Smartphone, Server } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface Plan {
  id: string;
  name: string;
  price: number;
  ram: string;
  redirect_url: string;
  image_url?: string;
}

type ServerType = "vanilla" | "optimized" | "modded" | "bedrock";

const serverTypes: { id: ServerType; name: string; subtitle: string; icon: React.ReactNode }[] = [
  { id: "vanilla", name: "Vanilla", subtitle: "Java Edition", icon: <Box className="w-4 h-4" /> },
  { id: "optimized", name: "Optimized", subtitle: "Paper, Purpur", icon: <Cpu className="w-4 h-4" /> },
  { id: "modded", name: "Modded", subtitle: "Forge, Fabric", icon: <Layers className="w-4 h-4" /> },
  { id: "bedrock", name: "Bedrock", subtitle: "Bedrock Edition", icon: <Smartphone className="w-4 h-4" /> },
];

const playerMarks = [
  { value: 0, label: "2+" },
  { value: 25, label: "5+" },
  { value: 50, label: "15+" },
  { value: 75, label: "25+" },
  { value: 100, label: "40+" },
];

export const RamCalculator = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [serverType, setServerType] = useState<ServerType>("vanilla");
  const [playerCount, setPlayerCount] = useState(0);
  const [modCount, setModCount] = useState(0);
  const [useOptimizationMods, setUseOptimizationMods] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase
        .from("hosting_plans")
        .select("id, name, price, ram, redirect_url, image_url")
        .eq("category", "game")
        .eq("enabled", true)
        .order("price", { ascending: true });

      if (data) setPlans(data);
    };
    fetchPlans();
  }, []);

  const recommendedRam = useMemo(() => {
    let baseRam = 2;
    if (playerCount >= 75) baseRam += 4;
    else if (playerCount >= 50) baseRam += 3;
    else if (playerCount >= 25) baseRam += 2;
    else if (playerCount > 0) baseRam += 1;

    if (serverType === "modded") baseRam += 3;
    else if (serverType === "optimized") baseRam += 1;

    baseRam += Math.floor(modCount / 20);

    if (useOptimizationMods && serverType !== "bedrock") {
      baseRam = Math.max(2, baseRam - 1);
    }

    return baseRam;
  }, [serverType, playerCount, modCount, useOptimizationMods]);

  const recommendedPlan = useMemo(() => {
    if (plans.length === 0) return null;

    const plansWithRam = plans.map(plan => {
      const ramMatch = plan.ram.match(/(\d+)/);
      const ramValue = ramMatch ? parseInt(ramMatch[1]) : 0;
      return { ...plan, ramValue };
    });

    const suitable = plansWithRam
      .filter(p => p.ramValue >= recommendedRam)
      .sort((a, b) => a.ramValue - b.ramValue);

    return suitable[0] || plansWithRam[plansWithRam.length - 1];
  }, [plans, recommendedRam]);

  const getDescription = () => {
    if (serverType === "bedrock") return "Perfect for Bedrock Edition servers.";
    if (serverType === "modded") return "Ideal for modded gameplay with mods.";
    if (serverType === "optimized") return "Great for optimized plugin servers.";
    return "Best for vanilla or light gameplay.";
  };

  return (
    <div className="flex-1 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Server className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">RAM Calculator</h3>
      </div>

      {/* Server Type Selection */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-medium text-foreground">Server Type</span>
          <HelpCircle className="w-3 h-3 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          {serverTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setServerType(type.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                serverType === type.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/50 bg-muted/30 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {type.icon}
              <div>
                <div className="text-xs font-medium">{type.name}</div>
                <div className="text-[10px] opacity-70">{type.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player Count Slider */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-xs font-medium text-foreground">Player Count</span>
          <HelpCircle className="w-3 h-3 text-muted-foreground" />
        </div>
        <Slider
          value={[playerCount]}
          onValueChange={(value) => setPlayerCount(value[0])}
          max={100}
          step={1}
          className="mb-1.5"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          {playerMarks.map((mark) => (
            <span key={mark.value}>{mark.label}</span>
          ))}
        </div>
      </div>

      {/* Mods Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {/* Number of Mods */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium text-foreground">Server mods</span>
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-muted/30">
            <span className="text-sm font-medium text-foreground flex-1">{modCount}</span>
            <button
              onClick={() => setModCount(Math.max(0, modCount - 10))}
              className="p-1.5 rounded-md bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setModCount(modCount + 10)}
              className="p-1.5 rounded-md bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Optimization Mods Toggle */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium text-foreground">Optimization mods?</span>
            <HelpCircle className="w-3 h-3 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/50 bg-muted/30">
            <span className="text-[10px] text-muted-foreground">Lithium, C2ME, etc.</span>
            <Switch
              checked={useOptimizationMods}
              onCheckedChange={setUseOptimizationMods}
            />
          </div>
        </div>
      </div>

      {/* Recommendation Card - Now Below Controls */}
      {recommendedPlan && (
        <div className="mt-auto rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 to-transparent overflow-hidden">
          {/* Header Badge */}
          <div className="py-1.5 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground text-[10px] font-bold tracking-wider text-center uppercase">
            We Recommend
          </div>

          <div className="p-4 flex flex-col items-center text-center">
            {/* Plan Icon */}
            {recommendedPlan.image_url ? (
              <img
                src={recommendedPlan.image_url}
                alt={recommendedPlan.name}
                className="w-10 h-10 mb-2 object-contain"
              />
            ) : (
              <div className="w-10 h-10 mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-primary" />
              </div>
            )}

            {/* Plan Name & RAM */}
            <h4 className="text-sm font-bold text-primary">{recommendedPlan.name}</h4>
            <p className="text-base font-bold text-foreground">
              {recommendedPlan.ram}
            </p>

            {/* Description */}
            <p className="text-[10px] text-muted-foreground mt-1 mb-3 leading-relaxed">
              {getDescription()}
            </p>

            {/* Price */}
            <div>
              <p className="text-[10px] text-muted-foreground">Starting at</p>
              <p className="text-lg font-bold text-primary">
                ${recommendedPlan.price}<span className="text-[10px] font-normal text-muted-foreground">/mo</span>
              </p>
            </div>

            {/* Order Button */}
            <button
              onClick={() => navigate(`/checkout?plan=${recommendedPlan.id}`)}
              className="mt-3 w-full max-w-xs inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all duration-200"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
