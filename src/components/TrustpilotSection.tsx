import { Star, Quote, ArrowRight } from "lucide-react";

const reviews = [
  {
    rating: 5,
    title: "Amazing server performance!",
    text: "The servers are incredibly fast and reliable. Support team responds quickly to any issues. Best decision switching here!",
    author: "GameMaster2024",
    date: "2 days ago",
    verified: true
  },
  {
    rating: 5,
    title: "Best hosting I've used",
    text: "Switched from another provider and the difference is night and day. Zero downtime, amazing speeds. Highly recommend!",
    author: "MinecraftPro",
    date: "1 week ago",
    verified: true
  },
  {
    rating: 5,
    title: "Great value for money",
    text: "Affordable pricing with premium features. The control panel is intuitive and easy to use. Perfect for beginners!",
    author: "ServerAdmin99",
    date: "2 weeks ago",
    verified: true
  }
];

export const TrustpilotSection = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00b67a]/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Trustpilot Logo & Rating */}
            <div className="flex items-center gap-3">
              <svg className="h-7" viewBox="0 0 126 31" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.26 0l-4.83 14.87H0l13.11 9.53-4.83 14.87 13.11-9.53 13.11 9.53-4.83-14.87L42.78 14.87H26.46L21.26 0z" fill="#00b67a"/>
                <path d="M30.47 21.41l-1.1-3.39-8.11 5.9 9.21-2.51z" fill="#005128"/>
              </svg>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 bg-[#00b67a] flex items-center justify-center">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            
            <div className="text-center sm:text-left">
              <p className="text-lg font-semibold text-foreground">Excellent</p>
              <p className="text-sm text-muted-foreground">Based on <span className="text-foreground font-medium">150+</span> reviews</p>
            </div>
          </div>
          
          <a 
            href="https://www.trustpilot.com/review/kinetichost.space" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#00b67a] hover:underline"
          >
            See all reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="group relative p-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-white/[0.05] hover:border-[#00b67a]/30 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00b67a]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Quote Icon */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-[#00b67a]/10 group-hover:text-[#00b67a]/20 transition-colors duration-300" />
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-[#00b67a] flex items-center justify-center rounded-sm">
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  ))}
                </div>
                
                {/* Content */}
                <h4 className="font-semibold text-foreground mb-2 text-lg">{review.title}</h4>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{review.text}</p>
                
                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00b67a]/20 to-[#00b67a]/5 flex items-center justify-center border border-[#00b67a]/20">
                        <span className="text-sm font-bold text-[#00b67a]">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      {review.verified && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00b67a] rounded-full flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.author}</p>
                      {review.verified && (
                        <p className="text-[10px] text-[#00b67a] uppercase tracking-wider">Verified</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
