import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CollectionEntry = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, addCollection, calculateDueAmount, getRemainingAmount, getRemainingDays } = useData();
  
  const customer = customers.find((c) => c.id === customerId);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    multiDay: false,
    numDays: "1",
    notes: "",
  });

  if (!customer) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="p-8">
          <p className="text-center text-muted-foreground">Customer not found</p>
          <Button onClick={() => navigate("/agent/customers")} className="mt-4 w-full">
            Back to Customers
          </Button>
        </Card>
      </div>
    );
  }

  const dueAmount = calculateDueAmount(customer);
  const remainingAmount = getRemainingAmount(customer);
  const remainingDays = getRemainingDays(customer);
  const dailyAmount = customer.chitValue / customer.totalDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid collection amount",
        variant: "destructive",
      });
      return;
    }

    const currentAgentId = localStorage.getItem("currentAgentId") || "A001";
    const daysPaid = formData.multiDay ? parseInt(formData.numDays) : 1;

    addCollection({
      customerId: customer.id,
      agentId: currentAgentId,
      date: formData.date,
      amount: parseFloat(formData.amount),
      daysPaid,
      notes: formData.notes,
      isPartial: parseFloat(formData.amount) < dailyAmount,
    });

    toast({
      title: "Collection Recorded",
      description: `₹${formData.amount} collected from ${customer.name}`,
    });

    navigate("/agent/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/agent/customers")}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Record Collection</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-lg text-card-foreground">{customer.name}</h2>
              <p className="text-sm text-muted-foreground">{customer.id} • {customer.mobile}</p>
            </div>
            <Badge>{customer.chitType}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-semibold">₹{customer.chitValue}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Daily Amount</p>
              <p className="font-semibold">₹{dailyAmount.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Paid Days</p>
              <p className="font-semibold">{customer.paidDays}/{customer.totalDays}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining Days</p>
              <p className="font-semibold">{remainingDays}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Paid</p>
              <p className="font-semibold text-success">₹{customer.totalPaidAmount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Remaining</p>
              <p className="font-semibold text-destructive">₹{remainingAmount}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Due Now</p>
              <p className="font-semibold text-lg text-destructive">₹{dueAmount.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Collection Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="multiDay">Multi-Day Collection</Label>
              <Switch
                id="multiDay"
                checked={formData.multiDay}
                onCheckedChange={(checked) => setFormData({ ...formData, multiDay: checked })}
              />
            </div>

            {formData.multiDay && (
              <div className="space-y-2">
                <Label htmlFor="numDays">Number of Days</Label>
                <Input
                  id="numDays"
                  type="number"
                  min="1"
                  max={remainingDays}
                  value={formData.numDays}
                  onChange={(e) => setFormData({ ...formData, numDays: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Suggested amount: ₹{(dailyAmount * parseInt(formData.numDays || "1")).toFixed(0)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Amount Collected *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
              {formData.amount && parseFloat(formData.amount) < dailyAmount && (
                <p className="text-xs text-warning">Partial payment detected</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any remarks..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            <Save className="w-5 h-5 mr-2" />
            Save Collection
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CollectionEntry;
