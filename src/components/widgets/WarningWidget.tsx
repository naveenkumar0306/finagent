import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, TrendingDown } from "lucide-react";

interface WarningItem {
  id: string;
  type: "overdue" | "pending" | "low_collection";
  title: string;
  subtitle: string;
  value: string;
  severity: "high" | "medium" | "low";
}

interface WarningWidgetProps {
  warnings: WarningItem[];
}

export const WarningWidget = ({ warnings }: WarningWidgetProps) => {
  const getIcon = (type: WarningItem["type"]) => {
    switch (type) {
      case "overdue":
        return AlertTriangle;
      case "pending":
        return Clock;
      case "low_collection":
        return TrendingDown;
    }
  };

  const getSeverityColor = (severity: WarningItem["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-muted/20";
    }
  };

  return (
    <Card className="card-elevated p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Warnings & Alerts</h3>
        <Badge variant="destructive" className="text-xs">
          {warnings.length}
        </Badge>
      </div>
      <div className="space-y-3">
        {warnings.map((warning) => {
          const Icon = getIcon(warning.type);
          return (
            <div
              key={warning.id}
              className={`p-3 rounded-xl border ${getSeverityColor(warning.severity)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${getSeverityColor(warning.severity)} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5">{warning.title}</p>
                  <p className="text-xs opacity-80">{warning.subtitle}</p>
                </div>
                <p className="text-sm font-bold">{warning.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
