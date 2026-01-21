import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "kinetichost_cookie_consent";

export const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 md:p-6 shadow-2xl shadow-black/20">
          {/* Close button */}
          <button
            onClick={handleDecline}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Icon */}
            <div className="hidden md:flex w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-primary" />
            </div>

            {/* Text */}
            <div className="flex-1 pr-6 md:pr-0">
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                <Cookie className="w-4 h-4 text-primary md:hidden" />
                We use cookies
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, 
                analyze site traffic, and personalize content. By clicking "Accept All", 
                you consent to our use of cookies.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 md:flex-none"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
