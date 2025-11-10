import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockCollections, mockAgents, calculateDueAmount } from "@/data/mockData";
import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminReports = () => {
  const navigate = useNavigate();

  const reportData = useMemo(() => {
    const totalCustomers = mockCustomers.length;
    const activeCustomers = mockCustomers.filter((c) => c.status !== "completed").length;
    const totalCollections = mockCustomers.reduce((sum, c) => sum + c.totalPaidAmount, 0);
    const totalExpected = mockCustomers.reduce((sum, c) => sum + c.chitValue, 0);
    const overdueCustomers = mockCustomers.filter((c) => c.status === "overdue");
    const missedAmount = overdueCustomers.reduce((sum, c) => sum + calculateDueAmount(c), 0);

    const agentPerformance = mockAgents.map((agent) => {
      const customers = mockCustomers.filter((c) => c.agentId === agent.id);
      const collections = mockCollections.filter((col) => col.agentId === agent.id);
      const collected = collections.reduce((sum, col) => sum + col.amount, 0);
      const expected = customers.reduce((sum, c) => sum + (c.chitValue / c.totalDays), 0);
      
      return {
        name: agent.name,
        collected,
        expected,
        rate: expected > 0 ? ((collected / expected) * 100).toFixed(1) : "0",
      };
    });

    return {
      totalCustomers,
      activeCustomers,
      totalCollections,
      totalExpected,
      collectionRate: ((totalCollections / totalExpected) * 100).toFixed(1),
      overdueCount: overdueCustomers.length,
      missedAmount,
      agentPerformance,
    };
  }, []);

  const recentCollections = mockCollections.slice(-10).reverse();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Reports & Analytics</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Overall Summary</h3>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Customers:</span>
                  <span className="font-semibold">{reportData.totalCustomers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Customers:</span>
                  <span className="font-semibold">{reportData.activeCustomers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Expected:</span>
                  <span className="font-semibold">₹{reportData.totalExpected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Collected:</span>
                  <span className="font-semibold text-success">₹{reportData.totalCollections.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Collection Rate:</span>
                  <span className="font-semibold text-primary">{reportData.collectionRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overdue Customers:</span>
                  <span className="font-semibold text-destructive">{reportData.overdueCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Missed Amount:</span>
                  <span className="font-semibold text-destructive">₹{reportData.missedAmount.toFixed(0)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3 text-card-foreground">Recent Collections</h3>
              <div className="space-y-2">
                {recentCollections.map((collection) => {
                  const customer = mockCustomers.find((c) => c.id === collection.customerId);
                  return (
                    <div key={collection.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{customer?.name}</p>
                        <p className="text-xs text-muted-foreground">{collection.date}</p>
                      </div>
                      <Badge variant="outline">₹{collection.amount}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Agent Performance</h3>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-3">
                {reportData.agentPerformance.map((agent, index) => (
                  <Card key={index} className="p-3 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-card-foreground">{agent.name}</h4>
                      <Badge>{agent.rate}%</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Collected:</span>
                        <span className="font-semibold text-success">₹{agent.collected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected:</span>
                        <span className="font-medium">₹{agent.expected.toFixed(0)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="overdue" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-card-foreground">Overdue Customers</h3>
                <Badge variant="destructive">{reportData.overdueCount}</Badge>
              </div>

              <div className="space-y-3">
                {mockCustomers
                  .filter((c) => c.status === "overdue")
                  .map((customer) => {
                    const dueAmount = calculateDueAmount(customer);
                    const agent = mockAgents.find((a) => a.id === customer.agentId);
                    
                    return (
                      <Card key={customer.id} className="p-3 border-destructive/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-card-foreground">{customer.name}</h4>
                            <p className="text-xs text-muted-foreground">{customer.mobile}</p>
                            <p className="text-xs text-muted-foreground">Agent: {agent?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-destructive">₹{dueAmount.toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">due</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Last payment: {customer.lastPaymentDate ? new Date(customer.lastPaymentDate).toLocaleDateString() : "Never"}
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminReports;
