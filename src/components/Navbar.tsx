import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Terminal } from "lucide-react";
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">KINETIC</span>
              <span className="text-foreground">HOST</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? "text-primary" : ""}`}
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
              className="btn-outline text-sm py-2"
            >
              <Terminal className="w-4 h-4" />
              Control Panel
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`nav-link py-2 ${location.pathname === link.href ? "text-primary" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a 
                href={controlPanelUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary w-fit mt-2" 
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
