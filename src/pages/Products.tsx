import { useState } from "react";
import { Plus, Search, Filter, Eye, Edit, Package } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  status: "active" | "inactive";
}

const mockProducts: Product[] = [
  { id: "1", name: "Wireless Keyboard", sku: "KB-001", category: "Electronics", salePrice: 79.99, costPrice: 45.00, stock: 150, status: "active" },
  { id: "2", name: "USB-C Hub", sku: "HUB-002", category: "Electronics", salePrice: 49.99, costPrice: 25.00, stock: 85, status: "active" },
  { id: "3", name: "Office Chair", sku: "FRN-003", category: "Furniture", salePrice: 299.99, costPrice: 180.00, stock: 12, status: "active" },
  { id: "4", name: "Desk Lamp", sku: "LGT-004", category: "Lighting", salePrice: 45.99, costPrice: 22.00, stock: 0, status: "inactive" },
  { id: "5", name: "Monitor Stand", sku: "ACC-005", category: "Accessories", salePrice: 89.99, costPrice: 50.00, stock: 45, status: "active" },
  { id: "6", name: "Webcam HD", sku: "CAM-006", category: "Electronics", salePrice: 129.99, costPrice: 75.00, stock: 28, status: "active" },
  { id: "7", name: "Mouse Pad XL", sku: "ACC-007", category: "Accessories", salePrice: 24.99, costPrice: 8.00, stock: 200, status: "active" },
  { id: "8", name: "Headphones Pro", sku: "AUD-008", category: "Electronics", salePrice: 199.99, costPrice: 110.00, stock: 5, status: "active" },
];

export default function Products() {
  const [products] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const categories = [...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setDialogOpen(false);
    toast({
      title: "Product added",
      description: "The product has been successfully added.",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (product: Product) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "salePrice",
      label: "Sale Price",
      render: (product: Product) => `$${product.salePrice.toFixed(2)}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (product: Product) => (
        <span className={product.stock <= 10 ? "font-medium text-destructive" : ""}>
          {product.stock} units
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (product: Product) => (
        <StatusBadge
          status={product.status === "active" ? "active" : "inactive"}
          label={product.status === "active" ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (product: Product) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
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
        title="Products"
        description="Manage your product catalog"
        action={{
          label: "Add Product",
          icon: Plus,
          onClick: () => setDialogOpen(true),
        }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        emptyMessage="No products found"
      />

      {/* Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the product details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="PRD-001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input id="costPrice" type="number" placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input id="salePrice" type="number" placeholder="0.00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input id="stock" type="number" placeholder="0" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
