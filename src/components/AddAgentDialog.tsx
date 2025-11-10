import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface AddAgentDialogProps {
  trigger?: React.ReactNode;
}

export const AddAgentDialog = ({ trigger }: AddAgentDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.mobile || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In real app, this would save to backend
    toast({
      title: "Agent Added",
      description: `${formData.name} has been added successfully`,
    });

    setFormData({
      name: "",
      mobile: "",
      password: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add New Agent
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Full Name *</Label>
            <Input
              id="agent-name"
              placeholder="Enter agent name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-mobile">Mobile Number *</Label>
            <Input
              id="agent-mobile"
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              maxLength={10}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-password">Password *</Label>
            <Input
              id="agent-password"
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
