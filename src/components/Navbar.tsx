import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Terminal, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Game Servers", href: "/game-servers" },
  { name: "Cloud VPS", href: "/cloud-vps" },
  { name: "Web Hosting", href: "/web-hosting" },
  { name: "Bot Hosting", href: "/bot-hosting" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/90 backdrop-blur-xl border-b border-border/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">KINETIC</span>
              <span className="text-foreground">HOST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-card/50 backdrop-blur-xl border border-border/50">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href 
                    ? 'bg-primary/20 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-xl bg-card/50 border border-border/50 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === link.href 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href={controlPanelUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary w-full justify-center mt-2" 
                onClick={() => setIsOpen(false)}
              >
                <Terminal className="w-4 h-4" />
                Control Panel
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
