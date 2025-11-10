import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserCog, DollarSign, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockAgents, getTodaysCollections, calculateDueAmount } from "@/data/mockData";
import { useMemo } from "react";
import { CollectionChart } from "@/components/CollectionChart";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const activeCustomers = mockCustomers.filter((c) => c.status !== "completed").length;
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

    return {
      activeCustomers,
      activeAgents,
      todaysCollected,
      totalDueToday,
      missedDues,
      totalCollections,
    };
  }, []);

  const recentCustomers = mockCustomers.slice(0, 5);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      name: month,
      value: Math.floor(Math.random() * 50000) + 20000,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-primary text-primary-foreground p-4 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span>Total Clients</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{stats.activeCustomers}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <UserCog className="w-4 h-4" />
              </div>
              <span>Active Agents</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{stats.activeAgents}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span>Today's Due</span>
            </div>
            <p className="text-2xl font-bold text-primary-foreground">₹{stats.totalDueToday.toFixed(0)}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span>Collected</span>
            </div>
            <p className="text-2xl font-bold text-primary-foreground">₹{stats.todaysCollected.toFixed(0)}</p>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <CollectionChart
          title="Monthly Collections"
          data={monthlyData}
          color="hsl(145 65% 45%)"
        />

        <Card className="p-4 shadow-medium">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">Summary</h3>
          </div>
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
              <span className="text-muted-foreground">Collection Rate:</span>
              <span className="font-semibold">
                {((stats.todaysCollected / Math.max(stats.totalDueToday, 1)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-24 flex-col shadow-soft hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/customers")}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Customers</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col shadow-soft hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/agents")}
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <UserCog className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-medium">Agents</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col shadow-soft hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/reports")}
          >
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium">Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col shadow-soft hover:shadow-medium transition-all"
            onClick={() => navigate("/admin/reports")}
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm font-medium">Overdue</span>
          </Button>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-foreground">Recent Customers</h3>
          <div className="space-y-2">
            {recentCustomers.map((customer) => (
              <Card key={customer.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-card-foreground">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.id}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={customer.status === "overdue" ? "destructive" : "secondary"} className="text-xs">
                      {customer.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      ₹{customer.totalPaidAmount}/{customer.chitValue}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
