import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { productsApi, type Product } from "@/lib/api";

export default function Products() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", sku: "", category: "", costPrice: "", salePrice: "", quantity: "", description: "" });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", search, categoryFilter === "all" ? undefined : categoryFilter],
    queryFn: () => productsApi.list({ search: search || undefined, category: categoryFilter === "all" ? undefined : categoryFilter }),
  });

  const createMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDialogOpen(false);
      setFormData({ name: "", sku: "", category: "", costPrice: "", salePrice: "", quantity: "", description: "" });
      toast({ title: "Product added", description: "The product has been successfully added." });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    createMutation.mutate({
      name: formData.name,
      sku: formData.sku,
      price: Number(formData.salePrice) || 0,
      costPrice: Number(formData.costPrice) || undefined,
      quantity: Number(formData.quantity) || undefined,
      category: formData.category || undefined,
      description: formData.description || undefined,
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
    { key: "category", label: "Category", render: (p: Product) => p.category || "—" },
    {
      key: "price",
      label: "Sale Price",
      render: (product: Product) => `$${product.price.toFixed(2)}`,
    },
    {
      key: "quantity",
      label: "Stock",
      render: (product: Product) => (
        <span className={product.quantity <= 10 ? "font-medium text-destructive" : ""}>
          {product.quantity} units
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (product: Product) => (
        <StatusBadge
          status={product.isActive ? "active" : "inactive"}
          label={product.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
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
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        emptyMessage={isLoading ? "Loading..." : "No products found"}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>Enter the product details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" placeholder="Enter product name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="PRD-001" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="Electronics" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="costPrice">Cost Price</Label>
                <Input id="costPrice" type="number" placeholder="0.00" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salePrice">Sale Price</Label>
                <Input id="salePrice" type="number" placeholder="0.00" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input id="stock" type="number" placeholder="0" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
