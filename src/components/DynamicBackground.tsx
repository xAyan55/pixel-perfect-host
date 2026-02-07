export const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Static mesh gradient layer - no animations */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />

      {/* Subtle static grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `
            linear-gradient(hsl(217 91% 60% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(217 91% 60% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
