import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Cloud, Globe, Bot, Check, Cpu, HardDrive, Wifi, Zap } from "lucide-react";

type PlanCategory = "game" | "vps" | "web" | "bot";

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  specs: {
    ram: string;
    cpu: string;
    storage: string;
    bandwidth: string;
  };
  features: string[];
  redirectUrl: string;
  popular?: boolean;
  enabled: boolean;
}

interface CategoryData {
  id: PlanCategory;
  name: string;
  icon: React.ReactNode;
  description: string;
  plans: Plan[];
}

const hostingCategories: CategoryData[] = [
  {
    id: "game",
    name: "Game Hosting",
    icon: <Gamepad2 className="w-5 h-5" />,
    description: "Minecraft, Discord Bots, CS2, and more",
    plans: [
      {
        id: "game-starter",
        name: "Starter",
        price: 4.99,
        billingCycle: "month",
        specs: { ram: "2GB", cpu: "2 vCores", storage: "20GB SSD", bandwidth: "Unlimited" },
        features: ["DDoS Protection", "Instant Setup", "24/7 Support", "Mod Support"],
        redirectUrl: "https://billing.kinetichost.space/game/starter",
        enabled: true,
      },
      {
        id: "game-pro",
        name: "Pro",
        price: 9.99,
        billingCycle: "month",
        specs: { ram: "4GB", cpu: "4 vCores", storage: "50GB SSD", bandwidth: "Unlimited" },
        features: ["DDoS Protection", "Instant Setup", "24/7 Priority Support", "Mod Support", "Custom Domain"],
        redirectUrl: "https://billing.kinetichost.space/game/pro",
        popular: true,
        enabled: true,
      },
      {
        id: "game-elite",
        name: "Elite",
        price: 19.99,
        billingCycle: "month",
        specs: { ram: "8GB", cpu: "6 vCores", storage: "100GB NVMe", bandwidth: "Unlimited" },
        features: ["Advanced DDoS Protection", "Instant Setup", "24/7 Priority Support", "Unlimited Mods", "Custom Domain", "Dedicated IP"],
        redirectUrl: "https://billing.kinetichost.space/game/elite",
        enabled: true,
      },
      {
        id: "game-ultimate",
        name: "Ultimate",
        price: 39.99,
        billingCycle: "month",
        specs: { ram: "16GB", cpu: "8 vCores", storage: "200GB NVMe", bandwidth: "Unlimited" },
        features: ["Enterprise DDoS Protection", "Instant Setup", "Dedicated Support Agent", "Unlimited Everything", "Multiple Domains", "Dedicated IP", "Daily Backups"],
        redirectUrl: "https://billing.kinetichost.space/game/ultimate",
        enabled: true,
      },
    ],
  },
  {
    id: "vps",
    name: "Cloud VPS",
    icon: <Cloud className="w-5 h-5" />,
    description: "Powerful virtual private servers",
    plans: [
      {
        id: "vps-basic",
        name: "Basic",
        price: 5.99,
        billingCycle: "month",
        specs: { ram: "1GB", cpu: "1 vCore", storage: "25GB SSD", bandwidth: "1TB" },
        features: ["Root Access", "Choice of OS", "99.9% Uptime", "24/7 Support"],
        redirectUrl: "https://billing.kinetichost.space/vps/basic",
        enabled: true,
      },
      {
        id: "vps-standard",
        name: "Standard",
        price: 12.99,
        billingCycle: "month",
        specs: { ram: "2GB", cpu: "2 vCores", storage: "50GB SSD", bandwidth: "2TB" },
        features: ["Root Access", "Choice of OS", "99.9% Uptime", "24/7 Support", "Automated Backups"],
        redirectUrl: "https://billing.kinetichost.space/vps/standard",
        popular: true,
        enabled: true,
      },
      {
        id: "vps-performance",
        name: "Performance",
        price: 24.99,
        billingCycle: "month",
        specs: { ram: "4GB", cpu: "4 vCores", storage: "100GB NVMe", bandwidth: "4TB" },
        features: ["Root Access", "Choice of OS", "99.99% Uptime", "Priority Support", "Daily Backups", "DDoS Protection"],
        redirectUrl: "https://billing.kinetichost.space/vps/performance",
        enabled: true,
      },
      {
        id: "vps-enterprise",
        name: "Enterprise",
        price: 49.99,
        billingCycle: "month",
        specs: { ram: "8GB", cpu: "8 vCores", storage: "200GB NVMe", bandwidth: "8TB" },
        features: ["Root Access", "Choice of OS", "99.99% Uptime", "Dedicated Support", "Hourly Backups", "Advanced DDoS", "Private Networking"],
        redirectUrl: "https://billing.kinetichost.space/vps/enterprise",
        enabled: true,
      },
    ],
  },
  {
    id: "web",
    name: "Web Hosting",
    icon: <Globe className="w-5 h-5" />,
    description: "Fast and reliable website hosting",
    plans: [
      {
        id: "web-starter",
        name: "Starter",
        price: 2.99,
        billingCycle: "month",
        specs: { ram: "512MB", cpu: "Shared", storage: "5GB SSD", bandwidth: "50GB" },
        features: ["1 Website", "Free SSL", "Email Accounts", "One-Click Installs"],
        redirectUrl: "https://billing.kinetichost.space/web/starter",
        enabled: true,
      },
      {
        id: "web-business",
        name: "Business",
        price: 6.99,
        billingCycle: "month",
        specs: { ram: "1GB", cpu: "Shared+", storage: "25GB SSD", bandwidth: "Unlimited" },
        features: ["5 Websites", "Free SSL", "Unlimited Email", "One-Click Installs", "Daily Backups"],
        redirectUrl: "https://billing.kinetichost.space/web/business",
        popular: true,
        enabled: true,
      },
      {
        id: "web-premium",
        name: "Premium",
        price: 12.99,
        billingCycle: "month",
        specs: { ram: "2GB", cpu: "Dedicated", storage: "50GB NVMe", bandwidth: "Unlimited" },
        features: ["Unlimited Websites", "Free SSL", "Unlimited Email", "Staging Environment", "Priority Support", "Advanced Caching"],
        redirectUrl: "https://billing.kinetichost.space/web/premium",
        enabled: true,
      },
      {
        id: "web-agency",
        name: "Agency",
        price: 24.99,
        billingCycle: "month",
        specs: { ram: "4GB", cpu: "Dedicated+", storage: "100GB NVMe", bandwidth: "Unlimited" },
        features: ["Unlimited Everything", "White-Label", "Client Management", "Priority Support", "Advanced Security", "CDN Included"],
        redirectUrl: "https://billing.kinetichost.space/web/agency",
        enabled: true,
      },
    ],
  },
  {
    id: "bot",
    name: "Bot Hosting",
    icon: <Bot className="w-5 h-5" />,
    description: "Discord bots, Telegram bots, and more",
    plans: [
      {
        id: "bot-hobby",
        name: "Hobby",
        price: 1.99,
        billingCycle: "month",
        specs: { ram: "256MB", cpu: "Shared", storage: "2GB SSD", bandwidth: "Unlimited" },
        features: ["1 Bot", "Node.js/Python", "24/7 Uptime", "Basic Support"],
        redirectUrl: "https://billing.kinetichost.space/bot/hobby",
        enabled: true,
      },
      {
        id: "bot-developer",
        name: "Developer",
        price: 4.99,
        billingCycle: "month",
        specs: { ram: "512MB", cpu: "1 vCore", storage: "5GB SSD", bandwidth: "Unlimited" },
        features: ["3 Bots", "All Languages", "24/7 Uptime", "Priority Support", "Custom Domain"],
        redirectUrl: "https://billing.kinetichost.space/bot/developer",
        popular: true,
        enabled: true,
      },
      {
        id: "bot-professional",
        name: "Professional",
        price: 9.99,
        billingCycle: "month",
        specs: { ram: "1GB", cpu: "2 vCores", storage: "10GB SSD", bandwidth: "Unlimited" },
        features: ["10 Bots", "All Languages", "24/7 Uptime", "Priority Support", "Database Included", "Auto-Restart"],
        redirectUrl: "https://billing.kinetichost.space/bot/professional",
        enabled: true,
      },
      {
        id: "bot-enterprise",
        name: "Enterprise",
        price: 19.99,
        billingCycle: "month",
        specs: { ram: "2GB", cpu: "4 vCores", storage: "25GB NVMe", bandwidth: "Unlimited" },
        features: ["Unlimited Bots", "All Languages", "24/7 Uptime", "Dedicated Support", "Multiple Databases", "Load Balancing", "API Access"],
        redirectUrl: "https://billing.kinetichost.space/bot/enterprise",
        enabled: true,
      },
    ],
  },
];

