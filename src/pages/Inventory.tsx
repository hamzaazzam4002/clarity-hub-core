import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertTriangle, Package, ArrowUpDown, History } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { productsApi, inventoryApi, type Product, type InventoryLog } from "@/lib/api";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productsApi.list(),
  });

  const { data: historyLogs = [] } = useQuery({
    queryKey: ["inventory-history", selectedProduct?.id],
    queryFn: () => inventoryApi.history(selectedProduct!.id),
    enabled: !!selectedProduct,
  });

  const lowStockCount = products.filter((p) => p.quantity <= 10 && p.quantity > 0).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  const filteredInventory = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = showLowStock ? p.quantity <= 10 : true;
    return matchesSearch && matchesLowStock;
  });

  const handleViewHistory = (product: Product) => {
    setSelectedProduct(product);
    setHistoryDialogOpen(true);
  };

  const columns = [
    {
      key: "product", label: "Product",
      render: (item: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "quantity", label: "Current Qty",
      render: (item: Product) => (
        <span className={item.quantity <= 10 ? "font-medium text-destructive" : ""}>{item.quantity} units</span>
      ),
    },
    {
      key: "status", label: "Status",
      render: (item: Product) => {
        if (item.quantity === 0) return <StatusBadge status="danger" label="Out of Stock" />;
        if (item.quantity <= 10) return <StatusBadge status="warning" label="Low Stock" />;
        return <StatusBadge status="active" label="In Stock" />;
      },
    },
    {
      key: "actions", label: "",
      render: (item: Product) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewHistory(item)}>
          <History className="mr-2 h-4 w-4" />History
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track and manage stock levels" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"><Package className="h-6 w-6 text-muted-foreground" /></div>
          <div><p className="text-2xl font-bold">{products.length}</p><p className="text-sm text-muted-foreground">Total Products</p></div>
        </CardContent></Card>
        <Card className="border-l-4 border-l-warning"><CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10"><AlertTriangle className="h-6 w-6 text-warning" /></div>
          <div><p className="text-2xl font-bold">{lowStockCount}</p><p className="text-sm text-muted-foreground">Low Stock Items</p></div>
        </CardContent></Card>
        <Card className="border-l-4 border-l-destructive"><CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10"><Package className="h-6 w-6 text-destructive" /></div>
          <div><p className="text-2xl font-bold">{outOfStockCount}</p><p className="text-sm text-muted-foreground">Out of Stock</p></div>
        </CardContent></Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant={showLowStock ? "default" : "outline"} onClick={() => setShowLowStock(!showLowStock)}>
          <AlertTriangle className="mr-2 h-4 w-4" />{showLowStock ? "Showing Low Stock" : "Show Low Stock"}
        </Button>
      </div>

      <DataTable columns={columns} data={filteredInventory} keyExtractor={(i) => i.id} emptyMessage={isLoading ? "Loading..." : "No inventory items found"} />

      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Stock Movement History</DialogTitle></DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">{selectedProduct.sku} • Current stock: {selectedProduct.quantity} units</p>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {historyLogs.length === 0 && <p className="py-4 text-center text-muted-foreground">No movement history</p>}
                {historyLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full ${log.type === "PURCHASE" || log.type === "RETURN" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{log.type}</p>
                        <p className="text-xs text-muted-foreground">{log.reference || "—"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${log.quantity > 0 ? "text-success" : "text-destructive"}`}>
                        {log.quantity > 0 ? "+" : ""}{log.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
