import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Terminal, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Game Servers", href: "/game-servers" },
  { name: "Cloud VPS", href: "/cloud-vps" },
  { name: "Web Hosting", href: "/web-hosting" },
  { name: "Bot Hosting", href: "/bot-hosting" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [controlPanelUrl, setControlPanelUrl] = useState("#");
  const location = useLocation();

  useEffect(() => {
    const fetchControlPanelUrl = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "control_panel_url")
        .single();
      
      if (data?.setting_value) {
        setControlPanelUrl(data.setting_value);
      }
    };
    fetchControlPanelUrl();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-background/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight">
              <span className="text-primary">KINETIC</span>
              <span className="text-foreground">HOST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 rounded-full bg-card/40 backdrop-blur-xl border border-white/[0.08]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href 
                    ? 'bg-primary/15 text-primary shadow-sm shadow-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Hidden on mobile, shown in bottom nav */}
          <div className="hidden lg:flex items-center gap-4">
            <a 
              href={controlPanelUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary text-sm py-2.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Control Panel</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Control Panel Button - Simplified */}
          <a 
            href={controlPanelUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Panel</span>
          </a>
        </div>

        {/* Mobile Navigation - Hidden, using bottom nav instead */}
      </div>
    </nav>
  );
};
