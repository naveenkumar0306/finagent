import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockAgents, mockCustomers, mockCollections } from "@/data/mockData";
import { useMemo } from "react";

const AdminAgents = () => {
  const navigate = useNavigate();

  const agentStats = useMemo(() => {
    return mockAgents.map((agent) => {
      const assignedCustomers = mockCustomers.filter((c) => c.agentId === agent.id);
      const activeCustomers = assignedCustomers.filter((c) => c.status !== "completed");
      const collections = mockCollections.filter((col) => col.agentId === agent.id);
      const totalCollected = collections.reduce((sum, col) => sum + col.amount, 0);
      const expectedCollections = assignedCustomers.reduce(
        (sum, c) => sum + (c.chitValue / c.totalDays),
        0
      );
      const collectionRate = expectedCollections > 0 ? (totalCollected / expectedCollections) * 100 : 0;

      return {
        ...agent,
        assignedCustomers: assignedCustomers.length,
        activeCustomers: activeCustomers.length,
        totalCollected,
        collectionRate: collectionRate.toFixed(1),
      };
    });
  }, []);

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
          <h1 className="text-xl font-bold">Agent Management</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add New Agent
        </Button>

        <div className="space-y-3">
          {agentStats.map((agent) => (
            <Card key={agent.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.id}</p>
                  <p className="text-sm text-muted-foreground">{agent.mobile}</p>
                </div>
                <Badge variant={agent.status === "active" ? "default" : "secondary"}>
                  {agent.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Users className="w-3 h-3" />
                    <span>Assigned</span>
                  </div>
                  <p className="text-xl font-bold text-card-foreground">{agent.assignedCustomers}</p>
                  <p className="text-xs text-muted-foreground">{agent.activeCustomers} active</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DollarSign className="w-3 h-3" />
                    <span>Collected</span>
                  </div>
                  <p className="text-xl font-bold text-success">₹{agent.totalCollected}</p>
                  <p className="text-xs text-muted-foreground">{agent.collectionRate}% rate</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Performance
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAgents;
