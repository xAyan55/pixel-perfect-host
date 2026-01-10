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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.3)]' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="gradient-text">KINETIC</span>
              <span className="text-foreground">HOST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-card/30 backdrop-blur-xl border border-white/[0.05]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.href 
                    ? 'bg-primary/15 text-primary' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
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
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm overflow-hidden transition-all duration-300 bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_hsl(217_91%_60%/0.3)] hover:shadow-[0_0_30px_hsl(217_91%_60%/0.5)] hover:-translate-y-0.5"
            >
              <Terminal className="w-4 h-4" />
              <span>Control Panel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative p-2.5 rounded-xl bg-card/30 border border-white/[0.05] text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.05] animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === link.href 
                      ? 'bg-primary/15 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
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
