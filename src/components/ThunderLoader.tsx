import { Zap } from "lucide-react";

export const ThunderLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" 
          style={{ width: 80, height: 80, transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} 
        />
        
        {/* Thunder icon container */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
          <Zap className="w-7 h-7 text-primary animate-thunder-pulse" />
        </div>
        
        {/* Rotating ring */}
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary/60 animate-spin" 
          style={{ animationDuration: '1s' }} 
        />
      </div>
      
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span className="animate-pulse">Loading</span>
        <span className="flex gap-0.5">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </span>
      </div>
    </div>
  );
};
