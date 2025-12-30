import { useState, useEffect } from "react";
import { Gamepad2, Globe, Cloud, Bot, Check, ArrowRight, ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { supabase } from "@/integrations/supabase/client";
import gamePanel from "@/assets/game-panel.webp";

const tabs = [
  { id: "game", label: "Game Hosting", icon: Gamepad2 },
  { id: "web", label: "Web Hosting", icon: Globe },
  { id: "cloud", label: "Cloud Hosting", icon: Cloud },
  { id: "bot", label: "Bot Hosting", icon: Bot },
];

const tabContent = {
  game: {
    badge: "Free Service",
    title: "Game Hosting",
    description: "At Sano Servers, we are committed to making sure our users feel well taken care of, even with our completely free hosting services. We aim to provide an enjoyable, stress-free experience where you have full control over your server. Whether you're just starting out or have years of experience, we offer the tools and support you need to manage and customize your server without any hidden fees or limitations.",
    features: [
      "SFTP Access",
      "Player/Sub User Management",
      "Easy Minecraft configuration",
      "Version Changer",
      "Plugins Installer",
      "Mod Installer",
      "Modpack Installer",
      "Schedules"
    ],
    cta: { primary: "Get Started", secondary: "Learn More" }
  },
  web: {
    badge: "Premium Service",
    title: "Web Hosting",
    description: "Deploy your websites with our premium web hosting solution. Get access to Direct Admin control panel with industry-leading performance and reliability. Perfect for communities, portfolios, and business websites.",
    features: [
      "Direct Admin Panel",
      "Free SSL Certificates",
      "Unlimited Bandwidth",
      "Email Hosting",
      "One-Click Installers",
      "Daily Backups",
      "99.9% Uptime",
      "24/7 Support"
    ],
    cta: { primary: "Get Started", secondary: "Learn More" }
  },
  cloud: {
    badge: "Enterprise Ready",
    title: "Cloud Hosting",
    description: "Scale your infrastructure with our cloud hosting solutions. Whether you need VPS, dedicated servers, or custom configurations, we have the flexibility and power to meet your demands.",
    features: [
      "Scalable Resources",
      "Root Access",
      "SSD Storage",
      "DDoS Protection",
      "Multiple Locations",
      "API Access",
      "Load Balancing",
      "Auto Scaling"
    ],
    cta: { primary: "Get Started", secondary: "Learn More" }
  },
  bot: {
    badge: "24/7 Uptime",
    title: "Bot Hosting",
    description: "Host your Discord bots, Telegram bots, and other automation with our dedicated bot hosting. Reliable uptime and optimized for long-running processes.",
    features: [
      "24/7 Uptime",
      "Node.js Support",
      "Python Support",
      "Custom Dependencies",
      "Git Integration",
      "Auto Restart",
      "Log Viewer",
      "Resource Monitoring"
    ],
    cta: { primary: "Get Started", secondary: "Learn More" }
  }
};

export const SolutionsSection = () => {
  const [activeTab, setActiveTab] = useState("game");
  const [panelPreviewUrl, setPanelPreviewUrl] = useState("");
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });
  
  const content = tabContent[activeTab as keyof typeof tabContent];

  useEffect(() => {
    const fetchPanelPreview = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "panel_preview_url")
        .maybeSingle();
      if (data?.setting_value) {
        setPanelPreviewUrl(data.setting_value);
      }
    };
    fetchPanelPreview();
  }, []);

  return (
    <section id="solutions" className="py-24 relative">
      {/* Gradient bar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 max-w-[80%]">
        <div className="gradient-bar animate-glow-pulse" />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 scroll-animate ${headerVisible ? "visible" : ""}`}>
          <h2 className="section-title mb-4">Solutions for any use-case</h2>
          <p className="section-subtitle">
            Sano offers free, reliable game server hosting with instant deployment 
            and full control through an easy-to-use control panels.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`flex flex-wrap justify-center gap-2 mb-12 scroll-animate stagger-1 ${headerVisible ? "visible" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button flex items-center gap-2 ${
                activeTab === tab.id ? "tab-button-active" : ""
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className={`space-y-6 scroll-animate-left ${contentVisible ? "visible" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">{content.title}</span>
              <span className="px-3 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
                {content.badge}
              </span>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {content.description}
            </p>

            <div>
              <p className="text-sm text-muted-foreground mb-4">Whats Included:</p>
              <div className="grid grid-cols-2 gap-3">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Interested in what games we support? Check out our{" "}
              <a href="#" className="text-primary hover:underline">Supported Games</a>.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#" className="btn-primary group">
                {content.cta.primary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="btn-secondary group">
                {content.cta.secondary}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right - Image */}
          <div className={`relative scroll-animate-right ${contentVisible ? "visible" : ""}`}>
            <div className="absolute inset-0 bg-primary/10 blur-[60px] scale-90" />
            <div className="glass-card overflow-hidden">
              <img
                src={panelPreviewUrl || gamePanel}
                alt={content.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
