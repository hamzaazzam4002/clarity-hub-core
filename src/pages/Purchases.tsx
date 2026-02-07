import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, FileText, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Purchase {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  items: number;
  total: number;
  paid: number;
  status: "received" | "partial" | "pending" | "cancelled";
}

const mockPurchases: Purchase[] = [
  { id: "1", poNumber: "PO-2024-001", supplier: "Global Supplies Inc", date: "2024-01-15", items: 10, total: 5200.00, paid: 5200.00, status: "received" },
  { id: "2", poNumber: "PO-2024-002", supplier: "Tech Wholesale", date: "2024-01-14", items: 5, total: 3800.00, paid: 2000.00, status: "partial" },
  { id: "3", poNumber: "PO-2024-003", supplier: "Office Depot Pro", date: "2024-01-13", items: 15, total: 1200.00, paid: 0, status: "pending" },
  { id: "4", poNumber: "PO-2024-004", supplier: "Premium Electronics", date: "2024-01-12", items: 8, total: 4500.00, paid: 4500.00, status: "received" },
  { id: "5", poNumber: "PO-2024-005", supplier: "Furniture World", date: "2024-01-11", items: 3, total: 8900.00, paid: 0, status: "cancelled" },
];

export default function Purchases() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchases] = useState<Purchase[]>(mockPurchases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || purchase.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePurchase = () => {
    setDialogOpen(false);
    toast({
      title: "Purchase order created",
      description: "The purchase order has been successfully created.",
    });
  };

  const columns = [
    {
      key: "poNumber",
      label: "PO Number",
      render: (purchase: Purchase) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{purchase.poNumber}</p>
            <p className="text-sm text-muted-foreground">{purchase.items} items</p>
          </div>
        </div>
      ),
    },
    { key: "supplier", label: "Supplier" },
    {
      key: "date",
      label: "Date",
      render: (purchase: Purchase) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {purchase.date}
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (purchase: Purchase) => (
        <span className="font-medium">${purchase.total.toLocaleString()}</span>
      ),
    },
    {
      key: "paid",
      label: "Paid",
      render: (purchase: Purchase) => `$${purchase.paid.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (purchase: Purchase) => {
        const statusMap = {
          received: { status: "active" as const, label: "Received" },
          partial: { status: "warning" as const, label: "Partial" },
          pending: { status: "inactive" as const, label: "Pending" },
          cancelled: { status: "danger" as const, label: "Cancelled" },
        };
        const { status, label } = statusMap[purchase.status];
        return <StatusBadge status={status} label={label} />;
      },
    },
    {
      key: "actions",
      label: "",
      render: (purchase: Purchase) => (
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases"
        description="Manage your purchase orders"
        action={{
          label: "New Purchase",
          icon: Plus,
          onClick: () => setDialogOpen(true),
        }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search purchases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredPurchases}
        keyExtractor={(p) => p.id}
        emptyMessage="No purchases found"
      />

      {/* Create Purchase Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for inventory restocking.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Global Supplies Inc</SelectItem>
                  <SelectItem value="2">Tech Wholesale</SelectItem>
                  <SelectItem value="3">Office Depot Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Expected Delivery Date</Label>
              <Input type="date" />
            </div>
            <div className="grid gap-2">
              <Label>Notes</Label>
              <Input placeholder="Optional notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePurchase}>Create Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
