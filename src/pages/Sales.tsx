import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, FileText, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { salesApi, type Sale } from "@/lib/api";

export default function Sales() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: salesApi.list,
  });

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      (sale.customer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      sale.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || sale.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalPaid = sales.reduce((sum, s) => sum + s.amountPaid, 0);

  const columns = [
    {
      key: "id",
      label: "Sale",
      render: (sale: Sale) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{sale.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground">{sale.items.length} items</p>
          </div>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (sale: Sale) => sale.customer?.name || "Walk-in",
    },
    {
      key: "date",
      label: "Date",
      render: (sale: Sale) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(sale.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Total",
      render: (sale: Sale) => <span className="font-medium">${sale.totalAmount.toLocaleString()}</span>,
    },
    {
      key: "amountPaid",
      label: "Paid",
      render: (sale: Sale) => `$${sale.amountPaid.toLocaleString()}`,
    },
    {
      key: "paymentStatus",
      label: "Status",
      render: (sale: Sale) => {
        const map = {
          PAID: { status: "active" as const, label: "Paid" },
          PARTIAL: { status: "warning" as const, label: "Partial" },
          UNPAID: { status: "danger" as const, label: "Unpaid" },
        };
        const { status, label } = map[sale.paymentStatus];
        return <StatusBadge status={status} label={label} />;
      },
    },
    {
      key: "actions",
      label: "",
      render: (sale: Sale) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/sales/${sale.id}`)}>
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
        action={{ label: "New Sale", icon: Plus, onClick: () => navigate("/sales/new") }}
      />

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

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search sales..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredSales} keyExtractor={(s) => s.id} emptyMessage={isLoading ? "Loading..." : "No sales found"} />
    </div>
  );
}
