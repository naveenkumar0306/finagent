import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getCustomersByAgent,
  getTodaysCollections,
  calculateDueAmount,
  mockCustomers,
} from "@/data/mockData";
import { useMemo } from "react";
import { CollectionChart } from "@/components/CollectionChart";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const currentAgentId = localStorage.getItem("currentAgentId") || "A001";
  
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

    return {
      totalCustomers: customers.length,
      totalDue,
      todaysCollected,
      pendingCount,
    };
  }, [customers, todaysCollections, currentAgentId]);

  const dueToday = customers.filter(
    (c) => (c.status === "active" || c.status === "overdue") && calculateDueAmount(c) > 0
  );

  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, index) => ({
      name: day,
      value: Math.floor(Math.random() * 5000) + 2000,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-xl font-bold">Agent Dashboard</h1>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span>Customers</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{stats.totalCustomers}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span>Pending</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">{stats.pendingCount}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span>Total Due</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">₹{stats.totalDue.toFixed(0)}</p>
          </Card>

          <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 p-4 shadow-soft">
            <div className="flex items-center gap-2 text-primary-foreground/80 text-xs mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span>Collected</span>
            </div>
            <p className="text-3xl font-bold text-primary-foreground">₹{stats.todaysCollected.toFixed(0)}</p>
          </Card>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <CollectionChart title="This Week's Collections" data={weeklyData} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Due Today</h2>
          <Button size="sm" onClick={() => navigate("/agent/customers")}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {dueToday.length === 0 ? (
            <Card className="p-6 shadow-soft">
              <p className="text-center text-muted-foreground">No pending collections for today</p>
            </Card>
          ) : (
            dueToday.map((customer) => {
              const dueAmount = calculateDueAmount(customer);
              return (
                <Card
                  key={customer.id}
                  className="p-4 cursor-pointer hover:border-primary transition-all hover:shadow-medium"
                  onClick={() => navigate(`/agent/collect/${customer.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.mobile}</p>
                    </div>
                    <Badge variant={customer.status === "overdue" ? "destructive" : "default"}>
                      {customer.chitType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Due Amount:</span>
                    <span className="font-semibold text-destructive">₹{dueAmount.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid: {customer.paidDays}/{customer.totalDays} days</span>
                    <span className="text-muted-foreground">₹{customer.totalPaidAmount}</span>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <Button
          className="w-full gradient-primary shadow-medium"
          size="lg"
          onClick={() => navigate("/agent/customers")}
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Collection
        </Button>
      </div>
    </div>
  );
};

export default AgentDashboard;
