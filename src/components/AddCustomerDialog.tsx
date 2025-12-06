import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChitType } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";
import { Plus } from "lucide-react";

interface AddCustomerDialogProps {
  trigger?: React.ReactNode;
}

export const AddCustomerDialog = ({ trigger }: AddCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { agents, addCustomer } = useData();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    address: "",
    chitType: "daily" as ChitType,
    chitValue: "",
    totalDays: "",
    agentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.chitValue || !formData.totalDays || !formData.agentId) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addCustomer({
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      chitType: formData.chitType,
      chitValue: parseFloat(formData.chitValue),
      totalDays: parseInt(formData.totalDays),
      startDate: new Date().toISOString().split("T")[0],
      agentId: formData.agentId,
    });

    toast({
      title: "Customer Added",
      description: `${formData.name} has been added successfully`,
    });

    setFormData({
      name: "",
      mobile: "",
      address: "",
      chitType: "daily",
      chitValue: "",
      totalDays: "",
      agentId: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chitType">Chit Type *</Label>
            <Select
              value={formData.chitType}
              onValueChange={(value: ChitType) => setFormData({ ...formData, chitType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="chitValue">Chit Value (₹) *</Label>
              <Input
                id="chitValue"
                type="number"
                placeholder="10000"
                value={formData.chitValue}
                onChange={(e) => setFormData({ ...formData, chitValue: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalDays">Total Days *</Label>
              <Input
                id="totalDays"
                type="number"
                placeholder="100"
                value={formData.totalDays}
                onChange={(e) => setFormData({ ...formData, totalDays: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent">Assign Agent *</Label>
            <Select
              value={formData.agentId}
              onValueChange={(value) => setFormData({ ...formData, agentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} ({agent.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
