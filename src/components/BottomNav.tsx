import { Home, Users, Plus, UserCog, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface BottomNavProps {
  role: "agent" | "admin";
}

export const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("currentAgentId");
    localStorage.removeItem("currentRole");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  const agentLinks = [
    { icon: Home, label: "Home", path: "/agent/dashboard" },
    { icon: Users, label: "Customers", path: "/agent/customers" },
    { icon: LogOut, label: "Logout", action: handleLogout },
  ];

  const adminLinks = [
    { icon: Home, label: "Home", path: "/admin/dashboard" },
    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: UserCog, label: "Agents", path: "/admin/agents" },
    { icon: LogOut, label: "Logout", action: handleLogout },
  ];

  const links = role === "agent" ? agentLinks : adminLinks;
  const addPath = role === "agent" ? "/agent/customers" : "/admin/customers";

  const leftLinks = role === "agent" ? links.slice(0, 1) : links.slice(0, 2);
  const rightLinks = role === "agent" ? links.slice(1) : links.slice(2);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 safe-area-bottom z-50">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around relative">
          {leftLinks.map((link) => {
            const isActive = link.path ? location.pathname === link.path : false;
            return (
              <button
                key={link.label}
                onClick={() => link.path ? navigate(link.path) : link.action?.()}
                className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
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
            <Plus className="w-6 h-6" />
          </button>

          {rightLinks.map((link) => {
            const isActive = link.path ? location.pathname === link.path : false;
            return (
              <button
                key={link.label}
                onClick={() => link.path ? navigate(link.path) : link.action?.()}
                className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
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
