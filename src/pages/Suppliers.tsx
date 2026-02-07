import { useState } from "react";
import { Plus, Search, Eye, Edit, Building2, Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  balance: number;
  status: "active" | "inactive";
}

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Global Supplies Inc", email: "orders@globalsupplies.com", phone: "+1 555-111-2222", address: "100 Warehouse Way, Los Angeles", totalOrders: 125000, balance: 5200, status: "active" },
  { id: "2", name: "Tech Wholesale", email: "sales@techwholesale.com", phone: "+1 555-222-3333", address: "200 Tech Park, San Jose", totalOrders: 89000, balance: 0, status: "active" },
  { id: "3", name: "Office Depot Pro", email: "business@officedepot.com", phone: "+1 555-333-4444", address: "300 Office Blvd, Dallas", totalOrders: 45000, balance: 1200, status: "active" },
  { id: "4", name: "Premium Electronics", email: "supply@premiumelec.com", phone: "+1 555-444-5555", address: "400 Electronics Ave, Seattle", totalOrders: 156000, balance: 0, status: "active" },
  { id: "5", name: "Furniture World", email: "wholesale@furnitureworld.com", phone: "+1 555-555-6666", address: "500 Furniture Lane, Portland", totalOrders: 34000, balance: 8900, status: "inactive" },
];

export default function Suppliers() {
  const { toast } = useToast();
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [statementOpen, setStatementOpen] = useState(false);

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSupplier = () => {
    setDialogOpen(false);
    toast({
      title: "Supplier added",
      description: "The supplier has been successfully added.",
    });
  };

  const handleViewStatement = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setStatementOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "Supplier",
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{supplier.name}</p>
            <p className="text-sm text-muted-foreground">{supplier.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {supplier.phone}
        </div>
      ),
    },
    {
      key: "totalOrders",
      label: "Total Orders",
      render: (supplier: Supplier) => (
        <span className="font-medium">${supplier.totalOrders.toLocaleString()}</span>
      ),
    },
    {
      key: "balance",
      label: "We Owe",
      render: (supplier: Supplier) => (
        <span className={supplier.balance > 0 ? "font-medium text-warning" : ""}>
          ${supplier.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (supplier: Supplier) => (
        <StatusBadge
          status={supplier.status === "active" ? "active" : "inactive"}
          label={supplier.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (supplier: Supplier) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewStatement(supplier)}>
            <Eye className="mr-2 h-4 w-4" />
            Statement
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your supplier database"
        action={{
          label: "Add Supplier",
          icon: Plus,
          onClick: () => setDialogOpen(true),
        }}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSuppliers}
        keyExtractor={(s) => s.id}
        emptyMessage="No suppliers found"
      />

      {/* Add Supplier Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter the supplier details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Supplier Name</Label>
              <Input placeholder="Company name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@supplier.com" />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input placeholder="+1 555-000-0000" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input placeholder="Full address" />
            </div>
            <div className="grid gap-2">
              <Label>Contact Person</Label>
              <Input placeholder="Contact name" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statement Dialog */}
      <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Supplier Statement</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-6">
              <Card>
                <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedSupplier.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedSupplier.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">{selectedSupplier.address}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">${selectedSupplier.totalOrders.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                    <p className={`text-2xl font-bold ${selectedSupplier.balance > 0 ? "text-warning" : "text-success"}`}>
                      ${selectedSupplier.balance.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { date: "2024-01-15", type: "Purchase", ref: "PO-001", amount: 5200 },
                    { date: "2024-01-12", type: "Payment", ref: "PMT-001", amount: -3000 },
                    { date: "2024-01-10", type: "Purchase", ref: "PO-002", amount: 3800 },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{tx.type} - {tx.ref}</p>
                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                      </div>
                      <span className={tx.amount > 0 ? "font-medium" : "font-medium text-success"}>
                        {tx.amount > 0 ? `$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
