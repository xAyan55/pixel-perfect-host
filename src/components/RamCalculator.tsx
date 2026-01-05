import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HelpCircle, Minus, Plus, Box, Cpu, Layers, Smartphone } from "lucide-react";
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
  { id: "optimized", name: "Optimized", subtitle: "Paper, Purpur, Spigot", icon: <Cpu className="w-4 h-4" /> },
  { id: "modded", name: "Modded", subtitle: "Forge, Fabric, Quilt", icon: <Layers className="w-4 h-4" /> },
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

  // Calculate recommended RAM based on selections
  const recommendedRam = useMemo(() => {
    let baseRam = 2; // Start with 2GB

    // Player count contribution
    if (playerCount >= 75) baseRam += 4;
    else if (playerCount >= 50) baseRam += 3;
    else if (playerCount >= 25) baseRam += 2;
    else if (playerCount > 0) baseRam += 1;

    // Server type contribution
    if (serverType === "modded") baseRam += 3;
    else if (serverType === "optimized") baseRam += 1;
    else if (serverType === "bedrock") baseRam += 0;

    // Mod count contribution
    baseRam += Math.floor(modCount / 20);

    // Optimization mods reduce RAM needs
    if (useOptimizationMods && serverType !== "bedrock") {
      baseRam = Math.max(2, baseRam - 1);
    }

    return baseRam;
  }, [serverType, playerCount, modCount, useOptimizationMods]);

  // Find the best matching plan
  const recommendedPlan = useMemo(() => {
    if (plans.length === 0) return null;

    // Parse RAM values and find closest match
    const plansWithRam = plans.map(plan => {
      const ramMatch = plan.ram.match(/(\d+)/);
      const ramValue = ramMatch ? parseInt(ramMatch[1]) : 0;
      return { ...plan, ramValue };
    });

    // Find the smallest plan that meets the requirement
    const suitable = plansWithRam
      .filter(p => p.ramValue >= recommendedRam)
      .sort((a, b) => a.ramValue - b.ramValue);

    return suitable[0] || plansWithRam[plansWithRam.length - 1];
  }, [plans, recommendedRam]);

  const getDescription = () => {
    if (serverType === "bedrock") {
      return "The Best Package for Bedrock Edition servers.";
    }
    if (serverType === "modded") {
      return "The Best Package for modded gameplay with multiple mods.";
    }
    if (serverType === "optimized") {
      return "The Best Package for optimized servers with plugins.";
    }
    return "The Best Package for vanilla or slightly modded gameplay.";
  };

  return (
    <div className="flex-1">
      {/* Main Calculator Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">
              Game Server RAM Calculator
            </h3>
            <p className="text-sm text-muted-foreground">
              Select your configuration to get a package recommendation.
            </p>
          </div>
        </div>

        {/* Server Type Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-medium text-white">Server Type</span>
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {serverTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setServerType(type.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                  serverType === type.id
                    ? "border-cyan-500 bg-cyan-500/20 text-cyan-400"
                    : "border-border/50 bg-slate-800/50 text-muted-foreground hover:border-cyan-500/50"
                }`}
              >
                {type.icon}
                <div className="text-left">
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className="text-xs opacity-70">{type.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Player Count Slider */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm font-medium text-white">Player Count</span>
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <Slider
            value={[playerCount]}
            onValueChange={(value) => setPlayerCount(value[0])}
            max={100}
            step={1}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            {playerMarks.map((mark) => (
              <span key={mark.value}>{mark.label}</span>
            ))}
          </div>
        </div>

        {/* Mods Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Number of Mods */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-medium text-white">Number of server mods</span>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-slate-800/50">
              <span className="text-lg font-medium text-white flex-1">{modCount}</span>
              <button
                onClick={() => setModCount(Math.max(0, modCount - 10))}
                className="p-2 rounded-lg bg-slate-700/50 text-muted-foreground hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setModCount(modCount + 10)}
                className="p-2 rounded-lg bg-slate-700/50 text-muted-foreground hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optimization Mods Toggle */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-sm font-medium text-white">Using optimization mods?</span>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-slate-800/50">
              <span className="text-sm text-muted-foreground">
                Mods like Ferritecore, Lithium, C2ME, etc.
              </span>
              <Switch
                checked={useOptimizationMods}
                onCheckedChange={setUseOptimizationMods}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Card - Compact */}
      {recommendedPlan && (
        <div className="mt-3 rounded-2xl border border-green-500/40 bg-slate-900/95 backdrop-blur-sm overflow-hidden text-center">
          {/* Badge */}
          <div className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold tracking-wider">
            WE RECOMMEND
          </div>

          <div className="p-4">
            {/* Plan Icon */}
            {recommendedPlan.image_url ? (
              <img
                src={recommendedPlan.image_url}
                alt={recommendedPlan.name}
                className="w-12 h-12 mx-auto mb-2 object-contain"
              />
            ) : (
              <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Box className="w-6 h-6 text-green-400" />
              </div>
            )}

            {/* Plan Name & RAM */}
            <h4 className="text-base font-bold text-green-400">{recommendedPlan.name}</h4>
            <p className="text-lg font-bold text-white">
              {recommendedPlan.ram} <span className="text-muted-foreground font-normal text-xs">RAM</span>
            </p>

            {/* Description */}
            <p className="text-xs text-muted-foreground mt-2 mb-3 leading-relaxed">
              {getDescription()}
            </p>

            {/* Price */}
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-xl font-bold text-green-400 mb-3">
              ${recommendedPlan.price}<span className="text-xs font-normal text-muted-foreground">/mo</span>
            </p>

            {/* Order Button */}
            <a
              href={recommendedPlan.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 rounded-lg border border-green-500 text-green-400 text-sm font-semibold hover:bg-green-500/10 transition-all duration-200"
            >
              Order Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
