import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface GameCardProps {
  name: string;
  description: string;
  imageUrl: string;
  href: string;
  popular?: boolean;
  index?: number;
}

export function GameCard({ name, description, imageUrl, href, popular = false, index = 0 }: GameCardProps) {
  return (
    <Link
      to={href}
      className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
      style={{
        animationDelay: `${index * 100}ms`,
        opacity: 0,
        animation: `slide-up-fade 0.5s ease-out ${index * 100}ms forwards`,
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 p-6 h-72 flex flex-col justify-end">
        {popular && (
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            Popular
          </Badge>
        )}
        
        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
          View Plans
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
