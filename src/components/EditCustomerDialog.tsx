import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { mockAgents, Customer, ChitType } from "@/data/mockData";
import { Edit } from "lucide-react";

interface EditCustomerDialogProps {
  customer: Customer;
  trigger?: React.ReactNode;
}

export const EditCustomerDialog = ({ customer, trigger }: EditCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: customer.name,
    mobile: customer.mobile,
    address: customer.address,
    chitType: customer.chitType,
    chitValue: customer.chitValue.toString(),
    totalDays: customer.totalDays.toString(),
    agentId: customer.agentId,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: customer.name,
        mobile: customer.mobile,
        address: customer.address,
        chitType: customer.chitType,
        chitValue: customer.chitValue.toString(),
        totalDays: customer.totalDays.toString(),
        agentId: customer.agentId,
      });
    }
  }, [open, customer]);

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

    // In real app, this would update backend
    toast({
      title: "Customer Updated",
      description: `${formData.name}'s details have been updated`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name *</Label>
            <Input
              id="edit-name"
              placeholder="Enter customer name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-mobile">Mobile Number *</Label>
            <Input
              id="edit-mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Input
              id="edit-address"
              placeholder="Enter address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-chitType">Chit Type *</Label>
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
              <Label htmlFor="edit-chitValue">Chit Value (₹) *</Label>
              <Input
                id="edit-chitValue"
                type="number"
                placeholder="10000"
                value={formData.chitValue}
                onChange={(e) => setFormData({ ...formData, chitValue: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-totalDays">Total Days *</Label>
              <Input
                id="edit-totalDays"
                type="number"
                placeholder="100"
                value={formData.totalDays}
                onChange={(e) => setFormData({ ...formData, totalDays: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-agent">Assign Agent *</Label>
            <Select
              value={formData.agentId}
              onValueChange={(value) => setFormData({ ...formData, agentId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {mockAgents.map((agent) => (
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
              Update Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
