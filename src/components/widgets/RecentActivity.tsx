import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: "collection" | "missed" | "pending";
  customerName: string;
  agentName: string;
  amount: number;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "collection":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "missed":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const getTypeLabel = (type: Activity["type"]) => {
    switch (type) {
      case "collection":
        return "Collected";
      case "missed":
        return "Missed";
      case "pending":
        return "Pending";
    }
  };

  return (
    <Card className="card-elevated p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-card-foreground">Recent Activity</h3>
        <button className="text-[10px] sm:text-xs text-primary font-medium">View All</button>
      </div>
      <div className="space-y-2.5 sm:space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
            <div className="flex flex-col items-center mt-0.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted flex items-center justify-center">
                {getIcon(activity.type)}
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 h-6 sm:h-8 bg-muted mt-1" />
              )}
            </div>
            <div className="flex-1 pb-1 sm:pb-2">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{activity.customerName}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">by {activity.agentName}</p>
                </div>
                <Badge
                  variant={
                    activity.type === "collection"
                      ? "default"
                      : activity.type === "missed"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-[10px] sm:text-xs"
                >
                  {getTypeLabel(activity.type)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-foreground">₹{activity.amount}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
