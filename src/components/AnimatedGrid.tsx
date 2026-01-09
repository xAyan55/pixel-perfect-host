export const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Animated horizontal lines */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-grid-line-h"
            style={{
              top: `${(i + 1) * 12.5}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
      
      {/* Animated vertical lines */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-grid-line-v"
            style={{
              left: `${(i + 1) * 12.5}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing intersection points */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary/60 animate-pulse-glow"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
