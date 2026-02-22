import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Eye, Edit, User, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { customersApi, type Customer } from "@/lib/api";

export default function Customers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.list({ limit: 100 }),
  });

  const customers = data?.customers || [];

  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setDialogOpen(false);
      setFormData({ name: "", phone: "", email: "", address: "" });
      toast({ title: "Customer added" });
    },
    onError: (err: Error) => toast({ variant: "destructive", title: "Error", description: err.message }),
  });

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name", label: "Customer",
      render: (c: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.email || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone", label: "Phone",
      render: (c: Customer) => (
        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{c.phone}</div>
      ),
    },
    {
      key: "balance", label: "Balance",
      render: (c: Customer) => (
        <span className={c.balance > 0 ? "font-medium text-destructive" : ""}>
          ${Math.abs(c.balance).toLocaleString()}{c.balance < 0 ? " (credit)" : ""}
        </span>
      ),
    },
    {
      key: "isActive", label: "Status",
      render: (c: Customer) => <StatusBadge status={c.isActive ? "active" : "inactive"} label={c.isActive ? "Active" : "Inactive"} />,
    },
    {
      key: "actions", label: "",
      render: () => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />View</Button>
          <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage your customer database" action={{ label: "Add Customer", icon: Plus, onClick: () => setDialogOpen(true) }} />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <DataTable columns={columns} data={filteredCustomers} keyExtractor={(c) => c.id} emptyMessage={isLoading ? "Loading..." : "No customers found"} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Enter the customer details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input placeholder="+1 555-000-0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input placeholder="Full address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate({ name: formData.name, phone: formData.phone, email: formData.email || undefined, address: formData.address || undefined })} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Customer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
