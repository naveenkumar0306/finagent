import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "agent" | "admin") => {
    localStorage.setItem("userRole", role);
    if (role === "agent") {
      localStorage.setItem("currentAgentId", "A001"); // Default agent for MVP
      navigate("/agent/dashboard");
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Chit Collection</h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="grid gap-4">
          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleRoleSelect("agent")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-card-foreground">Agent / Executive</h3>
                <p className="text-sm text-muted-foreground">Field collector for recording payments</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:border-primary transition-colors"
            onClick={() => handleRoleSelect("admin")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <UserCog className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-card-foreground">Admin / Owner</h3>
                <p className="text-sm text-muted-foreground">Manage customers, agents, and reports</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>MVP Mode: Using static data</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
