import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Server, Cloud, Globe, Bot, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const categories = [
  {
    name: "Game Servers",
    description: "High-performance game hosting with DDoS protection and instant setup",
    icon: Server,
    href: "/game-servers",
    color: "from-primary/20 to-primary/5",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    name: "Cloud VPS",
    description: "Scalable virtual private servers with full root access and SSD storage",
    icon: Cloud,
    href: "/cloud-vps",
    color: "from-violet-500/20 to-violet-500/5",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    name: "Web Hosting",
    description: "Fast and reliable web hosting with one-click installers and SSL",
    icon: Globe,
    href: "/web-hosting",
    color: "from-amber-500/20 to-amber-500/5",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    name: "Bot Hosting",
    description: "24/7 bot hosting with low latency and automated restarts",
    icon: Bot,
    href: "/bot-hosting",
    color: "from-rose-500/20 to-rose-500/5",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
  },
];

const features = [
  { icon: Zap, text: "Instant Setup" },
  { icon: Shield, text: "DDoS Protected" },
  { icon: Sparkles, text: "24/7 Support" },
];

const GetStarted = () => {
  const headerAnimation = useScrollAnimation();
  const cardsAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>
      
      <main className="relative pt-32 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div 
            ref={headerAnimation.ref}
            className={`text-center max-w-2xl mx-auto mb-20 scroll-animate ${headerAnimation.isVisible ? 'animate-in' : ''}`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Choose Your Solution
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              What would you like to <span className="text-primary">host</span> today?
            </h1>
            <p className="text-muted-foreground text-lg">
              All plans include instant deployment, enterprise-grade security, and around-the-clock support.
            </p>
            
            {/* Feature Pills */}
            <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 text-sm text-muted-foreground"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  {feature.text}
                </div>
              ))}
            </div>
          </div>

          {/* Category Cards */}
          <div 
            ref={cardsAnimation.ref}
            className={`grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto scroll-animate ${cardsAnimation.isVisible ? 'animate-in' : ''}`}
          >
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/50"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Subtle Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${category.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Link */}
          <div className="text-center mt-12">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetStarted;
