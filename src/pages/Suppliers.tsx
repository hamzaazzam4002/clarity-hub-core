import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Eye, Edit, Building2, Phone } from "lucide-react";
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
import { suppliersApi, type Supplier } from "@/lib/api";

export default function Suppliers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: suppliersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: suppliersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      setDialogOpen(false);
      setFormData({ name: "", email: "", phone: "", address: "" });
      toast({ title: "Supplier added" });
    },
    onError: (err: Error) => toast({ variant: "destructive", title: "Error", description: err.message }),
  });

  const filteredSuppliers = suppliers.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name", label: "Supplier",
      render: (s: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-sm text-muted-foreground">{s.email || "—"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone", label: "Phone",
      render: (s: Supplier) => (
        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{s.phone || "—"}</div>
      ),
    },
    {
      key: "balance", label: "Balance",
      render: (s: Supplier) => (
        <span className={s.balance > 0 ? "font-medium text-warning" : ""}>${s.balance.toLocaleString()}</span>
      ),
    },
    {
      key: "isActive", label: "Status",
      render: (s: Supplier) => <StatusBadge status={s.isActive ? "active" : "inactive"} label={s.isActive ? "Active" : "Inactive"} />,
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
      <PageHeader title="Suppliers" description="Manage your supplier database" action={{ label: "Add Supplier", icon: Plus, onClick: () => setDialogOpen(true) }} />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      <DataTable columns={columns} data={filteredSuppliers} keyExtractor={(s) => s.id} emptyMessage={isLoading ? "Loading..." : "No suppliers found"} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>Enter the supplier details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Supplier Name</Label>
              <Input placeholder="Company name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@supplier.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
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
            <Button onClick={() => createMutation.mutate({ name: formData.name, email: formData.email || undefined, phone: formData.phone || undefined, address: formData.address || undefined })} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Supplier"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
