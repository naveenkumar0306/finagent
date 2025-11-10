import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCustomersByAgent, calculateDueAmount, Customer } from "@/data/mockData";
import { useMemo, useState } from "react";

const AgentCustomers = () => {
  const navigate = useNavigate();
  const currentAgentId = localStorage.getItem("currentAgentId") || "A001";
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "overdue" | "completed">("all");

  const customers = useMemo(() => getCustomersByAgent(currentAgentId), [currentAgentId]);

  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    if (filter === "due") {
      filtered = filtered.filter((c) => c.status === "active" && calculateDueAmount(c) > 0);
    } else if (filter === "overdue") {
      filtered = filtered.filter((c) => c.status === "overdue");
    } else if (filter === "completed") {
      filtered = filtered.filter((c) => c.status === "completed");
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
  }, [customers, filter, searchQuery]);

  const renderCustomerCard = (customer: Customer) => {
    const dueAmount = calculateDueAmount(customer);
    const remainingAmount = customer.chitValue - customer.totalPaidAmount;

    return (
      <Card
        key={customer.id}
        className="p-4 cursor-pointer hover:border-primary transition-colors"
        onClick={() => navigate(`/agent/collect/${customer.id}`)}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-card-foreground">{customer.name}</h3>
            <p className="text-sm text-muted-foreground">{customer.id} • {customer.mobile}</p>
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
            {customer.chitType}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due Now:</span>
            <span className={`font-semibold ${dueAmount > 0 ? "text-destructive" : "text-success"}`}>
              ₹{dueAmount.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium">
              {customer.paidDays}/{customer.totalDays} days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paid Amount:</span>
            <span className="font-medium">₹{customer.totalPaidAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="font-medium">₹{remainingAmount}</span>
          </div>
          {customer.lastPaymentDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Payment:</span>
              <span className="text-xs">{new Date(customer.lastPaymentDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/agent/dashboard")}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">My Customers</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
      </div>

      <div className="p-4">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">No customers found</p>
            </Card>
          ) : (
            filteredCustomers.map(renderCustomerCard)
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCustomers;
