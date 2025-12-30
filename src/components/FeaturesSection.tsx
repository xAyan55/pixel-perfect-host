import { Shield, Wifi, Cpu, MapPin, HeadphonesIcon, Eye } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Our Game Servers are protected behind PATH.Net DDoS protection with configured Game filters to stop heavy attacks."
  },
  {
    icon: Wifi,
    title: "Internet Speed",
    description: "All of our services are running on 10 Gb/s networks, providing the fastest possible upload/download speeds."
  },
  {
    icon: Cpu,
    title: "Powerful Hardware",
    description: "Both our Game and Web services are running on the latest hardware to provide the fastest performance to our users."
  },
  {
    icon: MapPin,
    title: "U.S Based Locations",
    description: "All of our services are currently based in the United States with fast response times!"
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Our support team is dedicated to keeping your time with us enjoyable! We all love gaming just like you!"
  },
  {
    icon: Eye,
    title: "Always Monitored",
    description: "We are always monitoring and making improvements to Sano and its infrastructure! When anything happens, we know immediately!"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
