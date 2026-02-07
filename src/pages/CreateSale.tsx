import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const mockProducts = [
  { id: "1", name: "Wireless Keyboard", price: 79.99 },
  { id: "2", name: "USB-C Hub", price: 49.99 },
  { id: "3", name: "Office Chair", price: 299.99 },
  { id: "4", name: "Desk Lamp", price: 45.99 },
  { id: "5", name: "Monitor Stand", price: 89.99 },
  { id: "6", name: "Webcam HD", price: 129.99 },
  { id: "7", name: "Mouse Pad XL", price: 24.99 },
  { id: "8", name: "Headphones Pro", price: 199.99 },
];

const mockCustomers = [
  { id: "1", name: "Acme Corporation" },
  { id: "2", name: "Tech Solutions Ltd" },
  { id: "3", name: "Global Trade Inc" },
  { id: "4", name: "Local Shop" },
  { id: "5", name: "StartUp Hub" },
];

export default function CreateSale() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const addProduct = (product: { id: string; name: string; price: number }) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setProductSearch(false);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeProduct(id);
      return;
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeProduct = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (!customer) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a customer",
      });
      return;
    }
    if (cart.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one product",
      });
      return;
    }

    toast({
      title: "Sale created",
      description: `Invoice generated for ${customer}`,
    });
    navigate("/sales");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/sales")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Sale</h1>
          <p className="text-muted-foreground">Create a new sales invoice</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Products</CardTitle>
              <Popover open={productSearch} onOpenChange={setProductSearch}>
                <PopoverTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {mockProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => addProduct(product)}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>{product.name}</span>
                              <span className="text-muted-foreground">
                                ${product.price}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No products added yet
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price} each
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <span className="w-20 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeProduct(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">${total.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit">Credit (Pay Later)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod !== "credit" && (
                  <div className="space-y-2">
                    <Label>Amount Paid</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                    />
                  </div>
                )}

                {amountPaid && Number(amountPaid) >= total && (
                  <div className="rounded-lg bg-success/10 p-3 text-center">
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className="text-xl font-bold text-success">
                      ${(Number(amountPaid) - total).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <Button className="w-full" onClick={handleSubmit}>
                Complete Sale
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
