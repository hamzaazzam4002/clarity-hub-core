import { useState } from "react";
import { Search, AlertTriangle, Package, ArrowUpDown, History } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  currentQty: number;
  minQty: number;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  date: string;
  type: "in" | "out";
  quantity: number;
  reference: string;
  notes: string;
}

const mockInventory: InventoryItem[] = [
  { id: "1", productName: "Wireless Keyboard", sku: "KB-001", currentQty: 150, minQty: 20, lastUpdated: "2024-01-15" },
  { id: "2", productName: "USB-C Hub", sku: "HUB-002", currentQty: 85, minQty: 15, lastUpdated: "2024-01-14" },
  { id: "3", productName: "Office Chair", sku: "FRN-003", currentQty: 12, minQty: 10, lastUpdated: "2024-01-12" },
  { id: "4", productName: "Desk Lamp", sku: "LGT-004", currentQty: 0, minQty: 5, lastUpdated: "2024-01-10" },
  { id: "5", productName: "Monitor Stand", sku: "ACC-005", currentQty: 45, minQty: 10, lastUpdated: "2024-01-15" },
  { id: "6", productName: "Webcam HD", sku: "CAM-006", currentQty: 8, minQty: 15, lastUpdated: "2024-01-13" },
  { id: "7", productName: "Mouse Pad XL", sku: "ACC-007", currentQty: 200, minQty: 30, lastUpdated: "2024-01-15" },
  { id: "8", productName: "Headphones Pro", sku: "AUD-008", currentQty: 5, minQty: 10, lastUpdated: "2024-01-11" },
];

const mockMovements: StockMovement[] = [
  { id: "1", date: "2024-01-15", type: "in", quantity: 50, reference: "PO-001", notes: "Purchase order received" },
  { id: "2", date: "2024-01-15", type: "out", quantity: 5, reference: "SO-123", notes: "Sales order shipped" },
  { id: "3", date: "2024-01-14", type: "out", quantity: 3, reference: "SO-122", notes: "Sales order shipped" },
  { id: "4", date: "2024-01-13", type: "in", quantity: 20, reference: "PO-002", notes: "Restock" },
  { id: "5", date: "2024-01-12", type: "out", quantity: 8, reference: "SO-121", notes: "Sales order shipped" },
];

export default function Inventory() {
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const lowStockCount = inventory.filter((item) => item.currentQty <= item.minQty).length;
  const outOfStockCount = inventory.filter((item) => item.currentQty === 0).length;

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = showLowStock ? item.currentQty <= item.minQty : true;
    return matchesSearch && matchesLowStock;
  });

  const handleViewHistory = (item: InventoryItem) => {
    setSelectedProduct(item);
    setHistoryDialogOpen(true);
  };

  const columns = [
    {
      key: "product",
      label: "Product",
      render: (item: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{item.productName}</p>
            <p className="text-sm text-muted-foreground">{item.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: "currentQty",
      label: "Current Qty",
      render: (item: InventoryItem) => (
        <span className={item.currentQty <= item.minQty ? "font-medium text-destructive" : ""}>
          {item.currentQty} units
        </span>
      ),
    },
    {
      key: "minQty",
      label: "Min Qty",
      render: (item: InventoryItem) => `${item.minQty} units`,
    },
    {
      key: "status",
      label: "Status",
      render: (item: InventoryItem) => {
        if (item.currentQty === 0) {
          return <StatusBadge status="danger" label="Out of Stock" />;
        }
        if (item.currentQty <= item.minQty) {
          return <StatusBadge status="warning" label="Low Stock" />;
        }
        return <StatusBadge status="active" label="In Stock" />;
      },
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
    },
    {
      key: "actions",
      label: "",
      render: (item: InventoryItem) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewHistory(item)}
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track and manage stock levels"
      />

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inventory.length}</p>
              <p className="text-sm text-muted-foreground">Total Products</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStockCount}</p>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Package className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showLowStock ? "default" : "outline"}
          onClick={() => setShowLowStock(!showLowStock)}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          {showLowStock ? "Showing Low Stock" : "Show Low Stock"}
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredInventory}
        keyExtractor={(i) => i.id}
        emptyMessage="No inventory items found"
      />

      {/* History Dialog */}
      <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stock Movement History</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">{selectedProduct.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.sku} • Current stock: {selectedProduct.currentQty} units
                </p>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {mockMovements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          movement.type === "in"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{movement.reference}</p>
                        <p className="text-xs text-muted-foreground">{movement.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          movement.type === "in" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {movement.type === "in" ? "+" : "-"}{movement.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{movement.date}</p>
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
