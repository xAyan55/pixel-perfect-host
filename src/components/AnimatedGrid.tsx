// Simplified static grid - no continuous animations
export const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {/* Static grid pattern instead of animated lines */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(217 91% 60% / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(217 91% 60% / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '12.5% 12.5%'
        }} 
      />
    </div>
  );
};
