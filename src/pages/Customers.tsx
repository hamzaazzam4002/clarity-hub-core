import { useState } from "react";
import { Plus, Search, Eye, Edit, User, Mail, Phone, MapPin } from "lucide-react";
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

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  balance: number;
  status: "active" | "inactive";
}

const mockCustomers: Customer[] = [
  { id: "1", name: "Acme Corporation", email: "contact@acme.com", phone: "+1 555-123-4567", address: "123 Business St, New York", totalPurchases: 45200, balance: 0, status: "active" },
  { id: "2", name: "Tech Solutions Ltd", email: "info@techsolutions.com", phone: "+1 555-234-5678", address: "456 Tech Ave, San Francisco", totalPurchases: 28500, balance: 1800, status: "active" },
  { id: "3", name: "Global Trade Inc", email: "sales@globaltrade.com", phone: "+1 555-345-6789", address: "789 Trade Blvd, Chicago", totalPurchases: 67800, balance: 0, status: "active" },
  { id: "4", name: "Local Shop", email: "hello@localshop.com", phone: "+1 555-456-7890", address: "321 Main St, Boston", totalPurchases: 5400, balance: 950, status: "active" },
  { id: "5", name: "StartUp Hub", email: "team@startuphub.io", phone: "+1 555-567-8901", address: "654 Innovation Dr, Austin", totalPurchases: 12300, balance: 0, status: "inactive" },
];

export default function Customers() {
  const { toast } = useToast();
  const [customers] = useState<Customer[]>(mockCustomers);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statementOpen, setStatementOpen] = useState(false);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCustomer = () => {
    setDialogOpen(false);
    toast({
      title: "Customer added",
      description: "The customer has been successfully added.",
    });
  };

  const handleViewStatement = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStatementOpen(true);
  };

  const columns = [
    {
      key: "name",
      label: "Customer",
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      render: (customer: Customer) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {customer.phone}
        </div>
      ),
    },
    {
      key: "totalPurchases",
      label: "Total Purchases",
      render: (customer: Customer) => (
        <span className="font-medium">${customer.totalPurchases.toLocaleString()}</span>
      ),
    },
    {
      key: "balance",
      label: "Balance",
      render: (customer: Customer) => (
        <span className={customer.balance > 0 ? "font-medium text-destructive" : ""}>
          ${customer.balance.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (customer: Customer) => (
        <StatusBadge
          status={customer.status === "active" ? "active" : "inactive"}
          label={customer.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "actions",
      label: "",
      render: (customer: Customer) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleViewStatement(customer)}>
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
        title="Customers"
        description="Manage your customer database"
        action={{
          label: "Add Customer",
          icon: Plus,
          onClick: () => setDialogOpen(true),
        }}
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(c) => c.id}
        emptyMessage="No customers found"
      />

      {/* Add Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Customer Name</Label>
              <Input placeholder="Company or individual name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
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
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statement Dialog */}
      <Dialog open={statementOpen} onOpenChange={setStatementOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Statement</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <Card>
                <CardContent className="grid gap-4 p-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm">{selectedCustomer.address}</p>
                  </div>
                </CardContent>
              </Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Purchases</p>
                    <p className="text-2xl font-bold">${selectedCustomer.totalPurchases.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                    <p className={`text-2xl font-bold ${selectedCustomer.balance > 0 ? "text-destructive" : "text-success"}`}>
                      ${selectedCustomer.balance.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { date: "2024-01-15", type: "Invoice", ref: "INV-001", amount: 2500 },
                    { date: "2024-01-14", type: "Payment", ref: "PMT-001", amount: -2500 },
                    { date: "2024-01-10", type: "Invoice", ref: "INV-002", amount: 1800 },
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
