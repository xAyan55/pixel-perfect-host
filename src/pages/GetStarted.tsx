import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Server, Cloud, Globe, Bot, ArrowLeft } from "lucide-react";

const categories = [
  {
    name: "Game Servers",
    description: "High-performance game hosting with DDoS protection and instant setup",
    icon: Server,
    href: "/game-servers",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    name: "Cloud VPS",
    description: "Scalable virtual private servers with full root access and SSD storage",
    icon: Cloud,
    href: "/cloud-vps",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Web Hosting",
    description: "Fast and reliable web hosting with one-click installers and SSL",
    icon: Globe,
    href: "/web-hosting",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    name: "Bot Hosting",
    description: "24/7 bot hosting with low latency and automated restarts",
    icon: Bot,
    href: "/bot-hosting",
    gradient: "from-pink-500 to-rose-500",
  },
];

const GetStarted = () => {
  const headerAnimation = useScrollAnimation();
  const cardsAnimation = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div 
            ref={headerAnimation.ref}
            className={`text-center max-w-3xl mx-auto mb-16 scroll-animate ${headerAnimation.isVisible ? 'animate-in' : ''}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="text-primary">Hosting</span> Solution
            </h1>
            <p className="text-lg text-muted-foreground">
              Select the perfect hosting solution for your needs. All plans include 24/7 support, 
              instant setup, and our uptime guarantee.
            </p>
          </div>

          {/* Category Cards */}
          <div 
            ref={cardsAnimation.ref}
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto scroll-animate stagger-2 ${cardsAnimation.isVisible ? 'animate-in' : ''}`}
          >
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.href}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* Arrow */}
                <div className="absolute bottom-8 right-8 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GetStarted;
