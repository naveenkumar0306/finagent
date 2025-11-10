import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, Bell, Users, UserCog, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockAgents, getTodaysCollections, calculateDueAmount } from "@/data/mockData";
import { useMemo } from "react";
import { CircularProgress } from "@/components/CircularProgress";
import { BottomNav } from "@/components/BottomNav";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter((c) => c.status !== "completed").length;
    const completedCustomers = mockCustomers.filter((c) => c.status === "completed").length;
    const activeAgents = mockAgents.filter((a) => a.status === "active").length;
    
    const todaysCollections = getTodaysCollections();
    const todaysCollected = todaysCollections.reduce((sum, col) => sum + col.amount, 0);
    
    const totalDueToday = mockCustomers
      .filter((c) => c.status === "active" || c.status === "overdue")
      .reduce((sum, c) => sum + calculateDueAmount(c), 0);
    
    const missedDues = mockCustomers.filter(
      (c) => c.status === "overdue" || (c.status === "active" && calculateDueAmount(c) > 0)
    ).length;

    const totalCollections = mockCustomers.reduce((sum, c) => sum + c.totalPaidAmount, 0);
    const totalExpected = mockCustomers.reduce((sum, c) => sum + c.chitValue, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollections / totalExpected) * 100) : 0;

    return {
      totalCustomers,
      activeCustomers,
      completedCustomers,
      activeAgents,
      todaysCollected,
      totalDueToday,
      missedDues,
      totalCollections,
      collectionRate,
    };
  }, []);

  const recentCustomers = mockCustomers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-4 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-card shadow-soft flex items-center justify-center">
            <Bell className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Summary Card */}
        <Card className="card-elevated p-6 gradient-primary text-primary-foreground mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm opacity-90 mb-1">Overall Progress</p>
              <p className="text-lg font-semibold mb-1">Collection Rate</p>
              <p className="text-xs opacity-75">{stats.completedCustomers} of {stats.totalCustomers} Completed</p>
            </div>
            <CircularProgress 
              percentage={stats.collectionRate} 
              size={100}
              strokeWidth={6}
            />
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="card-elevated p-3 text-center">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{stats.totalCustomers}</p>
            <p className="text-xs text-muted-foreground">Clients</p>
          </Card>
          
          <Card className="card-elevated p-3 text-center">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <UserCog className="w-4 h-4 text-accent" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{stats.activeAgents}</p>
            <p className="text-xs text-muted-foreground">Agents</p>
          </Card>

          <Card className="card-elevated p-3 text-center">
            <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">₹{Math.floor(stats.todaysCollected / 1000)}k</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </Card>

          <Card className="card-elevated p-3 text-center">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-xl font-bold text-foreground mb-0.5">{stats.missedDues}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="card-elevated p-4 mb-4">
          <h3 className="font-semibold text-card-foreground mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Collections:</span>
              <span className="font-semibold text-success">₹{stats.totalCollections.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Missed Dues:</span>
              <span className="font-semibold text-destructive">{stats.missedDues} customers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Today's Target:</span>
              <span className="font-semibold">₹{stats.totalDueToday.toFixed(0)}</span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="card-elevated p-4 text-center hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/customers")}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">Customers</span>
          </button>
          
          <button
            className="card-elevated p-4 text-center hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/agents")}
          >
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <UserCog className="w-6 h-6 text-accent" />
            </div>
            <span className="text-sm font-medium text-foreground">Agents</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-foreground">Recent Customers</h3>
          <div className="space-y-2">
            {recentCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className={`w-3 h-3 rounded-full ${customer.status === 'completed' ? 'bg-primary' : 'bg-muted-foreground'}`} />
                  {index < recentCustomers.length - 1 && (
                    <div className="w-0.5 h-12 bg-muted mt-1" />
                  )}
                </div>
                <Card className="card-elevated flex-1 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.id} • {customer.mobile}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={customer.status === "overdue" ? "destructive" : "secondary"} className="text-xs mb-1">
                        {customer.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        ₹{customer.totalPaidAmount}/₹{customer.chitValue}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav role="admin" />
    </div>
  );
};

export default AdminDashboard;
