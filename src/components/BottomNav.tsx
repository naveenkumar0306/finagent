import { Home, Calendar, Plus, BarChart3, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

interface BottomNavProps {
  role: "agent" | "admin";
}

export const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const agentLinks = [
    { icon: Home, label: "Home", path: "/agent/dashboard" },
    { icon: Calendar, label: "Customers", path: "/agent/customers" },
    { icon: BarChart3, label: "Reports", path: "/agent/reports" },
    { icon: Settings, label: "Settings", path: "/agent/settings" },
  ];

  const adminLinks = [
    { icon: Home, label: "Home", path: "/admin/dashboard" },
    { icon: Calendar, label: "Customers", path: "/admin/customers" },
    { icon: BarChart3, label: "Reports", path: "/admin/reports" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const links = role === "agent" ? agentLinks : adminLinks;
  const addPath = role === "agent" ? "/agent/customers" : "/admin/customers";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around relative">
          {links.slice(0, 2).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => navigate(addPath)}
            className="w-14 h-14 rounded-full gradient-primary text-primary-foreground shadow-large flex items-center justify-center -mt-6 transition-transform hover:scale-105"
          >
            <Plus className="w-7 h-7" />
          </button>

          {links.slice(2).map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex flex-col items-center gap-1 py-2 px-4 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
