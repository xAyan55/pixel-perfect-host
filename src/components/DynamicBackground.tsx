import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const DynamicBackground = () => {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(217 91% 60% / 0.08)", // primary blue - reduced opacity
      "hsl(190 90% 50% / 0.06)", // accent cyan - reduced opacity
      "hsl(280 70% 50% / 0.04)", // purple - reduced opacity
    ];

    // Reduced to 3 orbs for subtler effect
    const newOrbs = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 400 + Math.random() * 300,
      color: colors[i % colors.length],
      duration: 30 + Math.random() * 20, // Slower animation
      delay: Math.random() * 5,
    }));
    setOrbs(newOrbs);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] bg-noise" />
      
      {/* Animated gradient orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full animate-orb-float"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}

      {/* Mesh gradient layer */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
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
