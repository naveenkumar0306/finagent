import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockCustomers, mockAgents } from "@/data/mockData";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { EditCustomerDialog } from "@/components/EditCustomerDialog";

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");

  const filteredCustomers = useMemo(() => {
    let filtered = mockCustomers;

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    if (agentFilter !== "all") {
      filtered = filtered.filter((c) => c.agentId === agentFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.mobile.includes(query) ||
          c.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, statusFilter, agentFilter]);

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
          <h1 className="text-xl font-bold">Customer Management</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {mockAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AddCustomerDialog />

        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">No customers found</p>
            </Card>
          ) : (
            filteredCustomers.map((customer) => {
              const agent = mockAgents.find((a) => a.id === customer.agentId);
              const progress = (customer.paidDays / customer.totalDays) * 100;
              
              return (
                <Card key={customer.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">{customer.id}</p>
                      <p className="text-sm text-muted-foreground">{customer.mobile}</p>
                    </div>
                    <Badge
                      variant={
                        customer.status === "completed"
                          ? "secondary"
                          : customer.status === "overdue"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chit Type:</span>
                      <span className="font-medium capitalize">{customer.chitType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent:</span>
                      <span className="font-medium">{agent?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{customer.paidDays}/{customer.totalDays} days</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid Amount:</span>
                      <span className="font-semibold text-success">₹{customer.totalPaidAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining:</span>
                      <span className="font-semibold text-destructive">
                        ₹{customer.chitValue - customer.totalPaidAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <EditCustomerDialog customer={customer} />
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;
