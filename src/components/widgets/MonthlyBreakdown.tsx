import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MonthlyBreakdownProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
}

export const MonthlyBreakdown = ({ title, data }: MonthlyBreakdownProps) => {
  return (
    <Card className="card-elevated p-3 sm:p-4">
      <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-3 sm:mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-3 sm:mt-4">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] sm:text-xs text-muted-foreground">{item.name}</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground">₹{(item.value / 1000).toFixed(0)}k</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