export function HostingPlans() {
  const [activeCategory, setActiveCategory] = useState<PlanCategory>("game");

  const currentCategory = hostingCategories.find((cat) => cat.id === activeCategory);

  return (
    <section id="plans" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            <Zap className="w-3 h-3 mr-1" />
            Hosting Plans
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Choose Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Hosting Plan
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From game servers to cloud VPS, we've got the perfect solution for your needs.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {hostingCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border/50"
              }`}
            >
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Category Description */}
        {currentCategory && (
          <p className="text-center text-muted-foreground mb-8">
            {currentCategory.description}
          </p>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentCategory?.plans
            .filter((plan) => plan.enabled)
            .map((plan, index) => (
              <Card
                key={plan.id}
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
                    <span className="text-muted-foreground">/{plan.billingCycle}</span>
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
                      <span className="ml-auto font-medium">{plan.specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">CPU:</span>
                      <span className="ml-auto font-medium">{plan.specs.cpu}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <HardDrive className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="ml-auto font-medium">{plan.specs.storage}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wifi className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Bandwidth:</span>
                      <span className="ml-auto font-medium">{plan.specs.bandwidth}</span>
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
                    asChild
                    className={`w-full ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-card hover:bg-primary/10 border border-border/50"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <a href={plan.redirectUrl} target="_blank" rel="noopener noreferrer">
                      Get Started
                    </a>
                  </Button>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
                </div>
              </Card>
            ))}
        </div>

        {/* Custom Plans CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="text-left">
              <h3 className="font-semibold text-lg">Need a custom plan?</h3>
              <p className="text-muted-foreground text-sm">
                Contact us for enterprise solutions tailored to your needs.
              </p>
            </div>
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
