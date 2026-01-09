import { Star, Quote } from "lucide-react";

const reviews = [
  {
    rating: 5,
    title: "Amazing server performance!",
    text: "The servers are incredibly fast and reliable. Support team responds quickly to any issues.",
    author: "GameMaster2024",
    date: "2 days ago"
  },
  {
    rating: 5,
    title: "Best hosting I've used",
    text: "Switched from another provider and the difference is night and day. Highly recommend!",
    author: "MinecraftPro",
    date: "1 week ago"
  },
  {
    rating: 5,
    title: "Great value for money",
    text: "Affordable pricing with premium features. The control panel is easy to use too.",
    author: "ServerAdmin99",
    date: "2 weeks ago"
  }
];

export const TrustpilotSection = () => {
  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Trustpilot Logo & Rating */}
            <div className="flex items-center gap-2">
              <svg className="h-6" viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.26 0l-4.83 14.87H0l13.11 9.53-4.83 14.87 13.11-9.53 13.11 9.53-4.83-14.87L42.78 14.87H26.46L21.26 0z" fill="#00b67a"/>
                <path d="M30.47 21.41l-1.1-3.39-8.11 5.9 9.21-2.51z" fill="#005128"/>
              </svg>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center">
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Excellent</span> • Based on 150+ reviews
            </p>
          </div>
          
          <a 
            href="https://www.trustpilot.com/review/kinetichost.space" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            See all reviews →
          </a>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="group relative p-5 rounded-xl bg-card/40 border border-border/30 hover:border-[#00b67a]/40 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-6 h-6 text-[#00b67a]/20 group-hover:text-[#00b67a]/40 transition-colors" />
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[#00b67a] flex items-center justify-center rounded-[2px]">
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                ))}
              </div>
              
              {/* Content */}
              <h4 className="font-semibold text-foreground mb-2">{review.title}</h4>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{review.text}</p>
              
              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#00b67a]/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-[#00b67a]">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{review.author}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
