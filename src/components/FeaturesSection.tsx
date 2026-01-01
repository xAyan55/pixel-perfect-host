import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Settings, Puzzle, Book, Package, Save, Layers, 
  RefreshCw, Wrench, Shield, Cpu, Wifi, MapPin, 
  Headphones, Eye, Database, Cloud, Zap, Lock
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

interface FeaturesSectionSettings {
  features_section_logo_url: string;
  features_section_subtitle: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  settings: Settings,
  puzzle: Puzzle,
  book: Book,
  package: Package,
  save: Save,
  layers: Layers,
  "refresh-cw": RefreshCw,
  wrench: Wrench,
  shield: Shield,
  cpu: Cpu,
  wifi: Wifi,
  "map-pin": MapPin,
  headphones: Headphones,
  eye: Eye,
  database: Database,
  cloud: Cloud,
  zap: Zap,
  lock: Lock,
};

const getIconComponent = (iconName: string) => {
  return iconMap[iconName] || Settings;
};

export const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [settings, setSettings] = useState<FeaturesSectionSettings>({
    features_section_logo_url: "",
    features_section_subtitle: "Advanced tools to manage, customize, and create your server",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch features
      const { data: featuresData } = await supabase
        .from("features")
        .select("*")
        .eq("enabled", true)
        .order("sort_order", { ascending: true });

      if (featuresData) {
        setFeatures(featuresData);
      }

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*");

      if (settingsData) {
        const settingsMap: Record<string, string> = {};
        settingsData.forEach((item: { setting_key: string; setting_value: string | null }) => {
          settingsMap[item.setting_key] = item.setting_value || "";
        });
        setSettings((prev) => ({ ...prev, ...settingsMap }));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || features.length === 0) return null;

  // Split features into positions around the center logo
  const topLeft = features[0];
  const topCenter = features[1];
  const topRight = features[2];
  const middleLeft = features[3];
  const middleRight = features[4];
  const bottomLeft = features[5];
  const bottomCenter = features[6];
  const bottomRight = features[7];

  const FeatureCard = ({ feature, position }: { feature?: Feature; position: string }) => {
    if (!feature) return <div className="hidden lg:block" />;
    const IconComponent = getIconComponent(feature.icon);
    
    return (
      <div 
        className={`feature-card group scroll-animate ${isVisible ? "visible" : ""} ${position}`}
      >
        <div className="w-10 h-10 rounded-lg bg-card border border-border/50 flex items-center justify-center mb-3">
          <IconComponent className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    );
  };

  return (
    <section id="features" className="py-20 relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section subtitle */}
        <p className={`text-center text-muted-foreground mb-16 scroll-animate ${isVisible ? "visible" : ""}`}>
          {settings.features_section_subtitle}
        </p>

        {/* Features Grid with Center Logo */}
        <div className="relative max-w-5xl mx-auto">
          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Top Row */}
            <FeatureCard feature={topLeft} position="stagger-1" />
            <FeatureCard feature={topCenter} position="stagger-2" />
            <FeatureCard feature={topRight} position="stagger-3" />
            
            {/* Middle Row */}
            <FeatureCard feature={middleLeft} position="stagger-4" />
            
            {/* Center Logo */}
            <div className={`relative flex items-center justify-center py-8 scroll-animate ${isVisible ? "visible" : ""} stagger-5`}>
              {/* Connection lines - desktop only */}
              <div className="hidden lg:block absolute inset-0">
                {/* Vertical lines */}
                <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50" />
                {/* Horizontal lines */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
              </div>
              
              {/* Center circle with logo */}
              <div className="relative w-24 h-24 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                {settings.features_section_logo_url ? (
                  <img 
                    src={settings.features_section_logo_url} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                )}
              </div>
            </div>
            
            <FeatureCard feature={middleRight} position="stagger-6" />
            
            {/* Bottom Row */}
            <FeatureCard feature={bottomLeft} position="stagger-7" />
            <FeatureCard feature={bottomCenter} position="stagger-8" />
            <FeatureCard feature={bottomRight} position="stagger-9" />
          </div>
        </div>
      </div>
    </section>
  );
};
