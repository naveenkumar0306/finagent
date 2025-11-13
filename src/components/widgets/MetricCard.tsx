import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorClass = "bg-primary/10 text-primary",
}: MetricCardProps) => {
  return (
    <Card className="card-elevated p-3 sm:p-4">
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        {trend && (
          <div
            className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
              trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">{value}</p>
        <p className="text-[10px] sm:text-xs text-muted-foreground">{title}</p>
        {subtitle && <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{subtitle}</p>}
      </div>
    </Card>
  );
};
