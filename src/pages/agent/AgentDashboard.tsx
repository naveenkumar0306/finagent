import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, Users, DollarSign, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCustomersByAgent,
  getTodaysCollections,
  calculateDueAmount,
  mockCustomers,
  mockAgents,
} from "@/data/mockData";
import { useMemo } from "react";
import { CircularProgress } from "@/components/CircularProgress";
import { BottomNav } from "@/components/BottomNav";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const currentAgentId = localStorage.getItem("currentAgentId") || "A001";
  const agent = mockAgents.find((a) => a.id === currentAgentId);
  
  const customers = useMemo(() => getCustomersByAgent(currentAgentId), [currentAgentId]);
  const todaysCollections = useMemo(() => getTodaysCollections(), []);

  const stats = useMemo(() => {
    const totalDue = customers
      .filter((c) => c.status === "active" || c.status === "overdue")
      .reduce((sum, c) => sum + calculateDueAmount(c), 0);
    
    const todaysCollected = todaysCollections
      .filter((col) => col.agentId === currentAgentId)
      .reduce((sum, col) => sum + col.amount, 0);

    const pendingCount = customers.filter(
      (c) => (c.status === "active" || c.status === "overdue") && calculateDueAmount(c) > 0
    ).length;

    const completedCount = customers.filter((c) => c.status === "completed").length;
    const completionRate = customers.length > 0 ? Math.round((completedCount / customers.length) * 100) : 0;

    return {
      totalCustomers: customers.length,
      totalDue,
      todaysCollected,
      pendingCount,
      completionRate,
    };
  }, [customers, todaysCollections, currentAgentId]);

  const dueToday = customers.filter(
    (c) => (c.status === "active" || c.status === "overdue") && calculateDueAmount(c) > 0
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="p-3 sm:p-4 pb-4 sm:pb-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <AddCustomerDialog
              trigger={
                <button className="px-3 sm:px-4 h-9 sm:h-10 rounded-xl gradient-primary text-primary-foreground shadow-soft flex items-center gap-1.5 sm:gap-2 font-medium">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Add</span>
                </button>
              }
            />
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="mb-3 sm:mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Good day, {agent?.name.split(' ')[0]}!</h1>
        </div>

        {/* Plan Card */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          <Card className="card-elevated p-6 gradient-primary text-primary-foreground relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">My Plan</p>
                <p className="text-lg font-semibold mb-1">For Today</p>
                <p className="text-xs opacity-75">{stats.pendingCount} of {stats.totalCustomers} Completed</p>
              </div>
              <CircularProgress 
                percentage={stats.completionRate} 
                size={100}
                strokeWidth={6}
              />
            </div>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Card className="card-elevated p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.totalCustomers}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Customers</p>
          </Card>
          
          <Card className="card-elevated p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">₹{Math.floor(stats.todaysCollected / 1000)}k</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Collected</p>
          </Card>

          <Card className="card-elevated p-3 sm:p-4 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-1.5 sm:mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            </div>
            <p className="text-lg sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.pendingCount}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Pending</p>
          </Card>
        </div>
      </div>

      {/* Today Activity */}
      <div className="px-3 sm:px-4 space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Today Activity</h2>
          <button 
            onClick={() => navigate("/agent/customers")}
            className="text-sm text-primary font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {dueToday.length === 0 ? (
            <Card className="card-elevated p-6">
              <p className="text-center text-muted-foreground text-sm">No pending collections for today</p>
            </Card>
          ) : (
            dueToday.slice(0, 5).map((customer, index) => {
              const dueAmount = calculateDueAmount(customer);
              const isCompleted = dueAmount === 0;
              return (
                <div
                  key={customer.id}
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => navigate(`/agent/collect/${customer.id}`)}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-1">
                    <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    {index < dueToday.length - 1 && (
                      <div className="w-0.5 h-12 bg-muted mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <Card className="card-elevated flex-1 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{customer.chitType} • {customer.mobile}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {dueAmount > 0 ? `₹${dueAmount.toFixed(0)}` : '06:30'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {customer.paidDays}/{customer.totalDays} days
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>

      <BottomNav role="agent" />
    </div>
  );
};

export default AgentDashboard;
