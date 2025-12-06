import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, Users, UserCog, DollarSign, TrendingUp, Calendar, Target, AlertTriangle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useMemo } from "react";
import { CircularProgress } from "@/components/CircularProgress";
import { BottomNav } from "@/components/BottomNav";
import { MetricCard } from "@/components/widgets/MetricCard";
import { WeeklyChart } from "@/components/widgets/WeeklyChart";
import { MonthlyBreakdown } from "@/components/widgets/MonthlyBreakdown";
import { WarningWidget } from "@/components/widgets/WarningWidget";
import { AgentPerformance } from "@/components/widgets/AgentPerformance";
import { RecentActivity } from "@/components/widgets/RecentActivity";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { customers, agents, getTodaysCollections, calculateDueAmount } = useData();

  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status !== "completed").length;
    const completedCustomers = customers.filter((c) => c.status === "completed").length;
    const activeAgents = agents.filter((a) => a.status === "active").length;
    
    const todaysCollections = getTodaysCollections();
    const todaysCollected = todaysCollections.reduce((sum, col) => sum + col.amount, 0);
    
    const totalDueToday = customers
      .filter((c) => c.status === "active" || c.status === "overdue")
      .reduce((sum, c) => sum + calculateDueAmount(c), 0);
    
    const overdueCustomers = customers.filter((c) => c.status === "overdue");
    const missedDues = overdueCustomers.length;

    const totalCollections = customers.reduce((sum, c) => sum + c.totalPaidAmount, 0);
    const totalExpected = customers.reduce((sum, c) => sum + c.chitValue, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollections / totalExpected) * 100) : 0;

    // Weekly calculation
    const weeklyTarget = 50000;
    const weeklyCollected = 38500;

    // Monthly calculation
    const monthlyTarget = 200000;
    const monthlyCollected = 145000;

    return {
      totalCustomers,
      activeCustomers,
      completedCustomers,
      activeAgents,
      todaysCollected,
      totalDueToday,
      missedDues,
      overdueCustomers,
      totalCollections,
      collectionRate,
      weeklyTarget,
      weeklyCollected,
      monthlyTarget,
      monthlyCollected,
    };
  }, [customers, agents, getTodaysCollections, calculateDueAmount]);

  const weeklyData = useMemo(() => {
    return [
      { name: "Mon", value: 5200, target: 7000 },
      { name: "Tue", value: 6800, target: 7000 },
      { name: "Wed", value: 4500, target: 7000 },
      { name: "Thu", value: 7200, target: 7000 },
      { name: "Fri", value: 5800, target: 7000 },
      { name: "Sat", value: 6000, target: 7000 },
      { name: "Sun", value: 3000, target: 7000 },
    ];
  }, []);

  const monthlyBreakdownData = useMemo(() => {
    return [
      { name: "Daily", value: 65000, color: "hsl(165 65% 55%)" },
      { name: "Weekly", value: 45000, color: "hsl(200 65% 55%)" },
      { name: "Monthly", value: 35000, color: "hsl(240 65% 55%)" },
    ];
  }, []);

  const warnings = useMemo(() => {
    return [
      {
        id: "1",
        type: "overdue" as const,
        title: "Overdue Payments",
        subtitle: `${stats.overdueCustomers.length} customers have overdue payments`,
        value: stats.totalDueToday >= 1000 ? `₹${(stats.totalDueToday / 1000).toFixed(1)}k` : `₹${stats.totalDueToday.toFixed(0)}`,
        severity: "high" as const,
      },
      {
        id: "2",
        type: "low_collection" as const,
        title: "Below Target",
        subtitle: "Weekly collection 23% below target",
        value: "-23%",
        severity: "medium" as const,
      },
      {
        id: "3",
        type: "pending" as const,
        title: "Pending Follow-ups",
        subtitle: "12 customers need follow-up calls",
        value: "12",
        severity: "low" as const,
      },
    ];
  }, [stats]);

  const agentPerformanceData = useMemo(() => {
    return agents.map((agent) => {
      const agentCustomers = customers.filter((c) => c.agentId === agent.id);
      const collected = agentCustomers.reduce((sum, c) => sum + c.totalPaidAmount, 0);
      const target = agentCustomers.reduce((sum, c) => sum + c.chitValue, 0);
      return {
        id: agent.id,
        name: agent.name,
        collected,
        target: target || 50000,
        customers: agentCustomers.length,
        efficiency: target > 0 ? Math.round((collected / target) * 100) : 0,
      };
    });
  }, [agents, customers]);

  const recentActivities = useMemo(() => {
    const todaysCollections = getTodaysCollections();
    return todaysCollections.slice(0, 4).map((col, index) => {
      const customer = customers.find(c => c.id === col.customerId);
      const agent = agents.find(a => a.id === col.agentId);
      return {
        id: col.id,
        type: "collection" as const,
        customerName: customer?.name || "Unknown",
        agentName: agent?.name || "Unknown",
        amount: col.amount,
        time: index === 0 ? "Just now" : `${(index + 1) * 5} mins ago`,
      };
    });
  }, [getTodaysCollections, customers, agents]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-3 sm:p-4 pb-3 sm:pb-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-soft flex items-center justify-center relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Summary Card */}
        <Card className="card-elevated p-4 sm:p-6 gradient-primary text-primary-foreground mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm opacity-90 mb-0.5 sm:mb-1">Overall Progress</p>
              <p className="text-base sm:text-lg font-semibold mb-0.5 sm:mb-1">Collection Rate</p>
              <p className="text-[10px] sm:text-xs opacity-75">{stats.completedCustomers} of {stats.totalCustomers} Completed</p>
            </div>
            <CircularProgress 
              percentage={stats.collectionRate} 
              size={90}
              strokeWidth={6}
            />
          </div>
        </Card>

        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MetricCard
            title="Total Customers"
            value={stats.totalCustomers}
            subtitle={`${stats.activeCustomers} active`}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            colorClass="bg-primary/10 text-primary"
          />
          <MetricCard
            title="Active Agents"
            value={stats.activeAgents}
            subtitle="All performing"
            icon={UserCog}
            colorClass="bg-accent/10 text-accent"
          />
          <MetricCard
            title="Today's Collection"
            value={stats.todaysCollected >= 1000 ? `₹${(stats.todaysCollected / 1000).toFixed(1)}k` : `₹${stats.todaysCollected}`}
            subtitle={stats.totalDueToday >= 1000 ? `Target: ₹${(stats.totalDueToday / 1000).toFixed(1)}k` : `Target: ₹${stats.totalDueToday.toFixed(0)}`}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            colorClass="bg-success/10 text-success"
          />
          <MetricCard
            title="Overdue"
            value={stats.missedDues}
            subtitle="Customers"
            icon={AlertTriangle}
            trend={{ value: 3, isPositive: false }}
            colorClass="bg-destructive/10 text-destructive"
          />
        </div>

        {/* Period Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <MetricCard
            title="This Week"
            value={`₹${(stats.weeklyCollected / 1000).toFixed(1)}k`}
            subtitle={`Goal: ₹${(stats.weeklyTarget / 1000).toFixed(0)}k`}
            icon={Calendar}
            trend={{ value: 15, isPositive: true }}
            colorClass="bg-blue-500/10 text-blue-500"
          />
          <MetricCard
            title="This Month"
            value={`₹${(stats.monthlyCollected / 1000).toFixed(0)}k`}
            subtitle={`Goal: ₹${(stats.monthlyTarget / 1000).toFixed(0)}k`}
            icon={Target}
            trend={{ value: 22, isPositive: true }}
            colorClass="bg-purple-500/10 text-purple-500"
          />
        </div>
      </div>

      {/* Charts and Widgets */}
      <div className="px-3 sm:px-4 space-y-3 sm:space-y-4">
        <WeeklyChart title="Weekly Collection Trend" data={weeklyData} />

        <MonthlyBreakdown title="Collection by Chit Type" data={monthlyBreakdownData} />

        <WarningWidget warnings={warnings} />

        <AgentPerformance agents={agentPerformanceData} />

        <RecentActivity activities={recentActivities} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            className="card-elevated p-3 sm:p-4 text-center hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/customers")}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground">Manage Customers</span>
          </button>
          
          <button
            className="card-elevated p-3 sm:p-4 text-center hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/agents")}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <UserCog className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            </div>
            <span className="text-xs sm:text-sm font-medium text-foreground">Manage Agents</span>
          </button>
        </div>

        <div className="h-4" />
      </div>

      <BottomNav role="admin" />
    </div>
  );
};

export default AdminDashboard;
