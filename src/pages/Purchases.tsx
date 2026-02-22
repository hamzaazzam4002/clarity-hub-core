import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, FileText, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { purchasesApi, type Purchase } from "@/lib/api";

export default function Purchases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["purchases"],
    queryFn: purchasesApi.list,
  });

  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch = p.supplier.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: "id", label: "Purchase",
      render: (p: Purchase) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{p.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-muted-foreground">{p.items.length} items</p>
          </div>
        </div>
      ),
    },
    { key: "supplier", label: "Supplier", render: (p: Purchase) => p.supplier.name },
    {
      key: "date", label: "Date",
      render: (p: Purchase) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />{new Date(p.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    { key: "totalAmount", label: "Total", render: (p: Purchase) => <span className="font-medium">${p.totalAmount.toLocaleString()}</span> },
    { key: "amountPaid", label: "Paid", render: (p: Purchase) => `$${p.amountPaid.toLocaleString()}` },
    {
      key: "status", label: "Status",
      render: (p: Purchase) => {
        const map = { PAID: { status: "active" as const, label: "Paid" }, PARTIAL: { status: "warning" as const, label: "Partial" }, UNPAID: { status: "danger" as const, label: "Unpaid" } };
        const { status, label } = map[p.status];
        return <StatusBadge status={status} label={label} />;
      },
    },
    {
      key: "actions", label: "",
      render: () => <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />View</Button>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Purchases" description="Manage your purchase orders" action={{ label: "New Purchase", icon: Plus, onClick: () => navigate("/purchases/new") }} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search purchases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PARTIAL">Partial</SelectItem>
            <SelectItem value="UNPAID">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredPurchases} keyExtractor={(p) => p.id} emptyMessage={isLoading ? "Loading..." : "No purchases found"} />
    </div>
  );
}
