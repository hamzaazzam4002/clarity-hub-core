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

interface Sale {
  id: string;
  invoiceNo: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  paid: number;
  status: "paid" | "partial" | "pending" | "overdue";
}

const mockSales: Sale[] = [
  { id: "1", invoiceNo: "INV-2024-001", customer: "Acme Corporation", date: "2024-01-15", items: 5, total: 2500.00, paid: 2500.00, status: "paid" },
  { id: "2", invoiceNo: "INV-2024-002", customer: "Tech Solutions Ltd", date: "2024-01-15", items: 3, total: 1800.00, paid: 900.00, status: "partial" },
  { id: "3", invoiceNo: "INV-2024-003", customer: "Global Trade Inc", date: "2024-01-14", items: 8, total: 3200.00, paid: 3200.00, status: "paid" },
  { id: "4", invoiceNo: "INV-2024-004", customer: "Local Shop", date: "2024-01-14", items: 2, total: 950.00, paid: 0, status: "overdue" },
  { id: "5", invoiceNo: "INV-2024-005", customer: "StartUp Hub", date: "2024-01-13", items: 4, total: 1450.00, paid: 0, status: "pending" },
  { id: "6", invoiceNo: "INV-2024-006", customer: "Design Agency", date: "2024-01-13", items: 6, total: 2100.00, paid: 2100.00, status: "paid" },
  { id: "7", invoiceNo: "INV-2024-007", customer: "Coffee Corner", date: "2024-01-12", items: 1, total: 450.00, paid: 450.00, status: "paid" },
  { id: "8", invoiceNo: "INV-2024-008", customer: "Web Masters", date: "2024-01-12", items: 3, total: 1680.00, paid: 1000.00, status: "partial" },
];

export default function Sales() {
  const navigate = useNavigate();
  const [sales] = useState<Sale[]>(mockSales);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      sale.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.paid, 0);

  const columns = [
    {
      key: "invoiceNo",
      label: "Invoice",
      render: (sale: Sale) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{sale.invoiceNo}</p>
            <p className="text-sm text-muted-foreground">{sale.items} items</p>
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
    },
    {
      key: "date",
      label: "Date",
      render: (sale: Sale) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {sale.date}
        </div>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (sale: Sale) => (
        <span className="font-medium">${sale.total.toLocaleString()}</span>
      ),
    },
    {
      key: "paid",
      label: "Paid",
      render: (sale: Sale) => `$${sale.paid.toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      render: (sale: Sale) => {
        const statusMap = {
          paid: { status: "active" as const, label: "Paid" },
          partial: { status: "warning" as const, label: "Partial" },
          pending: { status: "inactive" as const, label: "Pending" },
          overdue: { status: "danger" as const, label: "Overdue" },
        };
        const { status, label } = statusMap[sale.status];
        return <StatusBadge status={status} label={label} />;
      },
    },
    {
      key: "actions",
      label: "",
      render: (sale: Sale) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/sales/${sale.id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Manage your sales and invoices"
        action={{
          label: "New Sale",
          icon: Plus,
          onClick: () => navigate("/sales/new"),
        }}
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Collected</p>
          <p className="text-2xl font-bold text-success">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSales}
        keyExtractor={(s) => s.id}
        emptyMessage="No sales found"
      />
    </div>
  );
}
