import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, TrendingUp, TrendingDown } from "lucide-react";

interface AgentData {
  id: string;
  name: string;
  collected: number;
  target: number;
  customers: number;
  efficiency: number;
}

interface AgentPerformanceProps {
  agents: AgentData[];
}

export const AgentPerformance = ({ agents }: AgentPerformanceProps) => {
  return (
    <Card className="card-elevated p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Agent Performance</h3>
        <button className="text-[10px] sm:text-xs text-primary font-medium">View All</button>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {agents.map((agent, index) => {
          const percentage = Math.round((agent.collected / agent.target) * 100);
          const isAboveTarget = percentage >= 100;
          
          return (
            <div key={agent.id} className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">{agent.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{agent.customers} customers</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {isAboveTarget ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs sm:text-sm font-bold ${isAboveTarget ? "text-success" : "text-destructive"}`}>
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {agent.collected >= 1000 ? `₹${(agent.collected / 1000).toFixed(1)}k` : `₹${agent.collected}`} / {agent.target >= 1000 ? `₹${(agent.target / 1000).toFixed(1)}k` : `₹${agent.target}`}
                  </p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    isAboveTarget ? "bg-success" : "bg-primary"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
