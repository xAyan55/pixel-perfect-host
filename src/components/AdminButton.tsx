import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

export const AdminButton = () => {
  return (
    <Link
      to="/admin"
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-card/80 border border-border/50 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all shadow-lg"
      title="Admin Panel"
    >
      <Settings className="w-4 h-4" />
    </Link>
  );
};
