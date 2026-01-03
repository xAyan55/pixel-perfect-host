import { Star } from "lucide-react";

export const TrustpilotSection = () => {
  return (
    <section className="py-8 relative">
      <div className="container mx-auto px-6">
        <div className="rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#00b67a] text-[#00b67a]" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">
                Trusted by our customers
              </span>
            </div>
            
            <a 
              href="https://www.trustpilot.com/review/kinetichost.space" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="h-5" viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M33.875 10.658h-4.35V6.79h13.38v3.868h-4.342v15.17h-4.688V10.658zm14.53 1.02c1.17-.78 2.73-1.17 4.68-1.17 1.5 0 2.76.27 3.78.81 1.02.54 1.77 1.29 2.25 2.25.48.96.72 2.07.72 3.33v9h-4.14l-.36-1.68h-.12c-.42.6-.96 1.08-1.62 1.44-.66.36-1.5.54-2.52.54-1.38 0-2.52-.39-3.42-1.17-.9-.78-1.35-1.95-1.35-3.51 0-1.62.6-2.85 1.8-3.69 1.2-.84 2.97-1.29 5.31-1.35l1.68-.06v-.42c0-.72-.21-1.26-.63-1.62-.42-.36-1.02-.54-1.8-.54-.78 0-1.56.12-2.34.36-.78.24-1.53.54-2.25.9l-1.38-3.06c.84-.48 1.83-.87 2.97-1.17.12-.06.24-.09.36-.12zm4.23 7.17l-.96.03c-1.08.06-1.89.27-2.43.63-.54.36-.81.87-.81 1.53 0 .54.15.93.45 1.17.3.24.69.36 1.17.36.66 0 1.23-.18 1.71-.54.48-.36.78-.84.9-1.44l-.03-1.74zm9.42 7.02V6.79h4.68v18.87h-4.68zm8.28 0V6.79h4.68v18.87h-4.68z" fill="currentColor"/>
                <path d="M21.26 0l-4.83 14.87H0l13.11 9.53-4.83 14.87 13.11-9.53 13.11 9.53-4.83-14.87L42.78 14.87H26.46L21.26 0z" fill="#00b67a"/>
                <path d="M30.47 21.41l-1.1-3.39-8.11 5.9 9.21-2.51z" fill="#005128"/>
              </svg>
              <span className="text-sm">See all reviews</span>
            </a>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                rating: 5,
                title: "Amazing server performance!",
                text: "The servers are incredibly fast and reliable. Support team responds quickly to any issues.",
                author: "GameMaster2024"
              },
              {
                rating: 5,
                title: "Best hosting I've used",
                text: "Switched from another provider and the difference is night and day. Highly recommend!",
                author: "MinecraftPro"
              },
              {
                rating: 5,
                title: "Great value for money",
                text: "Affordable pricing with premium features. The control panel is easy to use too.",
                author: "ServerAdmin99"
              }
            ].map((review, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-card/60 border border-border/30 hover:border-[#00b67a]/30 transition-colors duration-300"
              >
                <div className="flex gap-0.5 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#00b67a] text-[#00b67a]" />
                  ))}
                </div>
                <h4 className="font-semibold text-foreground mb-1">{review.title}</h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{review.text}</p>
                <p className="text-xs text-muted-foreground/70">{review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
