import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, UserCog, DollarSign, AlertTriangle, TrendingUp, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockAgents, getTodaysCollections, calculateDueAmount } from "@/data/mockData";
import { useMemo } from "react";

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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
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
          <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-1">
              <Users className="w-4 h-4" />
              <span>Total Clients</span>
            </div>
            <p className="text-2xl font-bold text-primary-foreground">{stats.activeCustomers}</p>
          </Card>

          <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-1">
              <UserCog className="w-4 h-4" />
              <span>Active Agents</span>
            </div>
            <p className="text-2xl font-bold text-primary-foreground">{stats.activeAgents}</p>
          </Card>

          <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-1">
              <DollarSign className="w-4 h-4" />
              <span>Today's Due</span>
            </div>
            <p className="text-xl font-bold text-primary-foreground">₹{stats.totalDueToday.toFixed(0)}</p>
          </Card>

          <Card className="bg-primary-foreground/10 border-primary-foreground/20 p-3">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Collected</span>
            </div>
            <p className="text-xl font-bold text-primary-foreground">₹{stats.todaysCollected.toFixed(0)}</p>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4">
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
            className="h-20 flex-col"
            onClick={() => navigate("/admin/customers")}
          >
            <Users className="w-6 h-6 mb-2" />
            <span className="text-xs">Customers</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/admin/agents")}
          >
            <UserCog className="w-6 h-6 mb-2" />
            <span className="text-xs">Agents</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/admin/reports")}
          >
            <FileText className="w-6 h-6 mb-2" />
            <span className="text-xs">Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col"
            onClick={() => navigate("/admin/reports")}
          >
            <AlertTriangle className="w-6 h-6 mb-2" />
            <span className="text-xs">Overdue</span>
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
